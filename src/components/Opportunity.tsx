"use client";

import { motion } from "framer-motion";

const saasPoints = [
  "Marché saturé, des milliers de concurrents",
  "Course au prix le plus bas",
  "Coût d'acquisition client élevé",
  "Tout le monde fait la même chose",
];

const appPoints = [
  "Marché oublié, niches inexploitées",
  "Revenus récurrents via abonnements",
  "Distribution gratuite via les stores",
  "Barrière à l'entrée = moins de concurrence",
];

export default function Opportunity() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-base font-semibold tracking-widest uppercase text-emerald-400">
            L&apos;Opportunité
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Tout le monde se bat sur les SaaS.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Le vrai argent est ailleurs.
            </span>
          </h2>
          <p className="mt-4 text-xl/8 text-gray-300">
            En 2026, le marché SaaS est bondé. Des milliers de nouvelles apps
            web chaque jour, toutes identiques. Pendant ce temps, un marché
            gigantesque est passé sous les radars.
          </p>
        </div>

        {/* SaaS vs Apps comparison */}
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
          <div className="rounded-xl bg-white/5 p-2">
            <div className="grid md:grid-cols-2 gap-2">
              {/* SaaS column */}
              <motion.div
                className="relative overflow-hidden rounded-xl bg-gray-950 p-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        SaaS en 2026
                      </p>
                      <p className="text-base text-red-400 font-medium">
                        Océan rouge
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {saasPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-red-400 text-lg mt-0.5">
                          &#10005;
                        </span>
                        <p className="text-lg text-gray-300">{point}</p>
                      </div>
                    ))}
                  </div>

                  {/* Declining chart */}
                  <div className="mt-6 flex items-end gap-1 h-20">
                    {[85, 80, 70, 65, 55, 50, 40, 35, 30, 25, 20, 18].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-gradient-to-t from-red-500/40 to-red-400/20"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Marges en baisse
                  </p>
                </div>
              </motion.div>

              {/* Apps column */}
              <motion.div
                className="relative overflow-hidden rounded-xl bg-gray-950 p-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                      <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        Apps Mobiles en 2026
                      </p>
                      <p className="text-base text-emerald-400 font-medium">
                        Océan bleu
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {appPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-emerald-400 text-lg mt-0.5">
                          &#10003;
                        </span>
                        <p className="text-lg text-gray-300">{point}</p>
                      </div>
                    ))}
                  </div>

                  {/* Growing chart */}
                  <div className="mt-6 flex items-end gap-1 h-20">
                    {[15, 20, 25, 30, 40, 45, 55, 60, 70, 78, 88, 100].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500/40 to-emerald-400/20"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Revenus en hausse
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Market size stat */}
        <motion.div
          className="mt-6 isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-emerald-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative rounded-xl bg-white/5 p-8 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="relative text-center space-y-4">
              <p className="text-5xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                500 milliards $
              </p>
              <p className="text-xl text-gray-300 max-w-lg mx-auto">
                C&apos;est le marché mondial des apps mobiles. Et il grandit
                chaque année. La plupart des gens n&apos;en profitent pas parce
                qu&apos;ils pensent que c&apos;est &quot;trop compliqué&quot;.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Punchline */}
        <motion.div
          className="mt-10 text-center space-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-xl font-medium text-white">
            Et grâce à l&apos;IA, tu n&apos;as plus besoin de savoir coder pour
            en profiter.
          </p>
          <p className="text-xl text-gray-300">
            Il te manque juste la méthode. Et quelqu&apos;un qui l&apos;a déjà
            fait pour te montrer le chemin.
          </p>
        </motion.div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
