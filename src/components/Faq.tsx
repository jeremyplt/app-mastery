"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// FAQ = objection destruction disguised as questions (Cattoni)
// Each question maps to a specific objection

type FaqCategory = {
  label: string;
  items: { q: string; a: string }[];
};

const faqCategories: FaqCategory[] = [
  {
    label: "Général",
    items: [
      {
        q: "Je ne sais pas coder du tout, c'est vraiment pour moi ?",
        a: "Oui, c'est le principe même de la formation. Tu utilises l'IA (Claude Code) pour générer le code à ta place. Tu guides, l'IA exécute. Des débutants complets ont lancé leur app en suivant la méthode.",
      },
      {
        q: "Combien de temps dois-je y consacrer par semaine ?",
        a: "Le programme est conçu pour 28 jours à raison de 1-2 heures par jour. Mais tu as un accès à vie. Tu peux aller à ton rythme. Certains élèves finissent en 2 semaines, d'autres en 2 mois.",
      },
      {
        q: "Pourquoi payer 997€ alors qu'il y a des tutos gratuits partout ?",
        a: "Les tutos gratuits sont génériques : ils t'apprennent à coder des bouts de fonctionnalités, mais aucun ne te donne une vraie stratégie pour générer des revenus. Personne ne t'explique comment rendre ton app virale, quels outils marketing utiliser, ni comment transformer des téléchargements en argent. App Mastery, c'est un système complet : de l'idée au premier revenu, avec les stratégies marketing, les outils concrets, du support, et une communauté pour ne jamais rester bloqué.",
      },
      {
        q: "Et si mon app ne génère aucun revenu ?",
        a: "D'abord, la formation couvre les revenus de A à Z (abonnements, marketing, référencement d'app). Ensuite, tu as une double garantie. Garantie 30 jours : si tu n'es pas satisfait, tu es remboursé intégralement, sans condition. Garantie 90 jours : si tu as suivi la formation à la lettre, appliqué toutes les recommandations, et que tu n'as toujours aucun revenu après 90 jours, je te coache personnellement jusqu'à tes premiers revenus. Le risque est entièrement de mon côté, pas du tien.",
      },
      {
        q: "Est-ce que c'est vraiment possible en 28 jours ?",
        a: "Oui, c'est possible. Mais ce n'est pas une garantie. Ton app peut être prête en 28 jours, mais tu vas devoir passer par les vérifications de l'App Store et du Google Play Store et répondre à certains critères pour que ton app soit publiée. Ce processus peut prendre un certain temps qui ne dépend ni de moi ni du contenu de la formation.",
      },
      {
        q: "Est-ce que ça marche pour iOS ET Android ?",
        a: "Oui ! J'utilise React Native avec Expo, ce qui te permet de créer une seule app pour les deux plateformes. Tu publies sur l'App Store ET le Play Store avec le même code.",
      },
      {
        q: "Si ton app génère déjà de l'argent, pourquoi faire une formation ?",
        a: "J'ai déjà une chaîne YouTube où je partage mon expérience gratuitement. Mais je voulais aller beaucoup plus loin : un endroit où je peux livrer du contenu vraiment poussé, étape par étape, pour aider les gens à lancer leur propre app et à en vivre. Je suis convaincu qu'il y a un énorme marché à prendre. Tout le monde parle de SaaS, mais personne n'a encore montré concrètement comment créer une application mobile rentable. C'est exactement ce vide que je remplis avec App Mastery.",
      },
      {
        q: "Est-ce que ça marche encore en 2026 ?",
        a: "Plus que jamais. Le marché des apps mobiles continue de croître et l'IA rend le développement accessible à tous. Les outils enseignés (React Native, Expo, Claude Code) sont à la pointe et la formation est mise à jour régulièrement.",
      },
      {
        q: "Faut-il un Mac ?",
        a: "Fortement recommandé pour publier sur iOS (App Store). Pour Android uniquement, un PC suffit. La grande majorité des élèves utilisent un Mac.",
      },
      {
        q: "Et si je suis bloqué pendant la formation ?",
        a: "Tu as accès à la communauté privée où tu peux poser tes questions 24/7. Le formateur et les autres élèves sont là pour t'aider. Tu n'es jamais seul.",
      },
      {
        q: "C'est quoi le vibecoding exactement ?",
        a: "C'est une nouvelle approche où l'IA écrit le code pour toi. Tu donnes des instructions en français à un agent IA (Claude Code), et il génère le code de ton app. C'est comme avoir un développeur senior qui travaille pour toi 24/7.",
      },
      {
        q: "L'accès est vraiment à vie ?",
        a: "Oui. Tu paies une fois et tu accèdes à la formation, aux mises à jour, aux nouveaux modules et à la communauté. Pour toujours. Pas d'abonnement caché.",
      },
    ],
  },
  {
    label: "Accompagnement VIP",
    items: [
      {
        q: "Est-ce qu'il faut déjà avoir une app pour rejoindre le VIP ?",
        a: "Non, pas du tout. Si tu pars de zéro, on va construire ton app ensemble de A à Z : trouver ton idée, la valider, la développer et la lancer. Et si tu as déjà une app, on va l'analyser en profondeur pour identifier ce qui bloque et comment la faire décoller (revenus, design, marketing, référencement).",
      },
      {
        q: "Y aura-t-il des appels en direct avec toi ?",
        a: "Oui, autant que tu en as besoin. On peut s'appeler pour faire le point sur ta stratégie, débloquer un problème technique, ou organiser tes prochaines étapes. Entre les appels, on échange sur WhatsApp pour les questions rapides.",
      },
      {
        q: "Combien de temps dure l'accompagnement exactement ?",
        a: "L'accompagnement dure 3 mois. Pendant cette période, on travaille ensemble sur ton projet : je te guide à chaque étape, de la création au lancement. Et je ne te lâche pas après : on refait un appel à 6 mois pour analyser tes résultats, ajuster ta stratégie et te donner les prochaines directives pour continuer de faire exploser ton app.",
      },
      {
        q: "Et si j'ai déjà essayé de lancer une app sans succès ?",
        a: "C'est justement pour ça que le VIP existe. Si tu as déjà essayé seul, tu sais que le problème n'est pas le manque d'effort, c'est le manque de direction. On va analyser ensemble ce qui n'a pas marché, que ce soit l'idée, le positionnement, le marketing ou la monétisation, et on repart sur des bases solides avec une vraie stratégie.",
      },
      {
        q: "Pourquoi prendre l'accompagnement plutôt que la formation seule ?",
        a: "La formation te donne la méthode. L'accompagnement VIP te donne un partenaire. Je travaille avec toi sur TON app : je t'aide à choisir la bonne idée, je valide tes décisions, je corrige ta stratégie marketing, et je m'assure que tu ne perdes pas de temps sur les mauvaises priorités. C'est la différence entre suivre un cours et avoir quelqu'un à tes côtés qui a déjà fait le chemin.",
      },
    ],
  },
];

export default function Faq() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const toggle = (key: string) => {
    setOpenItems((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key],
    );
  };

  const activeCategory = faqCategories[activeTab];

  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-base font-semibold tracking-widest uppercase text-amber-400">
            FAQ
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12">
          {/* Left: title + contact */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <h2 className="text-2xl sm:text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white">
              Encore des questions ?
            </h2>
            <p className="mt-4 text-xl/8 text-gray-300">
              Si ta question n&apos;est pas ici, écris-moi. Je réponds
              personnellement en moins de 24h.
            </p>

            {/* Contact card */}
            <div className="mt-8 isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
              <div className="relative rounded-xl bg-white/5 p-5 overflow-hidden">
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                      <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      Écris-moi sur WhatsApp
                    </span>
                  </div>
                  <p className="text-sm/6 text-gray-300 mb-4">
                    Je réponds personnellement à chaque message.
                  </p>
                  <a
                    href="https://wa.me/33756823921?text=Salut%20Jeremy%20!%20J%27ai%20une%20question%20sur%20App%20Mastery."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-gray-300 outline outline-white/10 hover:outline-white/20 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Écrire sur WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: tabs + questions accordion */}
          <div>
            {/* Category tabs */}
            <div className="flex gap-2 mb-4">
              {faqCategories.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveTab(i)}
                  className={`px-5 py-2.5 rounded-full text-base font-semibold transition-colors cursor-pointer ${
                    activeTab === i
                      ? i === 1
                        ? "bg-amber-500 text-white"
                        : "bg-white text-gray-950"
                      : "bg-white/5 text-gray-300 outline outline-white/10 hover:bg-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="isolate overflow-hidden rounded-2xl bg-gray-950 p-2 outline outline-white/10">
              <div className="relative rounded-xl bg-white/5 p-2 overflow-hidden">
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative flex flex-col gap-1">
                  {activeCategory.items.map((item, index) => {
                    const key = `${activeTab}-${index}`;
                    const isOpen = openItems.includes(key);
                    return (
                      <div key={key} className="rounded-lg bg-gray-950">
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-3 pr-4">
                            <span className="font-mono text-sm text-white/20 shrink-0">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-base font-semibold text-white">
                              {item.q}
                            </span>
                          </div>
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown size={14} className="text-gray-600" />
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
                              <p className="px-4 pb-3.5 pl-11 text-gray-300 text-lg/8">
                                {item.a}
                              </p>
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
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
