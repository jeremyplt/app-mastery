import type { Metadata } from "next";
import { PRESENTATION_VIDEO_ID } from "@/lib/presentation";
import AccompagnementContent from "./AccompagnementContent";

export const metadata: Metadata = {
  title: "Comment se passe l'accompagnement | App Mastery",
  description:
    "En 6 minutes, Jeremy te montre de l'intérieur ce qu'on fait ensemble : la communauté et les cours, les coachings de groupe, et le suivi personnel en direct avec lui sur WhatsApp.",
  openGraph: {
    title: "Comment se passe l'accompagnement App Mastery",
    description:
      "6 minutes pour voir de l'intérieur ce qu'on fait ensemble : communauté, cours, coachings de groupe et suivi personnel avec Jeremy.",
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
