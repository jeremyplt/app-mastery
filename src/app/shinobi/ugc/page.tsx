import type { Metadata } from "next";
import UgcContent from "./UgcContent";

export const metadata: Metadata = {
  title: "Les vidéos UGC qui ont fait connaître Shinobi Japanese | App Mastery",
  description:
    "Six vidéos de créateurs de contenu briefés par nous, plusieurs millions de vues cumulées sur TikTok, Instagram Reels et YouTube Shorts. Le contenu qui envoie les installations sur Shinobi Japanese.",
  openGraph: {
    title: "Les vidéos UGC qui ont fait connaître Shinobi Japanese",
    description: "Plusieurs millions de vues cumulées sur TikTok, Instagram Reels et YouTube Shorts.",
  },
};

export default function ShinobiUgcPage() {
  return <UgcContent />;
}
