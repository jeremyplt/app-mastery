"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const criteria = [
  {
    label: "Durée pour résultat",
    youtube: "1-3 ans (jamais?)",
    bootcamp: "3-6 mois",
    appMastery: "28 jours",
    youtubeIcon: "no",
    bootcampIcon: "neutral",
    appMasteryIcon: "yes",
  },
  {
    label: "App publiée sur l'App Store",
    youtube: null,
    bootcamp: "Projets scolaires",
    appMastery: null,
    youtubeIcon: "no",
    bootcampIcon: "no",
    appMasteryIcon: "yes",
  },
  {
    label: "Marketing & monétisation",
    youtube: null,
    bootcamp: null,
    appMastery: null,
    youtubeIcon: "no",
    bootcampIcon: "no",
    appMasteryIcon: "yes",
  },
  {
    label: "Support du formateur",
    youtube: null,
    bootcamp: "Limité",
    appMastery: "Lives 2x/mois",
    youtubeIcon: "no",
    bootcampIcon: "neutral",
    appMasteryIcon: "yes",
  },
  {
    label: "Communauté de créateurs",
    youtube: null,
    bootcamp: null,
    appMastery: "À vie",
    youtubeIcon: "no",
    bootcampIcon: "no",
    appMasteryIcon: "yes",
  },
  {
    label: "Mis à jour avec l'IA",
    youtube: null,
    bootcamp: null,
    appMastery: null,
    youtubeIcon: "no",
    bootcampIcon: "no",
    appMasteryIcon: "yes",
  },
];

function StatusIcon({ type }: { type: string }) {
  if (type === "yes") {
    return (
      <span
        className="flex h-6 w-6 items-center justify-center rounded-[7px]"
        style={{ background: "color-mix(in srgb, var(--green) 20%, transparent)" }}
      >
        <Check size={14} strokeWidth={3} style={{ color: "var(--green)" }} />
      </span>
    );
  }
  if (type === "neutral") {
    return (
      <span
        className="flex h-6 w-6 items-center justify-center rounded-[7px]"
        style={{ background: "color-mix(in srgb, var(--orange) 20%, transparent)" }}
      >
        <Minus size={14} strokeWidth={3} style={{ color: "var(--orange)" }} />
      </span>
    );
  }
  return (
    <span
      className="flex h-6 w-6 items-center justify-center rounded-[7px]"
      style={{ background: "color-mix(in srgb, var(--red) 20%, transparent)" }}
    >
      <X size={14} strokeWidth={3} style={{ color: "var(--red)" }} />
    </span>
  );
}

export default function WhyDifferent() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="mac-eyebrow">Pourquoi App Mastery</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-bold tracking-[-0.03em] text-balance text-[var(--fg)]">
            Ce n&apos;est pas juste une autre formation
          </h2>
        </div>

        {/* Comparison table */}
        <motion.div
          className="rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th className="text-left px-5 py-4 text-[15px] font-semibold text-[var(--fg2)]">
                    Critère
                  </th>
                  <th className="text-center px-5 py-4 text-[15px] font-semibold text-[var(--fg2)]">
                    Tutos YouTube / Udemy
                  </th>
                  <th className="text-center px-5 py-4 text-[15px] font-semibold text-[var(--fg2)]">
                    Bootcamp / École
                  </th>
                  <th className="text-center px-5 py-4 text-[15px] font-semibold text-[var(--accent2)] relative">
                    <div
                      className="absolute inset-0 border-x border-t border-[color-mix(in_srgb,var(--accent)_25%,transparent)] rounded-t-lg"
                      style={{ background: "color-mix(in srgb, var(--accent) 7%, transparent)" }}
                    />
                    <span className="relative">App Mastery</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((row, i) => (
                  <motion.tr
                    key={i}
                    className="border-t border-[var(--sep)]"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <td className="px-5 py-4 text-[16px] font-medium text-[var(--fg)]">
                      {row.label}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <StatusIcon type={row.youtubeIcon} />
                        {row.youtube && (
                          <span className="text-[15px] text-[var(--fg2)]">{row.youtube}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <StatusIcon type={row.bootcampIcon} />
                        {row.bootcamp && (
                          <span className="text-[15px] text-[var(--fg2)]">{row.bootcamp}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center relative">
                      <div
                        className="absolute inset-0 border-x border-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
                        style={{ background: "color-mix(in srgb, var(--accent) 7%, transparent)" }}
                      />
                      <div className="relative flex items-center justify-center gap-2">
                        <StatusIcon type={row.appMasteryIcon} />
                        {row.appMastery && (
                          <span className="text-[15px] font-semibold text-[var(--fg)]">
                            {row.appMastery}
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {/* Bottom border for App Mastery column */}
                <tr className="h-0">
                  <td />
                  <td />
                  <td />
                  <td className="relative">
                    <div
                      className="absolute inset-x-0 top-0 h-1 border-x border-b border-[color-mix(in_srgb,var(--accent)_25%,transparent)] rounded-b-lg"
                      style={{ background: "color-mix(in srgb, var(--accent) 7%, transparent)" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden p-4 space-y-4">
            {criteria.map((row, i) => (
              <motion.div
                key={i}
                className="rounded-[12px] border-[0.5px] border-[var(--sep)] bg-[var(--group)] p-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <p className="text-[16px] font-semibold text-[var(--fg)] mb-3">{row.label}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] text-[var(--fg2)]">YouTube / Udemy</span>
                    <div className="flex items-center gap-2">
                      {row.youtube && (
                        <span className="text-[15px] text-[var(--fg2)]">{row.youtube}</span>
                      )}
                      <StatusIcon type={row.youtubeIcon} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] text-[var(--fg2)]">Bootcamp / École</span>
                    <div className="flex items-center gap-2">
                      {row.bootcamp && (
                        <span className="text-[15px] text-[var(--fg2)]">{row.bootcamp}</span>
                      )}
                      <StatusIcon type={row.bootcampIcon} />
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between rounded-md px-2 py-1"
                    style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                  >
                    <span className="text-[15px] font-semibold text-[var(--accent2)]">App Mastery</span>
                    <div className="flex items-center gap-2">
                      {row.appMastery && (
                        <span className="text-[15px] font-semibold text-[var(--fg)]">
                          {row.appMastery}
                        </span>
                      )}
                      <StatusIcon type={row.appMasteryIcon} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing line */}
        <motion.p
          className="mt-10 text-center text-xl font-medium text-[var(--fg)] max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          App Mastery est la seule formation qui t&apos;accompagne de l&apos;idée
          à la monétisation, en utilisant l&apos;IA pour accélérer chaque étape.
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
