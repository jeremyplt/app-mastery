"use client";

import { motion } from "framer-motion";

// Structured testimonials with before/after transformation (most persuasive format)
// Each testimonial should show: who they are, where they started, what they achieved
const testimonials = [
  {
    name: "Thomas R.",
    role: "Entrepreneur",
    before: "N'avait jamais codé",
    after: "App lancée en 3 semaines",
    text: "J'ai lancé mon app de suivi fitness en 3 semaines. Après 2 mois, j'avais déjà 47 abonnés payants.",
  },
  {
    name: "Sophie M.",
    role: "Freelance designer",
    before: "Perdue dans les tutos",
    after: "App publiée sur les 2 stores",
    text: "La formation est ultra structurée. Mon app de recettes est sur les deux stores depuis 1 mois et les téléchargements augmentent chaque semaine.",
  },
  {
    name: "Karim B.",
    role: "Étudiant",
    before: "Zéro revenus en ligne",
    after: "380€/mois d'abonnements",
    text: "Mon app de vocabulaire génère déjà 380€/mois d'abonnements après seulement 6 semaines. Le module marketing a tout changé.",
  },
  {
    name: "Julie D.",
    role: "Créatrice de contenu",
    before: "Audience sans monétisation",
    after: "200+ téléchargements en 1 semaine",
    text: "J'ai converti mon audience Instagram en 200+ téléchargements la première semaine grâce aux stratégies de contenu de Logan.",
  },
  {
    name: "Marc L.",
    role: "Développeur web",
    before: "Connaissait le web, pas le mobile",
    after: "App fonctionnelle en 2 semaines",
    text: "Je connaissais le web mais pas le mobile. En 2 semaines mon app était fonctionnelle. Le vibe coding avec Claude Code, c'est un game changer.",
  },
  {
    name: "Amina K.",
    role: "Étudiante",
    before: "Débutante complète",
    after: "App codée entièrement avec l'IA",
    text: "Le module Claude Code vaut à lui seul le prix de la formation. J'ai appris à coder mon app entière sans écrire une ligne moi-même.",
  },
];

export default function TestimonialsV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-fuchsia-400">
            Résultats
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Ils sont passés de zéro à une app publiée
          </h2>
          <p className="mt-4 text-base/7 text-white font-medium">
            Résultats de membres ayant suivi le programme complet
          </p>
        </div>

        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
          <div className="rounded-xl bg-white/5 p-2">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-xl bg-gray-950 p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  {/* Identity */}
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-white">
                      {t.name}
                    </div>
                    <div className="text-sm text-gray-300 font-medium">
                      {t.role}
                    </div>
                  </div>

                  {/* Before/After mini transformation */}
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <span className="text-pink-400/70 line-through">
                      {t.before}
                    </span>
                    <span className="text-white/40">&rarr;</span>
                    <span className="text-emerald-400 font-medium">
                      {t.after}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex text-amber-400 gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <svg
                        key={j}
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm/6 text-gray-300">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA after social proof */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
          >
            Lancer mon app maintenant
          </a>
        </motion.div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
