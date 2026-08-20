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
          <span className="badge badge-success">L&apos;Opportunité</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-[var(--fg)]">
            Tout le monde se bat sur les SaaS.{" "}
            <span className="text-[var(--green)]">
              Le vrai argent est ailleurs.
            </span>
          </h2>
          <p className="mt-4 text-xl/8 text-[var(--fg2)]">
            En 2026, le marché SaaS est bondé. Des milliers de nouvelles apps
            web chaque jour, toutes identiques. Pendant ce temps, un marché
            gigantesque est passé sous les radars.
          </p>
        </div>

        {/* SaaS vs Apps comparison */}
        <div className="isolate overflow-hidden rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-2">
          <div className="rounded-[12px] p-2">
            <div className="grid md:grid-cols-2 gap-2">
              {/* SaaS column */}
              <motion.div
                className="relative overflow-hidden rounded-[12px] bg-[var(--group)] p-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(var(--sep) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--red)_14%,transparent)]">
                      <svg
                        className="w-5 h-5 text-[var(--red)]"
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
                      <p className="text-lg font-semibold text-[var(--fg)]">
                        SaaS en 2026
                      </p>
                      <p className="text-base text-[var(--red)] font-medium">
                        Océan rouge
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {saasPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-[var(--red)] text-lg mt-0.5">
                          &#10005;
                        </span>
                        <p className="text-lg text-[var(--fg2)]">{point}</p>
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
                  <p className="mt-2 text-base text-[var(--fg2)] text-center">
                    Marges en baisse
                  </p>
                </div>
              </motion.div>

              {/* Apps column */}
              <motion.div
                className="relative overflow-hidden rounded-[12px] bg-[var(--group)] p-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(var(--sep) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--green)_14%,transparent)]">
                      <svg
                        className="w-5 h-5 text-[var(--green)]"
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
                      <p className="text-lg font-semibold text-[var(--fg)]">
                        Apps Mobiles en 2026
                      </p>
                      <p className="text-base text-[var(--green)] font-medium">
                        Océan bleu
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {appPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-[var(--green)] text-lg mt-0.5">
                          &#10003;
                        </span>
                        <p className="text-lg text-[var(--fg2)]">{point}</p>
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
                  <p className="mt-2 text-base text-[var(--fg2)] text-center">
                    Revenus en hausse
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Market size stat */}
        <motion.div
          className="mt-6 isolate overflow-hidden rounded-[16px] border-[0.5px] border-[color-mix(in_srgb,var(--green)_25%,transparent)] bg-[var(--card)] p-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative rounded-[12px] p-8 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(var(--sep) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="relative text-center space-y-4">
              <p className="text-5xl sm:text-6xl font-bold tracking-tight text-[var(--green)]">
                500 milliards $
              </p>
              <p className="text-xl text-[var(--fg2)] max-w-lg mx-auto">
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
          <p className="text-xl font-medium text-[var(--fg)]">
            Et grâce à l&apos;IA, tu n&apos;as plus besoin de savoir coder pour
            en profiter.
          </p>
          <p className="text-xl text-[var(--fg2)]">
            Il te manque juste la méthode. Et quelqu&apos;un qui l&apos;a déjà
            fait pour te montrer le chemin.
          </p>
        </motion.div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
