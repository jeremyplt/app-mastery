"use client";

import TemoignageDetail from "@/components/TemoignageDetail";
import { FLORIAN } from "@/lib/temoignages";

// Parcours de Florian, dans l'ordre du live. Dates et chiffres tels qu'il
// les a donnés à l'oral et montrés à l'écran (RevenueCat, Instagram).
const TIMELINE = [
  {
    when: "Fin 2025 à février 2026",
    title: "Quatre mois à construire seul",
    body: "Aucune base en code. Il commence sur Replit, comprend au bout d'un mois que ça ne donnera jamais une vraie app, passe sur Claude Code. Il obtient une V1 qui marche, mais pas optimisée. Il contacte Jeremy début mars.",
  },
  {
    when: "Mars à avril",
    title: "Un mois de refonte ensemble",
    body: "Onboarding personnalisé selon l'objectif de l'utilisateur, paywall avec tableau comparatif, boutons d'action mis en avant, prix annuel revu. Une date limite fixée à deux : l'app sort sur l'App Store fin avril, juste avant son départ en Asie.",
  },
  {
    when: "Mai à mi-juin",
    title: "Six semaines dans le vide",
    body: "3 à 4 installations par jour. 10 essais gratuits en un mois et demi. Il poste tous les jours sur plusieurs comptes, rien ne prend. Il veut retoucher l'app. Consigne : ne rien changer, continuer le marketing jusqu'à trouver un format qui marche.",
  },
  {
    when: "6 juin",
    title: "Le déclic",
    body: "Il repère un format américain qui lui plaît et le refait en facecam, posté sur son compte perso en collaboration avec le compte de l'app. 20 vues le premier jour, 275 le lendemain, puis 5 000, 10 000, 20 000. Il garde le format et ne change que le hook.",
  },
  {
    when: "Mi-juin à juillet",
    title: "Ça décolle",
    body: "15 à 25 contenus par jour sur 6 comptes, chaque reel reposté sur Instagram, TikTok et YouTube Shorts. Des reels à 100 000 et 200 000 vues. Il passe de 10 à plus de 120 installations par jour, 70 abonnements actifs, 1 793 $ de revenus sur 28 jours.",
  },
];

const QUOTES = [
  {
    text: "Bosser avec quelqu'un qui a déjà les compétences, c'est juste un cheat code.",
    context: "sur ses quatre mois seul avant l'accompagnement",
  },
  {
    text: "Le premier mois, factuellement, l'application ne marche pas. Ça fait quatre mois que je bosse dessus. Qu'est-ce que je fais ?",
    context: "sur les six semaines après la sortie",
  },
  {
    text: "Quand on prend un accompagnement, on est débutant, on ne sait pas mieux. Appliquez ce qu'on vous dit, et vous verrez plus tard.",
    context: "sur le moment où il voulait retoucher l'app au lieu de faire du marketing",
  },
  {
    text: "Les 1 800 $ sur les 28 derniers jours, ça ne vaut rien à côté du fait de pouvoir aider les gens.",
    context: "en fin de live",
  },
];

const CHANGES = [
  "Un onboarding personnalisé : les questions et la navigation de l'app changent selon ce que l'utilisateur vient chercher",
  "Un paywall en deux étapes avec un tableau comparatif : une app à la place de quatre",
  "Les boutons d'action principaux mis en avant sur chaque écran",
  "Des règles de design simples : taille des textes, lisibilité sur les petits iPhone",
  "Des écrans qui expliquent l'app pendant l'onboarding, au lieu de laisser l'utilisateur se débrouiller",
  "Le prix annuel revu pour augmenter la valeur par client",
];

const RULES = [
  {
    title: "Un reel par jour, minimum",
    body: "Dès qu'un format marche, il le refait tous les jours sans exception. Certains jours il en tourne trois ou quatre d'avance.",
  },
  {
    title: "Garder le format, changer le hook",
    body: "Même structure, même montage. Seule la première phrase change. Les hooks qui marchent sont refaits.",
  },
  {
    title: "Reposter partout",
    body: "Compte perso, compte de l'app, Instagram, TikTok, YouTube Shorts. Un même reel à 100 000 vues sur une plateforme en fait 300 000 au total.",
  },
];

export default function FlorianContent() {
  return (
    <TemoignageDetail
      t={FLORIAN}
      title={
        <>
          De 0 à <span className="mac-accent whitespace-nowrap">1 793 $</span> en 28 jours,
          <br className="hidden sm:block" /> sans une seule pub.
        </>
      }
      intro="Une app de productivité créée sans savoir coder. Six semaines après la sortie, plus de 100 installations par jour. Il raconte tout en live, avec ses vrais tableaux de bord à l'écran."
      videoCaption={`Live enregistré le ${FLORIAN.recordedOn} avec les élèves de l'incubateur. Chiffres montrés en direct sur RevenueCat et Instagram.`}
      timelineTitle="Cinq étapes, de l'idée aux premiers revenus"
      timeline={TIMELINE}
      quotes={QUOTES}
      changesTitle="Un mois de travail sur son app avant la sortie"
      changes={CHANGES}
      rulesTitle="Les trois règles qu'il applique tous les jours"
      rules={RULES}
    />
  );
}
