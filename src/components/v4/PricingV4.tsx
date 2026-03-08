"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

// Price anchoring against alternatives (Hormozi)
const alternatives = [
  { name: "Bootcamp dev mobile", price: "5 000 - 15 000$", time: "3-6 mois" },
  { name: "Freelance pour créer ton app", price: "10 000 - 50 000$", time: "3-6 mois" },
  { name: "Diplôme universitaire", price: "20 000$+", time: "2-4 ans" },
  { name: "Apprendre seul (tutos)", price: '"Gratuit"', time: "1-3 ans (et probablement jamais)" },
];

const included = [
  "10 modules, 90+ leçons pas-à-pas",
  "Masterclass Claude Code (valeur 497$)",
  "2 lives Q&A par mois avec le formateur",
  "Communauté privée à vie (valeur 600$/an)",
  "Mises à jour à vie",
  "Case study d'une app rentable",
  "Support du formateur",
  "Garantie 30 jours",
];

export default function PricingV4() {
  return (
    <section id="pricing" className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-sky-400">
            Investissement
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Un investissement, pas une dépense
          </h2>
          <p className="mt-4 text-base/7 text-gray-400">
            Compare avec les alternatives pour atteindre le même résultat.
          </p>
        </div>

        {/* Price anchoring — compare to alternatives */}
        <motion.div
          className="mb-8 isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="rounded-xl bg-white/5 p-2">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {alternatives.map((alt, i) => (
                <div key={i} className="rounded-xl bg-gray-950 p-4">
                  <p className="text-sm font-semibold text-white/50 mb-1">
                    {alt.name}
                  </p>
                  <p className="text-lg font-semibold text-pink-400/70 line-through">
                    {alt.price}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{alt.time}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Arrows converging from alternatives to pricing card */}
        <div className="hidden lg:block my-10">
          <svg width="100%" height="100" viewBox="0 0 1000 100" preserveAspectRatio="xMidYMid meet" fill="none">
            {/* Far left */}
            <path d="M100 0 C 200 20, 380 80, 500 95" stroke="url(#arrowGradL)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <polygon points="500,95 488,85 492,90" fill="#0ea5e9" />
            {/* Inner left */}
            <path d="M330 0 C 380 20, 440 65, 500 95" stroke="url(#arrowGradL)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <polygon points="500,95 490,83 494,89" fill="#0ea5e9" />
            {/* Inner right */}
            <path d="M670 0 C 620 20, 560 65, 500 95" stroke="url(#arrowGradR)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <polygon points="500,95 510,83 506,89" fill="#0ea5e9" />
            {/* Far right */}
            <path d="M900 0 C 800 20, 620 80, 500 95" stroke="url(#arrowGradR)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <polygon points="500,95 512,85 508,90" fill="#0ea5e9" />
            {/* Center glow dot */}
            <circle cx="500" cy="95" r="4" fill="#0ea5e9" />
            <circle cx="500" cy="95" r="8" fill="#0ea5e9" opacity="0.2" />
            <defs>
              <linearGradient id="arrowGradL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="arrowGradR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Main pricing card */}
        <div className="max-w-lg mx-auto">
          <motion.div
            className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-sky-500/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative rounded-xl bg-white/5 p-8 overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative text-center">
                <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 outline outline-sky-500/20 mb-6">
                  Accès à vie
                </span>

                {/* Value stack recap */}
                <p className="text-base text-gray-400 mb-2">
                  Valeur totale :{" "}
                  <span className="line-through text-gray-500 text-lg font-medium">2 588$+</span>
                </p>

                {/* Price — precise number (consumer psychology) */}
                <div className="mb-2">
                  <span className="text-5xl sm:text-6xl font-medium tracking-tighter text-white">
                    997
                  </span>
                  <span className="text-xl text-gray-500 ml-1">$</span>
                </div>
                <p className="text-sm text-gray-500 mb-8">
                  Paiement unique | accès à vie
                </p>

                {/* What's included */}
                <div className="space-y-3 text-left mb-8">
                  {included.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/10">
                        <Check size={12} className="text-sky-400" />
                      </div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA — "Call to Value" */}
                <a
                  href="#"
                  className="block w-full rounded-full bg-sky-500 py-3.5 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
                >
                  Accéder maintenant
                </a>

                <p className="text-xs text-sky-400 mt-4 font-medium">
                  Tu reçois tes identifiants dans 2 minutes
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Garantie satisfait ou remboursé 30 jours, zéro risque
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
