"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function InstructorV3() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-[var(--accent2)]">
            Formateur
          </span>
          <div className="h-px flex-1 bg-[var(--field)]" />
        </div>

        <div className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[var(--sep)]">
          <div className="relative rounded-xl bg-[var(--field)] overflow-hidden">
            {/* Dot pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative grid lg:grid-cols-[1fr_2fr] gap-0">
              {/* Avatar side */}
              <div className="flex items-center justify-center p-8 lg:p-12">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden shadow-2xl shadow-[0_8px_24px_color-mix(in_srgb,var(--accent)_20%,transparent)] outline outline-[var(--sep)]">
                  <Image
                    src="/jeremy-v2.jpg"
                    alt="Jeremy Pitault"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              {/* Info side */}
              <div className="p-8 lg:p-12 lg:border-l lg:border-[var(--sep)]">
                <h3 className="text-2xl font-medium tracking-tight text-[var(--fg)] mb-2">Jeremy Pitault</h3>
                <p className="text-sm/6 text-[var(--fg2)] mb-6 max-w-md">
                  Passione par le developpement d&apos;apps et l&apos;IA, j&apos;ai cree cette formation pour partager
                  une methode concrete et accessible a tous. Mon objectif: te donner les outils
                  pour creer, publier et monetiser ta propre app mobile.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Createur d'apps independant", "Expert React Native & Claude Code", "Formateur et createur de contenu"].map((h, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--accent2)] outline outline-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
                      {h}
                    </span>
                  ))}
                </div>
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
