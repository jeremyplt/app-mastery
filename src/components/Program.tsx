"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useIsExpired } from "./CountdownTimer";

interface Module {
  number: number;
  title: string;
  badge: "ESSENTIEL" | "BONUS" | null;
  lessons: number;
  // Benefit-focused description (not just content list)
  benefit: string;
}

const modules: Module[] = [
  {
    number: 1,
    title: "Trouver & Valider une Idée",
    badge: "ESSENTIEL",
    lessons: 6,
    benefit:
      "Résultat : tu as TON idée validée avec un marché prouvé et un modèle de monétisation choisi. Tu sais exactement quoi construire.",
  },
  {
    number: 2,
    title: "Branding & Outils",
    badge: "ESSENTIEL",
    lessons: 6,
    benefit:
      "Résultat : ton identité visuelle est prête, tes outils configurés, ton projet initialisé. Tu es prêt à développer.",
  },
  {
    number: 3,
    title: "Développement de l'App",
    badge: "ESSENTIEL",
    lessons: 16,
    benefit:
      "Résultat : ton app fonctionne sur simulateur. Auth, base de données, abonnements, notifications push, tout est en place.",
  },
  {
    number: 4,
    title: "Analytics & Publication",
    badge: "ESSENTIEL",
    lessons: 13,
    benefit:
      "Résultat : ton app est live sur l'App Store ET Google Play. Le suivi et le référencement sont configurés pour être découvert.",
  },
  {
    number: 5,
    title: "Marketing",
    badge: "ESSENTIEL",
    lessons: 14,
    benefit:
      "Résultat : tu as tes premiers téléchargements et tes premiers revenus grâce au contenu organique et aux influenceurs.",
  },
  {
    number: 6,
    title: "Masterclass Claude Code",
    badge: "BONUS",
    lessons: 13,
    benefit:
      "Tu maîtrises le meilleur agent IA du marché pour coder 10x plus vite sur tous tes futurs projets.",
  },
  {
    number: 7,
    title: "Intelligence Artificielle",
    badge: "BONUS",
    lessons: 7,
    benefit:
      "Tu sais utiliser les meilleurs outils IA (Perplexity, Claude, ChatGPT) pour accélérer chaque étape.",
  },
  {
    number: 8,
    title: "Masterclass Git/GitHub",
    badge: "BONUS",
    lessons: 13,
    benefit:
      "Tu gères ton code comme un pro, sauvegarde, organisation, collaboration, sans jamais perdre de travail.",
  },
  {
    number: 9,
    title: "Case Study: Shinobi Japanese",
    badge: "BONUS",
    lessons: 6,
    benefit:
      "Tu vois l'évolution d'une vraie app rentable en toute transparence. Les décisions, les erreurs, les résultats.",
  },
  {
    number: 10,
    title: "Ressources",
    badge: "BONUS",
    lessons: 1,
    benefit: "Tu accèdes à des ressources exclusives curées pour les créateurs d'apps.",
  },
];

const coeurModules = modules.filter((m) => m.badge === "ESSENTIEL");
const bonusModules = modules.filter((m) => m.badge === "BONUS");

function ModuleRow({ module }: { module: Module }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-[10px] overflow-hidden">
      <button
        className="mac-row-link w-full flex items-center gap-4 text-left rounded-[10px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-mono text-sm font-semibold text-[var(--fg3)] w-6 shrink-0">
          {String(module.number).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <span className="text-base font-semibold text-[var(--fg)]">{module.title}</span>
        </div>
        <span className="text-sm text-[var(--fg3)] shrink-0 hidden sm:block font-mono">
          {module.lessons} leçon{module.lessons > 1 ? "s" : ""}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={15} className="text-[var(--fg3)]" />
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
              <p className="text-[17px] leading-relaxed" style={{ color: "var(--green)" }}>
                &#10003; {module.benefit}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Program() {
  const expired = useIsExpired();

  return (
    <section id="program" className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="mac-eyebrow">Programme</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-bold tracking-[-0.03em] text-balance text-[var(--fg)]">
            Tout ce dont tu as besoin, rien de superflu
          </h2>
          <p className="mt-4 text-xl/8 text-[var(--fg2)]">
            10 modules, 90+ leçons. Chaque étape te rapproche de ton app publiée
            et monétisée.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Essentiel */}
          <div className="rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-4">
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="badge badge-blue">Essentiel</span>
              <span className="text-sm text-[var(--fg3)]">Le parcours principal</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {coeurModules.map((module) => (
                <ModuleRow key={module.number} module={module} />
              ))}
            </div>
          </div>

          {/* Bonus */}
          <div className="rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-4">
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="badge badge-success">Bonus</span>
              <span className="text-sm" style={{ color: "color-mix(in srgb, var(--green) 75%, transparent)" }}>
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

        {/* CTA after curriculum */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {expired ? (
            <a
              href="/appel?utm_source=landing&utm_medium=cta&utm_campaign=program"
              className="btn-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Réserve ton appel découverte
            </a>
          ) : (
            <a
              href="#pricing"
              className="btn-primary"
              data-ph-capture-attribute-section="program"
            >
              Lancer mon app maintenant
            </a>
          )}
        </motion.div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
