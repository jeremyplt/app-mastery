import { NextRequest, NextResponse } from "next/server";

const PLAN_LABELS: Record<string, string> = {
  essentiel: "Essentiel",
  complet: "Complet",
  "complet-3x": "Complet (3x)",
  vip: "VIP",
  "vip-3x": "VIP (3x)",
};

// Map LS variant IDs to plan keys
const VARIANT_TO_PLAN: Record<string, string> = {
  [process.env.LS_VARIANT_ESSENTIEL || ""]: "essentiel",
  [process.env.LS_VARIANT_COMPLET || ""]: "complet",
  [process.env.LS_VARIANT_COMPLET_3X || ""]: "complet-3x",
  [process.env.LS_VARIANT_VIP || ""]: "vip",
  [process.env.LS_VARIANT_VIP_3X || ""]: "vip-3x",
};

// Map Stripe price IDs to plan keys
const STRIPE_PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_PRICE_ESSENTIEL || ""]: "essentiel",
  [process.env.STRIPE_PRICE_COMPLET || ""]: "complet",
  [process.env.STRIPE_PRICE_COMPLET_3X || ""]: "complet-3x",
  [process.env.STRIPE_PRICE_VIP || ""]: "vip",
  [process.env.STRIPE_PRICE_VIP_3X || ""]: "vip-3x",
};

async function fetchLsOrder(orderId: string) {
  const res = await fetch(
    `https://api.lemonsqueezy.com/v1/orders/${orderId}`,
    {
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: `Bearer ${process.env.LS_API_KEY}`,
      },
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const attrs = data.data.attributes;
  const variantId = String(attrs.first_order_item?.variant_id || "");
  const planKey = VARIANT_TO_PLAN[variantId] || "essentiel";

  return {
    email: attrs.user_email,
    plan: PLAN_LABELS[planKey] || planKey,
    planKey,
    amount: attrs.total != null ? attrs.total / 100 : null,
    currency: attrs.currency?.toUpperCase() || "EUR",
  };
}

async function fetchStripeSession(sessionId: string) {
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  const email = session.customer_email || session.customer_details?.email;
  const planFromMetadata = session.metadata?.plan;

  // Try to get plan from metadata first, then from price ID
  let planKey = planFromMetadata || "essentiel";
  if (!planFromMetadata && session.line_items?.data?.[0]?.price?.id) {
    const priceId = session.line_items.data[0].price.id;
    planKey = STRIPE_PRICE_TO_PLAN[priceId] || "essentiel";
  }

  return {
    email: email || null,
    plan: PLAN_LABELS[planKey] || planKey,
    planKey,
    amount: session.amount_total ? session.amount_total / 100 : null,
    currency: (session.currency || "eur").toUpperCase(),
  };
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order_id");
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!orderId && !sessionId) {
    return NextResponse.json(
      { error: "order_id ou session_id manquant" },
      { status: 400 }
    );
  }

  try {
    const result = orderId
      ? await fetchLsOrder(orderId)
      : await fetchStripeSession(sessionId!);

    if (!result) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Order fetch error:", err);
    return NextResponse.json(
      { error: "Commande introuvable" },
      { status: 404 }
    );
  }
}
