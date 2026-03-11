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

  if (expired) return null;

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
          <div className="bg-gray-950/95 backdrop-blur-lg border-b border-white/10 px-4 py-2.5">
            <div className="flex items-center justify-center gap-3">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-sm font-semibold text-white/90">
                Les inscriptions ferment dans
              </span>
              <CountdownTimerCompact />
              <a
                href="#pricing"
                className="hidden sm:inline-flex ml-2 rounded-full bg-sky-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
                data-ph-capture-attribute-section="sticky-top-bar"
              >
                Rejoindre maintenant
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
