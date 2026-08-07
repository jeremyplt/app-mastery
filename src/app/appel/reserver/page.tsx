"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdDisclaimer from "@/components/AdDisclaimer";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { generateEventId, metaTrackingFields, trackMeta } from "@/lib/meta-pixel";
import { loadOptinContact, type OptinContact } from "@/lib/optin-contact";

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
  // Contact de l'optin (localStorage) : fallback quand les query params sont
  // absents, et seule source pour le téléphone. Chargé après le mount pour
  // éviter un mismatch d'hydratation (localStorage n'existe pas côté serveur).
  const [contact, setContact] = useState<OptinContact | null>(null);
  const [mounted, setMounted] = useState(false);
  // Base Calendly assignée côté serveur selon la répartition % (admin).
  const [calendarBase, setCalendarBase] = useState<string | null>(null);
  const firstName = searchParams.get("firstName") || contact?.firstName || "";
  const email = searchParams.get("email") || contact?.email || "";
  const phone = contact?.phone || "";

  useEffect(() => {
    setContact(loadOptinContact());
    setMounted(true);
  }, []);

  // Assigne un calendrier (une fois par visite) et incrémente son compteur.
  useEffect(() => {
    fetch("/api/calendar/assign", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setCalendarBase(d.calendlyBase || CALENDLY_BASE))
      .catch(() => setCalendarBase(CALENDLY_BASE));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    posthog.capture("appel_calendly_loaded", {
      has_prefill: Boolean(firstName && email),
      has_phone_prefill: Boolean(phone),
    });
  }, [mounted, firstName, email, phone]);

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
        // content_category = utm_source pour segmenter les bookings par
        // origine (vsl-conference, landing, email...) dans Events Manager.
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
    // embed_domain + embed_type sont REQUIS pour que Calendly envoie les
    // postMessages (calendly.event_scheduled) à la page parente. Sans eux,
    // aucun événement de booking ne remonte (ni Meta Schedule ni PostHog).
    const params = new URLSearchParams({
      hide_gdpr_banner: "1",
      embed_domain: "www.jeremypitault.com",
      embed_type: "Inline",
    });
    if (firstName) params.set("name", firstName);
    if (email) params.set("email", email);
    // a1 = question custom "Numéro de téléphone" (position 0) de
    // jeremypltpro/30min : Calendly pré-remplit le champ avec l'E.164.
    if (phone) params.set("a1", phone);
    // UTM nativement supportés par Calendly : attribution jusqu'à la résa.
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    if (utmSource) params.set("utm_source", utmSource);
    if (utmMedium) params.set("utm_medium", utmMedium);
    if (utmCampaign) params.set("utm_campaign", utmCampaign);
    return `${calendarBase ?? CALENDLY_BASE}?${params.toString()}`;
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

          {/* Calendly embed : monté seulement une fois le contact localStorage
              chargé, sinon l'iframe se charge sans préremplissage puis se
              recharge avec (double chargement visible). */}
          <div className="mt-8 rounded-xl overflow-hidden border border-white/10 bg-white min-h-[780px]">
            {mounted && calendarBase && (
              <iframe
                src={calendlyUrl}
                width="100%"
                height="780"
                frameBorder="0"
                title="Réserver un appel découverte"
                className="w-full"
              />
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-300 font-medium">
            Tu recevras une confirmation par email avec le lien de visio dès que ton créneau est validé.
          </p>
        </motion.div>
      </div>
      <AdDisclaimer />
    </div>
  );
}
