import type { Metadata } from "next";
import ReelsContent from "./ReelsContent";

export const metadata: Metadata = {
  title: "Les reels qui ont fait connaître Shinobi Japanese | App Mastery",
  description:
    "Trois vidéos, plus de 6 millions de vues, zéro euro de pub. Le contenu organique qui envoie les installations sur Shinobi Japanese chaque jour.",
  openGraph: {
    title: "Les reels qui ont fait connaître Shinobi Japanese",
    description: "Trois vidéos, plus de 6 millions de vues, zéro euro de pub.",
  },
};

export default function ShinobiReelsPage() {
  return <ReelsContent />;
}
