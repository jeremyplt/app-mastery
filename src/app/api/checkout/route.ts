import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

function getPriceId(plan: string): string | null {
  const map: Record<string, string | undefined> = {
    essentiel: process.env.STRIPE_PRICE_ESSENTIEL,
    complet: process.env.STRIPE_PRICE_COMPLET,
    "complet-3x": process.env.STRIPE_PRICE_COMPLET_3X,
    vip: process.env.STRIPE_PRICE_VIP,
    "vip-3x": process.env.STRIPE_PRICE_VIP_3X,
  };
  return map[plan] || null;
}

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();
    const priceId = getPriceId(plan);

    if (!plan || !priceId) {
      return NextResponse.json(
        { error: `Plan invalide: ${plan}` },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const isRecurring = plan.endsWith("-3x");
    const isEssentiel = plan === "essentiel";

    const successUrl = isEssentiel
      ? `${req.nextUrl.origin}/membres/merci?session_id={CHECKOUT_SESSION_ID}`
      : `${req.nextUrl.origin}/formation/merci?session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: `${req.nextUrl.origin}/formation#pricing`,
      allow_promotion_codes: true,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
