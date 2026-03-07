"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function UrgencyBar() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -32 }}
          transition={{ duration: 0.2 }}
          className="relative z-[60] bg-[var(--accent)] text-[var(--accent-fg)]"
        >
          <div className="mx-auto max-w-[1200px] px-6 py-2 flex items-center justify-center">
            <p className="text-xs sm:text-sm font-medium text-center">
              <span className="font-semibold">Prix Fondateur : 997$</span>
              <span className="hidden sm:inline">
                {" "}&mdash; Prochain palier dans 18 places
              </span>
            </p>

            <button
              onClick={() => setVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[var(--bg)]/50 hover:text-[var(--bg)] transition-colors"
              aria-label="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
