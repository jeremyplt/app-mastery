// Mises de côté : à chaque mensualité encaissée, la TVA de sa facture part vers
// le sous-compte Revolut « TVA » et la part du closer vers « Closers ».
// Fonctions pures. Règles de Jeremy :
// - seulement sur l'argent vraiment encaissé (trésorerie d'abord) ;
// - TVA : celle de la facture de la mensualité, telle que facturée, jamais
//   recalculée ni devinée. Pas de facture, pas de mise de côté (on attend) ;
// - closer : commission × 1 / nombre de mensualités, pour chaque mensualité
//   reçue, si la vente a un closer et que la commission n'est pas annulée.
//   Les commissions ajoutées à la main pour l'élève comptent aussi.

export type SetAsideKind = "tva" | "closer";
export type TargetAccount = "tva" | "closers";
export type SetAsideStatus = "a_faire" | "simule" | "vire" | "annule";
export type SetAsideMode = "off" | "simulation" | "auto";

export const TARGET: Record<SetAsideKind, TargetAccount> = { tva: "tva", closer: "closers" };

const round2 = (n: number) => Math.round(n * 100) / 100;

// --- Interrupteur (site_settings « set_asides_mode ») ---------------------------

export type ModeSetting = {
  mode: SetAsideMode;
  // Rattrapage des mises de côté manquées : factures du job faites depuis cette date.
  since: string | null;
  // Arrêt total posé par le script de virement au moindre écart.
  halted: { at: string; reason: string } | null;
};

// Absent : simulation (le défaut). Une valeur inconnue ne vaut jamais « auto ».
export function parseMode(value: unknown): ModeSetting {
  const v = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const mode: SetAsideMode = v.mode === "off" || v.mode === "auto" ? v.mode : "simulation";
  const since = typeof v.since === "string" && !Number.isNaN(Date.parse(v.since)) ? v.since : null;
  const h = v.halted as Record<string, unknown> | null | undefined;
  const halted = h && typeof h === "object" ? { at: String(h.at ?? ""), reason: String(h.reason ?? "arrêt total") } : null;
  return { mode, since, halted };
}

// --- Commission ------------------------------------------------------------------

// Même base que le registre des commissions (lib/commissions.ts) : montant
// enregistré sur la vente, sinon 20 % (ou le taux de la vente) du HT = TTC / 1,17.
export type SaleCommissionFacts = {
  closer_email: string | null;
  commission_amount: number | string | null;
  commission_rate: number | string | null;
  commission_cancelled_at: string | null;
  total_amount: number | string | null;
  contract_status: string | null;
};
export type ManualCommissionFacts = { amount: number | string; cancelled_at: string | null };

export function studentCommission(sale: SaleCommissionFacts | null, manual: ManualCommissionFacts[]): { total: number; sources: string[] } {
  let total = 0;
  const sources: string[] = [];
  // Contrat refusé ou expiré : la commission de la vente est annulée d'office.
  const blocked = sale?.contract_status === "declined" || sale?.contract_status === "voided";
  if (sale?.closer_email && !sale.commission_cancelled_at && !blocked) {
    // Copie de commissionFor (lib/commissions.ts tire Supabase à l'import).
    const ht = round2(Number(sale.total_amount) / 1.17);
    const recorded = sale.commission_amount;
    const amount = recorded !== null && recorded !== "" ? Number(recorded) : Math.round(ht * Number(sale.commission_rate ?? 20)) / 100;
    if (amount > 0) {
      total += amount;
      sources.push("vente");
    }
  }
  for (const m of manual) {
    if (m.cancelled_at || !(Number(m.amount) > 0)) continue;
    total += Number(m.amount);
    sources.push("manuelle");
  }
  return { total: round2(total), sources };
}

// Part du closer pour une mensualité, au centime. Arrondi cumulé : la somme des
// parts fait toujours la commission exacte (500 € en 3 : 166,67 + 166,66 + 166,67).
export function closerShare(total: number, count: number, position: number): number {
  if (!(total > 0) || !Number.isInteger(count) || count < 1 || !Number.isInteger(position) || position < 1 || position > count) return 0;
  const cents = Math.round(total * 100);
  const upTo = (p: number) => Math.round((cents * p) / count);
  return (upTo(position) - upTo(position - 1)) / 100;
}

// --- Référence du virement --------------------------------------------------------

// « TVA Kevin M 2/3 », « Closer Kevin M 2/3 » : prénom, initiale du nom, sans
// accent, moins de 35 caractères.
export function transferReference(kind: SetAsideKind, studentName: string, position: number, count: number): string {
  const words = studentName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^A-Za-z0-9 -]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const label = kind === "tva" ? "TVA" : "Closer";
  const tail = ` ${position}/${count}`;
  const initial = words.length > 1 ? ` ${words[words.length - 1][0].toUpperCase()}` : "";
  const room = 34 - label.length - 1 - initial.length - tail.length;
  const first = (words[0] ?? "Eleve").slice(0, Math.max(1, room));
  return `${label} ${first}${initial}${tail}`;
}

// --- Calcul --------------------------------------------------------------------

export type InstallmentFacts = {
  studentId: string;
  studentName: string;
  position: number;
  count: number;
  // Facture de la mensualité, validée dans Odoo : sa TVA telle que facturée.
  invoice: { number: string | null; odooId: number | null; key: string | null; tax: number; currency: string };
  commission: { total: number; sources: string[] };
  revolutTransactionId: string | null;
  source: "factures" | "webhook";
};

export type SetAsideDraft = {
  kind: SetAsideKind;
  target_account: TargetAccount;
  amount: number;
  currency: "EUR";
  installment_key: string;
  student_id: string;
  student_name: string;
  schedule_position: number;
  schedule_count: number;
  invoice_number: string | null;
  odoo_invoice_id: number | null;
  invoice_key: string | null;
  revolut_transaction_id: string | null;
  source: "factures" | "webhook";
  reference: string;
  detail: Record<string, unknown>;
};

export const installmentKey = (studentId: string, position: number) => `${studentId}:${position}`;

// Mises de côté d'une mensualité payée dont la facture existe. Une ligne par
// type, seulement si le montant est positif. notes : ce qui n'a pas été mis de
// côté et pourquoi.
export function computeSetAsides(f: InstallmentFacts): { drafts: SetAsideDraft[]; notes: string[] } {
  const notes: string[] = [];
  const label = `${f.studentName} ${f.position}/${f.count}`;
  if (!Number.isInteger(f.count) || f.count < 1 || !Number.isInteger(f.position) || f.position < 1 || f.position > f.count) {
    return { drafts: [], notes: [`${label} : échéance incohérente, rien mis de côté`] };
  }
  const base = {
    currency: "EUR" as const,
    installment_key: installmentKey(f.studentId, f.position),
    student_id: f.studentId,
    student_name: f.studentName,
    schedule_position: f.position,
    schedule_count: f.count,
    invoice_number: f.invoice.number,
    odoo_invoice_id: f.invoice.odooId,
    invoice_key: f.invoice.key,
    revolut_transaction_id: f.revolutTransactionId,
    source: f.source,
  };
  const drafts: SetAsideDraft[] = [];

  const tax = round2(Number(f.invoice.tax));
  if (!Number.isFinite(tax) || tax < 0) notes.push(`${label} : TVA de la facture illisible (${f.invoice.tax}), rien mis de côté pour la TVA`);
  else if (tax > 0 && f.invoice.currency !== "EUR") notes.push(`${label} : facture en ${f.invoice.currency}, TVA à mettre de côté à la main`);
  else if (tax > 0) {
    drafts.push({ ...base, kind: "tva", target_account: "tva", amount: tax, reference: transferReference("tva", f.studentName, f.position, f.count), detail: { tva_facture: tax, facture: f.invoice.number } });
  }

  const share = closerShare(f.commission.total, f.count, f.position);
  if (share > 0) {
    drafts.push({
      ...base,
      kind: "closer",
      target_account: "closers",
      amount: share,
      reference: transferReference("closer", f.studentName, f.position, f.count),
      detail: { commission: f.commission.total, mensualites: f.count, sources: f.commission.sources },
    });
  }
  return { drafts, notes };
}

// --- Point du jour -----------------------------------------------------------------

export type DigestRow = {
  id: string;
  kind: SetAsideKind;
  amount: number;
  status: SetAsideStatus;
  student_name: string;
  schedule_position: number;
  schedule_count: number;
  invoice_number: string | null;
};

export const euros = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// Section du point du jour de 9 h. Une phrase par statut, puis le détail par
// élève. Les lignes annulées ne sont pas montrées.
export function digestSection(rows: DigestRow[]): { headline: string; lines: string[] } | null {
  const shown = rows.filter((r) => r.status !== "annule");
  if (!shown.length) return null;
  const sum = (status: SetAsideStatus, kind: SetAsideKind) => round2(shown.filter((r) => r.status === status && r.kind === kind).reduce((s, r) => s + Number(r.amount), 0));
  const has = (status: SetAsideStatus) => shown.some((r) => r.status === status);
  const sentences: string[] = [];
  if (has("simule")) sentences.push(`Mises de côté (simulation) : j'aurais viré ${euros(sum("simule", "tva"))} vers TVA et ${euros(sum("simule", "closer"))} vers Closers`);
  if (has("vire")) sentences.push(`Mises de côté : ${euros(sum("vire", "tva"))} virés vers TVA et ${euros(sum("vire", "closer"))} vers Closers`);
  if (has("a_faire")) sentences.push(`Mises de côté en attente de virement : ${euros(sum("a_faire", "tva"))} pour TVA et ${euros(sum("a_faire", "closer"))} pour Closers`);

  const groups = new Map<string, DigestRow[]>();
  for (const r of shown) {
    const k = `${r.status}|${r.student_name}|${r.schedule_position}/${r.schedule_count}`;
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  const statusLabel: Record<SetAsideStatus, string> = { simule: "simulation", vire: "viré", a_faire: "à virer", annule: "annulé" };
  const lines = [...groups.values()].map((g) => {
    const r = g[0];
    const parts = (["tva", "closer"] as const)
      .map((kind) => {
        const amount = round2(g.filter((x) => x.kind === kind).reduce((s, x) => s + Number(x.amount), 0));
        return amount > 0 ? `${euros(amount)} ${kind === "tva" ? "TVA" : "Closers"}` : null;
      })
      .filter(Boolean);
    const invoice = r.invoice_number ? ` (${r.invoice_number})` : "";
    const tag = sentences.length > 1 ? ` [${statusLabel[r.status]}]` : "";
    return `${r.student_name} ${r.schedule_position}/${r.schedule_count}${invoice} : ${parts.join(", ")}${tag}`;
  });
  return { headline: sentences.join(". "), lines };
}
