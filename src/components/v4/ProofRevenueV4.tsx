"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Hand-drawn SVG annotation components
function SketchCircle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 30 60 C 28 25, 75 8, 120 12 C 165 16, 188 35, 185 60 C 182 85, 155 108, 100 110 C 45 112, 15 95, 18 70 C 20 55, 35 45, 38 58"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}

function SketchArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 30 5 C 28 20, 32 45, 30 75"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 18 62 L 30 80 L 42 62"
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

export default function ProofRevenueV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-emerald-400">
            Preuves
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Pas des promesses.{" "}
            <span className="relative inline-block">
              Des resultats.
              <SketchUnderline className="absolute -bottom-2 left-0 w-full text-emerald-400" />
            </span>
          </h2>
        </div>

        {/* Revenue screenshot */}
        <motion.div
          className="mb-6 isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-amber-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative rounded-xl bg-white/5 p-6 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
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
                    alt="Shinobi Japanese ARR - de 0 a 140K$ en revenus recurrents annuels"
                    width={2400}
                    height={1400}
                    className="w-full h-auto"
                    quality={90}
                  />
                </div>


              </div>

              <motion.p
                className="mt-4 text-sm text-amber-400 font-medium italic"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                De 0 à 140K$/an de revenus récurrents avec une seule app
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* App Store reviews */}
        <motion.div
          className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-emerald-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative rounded-xl bg-white/5 p-6 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Reviews App Store
                </span>
                <span className="text-xs font-semibold text-white">
                  , 4.9/5, 5 009 ratings
                </span>
              </div>

              <Image
                src="/proof/reviews-v2.png"
                alt="5,009 ratings - 4.9 out of 5 on the App Store with reviews from users worldwide"
                width={2160}
                height={1080}
                className="w-full h-auto rounded-lg"
                quality={90}
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom annotation */}
        <motion.p
          className="mt-10 text-center text-2xl sm:text-3xl font-medium tracking-tight text-white"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          C&apos;est{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
            cette méthode exacte
          </span>{" "}
          que tu vas apprendre dans la formation.
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
