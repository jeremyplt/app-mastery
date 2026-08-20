"use client";

import { motion } from "framer-motion";
import { Lightbulb, Code, Rocket, Megaphone } from "lucide-react";

const steps = [
  {
    week: "Sem. 1",
    title: "Idée & validation",
    desc: "Trouve et valide une idée d'app avec un vrai marché.",
    icon: Lightbulb,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    lineFrom: "from-cyan-500/30",
    lineTo: "to-violet-500/30",
    mobileLine: "to-cyan-400/40",
  },
  {
    week: "Sem. 2",
    title: "Développement",
    desc: "Construis ton app avec le vibe coding et l'IA.",
    icon: Code,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    lineFrom: "from-cyan-500/30",
    lineTo: "to-violet-500/30",
    mobileLine: "to-violet-400/40",
  },
  {
    week: "Sem. 3",
    title: "Publication",
    desc: "Publie sur l'App Store.",
    icon: Rocket,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    lineFrom: "from-violet-500/30",
    lineTo: "to-amber-500/30",
    mobileLine: "to-amber-400/40",
  },
  {
    week: "Sem. 4",
    title: "Marketing",
    desc: "Lance ta stratégie marketing et génère tes premiers revenus.",
    icon: Megaphone,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    lineFrom: "from-amber-500/30",
    lineTo: "to-emerald-500/30",
    mobileLine: "to-emerald-400/40",
  },
];

export default function Timeline() {
  return (
    <section className="relative pt-2 pb-10">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Mobile: vertical */}
        <div className="flex flex-col items-center gap-0 lg:hidden">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {i > 0 && (
                <div className={`w-0.5 h-4 my-2 rounded-full bg-gradient-to-b from-transparent ${step.mobileLine}`} />
              )}
              <div
                className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full ${step.bg} border ${step.border}`}
              >
                <step.icon size={22} className={step.color} />
              </div>
              <span className={`mt-2 text-xs font-semibold uppercase tracking-wider ${step.color}`}>
                {step.week}
              </span>
              <span className="mt-1 text-lg font-medium text-[var(--fg)]">
                {step.title}
              </span>
              <span className="mt-1 text-lg text-[var(--fg2)] max-w-xs">
                {step.desc}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden lg:grid grid-cols-4 gap-0 items-start">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {/* Icon with horizontal connecting line */}
              <div className="relative flex items-center w-full justify-center">
                {i > 0 && (
                  <div className={`absolute right-[calc(50%+2rem)] top-1/2 h-px left-[calc(-50%+2rem)] bg-gradient-to-r ${step.lineFrom} ${step.lineTo}`} />
                )}
                <div
                  className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full ${step.bg} border ${step.border}`}
                >
                  <step.icon size={22} className={step.color} />
                </div>
              </div>
              <span className={`mt-3 text-xs font-semibold uppercase tracking-wider ${step.color}`}>
                {step.week}
              </span>
              <span className="mt-1 text-lg font-medium text-[var(--fg)]">
                {step.title}
              </span>
              <span className="mt-1 text-base text-[var(--fg2)] max-w-[180px]">
                {step.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative mt-10 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
