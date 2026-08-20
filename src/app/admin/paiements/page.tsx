"use client";

import { useEffect, useState } from "react";

type Provider = "stripe" | "lemonsqueezy" | "gumroad" | "paypal";

const PROVIDERS: { id: Provider; label: string; description: string; color: string }[] = [
  {
    id: "stripe",
    label: "Stripe",
    description: "Paiement par carte bancaire via Stripe. Compte entreprise LLC.",
    color: "bg-indigo-500",
  },
  {
    id: "lemonsqueezy",
    label: "Lemon Squeezy",
    description: "Merchant of Record. Gère la TVA automatiquement.",
    color: "bg-yellow-500",
  },
  {
    id: "gumroad",
    label: "Gumroad",
    description: "Backup. Redirige vers les pages produit Gumroad.",
    color: "bg-pink-500",
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "Paiement via PayPal Business. Supporte les paiements uniques et en 3x.",
    color: "bg-blue-500",
  },
];

export default function PaymentsAdmin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [active, setActive] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        // Page réservée au propriétaire : les membres invités n'ont accès
        // qu'au CRM et aux candidatures.
        if (d.role === "owner") {
          setAuthorized(true);
        } else if (d.admin) {
          window.location.href = "/admin/crm";
        } else {
          window.location.href = "/membres";
        }
      })
      .catch(() => {
        window.location.href = "/membres";
      });
  }, []);

  // Load active provider after auth
  useEffect(() => {
    if (!authorized) return;
    fetch("/api/admin/payment-provider")
      .then((r) => r.json())
      .then((data) => {
        if (data.active) setActive(data.active);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger le provider actif");
        setLoading(false);
      });
  }, [authorized]);

  async function switchProvider(provider: Provider) {
    if (provider === active) return;

    setSwitching(provider);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/payment-provider", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors du changement");
        return;
      }

      setActive(data.active);
      setSuccess(`Paiement actif : ${PROVIDERS.find((p) => p.id === data.active)?.label}`);
    } catch {
      setError("Erreur réseau");
    } finally {
      setSwitching(null);
    }
  }

  if (authorized === null || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-[var(--fg)] text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Mode de paiement</h1>
        <p className="text-[var(--fg)]/60 mb-8">
          Change le provider de paiement actif. Le changement est instantané.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-[var(--red)] font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-[var(--green)] font-medium">
            {success}
          </div>
        )}

        <div className="space-y-4">
          {PROVIDERS.map((provider) => {
            const isActive = active === provider.id;
            const isSwitching = switching === provider.id;

            return (
              <div
                key={provider.id}
                className={`relative rounded-2xl p-6 border-2 transition-[border-color,background-color,transform] duration-150 ${
                  isActive
                    ? "border-[var(--accent)] bg-[var(--accent)]/5"
                    : "border-[var(--sep)] bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${provider.color}`} />
                      <h2 className="text-xl font-semibold">{provider.label}</h2>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent2)] text-xs font-bold uppercase tracking-wider">
                          Actif
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--fg)]/60">{provider.description}</p>
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => switchProvider(provider.id)}
                      disabled={isSwitching}
                      className="shrink-0 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSwitching ? "Changement..." : "Activer"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-[var(--sep)]">
          <h3 className="text-lg font-semibold mb-3">Variables requises par provider</h3>
          <div className="space-y-4 text-sm font-mono">
            <div>
              <p className="text-indigo-400 font-bold mb-1">Stripe</p>
              <p className="text-[var(--fg)]/50">STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET</p>
              <p className="text-[var(--fg)]/50">STRIPE_PRICE_ESSENTIEL, STRIPE_PRICE_COMPLET, STRIPE_PRICE_COMPLET_3X</p>
              <p className="text-[var(--fg)]/50">STRIPE_PRICE_VIP, STRIPE_PRICE_VIP_3X</p>
            </div>
            <div>
              <p className="text-yellow-400 font-bold mb-1">Lemon Squeezy</p>
              <p className="text-[var(--fg)]/50">LS_API_KEY, LS_STORE_ID, LS_WEBHOOK_SECRET</p>
              <p className="text-[var(--fg)]/50">LS_VARIANT_ESSENTIEL, LS_VARIANT_COMPLET, LS_VARIANT_COMPLET_3X</p>
              <p className="text-[var(--fg)]/50">LS_VARIANT_VIP, LS_VARIANT_VIP_3X</p>
            </div>
            <div>
              <p className="text-pink-400 font-bold mb-1">Gumroad</p>
              <p className="text-[var(--fg)]/50">GUMROAD_URL_ESSENTIEL, GUMROAD_URL_COMPLET, GUMROAD_URL_COMPLET_3X</p>
              <p className="text-[var(--fg)]/50">GUMROAD_URL_VIP, GUMROAD_URL_VIP_3X</p>
            </div>
            <div>
              <p className="text-blue-400 font-bold mb-1">PayPal</p>
              <p className="text-[var(--fg)]/50">PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID</p>
              <p className="text-[var(--fg)]/50">PAYPAL_MODE (sandbox ou live)</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-[var(--fg)]/40 text-sm">
          Les webhooks fonctionnent en parallèle. Chaque provider a sa propre URL de webhook.
          Seul le checkout (bouton d&apos;achat) est affecté par ce réglage.
        </div>
      </div>
    </div>
  );
}
