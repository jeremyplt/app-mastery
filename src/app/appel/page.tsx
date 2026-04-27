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

const BUDGET_OPTIONS = [
  { value: "moins-1000", label: "Moins de 1000€" },
  { value: "1000-3000", label: "1000€ - 3000€" },
  { value: "3000-plus", label: "Plus de 3000€" },
];

function detectCountry(): string {
  if (typeof Intl === "undefined") return "FR";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  if (TIMEZONE_TO_COUNTRY[tz]) return TIMEZONE_TO_COUNTRY[tz];
  return "FR";
}

export default function AppelPage() {
  return (
    <Suspense>
      <AppelContent />
    </Suspense>
  );
}

function AppelContent() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [appIdea, setAppIdea] = useState("");
  const [motivation, setMotivation] = useState("");
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

    if (!budget) {
      setError("Indique ton budget disponible");
      return;
    }

    if (!appIdea.trim() || appIdea.trim().length < 10) {
      setError("Décris brièvement ton projet d'app (au moins 10 caractères)");
      return;
    }

    if (!motivation.trim() || motivation.trim().length < 10) {
      setError("Explique en quelques mots pourquoi tu veux te lancer maintenant");
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = formatPhone(phone);
      const trimmedFirstName = firstName.trim();
      const trimmedEmail = email.trim().toLowerCase();

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          firstName: trimmedFirstName,
          phone: formattedPhone,
          listId: 20,
          source: "appel",
          budget,
          appIdea: appIdea.trim(),
          motivation: motivation.trim(),
          utmSource: searchParams.get("utm_source") || undefined,
          utmMedium: searchParams.get("utm_medium") || undefined,
          utmCampaign: searchParams.get("utm_campaign") || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      posthog.capture("appel_form_submitted", {
        source: "appel",
        budget,
        utm_source: searchParams.get("utm_source") || undefined,
        utm_medium: searchParams.get("utm_medium") || undefined,
        utm_campaign: searchParams.get("utm_campaign") || undefined,
      });

      const params = new URLSearchParams({
        firstName: trimmedFirstName,
        email: trimmedEmail,
      });
      router.push(`/appel/reserver?${params.toString()}`);
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

                  {/* Top bar: label */}
                  <motion.div
                    className="flex items-center gap-4 px-5 pt-5 sm:px-12 sm:pt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="font-mono text-base sm:text-lg font-semibold tracking-widest uppercase text-amber-400">
                      Appel découverte
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-green-500/15 border border-green-500/30 px-3 py-1 text-sm font-bold text-green-400">
                        OFFERT
                      </span>
                    </div>
                  </motion.div>

                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Right (desktop): headline + form */}
                    <div className="relative px-5 py-2 sm:px-12 sm:py-4 lg:py-5 lg:order-2">
                      <motion.h1
                        className="text-3xl/tight sm:text-4xl/tight lg:text-[3rem]/tight font-medium tracking-tighter text-balance text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        Tu veux te former ou être accompagné pour développer ton app mobile{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500">
                          avec l&apos;IA ?
                        </span>
                      </motion.h1>

                      <motion.p
                        className="mt-5 text-lg sm:text-xl text-gray-200 font-medium leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                      >
                        Réserve un appel de 30 minutes avec moi. On regarde ensemble si la formation ou l&apos;accompagnement peuvent vraiment t&apos;aider à lancer ton app et générer tes premiers revenus.
                      </motion.p>

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
                            className="w-full rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Ton adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
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
                              className="flex-1 min-w-0 rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                            />
                          </div>

                          <div className="mt-2">
                            <label className="block text-sm font-semibold text-white mb-2">
                              Quel budget peux-tu investir dans ta formation ou ton accompagnement ?
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {BUDGET_OPTIONS.map((opt) => (
                                <label
                                  key={opt.value}
                                  className={`relative flex items-center justify-center rounded-xl border px-2 py-3 text-center text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                                    budget === opt.value
                                      ? "bg-amber-500/15 border-amber-500/60 text-white"
                                      : "bg-white/5 border-white/10 text-gray-200 hover:border-white/20"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="budget"
                                    value={opt.value}
                                    checked={budget === opt.value}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="sr-only"
                                  />
                                  <span>{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="mt-2">
                            <label className="block text-sm font-semibold text-white mb-2">
                              Décris brièvement ton idée d&apos;app ou ton projet
                            </label>
                            <textarea
                              required
                              value={appIdea}
                              onChange={(e) => setAppIdea(e.target.value)}
                              rows={3}
                              className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                              Pourquoi veux-tu te lancer maintenant ? Qu&apos;est-ce qui te motive ?
                            </label>
                            <textarea
                              required
                              value={motivation}
                              onChange={(e) => setMotivation(e.target.value)}
                              rows={3}
                              className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-amber-500 px-6 py-3 text-base font-bold text-white hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap mt-2"
                          >
                            {loading ? "..." : "Continuer pour réserver mon appel"}
                          </button>
                        </div>
                        {error && (
                          <p className="mt-3 text-sm font-semibold text-red-400">{error}</p>
                        )}
                        <p className="mt-4 text-sm text-gray-300 font-medium">
                          Tes informations restent confidentielles. Aucun spam.
                        </p>
                      </motion.form>
                    </div>

                    {/* Left (desktop): qualification bullets */}
                    <motion.div
                      className="relative flex items-start lg:items-center justify-center px-5 pb-8 lg:px-6 lg:py-6 lg:order-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="w-full">
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
                          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                            Avant de réserver, lis bien ça.
                          </h2>
                          <p className="text-base text-gray-200 font-medium mb-5">
                            Cet appel n&apos;est pas pour tout le monde. Pour qu&apos;il soit utile pour toi (et pour moi), il y a 3 conditions :
                          </p>

                          <ul className="space-y-4 text-base text-white">
                            {[
                              {
                                title: "Pas besoin de savoir coder.",
                                body: "L'IA fait le travail technique. Si tu sais utiliser un ordinateur, tu peux créer une app. C'est ce que je te montre.",
                              },
                              {
                                title: "Il faut un budget pour avancer.",
                                body: "La formation et l'accompagnement ont un prix. Pour que cet appel soit utile, l'idée c'est que tu sois déjà ouvert à investir sur toi et sur ton projet.",
                              },
                              {
                                title: "Il faut être motivé et passer à l'action.",
                                body: "Cet appel n'est utile que si tu as vraiment envie d'avancer sur ton projet. Si tu es prêt à t'engager et à bosser sérieusement, alors on va faire de belles choses ensemble.",
                              },
                            ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={4} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                </span>
                                <div>
                                  <p className="font-bold text-white">{item.title}</p>
                                  <p className="text-gray-200 mt-1">{item.body}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-5 flex items-center gap-3">
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
                          <span className="text-sm font-medium text-gray-200">
                            Ils ont déjà lancé leur app avec moi
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Bottom credit */}
              <motion.p
                className="mt-8 text-center text-sm text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Par Jeremy, créateur de Shinobi Japanese
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
