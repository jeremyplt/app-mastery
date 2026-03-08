"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const forYou = [
  "Tu as une idée d'app (ou tu veux en trouver une) et tu veux passer à l'action",
  "Tu es prêt à consacrer 1 à 2 heures par jour pendant 28 jours",
  "Tu veux générer des revenus récurrents avec un produit digital",
  "Tu n'as jamais codé mais tu es motivé à apprendre avec l'IA",
  "Tu as déjà une app mais tu ne sais pas comment la marketer",
  "Tu veux un système éprouvé, pas des tutos éparpillés",
];

const notForYou = [
  "Tu cherches un \"get rich quick scheme\" sans effort",
  "Tu n'es pas prêt à investir du temps chaque jour",
  "Tu veux juste regarder des vidéos sans appliquer",
  "Tu attends que quelqu'un fasse tout le travail à ta place",
  "Tu n'es pas coachable et tu ne veux pas suivre un système",
];

export default function WhoIsThisForV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-emerald-400">
            Pour Qui ?
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            C&apos;est pour toi si...
          </h2>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column — Pour toi */}
          <motion.div
            className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-emerald-500/20"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-xl bg-white/5 overflow-hidden border-l-4 border-emerald-500/40">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="relative p-5">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">
                  C&apos;est pour toi si...
                </h3>
                <div className="flex flex-col gap-3">
                  {forYou.map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 mt-0.5">
                        <Check size={14} className="text-emerald-400" />
                      </div>
                      <p className="text-base text-gray-200">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column — Pas pour toi */}
          <motion.div
            className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-red-500/20 h-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-xl bg-white/5 overflow-hidden border-l-4 border-red-500/40 h-full">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="relative p-5">
                <h3 className="text-lg font-semibold text-red-400 mb-4">
                  Ce n&apos;est PAS pour toi si...
                </h3>
                <div className="flex flex-col gap-3">
                  {notForYou.map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 mt-0.5">
                        <X size={14} className="text-red-400" />
                      </div>
                      <p className="text-base text-gray-200">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
