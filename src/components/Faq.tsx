"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    q: "Faut-il savoir coder ?",
    a: "Non ! La formation part de zero et utilise l'IA (Claude Code) pour generer le code. Tu apprends les concepts en meme temps que tu construis.",
  },
  {
    q: "Combien de temps faut-il ?",
    a: "Le programme est concu pour 28 jours. Tu peux aller plus vite ou plus lentement selon ton rythme. L'acces est a vie.",
  },
  {
    q: "Quels outils sont necessaires ?",
    a: "Un Mac est fortement recommande pour le dev iOS. Tous les outils utilises sont soit gratuits, soit inclus dans la formation.",
  },
  {
    q: "L'acces est-il a vie ?",
    a: "Oui, tu as un acces illimite a la formation et toutes les mises a jour futures. Les nouveaux modules sont ajoutes regulierement.",
  },
  {
    q: "Et si ca ne marche pas pour moi ?",
    a: "Tu as une garantie de 30 jours. Si tu suis le programme et n'obtiens pas de resultat, tu es rembourse integralement.",
  },
  {
    q: "Quelle est la difference avec des tutos gratuits ?",
    a: "Un parcours structure de A a Z vs des fragments eparpilles. Ici tu as une methode complete, du support, et une communaute pour t'accompagner.",
  },
  {
    q: "Ca marche pour iOS ET Android ?",
    a: "Oui ! On utilise React Native (Expo) qui permet de creer une seule app pour les deux plateformes.",
  },
  {
    q: "Y a-t-il un support ?",
    a: "Oui, tu as acces a la communaute privee ou tu peux poser tes questions et recevoir de l'aide des autres eleves et du formateur.",
  },
  {
    q: "C'est quoi le vibecoding ?",
    a: "C'est une nouvelle approche ou l'IA ecrit le code pour toi. Tu guides l'IA avec des instructions en langage naturel, et elle genere le code de ton app.",
  },
  {
    q: "Faut-il un Mac ?",
    a: "Fortement recommande pour publier sur iOS (App Store). Pour Android uniquement, un PC suffit. La grande majorite des eleves utilisent un Mac.",
  },
];

export default function Faq() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="section">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center mb-12 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Questions Frequentes
        </motion.h2>

        <motion.div
          className="glass p-4 md:p-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          <div className="flex flex-col gap-2">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index);
              return (
                <motion.div
                  key={index}
                  className="rounded-xl bg-[rgba(251,191,36,0.04)]"
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                  >
                    <span className="text-sm md:text-base font-semibold pr-4">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown size={16} className="text-[var(--muted-fg)]" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-[var(--muted-fg)] text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
