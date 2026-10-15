"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AdDisclaimer from "@/components/AdDisclaimer";
import BunnyVideo from "@/components/BunnyVideo";
import ThemeToggle from "@/components/ThemeToggle";
import type { Temoignage } from "@/lib/temoignages";

// Page de témoignage d'un élève (/temoignage/<slug>) : en-tête, vidéo,
// chiffres, captures, parcours, citations, ce qu'on a changé, sa méthode.

export type TemoignageDetailProps = {
  t: Temoignage;
  title: React.ReactNode;
  intro: string;
  videoCaption: string;
  // Captures du tableau de bord affichées sous les chiffres.
  proofs?: { src: string; width: number; height: number; alt: string; caption: string }[];
  timelineTitle: string;
  timeline: { when: string; title: string; body: string }[];
  quotes: { text: string; context: string }[];
  changesTitle: string;
  changes: string[];
  rulesTitle: string;
  rules: { title: string; body: string }[];
};

export default function TemoignageDetail({
  t,
  title,
  intro,
  videoCaption,
  proofs,
  timelineTitle,
  timeline,
  quotes,
  changesTitle,
  changes,
  rulesTitle,
  rules,
}: TemoignageDetailProps) {
  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 38% at 50% -6%, var(--accent-glow), transparent 62%)",
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
              Candidater
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* En-tête */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="mx-auto w-24 h-24 rounded-[24px] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.35)] border-[0.5px] border-white/10">
              <Image
                src={t.photo}
                alt={`${t.firstName}, ${t.age} ans`}
                width={720}
                height={720}
                quality={90}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mac-eyebrow mt-5">
              {t.firstName}, {t.age} ans, créateur d&apos;une app mobile
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-balance">
              {title}
            </h1>
            <p className="mt-6 text-[17px] sm:text-[19px] leading-relaxed text-[var(--fg2)] font-medium max-w-2xl mx-auto">
              {intro}
            </p>
          </div>

          {/* Chiffres */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {t.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] px-5 py-5 text-center"
              >
                <p className="text-[30px] sm:text-[36px] font-bold tracking-[-0.04em] leading-none text-[var(--accent2)]">
                  {s.value}
                </p>
                <p className="mt-2 text-[15px] font-bold text-[var(--fg)] leading-tight">{s.label}</p>
                <p className="mt-1.5 text-[13.5px] font-medium text-[var(--fg2)] leading-snug">{s.detail}</p>
              </div>
            ))}
          </div>

          {/* Vidéo */}
          <div className="mt-10">
            <BunnyVideo
              videoId={t.videoId}
              youtubeId={t.youtubeId}
              poster={t.poster}
              label={`Regarde le témoignage de ${t.firstName}`}
            />
            <p className="mt-3 text-center text-[14px] font-medium text-[var(--fg2)]">{videoCaption}</p>
          </div>

          {/* Captures */}
          {proofs && proofs.length > 0 && (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {proofs.map((p) => (
                <figure
                  key={p.src}
                  className="rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-3"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    className="w-full rounded-[10px]"
                  />
                  <figcaption className="mt-3 px-1 text-[15px] font-semibold leading-snug">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}

          {/* Parcours */}
          <section className="mt-16 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="mac-eyebrow">Son parcours</span>
              <h2 className="mt-2 text-[24px] sm:text-[30px] font-bold tracking-[-0.03em] text-balance">
                {timelineTitle}
              </h2>
            </div>
            <ol className="relative border-l-[2px] border-[var(--sep)] ml-3 sm:ml-4 space-y-8">
              {timeline.map((step, i) => (
                <li key={step.title} className="relative pl-7 sm:pl-9">
                  <span className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] text-[12px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--accent2)]">
                    {step.when}
                  </p>
                  <h3 className="mt-1 text-[19px] font-bold text-[var(--fg)]">{step.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-[var(--fg2)] font-medium">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* Citations */}
          <section className="mt-16">
            <div className="text-center mb-8">
              <span className="mac-eyebrow">Dans ses mots</span>
              <h2 className="mt-2 text-[24px] sm:text-[30px] font-bold tracking-[-0.03em]">
                Ce que {t.firstName} dit de l&apos;accompagnement
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {quotes.map((q) => (
                <figure
                  key={q.text}
                  className="rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-6"
                >
                  <blockquote className="text-[18px] font-semibold leading-snug text-[var(--fg)]">
                    « {q.text} »
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <Image
                      src={t.photo}
                      alt=""
                      width={40}
                      height={40}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="text-[14px] font-medium text-[var(--fg2)]">
                      {t.firstName}, {q.context}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Ce qu'on a changé + sa méthode */}
          <section className="mt-16 grid lg:grid-cols-2 gap-4">
            <div className="rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-6 sm:p-8">
              <span className="mac-eyebrow">Ce qu&apos;on a changé ensemble</span>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.03em]">{changesTitle}</h2>
              <ul className="mt-5 space-y-3">
                {changes.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[15.5px] font-medium leading-snug text-[var(--fg)]">
                    <svg className="w-5 h-5 mt-0.5 shrink-0 text-[var(--green)]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-6 sm:p-8">
              <span className="mac-eyebrow">Sa méthode marketing</span>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.03em]">{rulesTitle}</h2>
              <div className="mt-5 space-y-5">
                {rules.map((r, i) => (
                  <div key={r.title} className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-[13px] font-bold text-[var(--accent-fg)]">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[16px] font-bold text-[var(--fg)] leading-tight">{r.title}</h3>
                      <p className="mt-1 text-[14.5px] font-medium leading-snug text-[var(--fg2)]">{r.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 mac-hcard">
            <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.035em] text-balance">
              Tu veux le même accompagnement pour ton app ?
            </h2>
            <p className="mt-4 text-[17px] font-medium text-[var(--fg2)] max-w-xl mx-auto">
              Un appel de 30 minutes. On regarde ton projet, ta situation, et on te dit franchement si on peut t&apos;aider à faire pareil.
            </p>
            <Link href="/appel" className="mac-btn mac-btn-primary mac-btn-lg mt-7 inline-flex whitespace-nowrap">
              Candidater à l&apos;incubateur
            </Link>
            <p className="mt-5 text-[14px] font-medium text-[var(--fg2)]">
              Par Jeremy, créateur de Shinobi Japanese
            </p>
            <Link
              href={`/temoignages?utm_source=temoignage-${t.slug}&utm_medium=cta&utm_campaign=temoignages`}
              className="mt-3 inline-flex text-[15px] font-bold text-[var(--accent)] hover:underline"
            >
              Voir les résultats des autres élèves
            </Link>
          </section>
        </motion.div>
      </div>
      <AdDisclaimer />
    </div>
  );
}
