"use client";

import { motion } from "framer-motion";

const achievements = [
  "Une app publiee sur l'App Store ET Google Play",
  "Un systeme d'abonnements qui genere des revenus",
  "Un pipeline marketing pour acquerir des utilisateurs",
  "La maitrise de Claude Code et du vibecoding",
  "Un portfolio de competences recherchees",
];

export default function TransformationV3() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-emerald-400">
            Resultats
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Dans 28 jours, tu auras...
          </h2>
        </div>

        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-emerald-500/20">
          <div className="relative rounded-xl bg-white/5 p-2 overflow-hidden">
            {/* Dot pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="relative flex flex-col gap-1">
              {achievements.map((text, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 rounded-lg bg-gray-950 px-5 py-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <span className="font-mono text-sm font-semibold text-emerald-400/50 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-medium text-white">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
