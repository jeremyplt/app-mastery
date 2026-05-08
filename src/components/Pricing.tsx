"use client";

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-mono text-base font-semibold tracking-widest uppercase text-sky-400">
            Accompagnement
          </span>
          <h2 className="mt-4 text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Tu veux lancer ton app mobile rentable ?
          </h2>
          <p className="mt-6 text-xl/8 text-white/80 font-medium">
            Réserve un appel gratuit de 30 minutes. On analyse ta situation ensemble et on définit les prochaines étapes concrètes pour ton projet.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-base font-bold text-red-400">
              Places limitées
            </span>
          </div>
          <div className="mt-8">
            <a
              href="https://calendly.com/jeremypltpro/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-10 py-4 text-lg font-bold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Réserve ton appel gratuit
            </a>
          </div>
        </div>
      </div>
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
