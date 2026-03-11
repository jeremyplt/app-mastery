"use client";

import { useState } from "react";
import { Metadata } from "next";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Contact</h1>
        <p className="text-xl text-gray-300 mb-12">
          Une question sur App Mastery ? Écris-moi par email ou directement sur
          WhatsApp. Je réponds personnellement à chaque message.
        </p>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/33756823921?text=Salut%20Jeremy%20!%20J%27ai%20une%20question%20sur%20App%20Mastery."
          target="_blank"
          rel="noopener noreferrer"
          className="group block mb-10 isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-green-500/30 hover:outline-green-500/60 transition-all"
        >
          <div className="relative rounded-xl bg-white/5 group-hover:bg-white/[0.07] p-8 sm:p-10 overflow-hidden text-center transition-colors">
            {/* Glow */}
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-green-500/15 blur-3xl" />

            <div className="relative">
              <div className="flex justify-center mb-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 outline outline-green-500/20">
                  <svg
                    className="w-8 h-8 text-green-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-white mb-2">
                Réponse rapide sur WhatsApp
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Pour une réponse rapide, écris-moi directement sur WhatsApp.
              </p>

              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-8 py-3.5 text-base font-bold text-white group-hover:bg-green-400 transition-colors shadow-lg shadow-green-500/25">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Écrire sur WhatsApp
              </span>
            </div>
          </div>
        </a>

        {/* Email section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-1">
            Envoyer un email
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Tu peux aussi m&apos;écrire à{" "}
            <a
              href="mailto:contact@jeremypitault.com"
              className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
            >
              contact@jeremypitault.com
            </a>{" "}
            ou utiliser le formulaire ci-dessous.
          </p>
        </div>

        {/* Contact form */}
        {status === "sent" ? (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-8 text-center">
            <p className="text-xl font-semibold text-emerald-400 mb-2">
              Message envoyé !
            </p>
            <p className="text-lg text-gray-300">
              Merci, je te réponds dès que possible.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sky-400 hover:text-sky-300 transition-colors font-medium"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-base font-semibold text-white mb-2"
              >
                Ton prénom
              </label>
              <input
                type="text"
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-lg text-white placeholder:text-white/30 focus:outline-none focus:border-sky-500/50 transition-colors"
                placeholder="Jeremy"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-base font-semibold text-white mb-2"
              >
                Ton email
              </label>
              <input
                type="email"
                id="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-lg text-white placeholder:text-white/30 focus:outline-none focus:border-sky-500/50 transition-colors"
                placeholder="jeremy@exemple.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-base font-semibold text-white mb-2"
              >
                Ton message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-lg text-white placeholder:text-white/30 focus:outline-none focus:border-sky-500/50 transition-colors resize-none"
                placeholder="Ta question sur App Mastery..."
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-base font-medium">
                Une erreur est survenue. Réessaie ou écris-moi directement à
                contact@jeremypitault.com.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-sky-500 py-3.5 text-base font-bold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {status === "sending" ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                "Envoyer le message"
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <a
            href="/formation"
            className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
          >
            &larr; Retour à la page de la Formation
          </a>
        </div>
      </div>
    </div>
  );
}
