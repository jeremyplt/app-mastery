"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import posthog from "posthog-js";
import type { CountryCode } from "libphonenumber-js";
import { COUNTRY_CODES, detectCountry } from "@/lib/phone-countries";
import { looksLikeFakePattern } from "@/lib/phone-validation";
import { generateEventId, metaTrackingFields, trackMeta } from "@/lib/meta-pixel";

// Liste Brevo dédiée aux leads de la conférence (VSL).
// TODO : remplacer par l'ID réel de la nouvelle liste Brevo VSL.
const VSL_LIST_ID = 22;

export default function ConferencePage() {
  return (
    <Suspense>
      <ConferenceContent />
    </Suspense>
  );
}

function ConferenceContent() {
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

  const currentCountry: CountryCode = COUNTRY_CODES[countryIndex].country;

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

  // Erreur de validation : message affiché + événement PostHog pour mesurer
  // la friction du formulaire (quel champ bloque les prospects).
  function failValidation(reason: string, message: string) {
    posthog.capture("vsl_optin_error", { reason });
    setError(message);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) {
      failValidation("first_name", "Entre ton prénom");
      return;
    }

    if (!validateEmail(email)) {
      failValidation("email", "Entre une adresse email valide");
      return;
    }

    if (!validatePhone(phone)) {
      failValidation("phone", "Entre un numéro de téléphone valide");
      return;
    }

    try {
      const parsedFinal = parsePhoneNumber(phone, currentCountry);
      if (parsedFinal) {
        if (parsedFinal.country === "FR" && !/^[67]/.test(parsedFinal.nationalNumber)) {
          failValidation("phone_fr_mobile", "Pour la France, utilise un numéro mobile (06 ou 07).");
          return;
        }
        if (looksLikeFakePattern(parsedFinal.nationalNumber)) {
          failValidation("phone_fake", "Ce numéro n'est pas valide. Merci de rentrer un vrai numéro.");
          return;
        }
      }
    } catch {}

    setLoading(true);

    try {
      // Même event_id côté Pixel (navigateur) et CAPI (serveur) : Meta déduplique.
      const metaEventId = generateEventId();

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          firstName: firstName.trim(),
          phone: formatPhone(phone),
          listId: VSL_LIST_ID,
          source: "vsl",
          utmSource: searchParams.get("utm_source") || undefined,
          utmMedium: searchParams.get("utm_medium") || undefined,
          utmCampaign: searchParams.get("utm_campaign") || undefined,
          ...metaTrackingFields(metaEventId),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      trackMeta("Lead", { content_name: "vsl" }, metaEventId);

      posthog.capture("vsl_optin_submitted", {
        source: "vsl",
        utm_source: searchParams.get("utm_source") || undefined,
        utm_medium: searchParams.get("utm_medium") || undefined,
        utm_campaign: searchParams.get("utm_campaign") || undefined,
      });

      const query = searchParams.toString();
      router.push(`/conference/live${query ? `?${query}` : ""}`);
    } catch (err) {
      posthog.capture("vsl_optin_error", { reason: "server" });
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  }

  function scrollToForm() {
    document.getElementById("optin-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("optin-firstname")?.focus();
  }

  const bullets = [
    {
      emoji: "🧠",
      text: (
        <>
          La raison étonnante qui explique pourquoi{" "}
          <span className="font-semibold text-red-400">93% des applications</span> ne sont jamais
          rentables (et comment éviter ce piège).
        </>
      ),
    },
    {
      emoji: "🚀",
      text: (
        <>
          Les <span className="font-semibold text-red-400">3 piliers indispensables</span> pour
          générer jusqu&apos;à{" "}
          <span className="font-semibold text-red-400">10 000€ TOUS les mois</span> avec une seule
          application.
        </>
      ),
    },
    {
      emoji: "🏝",
      text: (
        <>
          La méthode exacte pour créer votre app avec l&apos;IA en{" "}
          <span className="font-semibold text-red-400">moins d&apos;une semaine</span>, sans écrire
          une seule ligne de code.
        </>
      ),
    },
  ];

  const cases = [
    {
      name: "Evan",
      amount: "13 000€",
      unit: "par mois",
      detail: "à seulement 14 ans",
      image: {
        src: "/proof/evan-dashboard.png",
        alt: "Dashboard des revenus d'Evan",
        width: 2368,
        height: 1036,
      },
    },
    {
      name: "Flo",
      amount: "30 000€",
      unit: "par mois",
      detail: "avec une app créée depuis sa chambre",
      image: {
        src: "/proof/flo-dashboard-v2.png",
        alt: "Dashboard des revenus de Flo",
        width: 1937,
        height: 812,
      },
    },
    {
      name: "Denis",
      amount: "65 391€",
      unit: "générés",
      detail: "en à peine 7 mois",
      image: {
        src: "/proof/denis-dashboard.png",
        alt: "Dashboard des revenus de Denis",
        width: 2286,
        height: 940,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="grid min-h-screen grid-cols-[1fr_minmax(0,80rem)_1fr]">
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
        <div className="flex min-h-screen flex-col min-w-0">
          <section className="relative pt-6 pb-16 sm:pt-16 lg:pt-20">
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Main card */}
              <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-red-500/20">
                <div className="relative rounded-xl bg-white/5 overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-rose-500/5" />

                  <div className="relative mx-auto max-w-3xl px-5 py-10 sm:px-12 sm:py-14 text-center">
                    {/* Top label */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <span className="font-mono text-sm sm:text-base font-semibold tracking-widest uppercase text-red-400">
                        Conférence privée offerte
                      </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                      className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-balance text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      Le Nouvel{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600">
                        Eldorado
                      </span>{" "}
                      Des Applications Mobiles
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                      className="mt-5 text-lg sm:text-xl font-medium text-white text-balance"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                    >
                      Comment une discrète révolution permet de générer jusqu&apos;à{" "}
                      <span className="text-red-400 font-semibold">10 000€ par mois</span> avec une
                      seule application mobile.
                    </motion.p>

                    <motion.p
                      className="mt-3 text-base sm:text-lg font-medium text-gray-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.25 }}
                    >
                      Sans coder, sans compétence technique et sans investissement.
                    </motion.p>

                    {/* Form */}
                    <motion.form
                      id="optin-form"
                      onSubmit={handleSubmit}
                      className="mt-9 mx-auto max-w-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.35 }}
                    >
                      <div className="flex flex-col gap-3">
                        <input
                          id="optin-firstname"
                          type="text"
                          required
                          placeholder="Ton prénom"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Ton adresse email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors"
                        />
                        <div className="flex gap-2">
                          <select
                            value={countryIndex}
                            onChange={(e) => setCountryIndex(Number(e.target.value))}
                            className="w-24 shrink-0 rounded-full bg-white/5 border border-white/10 px-3 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors appearance-none text-center"
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
                            className="flex-1 min-w-0 rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3.5 text-base font-bold text-white hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {loading ? "..." : "Accéder à la conférence privée"}
                        </button>
                      </div>
                      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                      <p className="mt-4 text-xs text-gray-400">
                        Accès immédiat. 100% gratuit.
                      </p>
                    </motion.form>
                  </div>
                </div>
              </div>

              {/* Découvrir */}
              <motion.div
                className="mx-auto mt-16 max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-center text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Dans cette conférence privée, vous allez découvrir :
                </h2>
                <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
                  {bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-4 py-6">
                      <span className="text-2xl leading-none shrink-0 mt-0.5">{b.emoji}</span>
                      <p className="text-base sm:text-lg text-white leading-snug text-left">
                        {b.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Preuves */}
              <div className="mt-20">
                <motion.h2
                  className="text-center text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                >
                  Ils sont déjà passés à l&apos;action
                </motion.h2>

                <div className="mt-10 flex flex-col gap-14">
                  {cases.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-center">
                        <p className="font-mono text-sm font-semibold uppercase tracking-widest text-red-400">
                          {c.name}
                        </p>
                        <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white text-balance">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600 whitespace-nowrap">
                            {c.amount}
                          </span>{" "}
                          {c.unit}
                        </p>
                        <p className="mt-2 text-lg sm:text-xl font-medium text-gray-300">
                          {c.detail}
                        </p>
                      </div>
                      {c.image && (
                        <div className="mt-6 isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-red-500/20">
                          <div className="rounded-xl overflow-hidden">
                            <Image
                              src={c.image.src}
                              alt={c.image.alt}
                              width={c.image.width}
                              height={c.image.height}
                              className="w-full h-auto"
                              quality={90}
                              sizes="(max-width: 1280px) 100vw, 1280px"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA final */}
              <motion.div
                className="mt-14 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 px-8 py-4 text-base font-bold text-white hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-600/30 whitespace-nowrap"
                >
                  Accéder à la conférence privée
                </button>
                <p className="mt-8 text-sm text-gray-400">
                  Par Jeremy, créateur de Shinobi Japanese
                </p>
              </motion.div>
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
