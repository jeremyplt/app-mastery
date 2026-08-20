"use client";

import { motion } from "framer-motion";

export default function Agitation() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="badge badge-danger">Le coût de l&apos;inaction</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-[var(--fg)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Et si tu ne fais rien ?
          </motion.h2>

          <motion.div
            className="mt-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-xl/8 text-[var(--fg2)]">
              Tu te réveilles demain. Rien n&apos;a changé. Toujours le même
              scroll sur YouTube. Toujours la même liste d&apos;idées qui ne
              verra jamais le jour.
            </p>
            <p className="text-xl/8 text-[var(--fg2)]">
              Tu te dis &quot;je m&apos;y mets ce week-end&quot;. Le week-end
              passe. Tu regardes un autre tuto. Tu changes de framework. Tu
              recommences à zéro. Encore.
            </p>
            <p className="text-xl/8 text-[var(--fg2)]">
              Dans 6 mois, tu seras exactement au même endroit. Dans 1 an
              aussi.
            </p>
            <p className="text-xl font-medium text-[var(--fg)]">
              Pendant ce temps, d&apos;autres auront lancé leur app, trouvé
              leurs premiers utilisateurs, et commencé à générer des revenus
              récurrents. Pas parce qu&apos;ils sont plus intelligents que toi.
              Parce qu&apos;ils ont arrêté d&apos;attendre.
            </p>
          </motion.div>

          {/* Quantified cost of inaction (Hormozi) */}
          <motion.div
            className="mt-10 isolate overflow-hidden rounded-[16px] border-[0.5px] border-[color-mix(in_srgb,var(--red)_25%,transparent)] bg-[var(--card)] p-2"
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
              <div className="relative space-y-4">
                <p className="text-lg font-medium tracking-tight text-[var(--fg)]">
                  100 abonnés x 9,99€/mois ={" "}
                  <span className="text-[var(--red)] font-bold">
                    12 000€/an de revenus récurrents
                  </span>
                </p>
                <div className="h-px bg-[var(--sep)]" />
                <p className="text-2xl font-bold tracking-tight text-[var(--fg)]">
                  Chaque jour qui passe sans agir ={" "}
                  <span className="text-[var(--red)]">33€ de revenus perdus</span>
                </p>
                <p className="text-lg text-[var(--fg2)]">
                  Ça fait combien de jours que tu &quot;réfléchis&quot; ?
                  Multiplie par 33. C&apos;est ce que ça t&apos;a déjà coûté.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Open loop toward solution */}
          <motion.div
            className="mt-10 space-y-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-xl font-medium text-[var(--fg)]">
              Mais il y a une bonne nouvelle.
            </p>
            <p className="text-xl text-[var(--fg2)]">
              Quelqu&apos;un a déjà fait toutes les erreurs pour toi...
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
