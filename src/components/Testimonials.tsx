"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface TestimonialsProps {
  id?: string;
}

const testimonials = [
  {
    name: "Thomas M.",
    initials: "TM",
    context: "Debutant total",
    quote:
      "En 3 semaines j'avais mon app sur l'App Store. Le vibecoding avec Claude Code, c'est de la magie.",
  },
  {
    name: "Sarah L.",
    initials: "SL",
    context: "Designeuse reconvertie",
    quote:
      "Jamais je n'aurais cru pouvoir coder une app. La formation m'a guide pas a pas.",
  },
  {
    name: "Marc D.",
    initials: "MD",
    context: "Entrepreneur",
    quote:
      "Mon app genere 800$/mois d'abonnements apres seulement 2 mois. ROI incroyable.",
  },
  {
    name: "Julie P.",
    initials: "JP",
    context: "Etudiante",
    quote:
      "La masterclass Claude Code vaut le prix a elle seule. J'ai appris plus qu'en 6 mois de fac.",
  },
  {
    name: "Kevin R.",
    initials: "KR",
    context: "Dev junior",
    quote:
      "Le module marketing m'a ouvert les yeux. Coder c'est 20% du succes, le marketing c'est 80%.",
  },
  {
    name: "Amina B.",
    initials: "AB",
    context: "Freelance",
    quote:
      "La communaute est incroyable. Le support et les retours m'ont fait gagner des semaines.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Testimonials({ id }: TestimonialsProps) {
  return (
    <section id={id} className="section">
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center mb-12 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Ce Qu&apos;en Disent{" "}
          <span className="text-[var(--fg)]">Nos Eleves</span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              className="glass p-6 flex flex-col gap-4"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--fg)] font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-[var(--muted-fg)]">{t.context}</p>
                </div>
              </div>

              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[var(--color-warning)] text-[var(--color-warning)]"
                  />
                ))}
              </div>

              <p className="text-sm text-[var(--muted-fg)] italic leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
