"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const profiles = [
  { title: "Entrepreneurs", desc: "Qui veulent lancer une app sans equipe technique" },
  { title: "Freelances", desc: "Qui veulent ajouter le mobile a leurs services" },
  { title: "Createurs de contenu", desc: "Qui veulent monetiser avec une app" },
  { title: "Developpeurs web", desc: "Qui veulent passer au mobile rapidement" },
  { title: "Etudiants", desc: "Qui veulent un projet concret et monetisable" },
  { title: "Debutants complets", desc: "Qui veulent creer une source de revenus passive" },
];

export default function ForWhoV3() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-emerald-400">
            Pour Qui
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            C&apos;est fait pour toi si...
          </h2>
        </div>

        {/* Two-column card layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {profiles.map((profile, i) => (
            <motion.div
              key={i}
              className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="rounded-xl bg-white/5 p-5 h-full">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 mt-0.5">
                    <Check size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{profile.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{profile.desc}</p>
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
