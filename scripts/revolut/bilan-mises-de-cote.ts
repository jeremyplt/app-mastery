// Point de départ des mises de côté, en LECTURE SEULE : ce qui devrait être sur
// les sous-comptes TVA et Closers aujourd'hui, comparé à leurs soldes réels.
// C'est le rattrapage à faire à la main avant d'activer les virements
// automatiques. N'écrit rien nulle part (SELECT Supabase, GET Revolut, lecture Odoo).
//   npx tsx scripts/revolut/bilan-mises-de-cote.ts [--odoo factures.json] [--tva-reversee 0] [--json]
// Odoo : par l'API (ODOO_URL, ODOO_DB, ODOO_LOGIN, ODOO_API_KEY, comme le job de
// factures), ou un export JSON des factures clients validées (champs de
// OdooInvoiceRow) avec --odoo. Revolut : REVOLUT_API_KEY et REVOLUT_SIGNING_KEY
// (PEM en base64), sinon la clé de lecture de ~/.config/revolut/. Supabase :
// NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { createClient } from "@supabase/supabase-js";
import { matchStudents, type Student } from "@/lib/facturation/match";
import { computeBilan, type BilanStudent, type OdooInvoiceRow } from "@/lib/mises-de-cote/bilan";
import { euros, studentCommission, type ManualCommissionFacts, type SaleCommissionFacts } from "@/lib/mises-de-cote/calcul";
import { revolutGet } from "@/lib/revolut/client";
import { incomingLeg, toBankLine } from "@/lib/revolut/rapprochement";
import type { RevolutTransaction } from "@/lib/revolut/types";

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

function check<T>(r: { data: T; error: { message: string; code?: string } | null }): T {
  if (r.error) throw new Error(`Supabase : ${r.error.message}`);
  return r.data;
}

// Clé de lecture locale si l'environnement n'en donne pas (comme revolut.mjs).
function revolutEnv() {
  if (process.env.REVOLUT_API_KEY && process.env.REVOLUT_SIGNING_KEY) return;
  const dir = `${homedir()}/.config/revolut`;
  process.env.REVOLUT_API_KEY = readFileSync(`${dir}/lecture-api-key`, "utf8").trim();
  process.env.REVOLUT_SIGNING_KEY = Buffer.from(readFileSync(`${dir}/lecture-private.pem`, "utf8")).toString("base64");
}

async function odooInvoices(): Promise<{ rows: OdooInvoiceRow[]; source: string }> {
  const file = opt("--odoo");
  if (file) return { rows: JSON.parse(readFileSync(file, "utf8")) as OdooInvoiceRow[], source: `export ${file}` };
  const { odooClient } = await import("@/lib/facturation/adapters");
  const { kw } = odooClient();
  type Raw = { id: number; name: string; move_type: OdooInvoiceRow["move_type"]; partner_id: [number, string]; invoice_date: string; amount_total: number; amount_tax: number; amount_tax_signed: number; amount_residual: number; payment_state: string; currency_id: [number, string] };
  const raw = await kw<Raw[]>("account.move", "search_read", [[["move_type", "in", ["out_invoice", "out_refund"]], ["state", "=", "posted"]]], { fields: ["name", "move_type", "partner_id", "invoice_date", "amount_total", "amount_tax", "amount_tax_signed", "amount_residual", "payment_state", "currency_id"], order: "name" });
  return { rows: raw.map((r) => ({ id: r.id, name: r.name, move_type: r.move_type, partner_id: r.partner_id[0], partner: r.partner_id[1], invoice_date: r.invoice_date, amount_total: r.amount_total, amount_tax: r.amount_tax, amount_tax_signed: r.amount_tax_signed, amount_residual: r.amount_residual, payment_state: r.payment_state, currency: r.currency_id[1] })), source: "API Odoo" };
}

type SaleJoin = SaleCommissionFacts & { sale_payments: { position: number; paid: boolean }[] };

async function main() {
  revolutEnv();
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

  const [odoo, students, manual, payouts, accounts, txs] = await Promise.all([
    odooInvoices(),
    db.from("students").select("id, name, odoo_partner_id, payments, sale:sales(closer_email, commission_amount, commission_rate, commission_cancelled_at, total_amount, contract_status, sale_payments(position, paid))").then(check),
    db.from("manual_commissions").select("student_id, label, amount, cancelled_at").then(check),
    db.from("closer_payouts").select("amount").then(check),
    revolutGet<{ id: string; name?: string; currency: string; balance: number }[]>("/api/1.0/accounts"),
    revolutGet<RevolutTransaction[]>("/api/1.0/transactions", "from=2026-06-01&count=1000"),
  ]);
  // La table set_asides n'existe qu'une fois la migration appliquée.
  const pendingRes = await db.from("set_asides").select("kind, amount").eq("status", "a_faire");
  const pending = pendingRes.error ? [] : (pendingRes.data ?? []).map((p) => ({ kind: p.kind as "tva" | "closer", amount: Number(p.amount) }));

  const byName = (name: string) => accounts.filter((a) => a.currency === "EUR" && a.name === name);
  if (byName("TVA").length !== 1 || byName("Closers").length !== 1) throw new Error("Comptes EUR « TVA » et « Closers » introuvables ou en double chez Revolut");
  const balances = { tva: Number(byName("TVA")[0].balance), closers: Number(byName("Closers")[0].balance) };

  type Row = { id: string; name: string; odoo_partner_id: number | null; payments: { date?: string; amount?: number | null; paid?: boolean }[] | null; sale: SaleJoin | SaleJoin[] | null };
  const manualRows = (manual ?? []) as (ManualCommissionFacts & { student_id: string | null; label: string })[];
  const list: BilanStudent[] = ((students ?? []) as unknown as Row[]).map((s) => {
    const sale = Array.isArray(s.sale) ? (s.sale[0] ?? null) : s.sale;
    const schedule = sale ? sale.sale_payments : (s.payments ?? []).filter((p) => p.date && p.amount);
    return {
      id: s.id,
      name: s.name,
      partnerId: s.odoo_partner_id,
      count: schedule.length,
      crmPaid: schedule.filter((p) => p.paid).length,
      commission: studentCommission(sale, manualRows.filter((m) => m.student_id === s.id)),
    };
  });

  // Virements reçus chez Revolut (tous comptes), rattachés à un seul élève par le nom.
  const candidates = list.filter((s) => s.commission.total > 0).map((s) => ({ id: s.id, name: s.name, email: null, partnerId: s.partnerId, partnerName: null, companyName: null, schedule: [], contractBlocked: false, billing: {}, commissionPerInstallment: 0 }) satisfies Student);
  const revolut: Record<string, { date: string; amount: number; currency: string; reference: string }[]> = {};
  for (const tx of txs) {
    const leg = incomingLeg(tx);
    if (!leg || tx.state !== "completed") continue;
    const line = toBankLine(tx, leg);
    const who = matchStudents(line, candidates);
    if (who.length !== 1) continue;
    (revolut[who[0].id] ??= []).push({ date: line.date, amount: line.amount, currency: leg.currency, reference: tx.reference ?? "" });
  }

  const bilan = computeBilan({
    invoices: odoo.rows,
    students: list,
    payouts: (payouts ?? []).map((p) => ({ amount: Number(p.amount) })),
    unlinkedManual: manualRows.filter((m) => !m.student_id && !m.cancelled_at).map((m) => ({ label: m.label, amount: Number(m.amount) })),
    pending,
    balances,
    tvaAlreadyPaid: Number(opt("--tva-reversee") ?? 0),
    revolut,
  });

  if (args.includes("--json")) return console.log(JSON.stringify({ odoo: odoo.source, transactions_revolut: txs.length, ...bilan }, null, 2));

  const day = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Luxembourg" }).format(new Date());
  const move = (delta: number, account: string) => (delta > 0 ? `à AJOUTER sur ${account} : ${euros(delta)}` : delta < 0 ? `à RETIRER de ${account} : ${euros(-delta)}` : `${account} est juste`);
  const out: string[] = [];
  out.push(`Bilan des mises de côté au ${day} (lecture seule, factures : ${odoo.source}, ${txs.length} transactions Revolut lues)`);
  out.push("", "TVA");
  for (const i of bilan.tva.invoices) out.push(`  ${i.name} ${i.date} ${i.partner} : ${euros(i.tax)}`);
  out.push(`  TVA des factures payées : ${euros(bilan.tva.total)} (${bilan.tva.invoices.length} factures)`);
  out.push(`  Déjà reversée à l'État : ${euros(bilan.tva.alreadyPaid)}${opt("--tva-reversee") ? "" : " (option --tva-reversee)"}`);
  if (bilan.tva.pending) out.push(`  Mises de côté prévues, pas encore virées : ${euros(bilan.tva.pending)}`);
  out.push(`  Devrait être sur TVA : ${euros(bilan.tva.expected)} ; solde réel : ${euros(bilan.tva.actual)}`);
  for (const i of bilan.tva.ignored) out.push(`  (${i})`);
  out.push(`  => ${move(bilan.tva.delta, "TVA")}`);
  out.push("", "Closers");
  for (const l of bilan.closers.students) out.push(`  ${l.name} : commission ${euros(l.commission)} en ${l.count}, ${l.received} reçue(s) => ${euros(l.share)}`);
  out.push(`  Part des closers sur l'encaissé : ${euros(bilan.closers.accrued)}`);
  out.push(`  Commissions déjà versées (closer_payouts) : ${euros(bilan.closers.payouts)}`);
  if (bilan.closers.pending) out.push(`  Mises de côté prévues, pas encore virées : ${euros(bilan.closers.pending)}`);
  out.push(`  Devrait être sur Closers : ${euros(bilan.closers.expected)} ; solde réel : ${euros(bilan.closers.actual)}`);
  out.push(`  => ${move(bilan.closers.delta, "Closers")}`);
  if (bilan.gaps.length) {
    out.push("", "Écarts CRM / Odoo / Revolut");
    for (const g of bilan.gaps) out.push(`  ${g}`);
  }
  const t = bilan.tva.delta;
  const c = bilan.closers.delta;
  if (t > 0 && c < 0) {
    const fromClosers = Math.min(t, -c);
    out.push("", `Proposition : virer ${euros(fromClosers)} de Closers vers TVA${t > fromClosers ? `, puis ${euros(Math.round((t - fromClosers) * 100) / 100)} de Main vers TVA` : ""}${-c > fromClosers ? `, et rendre ${euros(Math.round((-c - fromClosers) * 100) / 100)} de Closers à Main` : ""}. Rien n'a été viré.`);
  }
  console.log(out.join("\n"));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
