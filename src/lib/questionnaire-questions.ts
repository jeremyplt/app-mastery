// Questions du questionnaire de démarrage des élèves, reprises du document
// « KICK-START APP MASTERY » de Jeremy. Fichier sans dépendance serveur : il est
// lu aussi par la page du questionnaire et la fiche élève (navigateur).
//
// Types de réponse :
// - choice : un choix parmi `choices` ;
// - text / long : texte court / long ;
// - list : plusieurs éléments, un par ligne ;
// - fields : plusieurs champs nommés (réponses rangées sous `${id}.${champ}`).

export type QuestionField = { id: string; label: string; placeholder?: string; url?: boolean };

export type Question = {
  id: string;
  label: string;
  type: "choice" | "text" | "long" | "list" | "fields";
  choices?: string[];
  fields?: QuestionField[];
  required?: boolean;
  placeholder?: string;
};

export const QUESTIONS: Question[] = [
  { id: "app", label: "App", type: "text", placeholder: "Nom de ton application", required: true },
  {
    id: "platforms",
    label: "Est-ce que l'application est sur iOS et Android ?",
    type: "choice",
    choices: ["Oui, sur iOS et Android", "Seulement sur iOS", "Seulement sur Android", "Pas encore publiée"],
    required: true,
  },
  {
    id: "app_links",
    label: "Liens vers l'application",
    type: "fields",
    fields: [
      { id: "ios", label: "iOS", placeholder: "https://apps.apple.com/...", url: true },
      { id: "android", label: "Android", placeholder: "https://play.google.com/...", url: true },
    ],
  },
  {
    id: "tools",
    label: "Quels sont les outils utilisés ? (Firebase, RevenueCat, Sentry, PostHog, etc.)",
    type: "list",
    placeholder: "Un outil par ligne",
  },
  {
    id: "ad_networks",
    label: "Quelles sont les régies publicitaires utilisées ? (Meta, TikTok, etc.)",
    type: "list",
    placeholder: "Une régie par ligne",
  },
  {
    id: "socials",
    label: "Liens vers les comptes de réseaux sociaux",
    type: "fields",
    fields: [
      { id: "instagram", label: "Instagram", url: true },
      { id: "tiktok", label: "TikTok", url: true },
      { id: "youtube", label: "YouTube", url: true },
      { id: "facebook", label: "Facebook", url: true },
      { id: "x", label: "X", url: true },
      { id: "reddit", label: "Reddit", url: true },
      { id: "website", label: "Site web", url: true },
      { id: "other", label: "Autre", placeholder: "Autre réseau ou lien (ex. Threads, Discord...)", url: true },
    ],
  },
  {
    id: "collaborations",
    label:
      "Y a-t-il déjà eu des collaborations, UGC, ou tout autre partenariat avec des créateurs de contenu ou des entreprises ? Si oui, liste-les ci-dessous avec un lien vers le contenu.",
    type: "list",
    placeholder: "Une collaboration par ligne, avec son lien",
  },
  { id: "competitors", label: "À ta connaissance, qui sont tes principaux concurrents ?", type: "list", placeholder: "Un concurrent par ligne" },
  { id: "inspirations", label: "Quelles sont les applications qui t'ont inspiré ?", type: "list", placeholder: "Une application par ligne" },
  {
    id: "other",
    label:
      "Y a-t-il d'autres choses à mentionner concernant l'application ? Notamment ce qui a déjà été mis en place, les essais qui n'ont pas marché ou toute autre expérience passée qui m'aiderait à comprendre l'état actuel de l'application ?",
    type: "long",
  },
];

// Accès à envoyer en lecture seule (partie « À faire » du document).
export const ACCESS_EMAIL = "jeremypltpro@gmail.com";
export const ACCESS_TODO = [
  "Tous les outils de monitoring et d'analytics (PostHog, Sentry, RevenueCat, etc.)",
  "Les régies publicitaires utilisées (TikTok Ads, Meta Ads, etc.)",
  "App Store Connect et Google Play Console",
];
// Réponse « accès envoyés » (case à cocher en fin de questionnaire).
export const ACCESS_ANSWER_ID = "access_sent";

// Toutes les clés de réponse possibles, avec leur libellé lisible (pour la
// fiche et l'email d'alerte).
export function answerEntries(answers: Record<string, string>): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  for (const q of QUESTIONS) {
    if (q.type === "fields") {
      const parts = (q.fields ?? []).filter((f) => answers[`${q.id}.${f.id}`]).map((f) => `${f.label} : ${answers[`${q.id}.${f.id}`]}`);
      if (parts.length) out.push({ label: q.label, value: parts.join("\n") });
    } else if (answers[q.id]) {
      out.push({ label: q.label, value: answers[q.id] });
    }
  }
  if (answers[ACCESS_ANSWER_ID]) out.push({ label: `Accès en lecture seule envoyés à ${ACCESS_EMAIL}`, value: answers[ACCESS_ANSWER_ID] });
  return out;
}
