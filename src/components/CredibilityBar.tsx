"use client";

import { motion } from "framer-motion";

export default function CredibilityBar() {
  return (
    <section className="py-12">
      <div className="px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] px-6 py-6 sm:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center text-sm font-semibold tracking-widest uppercase text-[var(--fg3)] mb-6">
            Les outils que tu vas maîtriser
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {["React Native", "Expo", "Claude Code", "Supabase", "RevenueCat", "TypeScript"].map(
              (tool, i) => (
                <span key={i} className="text-lg font-semibold text-[var(--fg2)]">
                  {tool}
                </span>
              ),
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
