"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Rocket } from "lucide-react";

// Double guarantee section (Hormozi: risk reversal = levier #1 de conversion)
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

        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-8 text-center">
            La Double Garantie &ldquo;Zéro Risque&rdquo;
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Guarantee #1 - Satisfait ou Remboursé */}
            <motion.div
              className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-emerald-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative rounded-xl bg-white/5 p-8 overflow-hidden h-full">
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="relative text-center">
                  <div className="flex justify-center mb-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
                      <ShieldCheck size={28} className="text-emerald-400" />
                    </div>
                  </div>

                  <h4 className="text-xl font-semibold text-white mb-4">
                    Satisfait ou Remboursé
                  </h4>

                  <p className="text-base/7 text-gray-300">
                    30 jours pour tester. Si tu n&apos;es pas satisfait, tu
                    m&apos;envoies un email et je te rembourse intégralement.
                    Pas de questions, pas de conditions cachées.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Guarantee #2 - App Publiée ou Remboursé + Coaching */}
            <motion.div
              className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-amber-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="relative rounded-xl bg-white/5 p-8 overflow-hidden h-full">
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="relative text-center">
                  <div className="flex justify-center mb-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                      <Rocket size={28} className="text-amber-400" />
                    </div>
                  </div>

                  <h4 className="text-xl font-semibold text-white mb-4">
                    App Publiée ou Remboursé + Coaching
                  </h4>

                  <p className="text-base/7 text-gray-300">
                    Si tu suis les 5 premiers modules et que ton app n&apos;est
                    pas publiée sur au moins un store, je te rembourse
                    intégralement ET je t&apos;offre 1h de coaching gratuit pour
                    t&apos;aider à la publier.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bold bottom statement */}
          <motion.p
            className="mt-8 text-center text-lg font-bold text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Tout le risque est de mon côté. Pas du tien. Tu n&apos;as
            littéralement rien à perdre.
          </motion.p>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
