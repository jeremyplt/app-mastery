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
    <div className="rounded-lg bg-[var(--bg)] transition-colors">
      <button
        className="w-full flex items-center gap-4 text-left cursor-pointer px-4 py-3 hover:bg-[var(--field)] rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-mono text-sm font-semibold text-[var(--fg)]/25 w-6 shrink-0">
          {String(module.number).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <span className="text-sm font-semibold text-[var(--fg)]">{module.title}</span>
        </div>
        <span className="text-xs text-[var(--fg3)] shrink-0 hidden sm:block font-mono">
          {module.lessons} lecon{module.lessons > 1 ? "s" : ""}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={14} className="text-[var(--fg3)]" />
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
              <p className="text-[var(--fg2)] text-xs/5">{module.description}</p>
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
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-[var(--accent2)]">
            Programme
          </span>
          <div className="h-px flex-1 bg-[var(--field)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-[-0.035em] text-balance text-[var(--fg)]">
            Le programme complet
          </h2>
          <p className="mt-4 text-base/7 text-[var(--fg2)]">
            14 modules, 90+ lecons — du zero a l&apos;app publiee.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-2">
          {/* Coeur */}
          <div className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[var(--sep)]">
            <div className="rounded-xl bg-[var(--field)] p-3">
              <div className="flex items-center gap-2 mb-3 px-2">
                <span className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent2)] outline outline-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
                  Coeur
                </span>
                <span className="text-xs text-[var(--fg3)]">Le parcours principal</span>
              </div>
              <div className="flex flex-col gap-0.5">
                {coeurModules.map((module) => (
                  <ModuleRow key={module.number} module={module} />
                ))}
              </div>
            </div>
          </div>

          {/* Bonus */}
          <div className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[var(--sep)]">
            <div className="relative rounded-xl bg-[var(--field)] p-3 overflow-hidden">
              {/* Dot pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <span className="inline-flex items-center rounded-full bg-[var(--field)] px-2.5 py-0.5 text-xs font-semibold text-[var(--fg2)] outline outline-[var(--sep)]">
                    Bonus
                  </span>
                  <span className="text-xs text-[var(--fg3)]">Modules complementaires</span>
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
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--field)]" />
    </section>
  );
}
