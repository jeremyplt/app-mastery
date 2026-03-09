import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const PLANS: Record<
  string,
  { priceId: string; paymentPriceId?: string }
> = {
  essentiel: {
    priceId: process.env.STRIPE_PRICE_ESSENTIEL!,
  },
  complet: {
    priceId: process.env.STRIPE_PRICE_COMPLET!,
  },
  "complet-3x": {
    priceId: process.env.STRIPE_PRICE_COMPLET_3X!,
  },
  vip: {
    priceId: process.env.STRIPE_PRICE_VIP!,
  },
  "vip-3x": {
    priceId: process.env.STRIPE_PRICE_VIP_3X!,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const { priceId } = PLANS[plan];
    const isRecurring = plan.endsWith("-3x");

    const isEssentiel = plan === "essentiel";
    const successUrl = isEssentiel
      ? `${req.nextUrl.origin}/membres?achat=ok`
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
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
