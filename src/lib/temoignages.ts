// Témoignages d'élèves accompagnés. Données partagées entre la page dédiée
// (/temoignage/florian) et les blocs "preuve" affichés ailleurs (page de
// confirmation d'appel, emails, etc.).
//
// Chiffres relevés à l'écran pendant le live du 16 juillet 2026
// (RevenueCat + Instagram de son app). Ne pas arrondir vers le haut.

export type Temoignage = {
  slug: string;
  firstName: string;
  age: number;
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
// public/emails/<prenom>-message-v2.jpg (nouveau nom à chaque remplacement,
// pour le cache) et ajouter une entrée ici.
export type MessageEleve = {
  firstName: string;
  photo: string;
  // Capture WhatsApp : entière pour un tableau de bord (Wassim), recadrée sur
  // la bulle pour un simple message texte (Soraya). Jeremy tranche au cas par cas.
  image: { src: string; width: number; height: number; alt: string };
  // Où il en est, en une phrase, en argent quand il y en a.
  status: string;
  // Le contexte du message, dans les mots de Jeremy.
  context: string;
  // Capture de résultat (tableau de bord) à afficher sous le message, si on en a une.
  result?: { src: string; width: number; height: number; alt: string; caption: string };
  // Capture plus ancienne (point de départ), affichée en petit sous le texte
  // quand l'image principale montre un résultat plus récent.
  earlier?: { src: string; width: number; height: number; alt: string; caption: string };
};

export const MESSAGES_ELEVES: MessageEleve[] = [
  {
    firstName: "Soraya",
    photo: "/soraya.jpg",
    image: {
      src: "/emails/soraya-message-v3.jpg",
      width: 744,
      height: 364,
      alt: "Message WhatsApp de Soraya le lendemain du lancement de son application : premiers utilisateurs, 29 sessions le premier soir, prochaine étape le marketing",
    },
    status: "229 $ sur 28 jours et quatre abonnés payants, avec un seul post sur les réseaux",
    result: {
      src: "/emails/soraya-dashboard-229.jpg",
      width: 900,
      height: 1249,
      alt: "Tableau de bord RevenueCat de Soraya : 4 abonnements actifs, 2 essais en cours, 229,47 $ sur 28 jours, 280 utilisateurs, 210 nouveaux clients",
      caption: "Les ventes de Soraya avec un seul post publié.",
    },
    context:
      "Soraya est arrivée sans savoir coder. Elle a construit son application avec l'IA, l'a publiée, et m'a envoyé ce message le lendemain matin de son lancement. Avec un seul post sur les réseaux, elle a fait 229 $ sur 28 jours, avec quatre abonnés payants et deux essais gratuits en cours. Sa prochaine étape, c'est le marketing, comme pour tout le monde.",
  },
  {
    firstName: "Wassim",
    photo: "/wassim.jpg",
    image: {
      src: "/emails/wassim-message-v3.jpg",
      width: 840,
      height: 2430,
      alt: "Conversation WhatsApp avec Wassim : son tableau de bord RevenueCat à 990 € sur 28 jours, « Bientôt les 1k !!! », « Je suis trop content tu m'as régalé avec tes conseils », puis le même soir 1 110 € sur 28 jours, 51 abonnements actifs, 336 € de revenus mensuels récurrents et 206 essais en cours",
    },
    status: "1 110 € sur 28 jours, 51 abonnés payants et 206 essais en cours",
    earlier: {
      src: "/emails/wassim-message-v2.jpg",
      width: 840,
      height: 1944,
      alt: "Premiers tableaux de bord RevenueCat de Wassim : 3 puis 4 abonnements actifs, 83 puis 129 $ sur 28 jours, « Lets gooo !!! »",
      caption: "Au début, il fêtait ses 129 $ sur 28 jours.",
    },
    context:
      "Au début, Wassim m'envoyait ses premiers abonnés payants et ses 129 $ sur 28 jours. Un soir, il m'a écrit « Bientôt les 1k !!! » avec 990 € sur 28 jours, puis il a passé les 1 110 € quelques heures plus tard, avec 51 abonnés payants et 206 essais gratuits en cours. Sa question suivante : à partir de combien on fait le podcast.",
  },
  {
    firstName: "Elouan",
    photo: "/elouan.jpg",
    image: {
      src: "/emails/elouan-message-v1.jpg",
      width: 840,
      height: 1531,
      alt: "Conversation WhatsApp avec Elouan : son tableau de bord RevenueCat (13 essais en cours, 849 nouveaux utilisateurs sur 28 jours), le classement des téléchargements Éducation en France, « Top 57 France j'ai du mal à y croire c'est un rêve qui se réalise petit à petit », puis la liste de ses nouveaux essais gratuits. Le nom et la fiche de son application sont floutés.",
    },
    status: "Top 57 des téléchargements Éducation en France et 849 nouveaux utilisateurs en 28 jours",
    context:
      "Elouan m'a envoyé ce message le soir où son application est entrée dans le top 57 des téléchargements Éducation en France. Derrière, les essais gratuits s'enchaînent : treize en cours, et 849 nouveaux utilisateurs sur 28 jours. Le nom et la fiche de son application sont floutés pour ne pas la dévoiler.",
  },
];
