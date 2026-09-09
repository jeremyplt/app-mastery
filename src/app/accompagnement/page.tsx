import type { Metadata } from "next";
import AccompagnementContent from "./AccompagnementContent";

export const metadata: Metadata = {
  title: "L'accompagnement App Mastery, expliqué en vidéo",
  description:
    "Comment se passe l'accompagnement App Mastery, semaine par semaine : les appels, les audits, la communauté, et ce que tu as à la fin. Dix minutes pour tout comprendre avant ton appel.",
  openGraph: {
    title: "L'accompagnement App Mastery, expliqué en vidéo",
    description: "Comment ça se passe, semaine par semaine, et ce que tu as à la fin.",
    images: [{ url: "/jeremy-bureau.jpg", width: 1920, height: 1080 }],
  },
};

export default function AccompagnementPage() {
  return <AccompagnementContent />;
}
