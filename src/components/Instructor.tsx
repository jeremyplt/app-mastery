"use client";

import { motion } from "framer-motion";
import { Youtube, Twitter } from "lucide-react";

const stats = [
  { value: "X", label: "apps publiees" },
  { value: "X", label: "eleves formes" },
  { value: "Xk+", label: "abonnes" },
];

export default function Instructor() {
  return (
    <section className="section">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center mb-12 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Ton <span className="text-[var(--fg)]">Formateur</span>
        </motion.h2>

        <motion.div
          className="glass p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center">
              <span className="text-4xl font-bold text-[var(--fg)]">J</span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold">Jeremy</h3>
              <p className="text-[var(--color-blue)] text-base mt-1">
                Createur d&apos;apps &amp; formateur
              </p>

              <p className="text-[var(--muted-fg)] text-base leading-relaxed mt-4">
                Passione par le developpement mobile et l&apos;IA, j&apos;ai cree
                plusieurs applications rentables publiees sur les stores. Avec
                App Mastery, je partage la methode exacte que j&apos;utilise pour
                transformer une idee en app monetisee en moins de 28 jours grace
                au vibecoding.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center md:text-left">
                    <p className="text-2xl font-bold text-[var(--fg)]">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[var(--muted-fg)] uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="flex justify-center md:justify-start gap-3 mt-6">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted-fg)] hover:text-[var(--fg)] hover:border-[#333] transition-colors duration-200"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted-fg)] hover:text-[var(--fg)] hover:border-[#333] transition-colors duration-200"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
