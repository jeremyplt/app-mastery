"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

// Pop-up Calendly plein écran, partagée entre les pages VSL (/conference/live)
// et plan d'action (/plan-action/video). L'URL doit contenir embed_domain +
// embed_type pour que Calendly poste les événements de booking à la page.
export default function CalendlyModal({
  calendlyUrl,
  onClose,
}: {
  calendlyUrl: string;
  onClose: () => void;
}) {
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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Réserver un appel découverte"
    >
      <motion.div
        className="relative w-full max-w-5xl"
        initial={{ opacity: 0, y: 24, scale: 0.98, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 12, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
        transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute -top-11 right-0 inline-flex items-center gap-2 rounded-full bg-[var(--glass)] backdrop-blur-md border border-[var(--glass-brd)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_12%,transparent)] transition-colors"
        >
          Fermer
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-hidden rounded-[20px] border-[0.5px] border-[var(--glass-brd)] bg-white shadow-2xl">
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
