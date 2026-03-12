import { NextRequest, NextResponse } from "next/server";

const PLAN_LABELS: Record<string, string> = {
  essentiel: "Essentiel",
  complet: "Complet",
  "complet-3x": "Complet (3x)",
  vip: "VIP",
  "vip-3x": "VIP (3x)",
};

// Map variant IDs to plan keys
const VARIANT_TO_PLAN: Record<string, string> = {
  [process.env.LS_VARIANT_ESSENTIEL || ""]: "essentiel",
  [process.env.LS_VARIANT_COMPLET || ""]: "complet",
  [process.env.LS_VARIANT_COMPLET_3X || ""]: "complet-3x",
  [process.env.LS_VARIANT_VIP || ""]: "vip",
  [process.env.LS_VARIANT_VIP_3X || ""]: "vip-3x",
};

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json(
      { error: "order_id manquant" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://api.lemonsqueezy.com/v1/orders/${orderId}`,
      {
        headers: {
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${process.env.LS_API_KEY}`,
        },
      }
    );

    if (!res.ok) {
      console.error("LS order fetch failed:", res.status);
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    const data = await res.json();
    const attrs = data.data.attributes;

    const variantId = String(attrs.first_order_item?.variant_id || "");
    const planKey = VARIANT_TO_PLAN[variantId] || "essentiel";

    return NextResponse.json({
      email: attrs.user_email,
      plan: PLAN_LABELS[planKey] || planKey,
      planKey,
      amount: attrs.total != null ? attrs.total / 100 : null,
      currency: attrs.currency?.toUpperCase() || "EUR",
    });
  } catch (err) {
    console.error("LS order fetch error:", err);
    return NextResponse.json(
      { error: "Commande introuvable" },
      { status: 404 }
    );
  }
}
