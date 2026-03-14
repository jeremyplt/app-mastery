import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId manquant" }, { status: 400 });
    }

    const base = getPayPalBaseUrl();
    const accessToken = await getPayPalAccessToken();

    // Capture the order
    const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      // Order might already be captured (COMPLETED status)
      if (data.details?.[0]?.issue === "ORDER_ALREADY_CAPTURED") {
        return NextResponse.json({ status: "COMPLETED", alreadyCaptured: true });
      }
      console.error("PayPal capture error:", JSON.stringify(data));
      return NextResponse.json({ error: "Erreur lors de la capture" }, { status: 500 });
    }

    return NextResponse.json({
      status: data.status,
      orderId: data.id,
    });
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur PayPal" },
      { status: 500 }
    );
  }
}
