"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

const painPoints = [
  { title: "Zero competences techniques", desc: "Tu as une idee d'app mais tu ne sais pas coder" },
  { title: "Tutos sans fin", desc: "Tu as essaye des tutos mais tu n'as jamais fini un projet" },
  { title: "Monetisation floue", desc: "Tu ne sais pas comment generer des revenus avec une app" },
  { title: "Complexite technique", desc: "Tu perds du temps sur des details techniques inutiles" },
  { title: "Publication mystere", desc: "Tu ne sais pas comment publier sur les stores" },
  { title: "Sentiment de blocage", desc: "Tu te sens depasse par l'ampleur de la tache" },
];

export default function PainPointsV3() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-[var(--red)]">
            Le Probleme
          </span>
          <div className="h-px flex-1 bg-[var(--field)]" />
        </div>

        {/* Heading */}
        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-[-0.035em] text-balance text-[var(--fg)]">
            Tu reconnais cette situation ?
          </h2>
          <p className="mt-4 text-base/7 text-[var(--fg2)]">
            Des milliers de personnes ont les memes blocages. La bonne nouvelle: ils sont tous resolubles.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid md:grid-cols-2 gap-2">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[var(--sep)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="relative rounded-xl bg-[var(--field)] p-6">
                {/* Dot pattern background */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-30"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--red)_10%,transparent)]">
                    <X size={16} className="text-[var(--red)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--fg)]">{point.title}</h3>
                    <p className="mt-1 text-sm text-[var(--fg2)]">{point.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--field)]" />
    </section>
  );
}
