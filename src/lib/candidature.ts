// Configuration partagée du formulaire de qualification /candidature.
// Source de vérité pour les questions, les options et la logique de scoring.

export type Choice = { value: string; label: string };

export type Question = {
  id: "q1" | "q2" | "q3" | "q4" | "q5" | "q6";
  title: string;
  type: "choice" | "text";
  options?: Choice[];
  placeholder?: string;
  // Si vrai, l'option "autre" ouvre un champ libre ; la réponse stockée
  // devient "autre: <texte>".
  allowOther?: boolean;
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "Où en es-tu avec ton app ?",
    type: "choice",
    options: [
      { value: "pas-idee", label: "Pas encore d'idée, je veux saisir l'opportunité" },
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
      { value: "peu-importe", label: "Gagner de l'argent n'est pas ma priorité" },
    ],
  },
  {
    id: "q4",
    title: "Tu es actuellement...",
    type: "choice",
    allowOther: true,
    options: [
      { value: "salarie", label: "Salarié" },
      { value: "freelance", label: "Freelance, indépendant" },
      { value: "entrepreneur", label: "Entrepreneur" },
      { value: "etudiant", label: "Étudiant" },
      { value: "chomage", label: "Au chômage, sans emploi" },
      { value: "retraite", label: "Retraité" },
      { value: "autre", label: "Autre" },
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
  "peu-importe": 0,
  "moins-500": 8,
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
  "pas-idee": 0,
  idee: 0,
  dev: 5,
  "publiee-peu": 8,
  "publiee-users": 10,
};

export type BudgetReady = "oui" | "non" | null;

// rescue = true : disqualifié uniquement sur la motivation argent, mais on
// peut le rattraper en lui demandant s'il a un budget à allouer.
export type Qualification = { score: number; qualified: boolean; rescue: boolean };

// Filtres durs :
//  - "l'argent n'est pas ma priorité" (Q3) -> rattrapable via le budget
//  - moins de 2h / semaine (Q6)             -> pas assez de temps (non rattrapable)
// Q2 (objectif) et Q4 (situation) sont contextuels, ils ne filtrent pas :
// un projet perso/passion qui vise quand même un revenu reste qualifié.
export function qualify(a: CandidatureAnswers, budgetReady: BudgetReady = null): Qualification {
  const wantsMoney = a.q3 !== "peu-importe";
  const hoursOk = a.q6 !== "moins-2h";

  let qualified = wantsMoney && hoursOk;
  let rescue = false;

  // Disqualifié seulement à cause de la motivation argent, mais assez de temps :
  // on tente un rattrapage sur le budget.
  if (!qualified && hoursOk && !wantsMoney) {
    if (budgetReady === "oui") qualified = true;
    else if (budgetReady === "non") qualified = false;
    else rescue = true; // pas encore répondu
  }

  // L'objectif "business" reste un signal positif pour trier les leads.
  const businessGoal = a.q2 === "business";

  const score =
    (businessGoal ? 20 : 0) +
    (REVENUE_SCORE[a.q3] ?? 0) +
    (HOURS_SCORE[a.q6] ?? 0) +
    (STAGE_SCORE[a.q1] ?? 0) +
    (budgetReady === "oui" ? 15 : 0);

  return { score, qualified, rescue };
}

export function isValidAnswer(q: Question, value: string): boolean {
  if (q.type === "text") return value.trim().length >= 5;
  // "autre: <texte>" : valide si un texte libre suit le préfixe.
  if (q.allowOther && /^autre:\s*\S/.test(value)) return true;
  // "autre" seul (sans texte) n'est pas une réponse valide.
  const opts = q.options?.filter((o) => !(q.allowOther && o.value === "autre"));
  return Boolean(opts?.some((o) => o.value === value));
}
