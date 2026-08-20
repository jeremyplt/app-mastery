"use client";

import { MotionConfig } from "framer-motion";

/**
 * Honors the user's reduced-motion setting for all framer-motion animations
 * (transform animations are dropped, opacity kept). Sets an Apple-style
 * critically-damped default spring for anything that doesn't specify one.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ type: "spring", bounce: 0, duration: 0.5 }}
    >
      {children}
    </MotionConfig>
  );
}
