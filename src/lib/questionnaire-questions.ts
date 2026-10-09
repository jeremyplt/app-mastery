// Questions du questionnaire de démarrage des élèves. Fichier sans dépendance
// serveur : il est lu aussi par la fiche élève (côté navigateur).

export type Question = {
  id: string;
  label: string;
  type: "choice" | "text" | "long";
  choices?: string[];
  required?: boolean;
  placeholder?: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "stage",
    label: "Où en est ton projet d'app aujourd'hui ?",
    type: "choice",
    choices: ["Je n'ai pas encore d'idée", "J'ai une idée", "L'app est en cours de création", "L'app est déjà publiée"],
    required: true,
  },
  { id: "app", label: "Le nom de ton app (ou de ton idée)", type: "text", placeholder: "Ex. VocabRecall" },
  { id: "store_link", label: "Le lien App Store ou Google Play, si elle est publiée", type: "text", placeholder: "https://apps.apple.com/..." },
  {
    id: "level",
    label: "Ton niveau avec les outils d'IA et le code",
    type: "choice",
    choices: ["Débutant complet", "J'ai déjà testé quelques outils", "Je suis à l'aise"],
    required: true,
  },
  {
    id: "hours",
    label: "Combien d'heures par semaine peux-tu y consacrer ?",
    type: "choice",
    choices: ["Moins de 5 h", "5 à 10 h", "10 à 20 h", "Plus de 20 h"],
    required: true,
  },
  { id: "goal", label: "Ton objectif de revenus avec ton app dans 6 mois", type: "text", placeholder: "Ex. 2 000 € par mois", required: true },
  { id: "blocker", label: "Qu'est-ce qui te bloque le plus aujourd'hui ?", type: "long", required: true },
  { id: "expectations", label: "Qu'attends-tu en priorité de l'accompagnement ?", type: "long", required: true },
  { id: "whatsapp", label: "Ton numéro WhatsApp pour le suivi", type: "text", placeholder: "+33 6 12 34 56 78", required: true },
];

