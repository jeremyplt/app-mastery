"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

// Separate guarantee section (Hormozi: risk reversal = levier #1 de conversion)
// "Les taux de conversion peuvent augmenter de 2x a 4x simplement en changeant la garantie"
export default function GuaranteeV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-emerald-400">
            Garantie
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-emerald-500/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-xl bg-white/5 p-8 sm:p-10 overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative text-center">
                <div className="flex justify-center mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <ShieldCheck size={28} className="text-emerald-400" />
                  </div>
                </div>

                {/* Named guarantee (memorable — Hormozi) */}
                <h3 className="text-2xl font-medium tracking-tight text-white mb-4">
                  La Garantie &ldquo;Zero Risque&rdquo; 30 Jours
                </h3>

                <div className="space-y-4 text-sm/6 text-gray-400 max-w-md mx-auto">
                  <p>
                    Rejoins le programme, suis les lecons, commence a construire
                    ton app. Si apres 30 jours tu estimes que la formation ne
                    t&apos;apporte pas ce qui etait promis, je te rembourse
                    integralement. Pas de questions, pas de conditions
                    cachees.
                  </p>
                  <p className="text-white font-medium">
                    Tout le risque est de mon cote. Pas du tien.
                  </p>
                  {/* PLACEHOLDER: tu peux ajouter une garantie conditionnelle plus forte ici */}
                  {/* Ex: "Si tu suis les 7 modules coeur et que tu n'as pas une app publiee
                       en 90 jours, je te coache personnellement jusqu'a ce que ce soit fait." */}
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
