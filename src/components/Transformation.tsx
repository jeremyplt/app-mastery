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
          <span className="mac-eyebrow">Transformation</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-bold tracking-[-0.035em] text-balance text-[var(--fg)]">
            Imagine dans 28 jours...
          </h2>
          <p className="mt-4 text-xl/8 text-[var(--fg2)]">
            Tu ouvres ton téléphone et tu vois ton app sur l&apos;App Store et
            le Google Play Store. Avec de vrais utilisateurs. Et tes premiers
            revenus qui tombent.
          </p>
        </div>

        {/* Before/After grid — most persuasive format (Hormozi) */}
        <div className="overflow-hidden rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-2">
          <div className="relative overflow-hidden">
            {/* Header row */}
            <div className="relative grid grid-cols-2 gap-2 mb-2">
              <div className="rounded-lg bg-[var(--group)] px-5 py-3">
                <span className="text-sm font-semibold text-[var(--red)] uppercase tracking-wider">
                  Avant
                </span>
              </div>
              <div className="rounded-lg bg-[var(--group)] px-5 py-3">
                <span className="text-sm font-semibold text-[var(--green)] uppercase tracking-wider">
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
                  <div className="rounded-lg bg-[var(--group)] px-5 py-4">
                    <p className="text-lg text-[var(--fg2)] line-through decoration-[color-mix(in_srgb,var(--red)_40%,transparent)]">
                      {row.before}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--group)] px-5 py-4">
                    <p className="text-lg text-[var(--fg)] font-medium">
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
          className="mt-10 text-center text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[var(--fg)]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Ça te donne envie ? Voici les preuves que c&apos;est possible...
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
