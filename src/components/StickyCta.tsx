"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountdownTimerCompact, useIsExpired } from "./CountdownTimer";

export default function StickyCta() {
  const [isVisible, setIsVisible] = useState(false);
  const expired = useIsExpired();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="bg-gray-950/95 backdrop-blur-lg border-t border-white/10 px-4 py-3 safe-bottom">
            {!expired && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-sm font-semibold text-white/70">Fermeture dans</span>
                <CountdownTimerCompact />
              </div>
            )}
            {expired ? (
              <a
                href="/appel"
                className="block w-full rounded-full bg-amber-500 py-3 text-center text-base font-semibold text-white hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/25"
              >
                Réserve ton appel gratuit
              </a>
            ) : (
              <a
                href="#pricing"
                className="block w-full rounded-full bg-sky-500 py-3 text-center text-base font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
                data-ph-capture-attribute-section="sticky-bar"
              >
                Rejoindre avant la fermeture
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
