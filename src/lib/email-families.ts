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
