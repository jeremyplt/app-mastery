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

export default function MembresMerciPage() {
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
            Merci pour ton <span className="mac-accent">achat !</span>
          </h1>

          <p className="mt-4 text-[16px] text-[var(--fg2)] leading-relaxed">
            Ton accès à App Mastery est confirmé. Tu vas recevoir un email de
            confirmation dans les prochaines minutes.
          </p>

          <p className="mt-2 text-[16px] text-[var(--fg2)] leading-relaxed">
            Pour accéder à tes cours, connecte-toi avec l&apos;email que tu as
            utilisé lors de ton achat.
          </p>

          <Suspense fallback={null}>
            <OrderSummary />
          </Suspense>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <a href="/membres" className="mac-btn mac-btn-primary mac-btn-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Accéder à mes cours
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
