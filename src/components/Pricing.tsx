"use client";

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-2xl mx-auto text-center rounded-[20px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] px-6 py-14 sm:px-12 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(80% 60% at 50% 0%, var(--accent-glow), transparent 60%)" }}
          />
          <div className="relative">
            <span className="mac-eyebrow">Accompagnement</span>
            <h2 className="mt-4 text-2xl sm:text-[2.5rem]/10 font-bold tracking-[-0.035em] text-balance text-[var(--fg)]">
              Tu veux lancer ton app mobile rentable ?
            </h2>
            <p className="mt-5 text-xl/8 text-[var(--fg2)] font-medium">
              Réserve un appel gratuit de 30 minutes. On analyse ta situation
              ensemble et on définit les prochaines étapes concrètes pour ton
              projet.
            </p>
            <div
              className="mt-6 inline-flex items-center gap-2 rounded-[8px] px-4 py-2"
              style={{ background: "color-mix(in srgb, var(--red) 14%, transparent)" }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "var(--red)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: "var(--red)" }}
                />
              </span>
              <span className="text-base font-bold" style={{ color: "var(--red)" }}>
                Places limitées
              </span>
            </div>
            <div className="mt-8">
              <a href="/appel" className="mac-btn mac-btn-primary mac-btn-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Réserve ton appel gratuit
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
