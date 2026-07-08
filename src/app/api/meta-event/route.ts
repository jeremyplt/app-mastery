import { NextRequest, NextResponse } from "next/server";
import { sendMetaEvent, getClientInfo } from "@/lib/meta-capi";

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
    const { eventName, eventId, email, firstName, fbp, fbc, eventSourceUrl } = await req.json();

    if (!ALLOWED_EVENTS.has(eventName) || !eventId) {
      return NextResponse.json({ error: "Événement invalide" }, { status: 400 });
    }

    const { clientIp, userAgent } = getClientInfo(req);

    await sendMetaEvent({
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl || "https://www.jeremypitault.com/",
      userData: {
        email: email || undefined,
        firstName: firstName || undefined,
        fbp,
        fbc,
        clientIp,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
