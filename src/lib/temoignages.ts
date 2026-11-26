// Témoignages d'élèves accompagnés. Données partagées entre les pages
// dédiées (/temoignage/<slug>) et les blocs "preuve" affichés ailleurs (page
// de confirmation d'appel, emails, etc.).
//
// TEMOIGNAGE_VEDETTE est la vidéo à pousser partout (aujourd'hui Wassim).

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
  // Si la vidéo est sur YouTube, son ID : il remplace videoId.
  youtubeId?: string;
  // Image affichée avant le clic (le lecteur Bunny n'est chargé qu'au clic).
  poster: string;
  recordedOn: string;
  headline: string;
  stats: { value: string; label: string; detail: string }[];
};

// Chiffres relevés à l'écran pendant le live du 16 juillet 2026
// (RevenueCat + Instagram de son app). Ne pas arrondir vers le haut.
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

// Podcast du 12 octobre 2026, chiffres montrés à l'écran sur RevenueCat
// (7 269 $ sur 28 jours, gagnés en deux semaines et demie, pic à 1 691 $ le
// 7 octobre). Jeremy affiche « 7 269 $ en 14 jours » et « 1 700 $ en un jour ».
// Ne jamais nommer son application : le nom n'apparaît que dans la vidéo.
export const WASSIM: Temoignage = {
  slug: "wassim",
  firstName: "Wassim",
  age: 22,
  appTagline: "Application de style et de mode avec l'IA",
  photo: "/wassim.jpg",
  videoId: "",
  youtubeId: "XlCzXq5Do6M",
  poster: "/wassim-poster-v5.jpg",
  recordedOn: "12 octobre 2026",
  headline: "7 269 $ en 14 jours, sans une seule pub",
  stats: [
    { value: "7 269 $", label: "de revenus en 14 jours", detail: "251 abonnés payants, 232 essais en cours" },
    { value: "1 700 $", label: "en une seule journée", detail: "portée par une vidéo à plus de 700 000 vues" },
    { value: "1 585 $", label: "de revenus récurrents par mois", detail: "des abonnements qui se renouvellent tout seuls" },
    { value: "0 €", label: "de publicité", detail: "100 % de contenu organique, seul, 3 à 4 heures par jour" },
  ],
};

export const TEMOIGNAGE_VEDETTE = WASSIM;

// Messages reçus des élèves (captures WhatsApp), affichés sur /temoignages.
// Pour ajouter un élève : déposer la capture recadrée sur la bulle dans
// public/emails/<prenom>-message-v2.jpg (nouveau nom à chaque remplacement,
// pour le cache) et ajouter une entrée ici.
export type MessageEleve = {
  // Prénom, ou une courte description quand l'élève reste anonyme.
  firstName: string;
  // Sans photo : pastille avec l'initiale (ou une silhouette si anonyme).
  photo?: string;
  // L'élève ne veut ni prénom, ni nom d'application, ni visage : tout est flouté.
  anonyme?: boolean;
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
    status: "9 495 $ sur 28 jours aujourd'hui, bientôt 10 000 $ par mois en 100 % organique",
    result: {
      src: "/emails/wassim-dashboard-9495-v1.jpg",
      width: 1600,
      height: 492,
      alt: "Tableau de bord RevenueCat de Wassim au 25 octobre 2026 : 9 495 $ de revenus sur 28 jours, 328 abonnements actifs, 675 essais en cours, 1 955 $ de revenus récurrents par mois et 33 663 nouveaux clients",
      caption: "Les chiffres de Wassim aujourd'hui : 9 495 $ sur 28 jours, sans une seule pub.",
    },
    earlier: {
      src: "/emails/wassim-message-v2.jpg",
      width: 840,
      height: 1944,
      alt: "Premiers tableaux de bord RevenueCat de Wassim : 3 puis 4 abonnements actifs, 83 puis 129 $ sur 28 jours, « Lets gooo !!! »",
      caption: "Au début, il fêtait ses 129 $ sur 28 jours.",
    },
    context:
      "Au début, Wassim m'envoyait ses premiers abonnés payants et ses 129 $ sur 28 jours. Un soir, il m'a écrit « Bientôt les 1k !!! » avec 990 € sur 28 jours, puis il a passé les 1 110 € quelques heures plus tard, avec 51 abonnés payants et 206 essais gratuits en cours. Sa question suivante : à partir de combien on fait le podcast. Aujourd'hui, il est à 9 495 $ sur 28 jours, avec 328 abonnés payants et 675 essais gratuits en cours. Il approche des 10 000 $ par mois, toujours en 100 % organique, sans un euro de publicité.",
  },
  {
    firstName: "Elouan",
    photo: "/elouan.jpg",
    image: {
      src: "/emails/elouan-message-v2.jpg",
      width: 840,
      height: 733,
      alt: "Message WhatsApp d'Elouan : son tableau de bord RevenueCat avec 1 384 $ de revenus sur 28 jours, 1 015 $ de revenus récurrents par mois, 51 abonnements actifs et 20 essais en cours, « En 1 mois de marketing ». Le nom de son application est flouté.",
    },
    status: "1 384 $ sur 28 jours et 1 015 $ de revenus récurrents par mois, après un mois de marketing",
    result: {
      src: "/emails/elouan-dashboard-1384-v1.jpg",
      width: 1600,
      height: 804,
      alt: "Tableau de bord RevenueCat d'Elouan : 20 essais en cours, 51 abonnements actifs, 1 015 $ de revenus récurrents par mois, 1 384 $ sur 28 jours, 2 629 nouveaux clients et 5 180 clients actifs. Le nom et le logo de son application sont floutés.",
      caption: "Le tableau de bord d'Elouan en grand, 100 % organique.",
    },
    earlier: {
      src: "/emails/elouan-message-v1.jpg",
      width: 840,
      height: 1531,
      alt: "Conversation WhatsApp avec Elouan un mois plus tôt : 0 $ sur 28 jours, 13 essais en cours, le classement des téléchargements Éducation en France, « Top 57 France j'ai du mal à y croire c'est un rêve qui se réalise petit à petit ». Le nom et la fiche de son application sont floutés.",
      caption: "Un mois plus tôt : 0 $, mais déjà dans le top 57 Éducation en France.",
    },
    context:
      "Il y a un mois, Elouan m'écrivait le soir où son application entrait dans le top 57 des téléchargements Éducation en France. Ses revenus sur 28 jours étaient encore à 0 $. Un mois de marketing plus tard, il est à 1 384 $ sur 28 jours, avec 51 abonnés payants, 20 essais gratuits en cours et 1 015 $ de revenus récurrents par mois. Tout ça en 100 % organique : pas un euro de publicité pour le moment. Le nom de son application est flouté pour ne pas la dévoiler.",
  },
  // Captures WhatsApp du 19 et du 24 novembre 2026 (deux captures recollées
  // pour avoir le message entier).
  {
    firstName: "Julien",
    image: {
      src: "/emails/julien-message-v1.jpg",
      width: 840,
      height: 2911,
      alt: "Message WhatsApp de Julien le 24 novembre 2026 avec ses graphiques RevenueCat du 27 octobre au 24 novembre : 2 626 € de revenus et 7 565 nouveaux clients, dont 724 le 24 novembre. Il raconte trois jours difficiles, le contenu qu'il n'a pas lâché, l'onboarding qui fonctionne bien et sa deuxième meilleure journée de téléchargements depuis le lancement.",
    },
    status: "2 626 € sur 28 jours et 7 565 nouveaux utilisateurs en un mois",
    earlier: {
      src: "/emails/julien-message-19nov-v1.jpg",
      width: 840,
      height: 1748,
      alt: "Message WhatsApp de Julien le 19 novembre 2026 : graphique RevenueCat à 2 065 € de revenus du 22 octobre au 19 novembre, « Ce soir normalement je devrais être à 2212€ », et un merci pour le live Skool du soir.",
      caption: "Cinq jours plus tôt, il était à 2 065 € sur 28 jours.",
    },
    context:
      "Fin octobre, Julien avait encore des journées à 0 €. Je lui ai refait son onboarding, et il a continué à publier du contenu tous les jours, même pendant trois jours sans résultat. Le 24 novembre, il m'a envoyé ce point : 2 626 € sur 28 jours, 7 565 nouveaux utilisateurs sur le mois, et sa deuxième meilleure journée depuis le lancement, avec 724 nouveaux utilisateurs ce jour-là. Il a même ajouté de lui-même une notification qui demande aux gens pourquoi ils arrêtent leur essai gratuit.",
  },
  // Capture du groupe WhatsApp du 26 novembre 2026. Ils ne veulent pas être
  // reconnus : prénoms, numéro, nom de l'application et transactions floutés
  // ou coupés. Ne jamais les nommer ailleurs.
  {
    firstName: "Deux associés",
    anonyme: true,
    image: {
      src: "/emails/anonyme-message-v1.jpg",
      width: 840,
      height: 1037,
      alt: "Message WhatsApp de deux associés accompagnés, avec leur tableau de bord RevenueCat : 100 abonnements actifs, 60 essais en cours, 739 € de revenus récurrents par mois et 2 272 € sur 28 jours. « On a passé les 100 users payants aujourd'hui ». Le nom de l'application et les transactions sont floutés.",
    },
    status: "2 272 € sur 28 jours et 100 abonnés payants",
    result: {
      src: "/emails/anonyme-dashboard-2272-v1.jpg",
      width: 1600,
      height: 576,
      alt: "Tableau de bord RevenueCat des deux associés : 60 essais en cours, 100 abonnements actifs, 739 € de revenus récurrents par mois, 2 272 € sur 28 jours, 16 869 nouveaux clients et 31 547 clients actifs sur 28 jours. Le nom de l'application est flouté.",
      caption: "Leur tableau de bord le jour des 100 abonnés payants.",
    },
    context:
      "Ils préfèrent rester anonymes, donc ni prénom ni nom d'application ici. Ils m'ont écrit le jour où ils ont passé les 100 abonnés payants : 2 272 € sur 28 jours, 739 € de revenus récurrents par mois, 60 essais gratuits en cours et 16 869 nouveaux utilisateurs sur les 28 derniers jours.",
  },
  // Message Telegram du 24 novembre 2026. Le fond d'écran (sa famille), le nom
  // et l'icône de l'application sont floutés.
  {
    firstName: "Un élève qui vient de commencer",
    image: {
      src: "/emails/premier-client-message-v1.jpg",
      width: 840,
      height: 1719,
      alt: "Message d'un élève avec la notification RevenueCat de son premier client : « A customer just converted from a free trial to a subscription of Annuel for $54.51 ». « Ça y est j'ai mon premier client payant alors que l'accompagnement vient juste de commencer. Et sur un annuel en plus. 6 mois que je galérais tout seul. » Le fond d'écran, le nom et l'icône de l'application sont floutés.",
    },
    status: "Son premier client payant, sur un abonnement annuel, dès le début de l'accompagnement",
    context:
      "Il travaillait seul sur son application depuis six mois. Juste après le début de l'accompagnement, il m'a envoyé la notification de son premier client payant : un essai gratuit transformé en abonnement annuel à 54,51 $.",
  },
];
