import { NextRequest, NextResponse } from "next/server";
import { PostHog } from "posthog-node";
import { addBrevoContact, addContactToBrevoList, SKOOL_MEMBERS_LIST_ID } from "@/lib/brevo";

function getSkoolWebhookUrl() {
  return process.env.SKOOL_WEBHOOK_URL!;
}

function getPayPalBaseUrl(): string {
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function verifyPayPalWebhook(
  req: NextRequest,
  rawBody: string
): Promise<boolean> {
  const base = getPayPalBaseUrl();
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  // Get access token
  const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) return false;

  // Verify webhook signature via PayPal API
  const verifyRes = await fetch(
    `${base}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: req.headers.get("paypal-auth-algo"),
        cert_url: req.headers.get("paypal-cert-url"),
        transmission_id: req.headers.get("paypal-transmission-id"),
        transmission_sig: req.headers.get("paypal-transmission-sig"),
        transmission_time: req.headers.get("paypal-transmission-time"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(rawBody),
      }),
    }
  );

  const verifyData = await verifyRes.json();
  return verifyData.verification_status === "SUCCESS";
}

async function handlePurchase(email: string, plan: string, amount?: number, currency?: string) {
  let tag = "essentiel";
  if (plan === "complet" || plan === "complet-3x") tag = "complet";
  if (plan === "vip" || plan === "vip-3x") tag = "vip";

  console.log(`PayPal purchase: ${email}, plan: ${plan}, tag: ${tag}`);

  // Add contact to Brevo + fire event
  try {
    await addBrevoContact(email, tag, "purchase_completed", {
      amount,
      currency: currency || "EUR",
      provider: "paypal",
    });
    console.log(`Brevo done for ${email}`);
  } catch (err) {
    console.error("Brevo failed:", err);
  }

  // Send Skool invite for Complet and VIP plans
  if (tag !== "essentiel") {
    try {
      const skoolRes = await fetch(
        `${getSkoolWebhookUrl()}?email=${email}`,
        { method: "POST" }
      );
      console.log(`Skool invite sent for ${email}: ${skoolRes.status}`);
    } catch (err) {
      console.error("Skool invite failed:", err);
    }

    // Tenir à jour la liste Brevo "Skool Members" avec chaque nouvel élève.
    await addContactToBrevoList(email, SKOOL_MEMBERS_LIST_ID);
  }

  // Track purchase in PostHog
  if (process.env.POSTHOG_API_KEY) {
    try {
      const ph = new PostHog(process.env.POSTHOG_API_KEY, {
        host: "https://us.i.posthog.com",
      });
      ph.capture({
        distinctId: email,
        event: "purchase_completed",
        properties: {
          plan: tag,
          paypal_plan: plan,
          amount,
          currency: currency || "EUR",
        },
      });
      await ph.shutdown();
    } catch (err) {
      console.error("PostHog failed:", err);
    }
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify webhook signature
  const isValid = await verifyPayPalWebhook(req, rawBody);
  if (!isValid) {
    console.error("PayPal webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const eventType = payload.event_type;

  // Payment capture completed (PAYMENT.CAPTURE.COMPLETED)
  // Also handle CHECKOUT.ORDER.COMPLETED as fallback
  if (
    eventType === "PAYMENT.CAPTURE.COMPLETED" ||
    eventType === "CHECKOUT.ORDER.COMPLETED"
  ) {
    const resource = payload.resource;

    let email: string | undefined;
    let plan = "essentiel";
    let amount: number | undefined;
    let currency = "EUR";

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      // PAYMENT.CAPTURE.COMPLETED: resource is the capture object
      // Email is NOT in the capture, we need to fetch the order
      plan = resource?.custom_id || "essentiel";
      amount = resource?.amount?.value
        ? parseFloat(resource.amount.value)
        : undefined;
      currency = resource?.amount?.currency_code || "EUR";

      // Extract order ID from the capture's supplementary_data or links
      const orderLink = resource?.supplementary_data?.related_ids?.order_id
        || resource?.links?.find((l: { rel: string }) => l.rel === "up")?.href?.split("/").pop();

      if (orderLink) {
        try {
          const base = getPayPalBaseUrl();
          const auth = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString("base64");
          const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
          });
          const tokenData = await tokenRes.json();

          const orderRes = await fetch(`${base}/v2/checkout/orders/${orderLink}`, {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "Content-Type": "application/json",
            },
          });
          const orderData = await orderRes.json();
          email =
            orderData.payer?.email_address ||
            orderData.payment_source?.paypal?.email_address;
          plan = orderData.purchase_units?.[0]?.custom_id || plan;
          console.log("PayPal order lookup:", orderLink, "email:", email, "plan:", plan);
        } catch (err) {
          console.error("PayPal order lookup failed:", err);
        }
      }

      // Fallback: try direct fields on resource
      if (!email) {
        email = resource?.payer?.email_address;
      }
    } else {
      // CHECKOUT.ORDER.COMPLETED structure
      const purchaseUnit = resource?.purchase_units?.[0];
      email =
        resource?.payer?.email_address ||
        resource?.payment_source?.paypal?.email_address;
      plan = purchaseUnit?.custom_id || "essentiel";
      amount = purchaseUnit?.amount?.value
        ? parseFloat(purchaseUnit.amount.value)
        : undefined;
      currency = purchaseUnit?.amount?.currency_code || "EUR";
    }

    if (!email) {
      console.error("No email found in PayPal webhook:", resource?.id);
      return NextResponse.json({ received: true });
    }

    await handlePurchase(email, plan, amount, currency);
  }

  return NextResponse.json({ received: true });
}
