"use client";

import { motion } from "framer-motion";
import { ShieldCheck, HandCoins } from "lucide-react";

// Double guarantee section (Hormozi: risk reversal = levier #1 de conversion)
// "Les taux de conversion peuvent augmenter de 2x a 4x simplement en changeant la garantie"
export default function Guarantee() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-base font-semibold tracking-widest uppercase text-emerald-400">
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

                  <span className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2 block">
                    30 premiers jours
                  </span>

                  <h4 className="text-xl font-semibold text-white mb-4">
                    Satisfait ou Remboursé
                  </h4>

                  <p className="text-xl/8 text-gray-300">
                    Tu n&apos;aimes pas la formation ? Tu m&apos;envoies un
                    email dans les 30 jours et je te rembourse intégralement.
                    Pas de questions, pas de justification, pas de conditions
                    cachées. Un simple email suffit.
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
                      <HandCoins size={28} className="text-amber-400" />
                    </div>
                  </div>

                  <span className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2 block">
                    90 jours
                  </span>

                  <h4 className="text-xl font-semibold text-white mb-4">
                    Premiers Revenus ou je te Coache
                  </h4>

                  <p className="text-xl/8 text-gray-300">
                    Tu as suivi les 5 modules, ton app est en ligne, mais tu
                    n&apos;as pas encore tes premiers utilisateurs payants ?
                    Je te coache personnellement jusqu&apos;à ce que tu y
                    arrives. 3 sessions 1-on-1 gratuites pour débloquer ta
                    monétisation. Je ne te lâche pas tant que tu ne gagnes
                    pas d&apos;argent avec ton app.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bold bottom statement */}
          <motion.p
            className="mt-8 text-center text-xl font-bold text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Tout le risque est de mon côté. Si tu ne gagnes pas d&apos;argent,
            je bosse gratuitement pour toi. Tu n&apos;as littéralement rien à perdre.
          </motion.p>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
