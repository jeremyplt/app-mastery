import type { Metadata } from "next";
import { WASSIM } from "@/lib/temoignages";
import WassimContent from "./WassimContent";

export const metadata: Metadata = {
  title: `${WASSIM.firstName}, ${WASSIM.age} ans : ${WASSIM.headline} | App Mastery`,
  description:
    "Wassim avait une app qui ne vendait pas. Deux mois après le début de l'accompagnement : 7 269 $ en 14 jours, dont 1 700 $ en une seule journée, 100 % en organique. Son histoire, ses chiffres et ce qu'on a changé ensemble.",
  openGraph: {
    title: `${WASSIM.firstName} : ${WASSIM.headline}`,
    description:
      "De 0 à 7 269 $ en 14 jours, 1 700 $ en une seule journée, sans une seule pub. Le podcast complet en vidéo.",
    images: [{ url: WASSIM.poster, width: 1280, height: 720 }],
  },
};

export default function WassimPage() {
  return <WassimContent />;
}
