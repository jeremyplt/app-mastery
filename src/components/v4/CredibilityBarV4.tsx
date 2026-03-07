"use client";

import { motion } from "framer-motion";

export default function CredibilityBarV4() {
  return (
    <section className="py-12">
      <div className="px-4 sm:px-6 lg:px-8">
        <motion.div
          className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-xl bg-white/5 px-6 py-6 sm:px-8">
            <p className="text-center text-xs font-semibold tracking-widest uppercase text-gray-600 mb-6">
              Les outils que tu vas maitriser
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {[
                { name: "React Native", color: "text-sky-400" },
                { name: "Expo", color: "text-violet-400" },
                { name: "Claude Code", color: "text-cyan-400" },
                { name: "Supabase", color: "text-emerald-400" },
                { name: "RevenueCat", color: "text-amber-400" },
                { name: "TypeScript", color: "text-blue-400" },
              ].map((tool, i) => (
                <span
                  key={i}
                  className={`text-sm font-semibold ${tool.color} opacity-70`}
                >
                  {tool.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
