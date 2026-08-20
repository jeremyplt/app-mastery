"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Thomas R.",
    role: "Entrepreneur",
    text: "J'ai lance mon app en 3 semaines alors que je n'avais jamais code. Le vibecoding change vraiment la donne.",
    initials: "TR",
  },
  {
    name: "Sophie M.",
    role: "Freelance designer",
    text: "La formation est ultra structuree. Chaque etape est claire, pas besoin de chercher ailleurs.",
    initials: "SM",
  },
  {
    name: "Karim B.",
    role: "Etudiant",
    text: "Mon app genere deja des revenus d'abonnements. Le module marketing est une pepite.",
    initials: "KB",
  },
  {
    name: "Julie D.",
    role: "Creatrice de contenu",
    text: "Grace a la formation, j'ai enfin pu transformer mon audience en utilisateurs d'app. Le ROI est enorme.",
    initials: "JD",
  },
  {
    name: "Marc L.",
    role: "Developpeur web",
    text: "Je connaissais le web mais pas le mobile. En 2 semaines j'avais une app fonctionnelle sur les stores.",
    initials: "ML",
  },
  {
    name: "Amina K.",
    role: "Etudiante",
    text: "Le module Claude Code vaut le prix de la formation a lui seul. C'est un game changer pour coder avec l'IA.",
    initials: "AK",
  },
];

const gradients = [
  "from-[var(--accent2)] to-[var(--accent)]",
  "from-[var(--red)] to-[var(--red)]",
  "from-[var(--accent2)] to-[var(--accent)]",
  "from-[var(--accent2)] to-[var(--accent)]",
  "from-[var(--green)] to-[var(--green)]",
  "from-[var(--accent2)] to-[var(--green)]",
];

export default function TestimonialsV3() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-[var(--accent2)]">
            Temoignages
          </span>
          <div className="h-px flex-1 bg-[var(--field)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-[-0.035em] text-balance text-[var(--fg)]">
            Ce qu&apos;ils en disent
          </h2>
        </div>

        {/* Testimonials grid inside container */}
        <div className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[var(--sep)]">
          <div className="rounded-xl bg-[var(--field)] p-2">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-xl bg-[var(--bg)] p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradients[i]} flex items-center justify-center text-[var(--fg)] text-xs font-bold shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--fg)]">{t.name}</div>
                      <div className="text-xs text-[var(--fg3)]">{t.role}</div>
                    </div>
                  </div>
                  <div className="flex text-[var(--accent2)] gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm/6 text-[var(--fg2)]">&ldquo;{t.text}&rdquo;</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--field)]" />
    </section>
  );
}
