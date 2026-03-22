"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getGuide } from "@/lib/guides";
import { notFound } from "next/navigation";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
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

export default function GuidePage() {
  const params = useParams();
  const slug = params.slug as string;
  const guide = getGuide(slug);

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
          listId: guide?.brevoListId,
          source: slug,
          utmSource: searchParams.get("utm_source") || undefined,
          utmMedium: searchParams.get("utm_medium") || undefined,
          utmCampaign: searchParams.get("utm_campaign") || undefined,
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
                          Entre ton prénom et email pour débloquer
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
