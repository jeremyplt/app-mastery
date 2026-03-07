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
          className="flex flex-col"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {achievements.map((text, i) => (
            <motion.div key={i} variants={itemVariants}>
              <div className="flex items-center gap-4 py-6">
                <span className="text-[var(--fg)] font-bold text-xl shrink-0">
                  {i + 1}.
                </span>
                <p className="text-base md:text-lg font-medium">{text}</p>
              </div>
              {i < achievements.length - 1 && <div className="divider" />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
