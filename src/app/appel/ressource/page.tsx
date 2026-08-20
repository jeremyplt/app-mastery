"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AdDisclaimer from "@/components/AdDisclaimer";
import ThemeToggle from "@/components/ThemeToggle";

const RESOURCES = [
  {
    title: "Le plan d'action gratuit",
    description: "Les étapes concrètes pour passer de l'idée à une première app, sans coder.",
    href: "/plan-action/video",
    cta: "Voir le plan",
  },
  {
    title: "Les vidéos gratuites",
    description: "Ma chaîne, où je décortique comment créer et monétiser des apps avec l'IA.",
    href: "https://www.youtube.com/@jeremyptlt",
    cta: "Voir les vidéos",
  },
];

export default function RessourcePage() {
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

      <div className="max-w-[720px] mx-auto px-4 py-6 sm:py-8">
        {/* Light nav: this page tells them a call is not the right step now,
            so no call-to-book CTA. Just brand + theme toggle. */}
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
          <ThemeToggle />
        </nav>

        <motion.div
          className="w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-[28px] sm:text-[38px] font-bold tracking-[-0.035em] text-balance">
            Merci pour ta candidature.
          </h1>

          <p className="mt-5 text-[17px] sm:text-[19px] leading-relaxed text-[var(--fg2)] font-medium max-w-xl mx-auto">
            Vu là où tu en es, un appel stratégique ne serait pas la bonne étape pour toi aujourd&apos;hui. Le mieux, c&apos;est de commencer par poser des bases solides. Voici par où démarrer, gratuitement.
          </p>

          <div className="mt-10 space-y-3 text-left">
            {RESOURCES.map((r) => (
              <a
                key={r.href}
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-between gap-4 rounded-[14px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] px-6 py-5 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[color-mix(in_srgb,var(--fg)_5%,transparent)] active:scale-[0.99]"
              >
                <div>
                  <p className="text-[17px] font-semibold text-[var(--fg)]">{r.title}</p>
                  <p className="mt-1 text-[15px] font-medium text-[var(--fg2)]">{r.description}</p>
                </div>
                <span className="shrink-0 rounded-[8px] bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] px-4 py-2 text-[14px] font-semibold text-[var(--accent2)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]">
                  {r.cta}
                </span>
              </a>
            ))}
          </div>

          <p className="mt-10 text-[16px] font-medium text-[var(--fg2)]">
            Avance avec ça, et quand ton projet aura pris de l&apos;ampleur, on se reparle.
          </p>
        </motion.div>
      </div>
      <AdDisclaimer />
    </div>
  );
}
