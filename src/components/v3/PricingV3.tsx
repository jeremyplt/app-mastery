"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "14 modules, 90+ lecons video",
  "Acces a vie + mises a jour",
  "Communaute privee",
  "Masterclass Claude Code",
  "Templates & starter kits",
  "Support du formateur",
  "Garantie 30 jours",
];

export default function PricingV3() {
  return (
    <section id="pricing" className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-[var(--accent2)]">
            Tarif
          </span>
          <div className="h-px flex-1 bg-[var(--field)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-[-0.035em] text-balance text-[var(--fg)]">
            Un investissement, pas une depense
          </h2>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[color-mix(in_srgb,var(--accent)_30%,transparent)]">
            <div className="relative rounded-xl bg-[var(--field)] p-8 overflow-hidden">
              {/* Dot pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative text-center">
                <span className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--accent2)] outline outline-[color-mix(in_srgb,var(--accent)_20%,transparent)] mb-6">
                  Acces a vie
                </span>

                <div className="mb-2">
                  <span className="text-5xl sm:text-6xl font-medium tracking-[-0.035em] text-[var(--fg)]">997</span>
                  <span className="text-xl text-[var(--fg2)] ml-1">$</span>
                </div>
                <p className="text-sm text-[var(--fg2)] mb-8">Paiement unique</p>

                <div className="space-y-3 text-left mb-8">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]">
                        <Check size={12} className="text-[var(--accent2)]" />
                      </div>
                      <span className="text-sm text-[var(--fg2)]">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="#"
                  className="block w-full rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--accent2)] transition-colors"
                >
                  Rejoindre maintenant
                </a>
                <p className="text-xs text-[var(--fg3)] mt-4">Garantie satisfait ou rembourse 30 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--field)]" />
    </section>
  );
}
