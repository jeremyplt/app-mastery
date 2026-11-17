import type { SupabaseClient } from "@supabase/supabase-js";
import type { AutomationRow, SetAsidesPort } from "@/lib/facturation/pipeline";
import { computeSetAsides, installmentKey, parseMode, studentCommission, type DigestRow, type InstallmentFacts, type ManualCommissionFacts, type ModeSetting, type SaleCommissionFacts, type SetAsideDraft, type SetAsideMode } from "./calcul";

// Enregistrement des mises de côté dans la table set_asides. Idempotent : la
// clé (mensualité, type) refuse un doublon, qui est simplement ignoré. Selon
// l'interrupteur : off, rien ; simulation, lignes « simule » (jamais virées) ;
// auto, lignes « a_faire », virées par scripts/revolut/mises-de-cote.ts.

export type NewSetAside = SetAsideDraft & { status: "a_faire" | "simule"; simulated_at: string | null };

export interface SetAsideStore {
  mode(): Promise<ModeSetting>;
  // Insère les lignes absentes, ignore celles déjà là. Renvoie le nombre insérées.
  insert(rows: NewSetAside[]): Promise<number>;
}

export type RecordResult = { mode: SetAsideMode; created: number; drafts: SetAsideDraft[]; notes: string[] };

export async function recordSetAsides(store: SetAsideStore, facts: InstallmentFacts, now = new Date()): Promise<RecordResult> {
  const { mode } = await store.mode();
  if (mode === "off") return { mode, created: 0, drafts: [], notes: [] };
  const { drafts, notes } = computeSetAsides(facts);
  if (!drafts.length) return { mode, created: 0, drafts, notes };
  const status = mode === "auto" ? "a_faire" : "simule";
  const created = await store.insert(drafts.map((d) => ({ ...d, status, simulated_at: status === "simule" ? now.toISOString() : null })));
  return { mode, created, drafts, notes };
}

export function summarize(r: RecordResult | null): string | null {
  if (!r) return null;
  if (r.mode === "off") return "mises de côté désactivées";
  const what = r.drafts.map((d) => `${d.amount.toFixed(2)} € ${d.kind === "tva" ? "TVA" : "Closers"}`).join(", ") || "rien à mettre de côté";
  return `${r.mode === "auto" ? "à virer" : "simulation"} : ${what}${r.created < r.drafts.length ? ` (${r.drafts.length - r.created} déjà enregistrée${r.drafts.length - r.created > 1 ? "s" : ""})` : ""}${r.notes.length ? `. ${r.notes.join(". ")}` : ""}`;
}

// --- Supabase -----------------------------------------------------------------

const TABLE = "set_asides";

function check<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(`Supabase : ${r.error.message}`);
  return r.data;
}

export async function readMode(db: SupabaseClient): Promise<ModeSetting> {
  const row = check(await db.from("site_settings").select("value").eq("key", "set_asides_mode").maybeSingle());
  return parseMode(row?.value);
}

export function supabaseSetAsideStore(db: SupabaseClient): SetAsideStore {
  return {
    mode: () => readMode(db),
    async insert(rows) {
      // ON CONFLICT (installment_key, kind) DO NOTHING. Une même facture pour
      // deux mensualités viole l'autre index unique : erreur, jamais ignorée.
      const inserted = check(await db.from(TABLE).upsert(rows, { onConflict: "installment_key,kind", ignoreDuplicates: true }).select("id"));
      return (inserted ?? []).length;
    },
  };
}

type SaleJoin = SaleCommissionFacts & { sale_payments: { position: number }[] };

// Élève, nombre de mensualités (comme lib/facturation/crm.ts) et commission.
export async function installmentContext(db: SupabaseClient, studentId: string): Promise<{ name: string; count: number; commission: { total: number; sources: string[] } } | null> {
  const student = check(
    await db
      .from("students")
      .select("id, name, payments, sale:sales(closer_email, commission_amount, commission_rate, commission_cancelled_at, total_amount, contract_status, sale_payments(position))")
      .eq("id", studentId)
      .maybeSingle(),
  ) as { id: string; name: string; payments: { date?: string; amount?: number | null }[] | null; sale: SaleJoin | SaleJoin[] | null } | null;
  if (!student) return null;
  const manual = (check(await db.from("manual_commissions").select("amount, cancelled_at").eq("student_id", studentId)) ?? []) as ManualCommissionFacts[];
  const sale = Array.isArray(student.sale) ? (student.sale[0] ?? null) : student.sale;
  const count = sale ? sale.sale_payments.length : (student.payments ?? []).filter((p) => p.date && p.amount).length;
  return { name: student.name, count, commission: studentCommission(sale, manual) };
}

// Le virement de l'élève, s'il a été rattaché à cette mensualité par le webhook.
async function revolutTransactionFor(db: SupabaseClient, studentId: string, position: number): Promise<string | null> {
  const rows = check(await db.from("revolut_transactions").select("id").eq("student_id", studentId).eq("schedule_position", position).eq("match_status", "paid").limit(1));
  return rows?.[0]?.id ?? null;
}

export type InvoiceFacts = { key: string; studentId: string | null; position: number | null; number: string | null; odooId: number | null; tax: number };

// La facture d'une mensualité payée existe (validée dans Odoo, TVA contrôlée
// par le job) : on met de côté.
export async function recordForInvoice(db: SupabaseClient, inv: InvoiceFacts, source: "factures" | "webhook", revolutTransactionId: string | null = null): Promise<RecordResult> {
  const store = supabaseSetAsideStore(db);
  if (!inv.studentId || !inv.position) {
    const { mode } = await store.mode();
    return { mode, created: 0, drafts: [], notes: [`${inv.number ?? inv.key} : échéance inconnue, rien mis de côté (à faire à la main)`] };
  }
  const ctx = await installmentContext(db, inv.studentId);
  if (!ctx) {
    const { mode } = await store.mode();
    return { mode, created: 0, drafts: [], notes: [`${inv.number ?? inv.key} : élève introuvable, rien mis de côté`] };
  }
  const tx = revolutTransactionId ?? (await revolutTransactionFor(db, inv.studentId, inv.position));
  return recordSetAsides(store, {
    studentId: inv.studentId,
    studentName: ctx.name,
    position: inv.position,
    count: ctx.count,
    invoice: { number: inv.number, odooId: inv.odooId, key: inv.key, tax: inv.tax, currency: "EUR" },
    commission: ctx.commission,
    revolutTransactionId: tx,
    source,
  });
}

// États du job où la facture est validée dans Odoo (sa TVA est celle d'Odoo).
const POSTED_STATES = ["posted", "reconciled", "crm_ready", "waiting_send", "done"];
// États où, en plus, le virement est rapproché : l'argent est encaissé.
const PAID_STATES = ["reconciled", "crm_ready", "waiting_send", "done"];

function factsOf(row: Pick<AutomationRow, "invoice_key" | "plan" | "number" | "odoo_invoice_id">): InvoiceFacts {
  return { key: row.invoice_key, studentId: row.plan.studentId, position: row.plan.schedulePosition, number: row.number, odooId: row.odoo_invoice_id, tax: Number(row.plan.expectedTax) };
}

// Depuis le webhook : l'échéance vient d'être cochée. Si sa facture existe
// déjà, on met de côté ; sinon le job le fera en la créant.
export async function recordFromWebhook(db: SupabaseClient, studentId: string, position: number, transactionId: string): Promise<RecordResult | null> {
  const rows = check(
    await db
      .from("invoice_automation")
      .select("invoice_key, plan, number, odoo_invoice_id, state")
      .eq("plan->>studentId", studentId)
      .eq("plan->>schedulePosition", String(position))
      .in("state", POSTED_STATES),
  ) as AutomationRow[] | null;
  if (!rows?.length) return null;
  if (rows.length > 1) throw new Error(`${rows.length} factures pour l'échéance ${position} de cet élève : mise de côté à faire à la main`);
  return recordForInvoice(db, factsOf(rows[0]), "webhook", transactionId);
}

// Port du job de factures (lib/facturation/pipeline.ts).
export function pipelineSetAsides(db: SupabaseClient): SetAsidesPort {
  return {
    async afterPayment(row) {
      const r = await recordForInvoice(db, factsOf(row), "factures");
      return { result: summarize(r) ?? "", warning: r.mode !== "off" && r.notes.length ? r.notes.join("\n") : null };
    },
    // Factures du job, encaissées depuis la mise en service (since) et depuis
    // moins de 30 jours, dont la mise de côté manque : une panne passagère est
    // rattrapée au passage suivant.
    async missing() {
      const { mode, since } = await readMode(db);
      if (mode === "off" || !since) return [];
      const from = new Date(Math.max(Date.parse(since), Date.now() - 30 * 86_400_000)).toISOString();
      const rows = (check(await db.from("invoice_automation").select("invoice_key, state, plan, number, odoo_invoice_id, invoice_id, handoff_reason").in("state", PAID_STATES).gte("created_at", from)) ?? []) as AutomationRow[];
      const candidates = rows.filter((r) => r.plan.studentId && r.plan.schedulePosition && (Number(r.plan.expectedTax) > 0 || Number(r.plan.reserve?.closer) > 0));
      if (!candidates.length) return [];
      const keys = candidates.map((r) => installmentKey(r.plan.studentId as string, r.plan.schedulePosition as number));
      const done = new Set(((check(await db.from(TABLE).select("installment_key").in("installment_key", keys)) ?? []) as { installment_key: string }[]).map((r) => r.installment_key));
      return candidates.filter((r) => !done.has(installmentKey(r.plan.studentId as string, r.plan.schedulePosition as number)));
    },
  };
}

// --- Point du jour --------------------------------------------------------------

export async function unreportedSetAsides(db: SupabaseClient): Promise<DigestRow[]> {
  const rows = check(await db.from(TABLE).select("id, kind, amount, status, student_name, schedule_position, schedule_count, invoice_number").is("reported_at", null).neq("status", "annule").order("created_at").limit(200));
  return ((rows ?? []) as DigestRow[]).map((r) => ({ ...r, amount: Number(r.amount) }));
}

export async function markReported(db: SupabaseClient, ids: string[], at = new Date()): Promise<void> {
  if (!ids.length) return;
  check(await db.from(TABLE).update({ reported_at: at.toISOString() }).in("id", ids).is("reported_at", null));
}
