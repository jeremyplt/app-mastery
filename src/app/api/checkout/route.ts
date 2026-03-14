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
    cancel_url: `${origin}/formation#pricing`,
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

// ─── PayPal ────────────────────────────────────────────────────

function getPayPalBaseUrl(): string {
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken(): Promise<string> {
  const base = getPayPalBaseUrl();
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  if (!res.ok) throw new Error("Impossible d'obtenir le token PayPal");
  return data.access_token;
}

// PayPal prices: all plans are one-time payments
// For 3x plans, PayPal offers "Pay in 4" automatically at checkout
const PAYPAL_PRICES: Record<string, { amount: string; currency: string; label: string }> = {
  essentiel: { amount: "497.00", currency: "EUR", label: "Essentiel" },
  complet: { amount: "997.00", currency: "EUR", label: "Complet" },
  "complet-3x": { amount: "997.00", currency: "EUR", label: "Complet" },
  vip: { amount: "2997.00", currency: "EUR", label: "VIP" },
  "vip-3x": { amount: "2997.00", currency: "EUR", label: "VIP" },
};

async function createPayPalCheckout(plan: string, origin: string): Promise<string> {
  const price = PAYPAL_PRICES[plan];
  if (!price) throw new Error(`Plan PayPal invalide: ${plan}`);

  // Normalize plan key (3x plans become one-time at same price)
  const basePlan = plan.replace("-3x", "");
  const isEssentiel = basePlan === "essentiel";
  const accessToken = await getPayPalAccessToken();
  const base = getPayPalBaseUrl();

  const successBase = isEssentiel
    ? `${origin}/membres/merci`
    : `${origin}/formation/merci`;
  const cancelUrl = `${origin}/formation`;

  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: price.currency, value: price.amount },
          description: `App Mastery - ${price.label}`,
          custom_id: basePlan,
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "App Mastery",
            locale: "fr-FR",
            user_action: "PAY_NOW",
            return_url: `${successBase}?paypal_order_id=pending`,
            cancel_url: cancelUrl,
          },
        },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("PayPal order error:", JSON.stringify(data));
    throw new Error("Erreur PayPal");
  }

  const approveLink = data.links?.find((l: { rel: string }) => l.rel === "payer-action");
  if (!approveLink) throw new Error("PayPal n'a pas retourné de lien de paiement");
  return approveLink.href;
}

// ─── Router ─────────────────────────────────────────────────────

const CHECKOUT_HANDLERS: Record<PaymentProvider, (plan: string, origin: string) => Promise<string> | string> = {
  lemonsqueezy: createLsCheckout,
  stripe: createStripeCheckout,
  gumroad: (plan: string) => createGumroadCheckout(plan),
  paypal: createPayPalCheckout,
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
