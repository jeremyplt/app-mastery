"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import posthog from "posthog-js";
import { getGuide } from "@/lib/guides";
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

// Page de remerciement des guides : le meilleur moment pour proposer l'appel,
// sur le modèle validé de /plan-action/video (carte appel tôt, preuves en
// argent, second bouton en bas). Le PDF part toujours par email.
export default function GuidemerciPage() {
  const params = useParams();
  const slug = params.slug as string;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  // Les leads magnets hors apps mobiles (Epitech, SaaS, Make…) gardent la
  // page simple : l'accompagnement ne leur parle pas.
  const pitch = guide.crm === true;
  const reserveUrl = (medium: string) =>
    `/appel/reserver?utm_source=guide-merci&utm_medium=${medium}&utm_campaign=${encodeURIComponent(slug)}`;
  const track = (origin: string) => posthog.capture("guide_merci_cta_clicked", { origin, guide: slug });

  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 45% at 50% -8%, var(--accent-glow), transparent 62%)",
        }}
      />

      <div className="max-w-[900px] mx-auto px-4 py-6 sm:py-8">
        {/* Nav (post-optin: good moment to offer a call) */}
        <nav className="mac-nav mb-10">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight text-[var(--fg)]">
            <span
              className="grid place-items-center w-7 h-7 rounded-lg text-[12px] font-extrabold tracking-tight text-[var(--accent)] border-[0.5px] border-white/10"
              style={{ background: "linear-gradient(150deg, #2b2b2e, #000)" }}
            >
              AM
            </span>
            App Mastery
          </Link>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href={reserveUrl("nav")}
              onClick={() => track("nav")}
              className="mac-btn mac-btn-primary mac-btn-sm"
            >
              Réserver un appel
            </Link>
          </div>
        </nav>

        <motion.div
          className="max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mac-hcard">
            <div className="mac-appicon" style={{ background: "linear-gradient(150deg, #3898ff, #0060df)", color: "#fff" }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>

            <span className="mac-eyebrow">C&apos;est presque prêt</span>

            <h1 className="mt-3 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-[var(--fg)]">
              Vérifie ta boîte mail.
            </h1>

            <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--fg2)] max-w-[44ch] mx-auto">
              Tu vas recevoir ton contenu dans quelques minutes. Pense à vérifier
              tes spams si tu ne le vois pas.
            </p>
          </div>
        </motion.div>

        {pitch && (
          <div className="max-w-3xl mx-auto text-center">
            {/* Carte appel, juste sous la confirmation */}
            <motion.div
              className="mt-8 rounded-[22px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] px-6 py-8 sm:px-10 sm:py-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-tight">
                Tu veux qu&apos;on construise la tienne ensemble ?
              </h2>
              <p className="mt-3 text-[17px] font-medium leading-relaxed max-w-xl mx-auto">
                Je prends quelques personnes à la fois, en suivi personnel pendant trois mois. Ça commence par un appel de trente minutes avec Nolan, mon associé, ou avec moi.
              </p>
              <ul className="mt-6 mx-auto max-w-md text-left space-y-3 text-[16px] font-medium">
                <li className="flex gap-3"><span className="mac-accent font-bold">1.</span><span>On regarde ton projet, ta situation et le temps que tu peux y consacrer.</span></li>
                <li className="flex gap-3"><span className="mac-accent font-bold">2.</span><span>On te dit franchement si l&apos;accompagnement est fait pour toi.</span></li>
                <li className="flex gap-3"><span className="mac-accent font-bold">3.</span><span>Si oui, on pose ton plan d&apos;action et tu rejoins la communauté le soir même.</span></li>
              </ul>
              <div className="mt-7 flex flex-col items-center gap-3">
                <CtaLink href={reserveUrl("cta-haut")} onClick={() => track("haut")} />
                <p className="text-[15px] font-semibold">Que tu aies déjà une app ou juste une idée.</p>
              </div>
            </motion.div>

            {/* Preuves en argent */}
            <motion.div
              className="mt-14 text-left"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-center text-[13px] font-bold uppercase tracking-[0.12em] mac-accent">
                Ce que ça donne, en argent
              </p>
              <h2 className="mt-2 text-center text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-tight">
                Mon application, et celle d&apos;un élève parti de zéro
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-4">
                  <Image
                    src="/emails/revenue-mensuel-sep25-juin26.jpg"
                    alt="Revenus mensuels de Shinobi Japanese, de 10 000 à près de 40 000 dollars par mois"
                    width={960}
                    height={490}
                    className="w-full rounded-[12px]"
                  />
                  <p className="mt-4 text-[22px] font-bold tracking-[-0.02em] leading-tight">
                    De 10 000 à <span className="mac-accent">près de 40 000 $ par mois</span>
                  </p>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed">
                    Shinobi Japanese, mon application pour apprendre le japonais, mois par mois de septembre 2025 à juin 2026.
                  </p>
                </div>

                <div className="rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-4">
                  <Image
                    src="/emails/florian-revenuecat-1793-v2.jpg"
                    alt="Tableau de bord RevenueCat de Florian : 1 793 dollars de revenus sur 28 jours, 70 abonnements actifs"
                    width={955}
                    height={445}
                    className="w-full rounded-[12px]"
                  />
                  <div className="mt-4 flex items-center gap-3">
                    <Image src="/florian.jpg" alt="Florian" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover" />
                    <p className="text-[22px] font-bold tracking-[-0.02em] leading-tight">
                      Florian : <span className="mac-accent">1 793 $ en 28 jours</span>
                    </p>
                  </div>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed">
                    Il a vingt ans et il a lancé une application de productivité. Elle a fait un million de vues sur Instagram en 30 jours, uniquement avec du contenu filmé depuis son téléphone, sans un euro de pub.
                  </p>
                  <Link
                    href={`/temoignage/florian?utm_source=guide-merci&utm_medium=cta&utm_campaign=${encodeURIComponent(slug)}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-bold text-[var(--accent)] hover:underline"
                  >
                    Voir son témoignage en vidéo
                    <Arrow />
                  </Link>
                </div>
              </div>

              <div className="mt-4 rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-4 sm:flex sm:items-center sm:gap-5">
                <Image
                  src="/eleves-appel.jpg"
                  alt="Florian, Wassim et Soraya"
                  width={1200}
                  height={400}
                  className="w-full sm:w-[360px] shrink-0 rounded-[12px]"
                />
                <p className="mt-4 sm:mt-0 text-[16px] font-medium leading-relaxed">
                  Florian, Wassim et Soraya ont passé ce même appel il y a quelques mois. Aucun des trois ne savait faire connaître une application en arrivant.
                  <br />
                  <Link
                    href={`/temoignages?utm_source=guide-merci&utm_medium=cta&utm_campaign=${encodeURIComponent(slug)}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-bold text-[var(--accent)] hover:underline"
                  >
                    Voir tous les résultats de mes élèves
                    <Arrow />
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* Second bouton, en fin de page */}
            <motion.div
              className="mt-14 mb-6 flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-tight">
                À toi de jouer
              </h2>
              <p className="text-[17px] font-medium max-w-lg">
                Trente minutes, avec Nolan ou avec moi, pour voir si l&apos;accompagnement est fait pour toi. On ne prend pas tout le monde, et on te le dit honnêtement.
              </p>
              <CtaLink href={reserveUrl("cta-bas")} onClick={() => track("bas")} />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function CtaLink({ href, onClick }: { href: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="mac-btn mac-btn-primary mac-btn-lg">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      Réserver mon appel
    </Link>
  );
}

function Arrow() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}
