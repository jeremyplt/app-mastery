import { NextRequest, NextResponse } from "next/server";
import { getActiveProvider, PaymentProvider } from "@/lib/payment-provider";

// ─── LemonSqueezy ───────────────────────────────────────────────

function getLsVariantId(plan: string): string | null {
  const map: Record<string, string | undefined> = {
    essentiel: process.env.LS_VARIANT_ESSENTIEL,
    complet: process.env.LS_VARIANT_COMPLET,
    "complet-3x": process.env.LS_VARIANT_COMPLET_3X,
    vip: process.env.LS_VARIANT_VIP,
    "vip-3x": process.env.LS_VARIANT_VIP_3X,
  };
  return map[plan] || null;
}

async function createLsCheckout(plan: string, origin: string): Promise<string> {
  const variantId = getLsVariantId(plan);
  if (!variantId) throw new Error(`Plan LemonSqueezy invalide: ${plan}`);

  const isEssentiel = plan === "essentiel";
  const successUrl = isEssentiel
    ? `${origin}/membres/merci?order_id=[order_id]&email=[email]`
    : `${origin}/formation/merci?order_id=[order_id]&email=[email]`;

  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${process.env.LS_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: { custom: { plan } },
          product_options: { redirect_url: successUrl },
        },
        relationships: {
          store: { data: { type: "stores", id: process.env.LS_STORE_ID } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("LemonSqueezy checkout error:", JSON.stringify(data));
    throw new Error("Erreur LemonSqueezy");
  }

  return data.data.attributes.url;
}

// ─── Stripe ─────────────────────────────────────────────────────

function getStripePriceId(plan: string): string | null {
  const map: Record<string, string | undefined> = {
    essentiel: process.env.STRIPE_PRICE_ESSENTIEL,
    complet: process.env.STRIPE_PRICE_COMPLET,
    "complet-3x": process.env.STRIPE_PRICE_COMPLET_3X,
    vip: process.env.STRIPE_PRICE_VIP,
    "vip-3x": process.env.STRIPE_PRICE_VIP_3X,
  };
  return map[plan] || null;
}

async function createStripeCheckout(plan: string, origin: string): Promise<string> {
  const priceId = getStripePriceId(plan);
  if (!priceId) throw new Error(`Plan Stripe invalide: ${plan}`);

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });

  const isEssentiel = plan === "essentiel";
  const is3x = plan.endsWith("-3x");

  const session = await stripe.checkout.sessions.create({
    mode: is3x ? "subscription" : "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: isEssentiel
      ? `${origin}/membres/merci?session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/formation/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#pricing`,
    metadata: { plan },
    allow_promotion_codes: true,
    ...(is3x && {
      custom_text: {
        submit: {
          message:
            "Les prélèvements s'arrêtent automatiquement après 3 mois, sans action nécessaire de votre part.",
        },
      },
    }),
  });

  if (!session.url) throw new Error("Stripe n'a pas retourné d'URL");
  return session.url;
}

// ─── Gumroad ────────────────────────────────────────────────────

function getGumroadUrl(plan: string): string | null {
  const map: Record<string, string | undefined> = {
    essentiel: process.env.GUMROAD_URL_ESSENTIEL,
    complet: process.env.GUMROAD_URL_COMPLET,
    "complet-3x": process.env.GUMROAD_URL_COMPLET_3X,
    vip: process.env.GUMROAD_URL_VIP,
    "vip-3x": process.env.GUMROAD_URL_VIP_3X,
  };
  return map[plan] || null;
}

function createGumroadCheckout(plan: string): string {
  const url = getGumroadUrl(plan);
  if (!url) throw new Error(`Plan Gumroad invalide: ${plan}`);
  return url;
}

// ─── Router ─────────────────────────────────────────────────────

const CHECKOUT_HANDLERS: Record<PaymentProvider, (plan: string, origin: string) => Promise<string> | string> = {
  lemonsqueezy: createLsCheckout,
  stripe: createStripeCheckout,
  gumroad: (plan: string) => createGumroadCheckout(plan),
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan) {
      return NextResponse.json({ error: "Plan manquant" }, { status: 400 });
    }

    const provider = await getActiveProvider();
    const handler = CHECKOUT_HANDLERS[provider];
    const origin = req.nextUrl.origin;

    const url = await handler(plan, origin);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur lors du checkout" },
      { status: 500 }
    );
  }
}
