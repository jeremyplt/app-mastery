// Ressentis d'appels : avant chaque appel avec un élève, Jeremy note ce qu'il
// craint et comment il pense que ça va se passer ; après, comment ça s'est
// vraiment passé. Le bilan met la prévision et la réalité côte à côte.
// Table call_journal (scripts/call-journal.sql), propriétaire seulement.

export type Parole = "moi" | "equilibre" | "eleve";
export type Crainte = "oui" | "en_partie" | "non";
export type Half = "avant" | "apres";

export type JournalEntry = {
  id: string;
  event_key: string | null;
  student_id: string | null;
  call_at: string;
  label: string | null;
  apprehension: number | null;
  inquietude: string | null;
  prevision: number | null;
  avant_at: string | null;
  deroulement: number | null;
  duree_min: number | null;
  parole: Parole | null;
  crainte: Crainte | null;
  pourquoi: string | null;
  apres_at: string | null;
};

export const JOURNAL_COLUMNS = "id, event_key, student_id, call_at, label, apprehension, inquietude, prevision, avant_at, deroulement, duree_min, parole, crainte, pourquoi, apres_at";

export const AVANT_FIELDS = ["apprehension", "inquietude", "prevision"] as const;
export const APRES_FIELDS = ["deroulement", "duree_min", "parole", "crainte", "pourquoi"] as const;

export const PAROLE_LABELS: Record<Parole, string> = { moi: "Moi", equilibre: "Équilibré", eleve: "L'élève" };
export const CRAINTE_LABELS: Record<Crainte, string> = { oui: "Oui", en_partie: "En partie", non: "Non" };

const TEXT_MAX = 2000;

function int(v: unknown, min: number, max: number): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  const r = Math.round(n);
  return r >= min && r <= max ? r : null;
}

function text(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, TEXT_MAX);
  return t ? t : null;
}

function oneOf<T extends string>(v: unknown, allowed: readonly T[]): T | null {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

// Champs d'une moitié du formulaire, nettoyés. Une valeur absente ou invalide
// devient null : tout est facultatif, et vider un champ l'efface.
export function cleanHalf(half: Half, b: Record<string, unknown>): Partial<JournalEntry> {
  if (half === "avant") {
    return { apprehension: int(b.apprehension, 0, 10), inquietude: text(b.inquietude), prevision: int(b.prevision, 1, 5) };
  }
  return {
    deroulement: int(b.deroulement, 1, 5),
    duree_min: int(b.duree_min, 1, 600),
    parole: oneOf(b.parole, ["moi", "equilibre", "eleve"] as const),
    crainte: oneOf(b.crainte, ["oui", "en_partie", "non"] as const),
    pourquoi: text(b.pourquoi),
  };
}

export function halfFilled(half: Half, e: Partial<JournalEntry>): boolean {
  const fields: readonly string[] = half === "avant" ? AVANT_FIELDS : APRES_FIELDS;
  return fields.some((f) => {
    const v = (e as Record<string, unknown>)[f];
    return v !== null && v !== undefined && v !== "";
  });
}

// Ce qu'on écrit en base pour une moitié : ses champs, et l'heure où elle a
// été remplie la première fois (gardée si on la corrige plus tard, effacée si
// on la vide).
export function halfPatch(half: Half, b: Record<string, unknown>, existing: Partial<JournalEntry> | null, now: Date): Partial<JournalEntry> {
  const fields = cleanHalf(half, b);
  const stampKey = half === "avant" ? "avant_at" : "apres_at";
  const filled = halfFilled(half, fields);
  const previous = existing?.[stampKey] ?? null;
  return { ...fields, [stampKey]: filled ? (previous ?? now.toISOString()) : null };
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);

export type JournalStats = {
  total: number;
  apprehension: { avg: number | null; n: number };
  // Seulement les appels notés avant ET après : la comparaison reste juste.
  ecart: { prevision: number | null; deroulement: number | null; n: number; mieux: number; pareil: number; moins: number };
  crainte: Record<Crainte, number>;
  duree: { avg: number | null; n: number };
  parole: Record<Parole, number>;
};

export function journalStats(entries: JournalEntry[]): JournalStats {
  const num = (xs: (number | null)[]) => xs.filter((x): x is number => typeof x === "number");
  const appr = num(entries.map((e) => e.apprehension));
  const both = entries.filter((e) => e.prevision !== null && e.deroulement !== null);
  const duree = num(entries.map((e) => e.duree_min));
  const crainte: Record<Crainte, number> = { oui: 0, en_partie: 0, non: 0 };
  const parole: Record<Parole, number> = { moi: 0, equilibre: 0, eleve: 0 };
  for (const e of entries) {
    if (e.crainte) crainte[e.crainte]++;
    if (e.parole) parole[e.parole]++;
  }
  return {
    total: entries.length,
    apprehension: { avg: avg(appr), n: appr.length },
    ecart: {
      prevision: avg(both.map((e) => e.prevision as number)),
      deroulement: avg(both.map((e) => e.deroulement as number)),
      n: both.length,
      mieux: both.filter((e) => (e.deroulement as number) > (e.prevision as number)).length,
      pareil: both.filter((e) => e.deroulement === e.prevision).length,
      moins: both.filter((e) => (e.deroulement as number) < (e.prevision as number)).length,
    },
    crainte,
    duree: { avg: avg(duree), n: duree.length },
    parole,
  };
}

// 4.25 -> "4,3" ; 4 -> "4"
export function frNumber(n: number): string {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1).replace(".", ",");
}

const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;

// Le bilan en quelques phrases simples, seulement avec ce qui est rempli.
export function statsLines(s: JournalStats): string[] {
  const lines: string[] = [];
  if (s.apprehension.avg !== null) {
    lines.push(`Appréhension moyenne avant l'appel : ${frNumber(s.apprehension.avg)}/10 (${plural(s.apprehension.n, "appel", "appels")}).`);
  }
  if (s.ecart.n > 0 && s.ecart.prevision !== null && s.ecart.deroulement !== null) {
    const detail = [s.ecart.mieux && `mieux que prévu ${s.ecart.mieux} fois`, s.ecart.pareil && `comme prévu ${s.ecart.pareil} fois`, s.ecart.moins && `moins bien ${s.ecart.moins} fois`]
      .filter(Boolean)
      .join(", ");
    lines.push(
      `Tu prévoyais en moyenne ${frNumber(s.ecart.prevision)}/5, ça s'est passé ${frNumber(s.ecart.deroulement)}/5 (${plural(s.ecart.n, "appel noté", "appels notés")} avant et après${detail ? ` : ${detail}` : ""}).`,
    );
  }
  const c = s.crainte;
  if (c.oui + c.en_partie + c.non > 0) {
    lines.push(`Ta crainte s'est réalisée : oui ${c.oui}, en partie ${c.en_partie}, non ${c.non}.`);
  }
  if (s.duree.avg !== null) {
    lines.push(`Durée réelle moyenne : ${Math.round(s.duree.avg)} min (${plural(s.duree.n, "appel", "appels")}).`);
  }
  const p = s.parole;
  if (p.moi + p.equilibre + p.eleve > 0) {
    lines.push(`Qui a le plus parlé : toi ${p.moi}, équilibré ${p.equilibre}, l'élève ${p.eleve}.`);
  }
  return lines;
}

// Dernier ressenti du même élève avant cet appel (pas celui de l'appel lui-même).
export function previousEntry(entries: JournalEntry[], studentId: string, before: string, excludeKey?: string | null): JournalEntry | null {
  const t = Date.parse(before);
  const list = entries
    .filter((e) => e.student_id === studentId && Date.parse(e.call_at) < t && !(excludeKey && e.event_key === excludeKey))
    .sort((a, b) => Date.parse(b.call_at) - Date.parse(a.call_at));
  return list[0] ?? null;
}

const shortDate = (iso: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" }).format(new Date(iso));

// Une ligne pour la carte de l'appel suivant : prévision, réalité, crainte.
// null quand l'appel précédent n'a ni note ni crainte renseignée.
export function previousLine(e: JournalEntry): string | null {
  const parts: string[] = [];
  if (e.prevision !== null && e.deroulement !== null) parts.push(`tu prévoyais ${e.prevision}/5, ça s'est passé ${e.deroulement}/5`);
  else if (e.deroulement !== null) parts.push(`ça s'est passé ${e.deroulement}/5`);
  else if (e.prevision !== null) parts.push(`tu prévoyais ${e.prevision}/5`);
  if (e.crainte) parts.push(`crainte réalisée : ${CRAINTE_LABELS[e.crainte].toLowerCase()}`);
  if (!parts.length) return null;
  return `Dernier appel (${shortDate(e.call_at)}) : ${parts.join(", ")}.`;
}
