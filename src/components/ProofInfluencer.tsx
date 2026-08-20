"use client";

import { motion } from "framer-motion";
import Image from "next/image";

function SketchUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 5 8 C 30 3, 60 9, 100 5 C 140 1, 170 7, 195 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function ProofInfluencer() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="mac-eyebrow">Influenceurs</span>
          <div className="h-px flex-1 bg-[var(--sep)]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-[2.5rem]/10 font-bold tracking-[-0.035em] text-balance text-[var(--fg)]">
            On t&apos;apprend à{" "}
            <span className="relative inline-block">
              trouver, négocier et closer
              <SketchUnderline className="absolute top-full left-0 w-full text-[var(--accent2)] -mt-1" />
            </span>{" "}
            les influenceurs comme un pro
          </h2>
          <p className="mt-6 text-lg text-[var(--fg2)] max-w-xl leading-relaxed">
            Pas besoin de budget pub massif. On te montre comment identifier les
            bons créateurs, les contacter avec le bon message, négocier des
            deals rentables et les transformer en vrais partenaires de
            croissance pour ton app.
          </p>
        </div>

        <motion.div
          className="overflow-hidden rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative p-6 overflow-hidden">
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-[var(--accent2)] uppercase tracking-wider">
                  Vraie conversation avec un influenceur
                </span>
              </div>

              <Image
                src="/proof/influencer-dm-v2.png"
                alt="Conversation DM avec un influenceur acceptant une collaboration"
                width={1500}
                height={800}
                className="w-full h-auto rounded-lg hidden sm:block"
                quality={90}
              />
              <Image
                src="/proof/influencer-dm-mobile.png"
                alt="Conversation DM avec un influenceur acceptant une collaboration"
                width={750}
                height={1400}
                className="w-full h-auto rounded-lg sm:hidden"
                quality={90}
              />

              <motion.p
                className="mt-4 text-lg text-[var(--accent2)] font-medium italic"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                De la prise de contact au &ldquo;yes I am open to
                collaboration!&rdquo; en quelques messages
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--sep)]" />
    </section>
  );
}
