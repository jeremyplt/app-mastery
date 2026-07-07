"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const VSL_VIDEO_ID = "1ab63722-1ef3-4c0d-b585-19514fab0f61";
const VSL_LIBRARY_ID = "613852";

// Courbe de progression non linéaire : avance vite au début, ralentit vers la fin.
// progress = log(1 + k·x) / log(1 + k), avec x = temps réel / durée totale.
const PROGRESS_CURVE_K = 7;

function curvedProgress(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return Math.log1p(PROGRESS_CURVE_K * clamped) / Math.log1p(PROGRESS_CURVE_K);
}

function VslPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  function sendCommand(method: string, value?: string) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ context: "player.js", version: "0.0.11", method, value }),
      "*"
    );
  }

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.origin.includes("mediadelivery.net")) return;
      let data: { context?: string; event?: string; value?: { seconds?: number; duration?: number } };
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data?.context !== "player.js") return;

      if (data.event === "ready") {
        // S'abonner aux events du player Bunny (protocole player.js)
        ["timeupdate", "play", "pause", "ended"].forEach((evt) =>
          sendCommand("addEventListener", evt)
        );
      } else if (data.event === "timeupdate") {
        const seconds = data.value?.seconds ?? 0;
        const duration = data.value?.duration ?? 0;
        if (duration > 0) setProgress(curvedProgress(seconds / duration));
      } else if (data.event === "play") {
        setPlaying(true);
        setStarted(true);
      } else if (data.event === "pause") {
        setPlaying(false);
      } else if (data.event === "ended") {
        setPlaying(false);
        setProgress(1);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function togglePlay() {
    if (playing) {
      sendCommand("pause");
    } else {
      sendCommand("play");
    }
  }

  return (
    <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-red-500/20">
      <div className="relative rounded-xl overflow-hidden aspect-video">
        <iframe
          ref={iframeRef}
          src={`https://iframe.mediadelivery.net/embed/${VSL_LIBRARY_ID}/${VSL_VIDEO_ID}?autoplay=false&preload=true&responsive=true`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media"
        />
        {/* Overlay : bloque les contrôles natifs, seul le clic play/pause est possible */}
        <div
          className="absolute inset-0 z-10 cursor-pointer select-none"
          onClick={togglePlay}
          role="button"
          aria-label={playing ? "Mettre en pause" : "Lire la vidéo"}
        >
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-600/40 transition-transform hover:scale-105">
                <svg className="ml-1 h-9 w-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.54-6.86a1.05 1.05 0 000-1.76L9.56 4.26A1.04 1.04 0 008 5.14z" />
                </svg>
              </span>
              {started && (
                <span className="absolute bottom-4 text-sm font-semibold text-white/90">
                  Clique pour reprendre
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Barre de progression custom */}
      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500 transition-[width] duration-500 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
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
  const utm = searchParams.toString();
  const appelHref = `/appel?utm_source=vsl-conference&utm_medium=cta&utm_campaign=vsl${utm ? `&${utm}` : ""}`;

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
            <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
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
                <VslPlayer />
              </motion.div>

              {/* CTA : Candidater à l'incubateur */}
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-white text-balance">
                  Prêt à lancer ton app avec notre accompagnement ?
                </p>

                <div className="mt-7">
                  <a
                    href={appelHref}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 px-10 py-4 text-lg font-bold text-white hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-600/30 whitespace-nowrap"
                  >
                    Candidater à l&apos;incubateur
                  </a>
                </div>

                <p className="mt-4 text-sm font-medium text-red-400">
                  Places limitées ce mois-ci
                </p>

                <p className="mt-4 text-base text-gray-300 max-w-md mx-auto">
                  Réponds à quelques questions, puis réserve ton appel. On définit ensemble si on
                  peut t&apos;accompagner.
                </p>
              </motion.div>
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
    </div>
  );
}
