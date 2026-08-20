"use client";

import Image from "next/image";

// Epiphany Bridge story (Brunson):
// backstory > desires > old methods that failed > the discovery > the plan > results
export default function Instructor() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="mac-eyebrow">Qui suis-je</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="overflow-hidden rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]">
          <div className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(var(--sep) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative grid lg:grid-cols-[1fr_2fr] gap-0">
              {/* Avatar */}
              <div className="flex items-center justify-center p-8 lg:p-12">
                <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-[0.5px] border-[var(--sep)]">
                  <Image
                    src="/jeremy-v2.jpg"
                    alt="Jeremy Pitault"
                    width={600}
                    height={600}
                    quality={95}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Epiphany Bridge Story */}
              <div className="p-8 lg:p-12 lg:border-l lg:border-[var(--sep)]">
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--fg)] mb-4">
                  Jeremy Pitault
                </h3>

                {/* Story — Epiphany Bridge with emotional depth */}
                <div className="space-y-4 text-lg/8 text-[var(--fg2)] max-w-lg">
                  {/* Backstory + Despair */}
                  <p>
                    Il y a quelques années, j&apos;étais exactement où tu es
                    peut-être aujourd&apos;hui. Des idées d&apos;apps plein la
                    tête, mais aucune sur l&apos;App Store ou Google Play.
                  </p>
                  <p>
                    J&apos;ai fini par me lancer. Et honnêtement, ça a été
                    brutal. Des nuits à coder jusqu&apos;à 3h du matin. Mon app
                    qui crashe en production le jour du lancement. Des
                    utilisateurs qui laissent des avis 1 étoile. J&apos;ai
                    travaillé plus de 12h par jour pendant plus de 2 ans sur{" "}
                    <span className="text-[var(--fg)] font-semibold">
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
                  <p className="text-[var(--fg)] font-semibold">
                    Et puis un jour, tout a changé.
                  </p>
                  <p>
                    J&apos;ai découvert les outils d&apos;IA, et en
                    particulier{" "}
                    <span className="text-[var(--accent2)] font-semibold">
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
                    <span className="text-[var(--accent2)] font-semibold">
                      400 000€/an de revenus récurrents
                    </span>
                    . Assez pour en vivre confortablement, sans patron, sans
                    horaires, depuis n&apos;importe où dans le monde.
                  </p>

                  {/* Open loop toward the method */}
                  <p className="text-[var(--fg)] font-semibold">
                    Et maintenant, j&apos;ai condensé tout ce que j&apos;ai
                    appris en une méthode structurée. Voici comment elle
                    fonctionne...
                  </p>
                </div>

                {/* Credentials — social proof of authority */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {[
                    "Créateur de Shinobi Japanese",
                    "400K€/an de revenus récurrents",
                    "YouTubeur apps mobiles",
                  ].map((h, i) => (
                    <span key={i} className="badge badge-blue">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
