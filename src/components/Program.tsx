"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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

const coeurModules = modules.filter(
  (m) => m.badge === "ESSENTIEL",
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
          <span className="text-base font-semibold text-white">
            {module.title}
          </span>
        </div>
        <span className="text-sm text-gray-600 shrink-0 hidden sm:block font-mono">
          {module.lessons} leçon{module.lessons > 1 ? "s" : ""}
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
              <p className="text-emerald-400/90 text-lg/7">
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
  return (
    <section id="program" className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-base font-semibold tracking-widest uppercase text-amber-400">
            Programme
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Tout ce dont tu as besoin, rien de superflu
          </h2>
          <p className="mt-4 text-xl/8 text-gray-300">
            10 modules, 90+ leçons. Chaque étape te rapproche de ton app
            publiée et monétisée.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-2">
          {/* Essentiel */}
          <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="flex items-center gap-2 mb-3 px-2">
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-sm font-semibold text-amber-400 outline outline-amber-500/20">
                  Essentiel
                </span>
                <span className="text-sm text-gray-600">
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
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-sm font-semibold text-emerald-400 outline outline-emerald-500/20">
                    Bonus
                  </span>
                  <span className="text-sm text-emerald-400/60">
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
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-4 text-lg font-bold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
            data-ph-capture-attribute-section="program"
          >
            Lancer mon app maintenant
          </a>
        </motion.div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
