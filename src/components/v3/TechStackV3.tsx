"use client";

import { motion } from "framer-motion";

const tools = [
  { name: "React Native", desc: "Framework mobile cross-platform", color: "text-sky-400" },
  { name: "Expo", desc: "Build & deploy simplifie", color: "text-violet-400" },
  { name: "Claude Code", desc: "Agent IA qui code pour toi", color: "text-cyan-400" },
  { name: "Supabase", desc: "Backend & base de donnees", color: "text-emerald-400" },
  { name: "RevenueCat", desc: "Gestion des abonnements", color: "text-amber-400" },
  { name: "TypeScript", desc: "Code type et maintenable", color: "text-blue-400" },
];

export default function TechStackV3() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-violet-400">
            Tech Stack
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Les outils que tu vas maitriser
          </h2>
        </div>

        {/* Single container with inner grid */}
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
          <div className="rounded-xl bg-white/5 p-2">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {tools.map((tool, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-xl bg-gray-950 p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  {/* Dot pattern */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div className="relative">
                    <h3 className={`text-base font-semibold ${tool.color} mb-1`}>{tool.name}</h3>
                    <p className="text-xs/5 text-gray-500">{tool.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
