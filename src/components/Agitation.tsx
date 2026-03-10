"use client";

import { motion } from "framer-motion";

export default function Agitation() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-base font-semibold tracking-widest uppercase text-red-400">
            Le Cout De L&apos;Inaction
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white"
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
            <p className="text-xl/8 text-gray-300">
              Tu te réveilles demain. Rien n&apos;a changé. Toujours le même
              scroll sur YouTube. Toujours la même liste d&apos;idées qui ne
              verra jamais le jour.
            </p>
            <p className="text-xl/8 text-gray-300">
              Tu te dis &quot;je m&apos;y mets ce week-end&quot;. Le week-end
              passe. Tu regardes un autre tuto. Tu changes de framework. Tu
              recommences à zéro. Encore.
            </p>
            <p className="text-xl/8 text-gray-300">
              Dans 6 mois, tu seras exactement au même endroit. Dans 1 an
              aussi.
            </p>
            <p className="text-xl font-medium text-white">
              Pendant ce temps, d&apos;autres auront lancé leur app, trouvé
              leurs premiers utilisateurs, et commencé à générer des revenus
              récurrents. Pas parce qu&apos;ils sont plus intelligents que toi.
              Parce qu&apos;ils ont arrêté d&apos;attendre.
            </p>
          </motion.div>

          {/* Quantified cost of inaction (Hormozi) */}
          <motion.div
            className="mt-10 isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-red-500/20"
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
              <div className="relative space-y-4">
                <p className="text-lg font-medium tracking-tight text-white">
                  100 abonnés x 9,99€/mois ={" "}
                  <span className="text-red-400 font-bold">
                    12 000€/an de revenus récurrents
                  </span>
                </p>
                <div className="h-px bg-white/10" />
                <p className="text-2xl font-bold tracking-tight text-white">
                  Chaque jour qui passe sans agir ={" "}
                  <span className="text-red-400">33€ de revenus perdus</span>
                </p>
                <p className="text-lg text-gray-300">
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
            <p className="text-xl font-medium text-white">
              Mais il y a une bonne nouvelle.
            </p>
            <p className="text-xl text-gray-300">
              Quelqu&apos;un a déjà fait toutes les erreurs pour toi...
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
