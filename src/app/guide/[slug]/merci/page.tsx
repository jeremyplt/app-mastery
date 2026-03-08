"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { getGuide } from "@/lib/guides";
import { notFound } from "next/navigation";

export default function GuidemerciPage() {
  const params = useParams();
  const slug = params.slug as string;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div
        className="grid min-h-screen grid-cols-[1fr_minmax(0,80rem)_1fr]"
        style={{ "--gutter": "2.5rem" } as React.CSSProperties}
      >
        {/* Left gutter */}
        <div
          className="border-r border-white/10 bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Center content */}
        <div className="flex min-h-screen flex-col justify-center min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-mono text-sm font-semibold tracking-widest uppercase text-amber-400">
                C&apos;est prêt
              </span>

              <h1 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tighter text-white">
                {guide.merciTitle}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500">
                  {guide.merciHighlight}
                </span>
              </h1>

              <p className="mt-4 text-base text-gray-400">
                {guide.merciDescription}
              </p>

              {/* Download button */}
              <motion.div
                className="mt-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <a
                  href={guide.downloadUrl}
                  {...(guide.isExternalLink
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : { download: true })}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/25"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    {guide.isExternalLink ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5-6H21m0 0v7.5m0-7.5L10.5 13.5"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                      />
                    )}
                  </svg>
                  {guide.downloadLabel}
                </a>
              </motion.div>

              {/* CTA to App Mastery */}
              <motion.div
                className="mt-16 pt-10 border-t border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-lg text-white font-medium">
                  Tu veux aller plus loin ?
                </p>
                <p className="mt-2 text-base text-gray-400 max-w-md mx-auto">
                  Découvre App Mastery, la formation complète pour créer, lancer
                  et monétiser ton app en 28 jours avec l&apos;IA.
                </p>
                <a
                  href="/formation#pricing"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Découvrir App Mastery
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Right gutter */}
        <div
          className="border-l border-white/10 bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>
    </div>
  );
}
