"use client";

import { motion } from "framer-motion";

const tools = [
  { name: "React Native", desc: "Framework mobile cross-platform", color: "text-[var(--accent2)]" },
  { name: "Expo", desc: "Build & deploy simplifie", color: "text-[var(--accent2)]" },
  { name: "Claude Code", desc: "Agent IA qui code pour toi", color: "text-[var(--accent2)]" },
  { name: "Supabase", desc: "Backend & base de donnees", color: "text-[var(--green)]" },
  { name: "RevenueCat", desc: "Gestion des abonnements", color: "text-[var(--accent2)]" },
  { name: "TypeScript", desc: "Code type et maintenable", color: "text-[var(--accent2)]" },
];

export default function TechStackV3() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-[var(--accent2)]">
            Tech Stack
          </span>
          <div className="h-px flex-1 bg-[var(--field)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-[-0.035em] text-balance text-[var(--fg)]">
            Les outils que tu vas maitriser
          </h2>
        </div>

        {/* Single container with inner grid */}
        <div className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[var(--sep)]">
          <div className="rounded-xl bg-[var(--field)] p-2">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {tools.map((tool, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-xl bg-[var(--bg)] p-5"
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
                    <p className="text-xs/5 text-[var(--fg2)]">{tool.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--field)]" />
    </section>
  );
}
