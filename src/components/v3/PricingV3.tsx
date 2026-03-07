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
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-sky-400">
            Tarif
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Un investissement, pas une depense
          </h2>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-sky-500/30">
            <div className="relative rounded-xl bg-white/5 p-8 overflow-hidden">
              {/* Grid pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(56,189,248,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.08) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="relative text-center">
                <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 outline outline-sky-500/20 mb-6">
                  Acces a vie
                </span>

                <div className="mb-2">
                  <span className="text-5xl sm:text-6xl font-medium tracking-tighter text-white">997</span>
                  <span className="text-xl text-gray-500 ml-1">$</span>
                </div>
                <p className="text-sm text-gray-500 mb-8">Paiement unique</p>

                <div className="space-y-3 text-left mb-8">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/10">
                        <Check size={12} className="text-sky-400" />
                      </div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="#"
                  className="block w-full rounded-full bg-sky-500 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
                >
                  Rejoindre maintenant
                </a>
                <p className="text-xs text-gray-600 mt-4">Garantie satisfait ou rembourse 30 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
