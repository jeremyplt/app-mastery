"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function HomePage() {
  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      {/* Decorative background glows */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 34% at 50% -4%, var(--accent-glow), transparent 60%), radial-gradient(40% 30% at 88% 10%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%)",
        }}
      />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6">
        {/* Nav */}
        <nav className="mac-nav mt-5">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight text-[var(--fg)]"
          >
            <span
              className="grid place-items-center w-7 h-7 rounded-lg text-[12px] font-extrabold tracking-tight text-[var(--accent)] border-[0.5px] border-white/10"
              style={{ background: "linear-gradient(150deg, #2b2b2e, #000)" }}
            >
              JP
            </span>
            Jeremy Pitault
          </Link>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link href="/appel/reserver?utm_source=home" className="mac-btn mac-btn-primary mac-btn-sm">
              Réserver un appel
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-14 pb-12 sm:pt-20 flex flex-col items-center text-center">
          <motion.div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-[0.5px] border-white/12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/jeremy-v2.jpg"
              alt="Jeremy Pitault"
              width={400}
              height={400}
              quality={95}
              className="w-full h-full object-cover object-top"
            />
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {["Créateur de Shinobi Japanese", "YouTubeur"].map((label) => (
              <span key={label} className="badge badge-blue">
                {label}
              </span>
            ))}
          </motion.div>

          <motion.h1
            className="mt-5 text-[36px] sm:text-[52px] font-bold tracking-[-0.04em] leading-[1.02] text-balance max-w-[16ch]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Je crée des apps mobiles rentables.{" "}
            <span className="mac-accent">Et je t&apos;apprends à en faire autant.</span>
          </motion.h1>

          <motion.p
            className="mt-4 text-[17px] sm:text-[19px] leading-relaxed text-[var(--fg2)] max-w-xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Développeur d&apos;applications mobiles et créateur de contenu. Avec
            l&apos;IA et le vibe coding, je t&apos;accompagne de l&apos;idée au
            lancement d&apos;une app qui génère des revenus.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Link href="/appel/reserver?utm_source=home" className="mac-btn mac-btn-primary mac-btn-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Réserver un appel
            </Link>
            <a
              href="https://www.youtube.com/@jeremyptlt"
              target="_blank"
              rel="noopener noreferrer"
              className="mac-btn mac-btn-def mac-btn-lg"
            >
              <svg className="w-[18px] h-[18px] text-[#ff3b30]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Ma chaîne YouTube
            </a>
          </motion.div>
        </section>

        {/* Proof: revenue chart + stat tiles */}
        <motion.section className="pb-16" {...fadeUp} transition={{ duration: 0.6 }}>
          <div className="rounded-[16px] overflow-hidden border-[0.5px] border-[var(--sep)] mb-3">
            <Image
              src="/proof/arr-chart.png"
              alt="Revenus de mon app Shinobi Japanese"
              width={1232}
              height={700}
              quality={90}
              className="w-full h-auto"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="mac-tile text-center">
              <div className="text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] text-[var(--accent2)]">
                1 app
              </div>
              <div className="text-[12px] sm:text-[13px] font-semibold text-[var(--fg2)] mt-0.5">
                créée seul, avec l&apos;IA
              </div>
            </div>
            <div className="mac-tile text-center">
              <div className="text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] text-[var(--fg)]">
                0
              </div>
              <div className="text-[12px] sm:text-[13px] font-semibold text-[var(--fg2)] mt-0.5">
                ligne de code écrite
              </div>
            </div>
            <div className="mac-tile text-center">
              <div className="text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] text-[var(--green)]">
                Récurrent
              </div>
              <div className="text-[12px] sm:text-[13px] font-semibold text-[var(--fg2)] mt-0.5">
                des revenus chaque mois
              </div>
            </div>
          </div>
        </motion.section>

        {/* Offerings */}
        <motion.section className="pb-16" {...fadeUp} transition={{ duration: 0.6 }}>
          <p className="mac-grouplabel">Par où commencer</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/plan-action"
              className="group rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-6 flex flex-col transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[color-mix(in_srgb,var(--fg)_4%,transparent)] active:scale-[0.99]"
            >
              <span className="mac-icon lg g-green mb-4">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <span className="badge badge-success mb-2 self-start">Gratuit</span>
              <h3 className="text-[16px] font-semibold text-[var(--fg)]">Le Plan d&apos;Action</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--fg2)] flex-1">
                La vidéo où je détaille ma méthode exacte pour créer, lancer et
                monétiser une app. En 15 minutes.
              </p>
              <span className="mt-3 text-[13px] font-semibold text-[var(--accent2)]">
                Regarder la vidéo →
              </span>
            </Link>

            <Link
              href="/appel/reserver?utm_source=home&utm_medium=cta"
              className="group rounded-[16px] border-[0.5px] border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[var(--card)] p-6 flex flex-col transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[color-mix(in_srgb,var(--fg)_4%,transparent)] active:scale-[0.99]"
              style={{ boxShadow: "0 0 24px var(--accent-glow)" }}
            >
              <span className="mac-icon lg g-blue mb-4">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </span>
              <span className="badge badge-blue mb-2 self-start">Accompagnement</span>
              <h3 className="text-[16px] font-semibold text-[var(--fg)]">Un appel avec un expert</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--fg2)] flex-1">
                On regarde ta situation et on détermine ensemble si
                l&apos;accompagnement peut t&apos;aider à créer une app rentable.
                Ce n&apos;est pas du conseil gratuit, c&apos;est un appel pour voir
                si on peut travailler ensemble.
              </p>
              <span className="mt-3 text-[13px] font-semibold text-[var(--accent2)]">
                Prendre rendez-vous →
              </span>
            </Link>
          </div>
        </motion.section>

        {/* About */}
        <motion.section className="pb-16" {...fadeUp} transition={{ duration: 0.6 }}>
          <p className="mac-grouplabel">À propos</p>
          <div className="rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-7 sm:p-9 space-y-4 text-[16px] leading-[1.7] text-[var(--fg2)]">
            <p>
              Salut, moi c&apos;est Jeremy. Je génère des centaines de milliers
              d&apos;euros chaque année avec mes apps mobiles, et je partage tout
              ce que j&apos;apprends en chemin.
            </p>
            <p>
              Mon app principale,{" "}
              <span className="text-[var(--fg)] font-semibold">Shinobi Japanese</span>,
              est une app d&apos;apprentissage du japonais que j&apos;ai construite
              de zéro, seul, et qui vit aujourd&apos;hui de ses revenus récurrents.
            </p>
            <p>
              Aujourd&apos;hui, avec l&apos;arrivée de l&apos;IA et du «&nbsp;vibe
              coding&nbsp;», je suis convaincu que n&apos;importe qui peut créer une
              app mobile rentable. C&apos;est pour ça que j&apos;accompagne
              désormais des porteurs de projet à créer la leur. Sans bullshit,
              avec des résultats concrets.
            </p>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-8 border-t-[0.5px] border-[var(--sep)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[13px] font-medium text-[var(--fg3)]">
            &copy; {new Date().getFullYear()} Jeremy Pitault. Tous droits réservés.
          </div>
          <div className="flex gap-5 text-[13px] font-medium text-[var(--fg3)]">
            <a
              href="https://www.youtube.com/@jeremyptlt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--fg)] transition-colors"
            >
              YouTube
            </a>
            <Link href="/appel/reserver?utm_source=home" className="hover:text-[var(--fg)] transition-colors">
              Réserver un appel
            </Link>
            <Link href="/contact" className="hover:text-[var(--fg)] transition-colors">
              Contact
            </Link>
            <Link href="/mentions-legales" className="hover:text-[var(--fg)] transition-colors">
              Mentions légales
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
