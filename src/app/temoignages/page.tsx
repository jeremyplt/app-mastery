import type { Metadata } from "next";
import TemoignagesContent from "./TemoignagesContent";

export const metadata: Metadata = {
  title: "Les résultats des membres de l'accompagnement | App Mastery",
  description:
    "Ce que donne l'accompagnement, en argent : Wassim (7 269 $ en 14 jours) et Florian (1 793 $ en 28 jours) racontent tout en vidéo, plus les messages que m'envoient les élèves.",
  openGraph: {
    title: "Les résultats des membres de l'accompagnement App Mastery",
    description:
      "Les témoignages vidéo de Wassim et Florian, et les messages des élèves. Tout est vérifiable.",
    images: [{ url: "/wassim-poster-v5.jpg", width: 1280, height: 720 }],
  },
};

export default function TemoignagesPage() {
  return <TemoignagesContent />;
}
