"use client";

import { motion } from "framer-motion";
import { Lightbulb, Code, Rocket } from "lucide-react";

// Present the METHOD before the product (Cattoni)
// "Le prospect doit croire en la solution avant d'acheter le produit"
const phases = [
  {
    icon: Lightbulb,
    phase: "Phase 1",
    title: "Concevoir",
    // Benefit, not feature
    description:
      "Trouve et valide une idée d'app qui a un vrai marché. Tu sauras exactement quoi construire et comment le monétiser avant d'écrire la moindre ligne.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Code,
    phase: "Phase 2",
    title: "Développer",
    description:
      "Je te montre le vrai workflow de vibe coding qui marche pour créer des apps mobiles. Tous les outils, les bonnes pratiques, et comment obtenir une app sans bug, sécurisée et prête à publier.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Rocket,
    phase: "Phase 3",
    title: "Lancer & Marketer",
    description:
      "Publie sur les stores, puis je t'accompagne sur tout le marketing : contenu organique, stratégie influenceurs, ASO. Une app sans visibilité ne fait pas d'argent. Je m'assure que la tienne en ait.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export default function SolutionV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-cyan-400">
            La Methode
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-4 max-w-2xl">
          {/* Proprietary method name (Brunson) — creates perceived IP */}
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            La Méthode App Mastery en 3 phases
          </h2>
          <p className="mt-4 text-base/7 text-gray-400">
            Pas de théorie inutile. Un système éprouvé qui transforme ton idée
            en app publiée, marketée et monétisée. De la conception au
            marketing, je t&apos;accompagne sur tout.
          </p>
        </div>

        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
          <div className="rounded-xl bg-white/5 p-2">
            <div className="grid md:grid-cols-3 gap-2">
              {phases.map((step, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-xl bg-gray-950 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div className="relative">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${step.bg} mb-4`}
                    >
                      <step.icon size={20} className={step.color} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {step.phase}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm/6 text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA after solution — repeating primary CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
          >
            Lancer mon app maintenant
          </a>
        </motion.div>

        {/* Open loop — transition to proof */}
        <motion.p
          className="mt-8 text-center text-lg font-semibold text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Mais ne me crois pas sur parole. Voici les résultats concrets...
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
