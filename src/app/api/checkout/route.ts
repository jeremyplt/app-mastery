import { NextRequest, NextResponse } from "next/server";

function getVariantId(plan: string): string | null {
  const map: Record<string, string | undefined> = {
    essentiel: process.env.LS_VARIANT_ESSENTIEL,
    complet: process.env.LS_VARIANT_COMPLET,
    "complet-3x": process.env.LS_VARIANT_COMPLET_3X,
    vip: process.env.LS_VARIANT_VIP,
    "vip-3x": process.env.LS_VARIANT_VIP_3X,
  };
  return map[plan] || null;
}

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();
    const variantId = getVariantId(plan);

    if (!plan || !variantId) {
      return NextResponse.json(
        { error: `Plan invalide: ${plan}` },
        { status: 400 }
      );
    }

    const isEssentiel = plan === "essentiel";

    const successUrl = isEssentiel
      ? `${req.nextUrl.origin}/membres/merci?order_id=[order_id]&email=[email]`
      : `${req.nextUrl.origin}/formation/merci?order_id=[order_id]&email=[email]`;

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
            checkout_data: {
              custom: {
                plan,
              },
            },
            product_options: {
              redirect_url: successUrl,
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: process.env.LS_STORE_ID,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId,
              },
            },
          },
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Lemon Squeezy checkout error:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Erreur lors de la création du checkout" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.data.attributes.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
