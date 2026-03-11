"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useIsExpired } from "./CountdownTimer";

// Price anchoring against alternatives (Hormozi)
const alternatives = [
  { name: "Bootcamp dev mobile", price: "5 000 - 15 000€", time: "3-6 mois" },
  { name: "Freelance pour créer ton app", price: "10 000 - 50 000€", time: "3-6 mois" },
  { name: "Diplôme universitaire", price: "20 000€+", time: "2-4 ans" },
  { name: "Apprendre seul (tutos)", price: '"Gratuit"', time: "1-3 ans (et probablement jamais)" },
];

// Tier definitions
const essentielFeatures = [
  "5 modules essentiels (55+ leçons)",
  "De l'idée à la publication sur l'App Store",
  "Support par email",
  "Double garantie (remboursé 30j + coaching revenus 90j)",
];

const essentielExcluded = [
  "Masterclass Marketing (marketing + revenus)",
  "Masterclass Claude Code",
  "Masterclass Git & GitHub",
  "Lives Q&A 2x/mois",
  "Communauté privée à vie",
  "Case Study Shinobi Japanese",
  "Mises à jour à vie",
];

const completFeatures = [
  "Tout de l'offre Essentiel",
  "Masterclass Marketing : marketing + revenus (valeur 997€)",
  "Masterclass Claude Code (valeur 497€)",
  "Masterclass Git & GitHub (valeur 297€)",
  "2 lives Q&A par mois avec le formateur",
  "Communauté privée à vie (valeur 600€/an)",
  "Case Study Shinobi Japanese",
  "Mises à jour à vie",
  "Double garantie (remboursé 30j + coaching revenus 90j)",
];

const vipFeatures = [
  "Tout de l'offre Complet",
  "Accompagnement 1-on-1 avec Jeremy pendant 3 mois via WhatsApp",
  "Je t'aide à trouver et valider ton idée d'app rentable",
  "Je te guide sur ta stratégie marketing (influenceurs, contenu, référencement)",
  "Audit complet de ton app (design, code, revenus)",
  "Accès direct et illimité pour poser tes questions",
];

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const posthog = usePostHog();
  const expired = useIsExpired();

  function handleCheckout(plan: string) {
    posthog?.capture("checkout_started", { plan }, { send_instantly: true });
    setLoadingPlan(plan);
    // Let the browser paint the spinner before starting the fetch
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        try {
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan }),
          });
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url;
          } else {
            setLoadingPlan(null);
          }
        } catch {
          setLoadingPlan(null);
        }
      });
    });
  }

  return (
    <section id="pricing" className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-base font-semibold tracking-widest uppercase text-sky-400">
            Investissement
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Un investissement, pas une dépense
          </h2>
          <p className="mt-4 text-xl/8 text-white/80 font-medium">
            Compare avec les alternatives pour atteindre le même résultat.
          </p>
        </div>

        {/* Price anchoring - compare to alternatives */}
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

        {/* Arrows converging from alternatives to pricing cards */}
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

        {/* 3-tier pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 items-stretch max-w-6xl mx-auto">

          {/* ── Option 1: Essentiel ── */}
          <motion.div
            className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.0 }}
          >
            <div className="relative rounded-xl bg-white/5 p-6 sm:p-8 overflow-hidden flex-1 flex flex-col">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-white mb-6">Essentiel</h3>

                <div className="mb-1">
                  <span className="text-4xl sm:text-5xl font-medium tracking-tighter text-white">
                    497
                  </span>
                  <span className="text-xl text-white/60 ml-1">€</span>
                </div>
                <p className="text-lg text-white/70 font-medium mb-8">
                  Paiement unique
                </p>

                {/* Included features */}
                <div className="space-y-3 mb-6">
                  {essentielFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/10 mt-0.5">
                        <Check size={12} className="text-sky-400" />
                      </div>
                      <span className="text-lg text-white/90 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Excluded features */}
                <div className="space-y-3 mb-8">
                  {essentielExcluded.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 mt-0.5">
                        <X size={12} className="text-white/30" />
                      </div>
                      <span className="text-lg text-white/30 line-through font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handleCheckout("essentiel")}
                    disabled={expired || loadingPlan !== null}
                    data-ph-capture-attribute-section="pricing-essentiel"
                    className={`block w-full rounded-full border-2 py-3 text-base font-semibold text-center transition-colors disabled:cursor-not-allowed ${expired ? "border-white/10 text-white/30 cursor-not-allowed" : "border-white/20 text-white hover:border-white/40 cursor-pointer disabled:opacity-50"}`}
                  >
                    {expired ? "Inscription fermée" : loadingPlan === "essentiel" ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Chargement...
                      </span>
                    ) : "Choisir Essentiel"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Option 2: Complet (HIGHLIGHTED) ── */}
          <motion.div
            className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-sky-500/50 shadow-lg shadow-sky-500/10 scale-100 lg:scale-105 relative z-10 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative rounded-xl bg-white/5 p-6 sm:p-8 overflow-hidden flex-1 flex flex-col">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              {/* Glow effect */}
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />

              <div className="relative text-center flex flex-col flex-1">
                <span className="inline-flex self-center items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold tracking-wider uppercase text-sky-400 outline outline-sky-500/30 mb-6">
                  Meilleure valeur
                </span>

                <h3 className="text-lg font-semibold text-white mb-4">Complet</h3>

                <p className="text-lg text-white/80 font-medium mb-2">
                  Valeur totale :{" "}
                  <span className="line-through text-white/40 text-lg font-semibold">2 588€+</span>
                </p>

                <p className="text-sm font-bold tracking-widest uppercase text-amber-400 mb-2">
                  Offre de lancement
                </p>
                <div className="mb-1">
                  <span className="text-5xl sm:text-6xl font-medium tracking-tighter text-white">
                    997
                  </span>
                  <span className="text-xl text-white/60 ml-1">€</span>
                  <span className="text-lg text-white/40 line-through font-medium ml-2">
                    1 497€
                  </span>
                </div>
                <p className="text-base text-sky-400 font-semibold mb-3">
                  ou 3x 347€
                </p>
                <p className="text-sm text-amber-400/90 font-semibold mb-8">
                  Ce prix ne sera plus jamais aussi bas. Une fois l&apos;offre de lancement terminée, le tarif remonte définitivement.
                </p>

                {/* Included features */}
                <div className="space-y-3 text-left mb-8">
                  {completFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/10 mt-0.5">
                        <Check size={12} className="text-sky-400" />
                      </div>
                      <span className="text-lg text-white font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handleCheckout("complet")}
                    disabled={expired || loadingPlan !== null}
                    data-ph-capture-attribute-section="pricing-complet"
                    className={`block w-full rounded-full py-4 text-base font-bold text-white transition-colors disabled:cursor-not-allowed ${expired ? "bg-white/10 cursor-not-allowed text-white/30" : "bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-50"}`}
                  >
                    {expired ? "Inscription fermée" : loadingPlan === "complet" ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Chargement...
                      </span>
                    ) : "Lancer mon app maintenant"}
                  </button>

                  {!expired && (
                    <button
                      onClick={() => handleCheckout("complet-3x")}
                      disabled={loadingPlan !== null}
                      className="text-base text-sky-400 mt-4 font-semibold hover:text-sky-300 underline underline-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingPlan === "complet-3x" ? (
                        <span className="inline-flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          Chargement...
                        </span>
                      ) : "ou payer en 3x 347€"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Option 3: VIP ── */}
          <motion.div
            className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-amber-500/20 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative rounded-xl bg-white/5 p-6 sm:p-8 overflow-hidden flex-1 flex flex-col">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative text-center flex flex-col flex-1">
                <span className="inline-flex self-center items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold tracking-wider uppercase text-amber-400 outline outline-amber-500/30 mb-6">
                  Exclusif
                </span>

                <h3 className="text-lg font-semibold text-white mb-6">VIP</h3>

                <div className="mb-1">
                  <span className="text-4xl sm:text-5xl font-medium tracking-tighter text-white">
                    2 997
                  </span>
                  <span className="text-xl text-white/60 ml-1">€</span>
                </div>
                <p className="text-base text-amber-400 font-semibold mb-1">
                  ou 3x 1 097€
                </p>
                <div className="flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1.5 mb-8 self-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="text-xs font-bold text-red-400">
                    5 places disponibles
                  </span>
                </div>

                {/* Included features */}
                <div className="space-y-3 mb-8">
                  {vipFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 mt-0.5">
                        <Check size={12} className="text-amber-400" />
                      </div>
                      <span className="text-lg text-white/90 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handleCheckout("vip")}
                    disabled={expired || loadingPlan !== null}
                    data-ph-capture-attribute-section="pricing-vip"
                    className={`block w-full rounded-full py-3.5 text-base font-bold text-white text-center transition-colors disabled:cursor-not-allowed ${expired ? "bg-white/10 cursor-not-allowed text-white/30" : "bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50"}`}
                  >
                    {expired ? "Inscription fermée" : loadingPlan === "vip" ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Chargement...
                      </span>
                    ) : "Devenir VIP"}
                  </button>

                  {!expired && (
                    <button
                      onClick={() => handleCheckout("vip-3x")}
                      disabled={loadingPlan !== null}
                      className="text-base text-amber-400 mt-4 font-semibold hover:text-amber-300 underline underline-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingPlan === "vip-3x" ? (
                        <span className="inline-flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          Chargement...
                        </span>
                      ) : "ou payer en 3x 1 097€"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
