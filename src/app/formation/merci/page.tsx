"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

interface OrderInfo {
  email: string | null;
  plan: string;
  planKey: string;
  amount: number | null;
  currency: string;
}

function OrderSummary() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const rawPaypalOrderId = searchParams.get("paypal_order_id");
  // PayPal redirects with ?paypal_order_id=pending&token=REAL_ORDER_ID
  const paypalOrderId =
    rawPaypalOrderId && rawPaypalOrderId !== "pending"
      ? rawPaypalOrderId
      : searchParams.get("token");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      // For PayPal: capture the order first, then fetch session info
      if (paypalOrderId && paypalOrderId !== "sub") {
        try {
          await fetch("/api/checkout/paypal-capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: paypalOrderId }),
          });
        } catch {}
      }

      const param = paypalOrderId
        ? `paypal_order_id=${paypalOrderId}`
        : orderId
          ? `order_id=${orderId}`
          : sessionId
            ? `session_id=${sessionId}`
            : null;
      if (!param) {
        setLoading(false);
        return;
      }

      try {
        const r = await fetch(`/api/checkout/session?${param}`);
        const data = await r.json();
        setOrder(data);
      } catch {}
      setLoading(false);
    }
    loadOrder();
  }, [orderId, sessionId, paypalOrderId]);

  if (loading) {
    return (
      <motion.div
        className="mt-8 rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-6 text-left"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-[17px] font-semibold text-[var(--fg)] mb-4">
          Résumé de ta commande
        </h2>
        <div className="space-y-3 animate-pulse">
          <div className="flex justify-between">
            <div className="h-5 w-16 rounded bg-[var(--field)]" />
            <div className="h-5 w-32 rounded bg-[var(--field)]" />
          </div>
          <div className="flex justify-between">
            <div className="h-5 w-16 rounded bg-[var(--field)]" />
            <div className="h-5 w-48 rounded bg-[var(--field)]" />
          </div>
          <div className="flex justify-between">
            <div className="h-5 w-20 rounded bg-[var(--field)]" />
            <div className="h-5 w-20 rounded bg-[var(--field)]" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!order) return null;

  return (
    <motion.div
      className="mt-8 rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-6 text-left"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-[17px] font-semibold text-[var(--fg)] mb-4">
        Résumé de ta commande
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-[var(--fg2)]">Plan</span>
          <span className="font-semibold text-[var(--accent2)]">
            App Mastery {order.plan}
          </span>
        </div>
        {order.email && (
          <div className="flex justify-between">
            <span className="text-[var(--fg2)]">Email</span>
            <span className="text-[var(--fg)]">{order.email}</span>
          </div>
        )}
        {order.amount != null && (
          <div className="flex justify-between">
            <span className="text-[var(--fg2)]">Montant</span>
            <span className="text-[var(--fg)]">
              {order.amount.toLocaleString("fr-FR")}
              {order.currency === "EUR" ? "€" : ` ${order.currency}`}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function FormationMerciPage() {
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

      <div className="max-w-[720px] mx-auto px-4 py-6 sm:py-8">
        {/* Nav (new customer: point them to their courses) */}
        <nav className="mac-nav mb-10">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight text-[var(--fg)]">
            <span
              className="grid place-items-center w-7 h-7 rounded-lg text-[12px] font-extrabold tracking-tight text-[var(--accent)] border-[0.5px] border-white/10"
              style={{ background: "linear-gradient(150deg, #2b2b2e, #000)" }}
            >
              AM
            </span>
            App Mastery
          </Link>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link href="/membres" className="mac-btn mac-btn-primary mac-btn-sm">
              Mes cours
            </Link>
          </div>
        </nav>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mac-eyebrow">Bienvenue</span>

          <h1 className="mt-3 text-[28px] sm:text-[36px] font-bold tracking-[-0.035em] text-[var(--fg)]">
            Ton accès est <span className="mac-accent">confirmé.</span>
          </h1>

          <p className="mt-4 text-[16px] text-[var(--fg2)] leading-relaxed">
            Tu vas recevoir <strong className="text-[var(--fg)]">2 emails</strong>{" "}
            dans les prochaines minutes.
          </p>

          <Suspense fallback={null}>
            <OrderSummary />
          </Suspense>

          <motion.div
            className="mt-8 rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-6 text-left space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="mac-icon g-blue text-[13px] font-bold">1</span>
                <h3 className="font-semibold text-[var(--fg)]">
                  Invitation Skool
                </h3>
              </div>
              <p className="text-[var(--fg2)] ml-[40px]">
                Objet :{" "}
                <span className="text-[var(--fg)] font-medium">
                  &quot;Jeremy Pitault invited you to join APP MASTERY&quot;
                </span>
              </p>
              <p className="text-[var(--fg2)] ml-[40px] mt-1">
                Ce mail contient ton lien unique pour accéder à la formation.
                C&apos;est un lien à usage unique, ne le partage pas. Une fois
                utilisé, il ne fonctionnera plus.
              </p>
            </div>

            <div className="border-t-[0.5px] border-[var(--sep)]" />

            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="mac-icon g-blue text-[13px] font-bold">2</span>
                <h3 className="font-semibold text-[var(--fg)]">
                  Confirmation de commande
                </h3>
              </div>
              <p className="text-[var(--fg2)] ml-[40px]">
                Objet :{" "}
                <span className="text-[var(--fg)] font-medium">
                  &quot;Bienvenue dans App Mastery&quot;
                </span>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 rounded-[14px] border-[0.5px] px-5 py-4 text-left"
            style={{
              borderColor: "color-mix(in srgb, var(--orange) 30%, transparent)",
              background: "color-mix(in srgb, var(--orange) 10%, transparent)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-[var(--orange)] font-semibold text-[14px]">
              ⚠️ Pense à vérifier tes spams et ton onglet &quot;Promotions&quot;
              si tu ne vois pas ces emails.
            </p>
          </motion.div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-[var(--fg2)] text-[14px] mb-3">
              Un problème ? Contacte-moi directement :
            </p>
            <a
              href="https://wa.me/33756823921?text=Salut%20Jeremy%20!%20Je%20viens%20de%20rejoindre%20App%20Mastery%20et%20j%27ai%20une%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="mac-btn text-[var(--accent-fg)]"
              style={{
                background: "linear-gradient(160deg, #40d868, #24a83f)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 6px 18px color-mix(in srgb, var(--green) 40%, transparent)",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              M&apos;écrire sur WhatsApp
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
