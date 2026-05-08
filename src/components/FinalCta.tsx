"use client";

import { motion } from "framer-motion";

// Final CTA: recap promise + qualifying call CTA
export default function FinalCta() {
  return (
    <section className="relative py-24">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-amber-500/20">
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10" />
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
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
                <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white mb-6">
                  Tu veux te faire accompagner ?
                </h2>

                <div className="max-w-xl mx-auto space-y-4 mb-10">
                  <p className="text-xl/8 text-gray-300 font-medium">
                    Réserve un appel gratuit pour qu&apos;on fasse le point sur ta situation et qu&apos;on crée une solution sur mesure pour toi.
                  </p>
                  <p className="text-lg text-white/70">
                    Que tu aies déjà une app qui stagne ou juste une idée en tête, on regarde ensemble ce qui bloque et on définit les prochaines étapes concrètes.
                  </p>
                </div>

                <a
                  href="https://calendly.com/jeremypltpro/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-10 py-4 text-lg font-bold text-white hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/25"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Réserve ton appel gratuit
                </a>

                <p className="text-base text-white/50 mt-4">
                  30 minutes, sans engagement. On parle de ton projet.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-16 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
