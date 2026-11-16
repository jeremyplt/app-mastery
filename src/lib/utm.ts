// UTM du premier contact dans le CRM (crm_leads.utm_*).
//
// Chaque fiche garde les UTM de l'inscription qui l'a créée (ou de la première
// qui en portait), sans jamais les écraser. Pour une personne, la vidéo
// d'origine est celle de sa plus ancienne fiche qui a des UTM.

export type Utm = { utm_source: string; utm_medium: string | null; utm_campaign: string | null };

const MAX_LENGTH = 120;

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().slice(0, MAX_LENGTH);
  return v || null;
}

// UTM reçues d'un formulaire ou de Calendly. null si pas de utm_source : une
// campagne sans source ne dit pas d'où vient la personne.
export function cleanUtm(input: { source?: unknown; medium?: unknown; campaign?: unknown }): Utm | null {
  const utm_source = clean(input.source);
  if (!utm_source) return null;
  return { utm_source, utm_medium: clean(input.medium), utm_campaign: clean(input.campaign) };
}

type Touch = { created_at: string; utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null };

// UTM de la plus ancienne fiche qui en a (null si aucune).
export function firstTouch(rows: Touch[]): Utm | null {
  let best: Touch | null = null;
  for (const r of rows) {
    if (!r.utm_source) continue;
    if (!best || r.created_at < best.created_at) best = r;
  }
  return best ? { utm_source: best.utm_source!, utm_medium: best.utm_medium ?? null, utm_campaign: best.utm_campaign ?? null } : null;
}
