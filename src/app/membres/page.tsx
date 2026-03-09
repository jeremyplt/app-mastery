"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <span className="font-mono text-sm font-semibold tracking-widest uppercase text-sky-400">
              Espace Membres
            </span>
            <h1 className="mt-4 text-2xl sm:text-3xl font-medium tracking-tighter text-white">
              Accede a tes cours
            </h1>
          </div>

          {urlError === "expired" && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
              <p className="text-sm text-red-400">
                Ce lien a expire. Demande un nouveau lien ci-dessous.
              </p>
            </div>
          )}

          {sent ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Verifie ta boite mail</h2>
              <p className="mt-2 text-sm text-gray-400">
                Un lien de connexion a ete envoye a <strong className="text-white">{email}</strong>. Clique dessus pour acceder a tes cours.
              </p>
              <p className="mt-4 text-xs text-gray-500">
                Pense a verifier tes spams.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email utilise lors de l&apos;achat
                </label>
                <input
                  type="email"
                  required
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-colors"
                />
                {error && (
                  <p className="mt-3 text-sm text-red-400">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Envoi en cours..." : "Recevoir mon lien de connexion"}
                </button>
              </form>
              <p className="mt-4 text-xs text-gray-500 text-center">
                Tu recevras un lien magique par email pour te connecter.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function MembresPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
