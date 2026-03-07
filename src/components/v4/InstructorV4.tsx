"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Epiphany Bridge story (Brunson):
// backstory > desires > old methods that failed > the discovery > the plan > results
export default function InstructorV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-sky-400">
            Qui Suis-Je
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
          <div className="relative rounded-xl bg-white/5 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative grid lg:grid-cols-[1fr_2fr] gap-0">
              {/* Avatar */}
              <div className="flex items-start justify-center p-8 lg:p-12">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden shadow-2xl shadow-sky-500/20 outline outline-white/10">
                  <Image
                    src="/jeremy.jpg"
                    alt="Jeremy Pitault"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover scale-[1.8] translate-y-[23%]"
                  />
                </div>
              </div>

              {/* Epiphany Bridge Story */}
              <div className="p-8 lg:p-12 lg:border-l lg:border-white/10">
                <h3 className="text-2xl font-medium tracking-tight text-white mb-4">
                  Jeremy Pitault
                </h3>

                {/* Story — conversational tone (Marketing Mania style) */}
                <div className="space-y-4 text-sm/6 text-gray-400 max-w-lg">
                  {/* PLACEHOLDER: remplacer avec ton histoire personnelle */}
                  <p>
                    Il y a quelques annees, j&apos;etais exactement ou tu es
                    peut-etre aujourd&apos;hui. Des idees d&apos;apps plein la
                    tete, mais aucune sur les stores.
                  </p>
                  <p>
                    J&apos;ai passe des mois a suivre des tutos, a m&apos;eparpiller
                    entre les technos, a douter. Puis j&apos;ai decouvert une
                    methode qui a tout change : le vibecoding avec l&apos;IA.
                  </p>
                  <p>
                    Resultat ? J&apos;ai cree{" "}
                    <span className="text-white font-medium">
                      Shinobi Japanese
                    </span>
                    , une app qui genere{" "}
                    <span className="text-sky-400 font-semibold">
                      {/* PLACEHOLDER: mettre le vrai chiffre */}
                      [X]$/an de revenus recurrents
                    </span>
                    . Et j&apos;ai cree App Mastery pour que tu puisses faire
                    pareil — sans les erreurs que j&apos;ai faites.
                  </p>
                </div>

                {/* Credentials — social proof of authority */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {[
                    "Createur de Shinobi Japanese",
                    "Expert React Native & Claude Code",
                    /* PLACEHOLDER: ajouter d'autres credentials */
                  ].map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 outline outline-sky-500/20"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
