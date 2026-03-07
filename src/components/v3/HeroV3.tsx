"use client";

import { motion } from "framer-motion";

export default function HeroV3() {
  return (
    <section className="relative py-24 lg:py-32">
      {/* Hairline top */}
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
                <motion.h1
                  className="text-4xl/tight sm:text-5xl/tight font-medium tracking-tighter text-balance text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Cree et lance{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500">
                    ton app mobile
                  </span>{" "}
                  en 28 jours
                </motion.h1>

                <motion.p
                  className="mt-6 text-base/7 text-gray-400 max-w-md"
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
                    className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
                  >
                    Rejoindre la formation
                  </a>
                  <a
                    href="#program"
                    className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-gray-300 outline outline-white/15 hover:outline-white/25 transition-colors"
                  >
                    Voir le programme
                  </a>
                </motion.div>
              </div>

              {/* Right: terminal/code visual */}
              <motion.div
                className="relative hidden lg:flex items-center justify-center p-8 border-l border-white/5 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Grid pattern background */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.06) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Terminal mockup */}
                <div className="relative w-full max-w-sm">
                  <div className="rounded-xl bg-gray-950 outline outline-white/10 overflow-hidden">
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      </div>
                      <span className="text-xs text-gray-600 font-mono ml-2">terminal</span>
                      <div className="flex-1" />
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 outline outline-emerald-500/20">
                        iOS + Android
                      </span>
                      <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-400 outline outline-violet-500/20">
                        Vibecoding
                      </span>
                    </div>

                    {/* Terminal content */}
                    <div className="p-4 font-mono text-xs/6 space-y-3">
                      <div>
                        <span className="text-gray-600">$</span>{" "}
                        <span className="text-sky-400">claude</span>{" "}
                        <span className="text-gray-400">&quot;Cree mon app de fitness&quot;</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="text-emerald-400">&#10003;</span> Generating project structure...
                      </div>
                      <div className="text-gray-600">
                        <span className="text-emerald-400">&#10003;</span> Setting up Expo + React Native...
                      </div>
                      <div className="text-gray-600">
                        <span className="text-emerald-400">&#10003;</span> Adding Supabase auth...
                      </div>
                      <div className="text-gray-600">
                        <span className="text-emerald-400">&#10003;</span> Configuring RevenueCat...
                      </div>
                      <div className="text-gray-600">
                        <span className="text-amber-400">&#9679;</span>{" "}
                        <span className="text-white">Building UI components...</span>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-sky-400">78%</span>
                        </div>
                        <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>

            {/* Stats row */}
            <motion.div
              className="grid grid-cols-2 gap-8 sm:grid-cols-4 border-t border-white/10 px-6 sm:px-12 py-8"
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
                  <div className="text-2xl font-semibold tracking-tight text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hairline bottom */}
      <div className="relative mt-16 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
