"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { generateEventId, metaTrackingFields, trackMeta } from "@/lib/meta-pixel";
import { loadOptinContact, type OptinContact } from "@/lib/optin-contact";

// Base de secours si l'assignation échoue (DB down) : ne jamais casser la résa.
const FALLBACK_BASE = "https://calendly.com/jeremypltpro/30min";

// Page de réservation universelle : calendrier Calendly plein écran avec
// répartition automatique entre les calendriers (voir /admin/calendrier).
// À utiliser partout à la place des liens Calendly directs. Prefill possible
// via query params : ?firstName=...&email=...&phone=...&utm_source=...
export default function RdvPage() {
  return (
    <Suspense>
      <RdvContent />
    </Suspense>
  );
}

function RdvContent() {
  const searchParams = useSearchParams();
  const [contact, setContact] = useState<OptinContact | null>(null);
  const [mounted, setMounted] = useState(false);
  // Base Calendly assignée côté serveur selon la répartition % (admin).
  const [calendarBase, setCalendarBase] = useState<string | null>(null);

  // Prefill : query params prioritaires, sinon contact de l'optin (localStorage).
  const firstName =
    searchParams.get("firstName") || searchParams.get("name") || contact?.firstName || "";
  const email = searchParams.get("email") || contact?.email || "";
  const phone = searchParams.get("phone") || contact?.phone || "";

  useEffect(() => {
    setContact(loadOptinContact());
    setMounted(true);
  }, []);

  // Assigne un calendrier (une fois par visite) et incrémente son compteur.
  useEffect(() => {
    fetch("/api/calendar/assign", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setCalendarBase(d.calendlyBase || FALLBACK_BASE))
      .catch(() => setCalendarBase(FALLBACK_BASE));
  }, []);

  // Capture le booking réel (Calendly poste un message à la prise de RDV).
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (
        e.origin === "https://calendly.com" &&
        e.data?.event === "calendly.event_scheduled"
      ) {
        posthog.capture("appel_booked", { email: email || undefined });

        // Meta : Schedule côté Pixel + relay CAPI serveur (même event_id).
        const utmSource = searchParams.get("utm_source") || "direct";
        const metaEventId = generateEventId();
        const meta = metaTrackingFields(metaEventId);
        trackMeta(
          "Schedule",
          { content_name: "appel-decouverte", content_category: utmSource },
          metaEventId,
        );
        fetch("/api/meta-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "Schedule",
            eventId: metaEventId,
            email: email || undefined,
            firstName: firstName || undefined,
            utmSource,
            fbp: meta.fbp,
            fbc: meta.fbc,
            eventSourceUrl: meta.eventSourceUrl,
          }),
        }).catch(() => {});
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [email, firstName, searchParams]);

  const calendlyUrl = (() => {
    // embed_domain + embed_type sont REQUIS pour recevoir les postMessages
    // (calendly.event_scheduled) et donc tracker les bookings.
    const params = new URLSearchParams({
      hide_gdpr_banner: "1",
      embed_domain: "www.jeremypitault.com",
      embed_type: "Inline",
    });
    if (firstName) params.set("name", firstName);
    if (email) params.set("email", email);
    // a1 = question custom "Numéro de téléphone" (position 0), présente sur
    // les deux calendriers.
    if (phone) params.set("a1", phone);
    // UTM nativement supportés par Calendly : attribution jusqu'à la résa.
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    if (utmSource) params.set("utm_source", utmSource);
    if (utmMedium) params.set("utm_medium", utmMedium);
    if (utmCampaign) params.set("utm_campaign", utmCampaign);
    return `${calendarBase ?? FALLBACK_BASE}?${params.toString()}`;
  })();

  return (
    <div className="h-[100dvh] w-screen bg-white">
      {mounted && calendarBase && (
        <iframe
          src={calendlyUrl}
          title="Réserver un appel"
          className="h-full w-full border-0"
        />
      )}
    </div>
  );
}
