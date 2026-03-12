"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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
  const [order, setOrder] = useState<OrderInfo | null>(null);

  useEffect(() => {
    const param = orderId
      ? `order_id=${orderId}`
      : sessionId
        ? `session_id=${sessionId}`
        : null;
    if (!param) return;
    fetch(`/api/checkout/session?${param}`)
      .then((r) => r.json())
      .then(setOrder)
      .catch(() => {});
  }, [orderId, sessionId]);

  if (!order) return null;

  return (
    <motion.div
      className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-left"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-semibold text-white mb-4">
        Résumé de ta commande
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Plan</span>
          <span className="font-semibold text-sky-400">
            App Mastery {order.plan}
          </span>
        </div>
        {order.email && (
          <div className="flex justify-between">
            <span className="text-gray-400">Email</span>
            <span className="text-white">{order.email}</span>
          </div>
        )}
        {order.amount != null && (
          <div className="flex justify-between">
            <span className="text-gray-400">Montant</span>
            <span className="text-white">
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
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div
        className="grid min-h-screen grid-cols-[1fr_minmax(0,80rem)_1fr]"
        style={{ "--gutter": "2.5rem" } as React.CSSProperties}
      >
        <div
          className="border-r border-white/10 bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />

        <div className="flex min-h-screen flex-col justify-center min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-mono text-sm font-semibold tracking-widest uppercase text-sky-400">
                Bienvenue
              </span>

              <h1 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tighter text-white">
                Merci pour ton{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500">
                  achat !
                </span>
              </h1>

              <p className="mt-4 text-base text-gray-300">
                Ton accès à App Mastery est confirmé. Tu vas recevoir un email
                de confirmation dans les prochaines minutes.
              </p>

              <p className="mt-2 text-base text-gray-300">
                Pour accéder à tes cours, connecte-toi avec l&apos;email que tu
                as utilisé lors de ton achat.
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
                <a
                  href="/membres"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
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

        <div
          className="border-l border-white/10 bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>
    </div>
  );
}
