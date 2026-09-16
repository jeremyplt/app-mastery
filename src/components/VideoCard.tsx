"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

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
export function VideoCard({
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
