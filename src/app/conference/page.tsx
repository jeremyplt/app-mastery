"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import AdDisclaimer from "@/components/AdDisclaimer";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import posthog from "posthog-js";
import type { CountryCode } from "libphonenumber-js";
import { COUNTRY_CODES, detectCountry } from "@/lib/phone-countries";
import { looksLikeFakePattern } from "@/lib/phone-validation";
import { generateEventId, metaTrackingFields, trackMeta } from "@/lib/meta-pixel";
import { saveOptinContact } from "@/lib/optin-contact";
import {
  VSL_QUESTIONS,
  qualifyVslLead,
  saveVslAnswers,
  type VslAnswers,
} from "@/lib/vsl-qualification";

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
  // Étape 2 : questions de pré-qualification (contact déjà enregistré).
  const [step, setStep] = useState<"contact" | "questions">("contact");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<VslAnswers>>({});
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
      // Pas d'événement Meta Lead ici : il ne part qu'après les questions de
      // pré-qualification, et uniquement pour les leads qualifiés. Le contact
      // est quand même enregistré (Brevo + CRM + email d'accès) : même s'il
      // abandonne aux questions, on peut le relancer par email.
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
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Mémorise le contact pour pré-remplir le formulaire Calendly de la VSL.
      saveOptinContact({
        firstName: firstName.trim(),
        email: email.trim().toLowerCase(),
        phone: formatPhone(phone),
      });

      posthog.capture("vsl_optin_submitted", {
        source: "vsl",
        utm_source: searchParams.get("utm_source") || undefined,
        utm_medium: searchParams.get("utm_medium") || undefined,
        utm_campaign: searchParams.get("utm_campaign") || undefined,
      });

      setLoading(false);
      setStep("questions");
    } catch (err) {
      posthog.capture("vsl_optin_error", { reason: "server" });
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  }

  // Clic sur une option : enregistre la réponse et passe à la question
  // suivante. Dernière question -> finalisation et accès à la vidéo.
  function handleAnswer(option: string) {
    const question = VSL_QUESTIONS[questionIndex];
    const nextAnswers = { ...answers, [question.id]: option };
    setAnswers(nextAnswers);

    posthog.capture("vsl_qualification_answer", {
      question: question.id,
      answer: option,
    });

    if (questionIndex < VSL_QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
      return;
    }

    finalizeQualification(nextAnswers as VslAnswers);
  }

  function finalizeQualification(finalAnswers: VslAnswers) {
    const qualified = qualifyVslLead(finalAnswers);

    // Réponses persistées pour pré-remplir le popup Calendly de la VSL.
    saveVslAnswers(finalAnswers);

    // Meta Lead uniquement si qualifié : Pixel ici, CAPI côté serveur avec le
    // même event_id (Meta déduplique). Meta n'apprend que sur les bons profils.
    const metaEventId = generateEventId();
    if (qualified) {
      trackMeta("Lead", { content_name: "vsl", value: 1, currency: "EUR" }, metaEventId);
    }

    // Best-effort : l'enregistrement serveur ne bloque jamais l'accès à la vidéo.
    fetch("/api/vsl-qualify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        phone: formatPhone(phone),
        ...finalAnswers,
        ...metaTrackingFields(metaEventId),
      }),
    }).catch(() => {});

    posthog.capture("vsl_qualification_submitted", {
      ...finalAnswers,
      qualified,
    });

    const query = searchParams.toString();
    router.push(`/conference/live${query ? `?${query}` : ""}`);
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
          <span className="font-semibold text-[var(--red)]">93% des applications</span> ne sont jamais
          rentables (et comment éviter ce piège).
        </>
      ),
    },
    {
      emoji: "🚀",
      text: (
        <>
          Les <span className="font-semibold text-[var(--red)]">3 piliers indispensables</span> pour
          générer jusqu&apos;à{" "}
          <span className="font-semibold text-[var(--red)]">10 000€ TOUS les mois</span> avec une seule
          application.
        </>
      ),
    },
    {
      emoji: "🏝",
      text: (
        <>
          La méthode exacte pour créer votre app avec l&apos;IA en{" "}
          <span className="font-semibold text-[var(--red)]">moins d&apos;une semaine</span>, sans écrire
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="grid min-h-screen grid-cols-[1fr_minmax(0,80rem)_1fr]">
        {/* Left gutter */}
        <div
          className="border-r border-[var(--sep)] bg-fixed"
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
              <div className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-red-500/20">
                <div className="relative rounded-xl bg-[var(--card)] overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_8%,transparent)] via-transparent to-transparent" />

                  <div className="relative mx-auto max-w-3xl px-5 py-10 sm:px-12 sm:py-14 text-center">
                    {/* Top label */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <span className="font-mono text-sm sm:text-base font-semibold tracking-widest uppercase text-[var(--red)]">
                        Conférence privée offerte
                      </span>
                    </motion.div>

                    {step === "contact" && (
                      <>
                    {/* Headline */}
                    <motion.h1
                      className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-balance text-[var(--fg)]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      Le Nouvel{" "}
                      <span className="mac-accent">
                        Eldorado
                      </span>{" "}
                      Des Applications Mobiles
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                      className="mt-5 text-lg sm:text-xl font-medium text-[var(--fg)] text-balance"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                    >
                      Comment une discrète révolution permet de générer jusqu&apos;à{" "}
                      <span className="text-[var(--red)] font-semibold">10 000€ par mois</span> avec une
                      seule application mobile.
                    </motion.p>

                    <motion.p
                      className="mt-3 text-base sm:text-lg font-medium text-[var(--fg2)]"
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
                          className="w-full rounded-full bg-[var(--card)] border border-[var(--sep)] px-5 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg2)] focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Ton adresse email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-full bg-[var(--card)] border border-[var(--sep)] px-5 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg2)] focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors"
                        />
                        <div className="flex gap-2">
                          <select
                            value={countryIndex}
                            onChange={(e) => setCountryIndex(Number(e.target.value))}
                            className="w-24 shrink-0 rounded-full bg-[var(--card)] border border-[var(--sep)] px-3 py-3 text-sm text-[var(--fg)] focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors appearance-none text-center"
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
                            className="flex-1 min-w-0 rounded-full bg-[var(--card)] border border-[var(--sep)] px-5 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg2)] focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="mac-btn mac-btn-primary w-full whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "..." : "Accéder à la conférence privée"}
                        </button>
                      </div>
                      {error && <p className="mt-3 text-sm text-[var(--red)]">{error}</p>}
                      <p className="mt-4 text-xs text-[var(--fg2)]">
                        Accès immédiat. 100% gratuit.
                      </p>
                    </motion.form>
                      </>
                    )}

                    {step === "questions" && (
                      <motion.div
                        key={VSL_QUESTIONS[questionIndex].id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mx-auto max-w-xl"
                      >
                        <p className="mt-6 font-mono text-sm font-semibold tracking-widest uppercase text-[var(--fg2)]">
                          Question {questionIndex + 1} / {VSL_QUESTIONS.length}
                        </p>
                        <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-balance text-[var(--fg)]">
                          {VSL_QUESTIONS[questionIndex].title}
                        </h1>
                        <p className="mt-3 text-base font-medium text-[var(--fg2)]">
                          Dernière étape avant d&apos;accéder à la conférence.
                        </p>
                        <div className="mt-8 flex flex-col gap-3">
                          {VSL_QUESTIONS[questionIndex].options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleAnswer(option)}
                              className="w-full rounded-full bg-[var(--card)] border border-[var(--sep)] px-6 py-3.5 text-sm sm:text-base font-semibold text-[var(--fg)] text-left hover:border-[var(--accent)] hover:bg-[var(--sel)] transition-colors"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
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
                <h2 className="text-center text-2xl sm:text-3xl font-black tracking-tight text-[var(--fg)]">
                  Dans cette conférence privée, vous allez découvrir :
                </h2>
                <div className="mt-6 divide-y divide-white/10 border-y border-[var(--sep)]">
                  {bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-4 py-6">
                      <span className="text-2xl leading-none shrink-0 mt-0.5">{b.emoji}</span>
                      <p className="text-base sm:text-lg text-[var(--fg)] leading-snug text-left">
                        {b.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Preuves */}
              <div className="mt-20">
                <motion.h2
                  className="text-center text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--fg)]"
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
                        <p className="font-mono text-sm font-semibold uppercase tracking-widest text-[var(--red)]">
                          {c.name}
                        </p>
                        <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--fg)] text-balance">
                          <span className="mac-accent whitespace-nowrap">
                            {c.amount}
                          </span>{" "}
                          {c.unit}
                        </p>
                        <p className="mt-2 text-lg sm:text-xl font-medium text-[var(--fg2)]">
                          {c.detail}
                        </p>
                      </div>
                      {c.image && (
                        <div className="mt-6 isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-red-500/20">
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
                  className="mac-btn mac-btn-primary mac-btn-lg whitespace-nowrap"
                >
                  Accéder à la conférence privée
                </button>
                <p className="mt-8 text-sm text-[var(--fg2)]">
                  Par Jeremy, créateur de Shinobi Japanese
                </p>
              </motion.div>
            </div>
          </section>
        </div>

        {/* Right gutter */}
        <div
          className="border-l border-[var(--sep)] bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>
      <AdDisclaimer />
    </div>
  );
}
