"use client";

import { motion } from "framer-motion";

export default function ClosedBanner() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[20px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(80% 60% at 50% 0%, var(--accent-glow), transparent 60%)" }}
          />

          <div className="relative px-6 py-16 sm:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem]/10 font-bold tracking-[-0.035em] text-balance text-[var(--fg)] mb-6">
                Tu veux un regard extérieur sur ton projet ?
              </h2>

              <div className="max-w-xl mx-auto space-y-4 mb-10">
                <p className="text-lg text-[var(--fg2)] font-medium leading-relaxed">
                  Réserve un appel gratuit de 30 minutes avec moi. On analyse ton app ou ton idée d&apos;app ensemble, et je te donne un plan d&apos;action concret et personnalisé.
                </p>
              </div>

              <a href="/appel" className="btn-primary px-10! py-4! text-lg!">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Réserve ton audit gratuit
              </a>

              <p className="text-base text-[var(--fg3)] mt-4">
                Gratuit, sans engagement. 30 minutes, toi et moi.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
