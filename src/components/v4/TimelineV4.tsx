"use client";

import { motion } from "framer-motion";
import { Lightbulb, Code, Rocket, Megaphone } from "lucide-react";

const steps = [
  {
    week: "Sem. 1",
    title: "Idée & validation",
    icon: Lightbulb,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
  },
  {
    week: "Sem. 2",
    title: "Développement",
    icon: Code,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
  {
    week: "Sem. 3",
    title: "Publication",
    icon: Rocket,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  {
    week: "Sem. 4",
    title: "Marketing",
    icon: Megaphone,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
];

export default function TimelineV4() {
  return (
    <section className="relative pt-2 pb-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute top-7 left-[55%] right-[-45%] h-px bg-white/10 hidden sm:block" />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full ${step.bg} border ${step.border}`}
              >
                <step.icon size={22} className={step.color} />
              </div>

              {/* Label */}
              <span className={`mt-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${step.color}`}>
                {step.week}
              </span>
              <span className="mt-1 text-xs sm:text-sm font-medium text-white">
                {step.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative mt-10 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
