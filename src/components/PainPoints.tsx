"use client";

import { motion } from "framer-motion";
import {
  XCircle,
  AlertTriangle,
  HelpCircle,
  Youtube,
  Compass,
  ShieldQuestion,
} from "lucide-react";

const painPoints = [
  {
    icon: XCircle,
    title: "Tu ne sais pas coder",
    description: "Ou pas assez pour te lancer dans le dev mobile",
  },
  {
    icon: AlertTriangle,
    title: "Tu te perds dans la technique",
    description: "Frameworks, APIs, bases de donnees... c'est le flou total",
  },
  {
    icon: HelpCircle,
    title: "Tu ne sais pas monetiser",
    description: "Comment transformer une app en source de revenus ?",
  },
  {
    icon: Youtube,
    title: "Tutos YouTube sans resultat",
    description: "Des heures de videos sans jamais finir un projet concret",
  },
  {
    icon: Compass,
    title: "Tu ne sais pas par ou commencer",
    description: "L'idee est la, mais le chemin est flou",
  },
  {
    icon: ShieldQuestion,
    title: "Reserve aux devs seniors ?",
    description: "Tu crois qu'il faut des annees d'experience",
  },
];

export default function PainPoints() {
  return (
    <section className="section">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="glass p-8 md:p-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[var(--fg)]">
            Tu veux creer une app{" "}
            <span className="text-[var(--color-danger)]">mais...</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {painPoints.map((point, i) => (
              <motion.div
                key={point.title}
                className="flex items-start gap-4 rounded-xl bg-[rgba(239,68,68,0.04)] px-5 py-4"
                initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="w-9 h-9 rounded-lg bg-[rgba(239,68,68,0.1)] flex items-center justify-center shrink-0 mt-0.5">
                  <point.icon
                    className="text-[var(--color-danger)]"
                    size={18}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--fg)]">
                    {point.title}
                  </h3>
                  <p className="text-[var(--muted-fg)] text-xs mt-1 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          className="text-[var(--color-blue)] text-lg text-center mt-10 font-medium"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Et si tout ca c&apos;etait du passe ?
        </motion.p>
      </div>
    </section>
  );
}
