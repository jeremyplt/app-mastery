"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          className="w-full max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-sky-400">
            Gratuit
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tighter text-balance text-white">
            Le Plan d&apos;Action :{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500">
              De 0 à 140K$/an
            </span>{" "}
            avec une seule app mobile
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-md mx-auto">
            Découvre la méthode exacte que j&apos;ai utilisée pour créer, lancer
            et monétiser mon app Shinobi Japanese. En vidéo, étape par étape.
          </p>

          <ul className="mt-8 space-y-3 text-left max-w-sm mx-auto">
            {[
              "Comment trouver et valider une idée d'app en 48h",
              "Le workflow IA pour développer sans coder",
              "La stratégie marketing qui a généré des millions de vues",
              "Les chiffres réels, mois par mois, de 0 à 140K$/an",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-emerald-400 text-sm mt-0.5">
                  &#10003;
                </span>
                <span className="text-base text-gray-300">{item}</span>
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="mt-10 max-w-sm mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Ton adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? "..." : "Recevoir le Plan d'Action"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}
            <p className="mt-4 text-xs text-gray-500">
              Gratuit. Pas de spam. Tu peux te désabonner à tout moment.
            </p>
          </form>
        </motion.div>

        <motion.p
          className="mt-16 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Par Jeremy, créateur de Shinobi Japanese (140K$/an ARR)
        </motion.p>
      </div>
    </div>
  );
}
