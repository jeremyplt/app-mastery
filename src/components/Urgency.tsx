"use client";

import { motion } from "framer-motion";
import { CountdownTimerLarge } from "./CountdownTimer";

export default function Urgency() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-red-500/30">
          <div className="relative rounded-xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-amber-500/10" />
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative px-6 py-16 sm:py-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Pulsing dot + label */}
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-4 py-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-red-400">
                      Fermeture imminente
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white mb-4">
                  Les inscriptions ferment dans :
                </h2>

                {/* Big countdown */}
                <div className="mb-10">
                  <CountdownTimerLarge />
                </div>

                <div className="max-w-xl mx-auto space-y-6">
                  <p className="text-lg text-white/90 font-medium">
                    Ce n&apos;est pas un faux compte à rebours. Ce n&apos;est pas un piège marketing. Quand le timer arrive à zéro, <span className="text-white font-bold">je ferme les inscriptions et je refuse les paiements</span>.
                  </p>
                  <p className="text-lg text-white/80 font-medium">
                    Pourquoi ? Parce que je veux accompagner chaque élève personnellement. Si j&apos;accepte trop de monde, la qualité baisse. Et ça, c&apos;est hors de question.
                  </p>
                  <p className="text-lg text-white/80 font-medium">
                    Si tu reviens dans 2 semaines en disant &quot;je suis prêt&quot;, la réponse sera non. Pas par méchanceté, mais parce que les portes seront fermées. Je ne sais pas quand je rouvrirai.
                  </p>
                  <p className="text-xl font-bold text-amber-400">
                    Tu es soit dedans, soit dehors. Et c&apos;est maintenant que ça se décide.
                  </p>
                </div>

                {/* CTA */}
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-10 py-4 text-lg font-bold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25 mt-10"
                  data-ph-capture-attribute-section="urgency-cta"
                >
                  Rejoindre avant la fermeture
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
