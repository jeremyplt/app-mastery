"use client";

import { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdDisclaimer from "@/components/AdDisclaimer";
import CalendlyModal from "@/components/CalendlyModal";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { generateEventId, metaTrackingFields, trackMeta } from "@/lib/meta-pixel";
import { loadOptinContact, type OptinContact } from "@/lib/optin-contact";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";

const PLAN_ACTION_VIDEO_ID = "a1fa42ba-337e-4cf1-b0b7-24fc7ab5be24";

const CALENDLY_BASE = "https://calendly.com/jeremypltpro/30min";

// Désactivé tant que la page /appel/confirme n'a pas assez de contenu (vidéos).
// Passer à true pour rediriger vers la page de confirmation après le booking.
const CONFIRM_REDIRECT_ENABLED = false;

export default function PlanActionVideoPage() {
  return (
    <Suspense>
      <PlanActionVideoContent />
    </Suspense>
  );
}

function PlanActionVideoContent() {
  const searchParams = useSearchParams();
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  // Contact capturé à l'optin /plan-action : pré-remplit le formulaire
  // Calendly. Chargé en effect (localStorage indisponible au rendu serveur).
  const [optinContact, setOptinContact] = useState<OptinContact | null>(null);
  // Base Calendly assignée côté serveur selon la répartition % (admin).
  const [calendarBase, setCalendarBase] = useState<string | null>(null);

  useEffect(() => {
    setOptinContact(loadOptinContact());
  }, []);

  // Assigne un calendrier (une fois par visite) et incrémente son compteur.
  useEffect(() => {
    fetch("/api/calendar/assign", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setCalendarBase(d.calendlyBase || CALENDLY_BASE))
      .catch(() => setCalendarBase(CALENDLY_BASE));
  }, []);

  // Capture le booking réel (Calendly poste un message à la prise de RDV).
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (
        e.origin === "https://calendly.com" &&
        e.data?.event === "calendly.event_scheduled"
      ) {
        posthog.capture("appel_booked", { email: optinContact?.email });

        // Meta : Schedule côté Pixel + relay CAPI serveur (même event_id,
        // Meta déduplique). content_category = utm_source pour segmenter
        // les bookings par origine dans Events Manager. Best-effort.
        const utmSource = searchParams.get("utm_source") || "plan-action-video";
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
          // keepalive : la requête survit à la redirection vers /appel/confirme.
          keepalive: true,
          body: JSON.stringify({
            eventName: "Schedule",
            eventId: metaEventId,
            email: optinContact?.email,
            firstName: optinContact?.firstName,
            phone: optinContact?.phone,
            utmSource,
            fbp: meta.fbp,
            fbc: meta.fbc,
            eventSourceUrl: meta.eventSourceUrl,
          }),
        }).catch(() => {});

        // Redirige vers la page de confirmation (récap + vidéos + équipe).
        if (CONFIRM_REDIRECT_ENABLED) {
          const confirmParams = new URLSearchParams();
          if (optinContact?.firstName)
            confirmParams.set("firstName", optinContact.firstName);
          const query = confirmParams.toString();
          window.location.href = `/appel/confirme${query ? `?${query}` : ""}`;
        }
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [searchParams, optinContact]);

  const calendlyUrl = (() => {
    // embed_domain + embed_type sont REQUIS pour que Calendly envoie les
    // postMessages (calendly.event_scheduled) à la page parente. Sans eux,
    // aucun événement de booking ne remonte (ni Meta Schedule ni PostHog).
    const params = new URLSearchParams({
      hide_gdpr_banner: "1",
      embed_domain: "www.jeremypitault.com",
      embed_type: "Inline",
    });
    // Pré-remplissage depuis le contact optin : name/email natifs Calendly,
    // a1 = première question custom de jeremypltpro/30min (le téléphone).
    if (optinContact) {
      params.set("name", optinContact.firstName);
      params.set("email", optinContact.email);
      params.set("a1", optinContact.phone);
    }
    // UTM nativement supportés par Calendly : attribution jusqu'à la résa.
    params.set("utm_source", searchParams.get("utm_source") || "plan-action-video");
    params.set("utm_medium", searchParams.get("utm_medium") || "cta");
    params.set("utm_campaign", searchParams.get("utm_campaign") || "plan-action");
    return `${calendarBase ?? CALENDLY_BASE}?${params.toString()}`;
  })();

  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 38% at 50% -6%, var(--accent-glow), transparent 62%)",
        }}
      />

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          className="w-full max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-blue">Plan d&apos;Action</span>

          <h1 className="mt-6 text-[28px] sm:text-[38px] font-bold tracking-[-0.035em]">
            Ton Plan d&apos;Action pour lancer ton projet rentable
          </h1>

          <p className="mt-4 text-[17px] leading-relaxed text-[var(--fg2)] max-w-xl mx-auto">
            Regarde cette vidéo pour découvrir la méthode exacte que j&apos;ai utilisée pour passer de 0 à plus de 30 000 € par mois avec une application mobile.
          </p>

          {/* Video player */}
          <div className="mt-8">
            <div className="overflow-hidden rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-2">
              <div className="relative rounded-[12px] overflow-hidden aspect-video">
                <iframe
                  src={`https://iframe.mediadelivery.net/embed/613852/${PLAN_ACTION_VIDEO_ID}?autoplay=false&preload=true&responsive=true`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-[19px] font-semibold text-[var(--fg)] mb-2">
              Tu souhaites te faire accompagner pour créer ton app rentable ?
            </p>
            <div className="inline-flex items-center gap-2 rounded-[8px] bg-[color-mix(in_srgb,var(--orange)_14%,transparent)] px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--orange)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--orange)]" />
              </span>
              <span className="text-[13.5px] font-bold text-[var(--orange)]">
                3 places restantes
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                posthog.capture("plan_action_cta_clicked");
                setCalendlyOpen(true);
              }}
              className="mac-btn mac-btn-primary mac-btn-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Réserve ton appel gratuit
            </button>
            <p className="text-[14px] text-[var(--fg2)] max-w-md">
              Que tu aies déjà une app ou juste une idée, on regarde en 30 minutes si l&apos;accompagnement est fait pour toi.
            </p>
          </motion.div>

          {/* Preuve : Florian */}
          <motion.div
            className="mt-14 mx-auto max-w-xl text-left"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p className="text-center text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--fg2)]">
              Il était exactement là où tu es
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-5 rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-5">
              <Image
                src="/florian.jpg"
                alt="Florian"
                width={112}
                height={112}
                className="h-28 w-28 shrink-0 rounded-[16px] object-cover"
              />
              <div className="text-center sm:text-left">
                <p className="text-[22px] font-bold tracking-[-0.02em] leading-tight">
                  1 793 $ en 28 jours, sans savoir coder
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg2)]">
                  Florian a vingt ans. Il a construit son application avec l&apos;IA, puis il a appliqué la méthode marketing tous les jours jusqu&apos;à trouver son format. Vingt-huit jours plus tard, son app lui avait rapporté 1 793 $, sans un euro de pub.
                </p>
                <Link
                  href="/temoignage/florian?utm_source=plan-action-video&utm_medium=cta&utm_campaign=temoignage"
                  className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--accent)] hover:underline"
                >
                  Voir son témoignage en vidéo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {calendlyOpen && (
          <CalendlyModal calendlyUrl={calendlyUrl} onClose={() => setCalendlyOpen(false)} />
        )}
      </AnimatePresence>

      <AdDisclaimer />
    </div>
  );
}
