import type { Metadata } from "next";
import { PRESENTATION_VIDEO_ID } from "@/lib/presentation";
import AccompagnementContent from "./AccompagnementContent";

export const metadata: Metadata = {
  title: "Comment se passe l'accompagnement | App Mastery",
  description:
    "En 6 minutes, Jeremy te montre de l'intérieur ce qu'on fait ensemble : la communauté, les cours, les coachings de groupe et le suivi de ton app jusqu'à sa sortie sur les stores.",
  openGraph: {
    title: "Comment se passe l'accompagnement App Mastery",
    description:
      "6 minutes pour voir de l'intérieur ce qu'on fait ensemble, de l'idée à la sortie de ton app sur les stores.",
    images: [
      {
        url: `https://vz-0fb759fa-b02.b-cdn.net/${PRESENTATION_VIDEO_ID}/thumbnail.jpg`,
        width: 1280,
        height: 720,
      },
    ],
  },
};

export default function AccompagnementPage() {
  return <AccompagnementContent />;
}
