"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import AdDisclaimer from "@/components/AdDisclaimer";
import ThemeToggle from "@/components/ThemeToggle";
import { FLORIAN, MESSAGES_ELEVES } from "@/lib/temoignages";

const BOOKING = "/appel/reserver?utm_source=temoignages&utm_medium=cta&utm_campaign=temoignages";

function Places() {
  return (
    <div className="inline-flex items-center gap-2 rounded-[8px] bg-[color-mix(in_srgb,var(--orange)_14%,transparent)] px-3.5 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--orange)] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--orange)]" />
      </span>
      <span className="text-[14px] font-bold text-[var(--orange)]">2 places restantes</span>
    </div>
  );
}

function CtaButton({ origin }: { origin: string }) {
  return (
    <Link
      href={BOOKING}
      onClick={() => posthog.capture("temoignages_cta_clicked", { origin })}
      className="mac-btn mac-btn-primary mac-btn-lg whitespace-nowrap"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      Réserver mon appel
    </Link>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

export default function TemoignagesContent() {
  const florian = FLORIAN;

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
            <Link href={BOOKING} className="mac-btn mac-btn-primary mac-btn-sm whitespace-nowrap">
              Réserver un appel
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
            <h1 className="text-[32px] sm:text-[48px] font-bold tracking-[-0.035em] leading-[1.05] text-balance">
              Ce que ça donne, <span className="mac-accent">en argent</span>
            </h1>
            <p className="mt-5 text-[18px] sm:text-[20px] font-semibold leading-relaxed max-w-2xl mx-auto">
              Mon application, celle d&apos;un élève parti de zéro, et les messages que je reçois des élèves. Tout est vérifiable, rien n&apos;est arrondi vers le haut.
            </p>
          </div>

          {/* Jeremy + Florian */}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card>
              <Image
                src="/emails/revenue-mensuel-sep25-juin26.jpg"
                alt="Revenus mensuels de Shinobi Japanese, de 10 000 à près de 40 000 dollars par mois"
                width={960}
                height={490}
                priority
                className="w-full rounded-[12px]"
              />
              <div className="mt-4 flex items-center gap-3">
                <Image src="/jeremy-v2.jpg" alt="Jeremy" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover object-top" />
                <p className="text-[22px] font-bold tracking-[-0.02em] leading-tight">
                  Moi : de 10 000 à <span className="mac-accent">près de 40 000 $ par mois</span>
                </p>
              </div>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                Shinobi Japanese, mon application pour apprendre le japonais, mois par mois de septembre 2025 à juin 2026. Plus de 5 000 notes, 4,9 sur 5. C&apos;est la méthode que j&apos;applique avec les élèves.
              </p>
            </Card>

            <Card>
              <Image
                src="/emails/florian-revenuecat-1793.jpg"
                alt="Tableau de bord RevenueCat de Florian : 1 793 $ sur 28 jours"
                width={955}
                height={445}
                priority
                className="w-full rounded-[12px]"
              />
              <div className="mt-4 flex items-center gap-3">
                <Image src={florian.photo} alt={florian.firstName} width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover" />
                <p className="text-[22px] font-bold tracking-[-0.02em] leading-tight">
                  {florian.firstName} : <span className="mac-accent">1 793 $ en 28 jours</span>
                </p>
              </div>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                Vingt ans, jamais codé. Il a construit {florian.appName} avec l&apos;IA, puis il a appliqué la méthode marketing tous les jours jusqu&apos;à trouver son format. Sans un euro de pub.
              </p>
              <Link
                href={`/temoignage/${florian.slug}?utm_source=temoignages&utm_medium=cta&utm_campaign=temoignage`}
                className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-bold text-[var(--accent)] hover:underline"
              >
                Voir son témoignage en vidéo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </Card>
          </div>

          {/* Chiffres de Florian */}
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {florian.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] px-4 py-4 text-center"
              >
                <p className="text-[28px] sm:text-[32px] font-bold tracking-[-0.04em] leading-none text-[var(--accent2)]">
                  {s.value}
                </p>
                <p className="mt-2 text-[14px] font-bold leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Messages des élèves */}
          <section className="mt-16">
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <span className="mac-eyebrow">Dans leurs mots</span>
              <h2 className="mt-2 text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-tight text-balance">
                Les messages que je reçois des élèves
              </h2>
              <p className="mt-3 text-[16px] font-medium leading-relaxed">
                Je les mets tels quels, captures d&apos;écran à l&apos;appui. Seul le nom de l&apos;application est masqué quand l&apos;élève le demande.
              </p>
            </div>

            <div className="space-y-4">
              {MESSAGES_ELEVES.map((m) => (
                <Card key={m.firstName} className="md:flex md:items-center md:gap-6">
                  <Image
                    src={m.image.src}
                    alt={m.image.alt}
                    width={m.image.width}
                    height={m.image.height}
                    className="w-full md:w-[56%] shrink-0 rounded-[12px]"
                  />
                  <div className="mt-4 md:mt-0">
                    <div className="flex items-center gap-3">
                      <Image src={m.photo} alt={m.firstName} width={48} height={48} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                      <div>
                        <p className="text-[19px] font-bold tracking-[-0.02em] leading-tight">{m.firstName}</p>
                        <p className="text-[14px] font-semibold text-[var(--accent2)] leading-snug">{m.status}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[15.5px] font-medium leading-relaxed">{m.context}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Bande photo */}
          <Card className="mt-4 sm:flex sm:items-center sm:gap-5">
            <Image
              src="/eleves-appel.jpg"
              alt="Florian, Wassim et Soraya"
              width={1200}
              height={400}
              className="w-full sm:w-[360px] shrink-0 rounded-[12px]"
            />
            <p className="mt-4 sm:mt-0 text-[16px] font-medium leading-relaxed">
              Florian, Wassim et Soraya ont tous les trois commencé par le même appel de trente minutes. Aucun des trois ne savait faire connaître une application en arrivant. Plusieurs de mes élèves dépassent aujourd&apos;hui 2 000 € par mois.
            </p>
          </Card>

          {/* CTA */}
          <section className="mt-16 mac-hcard">
            <Places />
            <h2 className="mt-4 text-[26px] sm:text-[32px] font-bold tracking-[-0.035em] text-balance">
              Tu veux que ce soit ton tour ?
            </h2>
            <p className="mt-4 text-[17px] font-medium max-w-xl mx-auto">
              Ça commence par un appel de trente minutes avec Nolan, mon associé, ou avec moi. On regarde ton projet et le temps que tu peux y consacrer, et on te dit franchement si l&apos;accompagnement est fait pour toi.
            </p>
            <div className="mt-7 flex justify-center">
              <CtaButton origin="bas" />
            </div>
            <p className="mt-5 text-[15px] font-semibold">Que tu aies déjà une app ou juste une idée.</p>
          </section>
        </motion.div>
      </div>
      <AdDisclaimer />
    </div>
  );
}
