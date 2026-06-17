"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const gutterStyle = {
  backgroundImage:
    "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
  backgroundSize: "10px 10px",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div
        className="grid grid-cols-[1fr_minmax(0,80rem)_1fr]"
        style={{ "--gutter": "2.5rem" } as React.CSSProperties}
      >
        {/* Left gutter */}
        <div
          className="border-r border-white/10 bg-fixed"
          style={gutterStyle}
        />

        {/* Center content */}
        <div className="min-w-0">
          {/* ── Hero ── */}
          <section className="relative py-20 lg:py-32">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <motion.div
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden shadow-2xl shadow-sky-500/20 outline outline-white/10"
                  {...fadeUp}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src="/jeremy.jpg"
                    alt="Jeremy Pitault"
                    width={400}
                    height={400}
                    quality={95}
                    className="w-full h-full object-cover scale-[1.8] translate-y-[23%]"
                  />
                </motion.div>

                {/* Name */}
                <motion.h1
                  className="mt-8 text-4xl/tight sm:text-5xl/tight lg:text-6xl/tight font-medium tracking-tighter text-white"
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Jeremy Pitault
                </motion.h1>

                {/* Tagline */}
                <motion.p
                  className="mt-4 text-lg sm:text-xl text-gray-300 max-w-xl"
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Créateur d&apos;apps mobiles, YouTubeur et formateur.
                  <br className="hidden sm:block" />
                  J&apos;aide les gens à créer et monétiser leurs apps avec
                  l&apos;IA.
                </motion.p>

                {/* Badges */}
                <motion.div
                  className="mt-6 flex flex-wrap justify-center gap-2"
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {[
                    "Créateur de Shinobi Japanese",
                    "YouTubeur",
                  ].map((label, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-sm font-semibold text-sky-400 outline outline-sky-500/20"
                    >
                      {label}
                    </span>
                  ))}
                </motion.div>

                {/* Social links */}
                <motion.div
                  className="mt-8 flex items-center gap-4"
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <a
                    href="https://www.youtube.com/@jeremyptlt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 outline outline-red-500/20 hover:bg-red-500/20 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </a>
                </motion.div>
              </div>
            </div>

            <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
          </section>

          {/* ── À Propos ── */}
          <section className="relative py-20">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-center gap-4">
                <span className="font-mono text-base font-semibold tracking-widest uppercase text-sky-400">
                  À Propos
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="max-w-3xl space-y-5 text-lg/8 text-gray-300">
                <motion.p
                  {...fadeUp}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  whileInView="animate"
                  initial="initial"
                >
                  Salut, moi c&apos;est Jeremy. Je suis développeur
                  d&apos;applications mobiles et créateur de contenu. Je génère
                  des centaines de milliers d&apos;euros chaque année avec mes
                  apps mobiles, et je partage tout ce que j&apos;apprends en
                  chemin.
                </motion.p>
                <motion.p
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileInView="animate"
                  initial="initial"
                >
                  Mon app principale,{" "}
                  <span className="text-white font-medium">
                    Shinobi Japanese
                  </span>
                  , est une app d&apos;apprentissage du japonais que j&apos;ai
                  construite de zéro, seul, et qui vit aujourd&apos;hui de ses
                  revenus récurrents.
                </motion.p>
                <motion.p
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileInView="animate"
                  initial="initial"
                >
                  Aujourd&apos;hui, avec l&apos;arrivée de l&apos;IA et du
                  &quot;vibe coding&quot;, je suis convaincu que n&apos;importe
                  qui peut créer une app mobile rentable. C&apos;est pour ça que
                  j&apos;ai créé{" "}
                  <span className="text-white font-medium">App Mastery</span>,
                  une formation qui accompagne les gens de l&apos;idée au
                  lancement.
                </motion.p>
                <motion.p
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  whileInView="animate"
                  initial="initial"
                >
                  Sur ma chaîne YouTube, je parle de développement d&apos;apps,
                  de monétisation, de marketing mobile et d&apos;IA. Sans
                  bullshit, avec des résultats concrets.
                </motion.p>
              </div>
            </div>

            <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
          </section>

          {/* ── Réserver un appel ── */}
          <section className="relative py-20">
            <div className="px-4 sm:px-6 lg:px-8">
              <motion.div
                className="isolate overflow-hidden rounded-3xl bg-gray-950 p-2 outline outline-amber-500/30"
                {...fadeUp}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileInView="animate"
                initial="initial"
              >
                <div className="relative rounded-2xl bg-white/5 overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10" />

                  <div className="relative px-6 py-14 sm:px-12 sm:py-20 text-center">
                    <h2 className="mx-auto max-w-3xl text-3xl sm:text-5xl/tight font-bold tracking-tight text-white text-balance">
                      Réserve un appel de 30 minutes pour parler de ton projet
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-200 font-medium">
                      On fait le point sur ton app, on voit si on peut
                      travailler ensemble, et comment je peux t&apos;aider à en
                      générer des revenus mensuels grâce à ton app mobile.
                    </p>

                    <Link
                      href="/appel"
                      className="mt-10 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-10 py-5 text-xl font-bold text-gray-950 transition-transform hover:scale-[1.03] active:scale-100 shadow-2xl shadow-amber-500/30"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                      </svg>
                      Réserver mon appel
                    </Link>

                    <p className="mt-5 text-base font-medium text-gray-300">
                      30 minutes, sans engagement. On parle de toi et de ton
                      projet.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
          </section>

          {/* ── Ressources gratuites ── */}
          <section className="relative py-20">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-center gap-4">
                <span className="font-mono text-base font-semibold tracking-widest uppercase text-emerald-400">
                  Ressources Gratuites
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <motion.div
                className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10 hover:outline-emerald-500/30 transition-colors"
                {...fadeUp}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileInView="animate"
                initial="initial"
              >
                <div className="relative rounded-xl bg-white/5 overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-sky-500/5" />

                  <div className="relative p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-white mb-2">
                        Le Plan d&apos;Action : créer et monétiser une app
                        mobile rentable
                      </h3>
                      <p className="text-base text-gray-300 max-w-lg">
                        Une vidéo gratuite de 15 minutes où je détaille la
                        méthode exacte que j&apos;ai utilisée pour créer,
                        lancer et monétiser Shinobi Japanese.
                      </p>
                    </div>
                    <Link
                      href="/plan-action"
                      className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/25 whitespace-nowrap flex-shrink-0"
                    >
                      Accéder gratuitement
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Jeremy Pitault. Tous droits
                réservés.
              </div>
              <div className="flex gap-6 text-sm text-gray-500">
                <a
                  href="https://www.youtube.com/@jeremyptlt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  YouTube
                </a>
                <Link
                  href="/formation"
                  className="hover:text-gray-300 transition-colors"
                >
                  Formation
                </Link>
              </div>
            </div>
          </footer>
        </div>

        {/* Right gutter */}
        <div
          className="border-l border-white/10 bg-fixed"
          style={gutterStyle}
        />
      </div>
    </div>
  );
}
