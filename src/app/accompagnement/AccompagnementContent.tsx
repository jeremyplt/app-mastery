"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AdDisclaimer from "@/components/AdDisclaimer";
import BunnyVideo from "@/components/BunnyVideo";
import ThemeToggle from "@/components/ThemeToggle";
import { PRESENTATION_DURATION_LABEL, PRESENTATION_VIDEO_ID } from "@/lib/presentation";

// Page à part pour la vidéo de présentation de l'accompagnement. Le lien est
// envoyé en message privé ou par email : quelqu'un qui n'a pas encore réservé
// d'appel doit pouvoir candidater, quelqu'un qui l'a déjà réservé doit juste
// regarder la vidéo et noter ses questions.
export default function AccompagnementContent() {
  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 38% at 50% -6%, var(--accent-glow), transparent 62%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
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
              Candidater
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center max-w-2xl mx-auto">
            <span className="mac-eyebrow">Vu de l&apos;intérieur</span>
            <h1 className="mt-2 text-[28px] sm:text-[38px] font-bold tracking-[-0.035em] leading-[1.1] text-balance">
              Comment se passe l&apos;accompagnement
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--fg2)] font-medium">
              {PRESENTATION_DURATION_LABEL} pour voir concrètement ce qu&apos;on fait ensemble : la
              communauté, les cours, les coachings de groupe et le suivi de ton app, de
              l&apos;idée jusqu&apos;à la sortie sur les stores.
            </p>
          </div>

          <div className="mt-8">
            <BunnyVideo videoId={PRESENTATION_VIDEO_ID} label="Regarde la présentation" />
          </div>

          <section className="mt-12 text-center max-w-2xl mx-auto">
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-[-0.035em] leading-[1.1] text-balance">
              Tu veux qu&apos;on regarde ton projet ensemble ?
            </h2>
            <p className="mt-4 text-[17px] font-medium text-[var(--fg2)]">
              Un appel de 30 minutes. On regarde ton idée, ta situation et le temps que tu peux y
              consacrer, et on te dit franchement si on peut t&apos;aider.
            </p>
            <Link href="/appel" className="mac-btn mac-btn-primary mac-btn-lg mt-7 inline-flex whitespace-nowrap">
              Candidater à l&apos;accompagnement
            </Link>
            <p className="mt-6 text-[15px] font-semibold text-[var(--fg)]">
              Tu as déjà ton appel de réservé ? Alors note les questions qui te viennent en
              regardant la vidéo, l&apos;appel est fait pour y répondre.
            </p>
          </section>
        </motion.div>
      </div>
      <AdDisclaimer />
    </div>
  );
}
