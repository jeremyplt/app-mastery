"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const forYou = [
  "Tu veux creer ta propre app mobile",
  "Tu es debutant ou intermediaire en code",
  "Tu veux utiliser l'IA pour accelerer ton dev",
  "Tu veux un business rentable autour d'une app",
  "Tu es pret a investir 28 jours",
];

const notForYou = [
  "Tu cherches un schema pour devenir riche rapidement",
  "Tu n'es pas pret a suivre un processus structure",
  "Tu veux juste regarder sans appliquer",
];

export default function ForWho() {
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* For you */}
          <motion.div
            className="glass p-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-6">
              C&apos;est pour toi si...
            </h3>
            <ul className="space-y-4">
              {forYou.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    className="text-[var(--color-success)] shrink-0 mt-0.5"
                    size={18}
                  />
                  <span className="text-[var(--muted-fg)] text-sm">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not for you */}
          <motion.div
            className="glass p-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-6">
              Ce n&apos;est PAS pour toi si...
            </h3>
            <ul className="space-y-4">
              {notForYou.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X
                    className="text-[var(--color-danger)] shrink-0 mt-0.5"
                    size={18}
                  />
                  <span className="text-[var(--muted-fg)] text-sm">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
