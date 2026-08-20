"use client";

import { motion } from "framer-motion";

export default function HeroV3() {
  return (
    <section className="relative py-24 lg:py-32">
      {/* Hairline top */}
      <div className="relative before:absolute before:bottom-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--field)]" />

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-[var(--accent2)]">
            App Mastery
          </span>
        </div>

        {/* Main card */}
        <div className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[var(--sep)]">
          <div className="rounded-xl bg-[var(--field)]">
            <div className="grid lg:grid-cols-2">
              {/* Left: text content */}
              <div className="px-6 py-16 sm:px-12 sm:py-20 lg:py-24">
                <motion.h1
                  className="text-4xl/tight sm:text-5xl/tight font-medium tracking-[-0.035em] text-balance text-[var(--fg)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Cree et lance{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent2)] via-[var(--accent2)] to-[var(--accent)]">
                    ton app mobile
                  </span>{" "}
                  en 28 jours
                </motion.h1>

                <motion.p
                  className="mt-6 text-base/7 text-[var(--fg2)] max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  Sans savoir coder. Grace a l&apos;IA et au vibecoding, construis une app rentable
                  de A a Z et publie-la sur les stores.
                </motion.p>

                <motion.div
                  className="mt-10 flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <a
                    href="#pricing"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--accent2)] transition-colors"
                  >
                    Rejoindre la formation
                  </a>
                  <a
                    href="#program"
                    className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-[var(--fg2)] outline outline-[var(--sep)] hover:outline-[var(--sep)] transition-colors"
                  >
                    Voir le programme
                  </a>
                </motion.div>
              </div>

              {/* Right: terminal/code visual */}
              <motion.div
                className="relative hidden lg:flex items-center justify-center p-8 border-l border-[var(--sep)] overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Dot pattern background */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* Terminal mockup */}
                <div className="relative w-full max-w-sm">
                  <div className="rounded-xl bg-[var(--bg)] outline outline-[var(--sep)] overflow-hidden">
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--sep)]">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--field)]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--field)]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--field)]" />
                      </div>
                      <span className="text-xs text-[var(--fg3)] font-mono ml-2">terminal</span>
                      <div className="flex-1" />
                      <span className="rounded-full bg-[color-mix(in_srgb,var(--green)_10%,transparent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--green)] outline outline-[color-mix(in_srgb,var(--green)_20%,transparent)]">
                        iOS + Android
                      </span>
                      <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent2)] outline outline-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
                        Vibecoding
                      </span>
                    </div>

                    {/* Terminal content */}
                    <div className="p-4 font-mono text-xs/6 space-y-3">
                      <div>
                        <span className="text-[var(--fg3)]">$</span>{" "}
                        <span className="text-[var(--accent2)]">claude</span>{" "}
                        <span className="text-[var(--fg2)]">&quot;Cree mon app de fitness&quot;</span>
                      </div>
                      <div className="text-[var(--fg3)]">
                        <span className="text-[var(--green)]">&#10003;</span> Generation de la structure...
                      </div>
                      <div className="text-[var(--fg3)]">
                        <span className="text-[var(--green)]">&#10003;</span> Installation d&apos;Expo + React Native...
                      </div>
                      <div className="text-[var(--fg3)]">
                        <span className="text-[var(--green)]">&#10003;</span> Ajout de l&apos;auth Supabase...
                      </div>
                      <div className="text-[var(--fg3)]">
                        <span className="text-[var(--green)]">&#10003;</span> Configuration de RevenueCat...
                      </div>
                      <div className="text-[var(--fg3)]">
                        <span className="text-[var(--accent2)]">&#9679;</span>{" "}
                        <span className="text-[var(--fg)]">Construction des composants UI...</span>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[var(--sep)]">
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--fg3)]">Progression</span>
                          <span className="text-[var(--accent2)]">78%</span>
                        </div>
                        <div className="mt-2 h-1 rounded-full bg-[var(--field)] overflow-hidden">
                          <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]" />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>

            {/* Stats row */}
            <motion.div
              className="grid grid-cols-2 gap-8 sm:grid-cols-4 border-t border-[var(--sep)] px-6 sm:px-12 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {[
                { value: "28", label: "Jours" },
                { value: "14", label: "Modules" },
                { value: "90+", label: "Lecons" },
                { value: "4.9/5", label: "Satisfaction" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-semibold tracking-tight text-[var(--fg)]">{stat.value}</div>
                  <div className="mt-1 text-sm text-[var(--fg2)]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hairline bottom */}
      <div className="relative mt-16 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--field)]" />
    </section>
  );
}
