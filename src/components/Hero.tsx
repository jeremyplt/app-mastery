"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useIsExpired } from "./CountdownTimer";

export default function Hero() {
  const expired = useIsExpired();

  return (
    <section className="relative pt-6 pb-10 sm:pt-16 lg:pt-20 lg:pb-12">
      <div className="relative before:absolute before:bottom-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8">
          <span className="font-mono text-base font-semibold tracking-widest uppercase text-sky-400">
            App Mastery
          </span>
        </div>

        {/* Main card */}
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
          <div className="relative rounded-xl bg-white/5 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-cyan-500/5" />

            <div className="grid lg:grid-cols-[3fr_2fr] gap-0">
              {/* Left: all text content */}
              <div className="relative px-5 py-8 sm:px-12 sm:py-20 lg:py-24">
                <motion.h1
                  className="text-4xl/tight sm:text-5xl/tight lg:text-[3.5rem]/tight font-medium tracking-tighter text-balance text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  De Zéro à une{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500">
                    App Rentable
                  </span>{" "}
                  sur l&apos;App Store en 28 Jours
                </motion.h1>

                <motion.p
                  className="mt-6 text-lg/7 text-gray-300 max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  La méthode exacte qui m&apos;a permis de passer de 0 à 140 000€/an de revenus récurrents avec une seule app. Sans écrire une ligne de code, grâce au vibe coding IA.
                </motion.p>

                <motion.ul
                  className="mt-6 space-y-2 text-lg text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                >
                  {[
                    "L'IA écrit le code. Tu diriges la vision.",
                    "De l'idée à la publication sur l'App Store.",
                    "Marketing, influenceurs et monétisation inclus.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-400 text-sm">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </motion.ul>

                <motion.div
                  className="mt-10 flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                >
                  {expired ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-8 py-4 text-lg font-bold text-white/30 cursor-not-allowed">
                      Inscription fermée
                    </span>
                  ) : (
                    <a
                      href="#pricing"
                      className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-4 text-lg font-bold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
                      data-ph-capture-attribute-section="hero"
                    >
                      Lancer mon app maintenant
                    </a>
                  )}
                  <a
                    href="#program"
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-semibold text-gray-300 outline outline-white/15 hover:outline-white/25 transition-colors"
                  >
                    Voir le programme
                  </a>
                </motion.div>

                <motion.div
                  className="mt-6 flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex -space-x-2">
                    {[
                      "/avatars/avatar-1.jpg",
                      "/avatars/avatar-2.jpg",
                      "/avatars/avatar-3.jpg",
                      "/avatars/avatar-4.jpg",
                    ].map((src, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-gray-950 overflow-hidden"
                      >
                        <Image
                          src={src}
                          alt=""
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-950 flex items-center justify-center text-sm font-semibold text-white">
                      +
                    </div>
                  </div>
                  <span className="text-base font-medium text-gray-300">
                    Ils ont déjà lancé leur app
                  </span>
                </motion.div>

                <motion.p
                  className="mt-6 text-sky-400/80 italic text-lg font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.65 }}
                >
                  Et le plus fou ? Ce n&apos;est même pas la partie la plus impressionnante de la méthode...
                </motion.p>
              </div>

              {/* Right: phone mockup */}
              <motion.div
                className="relative hidden lg:flex items-center justify-center p-8 border-l border-white/5 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-cyan-500/5" />
                <div className="pointer-events-none absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl" />

                {/* Phone frame */}
                <div className="relative w-72">
                  <div className="relative rounded-[2.5rem] bg-gray-900 p-2 shadow-2xl shadow-sky-500/10 outline outline-white/10">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-10" />

                    {/* Screen */}
                    <div className="rounded-[2rem] bg-white overflow-hidden">
                      {/* Status bar */}
                      <div className="bg-gray-950 px-6 py-2 flex justify-between items-center">
                        <span className="text-[10px] text-white font-medium">9:41</span>
                        <div className="flex gap-1 items-center">
                          <div className="w-3.5 h-2 rounded-sm bg-white/60" />
                          <div className="w-1 h-2 rounded-sm bg-white/40" />
                          <div className="w-4 h-2 rounded-full border border-white/60 relative">
                            <div className="absolute inset-0.5 right-1 bg-emerald-400 rounded-full" />
                          </div>
                        </div>
                      </div>

                      {/* App content */}
                      <div className="bg-gradient-to-b from-gray-950 to-gray-900 px-4 py-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">A</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-white">Mon App</p>
                            <p className="text-[8px] text-gray-500">Tableau de bord</p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-white/5 p-4">
                          <p className="text-[9px] text-gray-500 mb-1">Revenus ce mois</p>
                          <p className="text-xl font-semibold text-emerald-400">1 247 €</p>
                          <div className="flex items-end gap-0.5 h-16 mt-3">
                            {[30, 45, 35, 55, 65, 50, 75, 85, 70, 90, 95, 100].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-sm bg-gradient-to-t from-sky-500/60 to-emerald-400/60"
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-white/5 p-3">
                            <p className="text-[9px] text-gray-500">Abonnés</p>
                            <p className="text-sm font-semibold text-white">142</p>
                          </div>
                          <div className="rounded-lg bg-white/5 p-3">
                            <p className="text-[9px] text-gray-500">Note</p>
                            <p className="text-sm font-semibold text-white">4.9 ★</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {["Nouvel abonné Premium", "Paiement reçu +9.99€", "5 étoiles reçues", "Abonné upgradé Pro", "Nouveau téléchargement", "Paiement reçu +9.99€"].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-sky-400" : i === 1 ? "bg-emerald-400" : i === 2 ? "bg-amber-400" : i === 3 ? "bg-violet-400" : i === 4 ? "bg-pink-400" : "bg-emerald-400"}`} />
                              <span className="text-[8px] text-gray-400">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom nav */}
                      <div className="bg-gray-950 border-t border-white/5 px-6 py-2 flex justify-between">
                        {["Accueil", "Stats", "Profil"].map((tab, i) => (
                          <div key={i} className="flex flex-col items-center gap-0.5">
                            <div className={`w-4 h-4 rounded-full ${i === 0 ? "bg-sky-500/30" : "bg-white/10"}`} />
                            <span className={`text-[7px] ${i === 0 ? "text-sky-400" : "text-gray-600"}`}>{tab}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Store badges */}
                  <div className="flex justify-center gap-3 mt-4">
                    <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 outline outline-white/10">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      <span className="text-[10px] text-gray-400 font-medium">App Store</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 outline outline-white/10">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.18 23.49c-.36-.18-.65-.46-.82-.82L13.3 11.73l3.55 3.55-13.67 8.21zm-1.06-1.94c-.09-.3-.12-.63-.12-.97V3.42c0-.34.04-.67.12-.97l11.06 11.06L2.12 21.55zM20.15 10.36l-2.74 1.64-3.9-3.9L17.41 4.2l2.74 1.64c1.14.69 1.14 1.83 0 2.52l-.01 2zm-4.96 2.97L3.52 1.66l13.67 8.21-1.99 3.46z" />
                      </svg>
                      <span className="text-[10px] text-gray-400 font-medium">Google Play</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-16 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
