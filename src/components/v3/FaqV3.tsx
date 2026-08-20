"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";

const faqData = [
  { q: "Faut-il savoir coder ?", a: "Non ! La formation part de zero et utilise l'IA (Claude Code) pour generer le code. Tu apprends les concepts en meme temps que tu construis." },
  { q: "Combien de temps faut-il ?", a: "Le programme est concu pour 28 jours. Tu peux aller plus vite ou plus lentement selon ton rythme. L'acces est a vie." },
  { q: "Quels outils sont necessaires ?", a: "Un Mac est fortement recommande pour le dev iOS. Tous les outils utilises sont soit gratuits, soit inclus dans la formation." },
  { q: "L'acces est-il a vie ?", a: "Oui, tu as un acces illimite a la formation et toutes les mises a jour futures. Les nouveaux modules sont ajoutes regulierement." },
  { q: "Et si ca ne marche pas pour moi ?", a: "Tu as une garantie de 30 jours. Si tu suis le programme et n'obtiens pas de resultat, tu es rembourse integralement." },
  { q: "Quelle est la difference avec des tutos gratuits ?", a: "Un parcours structure de A a Z vs des fragments eparpilles. Ici tu as une methode complete, du support, et une communaute pour t'accompagner." },
  { q: "Ca marche pour iOS ET Android ?", a: "Oui ! On utilise React Native (Expo) qui permet de creer une seule app pour les deux plateformes." },
  { q: "Y a-t-il un support ?", a: "Oui, tu as acces a la communaute privee ou tu peux poser tes questions et recevoir de l'aide des autres eleves et du formateur." },
  { q: "C'est quoi le vibecoding ?", a: "C'est une nouvelle approche ou l'IA ecrit le code pour toi. Tu guides l'IA avec des instructions en langage naturel, et elle genere le code de ton app." },
  { q: "Faut-il un Mac ?", a: "Fortement recommande pour publier sur iOS (App Store). Pour Android uniquement, un PC suffit. La grande majorite des eleves utilisent un Mac." },
];

export default function FaqV3() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-[var(--accent2)]">
            FAQ
          </span>
          <div className="h-px flex-1 bg-[var(--field)]" />
        </div>

        {/* Two-column layout: info left, questions right */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12">
          {/* Left: title + description + contact */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <h2 className="text-[2.5rem]/10 font-medium tracking-[-0.035em] text-balance text-[var(--fg)]">
              Questions frequentes
            </h2>
            <p className="mt-4 text-base/7 text-[var(--fg2)]">
              Tu ne trouves pas la reponse a ta question ? N&apos;hesite pas a nous contacter directement.
            </p>

            {/* Contact card */}
            <div className="mt-8 isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[var(--sep)]">
              <div className="relative rounded-xl bg-[var(--field)] p-5 overflow-hidden">
                {/* Dot pattern */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]">
                      <Mail size={16} className="text-[var(--accent2)]" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--fg)]">Contacte-moi</span>
                  </div>
                  <p className="text-xs/5 text-[var(--fg2)] mb-4">
                    Une question specifique ? Je te reponds en moins de 24h.
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--field)] px-4 py-2 text-xs font-semibold text-[var(--fg2)] outline outline-[var(--sep)] hover:outline-[var(--sep)] transition-colors"
                  >
                    Envoyer un message
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: questions accordion */}
          <div className="isolate overflow-hidden rounded-2xl bg-[var(--bg)] p-2 outline outline-[var(--sep)]">
            <div className="relative rounded-xl bg-[var(--field)] p-2 overflow-hidden">
              {/* Dot pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="relative flex flex-col gap-1">
                {faqData.map((item, index) => {
                  const isOpen = openItems.includes(index);
                  return (
                    <div
                      key={index}
                      className="rounded-lg bg-[var(--bg)]"
                    >
                      <button
                        onClick={() => toggle(index)}
                        className="w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer hover:bg-[var(--field)] rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3 pr-4">
                          <span className="font-mono text-xs text-[var(--fg)]/20 shrink-0">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-semibold text-[var(--fg)]">{item.q}</span>
                        </div>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown size={14} className="text-[var(--fg3)]" />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-3.5 pl-11 text-[var(--fg2)] text-sm/6">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-[var(--field)]" />
    </section>
  );
}
