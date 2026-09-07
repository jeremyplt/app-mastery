"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AdDisclaimer from "@/components/AdDisclaimer";
import BunnyVideo from "@/components/BunnyVideo";
import ThemeToggle from "@/components/ThemeToggle";
import { FLORIAN } from "@/lib/temoignages";

// Parcours de Florian, dans l'ordre du live. Dates et chiffres tels qu'il
// les a donnés à l'oral et montrés à l'écran (RevenueCat, Instagram).
const TIMELINE = [
  {
    when: "Fin 2025 à février 2026",
    title: "Quatre mois à construire seul",
    body: "Aucune base en code. Il commence sur Replit, comprend au bout d'un mois que ça ne donnera jamais une vraie app, passe sur Claude Code. Il obtient une V1 qui marche, mais pas optimisée. Il contacte Jeremy début mars.",
  },
  {
    when: "Mars à avril",
    title: "Un mois de refonte ensemble",
    body: "Onboarding personnalisé selon l'objectif de l'utilisateur, paywall avec tableau comparatif, boutons d'action mis en avant, prix annuel revu. Une date limite fixée à deux : l'app sort sur l'App Store fin avril, juste avant son départ en Asie.",
  },
  {
    when: "Mai à mi-juin",
    title: "Six semaines dans le vide",
    body: "3 à 4 installations par jour. 10 essais gratuits en un mois et demi. Il poste tous les jours sur plusieurs comptes, rien ne prend. Il veut retoucher l'app. Consigne : ne rien changer, continuer le marketing jusqu'à trouver un format qui marche.",
  },
  {
    when: "6 juin",
    title: "Le déclic",
    body: "Il repère un format américain qui lui plaît et le refait en facecam, posté sur son compte perso en collaboration avec le compte de l'app. 20 vues le premier jour, 275 le lendemain, puis 5 000, 10 000, 20 000. Il garde le format et ne change que le hook.",
  },
  {
    when: "Mi-juin à juillet",
    title: "Ça décolle",
    body: "15 à 25 contenus par jour sur 6 comptes, chaque reel reposté sur Instagram, TikTok et YouTube Shorts. Des reels à 100 000 et 200 000 vues. Il passe de 10 à plus de 120 installations par jour, 70 abonnements actifs, 1 793 $ de revenus sur 28 jours.",
  },
];

const QUOTES = [
  {
    text: "Bosser avec quelqu'un qui a déjà les compétences, c'est juste un cheat code.",
    context: "sur ses quatre mois seul avant l'accompagnement",
  },
  {
    text: "Le premier mois, factuellement, l'application ne marche pas. Ça fait quatre mois que je bosse dessus. Qu'est-ce que je fais ?",
    context: "sur les six semaines après la sortie",
  },
  {
    text: "Quand on prend un accompagnement, on est débutant, on ne sait pas mieux. Appliquez ce qu'on vous dit, et vous verrez plus tard.",
    context: "sur le moment où il voulait retoucher l'app au lieu de faire du marketing",
  },
  {
    text: "Les 1 800 $ sur les 28 derniers jours, ça ne vaut rien à côté du fait de pouvoir aider les gens.",
    context: "en fin de live",
  },
];

const CHANGES = [
  "Un onboarding personnalisé : les questions et la navigation de l'app changent selon ce que l'utilisateur vient chercher",
  "Un paywall en deux étapes avec un tableau comparatif : une app à la place de quatre",
  "Les boutons d'action principaux mis en avant sur chaque écran",
  "Des règles de design simples : taille des textes, lisibilité sur les petits iPhone",
  "Des écrans qui expliquent l'app pendant l'onboarding, au lieu de laisser l'utilisateur se débrouiller",
  "Le prix annuel revu pour augmenter la valeur par client",
];

const RULES = [
  {
    title: "Un reel par jour, minimum",
    body: "Dès qu'un format marche, il le refait tous les jours sans exception. Certains jours il en tourne trois ou quatre d'avance.",
  },
  {
    title: "Garder le format, changer le hook",
    body: "Même structure, même montage. Seule la première phrase change. Les hooks qui marchent sont refaits.",
  },
  {
    title: "Reposter partout",
    body: "Compte perso, compte de l'app, Instagram, TikTok, YouTube Shorts. Un même reel à 100 000 vues sur une plateforme en fait 300 000 au total.",
  },
];

export default function FlorianContent() {
  const t = FLORIAN;

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
                alt={`${t.firstName}, créateur de ${t.appName}`}
                width={720}
                height={720}
                quality={90}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mac-eyebrow mt-5">
              {t.firstName}, {t.age} ans, créateur de {t.appName}
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-balance">
              De 0 à <span className="mac-accent whitespace-nowrap">1 793 $</span> en 28 jours,
              <br className="hidden sm:block" /> sans une seule pub.
            </h1>
            <p className="mt-6 text-[17px] sm:text-[19px] leading-relaxed text-[var(--fg2)] font-medium max-w-2xl mx-auto">
              Une app de productivité créée sans savoir coder. Six semaines après la sortie, plus de 100 installations par jour. Il raconte tout en live, avec ses vrais tableaux de bord à l&apos;écran.
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
            <BunnyVideo videoId={t.videoId} poster={t.poster} label="Regarde le témoignage de Florian" />
            <p className="mt-3 text-center text-[14px] font-medium text-[var(--fg2)]">
              Live enregistré le {t.recordedOn} avec les élèves de l&apos;incubateur. Chiffres montrés en direct sur RevenueCat et Instagram.
            </p>
          </div>

          {/* Parcours */}
          <section className="mt-16 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="mac-eyebrow">Son parcours</span>
              <h2 className="mt-2 text-[24px] sm:text-[30px] font-bold tracking-[-0.03em] text-balance">
                Cinq étapes, de l&apos;idée aux premiers revenus
              </h2>
            </div>
            <ol className="relative border-l-[2px] border-[var(--sep)] ml-3 sm:ml-4 space-y-8">
              {TIMELINE.map((step, i) => (
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
                Ce que Florian dit de l&apos;accompagnement
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {QUOTES.map((q) => (
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

          {/* Ce qu'on a changé */}
          <section className="mt-16 grid lg:grid-cols-2 gap-4">
            <div className="rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-6 sm:p-8">
              <span className="mac-eyebrow">Ce qu&apos;on a changé ensemble</span>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.03em]">
                Un mois de travail sur {t.appName} avant la sortie
              </h2>
              <ul className="mt-5 space-y-3">
                {CHANGES.map((c) => (
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
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.03em]">
                Les trois règles qu&apos;il applique tous les jours
              </h2>
              <div className="mt-5 space-y-5">
                {RULES.map((r, i) => (
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
          </section>
        </motion.div>
      </div>
      <AdDisclaimer />
    </div>
  );
}
