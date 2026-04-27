"use client";

import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const CALENDLY_BASE = "https://calendly.com/jeremypltpro/30min";

export default function ReserverPage() {
  return (
    <Suspense>
      <ReserverContent />
    </Suspense>
  );
}

function ReserverContent() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get("firstName") || "";
  const email = searchParams.get("email") || "";

  useEffect(() => {
    posthog.capture("appel_calendly_loaded", {
      has_prefill: Boolean(firstName && email),
    });
  }, [firstName, email]);

  const calendlyUrl = (() => {
    const params = new URLSearchParams({ hide_gdpr_banner: "1" });
    if (firstName) params.set("name", firstName);
    if (email) params.set("email", email);
    return `${CALENDLY_BASE}?${params.toString()}`;
  })();

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="flex min-h-screen flex-col items-center px-4 py-12 sm:py-16">
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-medium tracking-tighter text-white text-balance">
              {firstName ? `Bien reçu ${firstName}.` : "Bien reçu."} Dernière étape : choisis ton créneau.
            </h1>

            <p className="mt-4 text-lg text-gray-200 font-medium max-w-2xl mx-auto">
              Sélectionne un horaire qui te convient ci-dessous. On se voit en visio pendant 30 minutes pour faire le point sur ton projet et voir ensemble si on peut travailler ensemble.
            </p>
          </div>

          {/* Reminder card */}
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
              Pour que l&apos;appel soit utile, prépare-toi un minimum :
            </h2>
            <ul className="space-y-3 text-base text-white">
              {[
                "Sois au calme, avec une bonne connexion. Pas en voiture, pas dans le métro.",
                "Aie ton idée d'app en tête, ainsi qu'une vision claire de ce que tu veux accomplir.",
                "Viens avec tes questions concrètes sur la formation ou l'accompagnement.",
                "Si tu sais déjà que tu n'as pas de budget à investir, annule maintenant. Pas de jugement.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={4} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-gray-100 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Calendly embed */}
          <div className="mt-8 rounded-xl overflow-hidden border border-white/10 bg-white">
            <iframe
              src={calendlyUrl}
              width="100%"
              height="780"
              frameBorder="0"
              title="Réserver un appel découverte"
              className="w-full"
            />
          </div>

          <p className="mt-6 text-center text-sm text-gray-300 font-medium">
            Tu recevras une confirmation par email avec le lien de visio dès que ton créneau est validé.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
