// Familles d'emails transactionnels envoyés par le site, identifiées par le
// tag Brevo. Sert à l'admin (/admin/emails) pour lire les envois en clair.

export type EmailFamily = {
  id: string;
  label: string;
  // Préfixes ou tags exacts Brevo rattachés à cette famille.
  tags: string[];
};

export const EMAIL_FAMILIES: EmailFamily[] = [
  { id: "seq-b", label: "Séquence B · avant l'appel", tags: ["seq-b-1-confirm", "seq-b-2-veille", "seq-b-3-jourj"] },
  { id: "vsl", label: "Conférence (VSL) · séquence A", tags: ["vsl-conference", "seq-a-1-v1", "seq-a-1-v2", "seq-a-1-v3", "seq-a-2", "seq-a-3", "seq-a-4", "seq-a-5", "seq-a-6", "seq-a-7", "seq-a-8"] },
  { id: "plan-action", label: "Plan d'action", tags: ["plan-action"] },
  { id: "appel", label: "Appel découverte (formulaire)", tags: ["appel-decouverte"] },
  { id: "candidature", label: "Candidature", tags: ["candidature-qualifie", "candidature-non-qualifie", "candidature-admin"] },
  { id: "guides", label: "Guides gratuits", tags: ["metabase", "piscine-epitech", "prompt-50-saas", "workflow-make", "monetisation", "openclaw"] },
  { id: "membres", label: "Espace membres", tags: ["magic-link", "welcome-essentiel", "welcome-complet", "welcome-vip"] },
  { id: "admin", label: "Admin", tags: ["admin-invitation"] },
];

export const EMAIL_LABELS: Record<string, string> = {
  "seq-b-1-confirm": "B1 · Avant ton appel de {jour}",
  "seq-b-2-veille": "B2 · Demain, tu seras à la place de Florian",
  "seq-b-3-jourj": "B3 · C'est aujourd'hui à {heure}",
  "vsl-conference": "A0 · Accès à la conférence",
  "seq-a-1-v1": "A1 · Tu ne l'as pas encore ouverte",
  "seq-a-1-v2": "A1 · Tu t'es arrêté juste avant le meilleur",
  "seq-a-1-v3": "A1 · Voilà ce qui se passe après le bouton",
  "seq-a-2": "A2 · Pourquoi je n'ai jamais lancé de SaaS",
  "seq-a-3": "A3 · 1 793 $ en 28 jours, sans savoir coder",
  "seq-a-4": "A4 · Voilà ce qu'il y a dans les trois mois",
  "seq-a-5": "A5 · Tu n'as pas d'idée d'app ? Tant mieux",
  "seq-a-6": "A6 · Le code pourri de mes applications",
  "seq-a-7": "A7 · 10 heures par semaine, sinon ce n'est pas pour toi",
  "seq-a-8": "A8 · Mon dernier message, et une mauvaise nouvelle",
  "plan-action": "Plan d'action",
  "appel-decouverte": "Appel découverte",
  "candidature-qualifie": "Candidature qualifiée",
  "candidature-non-qualifie": "Candidature non qualifiée",
  "candidature-admin": "Alerte candidature (admin)",
  "magic-link": "Lien de connexion",
  "admin-invitation": "Invitation admin",
};

// Tag Brevo -> famille + libellé lisible. Les tags de test ("-test")
// gardent leur famille avec la mention test.
export function describeTag(tag: string): { family: EmailFamily | null; label: string; test: boolean } {
  const test = tag.endsWith("-test");
  const base = test ? tag.slice(0, -5) : tag;
  const family = EMAIL_FAMILIES.find((f) => f.tags.some((t) => base === t || base.startsWith(t + "-"))) ?? null;
  const label =
    EMAIL_LABELS[base] ??
    (base.startsWith("welcome-") ? `Bienvenue (${base.replace("welcome-", "")})` : base || "Sans tag");
  return { family, label: test ? `${label} (test)` : label, test };
}

// Schéma des automatisations : ce qui part, après quel déclencheur, et
// quand. "live" = en place dans le code ; "planned" = prévu, pas encore
// codé (séquence A). Affiché en haut de /admin/crm/emails.
export type FlowStep = {
  tag: string;
  label: string;
  subject: string;
  when: string;
  status: "live" | "planned";
  note?: string;
  // Tag à utiliser pour l'aperçu quand l'étape regroupe plusieurs tags.
  preview?: string;
};

export type Flow = {
  id: string;
  family: string;
  title: string;
  trigger: string;
  exit?: string;
  steps: FlowStep[];
};

export const FLOWS: Flow[] = [
  {
    id: "seq-b",
    family: "seq-b",
    title: "Séquence B · rendez-vous pris",
    trigger: "Réservation Calendly (webhook), calendriers masteryapp-jeremy et jeremypltpro",
    exit: "Annulation ou report Calendly : les rappels programmés sont supprimés, puis reprogrammés sur le nouveau créneau.",
    steps: [
      { tag: "seq-b-1-confirm", label: "B1", subject: "{prénom}, avant ton appel de {jour}", when: "Tout de suite", status: "live", note: "Paragraphe Nolan ou Jeremy selon le calendrier" },
      { tag: "seq-b-2-veille", label: "B2", subject: "Demain, tu seras à la place de Florian", when: "La veille à 18 h", status: "live", note: "Programmé dans Brevo dès que l'appel est à moins de 72 h" },
      { tag: "seq-b-3-jourj", label: "B3", subject: "{prénom}, c'est aujourd'hui à {heure}", when: "Le jour J à 8 h", status: "live", note: "La veille à 20 h si l'appel est avant 10 h" },
    ],
  },
  {
    id: "vsl",
    family: "vsl",
    title: "Conférence (VSL) · séquence A",
    trigger: "Optin sur /conference (prénom, email, téléphone, 4 questions). La séquence A démarre si le lead est qualifié.",
    exit: "Rendez-vous pris (Calendly) ou lead disqualifié : plus aucun envoi. Un passage toutes les 15 minutes (Supabase pg_cron), au plus un email par lead et par jour, jamais la nuit.",
    steps: [
      { tag: "vsl-conference", label: "A0", subject: "Ton accès à la conférence privée", when: "Tout de suite", status: "live" },
      { tag: "seq-a-1-v1", label: "A1", subject: "{prénom}, tu ne l'as pas encore ouverte", when: "J0 + 3 h", status: "live", note: "Si la vidéo n'a jamais été lancée" },
      { tag: "seq-a-1-v2", label: "A1'", subject: "Tu t'es arrêté juste avant le meilleur", when: "J0 + 3 h", status: "live", note: "Si arrêt avant 18:30, le lien reprend où il en était" },
      { tag: "seq-a-1-v3", label: "A1''", subject: "{prénom}, voilà ce qui se passe après le bouton", when: "J0 + 3 h", status: "live", note: "Si arrivé au bouton sans réserver" },
      { tag: "seq-a-2", label: "A2", subject: "Pourquoi je n'ai jamais lancé de SaaS", when: "J1 · 9 h", status: "live" },
      { tag: "seq-a-3", label: "A3", subject: "1 793 $ en 28 jours, sans savoir coder", when: "J2 · 9 h", status: "live" },
      { tag: "seq-a-4", label: "A4", subject: "{prénom}, voilà ce qu'il y a dans les trois mois", when: "J3 · 9 h", status: "live" },
      { tag: "seq-a-5", label: "A5", subject: "Tu n'as pas d'idée d'app ? Tant mieux", when: "J4 · 9 h", status: "live" },
      { tag: "seq-a-6", label: "A6", subject: "Le code pourri de mes applications", when: "J5 · 9 h", status: "live" },
      { tag: "seq-a-7", label: "A7", subject: "{prénom}, 10 heures par semaine, sinon ce n'est pas pour toi", when: "J6 · 9 h", status: "live" },
      { tag: "seq-a-8", label: "A8", subject: "Mon dernier message, et une mauvaise nouvelle", when: "J7 · 9 h", status: "live" },
    ],
  },
  {
    id: "plan-action",
    family: "plan-action",
    title: "Plan d'action",
    trigger: "Optin sur /plan-action",
    steps: [{ tag: "plan-action", label: "1", subject: "Ton Plan d'Action est prêt", when: "Tout de suite", status: "live" }],
  },
  {
    id: "appel",
    family: "appel",
    title: "Appel découverte (formulaire)",
    trigger: "Formulaire /appel rempli sans créneau choisi",
    steps: [{ tag: "appel-decouverte", label: "1", subject: "Ton appel découverte est presque réservé", when: "Tout de suite", status: "live" }],
  },
  {
    id: "candidature",
    family: "candidature",
    title: "Candidature",
    trigger: "Formulaire de candidature envoyé",
    steps: [
      { tag: "candidature-qualifie", label: "1", subject: "Ta candidature est validée, réserve ton appel", when: "Tout de suite", status: "live" },
      { tag: "candidature-non-qualifie", label: "1'", subject: "Merci pour ta candidature", when: "Tout de suite", status: "live" },
      { tag: "candidature-admin", label: "Admin", subject: "[Candidature ...] Prénom (score)", when: "Tout de suite", status: "live", note: "Alerte interne" },
    ],
  },
  {
    id: "guides",
    family: "guides",
    title: "Guides gratuits",
    trigger: "Optin sur une page guide (Metabase, Piscine Epitech, prompts SaaS, Make, monétisation, OpenClaw)",
    steps: [{ tag: "guides", label: "1", subject: "Livraison du guide", when: "Tout de suite", status: "live", preview: "metabase" }],
  },
  {
    id: "membres",
    family: "membres",
    title: "Espace membres",
    trigger: "Paiement reçu, ou demande de lien de connexion",
    steps: [
      { tag: "welcome", label: "1", subject: "Bienvenue (selon le plan)", when: "Au paiement", status: "live", preview: "welcome-essentiel" },
      { tag: "magic-link", label: "2", subject: "Ton lien de connexion App Mastery", when: "À la demande", status: "live" },
    ],
  },
];
