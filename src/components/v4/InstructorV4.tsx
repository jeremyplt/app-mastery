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

                {/* Story — conversational tone (Marketing Mania style) */}
                <div className="space-y-4 text-sm/6 text-gray-400 max-w-lg">
                  <p>
                    Il y a quelques années, j&apos;étais exactement où tu es
                    peut-être aujourd&apos;hui. Des idées d&apos;apps plein la
                    tête, mais aucune sur les stores.
                  </p>
                  <p>
                    J&apos;ai passé des mois à suivre des tutos, à
                    m&apos;éparpiller entre les technos, à douter. Puis
                    j&apos;ai pris mon courage à deux mains et je me suis
                    lancé. J&apos;ai travaillé plus de 12h par jour pendant
                    plus de 2 ans sur mon app{" "}
                    <span className="text-white font-medium">
                      Shinobi Japanese
                    </span>
                    , qui génère maintenant{" "}
                    <span className="text-sky-400 font-semibold">
                      140 000$/an de revenus récurrents
                    </span>
                    . Assez pour en vivre sans trop ouvrir mon ordinateur.
                  </p>
                  <p>
                    J&apos;ai fait toutes les erreurs possibles. Mais
                    j&apos;ai surtout découvert une stratégie et un workflow
                    qui permettent de créer une app rentable à coup sûr.
                    C&apos;est exactement ce que je veux te partager dans
                    cette formation.
                  </p>
                </div>

                {/* Credentials — social proof of authority */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {[
                    "Créateur de Shinobi Japanese",
                    "YouTubeur apps mobiles",
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
