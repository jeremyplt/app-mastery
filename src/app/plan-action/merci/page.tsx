"use client";

import { motion } from "framer-motion";

export default function MerciPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          className="w-full max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-emerald-400">
            C&apos;est prêt
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tighter text-white">
            Ton Plan d&apos;Action est prêt.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500">
              Regarde-le maintenant.
            </span>
          </h1>

          <p className="mt-4 text-base text-gray-400">
            Tu vas aussi recevoir un email avec le lien. Mais pourquoi attendre
            ?
          </p>

          {/* Video player */}
          <div className="mt-10 isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
            <div className="relative rounded-xl bg-white/5 overflow-hidden aspect-video flex items-center justify-center">
              {/* Placeholder - replace with actual video embed */}
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-sky-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-sky-400 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  Vidéo à venir. Remplace ce placeholder par l&apos;embed
                  YouTube/Vimeo.
                </p>
              </div>

              {/*
              When ready, replace the placeholder above with:
              <iframe
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="Le Plan d'Action - De 0 à 140K$/an avec une seule app"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
              */}
            </div>
          </div>

          {/* CTA to main offer */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg text-white font-medium">
              Tu veux passer à l&apos;action ?
            </p>
            <p className="mt-2 text-base text-gray-400 max-w-md mx-auto">
              Découvre App Mastery, la formation complète pour créer, lancer et
              monétiser ton app en 28 jours.
            </p>
            <a
              href="/v4#pricing"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
            >
              Découvrir App Mastery
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
