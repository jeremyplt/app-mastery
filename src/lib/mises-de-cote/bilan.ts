import { closerShare } from "./calcul";

// Bilan des sous-comptes TVA et Closers : ce qui devrait y être aujourd'hui,
// comparé aux soldes réels. Fonction pure, utilisée par
// scripts/revolut/bilan-mises-de-cote.ts (lecture seule) pour le rattrapage
// avant d'activer les virements automatiques.
// - TVA : TVA de toutes les factures payées (Odoo), avoirs déduits, moins ce
//   qui a déjà été reversé à l'État.
// - Closers : part du closer de chaque mensualité reçue, moins les commissions
//   déjà versées (closer_payouts). Une mensualité compte si l'argent est
//   arrivé : facture payée dans Odoo, ou cochée dans le CRM sans être démentie
//   par une facture impayée (sauf virement trouvé chez Revolut).

export type OdooInvoiceRow = {
  id: number;
  name: string;
  move_type: "out_invoice" | "out_refund";
  partner_id: number;
  partner: string;
  invoice_date: string;
  amount_total: number;
  amount_tax: number;
  // TVA en euros, signée (négative pour un avoir). Prise si présente.
  amount_tax_signed?: number;
  amount_residual: number;
  payment_state: string;
  currency: string;
};

export type BilanStudent = {
  id: string;
  name: string;
  partnerId: number | null;
  count: number;
  crmPaid: number;
  commission: { total: number; sources: string[] };
};

export type BilanInput = {
  invoices: OdooInvoiceRow[];
  students: BilanStudent[];
  payouts: { amount: number }[];
  // Commissions manuelles sans élève : prêtes tout de suite, sans encaissement lié.
  unlinkedManual: { label: string; amount: number }[];
  // Lignes set_asides « a_faire » : déjà prévues, pas encore virées.
  pending: { kind: "tva" | "closer"; amount: number }[];
  balances: { tva: number; closers: number };
  tvaAlreadyPaid: number;
  // Virements reçus chez Revolut, rattachés à l'élève (tous comptes).
  revolut: Record<string, { date: string; amount: number; currency: string; reference: string }[]>;
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const PAID = new Set(["paid", "in_payment"]);

export type StudentLine = {
  name: string;
  commission: number;
  count: number;
  crmPaid: number;
  invoicesPaid: number;
  invoicesUnpaid: number;
  revolutPayments: number;
  received: number;
  share: number;
  note: string | null;
};

export type Bilan = {
  tva: { invoices: { name: string; partner: string; date: string; tax: number }[]; total: number; alreadyPaid: number; pending: number; expected: number; actual: number; delta: number; ignored: string[] };
  closers: { students: StudentLine[]; accrued: number; payouts: number; pending: number; expected: number; actual: number; delta: number; unlinkedManual: { label: string; amount: number }[] };
  gaps: string[];
};

export function computeBilan(input: BilanInput): Bilan {
  const gaps: string[] = [];

  // --- TVA ---
  const counted: Bilan["tva"]["invoices"] = [];
  const ignored: string[] = [];
  for (const inv of input.invoices) {
    const tax = round2(inv.amount_tax_signed ?? (inv.move_type === "out_refund" ? -inv.amount_tax : inv.amount_tax));
    if (tax === 0) continue;
    if (PAID.has(inv.payment_state)) counted.push({ name: inv.name, partner: inv.partner, date: inv.invoice_date, tax });
    else ignored.push(`${inv.name} (${inv.partner}) : TVA ${tax.toFixed(2)} €, facture ${inv.payment_state === "partial" ? "payée en partie" : "non payée"}, pas comptée`);
  }
  const tvaTotal = round2(counted.reduce((s, i) => s + i.tax, 0));
  const tvaPending = round2(input.pending.filter((p) => p.kind === "tva").reduce((s, p) => s + p.amount, 0));
  const tvaExpected = round2(tvaTotal - input.tvaAlreadyPaid);

  // --- Closers ---
  const lines: StudentLine[] = [];
  for (const s of input.students) {
    if (!(s.commission.total > 0) || s.count < 1) continue;
    const mine = input.invoices.filter((i) => i.move_type === "out_invoice" && s.partnerId !== null && i.partner_id === s.partnerId);
    const invoicesPaid = mine.filter((i) => PAID.has(i.payment_state)).length;
    const invoicesUnpaid = mine.filter((i) => !PAID.has(i.payment_state)).length;
    const payments = input.revolut[s.id] ?? [];
    const extraCrm = Math.max(0, s.crmPaid - invoicesPaid);
    // Cochée sans facture payée, alors qu'une facture impayée existe : démentie,
    // sauf si Revolut montre plus de virements que de factures payées.
    const contradicted = Math.min(extraCrm, invoicesUnpaid);
    const rescued = Math.min(contradicted, Math.max(0, payments.length - invoicesPaid));
    const received = Math.min(s.count, invoicesPaid + extraCrm - contradicted + rescued);
    const share = round2(Array.from({ length: received }, (_, i) => closerShare(s.commission.total, s.count, i + 1)).reduce((a, b) => a + b, 0));
    let note: string | null = null;
    if (s.crmPaid !== invoicesPaid) {
      const seen = payments.length ? payments.map((p) => `${p.amount} ${p.currency} le ${p.date}`).join(", ") : "aucun virement trouvé";
      note = `${s.crmPaid} cochée(s) dans le CRM, ${invoicesPaid} facture(s) payée(s), ${invoicesUnpaid} impayée(s) ; Revolut : ${seen}. Comptées : ${received}.`;
      gaps.push(`${s.name} : ${note}`);
    }
    lines.push({ name: s.name, commission: s.commission.total, count: s.count, crmPaid: s.crmPaid, invoicesPaid, invoicesUnpaid, revolutPayments: payments.length, received, share, note });
  }
  const accrued = round2(lines.reduce((s, l) => s + l.share, 0));
  const payouts = round2(input.payouts.reduce((s, p) => s + Number(p.amount), 0));
  const closersPending = round2(input.pending.filter((p) => p.kind === "closer").reduce((s, p) => s + p.amount, 0));
  const closersExpected = round2(accrued - payouts);
  if (input.unlinkedManual.length) gaps.push(`Commissions manuelles sans élève, non comptées (aucun encaissement lié) : ${input.unlinkedManual.map((m) => `${m.label} ${m.amount.toFixed(2)} €`).join(", ")}`);

  return {
    tva: { invoices: counted, total: tvaTotal, alreadyPaid: input.tvaAlreadyPaid, pending: tvaPending, expected: tvaExpected, actual: input.balances.tva, delta: round2(tvaExpected - input.balances.tva - tvaPending), ignored },
    closers: { students: lines, accrued, payouts, pending: closersPending, expected: closersExpected, actual: input.balances.closers, delta: round2(closersExpected - input.balances.closers - closersPending), unlinkedManual: input.unlinkedManual },
    gaps,
  };
}
