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

const PLAN_ACTION_VIDEO_ID = "ea7f621b-8b70-4573-a7a2-bcda8675377c";

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

function CtaButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mac-btn mac-btn-primary mac-btn-lg">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      Réserver mon appel
    </button>
  );
}

function Places() {
  return (
    <div className="inline-flex items-center gap-2 rounded-[8px] bg-[color-mix(in_srgb,var(--orange)_14%,transparent)] px-3.5 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--orange)] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--orange)]" />
      </span>
      <span className="text-[14px] font-bold text-[var(--orange)]">3 places restantes</span>
    </div>
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

  const openCalendly = (origin: string) => {
    posthog.capture("plan_action_cta_clicked", { origin });
    setCalendlyOpen(true);
  };

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

      <div className="flex flex-col items-center px-4 pt-14 pb-20">
        <motion.div
          className="w-full max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[30px] sm:text-[44px] font-bold tracking-[-0.035em] leading-[1.05]">
            Comment je suis passé de 0 à{" "}
            <span className="mac-accent whitespace-nowrap">30 000 € par mois</span>{" "}
            avec une seule application mobile
          </h1>

          <p className="mt-5 text-[18px] sm:text-[20px] font-semibold leading-relaxed max-w-2xl mx-auto">
            Regarde la vidéo jusqu&apos;au bout. À la fin, tu sauras exactement quoi faire pour lancer la tienne, et comment on peut la faire ensemble.
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

          {/* CTA principal */}
          <motion.div
            className="mt-10 rounded-[22px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] px-6 py-8 sm:px-10 sm:py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Places />
            <h2 className="mt-4 text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-tight">
              Tu veux qu&apos;on construise la tienne ensemble ?
            </h2>
            <p className="mt-3 text-[17px] font-medium leading-relaxed max-w-xl mx-auto">
              Je prends quelques personnes à la fois, en suivi personnel pendant trois mois. Ça commence par un appel de trente minutes avec Nolan, mon associé, ou avec moi.
            </p>
            <ul className="mt-6 mx-auto max-w-md text-left space-y-3 text-[16px] font-medium">
              <li className="flex gap-3"><span className="mac-accent font-bold">1.</span><span>On regarde ton projet, ta situation et le temps que tu peux y consacrer.</span></li>
              <li className="flex gap-3"><span className="mac-accent font-bold">2.</span><span>On te dit franchement si l&apos;accompagnement est fait pour toi.</span></li>
              <li className="flex gap-3"><span className="mac-accent font-bold">3.</span><span>Si oui, on pose ton plan d&apos;action et tu rejoins la communauté le soir même.</span></li>
            </ul>
            <div className="mt-7 flex flex-col items-center gap-3">
              <CtaButton onClick={() => openCalendly("haut")} />
              <p className="text-[15px] font-semibold">Que tu aies déjà une app ou juste une idée.</p>
            </div>
          </motion.div>

          {/* Preuves */}
          <motion.div
            className="mt-14 text-left"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-center text-[13px] font-bold uppercase tracking-[0.12em] mac-accent">
              Ce que ça donne, en argent
            </p>
            <h2 className="mt-2 text-center text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-tight">
              Mon application, et celle d&apos;un élève parti de zéro
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-4">
                <Image
                  src="/emails/revenue-mensuel-sep25-juin26.jpg"
                  alt="Revenus mensuels de Shinobi Japanese, de 10 000 à près de 40 000 dollars par mois"
                  width={960}
                  height={490}
                  className="w-full rounded-[12px]"
                />
                <p className="mt-4 text-[22px] font-bold tracking-[-0.02em] leading-tight">
                  De 10 000 à <span className="mac-accent">près de 40 000 $ par mois</span>
                </p>
                <p className="mt-2 text-[15px] font-medium leading-relaxed">
                  Shinobi Japanese, mon application pour apprendre le japonais, mois par mois de septembre 2025 à juin 2026. Plus de 5 000 notes, 4,9 sur 5.
                </p>
              </div>

              <div className="rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-4">
                <Image
                  src="/emails/florian-revenuecat-1793.jpg"
                  alt="Tableau de bord RevenueCat de Florian : 1 793 $ sur 28 jours"
                  width={955}
                  height={445}
                  className="w-full rounded-[12px]"
                />
                <div className="mt-4 flex items-center gap-3">
                  <Image src="/florian.jpg" alt="Florian" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover" />
                  <p className="text-[22px] font-bold tracking-[-0.02em] leading-tight">
                    Florian : <span className="mac-accent">1 793 $ en 28 jours</span>
                  </p>
                </div>
                <p className="mt-2 text-[15px] font-medium leading-relaxed">
                  Vingt ans, jamais codé. Il a construit son application avec l&apos;IA, puis il a appliqué la méthode marketing tous les jours jusqu&apos;à trouver son format. Sans un euro de pub.
                </p>
                <Link
                  href="/temoignage/florian?utm_source=plan-action-video&utm_medium=cta&utm_campaign=temoignage"
                  className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-bold text-[var(--accent)] hover:underline"
                >
                  Voir son témoignage en vidéo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="mt-4 rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-4 sm:flex sm:items-center sm:gap-5">
              <Image
                src="/eleves-appel.jpg"
                alt="Florian, Wassim et Soraya"
                width={1200}
                height={400}
                className="w-full sm:w-[360px] shrink-0 rounded-[12px]"
              />
              <p className="mt-4 sm:mt-0 text-[16px] font-medium leading-relaxed">
                Florian, Wassim et Soraya ont passé ce même appel il y a quelques mois. Aucun des trois ne savait faire connaître une application en arrivant. Plusieurs de mes élèves dépassent aujourd&apos;hui 2 000 € par mois.
              </p>
            </div>
          </motion.div>

          {/* CTA final */}
          <motion.div
            className="mt-14 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Places />
            <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-tight">
              À toi de jouer
            </h2>
            <p className="text-[17px] font-medium max-w-lg">
              Trente minutes, avec Nolan ou avec moi, pour voir si l&apos;accompagnement est fait pour toi. On ne prend pas tout le monde, et on te le dit honnêtement.
            </p>
            <CtaButton onClick={() => openCalendly("bas")} />
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
