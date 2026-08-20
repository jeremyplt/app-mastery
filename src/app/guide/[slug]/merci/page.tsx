"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getGuide } from "@/lib/guides";
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function GuidemerciPage() {
  const params = useParams();
  const slug = params.slug as string;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

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
              href="/appel/reserver?utm_source=guide-merci&utm_medium=nav"
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
      </div>
    </div>
  );
}
