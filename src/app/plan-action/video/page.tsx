"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const PLAN_ACTION_VIDEO_ID = "a1fa42ba-337e-4cf1-b0b7-24fc7ab5be24";

export default function PlanActionVideoPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          className="w-full max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-bold tracking-wider uppercase text-amber-400 outline outline-amber-500/30">
            Plan d&apos;Action
          </span>

          <h1 className="mt-6 text-3xl sm:text-4xl font-medium tracking-tighter text-white">
            Ton Plan d&apos;Action pour lancer ton app rentable
          </h1>

          <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
            Regarde cette vidéo pour découvrir la méthode exacte que j&apos;ai utilisée pour passer de 0 à 140 000$/an avec une app mobile.
          </p>

          {/* Video player */}
          <div className="mt-8">
            <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
              <div className="relative rounded-xl overflow-hidden aspect-video">
                <iframe
                  src={`https://iframe.mediadelivery.net/embed/613852/${PLAN_ACTION_VIDEO_ID}?autoplay=false&preload=true&responsive=true`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-xl font-semibold text-white mb-4">
              Prêt à passer à l&apos;action ?
            </p>
            <Link
              href="/formation"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-4 text-lg font-bold text-white hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/25"
            >
              Découvrir App Mastery
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
