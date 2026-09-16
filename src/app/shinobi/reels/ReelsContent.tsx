"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AdDisclaimer from "@/components/AdDisclaimer";
import ThemeToggle from "@/components/ThemeToggle";
import { VideoCard } from "@/components/VideoCard";

// Les trois reels de Shinobi Japanese qui ont le plus tourné, avec leur
// nombre de vues Instagram au moment de la capture.
const REELS = [
  {
    src: "/proof/content-2.5M.mp4",
    stat: "2,5 M",
    link: "https://www.instagram.com/reel/DQVvpZuCe-p/",
  },
  {
    src: "/proof/content-2.1M.mp4",
    stat: "2,1 M",
    link: "https://www.instagram.com/reel/DMVhjJ2J-aV/",
  },
  {
    src: "/proof/content-1.9M.mp4",
    stat: "1,9 M",
    link: "https://www.instagram.com/reel/DP-Vu4jkuFU/",
  },
];

export default function ReelsContent() {
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
            <span className="mac-eyebrow">Marketing organique</span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-balance">
              Les reels qui ont fait connaître{" "}
              <span className="mac-accent">Shinobi Japanese</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl font-medium text-[var(--fg)] text-balance">
              Trois vidéos, plus de 6 millions de vues en tout, zéro euro de pub. C&apos;est ce genre de
              contenu, publié tous les jours, qui envoie les installations et les abonnements.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {REELS.map((r, i) => (
              <VideoCard key={r.src} src={r.src} stat={r.stat} statLabel="vues" link={r.link} delay={0.15 * (i + 1)} />
            ))}
          </div>

          <div className="mt-8 max-w-3xl mx-auto rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border-[0.5px] border-[var(--sep)]">
              <Image src="/proof/logan-v2.png" alt="Logan" width={80} height={80} className="w-full h-full object-cover" />
            </div>
            <p className="text-lg font-medium text-[var(--fg)] text-center sm:text-left">
              Ces vidéos sont signées Logan, mon cofondateur sur Shinobi Japanese. C&apos;est cette méthode de
              contenu que Florian a appliquée pour passer à plus de 120 installations par jour.
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
