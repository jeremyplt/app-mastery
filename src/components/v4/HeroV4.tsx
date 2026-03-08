"use client";

import { motion } from "framer-motion";

export default function HeroV4() {
  return (
    <section className="relative pt-24 pb-10 lg:pt-32 lg:pb-12">
      <div className="relative before:absolute before:bottom-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-sky-400">
            App Mastery
          </span>
        </div>

        {/* Main card */}
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
          <div className="rounded-xl bg-white/5">
            <div className="grid lg:grid-cols-2">
              {/* Left: text content */}
              <div className="px-6 py-16 sm:px-12 sm:py-20 lg:py-24">
                {/* H.O.T. Headline: Hook + Outcome + Timeframe */}
                <motion.h1
                  className="text-4xl/tight sm:text-5xl/tight font-medium tracking-tighter text-balance text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Génère tes{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500">
                    premiers revenus récurrents
                  </span>{" "}
                  avec une app mobile en 28 jours
                </motion.h1>

                {/* Subheadline: mecanisme + sans effort */}
                <motion.p
                  className="mt-6 text-lg/7 text-gray-300 max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  Sans écrire une ligne de code toi-même, grâce au vibe coding
                  IA. Même si tu n&apos;as jamais développé. Même si tu
                  n&apos;as pas encore d&apos;idée.
                </motion.p>

                {/* Micro-bullets: 3 benefices cles (future pacing) */}
                <motion.ul
                  className="mt-6 space-y-2 text-sm text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                >
                  {[
                    "L'IA écrit le code. Tu diriges la vision.",
                    "De l'idée à la publication sur les stores.",
                    "Marketing, influenceurs et monétisation inclus.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </motion.ul>

                {/* Single CTA — "Call to Value" not "Call to Action" */}
                <motion.div
                  className="mt-10 flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                >
                  <a
                    href="#pricing"
                    className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
                  >
                    Accéder maintenant
                  </a>
                  <a
                    href="#program"
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-gray-300 outline outline-white/15 hover:outline-white/25 transition-colors"
                  >
                    Voir le programme
                  </a>
                </motion.div>

                {/* Micro social proof */}
                <motion.div
                  className="mt-6 flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex -space-x-2">
                    {[
                      "bg-sky-500",
                      "bg-violet-500",
                      "bg-emerald-500",
                      "bg-amber-500",
                    ].map((bg, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full ${bg} border-2 border-gray-950 flex items-center justify-center text-[10px] font-bold text-white`}
                      >
                        {/* PLACEHOLDER: remplacer par de vraies photos */}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-950 flex items-center justify-center text-sm font-semibold text-white">
                      +
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    Ils ont déjà lancé leur app
                  </span>
                </motion.div>
              </div>

              {/* Right: terminal/code visual — shows the "before/after" */}
              <motion.div
                className="relative hidden lg:flex items-center justify-center p-8 border-l border-white/5 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* Revenue dashboard mockup */}
                <div className="relative w-full max-w-sm">
                  <div className="rounded-xl bg-gray-950 outline outline-white/10 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      </div>
                      <span className="text-xs text-gray-600 font-mono ml-2">
                        RevenueCat Dashboard
                      </span>
                      <div className="flex-1" />
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 outline outline-emerald-500/20">
                        Live
                      </span>
                    </div>

                    <div className="p-6 space-y-5">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Revenus récurrents annuels (ARR)</p>
                        <p className="text-3xl font-semibold tracking-tight text-emerald-400">140 000 $</p>
                      </div>

                      {/* Simple bar chart */}
                      <div className="flex items-end gap-1.5 h-20">
                        {[15, 25, 30, 38, 45, 55, 62, 70, 78, 88, 95, 100].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm bg-gradient-to-t from-sky-500/60 to-emerald-400/60"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-xs text-gray-600">Abonnés actifs</p>
                          <p className="text-sm font-semibold text-white">1 247</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">MRR</p>
                          <p className="text-sm font-semibold text-white">11 667 $</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Note App Store</p>
                          <p className="text-sm font-semibold text-white">4.9/5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats row — social proof numbers */}
            <motion.div
              className="grid grid-cols-2 gap-8 sm:grid-cols-4 border-t border-white/10 px-6 sm:px-12 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {[
                { value: "140K$/an", label: "Générés avec une seule app" },
                { value: "28", label: "Jours pour lancer" },
                { value: "4.9/5", label: "Note App Store (5 009 avis)" },
                { value: "À Vie", label: "Accès & mises à jour" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative mt-16 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
