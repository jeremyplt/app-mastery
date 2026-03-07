"use client";

import { motion } from "framer-motion";

export default function FinalCtaV3() {
  return (
    <section className="relative py-24">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-sky-500/20">
          <div className="relative rounded-xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-violet-500/10" />
            {/* Grid pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative px-8 py-20 sm:py-28 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white mb-6">
                  Pret a creer ton app ?
                </h2>
                <p className="text-base/7 text-gray-400 mb-10 max-w-lg mx-auto">
                  Rejoins la formation et lance ta premiere app mobile en 28 jours. Sans savoir coder.
                </p>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
                >
                  Commencer maintenant
                </a>
                <p className="text-xs text-gray-600 mt-4">Garantie 30 jours satisfait ou rembourse</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-16 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
