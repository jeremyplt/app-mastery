import { NextRequest, NextResponse } from "next/server";
import { PostHog } from "posthog-node";
import crypto from "crypto";

// Brevo list IDs per plan
const BREVO_LIST_IDS: Record<string, number> = {
  essentiel: 6,
  complet: 7,
  vip: 8,
};

function getSkoolWebhookUrl() {
  return process.env.SKOOL_WEBHOOK_URL!;
}

function verifyWebhookSignature(
  rawBody: string,
  signature: string | null
): boolean {
  const secret = process.env.LS_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");

  if (digest.length !== signature.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(digest, "utf-8"),
    Buffer.from(signature, "utf-8")
  );
}

async function addBrevoContactToList(email: string, tag: string) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) return;

  const listId = BREVO_LIST_IDS[tag];

  try {
    // Step 1: Create or update contact
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        attributes: {
          APP_MASTERY_PLAN: tag,
        },
      }),
    });

    // Step 2: Add to list separately so the automation trigger fires
    if (listId) {
      await fetch(
        `https://api.brevo.com/v3/contacts/lists/${listId}/contacts/add`,
        {
          method: "POST",
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emails: [email] }),
        }
      );
    }

    console.log(
      `Brevo contact added: ${email}, list: ${listId}, tag: ${tag}`
    );
  } catch (err) {
    console.error("Brevo contact update failed:", err);
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") || req.headers.get("X-Signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("Webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload.meta?.event_name;

  if (eventName === "order_created") {
    const attrs = payload.data?.attributes;
    const email = attrs?.user_email;
    const plan = payload.meta?.custom_data?.plan || "essentiel";

    if (!email) {
      console.error("No email found in order:", payload.data?.id);
      return NextResponse.json({ received: true });
    }

    let tag = "essentiel";
    if (plan === "complet" || plan === "complet-3x") tag = "complet";
    if (plan === "vip" || plan === "vip-3x") tag = "vip";

    console.log(
      `Order created: ${email}, plan: ${plan}, tag: ${tag}, order: ${payload.data?.id}`
    );

    // Add contact to Brevo list (triggers automation)
    try {
      await addBrevoContactToList(email, tag);
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
        console.log(
          `Skool invite sent for ${email}: ${skoolRes.status}`
        );
      } catch (err) {
        console.error("Skool invite failed:", err);
      }
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
            ls_plan: plan,
            amount: attrs?.total ? Number(attrs.total) / 100 : undefined,
            currency: attrs?.currency?.toUpperCase() || "EUR",
          },
        });
        await ph.shutdown();
      } catch (err) {
        console.error("PostHog failed:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
