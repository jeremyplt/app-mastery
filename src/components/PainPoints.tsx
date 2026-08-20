"use client";

import { motion } from "framer-motion";

// Pain points using the prospect's own words (Stan Leloup method)
// Each point should make the reader nod "oui, c'est exactement ça"
const painPoints = [
  {
    emoji: "01",
    text: "Tu scrolles des tutos YouTube depuis des mois sans jamais finir un seul projet concret.",
  },
  {
    emoji: "02",
    text: "Tu as une idée d'app mais tu ne sais pas par où commencer. Quel langage, quel outil, quelle technologie.",
  },
  {
    emoji: "03",
    text: "Tu as déjà une app (ou presque) mais personne ne la télécharge. Tu ne sais pas comment la faire connaître sans budget pub.",
  },
  {
    emoji: "04",
    text: "Le marketing te paraît flou : influenceurs, contenu gratuit, référencement... tu ne sais pas quoi faire ni dans quel ordre.",
  },
  {
    emoji: "05",
    text: "Tu vois des entrepreneurs lancer des apps rentables et tu te demandes comment ils font.",
  },
  {
    emoji: "06",
    text: "Tu as peur d'investir du temps dans un projet que personne ne téléchargera.",
  },
];

export default function PainPoints() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="badge badge-danger">Le Problème</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          {/* Empathetic heading — "Peut-etre que..." (Stan Leloup) */}
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-bold tracking-[-0.03em] text-balance text-[var(--fg)]">
            Peut-être que tu te reconnais...
          </h2>
          <p className="mt-4 text-xl/8 text-[var(--fg2)]">
            Si tu lis cette page, c&apos;est probablement parce que tu vis l&apos;une
            de ces situations. Et tu n&apos;es pas seul.
          </p>
        </div>

        {/* Pain points — single column for readability and emotional impact */}
        <div className="isolate overflow-hidden rounded-[16px] border-[0.5px] border-[color-mix(in_srgb,var(--red)_25%,transparent)] bg-[var(--card)] p-2">
          <div className="relative rounded-[12px] p-2 overflow-hidden">
            <div className="relative flex flex-col gap-1">
              {painPoints.map((point, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 rounded-[10px] bg-[var(--group)] px-5 py-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <span className="font-mono text-base font-bold text-[var(--red)] shrink-0 pt-0.5">
                    {point.emoji}
                  </span>
                  <p className="text-lg/7 text-[var(--fg2)]">{point.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Rhetorical question — trial close (Brunson) */}
        <motion.p
          className="mt-8 text-center text-xl font-semibold text-[var(--fg)] italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Ça te parle ? Tu n&apos;es pas seul. Et surtout, ce n&apos;est pas de ta faute...
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
