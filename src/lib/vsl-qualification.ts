// Questions de pré-qualification posées à l'opt-in de la conférence (VSL),
// juste après le contact et avant l'accès à la vidéo.
//
// IMPORTANT : les libellés (questions ET options) doivent correspondre
// EXACTEMENT aux questions custom de l'événement Calendly
// masteryapp-jeremy/30min : Calendly pré-remplit les boutons radio via les
// params a2/a3/a5 uniquement si le texte envoyé est identique à l'option.

export type VslQuestion = {
  id: "age" | "profession" | "objectif" | "invest";
  title: string;
  options: string[];
};

export const VSL_QUESTIONS: VslQuestion[] = [
  {
    id: "age",
    title: "Quel âge as-tu ?",
    options: ["Moins de 18 ans", "18-25", "25-35", "35-45", "Plus de 45 ans"],
  },
  {
    id: "profession",
    title: "Quelle est ta profession/activité actuelle ?",
    options: [
      "Salarié(e) en CDI ou CDD",
      "Profession libérale",
      "Indépendant(e) / Freelance",
      "Chef d'entreprise",
      "Étudiant",
      "Sans emploi / sans revenus",
    ],
  },
  {
    id: "objectif",
    title:
      "Quelle situation désires-tu avec ce business des apps mobiles dans les 3 à 6 prochains mois ?",
    options: [
      "Générer 1,000€ à 3,000€/mois NET en complément de mon salaire (ou juste pour démarrer)",
      "Atteindre +3,000/mois NET pour envisager de quitter mon job ou changer de vie",
      "Dépasser 5,000€/mois NET et viser l'indépendance totale",
      "Construire un business principal dépassant 10,000€/mois NET sur le long-terme",
    ],
  },
  // Question d'engagement, volontairement en dernier : après 3 réponses
  // faciles, le prospect est engagé (micro-oui) et déclare son intention
  // d'investir AVANT de voir le pitch de la VSL. Pas de question Calendly
  // correspondante : sert uniquement au tri (Meta Lead, Brevo, CRM).
  {
    id: "invest",
    title: "Es-tu prêt(e) à investir sur toi pour lancer ton app et générer des revenus ?",
    options: [
      "Oui, je suis prêt(e) à investir sur moi pour avancer plus vite",
      "Non, je veux tout faire seul(e), sans rien investir",
    ],
  },
];

export const INVEST_YES = VSL_QUESTIONS[3].options[0];

export type VslAnswers = {
  age: string;
  profession: string;
  objectif: string;
  invest: string;
};

// Filtres durs : les mineurs (pas de budget, pas de capacité à contracter)
// et ceux qui refusent d'investir sur eux (ne paieront jamais un
// accompagnement). "Sans emploi / sans revenus" reste qualifié : chômage,
// RSA, économies, beaucoup de temps libre — c'est une bonne audience.
// L'event Meta Lead ne part que pour les leads qualifiés : Meta n'optimise
// le ciblage que sur les bons profils.
export function qualifyVslLead(answers: VslAnswers): boolean {
  return answers.age !== "Moins de 18 ans" && answers.invest === INVEST_YES;
}

// Persistance locale : ré-injectées dans le popup Calendly de la VSL
// (params a2/a3/a5) pour que le prospect ne retape jamais ses réponses.
const KEY = "vsl_qualification";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours, aligné sur optin_contact

export function saveVslAnswers(answers: VslAnswers): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...answers, savedAt: Date.now() }));
  } catch {
    // localStorage indisponible : Calendly posera les questions lui-même.
  }
}

export function loadVslAnswers(): VslAnswers | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as VslAnswers & { savedAt: number };
    if (!data.age || !data.profession || !data.objectif || !data.invest) return null;
    if (Date.now() - data.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return {
      age: data.age,
      profession: data.profession,
      objectif: data.objectif,
      invest: data.invest,
    };
  } catch {
    return null;
  }
}
