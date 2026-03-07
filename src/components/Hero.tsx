"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative z-1 pt-32 pb-20 md:pt-40 md:pb-28 px-6 glow-lg">
      <div className="mx-auto max-w-[720px] flex flex-col items-center text-center gap-6">
        {/* Badge */}
        <motion.span
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-xs font-medium text-[var(--color-blue)]"
        >
          Formation #1 Francophone
        </motion.span>

        {/* H1 */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-[var(--fg)]"
        >
          Cree, Lance et Monetise ton App Mobile{" "}
          <span className="text-[var(--color-blue)]">en 28 Jours</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-base md:text-lg text-[var(--muted-fg)] leading-relaxed max-w-[560px]"
        >
          Meme sans experience en programmation. Grace a l&apos;IA et au
          vibecoding, transforme ton idee en application rentable sur
          l&apos;App Store et Google Play.
        </motion.p>

        {/* CTA row */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-2"
        >
          <a href="#prix" className="btn-primary">
            Commencer Maintenant &mdash; 997$
          </a>
          <span className="text-sm text-[var(--muted-fg)]">ou 4x 297$</span>
        </motion.div>

        {/* Social proof */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex items-center gap-3 mt-4"
        >
          {/* Avatars */}
          <div className="flex -space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[var(--bg)]"
                style={{
                  background: `hsl(0, 0%, ${30 + i * 8}%)`,
                }}
              />
            ))}
          </div>

          <span className="text-sm text-[var(--muted-fg)] font-medium">
            500+ eleves
          </span>

          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-[var(--color-warning)] text-[var(--color-warning)]"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
