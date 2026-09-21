// Témoignages d'élèves accompagnés. Données partagées entre la page dédiée
// (/temoignage/florian) et les blocs "preuve" affichés ailleurs (page de
// confirmation d'appel, emails, etc.).
//
// Chiffres relevés à l'écran pendant le live du 16 juillet 2026
// (RevenueCat + Instagram de Momentum). Ne pas arrondir vers le haut.

export type Temoignage = {
  slug: string;
  firstName: string;
  age: number;
  appName: string;
  appTagline: string;
  photo: string;
  // ID Bunny Stream (lib 613852) du live monté. Laisser "" tant que la
  // vidéo n'est pas uploadée : un bloc "Vidéo en cours de préparation"
  // s'affiche à la place.
  videoId: string;
  // Image affichée avant le clic (le lecteur Bunny n'est chargé qu'au clic).
  poster: string;
  recordedOn: string;
  headline: string;
  stats: { value: string; label: string; detail: string }[];
};

export const FLORIAN: Temoignage = {
  slug: "florian",
  firstName: "Florian",
  age: 20,
  appName: "Momentum",
  appTagline: "Application de productivité (blocage d'apps, routines, temps d'écran, Pomodoro)",
  photo: "/florian.jpg",
  videoId: "dc0312ce-5cf4-46fd-af7c-ef3a7a20e4dd",
  poster: "/florian-poster.jpg",
  recordedOn: "16 juillet 2026",
  headline: "De 0 à 1 793 $ en 28 jours, sans une seule pub",
  stats: [
    { value: "1 793 $", label: "de revenus sur 28 jours", detail: "70 abonnements actifs, 53 essais en cours" },
    { value: "120+", label: "installations par jour", detail: "contre 3 à 4 par jour six semaines plus tôt" },
    { value: "1 M", label: "de vues Instagram en 30 jours", detail: "des reels à 100 000 et 200 000 vues" },
    { value: "0 €", label: "de publicité", detail: "100 % de contenu organique, posté depuis son téléphone" },
  ],
};

// Messages reçus des élèves (captures WhatsApp), affichés sur /temoignages.
// Pour ajouter un élève : déposer la capture recadrée sur la bulle dans
// public/emails/<prenom>-message.jpg et ajouter une entrée ici.
export type MessageEleve = {
  firstName: string;
  photo: string;
  // Capture du message, recadrée sur la bulle (sans vocal ni messages perso).
  image: { src: string; width: number; height: number; alt: string };
  // Où il en est, en une phrase, en argent quand il y en a.
  status: string;
  // Le contexte du message, dans les mots de Jeremy.
  context: string;
};

export const MESSAGES_ELEVES: MessageEleve[] = [
  {
    firstName: "Soraya",
    photo: "/soraya.jpg",
    image: {
      src: "/emails/soraya-message.jpg",
      width: 756,
      height: 364,
      alt: "Message WhatsApp de Soraya le lendemain du lancement de son application : premiers utilisateurs, 29 sessions le premier soir, prochaine étape le marketing",
    },
    status: "Application lancée en septembre 2026, premiers utilisateurs dès le premier soir",
    context:
      "Soraya est arrivée sans savoir coder. Elle a construit son application avec l'IA, l'a publiée, et m'a envoyé ce message le lendemain matin de son lancement. Sa prochaine étape, c'est le marketing, comme pour tout le monde.",
  },
  {
    firstName: "Wassim",
    photo: "/wassim.jpg",
    image: {
      src: "/emails/wassim-message.jpg",
      width: 695,
      height: 640,
      alt: "Tableau de bord RevenueCat envoyé par Wassim : 12 essais actifs, 3 abonnements actifs, 83 $ sur 28 jours, 577 nouveaux utilisateurs en 28 jours, suivi de son message « Lets gooo !!! »",
    },
    status: "Premiers abonnés payants, 129 $ et près de 600 nouveaux utilisateurs en 28 jours",
    context:
      "Wassim m'a envoyé ce tableau de bord un soir à 21 h, avec trois mots et rien d'autre. À minuit, il m'en a renvoyé un autre avec un seul mot : « Encore 1 ». C'est petit, et c'est exactement le moment où tout commence. Florian était au même point six semaines avant ses 1 793 $.",
  },
];
