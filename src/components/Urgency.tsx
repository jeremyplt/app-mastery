"use client";

import { motion } from "framer-motion";
import { CountdownTimerLarge, useIsExpired } from "./CountdownTimer";
import ClosedBanner from "./ClosedBanner";

export default function Urgency() {
  const expired = useIsExpired();

  if (expired) return null;

  void ClosedBanner;

  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-[20px] overflow-hidden border-[0.5px]"
          style={{ borderColor: "color-mix(in srgb, var(--red) 35%, transparent)" }}
        >
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 70% at 50% 0%, color-mix(in srgb, var(--red) 14%, transparent), transparent 60%), var(--card)",
            }}
          />

          <div className="relative px-6 py-16 sm:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Pulsing dot + label */}
              <div className="flex justify-center mb-6">
                <div
                  className="inline-flex items-center gap-2 rounded-[8px] px-4 py-2"
                  style={{ background: "color-mix(in srgb, var(--red) 15%, transparent)" }}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: "var(--red)" }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2.5 w-2.5"
                      style={{ background: "var(--red)" }}
                    />
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--red)" }}>
                    Fermeture imminente
                  </span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem]/10 font-bold tracking-[-0.03em] text-balance text-[var(--fg)] mb-4">
                Les inscriptions ferment dans :
              </h2>

              {/* Big countdown */}
              <div className="mb-10">
                <CountdownTimerLarge />
              </div>

              <div className="max-w-xl mx-auto space-y-6">
                <p className="text-lg text-[var(--fg)] font-medium leading-relaxed">
                  Ce n&apos;est pas un faux compte à rebours. Ce n&apos;est pas un piège marketing. Quand le timer arrive à zéro, <span className="font-bold">je ferme les inscriptions et je refuse les paiements</span>.
                </p>
                <p className="text-lg text-[var(--fg2)] font-medium leading-relaxed">
                  Pourquoi ? Parce que je veux accompagner chaque élève personnellement. Si j&apos;accepte trop de monde, la qualité baisse. Et ça, c&apos;est hors de question.
                </p>
                <p className="text-lg text-[var(--fg2)] font-medium leading-relaxed">
                  Si tu reviens dans 2 semaines en disant &quot;je suis prêt&quot;, la réponse sera non. Pas par méchanceté, mais parce que les portes seront fermées. Je ne sais pas quand je rouvrirai.
                </p>
                <p className="text-xl font-bold" style={{ color: "var(--accent2)" }}>
                  Tu es soit dedans, soit dehors. Et c&apos;est maintenant que ça se décide.
                </p>
              </div>

              {/* CTA */}
              <a
                href="#pricing"
                className="btn-primary mt-10"
                data-ph-capture-attribute-section="urgency-cta"
              >
                Rejoindre avant la fermeture
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
