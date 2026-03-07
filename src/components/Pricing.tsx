"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "14 modules complets (90+ lecons)",
  "Masterclass Claude Code",
  "Module IA complet",
  "Formation Git/GitHub",
  "Case Study reel",
  "Communaute privee a vie",
  "Mises a jour a vie",
  "Support prioritaire",
];

export default function Pricing() {
  return (
    <section id="prix" className="section glow">
      <div className="max-w-lg mx-auto">
        <motion.div
          className="glass-strong p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <div className="mb-8">
            <span className="badge badge-blue">ACCES A VIE</span>
          </div>

          {/* Crossed out value */}
          <p className="text-2xl text-[var(--muted-fg)] line-through">
            2,835$
          </p>

          {/* Price */}
          <p className="text-5xl md:text-6xl font-bold text-[var(--fg)] mt-2">
            997$
          </p>

          {/* Split payment */}
          <p className="text-[var(--muted-fg)] text-base mt-3">
            ou <span className="text-[var(--color-blue)] font-medium">4x 297$</span>
          </p>

          {/* Feature list */}
          <ul className="text-left mt-10 space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[var(--color-success)] shrink-0 mt-0.5" />
                <span className="text-base">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button className="btn-primary w-full mt-10 text-lg py-4">
            Rejoindre App Mastery Maintenant
          </button>

          {/* Trust line */}
          <p className="text-[var(--muted-fg)] text-sm mt-5">
            Paiement securise | Acces instantane | Garantie 30 jours
          </p>

          {/* Micro social proof */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[var(--card)] bg-[var(--muted)] flex items-center justify-center text-[var(--fg)] text-xs font-bold"
                >
                  {["A", "B", "C", "D"][i]}
                </div>
              ))}
            </div>
            <span className="text-[var(--muted-fg)] text-sm">
              Garantie 30 jours
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
