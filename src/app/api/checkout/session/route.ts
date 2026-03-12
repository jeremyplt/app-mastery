import { NextRequest, NextResponse } from "next/server";

const PLAN_LABELS: Record<string, string> = {
  essentiel: "Essentiel",
  complet: "Complet",
  "complet-3x": "Complet (3x)",
  vip: "VIP",
  "vip-3x": "VIP (3x)",
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
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    const data = await res.json();
    const attrs = data.data.attributes;

    const plan =
      attrs.first_order_item?.variant_name?.toLowerCase() || "essentiel";
    const planKey =
      Object.keys(PLAN_LABELS).find(
        (k) => k === plan || PLAN_LABELS[k]?.toLowerCase() === plan
      ) || "essentiel";

    return NextResponse.json({
      email: attrs.user_email,
      plan: PLAN_LABELS[planKey] || planKey,
      planKey,
      amount: attrs.total != null ? Number(attrs.total) / 100 : attrs.total_formatted ? parseFloat(attrs.total_formatted.replace(/[^0-9.,]/g, "").replace(",", ".")) : null,
      currency: attrs.currency?.toUpperCase() || "EUR",
    });
  } catch {
    return NextResponse.json(
      { error: "Commande introuvable" },
      { status: 404 }
    );
  }
}
