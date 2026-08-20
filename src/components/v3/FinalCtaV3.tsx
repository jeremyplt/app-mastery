"use client";

import { motion } from "framer-motion";

export default function FinalCtaV3() {
  return (
    <section className="relative py-24">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
          <div className="relative rounded-xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_10%,transparent)] via-transparent to-[color-mix(in_srgb,var(--accent)_10%,transparent)]" />
            {/* Dot pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative px-8 py-20 sm:py-28 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl sm:text-[2.5rem]/10 font-medium tracking-[-0.035em] text-balance text-[var(--fg)] mb-6">
                  Pret a creer ton app ?
                </h2>
                <p className="text-base/7 text-[var(--fg2)] mb-10 max-w-lg mx-auto">
                  Rejoins la formation et lance ta premiere app mobile en 28 jours. Sans savoir coder.
                </p>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--accent2)] transition-colors"
                >
                  Commencer maintenant
                </a>
                <p className="text-xs text-[var(--fg3)] mt-4">Garantie 30 jours satisfait ou rembourse</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-16 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--field)]" />
    </section>
  );
}
