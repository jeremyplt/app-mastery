"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";

const bonuses = [
  { title: "Masterclass Claude Code", value: "497$", desc: "13 lecons pour maitriser le meilleur agent IA" },
  { title: "Templates & Starter Kits", value: "297$", desc: "Code source pret a l'emploi pour demarrer rapidement" },
  { title: "Communaute Privee", value: "Inclus", desc: "Acces a vie au groupe d'entraide et networking" },
  { title: "Mises a Jour a Vie", value: "Inclus", desc: "Tous les nouveaux modules et contenus futurs" },
];

export default function BonusesV3() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-amber-400">
            Bonus
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Ce qui est inclus en plus
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          {bonuses.map((bonus, i) => (
            <motion.div
              key={i}
              className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="relative rounded-xl bg-white/5 p-5 overflow-hidden">
                {/* Alternating patterns */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: i % 2 === 0
                      ? "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)"
                      : "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
                    backgroundSize: i % 2 === 0 ? "16px 16px" : "10px 10px",
                  }}
                />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <Gift size={18} className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{bonus.title}</h3>
                      <span className="text-xs font-semibold text-emerald-400">{bonus.value}</span>
                    </div>
                    <p className="text-xs/5 text-gray-500">{bonus.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
