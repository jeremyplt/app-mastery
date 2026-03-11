"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ClosedBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-violet-500/10" />
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative px-6 py-16 sm:py-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2">
                    <span className="text-base font-bold uppercase tracking-wider text-white/70">
                      Inscriptions fermées
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white mb-6">
                  La formation est actuellement fermée
                </h2>

                <div className="max-w-xl mx-auto space-y-4 mb-10">
                  <p className="text-lg text-white/90 font-medium">
                    Les portes d&apos;App Mastery sont fermées. On se concentre à 100% sur les élèves qui ont rejoint le programme pour leur fournir un maximum de résultats et les accompagner comme il faut.
                  </p>
                  <p className="text-lg text-white/80 font-medium">
                    Laisse ton email ci-dessous pour être prévenu en priorité quand les inscriptions rouvriront.
                  </p>
                </div>

                {status === "success" ? (
                  <div className="max-w-md mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-6">
                    <p className="text-lg font-bold text-emerald-400">
                      Tu es sur la liste.
                    </p>
                    <p className="text-base text-white/80 mt-2">
                      Tu recevras un email dès que les inscriptions rouvriront.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ton@email.com"
                        required
                        className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3.5 text-base text-white placeholder:text-white/40 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      />
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="rounded-full bg-sky-500 px-8 py-3.5 text-base font-bold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {status === "loading" ? "..." : "Me prévenir"}
                      </button>
                    </div>
                    {status === "error" && (
                      <p className="text-red-400 text-base mt-3">
                        Une erreur est survenue. Réessaye.
                      </p>
                    )}
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
