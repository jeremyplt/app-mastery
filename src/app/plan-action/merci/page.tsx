"use client";

import { motion } from "framer-motion";

export default function MerciPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          className="w-full max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Email icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-amber-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>

          <span className="mt-6 block font-mono text-sm font-semibold tracking-widest uppercase text-amber-400">
            C&apos;est presque prêt
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tighter text-white">
            Vérifie ta boîte mail.
          </h1>

          <p className="mt-4 text-lg text-gray-300 max-w-md mx-auto">
            Tu vas recevoir le Plan d&apos;Action dans quelques minutes.
            Pense à vérifier tes spams si tu ne le vois pas.
          </p>

          {/* Audit call CTA */}
          <div className="mt-10 pt-10 border-t border-white/10">
            <p className="text-xl font-semibold text-white mb-2">
              Tu as déjà une app ou un projet en tête ?
            </p>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Réserve un appel gratuit de 30 minutes. On analyse ton projet ensemble et je te donne un plan d&apos;action personnalisé.
            </p>
            <a
              href="https://calendly.com/jeremypltpro/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-4 text-lg font-bold text-white hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Réserve ton audit gratuit
            </a>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
