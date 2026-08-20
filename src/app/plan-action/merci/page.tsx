"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AdDisclaimer from "@/components/AdDisclaimer";
import ThemeToggle from "@/components/ThemeToggle";

export default function MerciPage() {
  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      {/* Decorative background glows */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 45% at 50% -8%, var(--accent-glow), transparent 62%), radial-gradient(45% 35% at 12% 8%, color-mix(in srgb, var(--green) 12%, transparent), transparent 60%)",
        }}
      />

      <div className="max-w-[900px] mx-auto px-4 py-6 sm:py-8">
        {/* Nav (thank-you page: the right moment to push the call) */}
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
              href="/appel/reserver?utm_source=plan-action-merci&utm_medium=nav&utm_campaign=plan-action"
              className="mac-btn mac-btn-primary mac-btn-sm"
            >
              Réserver un appel
            </Link>
          </div>
        </nav>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Confirmation header card */}
          <div className="mac-hcard">
            <div className="mac-appicon" style={{ background: "linear-gradient(150deg, #40d868, #24a83f)", color: "#fff" }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-[var(--fg)]">
              C&apos;est bien reçu, vérifie ta boîte mail.
            </h1>
            <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--fg2)] max-w-[46ch] mx-auto">
              Ton étude de cas arrive dans quelques minutes. Pense à vérifier tes
              spams si tu ne la vois pas.
            </p>
          </div>

          {/* Audit CTA card */}
          <div className="mt-6 relative overflow-hidden rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-7 sm:p-9 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(80% 60% at 50% 0%, var(--accent-glow), transparent 60%)" }}
            />
            <div className="relative">
              <span className="mac-eyebrow">Offre limitée</span>

              <h2 className="mt-3 text-[24px] sm:text-[28px] font-bold tracking-[-0.03em] text-[var(--fg)]">
                Audit personnalisé offert
              </h2>

              <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--fg2)] max-w-[52ch] mx-auto">
                Tu as un projet d&apos;app mobile ou tu es déjà lancé ? Je fais un
                audit complet de ta situation et on définit ensemble les
                prochaines étapes concrètes.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[color-mix(in_srgb,var(--red)_15%,transparent)] px-3.5 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--red)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--red)]" />
                </span>
                <span className="text-[13.5px] font-semibold text-[var(--red)]">
                  Gratuit pour les 10 prochaines personnes
                </span>
              </div>

              <div className="mt-7 flex justify-center">
                <Link
                  href="/appel/reserver?utm_source=plan-action-merci&utm_medium=cta&utm_campaign=plan-action"
                  className="mac-btn mac-btn-primary mac-btn-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Réserver mon audit
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <AdDisclaimer />
    </div>
  );
}
