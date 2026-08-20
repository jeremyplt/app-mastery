"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Hand-drawn SVG annotation components
function SketchUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 5 8 C 30 3, 60 9, 100 5 C 140 1, 170 7, 195 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function ProofRevenue() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="mac-eyebrow">Preuves</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.035em] text-[var(--fg)]">
            Pas des promesses.
            <br />
            <span className="relative inline-block">
              Des résultats.
              <SketchUnderline className="absolute -bottom-2 left-0 w-full text-[var(--green)]" />
            </span>
          </h2>
          <p className="mt-4 text-xl/8 text-[var(--fg2)] font-medium">
            400K$/an de revenus récurrents. Plus de 10 000 avis avec une note moyenne de 4.85/5 sur l&apos;App Store.
          </p>
        </div>

        {/* Revenue screenshot */}
        <motion.div
          className="mb-6 overflow-hidden rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative p-6 overflow-hidden">
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-[var(--accent2)] uppercase tracking-wider">
                  Revenus Shinobi Japanese
                </span>
                <Image
                  src="/proof/shinobi-logo.png"
                  alt="Shinobi Japanese"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-md"
                />
              </div>

              <div className="relative">
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/proof/revenue.png"
                    alt="Shinobi Japanese ARR - de 0 a 400K$ en revenus recurrents annuels"
                    width={2400}
                    height={1400}
                    className="w-full h-auto hidden sm:block"
                    quality={90}
                  />
                  <Image
                    src="/proof/revenue-mobile.jpg"
                    alt="Shinobi Japanese ARR - $142,266 de revenus recurrents annuels"
                    width={950}
                    height={1050}
                    className="w-full h-auto sm:hidden"
                    quality={90}
                  />
                </div>
              </div>

              <motion.p
                className="mt-4 text-lg text-[var(--accent2)] font-medium italic"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                De 0 à 400K$/an de revenus récurrents avec une seule app
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* App Store reviews */}
        <motion.div
          className="mb-6 overflow-hidden rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative p-6 overflow-hidden">
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-[var(--green)] uppercase tracking-wider">
                  Reviews App Store
                </span>
                <span className="text-sm font-semibold text-[var(--fg3)]">/</span>
                <span className="text-sm font-semibold text-[var(--fg)]">
                  4.9/5, 5 009 ratings
                </span>
              </div>

              <Image
                src="/proof/reviews-v2.png"
                alt="5,009 ratings - 4.9 out of 5 on the App Store with reviews from users worldwide"
                width={2160}
                height={1080}
                className="w-full h-auto rounded-lg hidden sm:block"
                quality={90}
              />
              <Image
                src="/proof/reviews-mobile.jpg"
                alt="5,009 ratings - 4.9 out of 5 on the App Store with reviews from users worldwide"
                width={750}
                height={1400}
                className="w-full h-auto rounded-lg sm:hidden"
                quality={90}
              />
            </div>
          </div>
        </motion.div>

        {/* Google Play reviews */}
        <motion.div
          className="overflow-hidden rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <div className="relative p-6 overflow-hidden">
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-[var(--green)] uppercase tracking-wider">
                  Reviews Google Play
                </span>
                <span className="text-sm font-semibold text-[var(--fg3)]">/</span>
                <span className="text-sm font-semibold text-[var(--fg)]">
                  4.8/5, 4 624 ratings
                </span>
              </div>

              <Image
                src="/proof/google-play-reviews-v2.png"
                alt="4,624 ratings - 4.8 out of 5 on Google Play Store"
                width={1800}
                height={900}
                className="w-full h-auto rounded-lg hidden sm:block"
                quality={90}
              />
              <Image
                src="/proof/google-play-reviews-mobile-v2.png"
                alt="4,624 ratings - 4.8 out of 5 on Google Play Store"
                width={750}
                height={1400}
                className="w-full h-auto rounded-lg sm:hidden"
                quality={90}
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom annotation */}
        <motion.p
          className="mt-10 text-center text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[var(--fg)]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          C&apos;est <span className="mac-accent">cette méthode exacte</span> que tu
          vas apprendre dans la formation.
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
