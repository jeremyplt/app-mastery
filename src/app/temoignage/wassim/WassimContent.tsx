"use client";

import TemoignageDetail from "@/components/TemoignageDetail";
import { WASSIM } from "@/lib/temoignages";

// Parcours de Wassim, dans l'ordre du podcast du 12 octobre 2026. Chiffres
// tels qu'il les a donnés à l'oral et montrés à l'écran (RevenueCat).
// Ne jamais nommer son application.
const TIMELINE = [
  {
    when: "Avant août 2026",
    title: "Une app qui ne vendait pas",
    body: "Après six mois d'agence à créer des apps pour des entreprises, il lance sa propre app de style avec l'IA. Elle est sur l'App Store, mais elle ne fait presque aucune vente. Il retrouve Jeremy sur YouTube et rejoint l'accompagnement début août.",
  },
  {
    when: "Première semaine",
    title: "L'audit complet de son app",
    body: "Jeremy analyse l'app écran par écran et prépare la base : l'onboarding, le paywall, les prix. Une semaine et demie de mises à jour avant de lancer le marketing.",
  },
  {
    when: "Août",
    title: "Des vues, mais pas de ventes",
    body: "Ses carrousels font des milliers de vues, mais l'appel à l'action est caché sur la dernière slide. On le place au milieu, puis on passe à des vidéos qui montrent l'app en action, à partir d'exemples de sa niche qui ont déjà marché.",
  },
  {
    when: "Septembre",
    title: "Les fuites dans l'app",
    body: "Les statistiques montrent que 15 % des utilisateurs abandonnent à une seule étape de l'onboarding. Nouvel onboarding, nouveau paywall : 80 % des gens arrivent jusqu'au paywall. Premières ventes, et un premier pic à 117 $ en une journée.",
  },
  {
    when: "Mi-septembre",
    title: "Le problème caché",
    body: "La moitié de ses utilisateurs ont moins de 17 ans, et ils ne peuvent pas payer : seulement 2 % prennent l'essai gratuit, dix fois moins que les 25-34 ans. On change le contenu pour toucher des adultes.",
  },
  {
    when: "24 septembre au 12 octobre",
    title: "Ça décolle",
    body: "Une vidéo dépasse 700 000 vues, 500 nouveaux utilisateurs arrivent chaque jour. 7 269 $ en 14 jours, dont 1 700 $ en une seule journée, et 232 essais gratuits en cours. Sans un euro de pub.",
  },
];

const QUOTES = [
  {
    text: "Je veux faire des millions par mois. Je vais tout casser.",
    context: "le jour de son premier appel",
  },
  {
    text: "Avant de rejoindre l'accompagnement, je n'aurais jamais pensé atteindre ce stade-là.",
    context: "sur sa journée à 1 700 $",
  },
  {
    text: "Je demandais à Claude ou à ChatGPT si ce business allait m'apporter de l'argent. On me disait : ton argent va venir dans six mois, peut-être un an. C'est faux. Au bout de deux mois, j'ai fait 7K.",
    context: "sur ses doutes avant de se lancer",
  },
  {
    text: "Dès qu'il me donne un conseil, le lendemain, c'est fait, c'est appliqué.",
    context: "sur sa façon de travailler avec Jeremy",
  },
];

const CHANGES = [
  "Un audit complet de l'app (onboarding, paywall, prix) avant de lancer le marketing",
  "L'appel à l'action placé au milieu des carrousels, au lieu de la dernière slide",
  "Des vidéos qui montrent l'app en action dès les premières secondes, pour attirer des gens prêts à l'utiliser",
  "Un onboarding sans l'étape qui faisait partir 15 % des utilisateurs",
  "Un contenu qui parle aux adultes, qui peuvent payer, au lieu des moins de 18 ans",
  "Une fonctionnalité virale vraiment utile : on partage une vidéo et l'app retrouve où acheter les vêtements",
];

const RULES = [
  {
    title: "Copier ce qui marche déjà",
    body: "Il analyse les vidéos des apps qui explosent, même hors de sa niche. L'IA adapte l'accroche, le texte à l'écran et la description à son app.",
  },
  {
    title: "Face caméra, puis l'app",
    body: "Il dit l'accroche face caméra, puis filme son app sur son iPhone. Aucun montage : deux heures de tournage par jour.",
  },
  {
    title: "Le volume avant tout",
    body: "Trois vidéos par jour sur plusieurs comptes, sur TikTok, Instagram, Facebook et YouTube Shorts. Ça fait 40 000 à 50 000 vues par jour, sans compter les vidéos virales.",
  },
];

export default function WassimContent() {
  return (
    <TemoignageDetail
      t={WASSIM}
      title={
        <>
          De 0 à <span className="mac-accent whitespace-nowrap">7 269 $</span> en 14 jours,
          <br className="hidden sm:block" /> sans une seule pub.
        </>
      }
      intro="Il savait construire une app, pas la vendre. Deux mois après le début de l'accompagnement, il fait 1 700 $ en une seule journée. Il raconte tout dans le podcast, avec ses vrais chiffres à l'écran."
      videoCaption={`Podcast enregistré le ${WASSIM.recordedOn}. Chiffres montrés en direct sur RevenueCat.`}
      proofs={[
        {
          src: "/emails/wassim-revenuecat-7269-v1.jpg",
          width: 900,
          height: 272,
          alt: "Tableau de bord RevenueCat de Wassim : 232 essais en cours, 251 abonnements actifs, 1 585 $ de revenus récurrents mensuels, 7 269 $ de revenus, 24 662 nouveaux clients",
          caption: "Son tableau de bord le jour du podcast : 7 269 $ de revenus, 251 abonnés payants et 232 essais en cours.",
        },
        {
          src: "/emails/wassim-revenu-jour-1691-v1.jpg",
          width: 700,
          height: 470,
          alt: "Courbe des revenus quotidiens de Wassim sur 90 jours, avec un pic à 1 691 $ le mercredi 7 octobre 2026",
          caption: "Sa courbe de revenus par jour : 1 691 $ le 7 octobre, en une seule journée.",
        },
      ]}
      timelineTitle="Six étapes, d'une app sans ventes à 1 700 $ par jour"
      timeline={TIMELINE}
      quotes={QUOTES}
      changesTitle="Deux mois de travail sur son app et son contenu"
      changes={CHANGES}
      rulesTitle="Trois à quatre heures par jour, seul"
      rules={RULES}
    />
  );
}
