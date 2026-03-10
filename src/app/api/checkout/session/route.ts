import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

const PLAN_LABELS: Record<string, string> = {
  essentiel: "Essentiel",
  complet: "Complet",
  "complet-3x": "Complet (3x)",
  vip: "VIP",
  "vip-3x": "VIP (3x)",
};

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id manquant" },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const plan = session.metadata?.plan || "essentiel";
    const email =
      session.customer_email || session.customer_details?.email || null;
    const amount = session.amount_total ? session.amount_total / 100 : null;
    const currency = session.currency?.toUpperCase() || "EUR";

    return NextResponse.json({
      email,
      plan: PLAN_LABELS[plan] || plan,
      planKey: plan,
      amount,
      currency,
    });
  } catch {
    return NextResponse.json(
      { error: "Session introuvable" },
      { status: 404 }
    );
  }
}
