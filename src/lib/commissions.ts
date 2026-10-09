import { getAdminClient } from "@/lib/supabase";

// Commissions des closers. Base = montant HT, toujours calculé avec la TVA
// luxembourgeoise (17 %) : HT = TTC / 1,17, quel que soit le client.
// Une commission n'est due qu'une fois TOUS les paiements de l'élève reçus.
//
// Deux sources dans le même registre :
// - « sale » : vente déclarée avec un closer (montant calculé sur la vente) ;
// - « manual » : ajoutée à la main depuis l'onglet Commissions (ancien élève,
//   prime...). Liée à un élève, elle attend qu'il ait tout payé ; sinon elle
//   est prête tout de suite.
// Une commission annulée reste visible (date et motif) mais ne compte plus.

export const VAT_RATE = 0.17;
export const DEFAULT_COMMISSION_RATE = 20;

export function htAmount(ttc: number): number {
  return Math.round((ttc / (1 + VAT_RATE)) * 100) / 100;
}

export function commissionFor(ttc: number, rate: number): number {
  return Math.round(htAmount(ttc) * rate) / 100;
}

export type CommissionState = "ready" | "pending" | "cancelled";

export type CommissionEntry = {
  kind: "sale" | "manual";
  id: string;
  created_at: string;
  label: string; // nom de l'élève ou motif
  total_amount: number | null; // TTC de la vente (ventes seulement)
  commission_rate: number | null;
  commission_amount: number;
  paid_count: number;
  payment_count: number;
  state: CommissionState;
  // Contrat refusé ou expiré : annulée d'office, on ne peut pas la réactiver.
  contract_cancelled: boolean;
  cancelled_at: string | null;
  cancel_reason: string | null;
  note: string | null;
  student_id: string | null;
  // Déblocage = jour où le dernier virement de l'élève est marqué payé.
  unlocked_on: string | null; // date effective (commission prête)
  unlocks_on: string | null; // date prévue du dernier paiement (en attente)
};

export type Payout = { id: string; closer_email: string; amount: number; paid_on: string; note: string | null };

export type CloserSummary = {
  email: string;
  name: string | null;
  entries: CommissionEntry[];
  payouts: Payout[];
  totalSold: number; // TTC des ventes non annulées
  earned: number; // commissions prêtes à payer
  pending: number; // commissions en attente des paiements de l'élève
  paid: number; // déjà versé
  due: number; // earned - paid (négatif = avance)
};

type Paid = { paid: boolean; paid_at?: string | null; due_date?: string; date?: string };

// Date de déblocage à partir des paiements de l'élève : quand tout est payé,
// le jour du dernier paiement coché (sinon la dernière échéance) ; sinon la
// date prévue de la dernière échéance.
function unlockDates(payments: Paid[]): { unlocked_on: string | null; unlocks_on: string | null } {
  if (payments.length === 0) return { unlocked_on: null, unlocks_on: null };
  const dues = payments.map((p) => p.due_date ?? p.date ?? "").filter(Boolean).sort();
  const lastDue = dues[dues.length - 1] ?? null;
  if (payments.every((p) => p.paid)) {
    const paidAts = payments.map((p) => p.paid_at).filter((d): d is string => Boolean(d)).sort();
    return { unlocked_on: paidAts[paidAts.length - 1] ?? lastDue, unlocks_on: lastDue };
  }
  return { unlocked_on: null, unlocks_on: lastDue };
}

type SaleRow = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string | null;
  total_amount: number | string;
  closer_email: string;
  commission_rate: number | string;
  commission_amount: number | string | null;
  commission_cancelled_at: string | null;
  commission_cancel_reason: string | null;
  contract_status: string;
  notes: string | null;
  sale_payments: Paid[];
};

type ManualRow = {
  id: string;
  created_at: string;
  closer_email: string;
  label: string;
  amount: number | string;
  student_id: string | null;
  note: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  students: { payments: Paid[]; sales: { sale_payments: Paid[] } | null } | null;
};

// Résumé par closer. Avec `only`, limité à ce closer (vue du closer lui-même).
export async function closerSummaries(only?: string): Promise<CloserSummary[]> {
  const supabase = getAdminClient();
  let closersQuery = supabase.from("admin_users").select("email, name").eq("role", "closer");
  let salesQuery = supabase
    .from("sales")
    .select(
      "id, created_at, first_name, last_name, total_amount, closer_email, commission_rate, commission_amount, commission_cancelled_at, commission_cancel_reason, contract_status, notes, sale_payments(paid, paid_at, due_date)",
    )
    .not("closer_email", "is", null);
  let manualQuery = supabase
    .from("manual_commissions")
    .select("id, created_at, closer_email, label, amount, student_id, note, cancelled_at, cancel_reason, students(payments, sales(sale_payments(paid, paid_at, due_date)))");
  let payoutsQuery = supabase.from("closer_payouts").select("id, closer_email, amount, paid_on, note").order("paid_on", { ascending: false });
  if (only) {
    closersQuery = closersQuery.eq("email", only);
    salesQuery = salesQuery.eq("closer_email", only);
    manualQuery = manualQuery.eq("closer_email", only);
    payoutsQuery = payoutsQuery.eq("closer_email", only);
  }
  const [{ data: closers }, { data: sales }, { data: manual }, { data: payouts }] = await Promise.all([
    closersQuery,
    salesQuery,
    manualQuery,
    payoutsQuery,
  ]);

  const byEmail = new Map<string, CloserSummary>();
  const ensure = (email: string, name: string | null = null) => {
    if (!byEmail.has(email)) {
      byEmail.set(email, { email, name, entries: [], payouts: [], totalSold: 0, earned: 0, pending: 0, paid: 0, due: 0 });
    }
    return byEmail.get(email)!;
  };
  for (const c of closers ?? []) ensure(c.email, c.name);

  const add = (email: string, e: CommissionEntry) => {
    const c = ensure(email);
    c.entries.push(e);
    if (e.state === "cancelled") return;
    if (e.total_amount) c.totalSold += e.total_amount;
    if (e.state === "ready") c.earned += e.commission_amount;
    else c.pending += e.commission_amount;
  };

  for (const s of (sales ?? []) as SaleRow[]) {
    const total = Number(s.total_amount);
    const rate = Number(s.commission_rate);
    const paidCount = s.sale_payments.filter((p) => p.paid).length;
    const contractCancelled = s.contract_status === "declined" || s.contract_status === "voided";
    const cancelled = contractCancelled || Boolean(s.commission_cancelled_at);
    const ready = s.sale_payments.length > 0 && paidCount === s.sale_payments.length;
    add(s.closer_email, {
      kind: "sale",
      id: s.id,
      created_at: s.created_at,
      label: [s.first_name, s.last_name].filter(Boolean).join(" "),
      total_amount: total,
      commission_rate: rate,
      commission_amount: s.commission_amount === null ? commissionFor(total, rate) : Number(s.commission_amount),
      paid_count: paidCount,
      payment_count: s.sale_payments.length,
      state: cancelled ? "cancelled" : ready ? "ready" : "pending",
      contract_cancelled: contractCancelled,
      cancelled_at: s.commission_cancelled_at,
      cancel_reason: contractCancelled ? "Contrat refusé ou expiré" : s.commission_cancel_reason,
      note: s.notes,
      student_id: null,
      ...unlockDates(s.sale_payments),
    });
  }

  for (const m of (manual ?? []) as unknown as ManualRow[]) {
    // Paiements de l'élève lié : ceux de sa vente s'il en a une, sinon ceux
    // saisis sur sa fiche.
    const payments: Paid[] = m.students ? (m.students.sales?.sale_payments ?? m.students.payments ?? []) : [];
    const paidCount = payments.filter((p) => p.paid).length;
    const ready = !m.student_id || (payments.length > 0 && paidCount === payments.length);
    add(m.closer_email, {
      kind: "manual",
      id: m.id,
      created_at: m.created_at,
      label: m.label,
      total_amount: null,
      commission_rate: null,
      commission_amount: Number(m.amount),
      paid_count: paidCount,
      payment_count: payments.length,
      state: m.cancelled_at ? "cancelled" : ready ? "ready" : "pending",
      contract_cancelled: false,
      cancelled_at: m.cancelled_at,
      cancel_reason: m.cancel_reason,
      note: m.note,
      student_id: m.student_id,
      ...(m.student_id ? unlockDates(payments) : { unlocked_on: m.created_at, unlocks_on: null }),
    });
  }

  for (const p of payouts ?? []) {
    const c = ensure(p.closer_email);
    c.payouts.push({ ...p, amount: Number(p.amount) });
    c.paid += Number(p.amount);
  }
  for (const c of byEmail.values()) {
    c.entries.sort((a, b) => b.created_at.localeCompare(a.created_at));
    for (const k of ["totalSold", "earned", "pending", "paid"] as const) c[k] = Math.round(c[k] * 100) / 100;
    c.due = Math.round((c.earned - c.paid) * 100) / 100;
  }
  return [...byEmail.values()];
}
