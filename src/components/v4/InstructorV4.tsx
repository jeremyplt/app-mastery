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
              <div className="flex items-center justify-center p-8 lg:p-12">
                <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-2xl overflow-hidden shadow-2xl shadow-sky-500/20 outline outline-white/10">
                  <Image
                    src="/jeremy.jpg"
                    alt="Jeremy Pitault"
                    width={600}
                    height={600}
                    quality={95}
                    className="w-full h-full object-cover scale-[1.8] translate-y-[23%]"
                  />
                </div>
              </div>

              {/* Epiphany Bridge Story */}
              <div className="p-8 lg:p-12 lg:border-l lg:border-white/10">
                <h3 className="text-2xl font-medium tracking-tight text-white mb-4">
                  Jeremy Pitault
                </h3>

                {/* Story — Epiphany Bridge with emotional depth */}
                <div className="space-y-4 text-base/7 text-gray-300 max-w-lg">
                  {/* Backstory + Despair */}
                  <p>
                    Il y a quelques années, j&apos;étais exactement où tu es
                    peut-être aujourd&apos;hui. Des idées d&apos;apps plein la
                    tête, mais aucune sur les stores.
                  </p>
                  <p>
                    J&apos;ai fini par me lancer. Et honnêtement, ça a été
                    brutal. Des nuits à coder jusqu&apos;à 3h du matin. Mon app
                    qui crashe en production le jour du lancement. Des
                    utilisateurs qui laissent des avis 1 étoile. J&apos;ai
                    travaillé plus de 12h par jour pendant plus de 2 ans sur{" "}
                    <span className="text-white font-medium">
                      Shinobi Japanese
                    </span>
                    .
                  </p>
                  <p>
                    Il y a eu des moments où j&apos;ai sérieusement voulu tout
                    arrêter. La pression financière, le doute constant, la
                    solitude du développeur solo. Je me demandais si
                    j&apos;avais fait le bon choix.
                  </p>

                  {/* Epiphany Moment */}
                  <p className="text-white font-medium">
                    Et puis un jour, tout a changé.
                  </p>
                  <p>
                    J&apos;ai découvert les outils d&apos;IA, et en
                    particulier{" "}
                    <span className="text-sky-400 font-semibold">
                      Claude Code
                    </span>
                    . Ce qui me prenait une semaine de développement pouvait se
                    faire en quelques heures. Le &quot;vibe coding&quot; a
                    littéralement multiplié ma productivité par 10. J&apos;ai
                    réalisé que le jeu avait complètement changé. N&apos;importe
                    qui pouvait maintenant créer une app de qualité
                    professionnelle, sans être un développeur senior.
                  </p>

                  {/* Post-epiphany results timeline */}
                  <p>
                    En combinant cette approche avec ma stratégie de marketing
                    organique, les résultats ont explosé. Mon app est passée de
                    quelques centaines de dollars par mois à{" "}
                    <span className="text-sky-400 font-semibold">
                      140 000$/an de revenus récurrents
                    </span>
                    . Assez pour en vivre confortablement, sans patron, sans
                    horaires, depuis n&apos;importe où dans le monde.
                  </p>

                  {/* Open loop toward the method */}
                  <p className="text-white font-medium">
                    Et maintenant, j&apos;ai condensé tout ce que j&apos;ai
                    appris en une méthode structurée. Voici comment elle
                    fonctionne...
                  </p>
                </div>

                {/* Credentials — social proof of authority */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {[
                    "Créateur de Shinobi Japanese",
                    "140K$/an de revenus récurrents",
                    "YouTubeur apps mobiles",
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
