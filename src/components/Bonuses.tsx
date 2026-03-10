"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";

// Value Stack (Brunson Stack Slide)
// Each bonus = named with benefit in title + individual value + solves a specific objection
const bonuses = [
  {
    title: "Masterclass Marketing : Acquisition + Monétisation",
    value: "997€",
    benefit:
      "Tu apprends à attirer des utilisateurs et à monétiser ton app. Stratégies marketing, publicité, référencement d'app, modèles de revenus. Sans ça, ton app reste invisible.",
    objection: "Je ne sais pas comment trouver des utilisateurs",
  },
  {
    title: "Masterclass Claude Code",
    value: "497€",
    // Benefit description, not feature description
    benefit:
      "13 leçons pour maîtriser le meilleur agent IA du marché. Tu codes 10x plus vite, sur ce projet et tous les suivants.",
    objection: "Je ne sais pas utiliser l'IA pour coder",
  },
  {
    title: "Masterclass Git & GitHub",
    value: "297€",
    benefit:
      "Tu maîtrises Git et GitHub de zéro. Sauvegarde, organisation, collaboration. Tu gères ton code comme un pro sans jamais perdre de travail.",
    objection: "C'est trop technique pour moi",
  },
  {
    title: "Lives Q&A 2x par mois",
    value: "Inestimable",
    benefit:
      "Je fais des lives deux fois par mois pour répondre à tes questions, te guider et t'aider à avancer. Tu ne seras jamais bloqué seul.",
    objection: "Et si je me retrouve bloqué ?",
  },
  {
    title: "Communauté Privée à Vie",
    value: "600€/an",
    benefit:
      "Rejoins une vraie communauté de créateurs d'apps. Entraide, partage de résultats, feedback entre membres. Vous avancez ensemble, pas chacun dans son coin.",
    objection: "Et si je me retrouve seul ?",
  },
  {
    title: "Mises à Jour à Vie",
    value: "Inclus",
    benefit:
      "La formation évolue avec les technologies. Tous les nouveaux modules, nouvelles leçons, nouvelles ressources. À vie.",
    objection: "Ça sera encore valable dans 1 an ?",
  },
  {
    title: "Case Study Shinobi Japanese",
    value: "197€",
    benefit:
      "L'évolution d'une vraie app rentable, en toute transparence. Tu vois les décisions, les erreurs, et les résultats réels.",
    objection: "Ça marche vraiment dans la vraie vie ?",
  },
];

export default function Bonuses() {
  // Calculate total value for stack slide
  const totalValue = "2 588€+";

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
              {totalValue} de bonus
            </span>{" "}
            , inclus sans supplément.
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
                    <div className="mb-1">
                      <h3 className="text-base font-semibold text-white">
                        {bonus.title}
                      </h3>
                      <span className="text-sm font-semibold text-emerald-400">
                        Valeur: {bonus.value}
                      </span>
                    </div>
                    <p className="text-lg/7 text-gray-300">{bonus.benefit}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Value stack total */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xl text-gray-300">
            Valeur totale des bonus :{" "}
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">{totalValue}</span>,
            inclus dans ton accès.
          </p>
        </motion.div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
