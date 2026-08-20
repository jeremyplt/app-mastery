"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";

// Hand-drawn curved arrow from Logan's photo to the content screenshots
function SketchCurvedArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 10 15 C 25 8, 50 5, 75 12 C 100 19, 110 35, 105 55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 95 48 L 105 60 L 115 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function SketchCurvedArrowLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 110 15 C 95 8, 70 5, 45 12 C 20 19, 10 35, 15 55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 5 48 L 15 60 L 25 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function SketchUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 5 8 C 30 3, 60 9, 100 5 C 140 1, 170 7, 195 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Video modal overlay
function VideoModal({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-sm"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors text-sm font-medium flex items-center gap-1.5"
        >
          Fermer
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
          <video
            ref={videoRef}
            src={src}
            className="w-full aspect-[9/16] object-cover"
            controls
            autoPlay
            playsInline
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Video card with muted autoplay preview loop + play button
function VideoCard({
  src,
  stat,
  statLabel,
  delay,
  link,
}: {
  src: string;
  stat: string;
  statLabel: string;
  delay: number;
  link: string;
}) {
  const previewRef = useRef<HTMLVideoElement>(null);
  const [showModal, setShowModal] = useState(false);

  // Loop only first ~3.5 seconds for the preview
  useEffect(() => {
    const video = previewRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 3.5) {
        video.currentTime = 0;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  const handleOpen = useCallback(() => setShowModal(true), []);
  const handleClose = useCallback(() => setShowModal(false), []);

  return (
    <>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
      >
        <button
          onClick={handleOpen}
          className="group relative block w-full rounded-xl bg-[var(--group)] border-[0.5px] border-[var(--sep)] overflow-hidden cursor-pointer"
        >
          <div className="aspect-[9/16] relative">
            <video
              ref={previewRef}
              src={src}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              autoPlay
              playsInline
              loop={false}
            />

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </button>

        <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-bold text-[var(--fg)]">{stat}</span>
            <span className="text-lg text-[var(--fg2)]">{statLabel}</span>
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--accent2)] hover:brightness-110 transition-[filter]"
          >
            Voir &rarr;
          </a>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && <VideoModal src={src} onClose={handleClose} />}
      </AnimatePresence>
    </>
  );
}

export default function ProofContent() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="mac-eyebrow">Marketing</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-bold tracking-[-0.035em] text-balance text-[var(--fg)]">
            On t&apos;apprend aussi à{" "}
            <span className="relative inline-block">
              faire exploser ta visibilité
              <SketchUnderline className="absolute top-full left-0 w-full text-[var(--accent2)] -mt-1" />
            </span>
          </h2>
        </div>

        <div className="overflow-hidden rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]">
          <div className="relative p-6 sm:p-8 overflow-hidden">
            <div className="relative">
              {/* Logan's photo + name + hand-drawn arrows to the content */}
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Logan's photo */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border-[0.5px] border-[var(--sep)] shadow-xl">
                    <Image src="/proof/logan-v2.png" alt="Logan" width={80} height={80} className="w-full h-full object-cover" />
                  </div>

                  {/* Hand-drawn arrows going left and right from Logan to the content */}
                  <SketchCurvedArrow className="absolute -right-20 sm:-right-28 top-2 w-20 sm:w-28 h-16 sm:h-20 text-[var(--accent2)]" />
                  <SketchCurvedArrowLeft className="absolute -left-20 sm:-left-28 top-2 w-20 sm:w-28 h-16 sm:h-20 text-[var(--accent2)]" />
                </motion.div>

                <motion.div
                  className="mt-3 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-lg font-semibold text-[var(--fg)]">Logan</p>
                  <p className="text-lg text-[var(--fg2)]">
                    Cofondateur de Shinobi Japanese, expert marketing &amp; contenu organique
                  </p>
                </motion.div>

                {/* Hand-drawn annotation text */}
                <motion.p
                  className="mt-3 text-lg text-[var(--accent2)] font-medium italic text-center max-w-xs"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Le génie derrière le marketing de Shinobi Japanese et de
                  dizaines d&apos;e-commerces
                </motion.p>
              </div>

              {/* Video previews grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <VideoCard
                  src="/proof/content-2.5M.mp4"
                  stat="2.5M"
                  statLabel="vues"
                  link="https://www.instagram.com/reel/DQVvpZuCe-p/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                  delay={0.2}
                />
                <VideoCard
                  src="/proof/content-2.1M.mp4"
                  stat="2.1M"
                  statLabel="vues"
                  link="https://www.instagram.com/reel/DMVhjJ2J-aV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                  delay={0.3}
                />
                <VideoCard
                  src="/proof/content-1.9M.mp4"
                  stat="1.9M"
                  statLabel="vues"
                  link="https://www.instagram.com/reel/DP-Vu4jkuFU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                  delay={0.4}
                />
              </div>

              {/* CTA line — Logan teaches this in the formation */}
              <motion.div
                className="mt-8 pt-6 border-t border-[var(--sep)] text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-lg text-[var(--fg2)]">
                  Logan intervient directement dans la formation pour
                  t&apos;apprendre ses{" "}
                  <span className="text-[var(--fg)] font-medium">
                    stratégies de contenu viral
                  </span>{" "}
                  , les mêmes qui ont généré ces résultats.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
