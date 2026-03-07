"use client";

import { motion } from "framer-motion";

// Final CTA: recap promise + P.S. + urgency (Cattoni: CTA must ALWAYS be the last visible thing)
export default function FinalCtaV4() {
  return (
    <section className="relative py-24">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-sky-500/20">
          <div className="relative rounded-xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-violet-500/10" />
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
                {/* Recap the transformation promise */}
                <h2 className="text-3xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white mb-6">
                  Dans 28 jours, tu pourrais avoir ton app sur les stores
                </h2>
                <p className="text-base/7 text-gray-400 mb-4 max-w-lg mx-auto">
                  Ou tu peux continuer a regarder des tutos et repousser ton
                  projet. Le choix t&apos;appartient.
                </p>

                {/* Recap value */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-sm text-gray-500">
                  <span>90+ lecons</span>
                  <span className="text-white/20">|</span>
                  <span>1 591$+ de bonus inclus</span>
                  <span className="text-white/20">|</span>
                  <span>Garantie 30 jours</span>
                </div>

                {/* Final CTA */}
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
                >
                  Lancer mon app maintenant
                </a>

                <p className="text-xs text-gray-600 mt-4">
                  Garantie 30 jours satisfait ou rembourse &mdash; zero risque
                </p>

                {/* P.S. — Cattoni: le P.S. rappelle le benefice principal */}
                <div className="mt-10 pt-8 border-t border-white/5 max-w-md mx-auto">
                  <p className="text-xs text-gray-500 italic">
                    P.S. &mdash; Rappelle-toi : une app avec seulement 200
                    abonnes a 4,99$/mois = pres de 12 000$/an. La formation se
                    rembourse des ton premier mois de revenus. Et si ca ne
                    marche pas, tu as la garantie 30 jours.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-16 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
