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
    setAnswer(id, value);
    setError("");
    // auto-avance après un court délai pour laisser voir la sélection
    setTimeout(() => setStep((s) => Math.min(s + 1, CONTACT_INDEX)), 220);
  }

  function validateEmail(v: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  async function handleSubmit() {
    setError("");
    if (!firstName.trim()) {
      setError("Entre ton prénom");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("Entre une adresse email valide");
      return;
    }
    if (!validatePhone(phone)) {
      setError("Entre un numéro de téléphone valide");
      return;
    }
    try {
      const parsedFinal = parsePhoneNumber(phone, currentCountry);
      if (parsedFinal) {
        if (parsedFinal.country === "FR" && !/^[67]/.test(parsedFinal.nationalNumber)) {
          setError("Pour la France, utilise un numéro mobile (06 ou 07).");
          return;
        }
        if (looksLikeFakePattern(parsedFinal.nationalNumber)) {
          setError("Ce numéro n'est pas valide. Merci de rentrer un vrai numéro.");
          return;
        }
      }
    } catch {}

    setLoading(true);
    try {
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
          utmSource: searchParams.get("utm_source") || undefined,
          utmMedium: searchParams.get("utm_medium") || undefined,
          utmCampaign: searchParams.get("utm_campaign") || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue");

      posthog.capture("candidature_submitted", {
        qualified: data.qualified,
        utm_source: searchParams.get("utm_source") || undefined,
      });

      window.location.href = data.redirectUrl;
    } catch (err) {
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
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-bold text-amber-300">
                  Candidature à un appel stratégique
                </div>
                <h1 className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight text-balance">
                  4 questions rapides pour que notre appel soit vraiment utile.
                </h1>
                <p className="mt-5 text-lg sm:text-xl text-gray-200 font-medium max-w-xl mx-auto">
                  Ça prend moins d&apos;une minute. C&apos;est ce qui me permet de personnaliser l&apos;appel à ton projet et à ta situation, au lieu de te débiter un discours générique.
                </p>
                <button
                  onClick={goNext}
                  className="mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-bold text-gray-950 transition-transform hover:scale-[1.03] active:scale-100"
                >
                  C&apos;est parti
                  <span aria-hidden>→</span>
                </button>
                <p className="mt-4 text-sm font-medium text-gray-400">
                  Appuie sur Entrée pour commencer
                </p>
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
                      const selected = answers[question.id] === opt.value;
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
            {step === CONTACT_INDEX && (
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
                  Où je t&apos;envoie la suite ?
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
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
