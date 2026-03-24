"use client";

import { motion } from "framer-motion";

export default function MerciPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="flex min-h-screen flex-col items-center px-4 py-12 sm:py-16">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header confirmation */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-2xl sm:text-3xl font-medium tracking-tighter text-white">
              C&apos;est bien reçu, vérifie ta boîte mail.
            </h1>

            <p className="mt-3 text-lg text-gray-300">
              Ton étude de cas arrive dans quelques minutes. Pense à vérifier tes spams.
            </p>
          </div>

          {/* Video section - placeholder for Bunny video (hidden until video is ready)
          <div className="mt-10 rounded-xl overflow-hidden border border-white/10">
            <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg font-medium">Vidéo en cours de préparation</p>
              </div>
            </div>
          </div>
          */}

          {/* Audit CTA */}
          <div className="mt-10 text-center">
            <span className="font-mono text-sm font-semibold tracking-widest uppercase text-amber-400">
              Offre limitée
            </span>

            <h2 className="mt-3 text-2xl sm:text-3xl font-medium tracking-tighter text-white">
              Audit personnalisé offert
            </h2>

            <p className="mt-3 text-lg text-gray-300 max-w-lg mx-auto">
              Tu as un projet d&apos;app mobile ou tu es déjà lancé ? Je fais un audit complet de ta situation et on définit ensemble les prochaines étapes concrètes.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-base font-bold text-red-400">
                Gratuit pour les 10 prochaines personnes
              </span>
            </div>

            {/* Calendly embed */}
            <div className="mt-8 rounded-xl overflow-hidden border border-white/10 bg-white">
              <iframe
                src="https://calendly.com/jeremypltpro/30min?hide_gdpr_banner=1"
                width="100%"
                height="700"
                frameBorder="0"
                title="Réserver un audit gratuit"
                className="w-full"
              />
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
