"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const criteria = [
  {
    label: "Prix",
    youtube: "\"Gratuit\" ou 12$",
    bootcamp: "5 000 - 15 000$",
    appMastery: "997$",
    youtubeIcon: "neutral",
    bootcampIcon: "no",
    appMasteryIcon: "yes",
  },
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
    label: "App publiée sur les stores",
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
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
        <Check size={14} className="text-emerald-400" />
      </div>
    );
  }
  if (type === "neutral") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/20">
        <Minus size={14} className="text-yellow-400" />
      </div>
    );
  }
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20">
      <X size={14} className="text-red-400" />
    </div>
  );
}

export default function WhyDifferentV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-sky-400">
            Pourquoi App Mastery
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            Ce n&apos;est pas juste une autre formation
          </h2>
        </div>

        {/* Comparison table */}
        <motion.div
          className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-sky-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative rounded-xl bg-white/5 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            {/* Desktop table */}
            <div className="relative hidden md:block">
              <table className="w-full table-fixed">
                <thead>
                  <tr>
                    <th className="text-left px-5 py-4 text-base font-semibold text-gray-400">
                      Critère
                    </th>
                    <th className="text-center px-5 py-4 text-base font-semibold text-gray-400">
                      Tutos YouTube / Udemy
                    </th>
                    <th className="text-center px-5 py-4 text-base font-semibold text-gray-400">
                      Bootcamp / École
                    </th>
                    <th className="text-center px-5 py-4 text-base font-semibold text-sky-400 relative">
                      <div className="absolute inset-0 bg-sky-500/5 border-x border-t border-sky-500/20 rounded-t-lg" />
                      <span className="relative">App Mastery</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((row, i) => (
                    <motion.tr
                      key={i}
                      className="border-t border-white/5"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                    >
                      <td className="px-5 py-4 text-base font-medium text-white">
                        {row.label}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusIcon type={row.youtubeIcon} />
                          {row.youtube && (
                            <span className="text-sm text-gray-400">
                              {row.youtube}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusIcon type={row.bootcampIcon} />
                          {row.bootcamp && (
                            <span className="text-sm text-gray-400">
                              {row.bootcamp}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center relative">
                        <div className="absolute inset-0 bg-sky-500/5 border-x border-sky-500/20" />
                        <div className="relative flex items-center justify-center gap-2">
                          <StatusIcon type={row.appMasteryIcon} />
                          {row.appMastery && (
                            <span className="text-sm font-semibold text-white">
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
                      <div className="absolute inset-x-0 top-0 h-1 bg-sky-500/5 border-x border-b border-sky-500/20 rounded-b-lg" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile layout */}
            <div className="relative md:hidden p-4 space-y-4">
              {criteria.map((row, i) => (
                <motion.div
                  key={i}
                  className="rounded-lg bg-gray-950 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <p className="text-base font-semibold text-white mb-3">
                    {row.label}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">YouTube / Udemy</span>
                      <div className="flex items-center gap-2">
                        {row.youtube && (
                          <span className="text-sm text-gray-400">{row.youtube}</span>
                        )}
                        <StatusIcon type={row.youtubeIcon} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Bootcamp / École</span>
                      <div className="flex items-center gap-2">
                        {row.bootcamp && (
                          <span className="text-sm text-gray-400">{row.bootcamp}</span>
                        )}
                        <StatusIcon type={row.bootcampIcon} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-sky-500/10 px-2 py-1">
                      <span className="text-sm font-semibold text-sky-400">App Mastery</span>
                      <div className="flex items-center gap-2">
                        {row.appMastery && (
                          <span className="text-sm font-semibold text-white">{row.appMastery}</span>
                        )}
                        <StatusIcon type={row.appMasteryIcon} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Closing line */}
        <motion.p
          className="mt-10 text-center text-xl font-medium text-white max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          App Mastery est la seule formation qui t&apos;accompagne de l&apos;idée
          à la monétisation, en utilisant l&apos;IA pour accélérer chaque étape.
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
