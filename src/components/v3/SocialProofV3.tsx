"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "28", label: "Jours de programme", color: "text-[var(--accent2)]" },
  { value: "14", label: "Modules complets", color: "text-[var(--accent2)]" },
  { value: "90+", label: "Lecons video", color: "text-[var(--red)]" },
  { value: "A Vie", label: "Acces illimite", color: "text-[var(--accent2)]" },
];

export default function SocialProofV3() {
  return (
    <section className="py-16">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[var(--sep)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="rounded-xl bg-[var(--field)] p-6 text-center">
                <div className={`text-3xl font-semibold tracking-tight ${stat.color}`}>{stat.value}</div>
                <div className="mt-1 text-sm text-[var(--fg2)]">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-16 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--field)]" />
    </section>
  );
}
