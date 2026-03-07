"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Module {
  number: number;
  title: string;
  badge: "COEUR" | "BONUS" | null;
  lessons: number;
  // Benefit-focused description (not just content list)
  benefit: string;
}

const modules: Module[] = [
  {
    number: 1,
    title: "Commence Ici",
    badge: null,
    lessons: 1,
    benefit: "Tu sais exactement par ou commencer et tu as une vision claire du chemin a suivre.",
  },
  {
    number: 2,
    title: "Introduction",
    badge: null,
    lessons: 3,
    benefit: "Tu comprends la strategie globale pour creer une app rentable en 28 jours.",
  },
  {
    number: 3,
    title: "Trouver & Valider une Idee",
    badge: "COEUR",
    lessons: 6,
    benefit:
      "Tu as une idee validee, un modele de monetisation choisi, et ton compte developpeur cree — pret a construire.",
  },
  {
    number: 4,
    title: "Branding & Tech Stack",
    badge: "COEUR",
    lessons: 6,
    benefit:
      "Ton identite visuelle est creee, tes outils sont configures, et ton projet est initialise — sans confusion technique.",
  },
  {
    number: 5,
    title: "Developpement de l'App",
    badge: "COEUR",
    lessons: 16,
    benefit:
      "Ton app est construite de A a Z : auth, base de donnees, abonnements, notifications push — tout fonctionne.",
  },
  {
    number: 6,
    title: "Analytics & Publication",
    badge: "COEUR",
    lessons: 13,
    benefit:
      "Ton app est publiee sur l'App Store ET Google Play avec le tracking et l'ASO configures pour etre decouverte.",
  },
  {
    number: 7,
    title: "Marketing",
    badge: "COEUR",
    lessons: 3,
    benefit:
      "Tu as une strategie d'acquisition pour attirer tes premiers utilisateurs et generer tes premiers revenus.",
  },
  {
    number: 8,
    title: "Masterclass Claude Code",
    badge: "BONUS",
    lessons: 13,
    benefit:
      "Tu maitrises le meilleur agent IA du marche pour coder 10x plus vite sur tous tes futurs projets.",
  },
  {
    number: 9,
    title: "Intelligence Artificielle",
    badge: "BONUS",
    lessons: 7,
    benefit:
      "Tu sais utiliser les meilleurs outils IA (Perplexity, Claude, ChatGPT) pour accelerer chaque etape.",
  },
  {
    number: 10,
    title: "Git/GitHub",
    badge: "BONUS",
    lessons: 13,
    benefit:
      "Tu geres ton code comme un pro — versioning, branches, collaboration — sans jamais perdre de travail.",
  },
  {
    number: 11,
    title: "Learn in Public",
    badge: "BONUS",
    lessons: 2,
    benefit: "Tu apprends a partager ton parcours pour construire une audience autour de ton app.",
  },
  {
    number: 12,
    title: "Case Study: Shinobi Japanese",
    badge: "BONUS",
    lessons: 6,
    benefit:
      "Tu vois l'evolution d'une vraie app rentable en toute transparence — les decisions, les erreurs, les resultats.",
  },
  {
    number: 13,
    title: "Tech News",
    badge: "BONUS",
    lessons: 10,
    benefit: "Tu restes a jour sur les dernieres evolutions tech qui impactent le developpement d'apps.",
  },
  {
    number: 14,
    title: "Ressources",
    badge: "BONUS",
    lessons: 1,
    benefit: "Tu accedes a des ressources exclusives curees pour les createurs d'apps.",
  },
];

const coeurModules = modules.filter(
  (m) => m.badge === "COEUR" || m.badge === null,
);
const bonusModules = modules.filter((m) => m.badge === "BONUS");

function ModuleRow({ module }: { module: Module }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg bg-gray-950 transition-colors">
      <button
        className="w-full flex items-center gap-4 text-left cursor-pointer px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-mono text-sm font-semibold text-white/25 w-6 shrink-0">
          {String(module.number).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <span className="text-sm font-semibold text-white">
            {module.title}
          </span>
        </div>
        <span className="text-xs text-gray-600 shrink-0 hidden sm:block font-mono">
          {module.lessons} lecon{module.lessons > 1 ? "s" : ""}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={14} className="text-gray-600" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pl-14">
              {/* Benefit description — not content list */}
              <p className="text-emerald-400/80 text-xs/5">
                &#10003; {module.benefit}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProgramV4() {
  return (
    <section id="program" className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-amber-400">
            Programme
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Tout ce dont tu as besoin, rien de superflu
          </h2>
          <p className="mt-4 text-base/7 text-gray-400">
            14 modules, 90+ lecons — chaque etape te rapproche de ton app
            publiee et monetisee.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-2">
          {/* Coeur */}
          <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="flex items-center gap-2 mb-3 px-2">
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 outline outline-amber-500/20">
                  Coeur
                </span>
                <span className="text-xs text-gray-600">
                  Le parcours principal
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {coeurModules.map((module) => (
                  <ModuleRow key={module.number} module={module} />
                ))}
              </div>
            </div>
          </div>

          {/* Bonus */}
          <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
            <div className="relative rounded-xl bg-white/5 p-3 overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-gray-400 outline outline-white/10">
                    Bonus
                  </span>
                  <span className="text-xs text-gray-600">
                    Inclus gratuitement
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {bonusModules.map((module) => (
                    <ModuleRow key={module.number} module={module} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA after curriculum */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
          >
            Rejoindre le programme
          </a>
        </motion.div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
