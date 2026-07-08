"use client";

import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { generateEventId, metaTrackingFields, trackMeta } from "@/lib/meta-pixel";

const CALENDLY_BASE = "https://calendly.com/jeremypltpro/30min";

export default function ReserverPage() {
  return (
    <Suspense>
      <ReserverContent />
    </Suspense>
  );
}

function ReserverContent() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get("firstName") || "";
  const email = searchParams.get("email") || "";

  useEffect(() => {
    posthog.capture("appel_calendly_loaded", {
      has_prefill: Boolean(firstName && email),
    });
  }, [firstName, email]);

  // Capture le booking réel (Calendly poste un message à la prise de RDV).
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (
        e.origin === "https://calendly.com" &&
        e.data?.event === "calendly.event_scheduled"
      ) {
        posthog.capture("appel_booked", { email: email || undefined });

        // Meta : Schedule côté Pixel + relay CAPI serveur (même event_id,
        // Meta déduplique). Le webhook Calendly ne peut pas partager cet
        // event_id, donc tout part d'ici. Best-effort.
        const metaEventId = generateEventId();
        const meta = metaTrackingFields(metaEventId);
        trackMeta("Schedule", { content_name: "appel-decouverte" }, metaEventId);
        fetch("/api/meta-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "Schedule",
            eventId: metaEventId,
            email: email || undefined,
            firstName: firstName || undefined,
            fbp: meta.fbp,
            fbc: meta.fbc,
            eventSourceUrl: meta.eventSourceUrl,
          }),
        }).catch(() => {});
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [email, firstName]);

  const calendlyUrl = (() => {
    const params = new URLSearchParams({ hide_gdpr_banner: "1" });
    if (firstName) params.set("name", firstName);
    if (email) params.set("email", email);
    // UTM nativement supportés par Calendly : attribution jusqu'à la résa.
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    if (utmSource) params.set("utm_source", utmSource);
    if (utmMedium) params.set("utm_medium", utmMedium);
    if (utmCampaign) params.set("utm_campaign", utmCampaign);
    return `${CALENDLY_BASE}?${params.toString()}`;
  })();

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="flex min-h-screen flex-col items-center px-4 py-12 sm:py-16">
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-amber-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-medium tracking-tighter text-white text-balance">
              {firstName ? `${firstName}, ton appel n'est pas encore réservé.` : "Ton appel n'est pas encore réservé."}
            </h1>

            <p className="mt-4 text-lg text-gray-200 font-medium max-w-2xl mx-auto">
              Dernière étape : choisis ton créneau ci-dessous pour confirmer ton appel. Sans ça, rien n&apos;est réservé. On se voit ensuite en visio pendant 30 minutes pour faire le point sur ton projet et voir si on peut travailler ensemble.
            </p>
          </div>

          {/* Calendly embed */}
          <div className="mt-8 rounded-xl overflow-hidden border border-white/10 bg-white">
            <iframe
              src={calendlyUrl}
              width="100%"
              height="780"
              frameBorder="0"
              title="Réserver un appel découverte"
              className="w-full"
            />
          </div>

          <p className="mt-6 text-center text-sm text-gray-300 font-medium">
            Tu recevras une confirmation par email avec le lien de visio dès que ton créneau est validé.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
