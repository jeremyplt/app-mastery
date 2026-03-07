"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function Guarantee() {
  return (
    <section className="section">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="card border-l-4 border-l-[var(--color-success)] rounded-xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <ShieldCheck size={48} className="text-[var(--color-success)]" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Garantie 30 Jours — Resultat Garanti
          </h2>

          <p className="text-[var(--muted-fg)] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Suis la formation pendant 30 jours. Si tu as suivi le programme et que tu n&apos;as pas
            d&apos;app fonctionnelle, je te rembourse integralement. Pas de questions, pas de
            justification. Le risque est 100% de mon cote.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
