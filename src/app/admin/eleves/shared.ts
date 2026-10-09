// Types et calculs partagés entre la liste des élèves et la fiche élève.

export type Payment = { date: string; amount: number | null; paid: boolean; paid_at?: string | null };
export type StudentLink = { label: string; url: string };

// Libellés proposés pour les liens de la fiche.
export const LINK_PRESETS = ["Audit", "Réponses au questionnaire", "Dossier Drive", "App Store", "Google Play", "Enregistrement d'appel"];

// "aujourd'hui", "hier", "il y a 12 jours" à partir d'un horodatage.
export function lastContactLabel(iso: string | null): string {
  if (!iso) return "jamais noté";
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date(iso));
  const d = -daysFrom(day);
  return d <= 0 ? "aujourd'hui" : d === 1 ? "hier" : `il y a ${d} jours`;
}
export type SalePayment = { id: string; position: number; amount: number; due_date: string; paid: boolean };

export const MILESTONES = [
  ["kickoff", "Kick-off"],
  ["app_published", "App publiée"],
  ["first_sale", "Première vente"],
  ["bilan_done", "Bilan"],
  ["ten_k", "10K"],
  ["guarantee", "Garantie applicable"],
] as const;
export type Milestone = (typeof MILESTONES)[number][0];

export type Student = {
  id: string;
  sale_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  app: string | null;
  start_date: string | null;
  payment_label: string | null;
  payments: Payment[];
  notes: string | null;
  links: StudentLink[];
  last_contact_at: string | null;
  questionnaire_token: string;
  questionnaire_sent_at: string | null;
  questionnaire_answered_at: string | null;
  questionnaire: Record<string, string> | null;
  kickoff_call_at: string | null;
  closing_call_at: string | null;
  archived: boolean;
  sales: { id: string; contract_status: string; skool_invited_at: string | null; sale_payments: SalePayment[] } | null;
} & Record<Milestone, boolean>;

// Paiement affiché : celui de la vente liée (saleId) ou saisi à la main.
export type ShownPayment = Payment & { saleId?: string };

export function today(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

import { addMonths } from "@/lib/students";
export { addMonths };

export function endDate(s: Student): string | null {
  return s.start_date ? addMonths(s.start_date, 3) : null;
}

// Bilan = fin de la période de garantie, 6 mois après le début.
export function bilanDate(s: Student): string | null {
  return s.start_date ? addMonths(s.start_date, 6) : null;
}

export function frDate(iso: string, withYear = true): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) }).format(
    new Date(`${iso}T12:00:00`),
  );
}

export function daysFrom(iso: string): number {
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today()}T00:00:00Z`)) / 86_400_000);
}

// "dans 4 jours", "aujourd'hui", "il y a 2 jours"
export function relative(iso: string): string {
  const d = daysFrom(iso);
  if (d === 0) return "aujourd'hui";
  if (d === 1) return "demain";
  if (d === -1) return "hier";
  return d > 0 ? `dans ${d} jours` : `il y a ${-d} jours`;
}

export function paymentsOf(s: Student): ShownPayment[] {
  if (s.sales) {
    return [...s.sales.sale_payments]
      .sort((a, b) => a.position - b.position)
      .map((p) => ({ date: p.due_date, amount: Number(p.amount), paid: p.paid, saleId: p.id }));
  }
  return s.payments;
}

export function isLate(p: Payment): boolean {
  return !p.paid && p.date < today();
}

export function money(n: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

// Statut affiché sur la liste et la fiche, dans l'ordre de priorité.
export type Tone = "red" | "orange" | "green" | "blue" | "gray";
export function statusOf(s: Student): { label: string; tone: Tone } {
  if (s.archived) return { label: "Archivé", tone: "gray" };
  if (paymentsOf(s).some(isLate)) return { label: "Paiement en retard", tone: "red" };
  const end = endDate(s);
  if (end && daysFrom(end) < 0) return { label: "Accompagnement terminé", tone: "gray" };
  if (end && daysFrom(end) <= 14) return { label: "Fin proche", tone: "orange" };
  return { label: "En cours", tone: "green" };
}

export const TONE_CLASSES: Record<Tone, string> = {
  red: "bg-[color-mix(in_srgb,var(--red)_14%,transparent)] text-[var(--red)]",
  orange: "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]",
  green: "bg-[color-mix(in_srgb,var(--green)_15%,transparent)] text-[var(--green)]",
  blue: "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent2)]",
  gray: "bg-[var(--field)] text-[var(--fg2)]",
};

// Couleur stable par élève pour l'avatar.
const AVATAR_COLORS = ["#0a84ff", "#30b0c7", "#34c759", "#ff9f0a", "#ff375f", "#bf5af2", "#5e5ce6", "#64d2ff"];
export function avatarColor(name: string): string {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// Appels élève : événement Calendly « Appel App Mastery » de Jeremy. Le
// paramètre utm_content dit au webhook s'il s'agit du kick-off ou de la clôture.
export const STUDENT_CALL_URL = "https://calendly.com/jeremypltpro/appel-app-mastery";

export function callLink(s: { name: string; email: string | null }, kind: "kickoff" | "cloture"): string {
  const q = new URLSearchParams({ name: s.name, utm_source: "admin", utm_content: kind });
  if (s.email) q.set("email", s.email);
  return `${STUDENT_CALL_URL}?${q}`;
}
