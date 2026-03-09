import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const SKOOL_WEBHOOK_URL = process.env.SKOOL_WEBHOOK_URL!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.customer_details?.email;
    const plan = session.metadata?.plan;

    if (!email) {
      console.error("No email found in checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    console.log(`Checkout completed: ${email}, plan: ${plan}`);

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const origin = req.headers.get("origin") || "https://jeremypitault.com";

    if (plan === "essentiel") {
      // Send welcome email with members area link
      if (BREVO_API_KEY) {
        try {
          await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "api-key": BREVO_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sender: { name: "App Mastery", email: "jeremy@jeremypitault.com" },
              to: [{ email }],
              subject: "Bienvenue dans App Mastery Essentiel !",
              htmlContent: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
                  <h2 style="color: #111; font-size: 20px;">Bienvenue dans App Mastery !</h2>
                  <p style="color: #555; font-size: 15px; line-height: 1.6;">
                    Ton achat a bien ete confirme. Tu peux maintenant acceder a tes cours.
                  </p>
                  <p style="color: #555; font-size: 15px; line-height: 1.6;">
                    Clique sur le bouton ci-dessous, entre l'email que tu as utilise pour ton achat, et tu recevras un lien de connexion.
                  </p>
                  <a href="${origin}/membres" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px;">
                    Acceder a mes cours
                  </a>
                  <p style="color: #999; font-size: 12px; margin-top: 24px;">
                    Garde cet email, tu pourras toujours retrouver le lien vers ton espace membre ici.
                  </p>
                </div>
              `,
            }),
          });
          console.log(`Welcome email sent to ${email}`);
        } catch (err) {
          console.error("Welcome email failed:", err);
        }
      }
    } else {
      // Send Skool invite for Complet and VIP plans
      try {
        const skoolRes = await fetch(
          `${SKOOL_WEBHOOK_URL}?email=${encodeURIComponent(email)}`
        );
        console.log(`Skool invite sent for ${email}: ${skoolRes.status}`);
      } catch (err) {
        console.error("Skool invite failed:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
