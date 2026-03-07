"use client";

import { motion } from "framer-motion";

export default function FinalCta() {
  return (
    <section className="section glow">
      {/* Divider at top */}
      <div className="divider mb-16 md:mb-24" />

      <div className="max-w-3xl mx-auto text-center">
        {/* Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Pret a Creer Ton App ?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-[var(--muted-fg)] mb-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Rejoins les 500+ eleves qui ont deja lance leur app mobile
        </motion.p>

        {/* Recap */}
        <motion.p
          className="text-sm text-[var(--muted-fg)] mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          14 modules | 90+ lecons | Communaute a vie | Garantie 30j
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button className="btn-primary text-lg md:text-xl px-12 py-5">
            Commencer Maintenant — 997$
          </button>
        </motion.div>

        {/* Payment Split */}
        <motion.p
          className="text-[var(--muted-fg)] text-sm mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          ou 4x 297$
        </motion.p>

        {/* PS Text */}
        <motion.p
          className="text-[var(--muted-fg)] text-sm italic leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          P.S. — Chaque jour que tu attends est un jour de revenus perdus. Le prix augmente a chaque
          palier de places remplies. Ne reviens pas sur cette page en regrettant d&apos;avoir
          attendu.
        </motion.p>
      </div>
    </section>
  );
}
