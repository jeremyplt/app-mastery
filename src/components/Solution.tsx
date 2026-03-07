"use client";

import { motion } from "framer-motion";
import { Lightbulb, Code, TrendingUp, Play } from "lucide-react";

const pillars = [
  {
    icon: Lightbulb,
    title: "Idee → Validation",
    description:
      "Trouve et valide une idee d'app rentable avec une methode eprouvee",
  },
  {
    icon: Code,
    title: "Developpement → Publication",
    description:
      "Code et publie ton app sur les deux stores grace au vibecoding avec Claude Code",
  },
  {
    icon: TrendingUp,
    title: "Marketing → Revenus",
    description:
      "Lance et monetise ton app avec des strategies marketing qui fonctionnent",
  },
];

export default function Solution() {
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Decouvre App Secrets
          </h2>
          <p className="text-[var(--muted-fg)] text-lg max-w-2xl mx-auto">
            La formation complete pour creer une app mobile rentable de A a Z
            avec l&apos;IA
          </p>
        </motion.div>

        {/* Video placeholder */}
        <motion.div
          className="card aspect-video max-w-3xl mx-auto mb-14 flex flex-col items-center justify-center cursor-pointer"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <Play className="text-black ml-1" size={28} fill="black" />
          </div>
          <p className="text-[var(--muted-fg)] mt-4 text-sm">
            Video de presentation
          </p>
        </motion.div>

        {/* 3 feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              className="card p-6 text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <pillar.icon
                className="text-[var(--muted-fg)] mx-auto mb-4"
                size={32}
              />
              <h3 className="text-lg font-semibold mb-2">{pillar.title}</h3>
              <p className="text-[var(--muted-fg)] text-sm leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
