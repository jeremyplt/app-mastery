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
          <div
            className="border-t-[0.5px] border-[var(--glass-brd)] px-4 py-3 safe-bottom"
            style={{
              background: "var(--glass)",
              backdropFilter: "blur(28px) saturate(1.8)",
              WebkitBackdropFilter: "blur(28px) saturate(1.8)",
            }}
          >
            {!expired && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--red)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--red)]" />
                </span>
                <span className="text-sm font-semibold text-[var(--fg2)]">Fermeture dans</span>
                <CountdownTimerCompact />
              </div>
            )}
            {expired ? (
              <a href="/appel" className="btn-primary w-full py-3! text-base!">
                Réserve ton appel gratuit
              </a>
            ) : (
              <a
                href="#pricing"
                className="btn-primary w-full py-3! text-base!"
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
