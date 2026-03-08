"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Sticky CTA bar on mobile — keeps the primary action always accessible
// UX research shows mobile sticky bars maintain conversion momentum for fast scrollers
export default function StickyCtaV4() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero section (~600px)
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
            <a
              href="#pricing"
              className="block w-full rounded-full bg-sky-500 py-3 text-center text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
            >
              Lancer mon app maintenant
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
