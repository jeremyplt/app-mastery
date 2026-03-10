"use client";

import { motion } from "framer-motion";

// Future pacing (Cattoni): help the prospect visualize their future
// "Imagine dans 3 mois..."
const beforeAfter = [
  {
    before: "Tu scrolles des tutos sans jamais finir un projet",
    after: "Tu as une app disponible sur l'App Store avec de vrais utilisateurs",
  },
  {
    before: "Tu ne sais pas comment faire le marketing de ton app",
    after: "Tes abonnements génèrent des revenus récurrents chaque mois",
  },
  {
    before: "Tu te sens bloqué par la complexité technique",
    after: "L'IA code pour toi et tu livres des fonctionnalités en quelques heures",
  },
  {
    before: "Tu repousses ton projet depuis des mois",
    after: "Tu as lancé quelque chose de concret dont tu es fier",
  },
];

export default function Transformation() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-base font-semibold tracking-widest uppercase text-emerald-400">
            Transformation
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Imagine dans 28 jours...
          </h2>
          <p className="mt-4 text-xl/8 text-gray-300">
            Tu ouvres ton téléphone et tu vois ton app sur l&apos;App Store et
            le Google Play Store. Avec de vrais utilisateurs. Et tes premiers
            revenus qui tombent.
          </p>
        </div>

        {/* Before/After grid — most persuasive format (Hormozi) */}
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-emerald-500/20">
          <div className="relative rounded-xl bg-white/5 p-2 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            {/* Header row */}
            <div className="relative grid grid-cols-2 gap-2 mb-2">
              <div className="rounded-lg bg-gray-950 px-5 py-3">
                <span className="text-sm font-semibold text-pink-400 uppercase tracking-wider">
                  Avant
                </span>
              </div>
              <div className="rounded-lg bg-gray-950 px-5 py-3">
                <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Après App Mastery
                </span>
              </div>
            </div>

            {/* Rows */}
            <div className="relative flex flex-col gap-1">
              {beforeAfter.map((row, i) => (
                <motion.div
                  key={i}
                  className="grid grid-cols-2 gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="rounded-lg bg-gray-950 px-5 py-4">
                    <p className="text-lg text-gray-300 line-through decoration-pink-500/30">
                      {row.before}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-950 px-5 py-4">
                    <p className="text-lg text-white font-medium">
                      {row.after}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Trial close */}
        <motion.p
          className="mt-10 text-center text-2xl sm:text-3xl font-medium tracking-tight text-white"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Ça te donne envie ? Voici les preuves que c&apos;est possible...
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
