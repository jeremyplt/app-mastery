import { NextRequest, NextResponse } from "next/server";
import { sendMetaEvent, getClientInfo } from "@/lib/meta-capi";
import { getAdminClient } from "@/lib/supabase";

// Relay CAPI pour les événements déclenchés côté navigateur sans passage par
// une API route métier (ex : booking Calendly détecté via postMessage sur
// /appel/reserver). Le navigateur envoie le même event_id à fbq() : Meta
// déduplique. La CAPI ajoute IP + user-agent + PII hashée (meilleur EMQ) et
// survit aux adblockers.

// Liste blanche : cette route est publique, on n'accepte que les événements
// attendus pour éviter la pollution du dataset.
const ALLOWED_EVENTS = new Set(["Schedule"]);

export async function POST(req: NextRequest) {
  try {
    const { eventName, eventId, email, firstName, phone: bodyPhone, utmSource, fbp, fbc, eventSourceUrl } = await req.json();

    if (!ALLOWED_EVENTS.has(eventName) || !eventId) {
      return NextResponse.json({ error: "Événement invalide" }, { status: 400 });
    }

    // Téléphone : booste fortement l'Event Match Quality du Schedule.
    // 1. fourni par la page (ex : optinContact sur /conference/live)
    // 2. sinon lookup candidatures par email : le prospect l'a toujours donné
    //    à la candidature avant d'arriver sur /appel/reserver (best-effort).
    let phone: string | undefined =
      typeof bodyPhone === "string" && /^\+[1-9]\d{6,14}$/.test(bodyPhone.trim())
        ? bodyPhone.trim()
        : undefined;
    if (!phone && email) {
      try {
        const supabase = getAdminClient();
        const { data } = await supabase
          .from("candidatures")
          .select("phone")
          .eq("email", String(email).trim().toLowerCase())
          .order("created_at", { ascending: false })
          .limit(1);
        phone = data?.[0]?.phone || undefined;
      } catch {
        // Pas bloquant : l'événement part sans téléphone.
      }
    }

    await sendMetaEvent({
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl || "https://www.jeremypitault.com/",
      userData: {
        email: email || undefined,
        phone,
        firstName: firstName || undefined,
        fbp,
        fbc,
        ...getClientInfo(req),
      },
      customData: {
        content_name: "appel-decouverte",
        ...(utmSource ? { content_category: String(utmSource) } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
