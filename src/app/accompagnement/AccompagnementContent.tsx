"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AdDisclaimer from "@/components/AdDisclaimer";
import BunnyVideo from "@/components/BunnyVideo";
import ThemeToggle from "@/components/ThemeToggle";
import { FLORIAN } from "@/lib/temoignages";

// Vidéo Bunny (lib 613852) : présentation de l'accompagnement, 6 minutes.
const VIDEO_ID = "a8334af7-09b2-464e-bcf8-6d4b07e10413";

// Les trois parties de l'accompagnement, telles que Jeremy les présente
// dans la vidéo.
const PARTS = [
  {
    title: "La communauté et les cours",
    body: "Plus d'une centaine de vidéos pour apprendre à créer une application mobile avec l'IA, même si tu pars de zéro, et surtout pour la faire convertir et la faire connaître. Des modules bonus sur le marketing, des contenus à copier, une masterclass sur l'acquisition, et la rediffusion de tous les lives. Une communauté où chacun partage ses résultats. Accès à vie.",
  },
  {
    title: "Les coachings de groupe",
    body: "Environ deux par mois, le jeudi à 20 h. Jeremy répond à toutes les questions, on échange, on apprend de chacun. Tu as accès à tous les coachings à venir et à la rediffusion de tous les précédents, à vie.",
  },
  {
    title: "Le suivi personnel",
    body: "Un accompagnement en direct avec Jeremy, sur plusieurs mois. Pas un coach, lui. Ça se passe surtout sur WhatsApp : messages vocaux, fichiers, captures d'écran, corrections sur ton app. C'est ce qui prend le plus de temps, et c'est pour ça que les places sont limitées.",
  },
];

const CALL_POINTS = [
  "Apprendre à te connaître : tes objectifs, ta situation, si tu as déjà une application ou pas. Les deux cas sont bienvenus.",
  "Voir à quel point tu es motivé pour rejoindre l'accompagnement, et surtout pour appliquer ce qu'on te dira.",
  "Te donner les informations sur l'accompagnement qui ne sont pas dans la vidéo, réservées à ceux qui passent l'appel.",
];

export default function AccompagnementContent() {
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
              Réserver mon appel
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
            <span className="mac-eyebrow">L&apos;accompagnement App Mastery</span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-balance">
              Ce qu&apos;il y a dedans, <span className="mac-accent">expliqué en 6 minutes</span>
            </h1>
            <p className="mt-6 text-[17px] sm:text-[19px] leading-relaxed text-[var(--fg2)] font-medium max-w-2xl mx-auto">
              Jeremy te montre l&apos;espace de formation, les coachings de groupe et comment se passe le suivi personnel. Regarde-la avant ton appel, tu sauras exactement de quoi on parle.
            </p>
          </div>

          {/* Vidéo */}
          <div className="mt-10">
            <BunnyVideo videoId={VIDEO_ID} poster="/jeremy-bureau.jpg" label="Regarder la présentation" />
          </div>

          {/* Les trois parties */}
          <section className="mt-16">
            <div className="text-center mb-8">
              <span className="mac-eyebrow">Trois parties</span>
              <h2 className="mt-2 text-[24px] sm:text-[30px] font-bold tracking-[-0.03em] text-balance">
                Ce que comprend l&apos;accompagnement
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {PARTS.map((p, i) => (
                <div key={p.title} className="rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-6">
                  <span className="inline-flex w-8 h-8 rounded-full bg-[var(--accent)] items-center justify-center text-[14px] font-bold text-[var(--accent-fg)]">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-[19px] font-bold text-[var(--fg)]">{p.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-[var(--fg2)] font-medium">{p.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pourquoi un appel */}
          <section className="mt-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-4 items-start">
            <div className="rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-6 sm:p-8">
              <span className="mac-eyebrow">Pourquoi un appel avant</span>
              <h2 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] text-balance">
                L&apos;accompagnement n&apos;est pas en accès libre
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[var(--fg2)] font-medium">
                Le suivi personnel est fait par Jeremy lui-même, et son temps n&apos;est pas illimité. Il y a aussi Shinobi Japanese et la chaîne YouTube à faire tourner. Les places sont donc limitées, et on choisit les personnes qui rejoignent. C&apos;est à ça que sert l&apos;appel, avec Jeremy ou avec son associé Nolan :
              </p>
              <ul className="mt-5 space-y-3">
                {CALL_POINTS.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[15.5px] font-medium leading-snug text-[var(--fg)]">
                    <svg className="w-5 h-5 mt-0.5 shrink-0 text-[var(--green)]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Florian */}
            <div className="rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-6 sm:p-8">
              <span className="mac-eyebrow">Il est passé par là avant toi</span>
              <div className="mt-4 flex items-center gap-4">
                <Image
                  src={FLORIAN.photo}
                  alt={FLORIAN.firstName}
                  width={72}
                  height={72}
                  className="w-16 h-16 rounded-[18px] object-cover"
                />
                <div>
                  <p className="text-[17px] font-bold text-[var(--fg)]">
                    {FLORIAN.firstName}, {FLORIAN.age} ans
                  </p>
                  <p className="text-[14px] font-medium text-[var(--fg2)]">Créateur de {FLORIAN.appName}</p>
                </div>
              </div>
              <p className="mt-5 text-[22px] font-bold tracking-[-0.03em] leading-tight">
                De 0 à <span className="mac-accent whitespace-nowrap">1 793 $</span> en 28 jours, sans une seule pub
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg2)] font-medium">
                Il ne savait pas coder. Un mois de refonte avec Jeremy, puis la méthode marketing tous les jours jusqu&apos;à trouver le format qui marche. Il raconte tout en vidéo, ses vrais chiffres à l&apos;écran.
              </p>
              <Link href="/temoignage/florian" className="mac-btn mac-btn-def mt-5 inline-flex whitespace-nowrap">
                Voir son témoignage
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 mac-hcard">
            <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.035em] text-balance">
              Tu te reconnais ? Réserve ton appel.
            </h2>
            <p className="mt-4 text-[17px] font-medium text-[var(--fg2)] max-w-xl mx-auto">
              Trente minutes, avec Jeremy ou Nolan, pour voir si l&apos;accompagnement est fait pour toi. Si tu as déjà réservé, on se retrouve à l&apos;appel : prépare tes questions.
            </p>
            <Link href="/appel" className="mac-btn mac-btn-primary mac-btn-lg mt-7 inline-flex whitespace-nowrap">
              Réserver mon appel
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
