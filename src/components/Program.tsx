"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Module {
  number: number;
  title: string;
  badge: "COEUR" | "BONUS" | null;
  lessons: number;
  description: string;
}

const modules: Module[] = [
  {
    number: 1,
    title: "Commence Ici",
    badge: null,
    lessons: 1,
    description: "Presentation de la communaute et du parcours",
  },
  {
    number: 2,
    title: "Introduction",
    badge: null,
    lessons: 3,
    description:
      "Strategie complete pour creer une app rentable en 28 jours",
  },
  {
    number: 3,
    title: "Trouver & Valider une Idee",
    badge: "COEUR",
    lessons: 6,
    description:
      "Idee rentable, etude de marche, monetisation, nom viral, comptes dev",
  },
  {
    number: 4,
    title: "Branding & Tech Stack",
    badge: "COEUR",
    lessons: 6,
    description:
      "Design system, logo, outils IA, onboarding, setup des outils",
  },
  {
    number: 5,
    title: "Developpement de l'App",
    badge: "COEUR",
    lessons: 16,
    description:
      "PRD, Supabase, Expo, auth, abonnements, RevenueCat, push notifications",
  },
  {
    number: 6,
    title: "Analytics & Publication",
    badge: "COEUR",
    lessons: 13,
    description:
      "Tracking, ASO, TestFlight, publication stores, Meta/TikTok Ads",
  },
  {
    number: 7,
    title: "Marketing",
    badge: "COEUR",
    lessons: 3,
    description:
      "Promotions, 4 formats viraux (2M+ vues), publicite",
  },
  {
    number: 8,
    title: "Masterclass Claude Code",
    badge: "BONUS",
    lessons: 13,
    description:
      "Guide complet du meilleur agent IA: CLAUDE.md, hooks, MCPs, multi-agents",
  },
  {
    number: 9,
    title: "Intelligence Artificielle",
    badge: "BONUS",
    lessons: 7,
    description:
      "Perplexity, Claude, ChatGPT, OpenRouter, comparatifs",
  },
  {
    number: 10,
    title: "Git/GitHub",
    badge: "BONUS",
    lessons: 13,
    description:
      "De l'init au pull request, versioning complet",
  },
  {
    number: 11,
    title: "Learn in Public",
    badge: "BONUS",
    lessons: 2,
    description: "Tips et decouvertes partages sans filtre",
  },
  {
    number: 12,
    title: "Case Study: Shinobi Japanese",
    badge: "BONUS",
    lessons: 6,
    description:
      "Evolution d'une vraie app en toute transparence",
  },
  {
    number: 13,
    title: "Tech News",
    badge: "BONUS",
    lessons: 10,
    description: "L'actualite tech pour les createurs d'apps",
  },
  {
    number: 14,
    title: "Ressources",
    badge: "BONUS",
    lessons: 1,
    description: "Ressources privees de la communaute",
  },
];

const coeurModules = modules.filter(
  (m) => m.badge === "COEUR" || m.badge === null
);
const bonusModules = modules.filter((m) => m.badge === "BONUS");

function ModuleRow({ module }: { module: Module }) {
  const [isOpen, setIsOpen] = useState(false);
  const isCoeur = module.badge === "COEUR" || module.badge === null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <button
        className={`w-full flex items-center gap-4 text-left cursor-pointer rounded-xl px-5 py-4 transition-colors ${
          isCoeur
            ? "bg-[rgba(251,191,36,0.04)] hover:bg-[rgba(251,191,36,0.08)]"
            : "bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)]"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-[var(--color-blue)] text-lg font-bold w-8 shrink-0 font-mono">
          {String(module.number).padStart(2, "0")}
        </span>

        <div className="flex-1 flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold">{module.title}</h3>
        </div>

        <span className="text-[var(--muted-fg)] text-xs shrink-0 hidden sm:block">
          {module.lessons} lecon{module.lessons > 1 ? "s" : ""}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown size={16} className="text-[var(--muted-fg)]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-3 pt-1 pl-17">
              <p className="text-[var(--muted-fg)] text-xs leading-relaxed">
                {module.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Program() {
  return (
    <section className="section">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Le Programme Complet
          </h2>
          <p className="text-[var(--muted-fg)] text-lg">
            14 modules, 90+ lecons
          </p>
        </motion.div>

        {/* Coeur modules */}
        <motion.div
          className="glass p-4 md:p-6 mb-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 px-2">
            <span className="badge badge-blue text-xs">Coeur</span>
            <span className="text-[var(--muted-fg)] text-xs">
              Le parcours principal
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {coeurModules.map((module) => (
              <ModuleRow key={module.number} module={module} />
            ))}
          </div>
        </motion.div>

        {/* Bonus modules */}
        <motion.div
          className="glass p-4 md:p-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 px-2">
            <span className="badge text-xs">Bonus</span>
            <span className="text-[var(--muted-fg)] text-xs">
              Modules complementaires
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {bonusModules.map((module) => (
              <ModuleRow key={module.number} module={module} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
