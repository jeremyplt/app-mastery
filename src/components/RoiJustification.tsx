"use client";

import { motion } from "framer-motion";
import { Clock, DollarSign, GraduationCap, Rocket } from "lucide-react";

const alternatives = [
  {
    title: "Apprendre seul",
    line1: "6-12 mois",
    line2: "Aucune structure",
    line3: "95% d'abandon",
    icon: Clock,
    highlighted: false,
  },
  {
    title: "Freelance dev",
    line1: "5 000 - 15 000$",
    line2: "Aucun apprentissage",
    line3: "Dependant du dev",
    icon: DollarSign,
    highlighted: false,
  },
  {
    title: "Bootcamp mobile",
    line1: "3 000 - 8 000$",
    line2: "3-6 mois",
    line3: "Pas focus IA",
    icon: GraduationCap,
    highlighted: false,
  },
  {
    title: "App Secrets",
    line1: "997$",
    line2: "28 jours",
    line3: "De A a Z avec l'IA",
    icon: Rocket,
    highlighted: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function RoiJustification() {
  return (
    <section className="section">
      <div className="max-w-[1000px] mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center mb-12 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[var(--color-blue)]">997$</span> ? Voici le Calcul
        </motion.h2>

        {/* Comparison Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {alternatives.map((alt) => {
            const Icon = alt.icon;
            return (
              <motion.div
                key={alt.title}
                variants={cardVariants}
                className={alt.highlighted ? "card-highlight p-6 md:p-8" : "card p-6 md:p-8"}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={
                      alt.highlighted
                        ? "w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(0,112,243,0.15)]"
                        : "w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--muted)]"
                    }
                  >
                    <Icon
                      size={20}
                      className={alt.highlighted ? "text-[var(--color-blue)]" : "text-[var(--muted-fg)]"}
                    />
                  </div>
                  <h3 className={alt.highlighted ? "text-lg font-bold text-[var(--fg)]" : "text-lg font-semibold text-[var(--muted-fg)]"}>
                    {alt.title}
                  </h3>
                </div>
                <div className="space-y-1 ml-13">
                  <p className={alt.highlighted ? "text-lg font-semibold text-[var(--color-blue)]" : "text-base text-[var(--muted-fg)]"}>
                    {alt.line1}
                  </p>
                  <p className={alt.highlighted ? "text-base text-[var(--fg)]" : "text-base text-[var(--muted-fg)]"}>
                    {alt.line2}
                  </p>
                  <p className={alt.highlighted ? "text-base text-[var(--fg)]" : "text-base text-[var(--muted-fg)]"}>
                    {alt.line3}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ROI Calculation Box */}
        <motion.div
          className="card-highlight p-8 md:p-10 max-w-3xl mx-auto text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-lg md:text-xl text-[var(--muted-fg)] leading-relaxed mb-3">
            Un seul abonnement a <span className="font-bold text-[var(--fg)]">4,99$/mois</span> avec{" "}
            <span className="font-bold text-[var(--fg)]">200 utilisateurs</span> ={" "}
            <span className="font-bold text-[var(--color-blue)]">997$/mois</span> de revenus.
          </p>
          <p className="text-lg md:text-xl font-bold">
            Tu rentabilises des le premier mois.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
