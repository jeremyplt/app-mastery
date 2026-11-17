import type { SupabaseClient } from "@supabase/supabase-js";
import type { Student } from "./match";

// Élèves et échéances côté CRM, partagés par le job de factures et le webhook
// Revolut : une seule façon de lire un échéancier et de cocher « reçu ».

type SaleJoin = {
  email: string;
  first_name: string;
  billing: Record<string, string> | null;
  company: Record<string, string> | null;
  installments: number;
  closer_email: string | null;
  commission_amount: number | string | null;
  commission_cancelled_at: string | null;
  contract_status: string;
  sale_payments: { position: number; amount: number | string; due_date: string; paid: boolean }[];
};

function check<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(`Supabase : ${r.error.message}`);
  return r.data;
}

// Élèves actifs avec leur échéancier : celui de la vente, sinon les paiements
// saisis à la main sur la fiche (élèves importés).
export async function loadStudents(db: SupabaseClient): Promise<Student[]> {
  const rows = check(await db.from("students").select("id, name, email, odoo_partner_id, payments, archived, sale:sales(email, first_name, billing, company, installments, closer_email, commission_amount, commission_cancelled_at, contract_status, sale_payments(position, amount, due_date, paid))").eq("archived", false));
  const manual = check(await db.from("manual_commissions").select("student_id, amount, cancelled_at"));
  const out: Student[] = [];
  for (const r of (rows ?? []) as unknown as { id: string; name: string; email: string | null; odoo_partner_id: number | null; payments: { date: string; amount: number | null; paid: boolean }[] | null; sale: SaleJoin | SaleJoin[] | null }[]) {
    const sale = Array.isArray(r.sale) ? r.sale[0] : r.sale;
    const schedule = sale
      ? [...sale.sale_payments].sort((a, b) => a.position - b.position).map((p) => ({ position: p.position, amount: Number(p.amount), due: p.due_date, paid: p.paid }))
      : (r.payments ?? []).filter((p) => p.date && p.amount).map((p, i) => ({ position: i + 1, amount: Number(p.amount), due: p.date, paid: p.paid }));
    let commission = 0;
    if (sale?.closer_email && !sale.commission_cancelled_at && sale.commission_amount) commission = Number(sale.commission_amount) / Math.max(1, schedule.length);
    const m = (manual ?? []).find((x) => x.student_id === r.id && !x.cancelled_at);
    if (m) commission = Number(m.amount) / Math.max(1, schedule.length);
    out.push({
      id: r.id,
      name: r.name,
      email: r.email ?? sale?.email ?? null,
      partnerId: r.odoo_partner_id,
      partnerName: null,
      companyName: sale?.billing?.["Dénomination sociale"] ?? sale?.company?.name ?? null,
      schedule,
      contractBlocked: sale?.contract_status === "declined" || sale?.contract_status === "voided",
      billing: sale?.billing ?? {},
      commissionPerInstallment: Math.round(commission * 100) / 100,
    });
  }
  return out;
}

// Coche la mensualité comme reçue (l'élève ne reçoit plus de relance). Ne
// touche jamais une échéance déjà cochée. Renvoie vrai si elle vient d'être cochée.
export async function markInstallmentPaid(db: SupabaseClient, studentId: string, position: number, date: string): Promise<boolean> {
  const student = check(await db.from("students").select("sale_id, payments").eq("id", studentId).maybeSingle());
  if (!student) return false;
  const paidAt = `${date}T12:00:00Z`;
  if (student.sale_id) {
    const updated = check(await db.from("sale_payments").update({ paid: true, paid_at: paidAt }).eq("sale_id", student.sale_id).eq("position", position).eq("paid", false).select("position"));
    return (updated ?? []).length > 0;
  }
  const payments = (student.payments ?? []) as { paid: boolean; paid_at?: string }[];
  const entry = payments[position - 1];
  if (entry && !entry.paid) {
    entry.paid = true;
    entry.paid_at = paidAt;
    check(await db.from("students").update({ payments }).eq("id", studentId));
    return true;
  }
  return false;
}
