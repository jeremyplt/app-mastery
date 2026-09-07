import type { Metadata } from "next";
import { FLORIAN } from "@/lib/temoignages";
import FlorianContent from "./FlorianContent";

export const metadata: Metadata = {
  title: `${FLORIAN.firstName}, ${FLORIAN.age} ans : ${FLORIAN.headline} | App Mastery`,
  description:
    "Florian a créé Momentum sans savoir coder. Six semaines après la sortie : 1 793 $ de revenus en 28 jours et plus de 100 installations par jour, 100 % en organique. Son histoire, ses chiffres et ce qu'on a changé ensemble.",
  openGraph: {
    title: `${FLORIAN.firstName} : ${FLORIAN.headline}`,
    description:
      "De 0 à 1 793 $ en 28 jours, plus de 100 installations par jour, sans une seule pub. Le témoignage complet en vidéo.",
    images: [{ url: FLORIAN.photo, width: 720, height: 720 }],
  },
};

export default function FlorianPage() {
  return <FlorianContent />;
}
