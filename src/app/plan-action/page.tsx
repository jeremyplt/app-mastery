"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import posthog from "posthog-js";
import type { CountryCode } from "libphonenumber-js";

const COUNTRY_CODES = [
  { code: "+33", flag: "🇫🇷", country: "FR" },
  { code: "+32", flag: "🇧🇪", country: "BE" },
  { code: "+41", flag: "🇨🇭", country: "CH" },
  { code: "+1", flag: "🇨🇦", country: "CA" },
  { code: "+352", flag: "🇱🇺", country: "LU" },
  { code: "+377", flag: "🇲🇨", country: "MC" },
  { code: "+1", flag: "🇺🇸", country: "US" },
  { code: "+44", flag: "🇬🇧", country: "GB" },
  { code: "+49", flag: "🇩🇪", country: "DE" },
  { code: "+34", flag: "🇪🇸", country: "ES" },
  { code: "+39", flag: "🇮🇹", country: "IT" },
  { code: "+351", flag: "🇵🇹", country: "PT" },
  { code: "+31", flag: "🇳🇱", country: "NL" },
  { code: "+212", flag: "🇲🇦", country: "MA" },
  { code: "+216", flag: "🇹🇳", country: "TN" },
  { code: "+213", flag: "🇩🇿", country: "DZ" },
  { code: "+225", flag: "🇨🇮", country: "CI" },
  { code: "+221", flag: "🇸🇳", country: "SN" },
  { code: "+237", flag: "🇨🇲", country: "CM" },
  { code: "+261", flag: "🇲🇬", country: "MG" },
];

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  "Europe/Paris": "FR",
  "Europe/Brussels": "BE",
  "Europe/Zurich": "CH",
  "America/Toronto": "CA",
  "America/Montreal": "CA",
  "America/Vancouver": "CA",
  "Europe/Luxembourg": "LU",
  "Europe/Monaco": "MC",
  "Europe/London": "GB",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "Europe/Berlin": "DE",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Lisbon": "PT",
  "Europe/Amsterdam": "NL",
  "Africa/Casablanca": "MA",
  "Africa/Tunis": "TN",
  "Africa/Algiers": "DZ",
  "Africa/Abidjan": "CI",
  "Africa/Dakar": "SN",
  "Africa/Douala": "CM",
  "Indian/Antananarivo": "MG",
};

function detectCountry(): string {
  if (typeof Intl === "undefined") return "FR";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  if (TIMEZONE_TO_COUNTRY[tz]) return TIMEZONE_TO_COUNTRY[tz];
  return "FR";
}

export default function PlanActionPage() {
  return (
    <Suspense>
      <PlanActionContent />
    </Suspense>
  );
}

function PlanActionContent() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryIndex, setCountryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const detected = detectCountry();
    const idx = COUNTRY_CODES.findIndex((c) => c.country === detected);
    if (idx !== -1) setCountryIndex(idx);
  }, []);

  const currentCountry = COUNTRY_CODES[countryIndex].country as CountryCode;

  function formatPhone(raw: string): string {
    try {
      const parsed = parsePhoneNumber(raw, currentCountry);
      return parsed ? parsed.format("E.164") : "";
    } catch {
      return "";
    }
  }

  function validateEmail(v: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function validatePhone(raw: string): boolean {
    try {
      return isValidPhoneNumber(raw, currentCountry);
    } catch {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("Entre ton prénom");
      return;
    }

    if (!validateEmail(email)) {
      setError("Entre une adresse email valide");
      return;
    }

    if (!validatePhone(phone)) {
      setError("Entre un numéro de téléphone valide");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
                  email: email.trim().toLowerCase(),
                  firstName: firstName.trim(),
                  phone: formatPhone(phone),
                  listId: 17,
                  source: "plan-action",
                  utmSource: searchParams.get("utm_source") || undefined,
                  utmMedium: searchParams.get("utm_medium") || undefined,
                  utmCampaign: searchParams.get("utm_campaign") || undefined,
                }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      posthog.capture("plan_action_form_submitted", {
        source: "plan-action",
        utm_source: searchParams.get("utm_source") || undefined,
        utm_medium: searchParams.get("utm_medium") || undefined,
        utm_campaign: searchParams.get("utm_campaign") || undefined,
      });

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
              {/* Main card */}
              <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-amber-500/20">
                <div className="relative rounded-xl bg-white/5 overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />

                  {/* Top bar: label + prix */}
                  <motion.div
                    className="flex items-center gap-4 px-5 pt-5 sm:px-12 sm:pt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="font-mono text-base sm:text-lg font-semibold tracking-widest uppercase text-amber-400">
                      Étude de cas offerte
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through text-lg font-medium">197€</span>
                      <span className="rounded-full bg-green-500/15 border border-green-500/30 px-3 py-1 text-sm font-bold text-green-400">GRATUIT</span>
                    </div>
                  </motion.div>

                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Left: text content */}
                    <div className="relative px-5 py-2 sm:px-12 sm:py-4 lg:py-5">

                      <motion.h1
                        className="text-3xl/tight sm:text-4xl/tight lg:text-[3rem]/tight font-medium tracking-tighter text-balance text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        La méthode à copier-coller qui m&apos;a permis de faire passer l&apos;app Shinobi{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500">
                          de 0 à 140K$/an
                        </span>
                      </motion.h1>

                      <motion.form
                        onSubmit={handleSubmit}
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                      >
                        <div className="flex flex-col gap-3 max-w-md">
                          <input
                            type="text"
                            required
                            placeholder="Ton prénom"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Ton adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                          />
                          <div className="flex gap-2">
                            <select
                              value={countryIndex}
                              onChange={(e) => setCountryIndex(Number(e.target.value))}
                              className="w-24 shrink-0 rounded-full bg-white/5 border border-white/10 px-3 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors appearance-none text-center"
                            >
                              {COUNTRY_CODES.map((c, i) => (
                                <option key={`${c.country}-${i}`} value={i}>
                                  {c.flag} {c.code}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              required
                              placeholder="Ton numéro de téléphone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="flex-1 min-w-0 rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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

                      {/* Mobile ARR chart */}
                      <motion.div
                        className="mt-8 lg:hidden rounded-xl overflow-hidden border border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                      >
                        <Image
                          src="/proof/arr-chart.png"
                          alt="Revenus Shinobi Japanese : de 0 à 140K$/an"
                          width={1232}
                          height={700}
                          className="w-full h-auto"
                          quality={90}
                        />
                      </motion.div>

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
                      className="relative hidden lg:flex items-center justify-center p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="relative w-full">
                        <div className="rounded-xl overflow-hidden border border-white/10">
                          <Image
                            src="/proof/arr-chart.png"
                            alt="Revenus Shinobi Japanese : de 0 à 140K$/an"
                            width={1232}
                            height={700}
                            className="w-full h-auto"
                            quality={90}
                          />
                        </div>

                        {/* Bullet points sous la vidéo */}
                        <ul className="mt-5 space-y-3 text-base text-white">
                          {[
                            "Pourquoi les apps mobiles sont la meilleure opportunité en 2026 (et pas les SaaS)",
                            "Ma méthode pour trouver et valider une idée de niche rentable",
                            "Comment créer une app complète avec l'IA, sans savoir coder",
                            "Les secrets d'un onboarding et d'un paywall qui convertissent",
                            "La stratégie de contenu viral qui a généré des millions de vues",
                            "Comment utiliser les micro-influenceurs pour scaler sans budget",
                            "Le plan d'action complet en 28 jours, de l'idée à la publication",
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={4} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
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
