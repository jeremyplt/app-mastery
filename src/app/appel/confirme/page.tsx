"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AdDisclaimer from "@/components/AdDisclaimer";
import ThemeToggle from "@/components/ThemeToggle";

// Vidéos Bunny (lib 613852). Placeholders : laisser "" tant que la vidéo
// n'est pas prête → un bloc "Vidéo en cours de préparation" s'affiche.
const MAIN_VIDEO_ID = "ce2619f3-8b5e-425d-b60c-91efaa35f778"; // vidéo principale à regarder avant l'appel

// Vidéo YouTube "Pour en savoir plus"
const YOUTUBE_ID = "--Q8sMT656Y";

// Photos équipe : à remplacer quand Jeremy fournit le visuel définitif de
// Jeremy Hochwelker. jeremy-v2.jpg est la photo de branding (Jeremy Pitault).
const TEAM = [
  {
    name: "Jeremy",
    role: "Créateur de Shinobi Japanese, 400K€/an",
    photo: "/jeremy-v2.jpg",
    imgClass: "object-cover object-top",
  },
  {
    name: "Nolan",
    role: "Associé App Mastery",
    photo: "/nolan.jpg",
    imgClass: "object-cover object-top",
  },
];

export default function ConfirmePage() {
  return (
    <Suspense>
      <ConfirmeContent />
    </Suspense>
  );
}

function ConfirmeContent() {
  const searchParams = useSearchParams();

  // Calendly (redirection native) envoie invitee_first_name / event_start_time.
  // On accepte aussi firstName (redirection maison depuis /appel/reserver).
  const firstName =
    searchParams.get("invitee_first_name") ||
    searchParams.get("firstName") ||
    "";

  const startTime = searchParams.get("event_start_time"); // ISO 8601 ou null
  const bookedDate = (() => {
    if (!startTime) return null;
    const d = new Date(startTime);
    if (Number.isNaN(d.getTime())) return null;
    const date = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(d);
    const time = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
    return { date, time };
  })();

  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 40% at 50% -6%, color-mix(in srgb, var(--green) 16%, transparent), transparent 62%), radial-gradient(45% 35% at 88% 10%, var(--accent-glow), transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Light nav: they just booked, no push to re-book. Brand + toggle. */}
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
          <ThemeToggle />
        </nav>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header confirmation */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="mac-appicon" style={{ background: "linear-gradient(150deg, #40d868, #24a83f)", color: "#fff" }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h1 className="mt-1 text-[28px] sm:text-[38px] font-bold tracking-[-0.035em] text-balance">
              {firstName
                ? `Félicitations ${firstName}, ton appel est réservé !`
                : "Félicitations, ton appel est réservé !"}
            </h1>

            <p className="mt-4 text-[17px] leading-relaxed text-[var(--fg2)] font-medium max-w-xl mx-auto">
              Regarde bien la vidéo ci-dessous, elle est importante pour préparer
              notre échange.
            </p>

            {/* Récap du RDV */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-[12px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] px-5 py-3">
              <svg className="w-5 h-5 text-[var(--accent2)] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-[15px] font-semibold text-[var(--fg)]">
                {bookedDate
                  ? `${bookedDate.date} à ${bookedDate.time}`
                  : "Créneau confirmé, détails envoyés par email"}
              </span>
            </div>
          </div>

          {/* Vidéo principale en grand format (autoplay comme la VSL) */}
          <div className="mt-10 max-w-4xl mx-auto">
            <MainVideo videoId={MAIN_VIDEO_ID} />
          </div>

          {/* Étapes */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-[22px] font-bold tracking-[-0.03em] text-[var(--fg)] mb-4 text-center">
              Ce qu&apos;il se passe maintenant
            </h2>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-[14px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-3.5"
                >
                  <div className="shrink-0 w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-[13px] font-bold text-[var(--accent-fg)]">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[var(--fg)] leading-tight">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-[13.5px] text-[var(--fg2)] font-medium leading-snug">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vidéo YouTube complémentaire */}
          <div className="mt-14 max-w-3xl mx-auto">
            <div className="mb-4 text-center">
              <span className="mac-eyebrow">Pour aller plus loin</span>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.03em] text-[var(--fg)]">
                Découvre mon application
              </h2>
            </div>
            <YouTubeBlock id={YOUTUBE_ID} />
          </div>

          {/* Notre équipe (avant le social proof) */}
          <div className="mt-14 max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <span className="mac-eyebrow">Qui sommes-nous</span>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.03em] text-[var(--fg)]">
                Notre équipe
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col items-center text-center rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-6"
                >
                  <div className="w-28 h-28 rounded-[20px] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.35)] border-[0.5px] border-white/10">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        width={400}
                        height={400}
                        quality={95}
                        className={`w-full h-full ${member.imgClass}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3898ff]/30 to-[#0060df]/30 text-3xl font-bold text-[var(--accent2)]">
                        {member.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-[17px] font-bold text-[var(--fg)]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-[13px] font-semibold text-[var(--accent2)]">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
      <AdDisclaimer />
    </div>
  );
}

const STEPS = [
  {
    title: "Vérifie ta boîte mail",
    body: "Tu viens de recevoir un email de confirmation avec tous les détails du rendez-vous et le lien de visio. Pense à vérifier tes spams.",
  },
  {
    title: "Connecte-toi à l'heure exacte",
    body: "Rejoins l'appel en visio à l'heure prévue via le lien reçu par email. Prévois environ 30 minutes au calme.",
  },
  {
    title: "Sois ponctuel",
    body: "Plus de 5 minutes de retard = l'appel est annulé et non reprogrammé. Les créneaux sont limités, on compte sur toi.",
  },
  {
    title: "Installe-toi dans un endroit calme",
    body: "Évite les transports et les salles d'attente. Un endroit calme, un casque, et de quoi prendre des notes.",
  },
];

// Vidéo principale Bunny, façon VSL : autoplay en sourdine (aperçu qui boucle)
// puis clic pour la lancer avec le son. Placeholder si aucun ID.
function MainVideo({ videoId }: { videoId: string }) {
  const [played, setPlayed] = useState(false);

  if (!videoId) {
    return (
      <div className="overflow-hidden rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-2">
        <div className="relative rounded-[12px] overflow-hidden aspect-video">
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--group)]">
            <div className="text-center px-6">
              <div className="mac-icon lg g-blue mx-auto mb-4 w-16 h-16" style={{ borderRadius: "50%" }}>
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-[var(--fg2)] text-[17px] font-semibold">
                Vidéo en cours de préparation
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const base = `https://iframe.mediadelivery.net/embed/613852/${videoId}`;
  const src = played
    ? `${base}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`
    : `${base}?autoplay=true&loop=true&muted=true&preload=true&responsive=true`;

  return (
    <div className="overflow-hidden rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-2">
      <div
        className="relative rounded-[12px] overflow-hidden aspect-video bg-black cursor-pointer"
        onClick={!played ? () => setPlayed(true) : undefined}
      >
        <iframe
          key={played ? "on" : "off"}
          src={src}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        {!played && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--accent)_25%,transparent)] backdrop-blur-sm flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-base text-white font-medium">
              Regarde cette vidéo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Embed YouTube standard.
function YouTubeBlock({ id }: { id: string }) {
  return (
    <div className="overflow-hidden rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-2">
      <div className="relative rounded-[12px] overflow-hidden aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          className="absolute inset-0 w-full h-full"
          title="Vidéo YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
