"use client";

import { motion } from "framer-motion";

// Pain points using the prospect's own words (Stan Leloup method)
// Each point should make the reader nod "oui, c'est exactement ca"
const painPoints = [
  {
    emoji: "01",
    text: "Tu scrolles des tutos YouTube depuis des mois sans jamais finir un seul projet concret.",
  },
  {
    emoji: "02",
    text: "Tu as une idée d'app mais tu ne sais pas par où commencer. Quel langage, quel outil, quel framework.",
  },
  {
    emoji: "03",
    text: "Tu as déjà une app (ou presque) mais personne ne la télécharge. Tu ne sais pas comment la faire connaître sans budget pub.",
  },
  {
    emoji: "04",
    text: "Le marketing te paraît flou : influenceurs, contenu organique, ASO... tu ne sais pas quoi faire ni dans quel ordre.",
  },
  {
    emoji: "05",
    text: "Tu vois des indie hackers lancer des apps rentables et tu te demandes comment ils font.",
  },
  {
    emoji: "06",
    text: "Tu as peur d'investir du temps dans un projet que personne ne téléchargera.",
  },
];

export default function PainPointsV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-pink-400">
            Le Problème
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          {/* Empathetic heading — "Peut-etre que..." (Stan Leloup) */}
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Peut-être que tu te reconnais...
          </h2>
          <p className="mt-4 text-base/7 text-gray-400">
            Si tu lis cette page, c&apos;est probablement parce que tu vis l&apos;une
            de ces situations. Et tu n&apos;es pas seul.
          </p>
        </div>

        {/* Pain points — single column for readability and emotional impact */}
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-pink-500/20">
          <div className="relative rounded-xl bg-white/5 p-2 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="relative flex flex-col gap-1">
              {painPoints.map((point, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 rounded-lg bg-gray-950 px-5 py-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <span className="font-mono text-sm font-semibold text-pink-400/40 shrink-0 pt-0.5">
                    {point.emoji}
                  </span>
                  <p className="text-sm/6 text-gray-300">{point.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Rhetorical question — trial close (Brunson) */}
        <motion.p
          className="mt-8 text-center text-xl font-semibold text-white italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Ça te parle ? Alors lis la suite. Ça va changer.
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
