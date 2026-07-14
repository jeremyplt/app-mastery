import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Log le payload complet pour debug
    console.log("Calendly webhook payload:", JSON.stringify(payload, null, 2));

    const event = payload.event;

    if (event !== "invitee.created" && event !== "invitee.canceled") {
      console.log("Calendly webhook: ignored event type:", event);
      return NextResponse.json({ received: true });
    }

    // Calendly v2 API: les données sont dans payload
    const email = payload.payload?.email;
    const name = payload.payload?.name;
    const startTime = payload.payload?.scheduled_event?.start_time
      || payload.payload?.calendar_event?.start_time;

    if (!email) {
      console.error("Calendly webhook: no email in payload");
      return NextResponse.json({ received: true });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY is not configured");
      return NextResponse.json({ received: true });
    }

    // Attributs selon le type d'événement
    const isBooking = event === "invitee.created";
    const attributes = isBooking
      ? {
          ...(name && { FIRSTNAME: name.split(" ")[0] }),
          CALL_BOOKED: true,
          CALL_CANCELED: false,
          ...(startTime && { CALL_DATE: startTime }),
          ETAPE_FUNNEL: "call-book",
        }
      : {
          CALL_BOOKED: false,
          CALL_CANCELED: true,
          ETAPE_FUNNEL: "call-cancel",
        };

    console.log(`Calendly ${isBooking ? "booking" : "cancellation"}: ${email} (${name})`);

    // Mise à jour automatique du CRM (leads VSL et Plan d'action).
    // Best-effort : le webhook ne doit jamais échouer à cause du CRM.
    try {
      const supabase = getAdminClient();
      const update = isBooking
        ? {
            call_booked: true,
            call_booked_at: startTime || new Date().toISOString(),
            call_booked_auto: true,
          }
        : { call_booked: false, call_booked_at: null };
      const { error: crmError } = await supabase
        .from("crm_leads")
        .update(update)
        .eq("email", email.toLowerCase());
      if (crmError) {
        console.error("CRM call_booked update error:", crmError.message);
      } else {
        console.log(`CRM updated for ${email}: call_booked=${isBooking}`);
      }
    } catch (err) {
      console.error("CRM call_booked update error:", err);
    }

    // Send event to PostHog server-side
    const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (POSTHOG_KEY) {
      await fetch("https://us.i.posthog.com/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: POSTHOG_KEY,
          event: isBooking ? "calendly_booked" : "calendly_canceled",
          distinct_id: email,
          properties: {
            email,
            name: name || undefined,
            start_time: startTime || undefined,
          },
        }),
      }).catch((err) => console.error("PostHog capture error:", err));
    }

    const updateRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        attributes,
      }),
    });

    if (!updateRes.ok) {
      const data = await updateRes.json();
      console.error("Brevo update contact error:", data);
    } else {
      console.log(`Brevo contact updated: ${email} (${isBooking ? "CALL_BOOKED" : "CALL_CANCELED"})`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Calendly webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
