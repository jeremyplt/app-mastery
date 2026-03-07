"use client";

import { motion } from "framer-motion";

export default function AgitationV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-red-400">
            Le Cout De L&apos;Inaction
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Amplification — Kahneman: loss aversion > desire for gain */}
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white"
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
            <p className="text-base/7 text-gray-400">
              Dans 6 mois, tu seras exactement au meme endroit. Toujours en
              train de regarder des tutos. Toujours sans app. Toujours sans
              revenus supplementaires.
            </p>
            <p className="text-base/7 text-gray-400">
              Pendant ce temps, d&apos;autres personnes — pas plus intelligentes
              que toi — auront lance leur app, recu leurs premiers paiements, et
              commence a construire quelque chose qui leur appartient.
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
              <div className="relative">
                <p className="text-xl font-medium tracking-tight text-white mb-3">
                  {/* PLACEHOLDER: adapter avec tes propres calculs */}
                  Chaque mois sans agir = un mois de revenus en moins
                </p>
                <p className="text-sm text-gray-500">
                  Une app avec seulement 200 abonnes a 4,99$/mois = pres de
                  12 000$/an de revenus recurrents. Combien de mois as-tu deja
                  perdu ?
                </p>
              </div>
            </div>
          </motion.div>

          {/* Transition toward solution */}
          <motion.p
            className="mt-8 text-base font-medium text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            La bonne nouvelle ? Il existe maintenant une methode pour lancer ton
            app en 28 jours — sans ecrire de code toi-meme.
          </motion.p>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
