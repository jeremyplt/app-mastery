"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";

// Value Stack (Brunson Stack Slide)
// Each bonus = named with benefit in title + individual value + solves a specific objection
const bonuses = [
  {
    title: "Masterclass Claude Code",
    value: "497$",
    // Benefit description, not feature description
    benefit:
      "13 lecons pour maitriser le meilleur agent IA du marche. Tu codes 10x plus vite — sur ce projet et tous les suivants.",
    objection: "Je ne sais pas utiliser l'IA pour coder",
  },
  {
    title: "Templates & Starter Kits",
    value: "297$",
    benefit:
      "Code source pret a l'emploi avec auth, abonnements et onboarding deja configures. Tu gagnes des jours de travail.",
    objection: "C'est trop technique pour moi",
  },
  {
    title: "Communaute Privee a Vie",
    value: "600$/an",
    benefit:
      "Acces permanent au groupe d'entraide. Pose tes questions, partage tes resultats, connecte-toi avec d'autres createurs.",
    objection: "Et si je me retrouve bloque seul ?",
  },
  {
    title: "Mises a Jour a Vie",
    value: "Inclus",
    benefit:
      "La formation evolue avec les technologies. Tous les nouveaux modules, nouvelles lecons, nouvelles ressources — a vie.",
    objection: "Ca sera encore valable dans 1 an ?",
  },
  {
    title: "Case Study Shinobi Japanese",
    value: "197$",
    benefit:
      "L'evolution d'une vraie app rentable, en toute transparence. Tu vois les decisions, les erreurs, et les resultats reels.",
    objection: "Ca marche vraiment dans la vraie vie ?",
  },
];

export default function BonusesV4() {
  // Calculate total value for stack slide
  const totalValue = "1 591$+";

  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-amber-400">
            Bonus Inclus
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Et ce n&apos;est pas tout...
          </h2>
          <p className="mt-4 text-base/7 text-gray-400">
            En plus de la formation complete, tu recois{" "}
            <span className="text-white font-semibold">
              {totalValue} de bonus
            </span>{" "}
            — inclus sans supplement.
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
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-white">
                        {bonus.title}
                      </h3>
                      <span className="text-xs font-semibold text-emerald-400">
                        Valeur: {bonus.value}
                      </span>
                    </div>
                    <p className="text-sm/6 text-gray-400">{bonus.benefit}</p>
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
          <p className="text-sm text-gray-500">
            Valeur totale des bonus:{" "}
            <span className="text-white font-semibold">{totalValue}</span> —
            inclus dans ton acces.
          </p>
        </motion.div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
