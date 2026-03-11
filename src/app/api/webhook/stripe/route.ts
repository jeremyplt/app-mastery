import { NextRequest, NextResponse } from "next/server";
import { PostHog } from "posthog-node";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

function getSkoolWebhookUrl() {
  return process.env.SKOOL_WEBHOOK_URL!;
}

// Brevo list IDs per plan
const BREVO_LIST_IDS: Record<string, number> = {
  essentiel: 6,
  complet: 7,
  vip: 8,
};

async function addBrevoContactToList(email: string, tag: string) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) return;

  const listId = BREVO_LIST_IDS[tag];

  try {
    // Step 1: Create or update contact (without listIds)
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        attributes: {
          APP_MASTERY_PLAN: tag,
        },
      }),
    });

    // Step 2: Add to list separately so the "Ajouté à une liste"
    // automation trigger fires in Brevo
    if (listId) {
      await fetch(
        `https://api.brevo.com/v3/contacts/lists/${listId}/contacts/add`,
        {
          method: "POST",
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emails: [email] }),
        },
      );
    }

    console.log(`Brevo contact added: ${email}, list: ${listId}, tag: ${tag}`);
  } catch (err) {
    console.error("Brevo contact update failed:", err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
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

    let tag = "essentiel";
    if (plan === "complet" || plan === "complet-3x") tag = "complet";
    if (plan === "vip" || plan === "vip-3x") tag = "vip";

    console.log(`Checkout completed: ${email}, plan: ${plan}, tag: ${tag}`);

    // Auto-cancel 3x subscriptions after 3 payments using a subscription schedule
    if (plan?.endsWith("-3x") && session.subscription) {
      try {
        const stripe = getStripe();
        const subscriptionId = session.subscription as string;

        // Convert the subscription into a schedule
        const schedule = await stripe.subscriptionSchedules.create({
          from_subscription: subscriptionId,
        });

        // Update the schedule: set end_behavior to cancel and fix phase to 3 months
        const phase = schedule.phases[0];
        await stripe.subscriptionSchedules.update(schedule.id, {
          end_behavior: "cancel",
          phases: [
            {
              items: phase.items.map((item) => ({
                price: typeof item.price === "string" ? item.price : item.price.id,
                quantity: item.quantity ?? 1,
              })),
              start_date: phase.start_date,
              end_date: phase.start_date + 3 * 30 * 24 * 60 * 60,
            },
          ],
        });

        console.log(`Subscription schedule ${schedule.id} created for ${subscriptionId} (3 payments then cancel)`);
      } catch (err) {
        console.error("Failed to create subscription schedule:", err);
      }
    }

    // Add contact to Brevo list (triggers automation)
    try {
      await addBrevoContactToList(email, tag);
      console.log(`Brevo done for ${email}`);
    } catch (err) {
      console.error("Brevo failed:", err);
    }

    // Send Skool invite for Complet and VIP plans
    if (tag !== "essentiel") {
      try {
        const skoolRes = await fetch(
          `${getSkoolWebhookUrl()}?email=${email}`,
          { method: "POST" }
        );
        console.log(`Skool invite sent for ${email}: ${skoolRes.status}`);
      } catch (err) {
        console.error("Skool invite failed:", err);
      }
    }

    // Track purchase in PostHog (non-blocking)
    if (process.env.POSTHOG_API_KEY) {
      try {
        const ph = new PostHog(process.env.POSTHOG_API_KEY, {
          host: "https://us.i.posthog.com",
        });
        ph.capture({
          distinctId: email,
          event: "purchase_completed",
          properties: {
            plan: tag,
            stripe_plan: plan,
            amount: session.amount_total ? session.amount_total / 100 : undefined,
            currency: session.currency,
          },
        });
        await ph.shutdown();
      } catch (err) {
        console.error("PostHog failed:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
