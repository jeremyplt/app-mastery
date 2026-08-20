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

export default function WhoIsThisFor() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="mac-eyebrow" style={{ color: "var(--green)" }}>
            Pour qui ?
          </span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-bold tracking-[-0.03em] text-balance text-[var(--fg)]">
            C&apos;est pour toi si...
          </h2>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column — Pour toi */}
          <motion.div
            className="rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] overflow-hidden"
            style={{ borderLeft: "3px solid color-mix(in srgb, var(--green) 55%, transparent)" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--green)" }}>
                C&apos;est pour toi si...
              </h3>
              <div className="flex flex-col gap-3.5">
                {forYou.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <span className="mac-chk mt-0.5">
                      <Check size={13} strokeWidth={3.5} className="text-white" />
                    </span>
                    <p className="text-[17px] leading-relaxed text-[var(--fg2)]">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column — Pas pour toi */}
          <motion.div
            className="rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] overflow-hidden h-full"
            style={{ borderLeft: "3px solid color-mix(in srgb, var(--red) 55%, transparent)" }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 h-full">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--red)" }}>
                Ce n&apos;est PAS pour toi si...
              </h3>
              <div className="flex flex-col gap-3.5">
                {notForYou.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] mt-0.5"
                      style={{ background: "color-mix(in srgb, var(--red) 20%, transparent)" }}
                    >
                      <X size={14} strokeWidth={3} style={{ color: "var(--red)" }} />
                    </span>
                    <p className="text-[17px] leading-relaxed text-[var(--fg2)]">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
