"use client";

import { motion } from "framer-motion";
import { Lightbulb, Code, Rocket } from "lucide-react";
import { useIsExpired } from "./CountdownTimer";

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
      "Publie sur l'App Store, puis je t'accompagne sur tout le marketing : contenu gratuit, stratégie influenceurs, référencement d'app. Une app sans visibilité ne fait pas d'argent. Je m'assure que la tienne en ait.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export default function Solution() {
  const expired = useIsExpired();

  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="badge badge-blue">La Méthode</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-4 max-w-2xl">
          {/* Proprietary method name (Brunson) — creates perceived IP */}
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-[var(--fg)]">
            La Méthode App Mastery en 3 phases
          </h2>
          <p className="mt-4 text-xl/8 text-[var(--fg2)]">
            Pas de théorie inutile. Un système éprouvé qui transforme ton idée
            en app publiée, marketée et monétisée. De la conception au
            marketing, je t&apos;accompagne sur tout.
          </p>
        </div>

        <div className="isolate overflow-hidden rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-2">
          <div className="rounded-[12px] p-2">
            <div className="grid md:grid-cols-3 gap-2">
              {phases.map((step, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-[12px] bg-[var(--group)] p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(var(--sep) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div className="relative">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${step.bg} mb-4`}
                    >
                      <step.icon size={20} className={step.color} />
                    </div>
                    <span className="text-sm font-semibold text-[var(--fg3)] uppercase tracking-wider">
                      {step.phase}
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-lg/7 text-[var(--fg2)]">
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
          {expired ? (
            <span className="inline-flex items-center justify-center rounded-full bg-[var(--field)] px-8 py-4 text-lg font-bold text-[var(--fg3)] cursor-not-allowed">
              Inscription fermée
            </span>
          ) : (
            <a
              href="#pricing"
              className="btn-primary text-lg px-8 py-4"
              data-ph-capture-attribute-section="solution"
            >
              Lancer mon app maintenant
            </a>
          )}
        </motion.div>

        {/* Open loop — transition to proof */}
        <motion.p
          className="mt-8 text-center text-xl font-semibold text-[var(--fg)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Mais ne me crois pas sur parole. Voici les résultats concrets...
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
