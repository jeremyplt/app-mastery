"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdDisclaimer from "@/components/AdDisclaimer";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { COUNTRY_CODES, detectCountry } from "@/lib/phone-countries";
import { looksLikeFakePattern } from "@/lib/phone-validation";
import { QUESTIONS, isValidAnswer } from "@/lib/candidature";
import { generateEventId, metaTrackingFields, trackMeta } from "@/lib/meta-pixel";
import { loadOptinContact } from "@/lib/optin-contact";
import ThemeToggle from "@/components/ThemeToggle";

// macOS selectable option (choice / rescue buttons)
const CHOICE_BASE =
  "w-full text-left rounded-[12px] border-[0.5px] px-5 py-4 text-[16px] font-semibold transition-[background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99]";
function choiceCls(selected: boolean) {
  return selected
    ? `${CHOICE_BASE} border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--fg)]`
    : `${CHOICE_BASE} border-[var(--field-brd)] bg-[var(--field)] text-[var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_7%,transparent)]`;
}

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
  // Contact déjà capturé à l'optin (VSL, plan d'action, guide) : on saute
  // l'étape contact et on soumet directement après la dernière question.
  // Repasse à false si la validation échoue, pour afficher le formulaire.
  const [skipContactStep, setSkipContactStep] = useState(false);
  const autoSubmitAttemptedRef = useRef(false);
  // Déjà passé par un optin : le Lead Meta a déjà été envoyé à ce moment-là,
  // la candidature n'enverra que SubmitApplication (sinon double comptage).
  const hadOptinRef = useRef(false);

  useEffect(() => {
    const detected = detectCountry();
    const idx = COUNTRY_CODES.findIndex((c) => c.country === detected);
    if (idx !== -1) setCountryIndex(idx);
  }, []);

  useEffect(() => {
    const contact = loadOptinContact();
    if (contact) {
      setFirstName(contact.firstName);
      setEmail(contact.email);
      setPhone(contact.phone);
      setSkipContactStep(true);
      hadOptinRef.current = true;
    }
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

  // Soumission automatique à l'arrivée sur l'étape contact quand le contact
  // vient de l'optin : le prospect ne re-saisit rien. Une seule tentative,
  // ensuite le formulaire s'affiche en cas d'échec (skipContactStep repasse
  // à false dans failValidation / le catch de submit).
  useEffect(() => {
    if (
      step === CONTACT_INDEX &&
      skipContactStep &&
      !rescue &&
      !autoSubmitAttemptedRef.current
    ) {
      autoSubmitAttemptedRef.current = true;
      posthog.capture("candidature_contact_skipped");
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, skipContactStep, rescue]);

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
  // Affiche aussi le formulaire contact si on était en soumission automatique.
  function failValidation(reason: string, message: string) {
    posthog.capture("candidature_error", { reason });
    setSkipContactStep(false);
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
          // Lead déjà envoyé à l'optin : la candidature n'émet que SubmitApplication.
          includeLead: !hadOptinRef.current,
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

      if (!hadOptinRef.current) {
        trackMeta("Lead", { content_name: "candidature", value: 1, currency: "EUR" }, metaEventId);
      }
      trackMeta("SubmitApplication", { content_name: "candidature" }, `${metaEventId}-sa`);

      posthog.capture("candidature_submitted", {
        qualified: data.qualified,
        budget_ready: budgetReady,
        utm_source: searchParams.get("utm_source") || undefined,
      });

      window.location.href = data.redirectUrl;
    } catch (err) {
      posthog.capture("candidature_error", { reason: "server" });
      // Échec en soumission automatique : on montre le formulaire pour correction.
      setSkipContactStep(false);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 40% at 50% -6%, var(--accent-glow), transparent 62%)",
        }}
      />

      {/* Barre de progression */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--sep)] z-50">
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(90deg, var(--accent2), var(--accent))" }}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>

      {/* Theme toggle (preference, not a CTA) */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
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
                <h1 className="mac-h1 text-[32px] sm:text-[46px]">
                  Quelques questions rapides pour que notre appel soit vraiment utile.
                </h1>
                <p className="mt-5 text-[17px] sm:text-[19px] text-[var(--fg2)] font-medium max-w-xl mx-auto leading-relaxed">
                  Ça prend moins d&apos;une minute. C&apos;est ce qui me permet de personnaliser l&apos;appel à ton projet et à ta situation.
                </p>
                <button onClick={goNext} className="mac-btn mac-btn-primary mac-btn-lg mt-9">
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
                <p className="text-[13px] font-semibold text-[var(--accent2)]">
                  Question {step} / {QUESTIONS.length}
                </p>
                <h2 className="mt-3 text-[24px] sm:text-[36px] font-bold tracking-[-0.03em] text-balance">
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
                          className={choiceCls(selected)}
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
                              className="block text-[14px] font-semibold text-[var(--accent2)]"
                            >
                              Dis-moi en quelques mots
                            </label>
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
                              className="mac-field mt-2 text-[16px]"
                            />
                          </div>
                          <button
                            onClick={() => {
                              if (!isValidAnswer(question, answers[question.id] || "")) {
                                setError("Précise en quelques mots.");
                                return;
                              }
                              goNext();
                            }}
                            className="mac-btn mac-btn-primary mt-5"
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
                      className="mac-field text-[16px] resize-none"
                    />
                    <button
                      onClick={() => {
                        if (!isValidAnswer(question, answers[question.id] || "")) {
                          setError("Écris quelques mots, ça m'aide vraiment.");
                          return;
                        }
                        goNext();
                      }}
                      className="mac-btn mac-btn-primary mt-5"
                    >
                      Continuer <span aria-hidden>→</span>
                    </button>
                  </div>
                )}

                {error && (
                  <p className="mt-5 text-[15px] font-semibold text-[var(--red)]">{error}</p>
                )}

                <button
                  onClick={goBack}
                  className="mt-8 text-[13px] font-semibold text-[var(--fg3)] hover:text-[var(--fg)] transition-colors"
                >
                  ← Retour
                </button>
              </motion.div>
            )}

            {/* CONTACT auto-soumis : le prospect vient d'un optin, on a déjà
                ses coordonnées. Simple écran d'attente pendant l'envoi. */}
            {step === CONTACT_INDEX && !rescue && skipContactStep && (
              <motion.div
                key="contact-auto"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <h2 className="text-[24px] sm:text-[36px] font-bold tracking-[-0.03em] text-balance">
                  Envoi de ta candidature...
                </h2>
                <p className="mt-4 text-[17px] text-[var(--fg2)] font-medium">
                  Un instant{firstName ? ` ${firstName}` : ""}, on prépare la suite.
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[var(--accent)] border-t-transparent" />
                </div>
              </motion.div>
            )}

            {/* CONTACT */}
            {step === CONTACT_INDEX && !rescue && !skipContactStep && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-[13px] font-semibold text-[var(--accent2)]">
                  Dernière étape
                </p>
                <h2 className="mt-3 text-[24px] sm:text-[36px] font-bold tracking-[-0.03em] text-balance">
                  Où est-ce que je t&apos;envoie la suite ?
                </h2>
                <p className="mt-4 text-[17px] text-[var(--fg2)] font-medium leading-relaxed">
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
                    className="mac-field text-[16px]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ton email"
                    className="mac-field text-[16px]"
                  />
                  <div className="flex gap-3">
                    <select
                      value={countryIndex}
                      onChange={(e) => setCountryIndex(Number(e.target.value))}
                      className="mac-field shrink-0 appearance-none text-center text-[16px]"
                      style={{ width: "7rem" }}
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
                      className="mac-field min-w-0 flex-1 text-[16px]"
                    />
                  </div>
                </div>

                {error && (
                  <p className="mt-5 text-[15px] font-semibold text-[var(--red)]">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mac-btn mac-btn-primary mac-btn-lg w-full mt-7"
                >
                  {loading ? "Un instant..." : "Valider ma candidature"}
                </button>

                <button
                  onClick={goBack}
                  className="mt-8 text-[13px] font-semibold text-[var(--fg3)] hover:text-[var(--fg)] transition-colors"
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
                <h2 className="text-[24px] sm:text-[36px] font-bold tracking-[-0.03em] text-balance">
                  Une dernière chose.
                </h2>
                <p className="mt-4 text-[17px] sm:text-[19px] text-[var(--fg2)] font-medium leading-relaxed">
                  Est-ce que tu as un budget que tu peux allouer pour avancer sur ton projet et ta progression ?
                </p>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => submit("oui")}
                    disabled={loading}
                    className={`${choiceCls(false)} disabled:opacity-60`}
                  >
                    Oui, je peux investir pour avancer
                  </button>
                  <button
                    onClick={() => submit("non")}
                    disabled={loading}
                    className={`${choiceCls(false)} disabled:opacity-60`}
                  >
                    Non, pas pour le moment
                  </button>
                </div>

                {loading && (
                  <p className="mt-5 text-[15px] font-medium text-[var(--fg3)]">Un instant...</p>
                )}
                {error && (
                  <p className="mt-5 text-[15px] font-semibold text-[var(--red)]">{error}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AdDisclaimer />
    </div>
  );
}
