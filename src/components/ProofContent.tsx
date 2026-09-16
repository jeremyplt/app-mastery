"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { VideoCard } from "@/components/VideoCard";

// Hand-drawn curved arrow from Logan's photo to the content screenshots
function SketchCurvedArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 10 15 C 25 8, 50 5, 75 12 C 100 19, 110 35, 105 55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 95 48 L 105 60 L 115 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function SketchCurvedArrowLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 110 15 C 95 8, 70 5, 45 12 C 20 19, 10 35, 15 55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 5 48 L 15 60 L 25 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

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

export default function ProofContent() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="mac-eyebrow">Marketing</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-bold tracking-[-0.035em] text-balance text-[var(--fg)]">
            On t&apos;apprend aussi à{" "}
            <span className="relative inline-block">
              faire exploser ta visibilité
              <SketchUnderline className="absolute top-full left-0 w-full text-[var(--accent2)] -mt-1" />
            </span>
          </h2>
        </div>

        <div className="overflow-hidden rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]">
          <div className="relative p-6 sm:p-8 overflow-hidden">
            <div className="relative">
              {/* Logan's photo + name + hand-drawn arrows to the content */}
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Logan's photo */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border-[0.5px] border-[var(--sep)] shadow-xl">
                    <Image src="/proof/logan-v2.png" alt="Logan" width={80} height={80} className="w-full h-full object-cover" />
                  </div>

                  {/* Hand-drawn arrows going left and right from Logan to the content */}
                  <SketchCurvedArrow className="absolute -right-20 sm:-right-28 top-2 w-20 sm:w-28 h-16 sm:h-20 text-[var(--accent2)]" />
                  <SketchCurvedArrowLeft className="absolute -left-20 sm:-left-28 top-2 w-20 sm:w-28 h-16 sm:h-20 text-[var(--accent2)]" />
                </motion.div>

                <motion.div
                  className="mt-3 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-lg font-semibold text-[var(--fg)]">Logan</p>
                  <p className="text-lg text-[var(--fg2)]">
                    Cofondateur de Shinobi Japanese, expert marketing &amp; contenu organique
                  </p>
                </motion.div>

                {/* Hand-drawn annotation text */}
                <motion.p
                  className="mt-3 text-lg text-[var(--accent2)] font-medium italic text-center max-w-xs"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Le génie derrière le marketing de Shinobi Japanese et de
                  dizaines d&apos;e-commerces
                </motion.p>
              </div>

              {/* Video previews grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <VideoCard
                  src="/proof/content-2.5M.mp4"
                  stat="2.5M"
                  statLabel="vues"
                  link="https://www.instagram.com/reel/DQVvpZuCe-p/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                  delay={0.2}
                />
                <VideoCard
                  src="/proof/content-2.1M.mp4"
                  stat="2.1M"
                  statLabel="vues"
                  link="https://www.instagram.com/reel/DMVhjJ2J-aV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                  delay={0.3}
                />
                <VideoCard
                  src="/proof/content-1.9M.mp4"
                  stat="1.9M"
                  statLabel="vues"
                  link="https://www.instagram.com/reel/DP-Vu4jkuFU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                  delay={0.4}
                />
              </div>

              {/* CTA line — Logan teaches this in the formation */}
              <motion.div
                className="mt-8 pt-6 border-t border-[var(--sep)] text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-lg text-[var(--fg2)]">
                  Logan intervient directement dans la formation pour
                  t&apos;apprendre ses{" "}
                  <span className="text-[var(--fg)] font-medium">
                    stratégies de contenu viral
                  </span>{" "}
                  , les mêmes qui ont généré ces résultats.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
