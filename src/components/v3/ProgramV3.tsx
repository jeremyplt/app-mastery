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
  { number: 1, title: "Commence Ici", badge: null, lessons: 1, description: "Presentation de la communaute et du parcours" },
  { number: 2, title: "Introduction", badge: null, lessons: 3, description: "Strategie complete pour creer une app rentable en 28 jours" },
  { number: 3, title: "Trouver & Valider une Idee", badge: "COEUR", lessons: 6, description: "Idee rentable, etude de marche, monetisation, nom viral, comptes dev" },
  { number: 4, title: "Branding & Tech Stack", badge: "COEUR", lessons: 6, description: "Design system, logo, outils IA, onboarding, setup des outils" },
  { number: 5, title: "Developpement de l'App", badge: "COEUR", lessons: 16, description: "PRD, Supabase, Expo, auth, abonnements, RevenueCat, push notifications" },
  { number: 6, title: "Analytics & Publication", badge: "COEUR", lessons: 13, description: "Tracking, ASO, TestFlight, publication stores, Meta/TikTok Ads" },
  { number: 7, title: "Marketing", badge: "COEUR", lessons: 3, description: "Promotions, 4 formats viraux (2M+ vues), publicite" },
  { number: 8, title: "Masterclass Claude Code", badge: "BONUS", lessons: 13, description: "Guide complet du meilleur agent IA: CLAUDE.md, hooks, MCPs, multi-agents" },
  { number: 9, title: "Intelligence Artificielle", badge: "BONUS", lessons: 7, description: "Perplexity, Claude, ChatGPT, OpenRouter, comparatifs" },
  { number: 10, title: "Git/GitHub", badge: "BONUS", lessons: 13, description: "De l'init au pull request, versioning complet" },
  { number: 11, title: "Learn in Public", badge: "BONUS", lessons: 2, description: "Tips et decouvertes partages sans filtre" },
  { number: 12, title: "Case Study: Shinobi Japanese", badge: "BONUS", lessons: 6, description: "Evolution d'une vraie app en toute transparence" },
  { number: 13, title: "Tech News", badge: "BONUS", lessons: 10, description: "L'actualite tech pour les createurs d'apps" },
  { number: 14, title: "Ressources", badge: "BONUS", lessons: 1, description: "Ressources privees de la communaute" },
];

const coeurModules = modules.filter((m) => m.badge === "COEUR" || m.badge === null);
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
          <span className="text-sm font-semibold text-white">{module.title}</span>
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
              <p className="text-gray-500 text-xs/5">{module.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProgramV3() {
  return (
    <section id="program" className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-amber-400">
            Programme
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Le programme complet
          </h2>
          <p className="mt-4 text-base/7 text-gray-400">
            14 modules, 90+ lecons — du zero a l&apos;app publiee.
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
                <span className="text-xs text-gray-600">Le parcours principal</span>
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
              {/* Diagonal pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "repeating-linear-gradient(315deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 0, transparent 50%)",
                  backgroundSize: "10px 10px",
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-gray-400 outline outline-white/10">
                    Bonus
                  </span>
                  <span className="text-xs text-gray-600">Modules complementaires</span>
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
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
