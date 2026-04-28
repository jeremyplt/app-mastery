"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";

// Each bonus solves a specific objection
const bonuses = [
  {
    title: "Masterclass Marketing : Acquisition + Monétisation",
    benefit:
      "Tu apprends à attirer des utilisateurs et à monétiser ton app. Stratégies marketing, publicité, référencement d'app, modèles de revenus. Sans ça, ton app reste invisible.",
    objection: "Je ne sais pas comment trouver des utilisateurs",
  },
  {
    title: "Masterclass Claude Code",
    // Benefit description, not feature description
    benefit:
      "13 leçons pour maîtriser le meilleur agent IA du marché. Tu codes 10x plus vite, sur ce projet et tous les suivants.",
    objection: "Je ne sais pas utiliser l'IA pour coder",
  },
  {
    title: "Masterclass Git & GitHub",
    benefit:
      "Tu maîtrises Git et GitHub de zéro. Sauvegarde, organisation, collaboration. Tu gères ton code comme un pro sans jamais perdre de travail.",
    objection: "C'est trop technique pour moi",
  },
  {
    title: "Lives Q&A 2x par mois",
    benefit:
      "Je fais des lives deux fois par mois pour répondre à tes questions, te guider et t'aider à avancer. Tu ne seras jamais bloqué seul.",
    objection: "Et si je me retrouve bloqué ?",
  },
  {
    title: "Communauté Privée à Vie",
    benefit:
      "Rejoins une vraie communauté de créateurs d'apps. Entraide, partage de résultats, feedback entre membres. Vous avancez ensemble, pas chacun dans son coin.",
    objection: "Et si je me retrouve seul ?",
  },
  {
    title: "Mises à Jour à Vie",
    benefit:
      "La formation évolue avec les technologies. Tous les nouveaux modules, nouvelles leçons, nouvelles ressources. À vie.",
    objection: "Ça sera encore valable dans 1 an ?",
  },
  {
    title: "Case Study Shinobi Japanese",
    benefit:
      "L'évolution d'une vraie app rentable, en toute transparence. Tu vois les décisions, les erreurs, et les résultats réels.",
    objection: "Ça marche vraiment dans la vraie vie ?",
  },
];

export default function Bonuses() {

  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-base font-semibold tracking-widest uppercase text-amber-400">
            Bonus Inclus
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Et ce n&apos;est pas tout...
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            En plus de la formation complète, tu reçois{" "}
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
              7 bonus exclusifs
            </span>{" "}
            inclus sans supplément.
          </p>
        </div>

        <div className="space-y-2">
          {bonuses.map((bonus, i) => (
            <motion.div
              key={i}
              className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="relative rounded-xl bg-white/5 p-5 overflow-hidden">
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <Gift size={18} className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white mb-1">
                      {bonus.title}
                    </h3>
                    <p className="text-lg/7 text-gray-300">{bonus.benefit}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
