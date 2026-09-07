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
    { value: "120+", label: "installations par jour", detail: "contre 3 à 4 par jour six semaines plus tôt" },
    { value: "1 793 $", label: "de revenus sur 28 jours", detail: "70 abonnements actifs, 53 essais en cours" },
    { value: "1 M", label: "de vues Instagram en 30 jours", detail: "des reels à 100 000 et 200 000 vues" },
    { value: "0 €", label: "de publicité", detail: "100 % de contenu organique, posté depuis son téléphone" },
  ],
};
