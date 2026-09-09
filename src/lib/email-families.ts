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
  { id: "vsl", label: "Accès conférence (VSL)", tags: ["vsl-conference"] },
  { id: "plan-action", label: "Plan d'action", tags: ["plan-action"] },
  { id: "appel", label: "Appel découverte (formulaire)", tags: ["appel-decouverte"] },
  { id: "candidature", label: "Candidature", tags: ["candidature-qualifie", "candidature-non-qualifie", "candidature-admin"] },
  { id: "guides", label: "Guides gratuits", tags: ["metabase", "piscine-epitech", "prompt-50-saas", "workflow-make", "monetisation", "openclaw"] },
  { id: "membres", label: "Espace membres", tags: ["magic-link", "welcome-essentiel", "welcome-complet", "welcome-vip"] },
  { id: "admin", label: "Admin", tags: ["admin-invitation"] },
];

export const EMAIL_LABELS: Record<string, string> = {
  "seq-b-1-confirm": "B1 · Avant ton appel",
  "seq-b-2-veille": "B2 · Demain",
  "seq-b-3-jourj": "B3 · C'est aujourd'hui",
  "vsl-conference": "Accès à la conférence",
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
      { tag: "seq-b-1-confirm", label: "B1", subject: "Avant ton appel", when: "Tout de suite", status: "live", note: "Paragraphe Nolan ou Jeremy selon le calendrier" },
      { tag: "seq-b-2-veille", label: "B2", subject: "Demain", when: "La veille à 18 h", status: "live", note: "Programmé dans Brevo dès que l'appel est à moins de 72 h" },
      { tag: "seq-b-3-jourj", label: "B3", subject: "C'est aujourd'hui", when: "Le jour J à 8 h", status: "live", note: "La veille à 20 h si l'appel est avant 10 h" },
    ],
  },
  {
    id: "vsl",
    family: "vsl",
    title: "Conférence (VSL)",
    trigger: "Optin sur /conference (prénom, email, téléphone, 4 questions)",
    exit: "Séquence A prévue : s'arrête dès qu'un rendez-vous est pris.",
    steps: [
      { tag: "vsl-conference", label: "A0", subject: "Ton accès à la conférence privée", when: "Tout de suite", status: "live" },
      { tag: "seq-a-1", label: "A1", subject: "Selon le palier de visionnage", when: "J0 + 3 h", status: "planned" },
      { tag: "seq-a-2", label: "A2", subject: "Histoire de Jeremy", when: "J1 · 9 h", status: "planned" },
      { tag: "seq-a-3", label: "A3", subject: "Florian, de 0 à 1 793 $", when: "J2 · 9 h", status: "planned" },
      { tag: "seq-a-4", label: "A4", subject: "La vidéo accompagnement", when: "J3 · 9 h", status: "planned" },
      { tag: "seq-a-5", label: "A5", subject: "Objection : pas d'idée", when: "J4 · 9 h", status: "planned" },
      { tag: "seq-a-6", label: "A6", subject: "Objection : l'IA code mal", when: "J5 · 9 h", status: "planned" },
      { tag: "seq-a-7", label: "A7", subject: "10 h par semaine", when: "J6 · 9 h", status: "planned" },
      { tag: "seq-a-8", label: "A8", subject: "Dernier message", when: "J7 · 9 h", status: "planned" },
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
