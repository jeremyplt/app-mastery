"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountdownTimerCompact, useIsExpired } from "./CountdownTimer";

export default function StickyTopBar() {
  const [isVisible, setIsVisible] = useState(false);
  const expired = useIsExpired();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50"
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          exit={{ y: -60 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            className="border-b-[0.5px] border-[var(--glass-brd)] px-4 py-2.5"
            style={{
              background: "var(--glass)",
              backdropFilter: "blur(28px) saturate(1.8)",
              WebkitBackdropFilter: "blur(28px) saturate(1.8)",
            }}
          >
            <div className="flex items-center justify-center gap-3">
              {expired ? (
                <>
                  <span className="text-sm font-semibold text-[var(--fg)]">
                    Tu veux un plan d&apos;action personnalisé ?
                  </span>
                  <a
                    href="/appel?utm_source=landing&utm_medium=cta&utm_campaign=sticky-top-bar"
                    className="btn-primary ml-2 py-1.5! px-4! text-sm!"
                  >
                    Appel découverte
                  </a>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--red)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--red)]" />
                  </span>
                  <span className="text-sm font-semibold text-[var(--fg)]">
                    Les inscriptions ferment dans
                  </span>
                  <CountdownTimerCompact />
                  <a
                    href="#pricing"
                    className="btn-primary hidden sm:inline-flex ml-2 py-1.5! px-4! text-sm!"
                    data-ph-capture-attribute-section="sticky-top-bar"
                  >
                    Rejoindre maintenant
                  </a>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
