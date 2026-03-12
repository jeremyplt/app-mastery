import { NextRequest, NextResponse } from "next/server";
import { PostHog } from "posthog-node";
import crypto from "crypto";
import { addBrevoContact } from "@/lib/brevo";

function getSkoolWebhookUrl() {
  return process.env.SKOOL_WEBHOOK_URL!;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");

  const secret = process.env.LS_WEBHOOK_SECRET;
  if (!secret || !signature) {
    console.error("Webhook missing secret or signature", { secret: !!secret, signature: !!signature });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
    console.error("Webhook signature mismatch", {
      digestStart: digest.toString("utf8").substring(0, 20),
      signatureStart: signature.substring(0, 20),
      digestLen: digest.length,
      sigLen: signatureBuffer.length,
    });
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

    // Add contact to Brevo + fire event to trigger automation
    try {
      await addBrevoContact(email, tag, "purchase_completed", {
        amount: attrs?.total ? Number(attrs.total) / 100 : undefined,
        currency: attrs?.currency?.toUpperCase() || "EUR",
        provider: "lemonsqueezy",
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
