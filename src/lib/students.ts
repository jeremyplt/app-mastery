import { getAdminClient } from "@/lib/supabase";
import type { Sale } from "@/lib/ventes";

// Suivi des élèves (/admin/eleves), qui remplace le Google Sheet « Suivi
// élèves ». Un élève est créé automatiquement à chaque vente déclarée ; ses
// paiements sont alors ceux de la vente. Les élèves arrivés avant la page
// Ventes ont leurs paiements saisis à la main (colonne payments).

// paid_at : quand le paiement a été coché « payé » (sert à dater le déblocage
// des commissions).
export type StudentPayment = { date: string; amount: number | null; paid: boolean; paid_at?: string | null };

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
  created_at: string;
  sale_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  app: string | null;
  start_date: string | null;
  payment_label: string | null;
  payments: StudentPayment[];
  notes: string | null;
  links: { label: string; url: string }[];
  last_contact_at: string | null;
  archived: boolean;
} & Record<Milestone, boolean>;

// "2026-07-13" + 3 mois -> "2026-10-13" (fin de mois respectée).
// Fin de l'accompagnement = début + 3 mois ; bilan = début + 6 mois.
export function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, last));
  return target.toISOString().slice(0, 10);
}

// "3x1000" ou "2000 + 1000" selon l'échéancier de la vente.
export function paymentLabel(amounts: number[]): string {
  if (amounts.length === 1) return String(amounts[0]);
  return amounts.every((a) => a === amounts[0]) ? `${amounts.length}x${amounts[0]}` : amounts.join(" + ");
}

// Une vente déclarée crée la ligne de l'élève (une seule par vente).
export async function createStudentFromSale(sale: Sale) {
  const { error } = await getAdminClient()
    .from("students")
    .upsert(
      {
        sale_id: sale.id,
        name: [sale.first_name, sale.last_name].filter(Boolean).join(" "),
        email: sale.email,
        phone: sale.phone,
        start_date: sale.start_date ?? sale.sale_payments[0]?.due_date ?? null,
        payment_label: paymentLabel(sale.sale_payments.map((p) => p.amount)),
      },
      { onConflict: "sale_id", ignoreDuplicates: true },
    );
  if (error) console.error("Création de l'élève depuis la vente :", error.message);
}
