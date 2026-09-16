"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AdDisclaimer from "@/components/AdDisclaimer";
import ThemeToggle from "@/components/ThemeToggle";
import { VideoCard } from "@/components/VideoCard";

// Les six vidéos UGC de Shinobi Japanese : des créateurs de contenu briefés
// par nous, qui filment l'app dans leur quotidien d'apprentissage du japonais.
const VIDEOS = [1, 2, 3, 4, 5, 6].map((i) => `/proof/influencer-videos/viral-${i}.mp4`);

export default function UgcContent() {
  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(55% 38% at 50% -6%, var(--accent-glow), transparent 62%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <nav className="mac-nav mb-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight text-[var(--fg)]">
            <span
              className="grid place-items-center w-7 h-7 rounded-lg text-[12px] font-extrabold tracking-tight text-[var(--accent)] border-[0.5px] border-white/10"
              style={{ background: "linear-gradient(150deg, #2b2b2e, #000)" }}
            >
              AM
            </span>
            App Mastery
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/appel" className="mac-btn mac-btn-primary mac-btn-sm whitespace-nowrap">
              Réserver mon appel
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center max-w-3xl mx-auto">
            <span className="mac-eyebrow">Contenu viral</span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-balance">
              Les vidéos UGC qui ont fait connaître{" "}
              <span className="mac-accent">Shinobi Japanese</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl font-medium text-[var(--fg)] text-balance">
              Des créateurs de contenu briefés par nous, qui filment l&apos;application dans leur quotidien.
              Plusieurs millions de vues cumulées sur TikTok, Instagram Reels et YouTube Shorts.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 max-w-4xl mx-auto">
            {VIDEOS.map((src, i) => (
              <VideoCard key={src} src={src} delay={0.1 * (i + 1)} />
            ))}
          </div>

          <div className="mt-8 max-w-3xl mx-auto rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-5 sm:p-6">
            <p className="text-lg font-medium text-[var(--fg)] text-center">
              Trouver un créateur, c&apos;est 10 % du travail. Les 90 % restants, c&apos;est le briefer et le cadrer
              pour qu&apos;il produise des vidéos qui explosent. C&apos;est exactement ce qu&apos;on te transmet dans
              l&apos;accompagnement.
            </p>
          </div>

          <div className="mt-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-balance">
              Tu veux la même chose pour ton application ?
            </h2>
            <p className="mt-4 text-lg font-medium text-[var(--fg)] text-balance">
              Trente minutes avec Nolan, mon associé, ou avec moi, pour voir si l&apos;accompagnement est fait pour
              toi. On ne prend pas tout le monde, et on te le dit honnêtement.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <Link href="/appel" className="mac-btn mac-btn-primary mac-btn-lg">
                Réserver mon appel
              </Link>
              <Link href="/temoignage/florian" className="text-[15px] font-semibold text-[var(--accent)] hover:underline">
                Voir le témoignage de Florian &rarr;
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mt-20">
          <AdDisclaimer />
        </div>
      </div>
    </div>
  );
}
