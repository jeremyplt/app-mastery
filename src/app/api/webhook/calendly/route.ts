import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import {
  CALL_LEAD_COLUMNS,
  cancelReminders,
  hostForEventType,
  scheduleReminders,
  sendConfirmation,
  type CallLead,
} from "@/lib/call-reminders";

// Événement « Appel App Mastery » de Jeremy : appels avec les élèves (kick-off,
// clôture), à ne surtout pas traiter comme un appel découverte.
const STUDENT_EVENT_TYPE_URI = "https://api.calendly.com/event_types/d87fb821-a1fa-47ad-aa84-95c27cb38b26";

// Appel élève réservé ou annulé : met à jour la fiche (/admin/eleves). Le lien
// envoyé depuis la fiche porte utm_content=kickoff ou cloture ; sans lui, une
// première réservation est considérée comme le kick-off.
async function handleStudentCall(email: string, isBooking: boolean, startTime: string | undefined, utmContent: string | undefined) {
  const supabase = getAdminClient();
  const { data: student } = await supabase
    .from("students")
    .select("id, kickoff, kickoff_call_at, closing_call_at")
    .ilike("email", email)
    .maybeSingle();
  if (!student) {
    console.log(`Calendly appel élève : aucun élève avec l'email ${email}`);
    return;
  }
  const kind = utmContent === "cloture" ? "cloture" : utmContent === "kickoff" || !student.kickoff_call_at ? "kickoff" : null;
  const update: Record<string, unknown> = {};
  if (isBooking) {
    update.last_contact_at = new Date().toISOString();
    if (kind === "kickoff") {
      update.kickoff_call_at = startTime ?? null;
      update.kickoff = true;
    }
    if (kind === "cloture") update.closing_call_at = startTime ?? null;
  } else {
    // Annulation : on efface le créneau correspondant (un report renverra
    // aussitôt une nouvelle réservation).
    // Comparaison en dates : Calendly et la base n'écrivent pas l'heure pareil.
    const same = (a: string | null) => Boolean(a && startTime && new Date(a).getTime() === new Date(startTime).getTime());
    if (same(student.kickoff_call_at)) update.kickoff_call_at = null;
    if (same(student.closing_call_at)) update.closing_call_at = null;
  }
  if (Object.keys(update).length) await supabase.from("students").update(update).eq("id", student.id);
  console.log(`Calendly appel élève ${isBooking ? "réservé" : "annulé"} (${kind ?? "autre"}) pour ${email}`);
}

// Webhook Calendly (scope organisation : couvre les calendriers
// jeremypltpro et masteryapp-jeremy). À la réservation : CRM + Brevo +
// PostHog, puis séquence B (email de confirmation tout de suite, rappels
// programmés). À l'annulation : CRM + Brevo, rappels annulés.
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("Calendly webhook payload:", JSON.stringify(payload, null, 2));

    const event = payload.event;
    if (event !== "invitee.created" && event !== "invitee.canceled") {
      console.log("Calendly webhook: ignored event type:", event);
      return NextResponse.json({ received: true });
    }

    const invitee = payload.payload ?? {};
    const scheduled = invitee.scheduled_event ?? {};
    const email: string | undefined = invitee.email;
    const name: string | undefined = invitee.name;
    const startTime: string | undefined = scheduled.start_time || invitee.calendar_event?.start_time;
    const eventTypeUri: string | undefined = scheduled.event_type;
    const rescheduleUrl: string | undefined = invitee.reschedule_url;
    const joinUrl: string | undefined = scheduled.location?.join_url;
    // Report Calendly : un invitee.canceled (rescheduled=true) puis un
    // invitee.created (rescheduled=true) sur le nouveau créneau.
    const rescheduled: boolean = invitee.rescheduled === true;

    if (!email) {
      console.error("Calendly webhook: no email in payload");
      return NextResponse.json({ received: true });
    }

    const normalizedEmail = email.toLowerCase();

    if (eventTypeUri === STUDENT_EVENT_TYPE_URI) {
      try {
        await handleStudentCall(normalizedEmail, event === "invitee.created", startTime, invitee.tracking?.utm_content ?? undefined);
      } catch (err) {
        console.error("Calendly appel élève :", err);
      }
      return NextResponse.json({ received: true });
    }
    const firstName = name ? name.split(" ")[0] : undefined;
    const isBooking = event === "invitee.created";
    const host = hostForEventType(eventTypeUri);

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY is not configured");
      return NextResponse.json({ received: true });
    }

    // Attributs Brevo selon le type d'événement
    const attributes = isBooking
      ? {
          ...(firstName && { FIRSTNAME: firstName }),
          CALL_BOOKED: true,
          CALL_CANCELED: false,
          ...(startTime && { CALL_DATE: startTime }),
          CALL_HOST: host,
          ...(rescheduleUrl && { CALL_RESCHEDULE_URL: rescheduleUrl }),
          ETAPE_FUNNEL: "call-book",
        }
      : {
          CALL_BOOKED: false,
          CALL_CANCELED: true,
          ETAPE_FUNNEL: "call-cancel",
        };

    console.log(`Calendly ${isBooking ? "booking" : "cancellation"}: ${email} (${name}) host=${host} rescheduled=${rescheduled}`);

    // CRM + séquence B. Best-effort : le webhook ne doit jamais échouer
    // à cause du CRM ou de Brevo.
    try {
      const supabase = getAdminClient();

      // Toutes les fiches de ce contact (une par source) suivent l'état
      // de réservation ; la séquence B ne tourne que sur la plus récente.
      const { data: rows, error: selectError } = await supabase
        .from("crm_leads")
        .select(CALL_LEAD_COLUMNS)
        .eq("email", normalizedEmail)
        .order("created_at", { ascending: false });
      if (selectError) throw selectError;

      let lead = (rows?.[0] as CallLead | undefined) ?? null;

      if (isBooking) {
        const bookingFields = {
          call_booked: true,
          call_booked_at: startTime || new Date().toISOString(),
          call_booked_auto: true,
        };

        if (lead) {
          // Réservations précédentes : on annule les rappels encore
          // programmés avant de poser le nouveau créneau.
          await cancelReminders(lead);
          await supabase.from("crm_leads").update(bookingFields).eq("email", normalizedEmail);
          const { data: updated, error: updateError } = await supabase
            .from("crm_leads")
            .update({
              ...(firstName && !lead.first_name && { first_name: firstName }),
              call_host: host,
              call_event_uri: eventTypeUri ?? null,
              call_reschedule_url: rescheduleUrl ?? null,
              call_join_url: joinUrl ?? null,
            })
            .eq("id", lead.id)
            .select(CALL_LEAD_COLUMNS)
            .single();
          if (updateError) throw updateError;
          lead = updated as CallLead;
        } else {
          // Contact inconnu du CRM (réservé sans passer par l'optin) :
          // fiche créée avec la source "calendly".
          const { data: inserted, error: insertError } = await supabase
            .from("crm_leads")
            .insert({
              email: normalizedEmail,
              source: "calendly",
              first_name: firstName ?? null,
              ...bookingFields,
              call_host: host,
              call_event_uri: eventTypeUri ?? null,
              call_reschedule_url: rescheduleUrl ?? null,
              call_join_url: joinUrl ?? null,
            })
            .select(CALL_LEAD_COLUMNS)
            .single();
          if (insertError) throw insertError;
          lead = inserted as CallLead;
        }
        console.log(`CRM updated for ${email}: call_booked=true`);

        // Séquence B : confirmation (sauf report, le contact l'a déjà
        // reçue), puis rappels si l'appel est dans moins de 72 h.
        if (!rescheduled) await sendConfirmation(lead);
        const planned = await scheduleReminders(lead);
        console.log(`Séquence B pour ${email}:`, JSON.stringify(planned));
      } else {
        if (lead) {
          await cancelReminders(lead);
          await supabase
            .from("crm_leads")
            .update({
              call_booked: false,
              call_booked_at: null,
              // Vraie annulation : une future réservation recevra à
              // nouveau l'email de confirmation. Report : on garde.
              ...(rescheduled ? {} : { call_mail_confirm_at: null }),
            })
            .eq("email", normalizedEmail);
          console.log(`CRM updated for ${email}: call_booked=false`);
        }
      }
    } catch (err) {
      console.error("CRM / séquence B error:", err);
    }

    // PostHog server-side
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
            host,
            rescheduled,
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
