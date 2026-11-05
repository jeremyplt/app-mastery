import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { EMAIL_RE, INVOICE_BUCKET, defaultDraft, invoiceSlug, needsRenameNote, sendInvoice } from "@/lib/invoices";
import type { BankDetails } from "@/lib/emails/ventes";
import { EUR, INCOME_ACCOUNT, SALES_JOURNAL } from "./rules";
import type { BankLine, Student } from "./match";
import type { AutomationRow, Deps, NotifyPort, OdooInvoice, OdooPort, PartnerFacts, PdfPort, Plan, StorePort } from "./pipeline";

// Branchements réels : Odoo (JSON-RPC), Supabase, pdftotext, fil Harness Maxxing.

const run = promisify(execFile);
const SUSPENSE_ACCOUNT = 357;

function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variable manquante : ${name}`);
  return v;
}

export function odooClient() {
  const url = need("ODOO_URL").replace(/\/$/, "");
  const db = need("ODOO_DB");
  const login = need("ODOO_LOGIN");
  const key = need("ODOO_API_KEY");
  let uid: number | null = null;

  async function call(service: string, method: string, args: unknown[]): Promise<unknown> {
    const res = await fetch(`${url}/jsonrpc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args }, id: 1 }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) throw new Error(`Odoo a répondu ${res.status}`);
    const d = (await res.json()) as { result?: unknown; error?: { message?: string; data?: { message?: string } } };
    if (d.error) throw new Error(`Odoo : ${d.error.data?.message ?? d.error.message ?? "erreur"}`.slice(0, 400));
    return d.result;
  }

  async function kw<T>(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}): Promise<T> {
    if (!uid) {
      uid = (await call("common", "authenticate", [db, login, key, {}])) as number;
      if (!uid) throw new Error("Odoo a refusé la clé API");
    }
    return (await call("object", "execute_kw", [db, uid, key, model, method, args, kwargs])) as T;
  }

  type RawInvoice = { id: number; name: string | false; state: OdooInvoice["state"]; partner_id: [number, string]; invoice_date: string; amount_total: number; amount_tax: number; amount_residual: number; payment_state: string; fiscal_position_id: [number, string] | false };
  const INVOICE_FIELDS = ["name", "state", "partner_id", "invoice_date", "amount_total", "amount_tax", "amount_residual", "payment_state", "fiscal_position_id"];
  const toInvoice = (m: RawInvoice): OdooInvoice => ({
    id: m.id,
    name: m.name,
    state: m.state,
    partnerId: m.partner_id[0],
    date: m.invoice_date,
    amountTotal: m.amount_total,
    amountTax: m.amount_tax,
    amountResidual: m.amount_residual,
    paymentState: m.payment_state,
    positionId: m.fiscal_position_id ? m.fiscal_position_id[0] : null,
  });

  async function openAmls(lineId: number, receivableAccount?: number) {
    const [line] = await kw<{ move_id: [number, string] }[]>("account.bank.statement.line", "read", [[lineId], ["move_id"]]);
    const accounts = receivableAccount ? [SUSPENSE_ACCOUNT, receivableAccount] : [SUSPENSE_ACCOUNT];
    const domain: unknown[] = receivableAccount
      ? [["move_id", "=", line.move_id[0]], ["account_id", "in", accounts], ["reconciled", "=", false]]
      : [["move_id", "=", line.move_id[0]], "|", ["account_id", "=", SUSPENSE_ACCOUNT], ["account_id.account_type", "=", "asset_receivable"], ["reconciled", "=", false]];
    return kw<{ id: number; account_id: [number, string] }[]>("account.move.line", "search_read", [domain], { fields: ["account_id"] });
  }

  const port: OdooPort = {
    async listOpenCredits() {
      const rows = await kw<{ id: number; date: string; amount: number; payment_ref: string | false; partner_name: string | false }[]>("account.bank.statement.line", "search_read", [[["amount", ">", 0], ["is_reconciled", "=", false]]], { fields: ["date", "amount", "payment_ref", "partner_name"], order: "date asc, id asc", limit: 500 });
      return rows.map((r): BankLine => ({ id: r.id, date: r.date, amount: r.amount, payment_ref: r.payment_ref || "", partner_name: r.partner_name || "" }));
    },
    async latestBankDate() {
      const [r] = await kw<{ date: string }[]>("account.bank.statement.line", "search_read", [[]], { fields: ["date"], order: "date desc", limit: 1 });
      return r?.date ?? null;
    },
    async isReconciled(lineId) {
      return (await openAmls(lineId)).length === 0;
    },
    async partnerFacts(partnerId) {
      const [p] = await kw<{ name: string; email: string | false; is_company: boolean; country_id: [number, string] | false; vat: string | false; property_account_position_id: [number, string] | false }[]>("res.partner", "read", [[partnerId], ["name", "email", "is_company", "country_id", "vat", "property_account_position_id"]]);
      let countryCode: string | null = null;
      if (p.country_id) {
        const [c] = await kw<{ code: string }[]>("res.country", "read", [[p.country_id[0]], ["code"]]);
        countryCode = c.code;
      }
      const moves = await kw<number[]>("account.move", "search", [[["partner_id", "=", partnerId], ["move_type", "=", "out_invoice"]]]);
      const proofs = moves.length ? await kw<number>("ir.attachment", "search_count", [[["res_model", "=", "account.move"], ["res_id", "in", moves]]]) : 0;
      const facts: PartnerFacts = { id: partnerId, name: p.name, email: p.email || null, isCompany: p.is_company, countryCode, vat: p.vat || null, positionId: p.property_account_position_id ? p.property_account_position_id[0] : null, hasProofAttachment: proofs > 0 };
      return facts;
    },
    async findInvoices({ partnerId, dateFrom, dateTo }) {
      const rows = await kw<RawInvoice[]>("account.move", "search_read", [[["move_type", "=", "out_invoice"], ["partner_id", "=", partnerId], ["invoice_date", ">=", dateFrom], ["invoice_date", "<=", dateTo]]], { fields: INVOICE_FIELDS });
      return rows.map(toInvoice);
    },
    async findInvoiceByNumber(number) {
      const [r] = await kw<RawInvoice[]>("account.move", "search_read", [[["move_type", "=", "out_invoice"], ["name", "=", number]]], { fields: INVOICE_FIELDS, limit: 1 });
      return r ? toInvoice(r) : null;
    },
    async findPartnerByVat(vat) {
      const ids = await kw<number[]>("res.partner", "search", [[["vat", "=", vat]]], { limit: 2 });
      return ids.length === 1 ? ids[0] : null;
    },
    async createPartner(v) {
      // Après un arrêt entre la création et l'enregistrement : on reprend la fiche.
      if (v.email && EMAIL_RE.test(v.email)) {
        const same = await kw<number[]>("res.partner", "search", [[["email", "=", v.email]]], { limit: 2 });
        if (same.length === 1) return same[0];
        if (same.length > 1) throw new Error(`Plusieurs fiches Odoo pour ${v.email}`);
      }
      const countries = await kw<number[]>("res.country", "search", [[["name", "=ilike", v.countryName]]], { limit: 2, context: { lang: "fr_FR" } });
      if (countries.length !== 1) throw new Error(`Pays inconnu dans Odoo : ${v.countryName}`);
      return kw<number>("res.partner", "create", [{ name: v.name, street: v.street, zip: v.zip, city: v.city, country_id: countries[0], email: v.email || false, lang: "fr_FR", is_company: false, customer_rank: 1 }]);
    },
    async createInvoice(plan: Plan) {
      const line: Record<string, unknown> = { quantity: 1, price_unit: plan.line.priceUnit, tax_ids: [[6, 0, [plan.line.taxId]]] };
      if (plan.line.productId) line.product_id = plan.line.productId;
      else line.account_id = INCOME_ACCOUNT;
      if (plan.line.name) line.name = plan.line.name;
      const vals: Record<string, unknown> = {
        move_type: "out_invoice",
        partner_id: plan.partnerId,
        journal_id: SALES_JOURNAL,
        currency_id: EUR,
        invoice_date: plan.date,
        invoice_date_due: plan.date,
        fiscal_position_id: plan.positionId,
        invoice_line_ids: [[0, 0, line]],
      };
      if (plan.narration) vals.narration = plan.narration.split("\n").map((p) => `<p>${p}</p>`).join("");
      return kw<number>("account.move", "create", [vals]);
    },
    async getInvoice(id) {
      const [r] = await kw<RawInvoice[]>("account.move", "read", [[id], INVOICE_FIELDS]);
      return toInvoice({ ...r, id });
    },
    async deleteDraft(id) {
      await kw("account.move", "unlink", [[id]]);
    },
    async post(id) {
      await kw("account.move", "action_post", [[id]]);
    },
    async reconcile(lineIds, invoiceId) {
      const inv = await port.getInvoice(invoiceId);
      const [rcv] = await kw<{ id: number; account_id: [number, string] }[]>("account.move.line", "search_read", [[["move_id", "=", invoiceId], ["account_id.account_type", "=", "asset_receivable"]]], { fields: ["account_id"], limit: 1 });
      const ids = [rcv.id];
      for (const lineId of lineIds) {
        await kw("account.bank.statement.line", "write", [[lineId], { partner_id: inv.partnerId }]);
        for (const aml of await openAmls(lineId, rcv.account_id[0])) {
          if (aml.account_id[0] === SUSPENSE_ACCOUNT) {
            await kw("account.move.line", "write", [[aml.id], { account_id: rcv.account_id[0], partner_id: inv.partnerId }], { context: { skip_readonly_check: true } });
          }
          ids.push(aml.id);
        }
      }
      await kw("account.move.line", "reconcile", [ids]);
    },
    async pdf(id) {
      const path = await kw<string>("account.move", "get_portal_url", [[id]], { report_type: "pdf", download: true });
      const res = await fetch(url + path, { signal: AbortSignal.timeout(120_000) });
      const buf = Buffer.from(await res.arrayBuffer());
      if (!res.ok || buf.subarray(0, 5).toString() !== "%PDF-") throw new Error(`PDF de la facture ${id} indisponible`);
      return buf;
    },
  };
  return { port, kw };
}

export const pdfPort: PdfPort = {
  async text(pdf) {
    const dir = await mkdtemp(join(tmpdir(), "facture-"));
    try {
      const file = join(dir, "f.pdf");
      await writeFile(file, pdf);
      const { stdout } = await run("pdftotext", [file, "-"], { maxBuffer: 10_000_000 });
      return stdout;
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  },
};

export const notifyPort: NotifyPort = {
  async post(e) {
    const args = ["feed", "post", e.title, "--body", e.body, "--level", e.level, "--source", "factures", "--dedupe", e.dedupe, "--quiet"];
    if (e.url) args.push("--url", e.url);
    try {
      await run("maxxing", args);
    } catch {
      console.error(`[notification] ${e.level} ${e.title} : ${e.body}`);
    }
  },
};

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

export function storePort(): StorePort {
  const db = createClient(need("NEXT_PUBLIC_SUPABASE_URL"), need("SUPABASE_SERVICE_ROLE_KEY"));
  const check = <T>(r: { data: T; error: { message: string } | null }): T => {
    if (r.error) throw new Error(`Supabase : ${r.error.message}`);
    return r.data;
  };

  return {
    async loadStudents() {
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
    },
    async knownLine(id) {
      return check(await db.from("invoice_bank_lines").select("decision, invoice_key, assigned_student_id").eq("bank_line_id", id).maybeSingle());
    },
    async recordLine(line, decision, reason, invoiceKey) {
      check(await db.from("invoice_bank_lines").upsert({ bank_line_id: line.id, bank_date: line.date, amount: line.amount, label: line.partner_name || line.payment_ref, decision, reason, invoice_key: invoiceKey, updated_at: new Date().toISOString() }, { onConflict: "bank_line_id" }));
    },
    async takenPositions(studentId) {
      const rows = check(await db.from("invoice_automation").select("plan").eq("plan->>studentId", studentId));
      return new Set((rows ?? []).map((r) => (r.plan as Plan).schedulePosition).filter((p): p is number => typeof p === "number"));
    },
    async getRow(key) {
      return check(await db.from("invoice_automation").select("*").eq("invoice_key", key).maybeSingle()) as AutomationRow | null;
    },
    async createRow(plan) {
      const r = await db.from("invoice_automation").insert({ invoice_key: plan.key, plan });
      if (r.error?.code === "23505") return false;
      if (r.error) throw new Error(`Supabase : ${r.error.message}`);
      return true;
    },
    async updateRow(key, patch) {
      check(await db.from("invoice_automation").update({ ...patch, updated_at: new Date().toISOString() }).eq("invoice_key", key));
    },
    async openRows() {
      return (check(await db.from("invoice_automation").select("*").not("state", "in", "(done,handoff)")) ?? []) as AutomationRow[];
    },
    async linkStudentPartner(studentId, partnerId) {
      check(await db.from("students").update({ odoo_partner_id: partnerId }).eq("id", studentId));
    },
    async storeInvoice(row, number, pdf) {
      const existing = check(await db.from("invoices").select("id, status").eq("number", number).maybeSingle());
      if (existing) return existing;
      const path = `${invoiceSlug(number)}.pdf`;
      const up = await db.storage.from(INVOICE_BUCKET).upload(path, pdf, { contentType: "application/pdf", upsert: true });
      if (up.error) throw new Error(`Stockage : ${up.error.message}`);
      const plan = row.plan;
      const setting = check(await db.from("site_settings").select("value").eq("key", "bank_details").maybeSingle());
      const bank = (setting?.value ?? { iban: "", bic: "" }) as BankDetails;
      const renameNote = plan.studentId ? await needsRenameNote(plan.studentId) : false;
      const draft = plan.sendEmail
        ? defaultDraft({ clientName: plan.label, number, amount: plan.amount, currency: "EUR", kind: "paid", invoiceDate: plan.date, isStudent: Boolean(plan.studentId), renameNote }, bank)
        : { subject: "", body: "" };
      const inserted = check(
        await db
          .from("invoices")
          .insert({ number, odoo_id: row.odoo_invoice_id, client_name: plan.label, client_email: plan.clientEmail, student_id: plan.studentId, invoice_date: plan.date, amount: plan.amount, currency: "EUR", kind: "paid", pdf_path: path, email_subject: draft.subject, email_body: draft.body, status: plan.sendEmail ? "draft" : "no_send" })
          .select("id, status")
          .single(),
      );
      if (!inserted) throw new Error(`Facture ${number} non enregistrée dans le CRM`);
      return inserted;
    },
    async invoiceStatus(id) {
      const r = check(await db.from("invoices").select("status").eq("id", id).maybeSingle());
      return r?.status ?? null;
    },
    async autoSendEnabled() {
      const r = check(await db.from("site_settings").select("value").eq("key", "invoices_auto_send").maybeSingle());
      return (r?.value as { enabled?: boolean } | undefined)?.enabled === true;
    },
    async send(id) {
      await sendInvoice(id, "send");
    },
  };
}

export function realDeps(): Deps {
  const odoo = odooClient().port;
  const store = storePort();
  const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Luxembourg" }).format(new Date());
  // Le nom de la fiche Odoo sert à reconnaître un payeur (société d'un élève).
  const withNames: StorePort = {
    ...store,
    async loadStudents() {
      const list = await store.loadStudents();
      for (const s of list) {
        if (s.partnerId) s.partnerName = (await odoo.partnerFacts(s.partnerId)).name;
      }
      return list;
    },
  };
  return { odoo, store: withNames, pdf: pdfPort, notify: notifyPort, today };
}
