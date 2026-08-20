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
import ThemeToggle from "@/components/ThemeToggle";

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
      // Même event_id côté Pixel (navigateur) et CAPI (serveur) : Meta déduplique.
      const metaEventId = generateEventId();

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
                  ...metaTrackingFields(metaEventId),
                }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      trackMeta("Lead", { content_name: "plan-action", value: 1, currency: "EUR" }, metaEventId);

      // Mémorise le contact pour sauter l'étape contact de la candidature /appel.
      saveOptinContact({
        firstName: firstName.trim(),
        email: email.trim().toLowerCase(),
        phone: formatPhone(phone),
      });

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
    <div className="min-h-screen text-[var(--fg)] antialiased">
      {/* Decorative background glows */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 45% at 78% -5%, var(--accent-glow), transparent 62%), radial-gradient(50% 40% at 8% 6%, color-mix(in srgb, var(--green) 12%, transparent), transparent 60%)",
        }}
      />

      {/* Subtle theme toggle (preference, not a CTA) */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen flex-col justify-center px-4 py-10 sm:py-16">
        <section className="w-full max-w-[1120px] mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-[22px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
            style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 60% at 80% 0%, var(--accent-glow), transparent 60%)",
              }}
            />

            {/* Top row: eyebrow + price */}
            <div className="relative flex items-center gap-4 flex-wrap px-6 sm:px-10 pt-6 sm:pt-8">
              <span className="mac-eyebrow">Étude de cas offerte</span>
              <div className="ml-auto flex items-center gap-2.5">
                <span className="text-[var(--fg3)] line-through text-[15px] font-medium">
                  197€
                </span>
                <span className="badge badge-success">Gratuit</span>
              </div>
            </div>

            <div className="relative grid lg:grid-cols-2 gap-2 px-6 sm:px-10 pb-8 pt-4">
              {/* Left: form */}
              <div>
                <motion.h1
                  className="mac-h1 mt-1.5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  La méthode à copier-coller qui a fait passer l&apos;app Shinobi{" "}
                  <span className="mac-accent">de 0 à 140K$/an</span>
                </motion.h1>

                <motion.form
                  onSubmit={handleSubmit}
                  className="mt-7"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                >
                  <div className="flex flex-col gap-2.5 max-w-md">
                    <input
                      type="text"
                      required
                      placeholder="Ton prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mac-field"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Ton adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mac-field"
                    />
                    <div className="flex gap-2">
                      <select
                        value={countryIndex}
                        onChange={(e) => setCountryIndex(Number(e.target.value))}
                        className="mac-field shrink-0 appearance-none text-center"
                        style={{ width: "6.5rem" }}
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
                        className="mac-field flex-1 min-w-0"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="mac-btn mac-btn-primary w-full mt-0.5"
                    >
                      {loading ? "..." : "Recevoir le Plan d'Action"}
                    </button>
                  </div>
                  {error && (
                    <p className="mt-3 text-sm font-medium text-[var(--red)]">{error}</p>
                  )}
                  <p className="mt-4 flex items-center gap-2 text-[13px] font-medium text-[var(--fg3)]">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Gratuit. Pas de spam. Désabonnement en un clic.
                  </p>
                </motion.form>

                {/* Mobile ARR chart */}
                <motion.div
                  className="mt-7 lg:hidden rounded-[14px] overflow-hidden border-[0.5px] border-[var(--sep)]"
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
                        className="w-8 h-8 rounded-full border-2 border-[var(--bg)] overflow-hidden"
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
                    <div className="w-8 h-8 rounded-full bg-[var(--field)] border-2 border-[var(--bg)] flex items-center justify-center text-sm font-semibold text-[var(--fg)]">
                      +
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[var(--fg2)]">
                    Ils ont déjà lancé leur app
                  </span>
                </motion.div>
              </div>

              {/* Right: proof + checklist */}
              <motion.div
                className="relative hidden lg:block pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="rounded-[14px] overflow-hidden border-[0.5px] border-[var(--sep)] mb-4">
                  <Image
                    src="/proof/arr-chart.png"
                    alt="Revenus Shinobi Japanese : de 0 à 140K$/an"
                    width={1232}
                    height={700}
                    className="w-full h-auto"
                    quality={90}
                  />
                </div>

                <p className="mac-grouplabel">Ce que tu vas apprendre dans la vidéo</p>
                <motion.div
                  className="mac-group"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.05, delayChildren: 0.45 } },
                  }}
                >
                  {[
                    "Pourquoi les apps mobiles sont la meilleure opportunité en 2026, pas les SaaS",
                    "Ma méthode pour trouver et valider une idée de niche rentable",
                    "Comment créer une app complète avec l'IA, sans savoir coder",
                    "Les secrets d'un onboarding et d'un paywall qui convertissent",
                    "La stratégie de contenu viral qui a généré des millions de vues",
                    "Le plan d'action complet en 28 jours, de l'idée à la publication",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="mac-row items-start"
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                      }}
                    >
                      <span className="mac-chk mt-0.5">
                        <svg fill="none" stroke="currentColor" strokeWidth={4} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      <span className="mac-t leading-snug">{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom credit */}
          <motion.p
            className="mt-8 text-center text-sm font-medium text-[var(--fg3)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Par Jeremy, créateur de Shinobi Japanese
          </motion.p>
        </section>
      </div>
      <AdDisclaimer />
    </div>
  );
}
