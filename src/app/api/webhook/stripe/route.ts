import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const SKOOL_WEBHOOK_URL = process.env.SKOOL_WEBHOOK_URL!;

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

    if (email) {
      try {
        const skoolRes = await fetch(
          `${SKOOL_WEBHOOK_URL}?email=${encodeURIComponent(email)}`
        );
        console.log(
          `Skool invite sent for ${email}: ${skoolRes.status}`
        );
      } catch (err) {
        console.error("Skool invite failed:", err);
      }
    } else {
      console.error("No email found in checkout session:", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
