"use client";

import { motion } from "framer-motion";

const achievements = [
  "Une app publiee sur l'App Store ET Google Play",
  "Un systeme d'abonnements qui genere des revenus",
  "Un pipeline marketing pour acquerir des utilisateurs",
  "La maitrise de Claude Code et du vibecoding",
  "Un portfolio de competences recherchees",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Transformation() {
  return (
    <section className="section">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center mb-12 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Dans 28 Jours, Tu Auras...
        </motion.h2>

        <motion.div
          className="glass p-4 md:p-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col gap-2">
            {achievements.map((text, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-center gap-4 rounded-xl bg-[rgba(34,197,94,0.04)] px-5 py-4"
              >
                <span className="text-[var(--color-success)] font-bold text-lg shrink-0 font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm md:text-base font-medium">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
