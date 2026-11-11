import type { SupabaseClient } from "@supabase/supabase-js";

// Jalons du parcours cochés d'après WhatsApp (11 nov. 2026). Avant, ils ne
// bougeaient que si Jeremy cochait la fiche, et ils prenaient du retard sur les
// conversations. Seuls les jalons qu'une conversation peut prouver sont
// concernés : Kick-off vient de la réservation Calendly, Bilan et Garantie
// applicable restent à la main.
export const AUTO_MILESTONES = {
  app_published: "App publiée",
  first_sale: "Première vente",
  ten_k: "10K",
} as const;

export type AutoMilestone = keyof typeof AUTO_MILESTONES;
export const AUTO_KEYS = Object.keys(AUTO_MILESTONES) as AutoMilestone[];

// Ce que renvoie l'IA : date au format de la conversation (« 13/10 »).
export type Jalon = { jalon: AutoMilestone; date: string; preuve: string };

// Trace gardée sur la fiche (students.milestones_auto). Une fois notée, le
// jalon n'est plus jamais recoché tout seul : décoché par Jeremy, il le reste.
// source "audit" : rattrapage du 11 nov. 2026 d'après les données d'un audit.
export type MilestoneProof = { date: string | null; preuve: string; source: "whatsapp" | "audit"; at: string };

type StudentMilestones = Record<AutoMilestone, boolean> & { milestones_auto?: Record<string, MilestoneProof> | null };

export function parseJalons(raw: unknown): Jalon[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: Jalon[] = [];
  for (const r of raw as Record<string, unknown>[]) {
    const key = r?.jalon;
    if (typeof key !== "string" || !(key in AUTO_MILESTONES) || seen.has(key)) continue;
    const preuve = typeof r.preuve === "string" ? r.preuve.replace(/\s*—\s*/g, ", ").replace(/\s+/g, " ").trim().slice(0, 200) : "";
    if (!preuve) continue;
    seen.add(key);
    out.push({ jalon: key as AutoMilestone, date: typeof r.date === "string" ? r.date.trim() : "", preuve });
  }
  return out;
}

// « 13/10 » (date d'un message) -> "2026-10-13". Un mois plus tard que le mois
// en cours est forcément de l'année précédente.
export function isoFromDayMonth(value: string, now: Date): string | null {
  const m = /^(\d{1,2})\/(\d{1,2})$/.exec(value.trim());
  if (!m) return /^\d{4}-\d{2}-\d{2}$/.test(value.trim()) ? value.trim() : null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(now);
  const [y, mm] = today.split("-").map(Number);
  const year = month > mm ? y - 1 : y;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Jalons que l'IA peut encore cocher : ni cochés, ni déjà cochés tout seuls une fois.
export function pendingMilestones(s: StudentMilestones): AutoMilestone[] {
  return AUTO_KEYS.filter((k) => !s[k] && !s.milestones_auto?.[k]);
}

// Ligne du contexte de l'IA. Vide quand il n'y a plus rien à cocher.
export function pendingLine(s: StudentMilestones): string {
  const pending = pendingMilestones(s);
  return pending.length ? `Jalons pas encore cochés dans le CRM : ${pending.map((k) => `${k} (${AUTO_MILESTONES[k]})`).join(", ")}.` : "";
}

// Mise à jour de la fiche, ou null s'il n'y a rien de neuf.
export function milestoneUpdate(s: StudentMilestones, jalons: Jalon[], now: Date): Record<string, unknown> | null {
  const pending = new Set(pendingMilestones(s));
  const auto: Record<string, MilestoneProof> = { ...(s.milestones_auto ?? {}) };
  const update: Record<string, unknown> = {};
  for (const j of jalons) {
    if (!pending.has(j.jalon)) continue;
    update[j.jalon] = true;
    auto[j.jalon] = { date: isoFromDayMonth(j.date, now), preuve: j.preuve, source: "whatsapp", at: now.toISOString() };
  }
  return Object.keys(update).length ? { ...update, milestones_auto: auto } : null;
}

// Coche les jalons sur la fiche et renvoie leurs noms (pour le journal du job).
export async function applyMilestones(db: SupabaseClient, studentId: string, jalons: Jalon[], now: Date): Promise<string[]> {
  if (!jalons.length) return [];
  const { data: s, error } = await db.from("students").select("app_published, first_sale, ten_k, milestones_auto").eq("id", studentId).maybeSingle();
  if (error || !s) return [];
  const update = milestoneUpdate(s as StudentMilestones, jalons, now);
  if (!update) return [];
  const { error: writeError } = await db.from("students").update(update).eq("id", studentId);
  if (writeError) throw new Error(writeError.message);
  return AUTO_KEYS.filter((k) => update[k]).map((k) => AUTO_MILESTONES[k]);
}
