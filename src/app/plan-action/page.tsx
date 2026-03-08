"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PlanActionPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      router.push("/plan-action/merci");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
      setLoading(false);
    }
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
          <section className="relative pt-6 pb-10 sm:pt-16 lg:pt-24 lg:pb-16">
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Section label */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <span className="font-mono text-sm font-semibold tracking-widest uppercase text-amber-400">
                  Gratuit
                </span>
              </motion.div>

              {/* Main card */}
              <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-amber-500/20">
                <div className="relative rounded-xl bg-white/5 overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />

                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Left: text content */}
                    <div className="relative px-5 py-8 sm:px-12 sm:py-16 lg:py-20">
                      <motion.h1
                        className="text-3xl/tight sm:text-4xl/tight lg:text-[3rem]/tight font-medium tracking-tighter text-balance text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        Le Plan d&apos;Action :{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500">
                          De 0 à 140K$/an
                        </span>{" "}
                        avec une seule app mobile
                      </motion.h1>

                      <motion.p
                        className="mt-6 text-lg/7 text-gray-300 max-w-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                      >
                        Découvre la méthode exacte que j&apos;ai utilisée pour
                        créer, lancer et monétiser mon app Shinobi Japanese. En
                        vidéo, étape par étape.
                      </motion.p>

                      <motion.ul
                        className="mt-6 space-y-2 text-sm text-gray-400"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                      >
                        {[
                          "La méthode exacte pour créer et monétiser une app avec l'IA",
                          "Les 3 erreurs qui font échouer 90% des apps avant le lancement",
                          "La stratégie marketing qui a généré des millions de vues",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-amber-400 text-xs">
                              &#10003;
                            </span>
                            {item}
                          </li>
                        ))}
                      </motion.ul>

                      <motion.form
                        onSubmit={handleSubmit}
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                      >
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                          <input
                            type="email"
                            required
                            placeholder="Ton adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {loading ? "..." : "Recevoir le Plan d'Action"}
                          </button>
                        </div>
                        {error && (
                          <p className="mt-3 text-sm text-red-400">{error}</p>
                        )}
                        <p className="mt-4 text-xs text-gray-500">
                          Gratuit. Pas de spam. Tu peux te désabonner à tout
                          moment.
                        </p>
                      </motion.form>

                      <motion.div
                        className="mt-6 flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        <div className="flex -space-x-2">
                          {[
                            "/avatars/avatar-1.jpg",
                            "/avatars/avatar-2.jpg",
                            "/avatars/avatar-3.jpg",
                            "/avatars/avatar-4.jpg",
                          ].map((src, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border-2 border-gray-950 overflow-hidden"
                            >
                              <Image
                                src={src}
                                alt=""
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-950 flex items-center justify-center text-sm font-semibold text-white">
                            +
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-300">
                          Ils ont déjà lancé leur app
                        </span>
                      </motion.div>
                    </div>

                    {/* Right: video preview */}
                    <motion.div
                      className="relative hidden lg:flex items-center justify-center p-6 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="relative w-full">
                        <div className="rounded-xl overflow-hidden">
                          <div className="relative aspect-video bg-gray-900">
                            <Image
                              src="/proof/video-preview.jpg"
                              alt="Aperçu du Plan d'Action"
                              fill
                              className="object-cover"
                              quality={90}
                            />
                            {/* Play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                <svg
                                  className="w-7 h-7 text-white ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-center text-xs text-gray-500">
                          10 min de vidéo gratuite
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Bottom credit */}
              <motion.p
                className="mt-8 text-center text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Par Jeremy, créateur de Shinobi Japanese (140K$/an ARR)
              </motion.p>
            </div>
          </section>
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
