// Configuration partagée du formulaire de qualification /candidature.
// Source de vérité pour les questions, les options et la logique de scoring.

export type Choice = { value: string; label: string };

export type Question = {
  id: "q1" | "q2" | "q3" | "q4" | "q5" | "q6";
  title: string;
  type: "choice" | "text";
  options?: Choice[];
  placeholder?: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "Où en es-tu avec ton app ?",
    type: "choice",
    options: [
      { value: "idee", label: "Juste une idée" },
      { value: "dev", label: "En développement" },
      { value: "publiee-peu", label: "Publiée, peu d'utilisateurs" },
      { value: "publiee-users", label: "Publiée avec des utilisateurs" },
    ],
  },
  {
    id: "q2",
    title: "Ton objectif principal avec cette app ?",
    type: "choice",
    options: [
      { value: "business", label: "En faire un revenu, un business" },
      { value: "passion", label: "Un projet perso, une passion" },
      { value: "fun", label: "Apprendre, pour le fun" },
    ],
  },
  {
    id: "q3",
    title: "Combien tu aimerais qu'elle te rapporte par mois, idéalement ?",
    type: "choice",
    options: [
      { value: "moins-500", label: "Moins de 500€" },
      { value: "500-2000", label: "500€ - 2000€" },
      { value: "2000-5000", label: "2000€ - 5000€" },
      { value: "5000-plus", label: "5000€ et +" },
    ],
  },
  {
    id: "q4",
    title: "Tu es actuellement...",
    type: "choice",
    options: [
      { value: "salarie", label: "Salarié" },
      { value: "freelance", label: "Freelance, indépendant" },
      { value: "etudiant", label: "Étudiant" },
      { value: "entre-deux", label: "Entre deux" },
    ],
  },
  {
    id: "q5",
    title: "Qu'est-ce que tu attends de cet appel ?",
    type: "text",
    placeholder: "Dis-moi en quelques mots ce que tu veux retirer de notre échange...",
  },
  {
    id: "q6",
    title: "Combien d'heures par semaine tu peux y consacrer ?",
    type: "choice",
    options: [
      { value: "moins-2h", label: "Moins de 2h" },
      { value: "2-5h", label: "2h - 5h" },
      { value: "5-10h", label: "5h - 10h" },
      { value: "10h-plus", label: "10h et +" },
    ],
  },
];

export type CandidatureAnswers = {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
};

const REVENUE_SCORE: Record<string, number> = {
  "moins-500": 0,
  "500-2000": 15,
  "2000-5000": 25,
  "5000-plus": 30,
};

const HOURS_SCORE: Record<string, number> = {
  "moins-2h": 0,
  "2-5h": 10,
  "5-10h": 20,
  "10h-plus": 30,
};

const STAGE_SCORE: Record<string, number> = {
  idee: 0,
  dev: 5,
  "publiee-peu": 8,
  "publiee-users": 10,
};

export type Qualification = { score: number; qualified: boolean };

// Filtres durs (red flags du doc de setting) :
//  - objectif passion / fun  -> pas pour nous (on vend de la monétisation)
//  - revenu visé < 500€       -> pas assez sérieux
//  - moins de 2h / semaine    -> pas assez de temps
export function qualify(a: CandidatureAnswers): Qualification {
  const goalOk = a.q2 === "business";
  const revenueOk = a.q3 !== "moins-500";
  const hoursOk = a.q6 !== "moins-2h";

  const qualified = goalOk && revenueOk && hoursOk;

  const score =
    (goalOk ? 30 : 0) +
    (REVENUE_SCORE[a.q3] ?? 0) +
    (HOURS_SCORE[a.q6] ?? 0) +
    (STAGE_SCORE[a.q1] ?? 0);

  return { score, qualified };
}

export function isValidAnswer(q: Question, value: string): boolean {
  if (q.type === "text") return value.trim().length >= 5;
  return Boolean(q.options?.some((o) => o.value === value));
}
