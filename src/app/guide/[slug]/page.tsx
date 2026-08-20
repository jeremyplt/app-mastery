"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getGuide } from "@/lib/guides";
import { notFound } from "next/navigation";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { COUNTRY_CODES, detectCountry } from "@/lib/phone-countries";
import { looksLikeFakePattern } from "@/lib/phone-validation";
import posthog from "posthog-js";
import { generateEventId, metaTrackingFields, trackMeta } from "@/lib/meta-pixel";
import { saveOptinContact } from "@/lib/optin-contact";
import ThemeToggle from "@/components/ThemeToggle";

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
          listId: guide?.brevoListId,
          source: slug,
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

      trackMeta("Lead", { content_name: slug, value: 1, currency: "EUR" }, metaEventId);

      // Mémorise le contact pour sauter l'étape contact de la candidature /appel.
      saveOptinContact({
        firstName: firstName.trim(),
        email: email.trim().toLowerCase(),
        phone: formatPhone(phone),
      });

      posthog.capture("guide_optin_submitted", {
        guide: slug,
        utm_source: searchParams.get("utm_source") || undefined,
        utm_medium: searchParams.get("utm_medium") || undefined,
        utm_campaign: searchParams.get("utm_campaign") || undefined,
      });

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

            <div className="relative flex items-center gap-4 px-6 sm:px-10 pt-6 sm:pt-8">
              <span className="badge badge-success">Gratuit</span>
            </div>

            <div className="relative grid lg:grid-cols-2 gap-2 px-6 sm:px-10 pb-8 pt-4">
              {/* Left: content + form */}
              <div>
                <motion.h1
                  className="mac-h1 mt-1.5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {guide.title}{" "}
                  <span className="mac-accent">{guide.highlight}</span>
                </motion.h1>

                <motion.p
                  className="mt-5 text-[16px] leading-relaxed text-[var(--fg2)] max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  {guide.subtitle}
                </motion.p>

                <motion.ul
                  className="mt-5 space-y-2.5 text-[15px] text-[var(--fg2)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                >
                  {guide.bullets.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className="mac-chk shrink-0" style={{ width: 20, height: 20 }}>
                        <svg fill="none" stroke="currentColor" strokeWidth={4} viewBox="0 0 24 24" style={{ width: 11, height: 11 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </motion.ul>

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
                      {loading ? "..." : guide.ctaText}
                    </button>
                  </div>
                  {error && (
                    <p className="mt-3 text-sm font-medium text-[var(--red)]">{error}</p>
                  )}
                  <p className="mt-4 text-[13px] font-medium text-[var(--fg3)]">
                    Gratuit. Pas de spam. Désabonnement en un clic.
                  </p>
                </motion.form>
              </div>

              {/* Right: locked document preview (desktop) */}
              <div className="hidden lg:flex items-center justify-center p-6">
                <motion.div
                  className="relative w-full max-w-[380px] aspect-[3/4] rounded-[14px] overflow-hidden border-[0.5px] border-[var(--sep)] shadow-2xl shadow-black/40"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <img
                    src="/proof/guide-preview.jpg"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-top select-none"
                    style={{ filter: "blur(2px)" }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[color-mix(in_srgb,var(--bg)_55%,transparent)] backdrop-blur-[1px]">
                    <div className="mac-icon lg g-blue" style={{ width: 56, height: 56, borderRadius: 16 }}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[var(--fg)]">
                      Entre ton prénom et email pour débloquer
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

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
    </div>
  );
}
