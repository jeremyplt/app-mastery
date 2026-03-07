"use client";

import { motion } from "framer-motion";
import { Sparkles, Code, Rocket } from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "L'IA ecrit le code",
    description: "Claude Code genere le code de ton app a partir de tes instructions en francais.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Code,
    title: "Tu apprends en construisant",
    description: "Pas de theorie inutile. Chaque lecon te fait avancer concretement sur ton app.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Rocket,
    title: "Tu publies et monetises",
    description: "Abonnements, publication stores, marketing — tout est couvert pour generer des revenus.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export default function SolutionV3() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-cyan-400">
            La Solution
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Le vibecoding change tout
          </h2>
          <p className="mt-4 text-base/7 text-gray-400">
            Une methode en 3 etapes qui transforme tes idees en apps publiees sur les stores.
          </p>
        </div>

        {/* Big container card with 3 feature cards inside */}
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
          <div className="rounded-xl bg-white/5 p-2">
            <div className="grid md:grid-cols-3 gap-2">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-xl bg-gray-950 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  {/* Dot pattern */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div className="relative">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${step.bg} mb-4`}>
                      <step.icon size={20} className={step.color} />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm/6 text-gray-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
