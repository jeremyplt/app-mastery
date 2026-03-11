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

        </motion.div>
      </div>
    </div>
  );
}
