import type { Metadata } from "next";
import TemoignagesContent from "./TemoignagesContent";

export const metadata: Metadata = {
  title: "Les résultats de mes élèves | App Mastery",
  description:
    "Ce que donne l'accompagnement, en argent : ma courbe de revenus, le tableau de bord de Florian (1 793 $ en 28 jours) et les messages que m'envoient les élèves.",
  openGraph: {
    title: "Les résultats de mes élèves",
    description:
      "Ma courbe de revenus, le tableau de bord de Florian et les messages des élèves. Tout est vérifiable.",
    images: [{ url: "/eleves-appel.jpg", width: 1200, height: 400 }],
  },
};

export default function TemoignagesPage() {
  return <TemoignagesContent />;
}
