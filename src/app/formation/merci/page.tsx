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
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderInfo | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then(setOrder)
      .catch(() => {});
  }, [sessionId]);

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
        {order.amount !== null && (
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

export default function FormationMerciPage() {
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
                Ton accès est{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500">
                  confirmé.
                </span>
              </h1>

              <p className="mt-4 text-base text-gray-300">
                Tu vas recevoir <strong className="text-white">2 emails</strong>{" "}
                dans les prochaines minutes.
              </p>

              <Suspense fallback={null}>
                <OrderSummary />
              </Suspense>

              <motion.div
                className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-left space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 text-sm font-bold">
                      1
                    </span>
                    <h3 className="font-semibold text-white">
                      Invitation Skool
                    </h3>
                  </div>
                  <p className="text-gray-300 ml-9">
                    Objet :{" "}
                    <span className="text-white font-medium">
                      &quot;Jeremy Pitault invited you to join APP MASTERY&quot;
                    </span>
                  </p>
                  <p className="text-gray-300 ml-9 mt-1">
                    Ce mail contient ton lien unique pour accéder à la
                    formation. C&apos;est un lien à usage unique, ne le partage
                    pas. Une fois utilisé, il ne fonctionnera plus.
                  </p>
                </div>

                <div className="border-t border-white/10" />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 text-sm font-bold">
                      2
                    </span>
                    <h3 className="font-semibold text-white">
                      Confirmation de commande
                    </h3>
                  </div>
                  <p className="text-gray-300 ml-9">
                    Objet :{" "}
                    <span className="text-white font-medium">
                      &quot;Bienvenue dans App Mastery&quot;
                    </span>
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-amber-200 font-semibold text-sm">
                  ⚠️ Pense à vérifier tes spams et ton onglet
                  &quot;Promotions&quot; si tu ne vois pas ces emails.
                </p>
              </motion.div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-gray-400 text-sm mb-3">
                  Un problème ? Contacte-moi directement :
                </p>
                <a
                  href="https://wa.me/33756823921?text=Salut%20Jeremy%20!%20Je%20viens%20de%20rejoindre%20App%20Mastery%20et%20j%27ai%20une%20question."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  M&apos;écrire sur WhatsApp
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
