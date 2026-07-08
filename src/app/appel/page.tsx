"use client";

import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { COUNTRY_CODES, detectCountry } from "@/lib/phone-countries";
import { looksLikeFakePattern } from "@/lib/phone-validation";
import { QUESTIONS, isValidAnswer } from "@/lib/candidature";
import { generateEventId, metaTrackingFields, trackMeta } from "@/lib/meta-pixel";

export default function CandidaturePage() {
  return (
    <Suspense>
      <CandidatureContent />
    </Suspense>
  );
}

type Answers = Record<string, string>;

// Étapes : 1 intro + 6 questions + 1 contact = index 0..7
const LAST_QUESTION_INDEX = QUESTIONS.length; // 6
const CONTACT_INDEX = QUESTIONS.length + 1; // 7
const TOTAL_STEPS = QUESTIONS.length + 2; // intro + 6 + contact

function CandidatureContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [firstName, setFirstName] = useState("");
  const [hp, setHp] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryIndex, setCountryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rescue, setRescue] = useState(false);

  useEffect(() => {
    const detected = detectCountry();
    const idx = COUNTRY_CODES.findIndex((c) => c.country === detected);
    if (idx !== -1) setCountryIndex(idx);
  }, []);

  // Tracking du funnel : un event par étape vue (pour mesurer les drop-offs).
  useEffect(() => {
    const stepName =
      step === 0
        ? "intro"
        : step <= LAST_QUESTION_INDEX
          ? QUESTIONS[step - 1].id
          : "contact";
    posthog.capture("candidature_step_viewed", {
      step,
      step_name: stepName,
      utm_source: searchParams.get("utm_source") || undefined,
    });
  }, [step, searchParams]);

  const currentCountry: CountryCode = COUNTRY_CODES[countryIndex].country;

  function formatPhone(raw: string): string {
    try {
      const parsed = parsePhoneNumber(raw, currentCountry);
      return parsed ? parsed.format("E.164") : "";
    } catch {
      return "";
    }
  }

  function validatePhone(raw: string): boolean {
    try {
      return isValidPhoneNumber(raw, currentCountry);
    } catch {
      return false;
    }
  }

  // step 1..6 maps to QUESTIONS[0..5]
  const question = step >= 1 && step <= LAST_QUESTION_INDEX ? QUESTIONS[step - 1] : null;
  const progress = Math.round((step / (TOTAL_STEPS - 1)) * 100);

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function goNext() {
    setError("");
    setStep((s) => Math.min(s + 1, CONTACT_INDEX));
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleChoice(id: string, value: string) {
    setError("");
    // "Autre" ouvre un champ libre : pas d'auto-avance.
    if (value === "autre") {
      setAnswer(id, "autre");
      return;
    }
    setAnswer(id, value);
    // auto-avance après un court délai pour laisser voir la sélection
    setTimeout(() => setStep((s) => Math.min(s + 1, CONTACT_INDEX)), 220);
  }

  function validateEmail(v: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  // Erreur de validation : message affiché + événement PostHog pour mesurer
  // la friction du formulaire de contact (quel champ bloque les prospects).
  function failValidation(reason: string, message: string) {
    posthog.capture("candidature_error", { reason });
    setError(message);
  }

  async function handleSubmit() {
    setError("");
    if (!firstName.trim()) {
      failValidation("first_name", "Entre ton prénom");
      return;
    }
    if (!validateEmail(email.trim())) {
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

    submit();
  }

  async function submit(budgetReady?: "oui" | "non") {
    setError("");
    setLoading(true);
    try {
      // Même event_id côté Pixel (navigateur) et CAPI (serveur) : Meta déduplique.
      // Le serveur n'envoie rien en cas de rescue, donc pas de double comptage.
      const metaEventId = generateEventId();

      const res = await fetch("/api/candidature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: hp,
          firstName: firstName.trim(),
          email: email.trim().toLowerCase(),
          phone: formatPhone(phone),
          q1: answers.q1,
          q2: answers.q2,
          q3: answers.q3,
          q4: answers.q4,
          q5: (answers.q5 || "").trim(),
          q6: answers.q6,
          budgetReady,
          utmSource: searchParams.get("utm_source") || undefined,
          utmMedium: searchParams.get("utm_medium") || undefined,
          utmCampaign: searchParams.get("utm_campaign") || undefined,
          ...metaTrackingFields(metaEventId),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue");

      // Rattrapage : on demande le budget avant de décider.
      if (data.rescue) {
        posthog.capture("candidature_rescue_shown");
        setRescue(true);
        setLoading(false);
        return;
      }

      trackMeta("Lead", { content_name: "candidature" }, metaEventId);
      trackMeta("SubmitApplication", { content_name: "candidature" }, `${metaEventId}-sa`);

      posthog.capture("candidature_submitted", {
        qualified: data.qualified,
        budget_ready: budgetReady,
        utm_source: searchParams.get("utm_source") || undefined,
      });

      window.location.href = data.redirectUrl;
    } catch (err) {
      posthog.capture("candidature_error", { reason: "server" });
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      {/* Barre de progression */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center px-5 py-16 sm:py-20">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {step === 0 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance">
                  Quelques questions rapides pour que notre appel soit vraiment utile.
                </h1>
                <p className="mt-5 text-lg sm:text-xl text-gray-200 font-medium max-w-xl mx-auto">
                  Ça prend moins d&apos;une minute. C&apos;est ce qui me permet de personnaliser l&apos;appel à ton projet et à ta situation.
                </p>
                <button
                  onClick={goNext}
                  className="mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-bold text-gray-950 transition-transform hover:scale-[1.03] active:scale-100"
                >
                  C&apos;est parti
                  <span aria-hidden>→</span>
                </button>
              </motion.div>
            )}

            {/* QUESTIONS */}
            {question && (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm font-bold uppercase tracking-wide text-amber-400">
                  Question {step} / {QUESTIONS.length}
                </p>
                <h2 className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-balance">
                  {question.title}
                </h2>

                {question.type === "choice" && question.options && (
                  <div className="mt-8 space-y-3">
                    {question.options.map((opt) => {
                      const current = answers[question.id] || "";
                      const selected =
                        opt.value === "autre"
                          ? current === "autre" || current.startsWith("autre:")
                          : current === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleChoice(question.id, opt.value)}
                          className={`w-full text-left rounded-xl border-2 px-5 py-4 text-lg font-semibold transition-all ${
                            selected
                              ? "border-amber-400 bg-amber-400/15 text-white"
                              : "border-white/15 bg-white/5 text-gray-100 hover:border-amber-400/60 hover:bg-white/10"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}

                    {/* Champ libre quand "Autre" est sélectionné */}
                    {question.allowOther &&
                      (answers[question.id] === "autre" ||
                        (answers[question.id] || "").startsWith("autre:")) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2">
                            <label
                              htmlFor="autre-input"
                              className="block text-base font-bold text-amber-300"
                            >
                              Dis-moi en quelques mots
                            </label>
                            <div className="mt-2 flex items-center gap-3 border-b-2 border-amber-400/60 focus-within:border-amber-400">
                              <svg className="h-5 w-5 shrink-0 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                              </svg>
                              <input
                                id="autre-input"
                                type="text"
                                autoFocus
                                value={(answers[question.id] || "").replace(/^autre:\s?/, "")}
                                onChange={(e) =>
                                  setAnswer(
                                    question.id,
                                    e.target.value ? `autre: ${e.target.value}` : "autre",
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    isValidAnswer(question, answers[question.id] || "")
                                  ) {
                                    goNext();
                                  }
                                }}
                                placeholder="Ex : freelance à mi-temps, en reconversion..."
                                className="w-full bg-transparent py-3 text-lg font-medium text-white placeholder:text-gray-500 focus:outline-none"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (!isValidAnswer(question, answers[question.id] || "")) {
                                setError("Précise en quelques mots.");
                                return;
                              }
                              goNext();
                            }}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3.5 text-lg font-bold text-gray-950 transition-transform hover:scale-[1.03] active:scale-100"
                          >
                            Continuer <span aria-hidden>→</span>
                          </button>
                        </motion.div>
                      )}
                  </div>
                )}

                {question.type === "text" && (
                  <div className="mt-8">
                    <textarea
                      autoFocus
                      rows={4}
                      value={answers[question.id] || ""}
                      onChange={(e) => setAnswer(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      className="w-full rounded-xl border-2 border-white/15 bg-white/5 px-5 py-4 text-lg font-medium text-white placeholder:text-gray-400 focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (!isValidAnswer(question, answers[question.id] || "")) {
                          setError("Écris quelques mots, ça m'aide vraiment.");
                          return;
                        }
                        goNext();
                      }}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3.5 text-lg font-bold text-gray-950 transition-transform hover:scale-[1.03] active:scale-100"
                    >
                      Continuer <span aria-hidden>→</span>
                    </button>
                  </div>
                )}

                {error && (
                  <p className="mt-5 text-base font-bold text-red-400">{error}</p>
                )}

                <button
                  onClick={goBack}
                  className="mt-8 text-sm font-bold text-gray-400 hover:text-white"
                >
                  ← Retour
                </button>
              </motion.div>
            )}

            {/* CONTACT */}
            {step === CONTACT_INDEX && !rescue && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm font-bold uppercase tracking-wide text-amber-400">
                  Dernière étape
                </p>
                <h2 className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-balance">
                  Où est-ce que je t&apos;envoie la suite ?
                </h2>
                <p className="mt-4 text-lg text-gray-200 font-medium">
                  Ton prénom, ton email et ton téléphone, pour préparer l&apos;appel et te recontacter.
                </p>

                <div className="mt-8 space-y-4">
                  {/* Honeypot anti-spam : caché aux humains, rempli par les bots. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    aria-hidden="true"
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ton prénom"
                    className="w-full rounded-xl border-2 border-white/15 bg-white/5 px-5 py-4 text-lg font-medium text-white placeholder:text-gray-400 focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ton email"
                    className="w-full rounded-xl border-2 border-white/15 bg-white/5 px-5 py-4 text-lg font-medium text-white placeholder:text-gray-400 focus:border-amber-400 focus:outline-none"
                  />
                  <div className="flex gap-3">
                    <select
                      value={countryIndex}
                      onChange={(e) => setCountryIndex(Number(e.target.value))}
                      className="w-28 shrink-0 appearance-none rounded-xl border-2 border-white/15 bg-white/5 px-3 py-4 text-center text-lg font-medium text-white focus:border-amber-400 focus:outline-none"
                    >
                      {COUNTRY_CODES.map((c, i) => (
                        <option key={`${c.country}-${i}`} value={i}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ton numéro de téléphone"
                      className="min-w-0 flex-1 rounded-xl border-2 border-white/15 bg-white/5 px-5 py-4 text-lg font-medium text-white placeholder:text-gray-400 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <p className="mt-5 text-base font-bold text-red-400">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-bold text-gray-950 transition-transform hover:scale-[1.02] active:scale-100 disabled:opacity-60"
                >
                  {loading ? "Un instant..." : "Valider ma candidature"}
                </button>

                <button
                  onClick={goBack}
                  className="mt-8 text-sm font-bold text-gray-400 hover:text-white"
                >
                  ← Retour
                </button>
              </motion.div>
            )}

            {/* RATTRAPAGE BUDGET */}
            {rescue && (
              <motion.div
                key="rescue"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-balance">
                  Une dernière chose.
                </h2>
                <p className="mt-4 text-lg sm:text-xl text-gray-200 font-medium">
                  Est-ce que tu as un budget que tu peux allouer pour avancer sur ton projet et ta progression ?
                </p>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => submit("oui")}
                    disabled={loading}
                    className="w-full rounded-xl border-2 border-white/15 bg-white/5 px-5 py-4 text-left text-lg font-semibold text-gray-100 transition-all hover:border-amber-400/60 hover:bg-white/10 disabled:opacity-60"
                  >
                    Oui, je peux investir pour avancer
                  </button>
                  <button
                    onClick={() => submit("non")}
                    disabled={loading}
                    className="w-full rounded-xl border-2 border-white/15 bg-white/5 px-5 py-4 text-left text-lg font-semibold text-gray-100 transition-all hover:border-amber-400/60 hover:bg-white/10 disabled:opacity-60"
                  >
                    Non, pas pour le moment
                  </button>
                </div>

                {loading && (
                  <p className="mt-5 text-base font-medium text-gray-400">Un instant...</p>
                )}
                {error && (
                  <p className="mt-5 text-base font-bold text-red-400">{error}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
