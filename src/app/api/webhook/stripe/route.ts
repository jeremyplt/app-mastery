import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const SKOOL_WEBHOOK_URL = process.env.SKOOL_WEBHOOK_URL!;

async function addBrevoContactWithTag(email: string, tag: string) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) return;

  try {
    // Create or update contact with tag
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
          PLAN: tag,
        },
      }),
    });

    // Also add tag via the events endpoint for automation triggers
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "PUT",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: {
          PLAN: tag,
        },
      }),
    });

    console.log(`Brevo contact updated: ${email}, tag: ${tag}`);
  } catch (err) {
    console.error("Brevo contact update failed:", err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.customer_details?.email;
    const plan = session.metadata?.plan;

    if (!email) {
      console.error("No email found in checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    // Determine the tag based on plan
    let tag = "essentiel";
    if (plan === "complet" || plan === "complet-3x") tag = "complet";
    if (plan === "vip" || plan === "vip-3x") tag = "vip";

    console.log(`Checkout completed: ${email}, plan: ${plan}, tag: ${tag}`);

    // Add contact to Brevo with tag (triggers automation)
    await addBrevoContactWithTag(email, tag);

    // Send Skool invite for Complet and VIP plans
    if (tag !== "essentiel") {
      try {
        const skoolRes = await fetch(
          `${SKOOL_WEBHOOK_URL}?email=${encodeURIComponent(email)}`
        );
        console.log(`Skool invite sent for ${email}: ${skoolRes.status}`);
      } catch (err) {
        console.error("Skool invite failed:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
