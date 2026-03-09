"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { getGuide } from "@/lib/guides";
import { notFound } from "next/navigation";

export default function GuidePage() {
  const params = useParams();
  const slug = params.slug as string;
  const guide = getGuide(slug);

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
        body: JSON.stringify({
          email,
          listId: guide?.brevoListId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      router.push(`/guide/${slug}/merci`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
      setLoading(false);
    }
  }

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
          <section className="relative pt-6 pb-10 sm:pt-16 lg:pt-24 lg:pb-16">
            <div className="px-4 sm:px-6 lg:px-8">
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

              <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-amber-500/20">
                <div className="relative rounded-xl bg-white/5 overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />

                  <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative px-5 py-8 sm:px-12 sm:py-16 lg:py-20">
                    <motion.h1
                      className="text-3xl/tight sm:text-4xl/tight lg:text-[3rem]/tight font-medium tracking-tighter text-balance text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {guide.title}{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500">
                        {guide.highlight}
                      </span>
                    </motion.h1>

                    <motion.p
                      className="mt-6 text-lg/7 text-gray-300 max-w-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                    >
                      {guide.subtitle}
                    </motion.p>

                    <motion.ul
                      className="mt-6 space-y-2 text-sm text-gray-400"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.25 }}
                    >
                      {guide.bullets.map((item, i) => (
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
                          {loading ? "..." : guide.ctaText}
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
                  </div>

                  {/* Right side - Locked document preview (desktop only) */}
                  <div className="hidden lg:flex items-center justify-center p-6">
                    <motion.div
                      className="relative w-full max-w-[380px] aspect-[3/4] rounded-lg overflow-hidden shadow-2xl shadow-black/40"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      {/* Real document page */}
                      <img
                        src="/proof/guide-preview.jpg"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-top select-none"
                        style={{ filter: "blur(2px)" }}
                        draggable={false}
                      />

                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/50 backdrop-blur-[1px]">
                        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                          <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        </div>
                        <p className="mt-3 text-sm font-medium text-white/80">
                          Entre ton email pour débloquer
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  </div>
                </div>
              </div>

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
