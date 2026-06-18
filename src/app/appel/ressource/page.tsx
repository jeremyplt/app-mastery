"use client";

import { motion } from "framer-motion";

const RESOURCES = [
  {
    title: "Le plan d'action gratuit",
    description: "Les étapes concrètes pour passer de l'idée à une première app, sans coder.",
    href: "/plan-action/video",
    cta: "Voir le plan",
  },
  {
    title: "Les vidéos gratuites",
    description: "Ma chaîne, où je décortique comment créer et monétiser des apps avec l'IA.",
    href: "https://www.youtube.com/@jeremyptlt",
    cta: "Voir les vidéos",
  },
];

export default function RessourcePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
        <motion.div
          className="w-full max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
            <svg className="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Merci pour ta candidature.
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-gray-200 font-medium max-w-xl mx-auto">
            Vu là où tu en es, un appel stratégique ne serait pas la bonne étape pour toi aujourd&apos;hui. Le mieux, c&apos;est de commencer par poser des bases solides. Voici par où démarrer, gratuitement.
          </p>

          <div className="mt-10 space-y-4 text-left">
            {RESOURCES.map((r) => (
              <a
                key={r.href}
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-between gap-4 rounded-xl border-2 border-white/15 bg-white/5 px-6 py-5 transition-all hover:border-amber-400/60 hover:bg-white/10"
              >
                <div>
                  <p className="text-lg font-bold text-white">{r.title}</p>
                  <p className="mt-1 text-base font-medium text-gray-300">{r.description}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-amber-400/15 px-4 py-2 text-sm font-bold text-amber-300 group-hover:bg-amber-400 group-hover:text-gray-950">
                  {r.cta}
                </span>
              </a>
            ))}
          </div>

          <p className="mt-10 text-base font-medium text-gray-300">
            Avance avec ça, et quand ton projet aura pris de l&apos;ampleur, on se reparle.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
