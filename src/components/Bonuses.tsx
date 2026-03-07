"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  GitBranch,
  Eye,
  Users,
  RefreshCw,
  ArrowDown,
} from "lucide-react";

const bonuses = [
  {
    title: "Masterclass Claude Code",
    value: "297$",
    description: "Le guide le plus complet sur le meilleur agent IA",
    icon: Bot,
  },
  {
    title: "Module IA Complet",
    value: "197$",
    description: "Maitriser Perplexity, Claude, ChatGPT et plus",
    icon: Sparkles,
  },
  {
    title: "Formation Git/GitHub",
    value: "147$",
    description: "Versioning de A a Z, du debutant au pro",
    icon: GitBranch,
  },
  {
    title: "Case Study Shinobi Japanese",
    value: "197$",
    description: "Transparence totale sur une vraie app en production",
    icon: Eye,
  },
  {
    title: "Communaute Privee a Vie",
    value: "Inestimable",
    description: "Acces permanent au groupe d'entraide",
    icon: Users,
  },
  {
    title: "Mises a Jour a Vie",
    value: "Inestimable",
    description: "Nouveaux modules, tech news, ressources",
    icon: RefreshCw,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
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

export default function Bonuses() {
  return (
    <section className="section">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Les <span className="text-[var(--fg)]">Bonus Exclusifs</span>
          </h2>
          <p className="text-[var(--muted-fg)] text-base md:text-lg mt-4">
            Inclus sans frais supplementaires avec ta formation
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {bonuses.map((bonus) => (
            <motion.div
              key={bonus.title}
              className="card p-6 flex items-start gap-4"
              variants={itemVariants}
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                <bonus.icon className="w-5 h-5 text-[var(--muted-fg)]" />
              </div>
              <div>
                <h3 className="font-bold text-base">{bonus.title}</h3>
                <p className="text-[var(--color-blue)] font-bold text-sm mt-1">
                  Valeur : {bonus.value}
                </p>
                <p className="text-sm text-[var(--muted-fg)] leading-relaxed mt-1">
                  {bonus.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Total value */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-highlight p-8 text-center">
            <p className="text-2xl md:text-4xl font-bold text-[var(--fg)]">
              Valeur totale : 2,835$+
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 text-[var(--muted-fg)] text-base md:text-lg">
            <span>Aujourd&apos;hui, tout ca pour seulement...</span>
            <ArrowDown className="w-5 h-5 text-[var(--muted-fg)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
