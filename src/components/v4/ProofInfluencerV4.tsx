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

export default function ProofInfluencerV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-violet-400">
            Influenceurs
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
            On t&apos;apprend a{" "}
            <span className="relative inline-block">
              trouver, negocier et closer
              <SketchUnderline className="absolute top-full left-0 w-full text-violet-400 -mt-1" />
            </span>{" "}
            les influenceurs comme un pro
          </h2>
          <p className="mt-6 text-base text-gray-400 max-w-xl">
            Pas besoin de budget pub massif. On te montre comment identifier les
            bons createurs, les contacter avec le bon message, negocier des
            deals rentables et les transformer en vrais partenaires de
            croissance pour ton app.
          </p>
        </div>

        <motion.div
          className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-violet-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative rounded-xl bg-white/5 p-6 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                  Vraie conversation avec un influenceur
                </span>
              </div>

              <Image
                src="/proof/influencer-dm-v2.png"
                alt="Conversation DM avec un influenceur acceptant une collaboration"
                width={1500}
                height={800}
                className="w-full h-auto rounded-lg"
                quality={90}
              />

              <motion.p
                className="mt-4 text-sm text-violet-400 font-medium italic"
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

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
