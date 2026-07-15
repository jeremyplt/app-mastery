"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AdDisclaimer from "@/components/AdDisclaimer";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import type Hls from "hls.js";
import { generateEventId, metaTrackingFields, trackMeta, trackMetaCustom } from "@/lib/meta-pixel";
import { loadOptinContact, type OptinContact } from "@/lib/optin-contact";
import { loadVslAnswers, type VslAnswers } from "@/lib/vsl-qualification";

// Flux direct Bunny Stream (lecture native, aucun contrôle affiché).
// HLS en priorité (synchro audio/vidéo fiable + qualité adaptative), MP4 en secours.
const VSL_HLS_URL =
  "https://vz-0fb759fa-b02.b-cdn.net/1ab63722-1ef3-4c0d-b585-19514fab0f61/playlist.m3u8";
const VSL_MP4_URL =
  "https://vz-0fb759fa-b02.b-cdn.net/1ab63722-1ef3-4c0d-b585-19514fab0f61/play_720p.mp4";

const CALENDLY_BASE = "https://calendly.com/masteryapp-jeremy/30min";

// Le CTA de candidature n'apparaît qu'une fois ce temps de visionnage atteint
// (moment où le CTA est annoncé dans la vidéo).
const CTA_REVEAL_SECONDS = 18 * 60 + 30; // 18min30
const CTA_UNLOCKED_KEY = "vsl_cta_unlocked";
// Position de lecture sauvegardée pour reprendre au même endroit après un reload.
const POSITION_KEY = "vsl_position";

// Courbe de progression non linéaire : avance vite au début, ralentit vers la fin.
// progress = log(1 + k·x) / log(1 + k), avec x = temps réel / durée totale.
const PROGRESS_CURVE_K = 150;

function curvedProgress(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return Math.log1p(PROGRESS_CURVE_K * clamped) / Math.log1p(PROGRESS_CURVE_K);
}

// Paliers de visionnage envoyés à PostHog (secondes). 1110 = 18min30, le
// moment où le CTA se débloque.
const WATCH_MILESTONES = [60, 300, 600, 1110];

function VslPlayer({ onCtaUnlock }: { onCtaUnlock: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // La vidéo démarre automatiquement en muet. Le premier clic relance du début avec le son.
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [ended, setEnded] = useState(false);
  // Écran de choix affiché quand le prospect revient avec une position sauvegardée
  const [resumePrompt, setResumePrompt] = useState(false);
  const restoredRef = useRef(false);
  const lastSaveRef = useRef(0);
  const milestonesFiredRef = useRef<Set<number>>(new Set());

  // Barre de progression animée en continu (60fps) pour un rendu parfaitement fluide
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const v = videoRef.current;
      const bar = progressBarRef.current;
      if (v && bar && v.duration > 0) {
        bar.style.width = `${curvedProgress(v.currentTime / v.duration) * 100}%`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let hls: Hls | null = null;
    let cancelled = false;

    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari : HLS natif
      v.src = VSL_HLS_URL;
    } else {
      import("hls.js").then(({ default: HlsLib }) => {
        if (cancelled) return;
        if (HlsLib.isSupported()) {
          hls = new HlsLib();
          hls.loadSource(VSL_HLS_URL);
          hls.attachMedia(v);
        } else {
          v.src = VSL_MP4_URL;
        }
      });
    }

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, []);

  function handleClick() {
    const v = videoRef.current;
    if (!v) return;

    // Le choix continuer/recommencer se fait via les boutons dédiés
    if (resumePrompt) return;

    if (ended) {
      // Revoir la vidéo depuis le début
      v.currentTime = 0;
      v.play();
      setEnded(false);
      return;
    }

    if (!soundOn) {
      // Relance du début avec le son
      v.muted = false;
      v.currentTime = 0;
      v.play();
      setSoundOn(true);
      posthog.capture("vsl_watch_started", { resumed: false });
      return;
    }

    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  }

  function resumeWatching(e: React.MouseEvent) {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play();
    setSoundOn(true);
    setResumePrompt(false);
    posthog.capture("vsl_watch_started", { resumed: true, from_seconds: Math.round(v.currentTime) });
  }

  function restartFromBeginning(e: React.MouseEvent) {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    lastSaveRef.current = 0;
    // Recommence de zéro : les paliers peuvent être réémis pour ce visionnage.
    milestonesFiredRef.current.clear();
    localStorage.setItem(POSITION_KEY, "0");
    v.play();
    setSoundOn(true);
    setResumePrompt(false);
    posthog.capture("vsl_watch_started", { resumed: false, restarted: true });
  }

  function toggleFullscreen(e: React.MouseEvent) {
    e.stopPropagation();
    const container = containerRef.current;
    const video = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (container?.requestFullscreen) {
      container.requestFullscreen();
    } else if (video?.webkitEnterFullscreen) {
      // Fallback iOS Safari
      video.webkitEnterFullscreen();
    }
  }

  return (
    <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-red-500/20">
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden aspect-video cursor-pointer select-none bg-black"
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        role="button"
        aria-label={!soundOn ? "Activer le son" : playing ? "Mettre en pause" : "Reprendre la lecture"}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadedMetadata={(e) => {
            if (restoredRef.current) return;
            restoredRef.current = true;
            const v = e.currentTarget;
            const saved = parseFloat(localStorage.getItem(POSITION_KEY) || "0");
            if (saved > 1 && saved < v.duration - 5) {
              // Le prospect revient : on se place où il en était et on lui laisse le choix.
              // Les paliers déjà dépassés ne sont pas réémis (déjà comptés à la 1ère session).
              WATCH_MILESTONES.forEach((m) => {
                if (saved >= m) milestonesFiredRef.current.add(m);
              });
              v.currentTime = saved;
              setResumePrompt(true);
              posthog.capture("vsl_resume_prompt_shown", { from_seconds: Math.round(saved) });
            } else {
              // Première visite : autoplay en muet
              v.play().catch(() => {});
            }
          }}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (!v.muted && v.currentTime >= CTA_REVEAL_SECONDS) onCtaUnlock();
            // Paliers de visionnage (son activé uniquement : l'autoplay muet
            // ne compte pas comme un vrai visionnage)
            if (!v.muted) {
              for (const m of WATCH_MILESTONES) {
                if (v.currentTime >= m && !milestonesFiredRef.current.has(m)) {
                  milestonesFiredRef.current.add(m);
                  posthog.capture("vsl_video_progress", {
                    seconds: m,
                    percent: v.duration > 0 ? Math.round((m / v.duration) * 100) : undefined,
                  });
                }
              }
            }
            // Sauvegarde de la position (throttle ~3s), uniquement si le son est activé :
            // l'autoplay muet ne compte pas comme un vrai visionnage commencé
            if (!v.muted && Math.abs(v.currentTime - lastSaveRef.current) > 3) {
              lastSaveRef.current = v.currentTime;
              localStorage.setItem(POSITION_KEY, String(v.currentTime));
            }
          }}
          onPlay={() => {
            setPlaying(true);
            setEnded(false);
          }}
          onPause={() => setPlaying(false)}
          onEnded={(e) => {
            setPlaying(false);
            setEnded(true);
            if (!e.currentTarget.muted) posthog.capture("vsl_video_completed");
            // Visionnage terminé : le prochain passage repart du début
            localStorage.removeItem(POSITION_KEY);
            lastSaveRef.current = 0;
          }}
        />

        {/* Overlay retour : le prospect avait déjà commencé la vidéo */}
        {resumePrompt && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 sm:gap-8 bg-black/70 backdrop-blur-sm px-4">
            <p className="text-xl sm:text-3xl font-black tracking-tight text-white text-center text-balance">
              Tu avais déjà commencé cette vidéo...
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={resumeWatching}
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-7 py-3.5 text-base font-bold text-white hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-600/40 whitespace-nowrap"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.54-6.86a1.05 1.05 0 000-1.76L9.56 4.26A1.04 1.04 0 008 5.14z" />
                </svg>
                Continuer de regarder
              </button>
              <button
                type="button"
                onClick={restartFromBeginning}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-base font-bold text-white hover:bg-white/20 transition-colors whitespace-nowrap"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Recommencer du début
              </button>
            </div>
          </div>
        )}

        {/* Overlay initial : la vidéo tourne en muet, clic = relancer avec le son */}
        {!soundOn && !ended && !resumePrompt && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="mx-4 flex flex-col items-center gap-2 sm:gap-4 rounded-xl sm:rounded-2xl bg-red-600/85 px-5 py-4 sm:px-10 sm:py-8 text-center shadow-2xl shadow-red-950/50 backdrop-blur-sm">
              <p className="text-base sm:text-2xl font-black tracking-tight text-white">
                La vidéo a déjà commencé
              </p>
              <svg
                className="h-7 w-7 sm:h-12 sm:w-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.7-.51-1.94-1.36a9.02 9.02 0 010-4.78c.25-.85 1.06-1.36 1.94-1.36h2.24z"
                />
              </svg>
              <p className="text-sm sm:text-xl font-bold text-white">Clique pour écouter</p>
            </div>
          </div>
        )}

        {/* Overlay fin : revoir la vidéo */}
        {ended && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-8 py-4 text-lg font-bold text-white hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-600/40"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Revoir la vidéo
            </button>
          </div>
        )}

        {/* Overlay pause */}
        {soundOn && !playing && !ended && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-600/40 transition-transform hover:scale-105">
              <svg className="ml-1 h-9 w-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.54-6.86a1.05 1.05 0 000-1.76L9.56 4.26A1.04 1.04 0 008 5.14z" />
              </svg>
            </span>
          </div>
        )}

        {/* Contrôles minimaux : play/pause + plein écran */}
        {soundOn && (
          <div className="absolute inset-x-0 bottom-1.5 z-20 flex items-center justify-between px-4 pb-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              aria-label={playing ? "Mettre en pause" : "Lire"}
              className="text-white/90 hover:text-white transition-colors drop-shadow-lg"
            >
              {playing ? (
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 5.5A1.5 1.5 0 018.5 4h1A1.5 1.5 0 0111 5.5v13A1.5 1.5 0 019.5 20h-1A1.5 1.5 0 017 18.5v-13zm6 0A1.5 1.5 0 0114.5 4h1A1.5 1.5 0 0117 5.5v13a1.5 1.5 0 01-1.5 1.5h-1a1.5 1.5 0 01-1.5-1.5v-13z" />
                </svg>
              ) : (
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.54-6.86a1.05 1.05 0 000-1.76L9.56 4.26A1.04 1.04 0 008 5.14z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Plein écran"
              className="text-white/90 hover:text-white transition-colors drop-shadow-lg"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9V5.25A1.5 1.5 0 015.25 3.75H9m6 0h3.75a1.5 1.5 0 011.5 1.5V9m0 6v3.75a1.5 1.5 0 01-1.5 1.5H15m-6 0H5.25a1.5 1.5 0 01-1.5-1.5V15"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Barre de progression custom, directement sur la vidéo */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-1.5 bg-white/20 pointer-events-none">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-red-600 to-red-500"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}

function CalendlyModal({ calendlyUrl, onClose }: { calendlyUrl: string; onClose: () => void }) {
  // Bloque le scroll de la page derrière la pop-up + fermeture via Échap
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Réserver un appel découverte"
    >
      <motion.div
        className="relative w-full max-w-5xl"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute -top-11 right-0 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20 transition-colors"
        >
          Fermer
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
          <iframe
            src={calendlyUrl}
            width="100%"
            frameBorder="0"
            title="Réserver un appel découverte"
            className="block w-full h-[min(780px,calc(100dvh-7rem))]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ConferenceLivePage() {
  return (
    <Suspense>
      <ConferenceLiveContent />
    </Suspense>
  );
}

function ConferenceLiveContent() {
  const searchParams = useSearchParams();

  // CTA masqué tant que le prospect n'a pas vu 18min30 de vidéo.
  // Persisté en localStorage pour ne pas re-verrouiller au rechargement.
  const [ctaVisible, setCtaVisible] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  // Contact capturé à l'optin : pré-remplit le formulaire Calendly.
  // Chargé en effect (localStorage indisponible au rendu serveur).
  const [optinContact, setOptinContact] = useState<OptinContact | null>(null);
  // Réponses de pré-qualification de l'opt-in : pré-remplissent les questions
  // radio du formulaire Calendly (a2/a3/a5).
  const [vslAnswers, setVslAnswers] = useState<VslAnswers | null>(null);

  useEffect(() => {
    setOptinContact(loadOptinContact());
    setVslAnswers(loadVslAnswers());
  }, []);

  useEffect(() => {
    // Dev uniquement : CTA toujours visible pour tester sans regarder 18min30.
    // Inerte en production (le build remplace NODE_ENV, la branche est éliminée).
    if (process.env.NODE_ENV === "development") {
      setCtaVisible(true);
      return;
    }
    if (localStorage.getItem(CTA_UNLOCKED_KEY) === "1") setCtaVisible(true);
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
        const utmSource = searchParams.get("utm_source") || "vsl-conference";
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
            email: optinContact?.email,
            firstName: optinContact?.firstName,
            phone: optinContact?.phone,
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
    // a1 = première question custom du formulaire (le numéro de téléphone).
    if (optinContact) {
      params.set("name", optinContact.firstName);
      params.set("email", optinContact.email);
      params.set("a1", optinContact.phone);
    }
    // Réponses de pré-qualification : les params aN sont positionnels
    // (a2 = âge, a3 = profession, a5 = objectif 3-6 mois). Les radios ne se
    // pré-cochent que si le texte correspond exactement à l'option Calendly.
    if (vslAnswers) {
      params.set("a2", vslAnswers.age);
      params.set("a3", vslAnswers.profession);
      params.set("a5", vslAnswers.objectif);
    }
    // UTM nativement supportés par Calendly : attribution jusqu'à la résa.
    params.set("utm_source", searchParams.get("utm_source") || "vsl-conference");
    params.set("utm_medium", searchParams.get("utm_medium") || "cta");
    params.set("utm_campaign", searchParams.get("utm_campaign") || "vsl");
    return `${CALENDLY_BASE}?${params.toString()}`;
  })();

  const unlockCta = useCallback(() => {
    setCtaVisible((visible) => {
      if (!visible) {
        localStorage.setItem(CTA_UNLOCKED_KEY, "1");
        posthog.capture("vsl_cta_unlocked");
      }
      return true;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="grid min-h-screen grid-cols-[1fr_minmax(0,80rem)_1fr]">
        {/* Left gutter */}
        <div
          className="border-r border-white/10 bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Center content */}
        <div className="flex min-h-screen flex-col justify-center min-w-0">
          <section className="relative py-10 sm:py-16">
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="font-mono text-sm sm:text-base font-semibold tracking-widest uppercase text-red-400">
                  Conférence privée
                </span>

                <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] text-balance text-white">
                  Le Nouvel{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600">
                    Eldorado
                  </span>{" "}
                  Des Applications Mobiles
                </h1>

                <p className="mt-4 text-base sm:text-lg font-medium text-gray-300 max-w-2xl mx-auto">
                  Regarde la conférence en entier. À la fin, tu sauras exactement comment lancer
                  ton app rentable, et comment postuler pour qu&apos;on t&apos;accompagne.
                </p>
              </motion.div>

              {/* Video player */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <VslPlayer onCtaUnlock={unlockCta} />
              </motion.div>

              {/* CTA : Candidater à l'incubateur (débloqué à 18min30 de visionnage) */}
              {ctaVisible && (
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-white text-balance">
                  Prêt à lancer ton app avec notre accompagnement ?
                </p>

                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => {
                      trackMetaCustom("VSLCTAClick", { content_name: "vsl-conference" });
                      posthog.capture("vsl_cta_clicked");
                      setCalendlyOpen(true);
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 px-10 py-4 text-lg font-bold text-white hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-600/30 whitespace-nowrap"
                  >
                    Candidater à l&apos;incubateur
                  </button>
                </div>

                <p className="mt-4 text-sm font-medium text-red-400">
                  Places limitées ce mois-ci
                </p>

                <p className="mt-4 text-base text-gray-300 max-w-md mx-auto">
                  Réserve ton appel directement. On définit ensemble si on peut
                  t&apos;accompagner.
                </p>
              </motion.div>
              )}
            </div>
          </section>
        </div>

        {/* Right gutter */}
        <div
          className="border-l border-white/10 bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>

      {calendlyOpen && (
        <CalendlyModal calendlyUrl={calendlyUrl} onClose={() => setCalendlyOpen(false)} />
      )}

      <AdDisclaimer />
    </div>
  );
}
