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
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--fg)]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Tu veux creer une app{" "}
          <span className="text-[var(--fg)]">mais...</span>
        </motion.h2>

        <div className="space-y-0">
          {painPoints.map((point, i) => (
            <motion.div
              key={point.title}
              className="flex items-start gap-4 py-5 border-b border-[var(--border)]"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <point.icon
                className="text-[var(--color-danger)] shrink-0 mt-0.5"
                size={22}
              />
              <div>
                <h3 className="text-base font-semibold mb-1 text-[var(--fg)]">
                  {point.title}
                </h3>
                <p className="text-[var(--muted-fg)] text-sm">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

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
