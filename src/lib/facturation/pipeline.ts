import { EUR, INCOME_ACCOUNT, PRODUCT, SALES_JOURNAL, TAX, checkInvoiceText, decideTax, htFromTtc, installmentNote, validVatFormat, type TaxDecision } from "./rules";
import { classifyLine, findScheduleEntry, matchStudents, type BankLine, type Student } from "./match";

// Le coeur de l'automatisation : un virement devient une facture, en étapes
// enregistrées une à une. Si le job s'arrête n'importe où, la relance reprend à
// l'étape suivante sans rien recréer. Trois verrous contre les doublons :
// - un virement n'appartient qu'à une facture (clé primaire bank_line_id) ;
// - avant de créer, on relit Odoo et on reprend une facture identique existante ;
// - un mail dont l'envoi est incertain n'est jamais renvoyé automatiquement.

export type InvoiceLineSpec = { productId: number | null; name: string | null; priceUnit: number; taxId: number };

export type Plan = {
  key: string;
  bankLineIds: number[];
  label: string;
  partnerId: number;
  studentId: string | null;
  schedulePosition: number | null;
  date: string;
  amount: number;
  expectedTax: number;
  rate: number;
  positionId: number;
  mention: string | null;
  narration: string | null;
  line: InvoiceLineSpec;
  sendEmail: boolean;
  clientEmail: string | null;
  reserve: { vat: number; closer: number };
  kind: "new" | "existing";
  existingInvoiceId?: number;
};

export type AutomationRow = {
  invoice_key: string;
  state: "planned" | "creating" | "created" | "posted" | "reconciled" | "crm_ready" | "waiting_send" | "done" | "handoff";
  plan: Plan;
  odoo_invoice_id: number | null;
  number: string | null;
  invoice_id: string | null;
  handoff_reason: string | null;
};

export type OdooInvoice = {
  id: number;
  name: string | false;
  state: "draft" | "posted" | "cancel";
  partnerId: number;
  date: string;
  amountTotal: number;
  amountTax: number;
  amountResidual: number;
  paymentState: string;
  positionId: number | null;
};

export type PartnerFacts = { id: number; name: string; email: string | null; isCompany: boolean; countryCode: string | null; vat: string | null; positionId: number | null; hasProofAttachment: boolean };

export interface OdooPort {
  listOpenCredits(): Promise<BankLine[]>;
  latestBankDate(): Promise<string | null>;
  isReconciled(lineId: number): Promise<boolean>;
  partnerFacts(partnerId: number): Promise<PartnerFacts>;
  findInvoices(q: { partnerId: number; dateFrom: string; dateTo: string }): Promise<OdooInvoice[]>;
  findInvoiceByNumber(number: string): Promise<OdooInvoice | null>;
  findPartnerByVat(vat: string): Promise<number | null>;
  createPartner(vals: { name: string; street: string; zip: string; city: string; countryName: string; email: string | null }): Promise<number>;
  createInvoice(plan: Plan): Promise<number>;
  getInvoice(id: number): Promise<OdooInvoice>;
  deleteDraft(id: number): Promise<void>;
  post(id: number): Promise<void>;
  reconcile(lineIds: number[], invoiceId: number): Promise<void>;
  pdf(id: number): Promise<Buffer>;
}

export interface StorePort {
  loadStudents(): Promise<Student[]>;
  knownLine(id: number): Promise<{ decision: string; invoice_key: string | null; assigned_student_id: string | null } | null>;
  recordLine(line: BankLine, decision: "ignored" | "planned" | "handoff", reason: string | null, invoiceKey: string | null): Promise<void>;
  takenPositions(studentId: string): Promise<Set<number>>;
  getRow(key: string): Promise<AutomationRow | null>;
  createRow(plan: Plan): Promise<boolean>;
  updateRow(key: string, patch: Partial<AutomationRow> & { last_error?: string | null }): Promise<void>;
  openRows(): Promise<AutomationRow[]>;
  linkStudentPartner(studentId: string, partnerId: number): Promise<void>;
  // Enregistre le PDF et crée la ligne du CRM si elle n'existe pas encore.
  storeInvoice(row: AutomationRow, number: string, pdf: Buffer): Promise<{ id: string; status: string }>;
  invoiceStatus(id: string): Promise<string | null>;
  autoSendEnabled(): Promise<boolean>;
  send(id: string): Promise<void>;
}

export interface PdfPort {
  text(pdf: Buffer): Promise<string>;
}

export interface NotifyPort {
  post(event: { title: string; body: string; level: "info" | "success" | "warning" | "error"; dedupe: string; url?: string }): Promise<void>;
}

export type Deps = { odoo: OdooPort; store: StorePort; pdf: PdfPort; notify: NotifyPort; today: () => string };
export type Report = { handled: { key: string; state: string; number: string | null }[]; handoffs: { bankLineIds: number[]; reason: string }[]; ignored: number; errors: { key: string; error: string }[]; warnings: string[]; pdfs: { number: string; invoiceId: string }[] };

const round2 = (n: number) => Math.round(n * 100) / 100;
const CRM = "https://www.jeremypitault.com/admin/factures";
const dayShift = (iso: string, days: number) => new Date(Date.parse(`${iso}T12:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
const money = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

export const DUPLICATE_WINDOW_DAYS = 10;

async function facts(deps: Deps, partnerId: number): Promise<{ partner: PartnerFacts; tax: TaxDecision }> {
  const partner = await deps.odoo.partnerFacts(partnerId);
  const tax = decideTax({
    isCompany: partner.isCompany,
    countryCode: partner.countryCode,
    vat: partner.vat,
    hasResidenceProof: partner.positionId === 6 && partner.hasProofAttachment,
  });
  return { partner, tax };
}

type Decision = { handoff: string } | { ignore: string } | { plan: Plan };

function baseKey(line: BankLine) {
  return `line-${line.id}`;
}

async function planForStudent(line: BankLine, student: Student, deps: Deps): Promise<Decision> {
  if (student.contractBlocked) return { handoff: `Contrat refusé ou expiré pour ${student.name}` };

  // Une facture impayée de ce montant existe déjà : on la rapproche, sans en créer.
  if (student.partnerId) {
    const target = await existingTarget(line, student.partnerId, deps);
    if ("handoff" in target) return { handoff: `${student.name} : ${target.handoff}` };
    if (target.existing) {
      const inv = target.existing;
      return {
        plan: {
          key: baseKey(line),
          bankLineIds: [line.id],
          label: student.name,
          partnerId: student.partnerId,
          studentId: student.id,
          schedulePosition: null,
          date: inv.date,
          amount: line.amount,
          expectedTax: inv.amountTax,
          rate: 0,
          positionId: inv.positionId ?? 0,
          mention: null,
          narration: null,
          line: { productId: null, name: null, priceUnit: 0, taxId: TAX.EC0 },
          sendEmail: false,
          clientEmail: null,
          reserve: { vat: inv.amountTax, closer: student.commissionPerInstallment },
          kind: "existing",
          existingInvoiceId: inv.id,
        },
      };
    }
  }

  const taken = await deps.store.takenPositions(student.id);
  const entry = findScheduleEntry(line, student, taken);
  if (!entry) return { handoff: `${student.name} : le montant ou la date ne correspondent à aucune échéance` };

  let partnerId = student.partnerId;
  if (!partnerId) {
    const b = student.billing;
    if (b["Statut"] !== "Particulier" || !b["Adresse postale"] || !b["Code postal"] || !b["Ville"] || !b["Pays"]) {
      return { handoff: `${student.name} : pas de fiche Odoo, et les infos du contrat ne suffisent pas à en créer une` };
    }
    partnerId = await deps.odoo.createPartner({ name: student.name, street: b["Adresse postale"], zip: b["Code postal"], city: b["Ville"], countryName: b["Pays"], email: student.email });
    await deps.store.linkStudentPartner(student.id, partnerId);
  }

  const { tax } = await facts(deps, partnerId);
  if (!tax.ok) return { handoff: `${student.name} : ${tax.reason}` };

  const amounts = student.schedule.map((e) => e.amount);
  let productId: number = PRODUCT.ACOMPTE;
  let note: string | null = null;
  if (amounts.length === 1) {
    productId = PRODUCT.CONSEIL;
  } else {
    const n = installmentNote(entry.position, amounts, tax.rate);
    if (!n.ok) return { handoff: `${student.name} : ${n.reason}` };
    note = n.note;
  }
  const parts = [note, tax.mentionFromPosition ? null : tax.mention].filter(Boolean);
  const ht = htFromTtc(line.amount, tax.rate);
  return {
    plan: {
      key: baseKey(line),
      bankLineIds: [line.id],
      label: student.name,
      partnerId,
      studentId: student.id,
      schedulePosition: entry.position,
      date: line.date,
      amount: line.amount,
      expectedTax: round2(line.amount - ht),
      rate: tax.rate,
      positionId: tax.positionId,
      mention: tax.mention,
      narration: parts.length ? parts.join("\n") : null,
      line: { productId, name: null, priceUnit: ht, taxId: tax.taxId },
      sendEmail: true,
      clientEmail: student.email,
      reserve: { vat: round2(line.amount - ht), closer: student.commissionPerInstallment },
      kind: "new",
    },
  };
}

// Une facture existe peut-être déjà pour ce virement : impayée et de même
// montant, on la rapproche sans en créer d'autre. Déjà payée et récente, c'est
// un doublon possible : Jeremy tranche.
async function existingTarget(line: BankLine, partnerId: number, deps: Deps): Promise<{ existing: OdooInvoice | null } | { handoff: string }> {
  const near = await deps.odoo.findInvoices({ partnerId, dateFrom: dayShift(line.date, -120), dateTo: dayShift(line.date, 40) });
  const posted = near.filter((i) => i.state === "posted");
  const unpaid = posted.filter((i) => i.paymentState === "not_paid" && round2(i.amountResidual) === line.amount);
  if (unpaid.length > 1) return { handoff: "plusieurs factures impayées de ce montant" };
  if (unpaid.length === 1) return { existing: unpaid[0] };
  const twin = posted.find((i) => i.amountTotal === line.amount && Math.abs(Date.parse(i.date) - Date.parse(line.date)) <= DUPLICATE_WINDOW_DAYS * 86_400_000);
  if (twin) return { handoff: `doublon possible avec la facture ${twin.name} du ${twin.date}` };
  return { existing: null };
}

async function decideLine(line: BankLine, students: Student[], assigned: string | null, deps: Deps): Promise<Decision> {
  const cls = classifyLine(line);
  if (cls.kind === "ignore") return { ignore: cls.reason };
  if (cls.kind === "handoff") return { handoff: cls.reason };
  if (cls.kind === "skool") return { handoff: "__skool__" };
  if (cls.kind === "existing") {
    const inv = await deps.odoo.findInvoiceByNumber(cls.number);
    if (!inv || inv.state !== "posted" || inv.paymentState !== "not_paid" || round2(inv.amountResidual) !== line.amount) {
      return { handoff: `Le virement cite ${cls.number}, mais cette facture n'est pas impayée pour ce montant` };
    }
    const { partner } = await facts(deps, inv.partnerId);
    return {
      plan: {
        key: baseKey(line),
        bankLineIds: [line.id],
        label: partner.name,
        partnerId: inv.partnerId,
        studentId: null,
        schedulePosition: null,
        date: inv.date,
        amount: line.amount,
        expectedTax: inv.amountTax,
        rate: 0,
        positionId: inv.positionId ?? 0,
        mention: null,
        narration: null,
        line: { productId: null, name: null, priceUnit: 0, taxId: TAX.EC0 },
        sendEmail: false,
        clientEmail: null,
        reserve: { vat: inv.amountTax, closer: 0 },
        kind: "existing",
        existingInvoiceId: inv.id,
      },
    };
  }
  if (cls.kind === "google") {
    const partnerId = await deps.odoo.findPartnerByVat("IE6388047V");
    if (!partnerId) return { handoff: "Fiche Google Ireland introuvable dans Odoo" };
    const { tax } = await facts(deps, partnerId);
    if (!tax.ok) return { handoff: `Google : ${tax.reason}` };
    return {
      plan: {
        key: baseKey(line),
        bankLineIds: [line.id],
        label: "Google Ireland (AdSense)",
        partnerId,
        studentId: null,
        schedulePosition: null,
        date: line.date,
        amount: line.amount,
        expectedTax: 0,
        rate: 0,
        positionId: tax.positionId,
        mention: tax.mention,
        narration: tax.mention,
        line: { productId: null, name: `Revenus publicitaires YouTube (Google AdSense), virement du ${line.date.split("-").reverse().join("/")}`, priceUnit: line.amount, taxId: tax.taxId },
        sendEmail: false,
        clientEmail: null,
        reserve: { vat: 0, closer: 0 },
        kind: "new",
      },
    };
  }
  const assignedStudent = assigned ? students.find((s) => s.id === assigned) : null;
  if (assignedStudent) return planForStudent(line, assignedStudent, deps);
  const candidates = matchStudents(line, students);
  if (candidates.length === 0) return { handoff: "Payeur inconnu : aucun élève ne correspond" };
  if (candidates.length > 1) return { handoff: `Plusieurs élèves possibles : ${candidates.map((c) => c.name).join(", ")}` };
  return planForStudent(line, candidates[0], deps);
}

const SKOOL_PARTNER = 21;

// Skool : une seule facture par mois terminé, pour tous les versements du mois.
async function planSkool(lines: BankLine[], today: string, deps: Deps): Promise<{ plans: Plan[]; waiting: number; handoff: string | null }> {
  const byMonth = new Map<string, BankLine[]>();
  for (const l of lines) byMonth.set(l.date.slice(0, 7), [...(byMonth.get(l.date.slice(0, 7)) ?? []), l]);
  const plans: Plan[] = [];
  let waiting = 0;
  const { tax } = await facts(deps, SKOOL_PARTNER);
  if (!tax.ok) return { plans, waiting, handoff: `Skool : ${tax.reason}` };
  for (const [month, group] of byMonth) {
    if (month >= today.slice(0, 7)) {
      waiting += group.length;
      continue;
    }
    const [y, m] = month.split("-").map(Number);
    const end = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 15)));
    const amount = round2(group.reduce((s, l) => s + l.amount, 0));
    plans.push({
      key: `skool-${month}`,
      bankLineIds: group.map((l) => l.id),
      label: `Skool ${label}`,
      partnerId: SKOOL_PARTNER,
      studentId: null,
      schedulePosition: null,
      date: end,
      amount,
      expectedTax: 0,
      rate: 0,
      positionId: tax.positionId,
      mention: tax.mention,
      narration: tax.mention,
      line: { productId: PRODUCT.SKOOL, name: `[SKOOL-LICENCE] Services numériques licenciés pour revente, ${label}`, priceUnit: amount, taxId: tax.taxId },
      sendEmail: false,
      clientEmail: null,
      reserve: { vat: 0, closer: 0 },
      kind: "new",
    });
  }
  return { plans, waiting, handoff: null };
}

async function handoff(row: AutomationRow, reason: string, deps: Deps, report: Report) {
  await deps.store.updateRow(row.invoice_key, { state: "handoff", handoff_reason: reason });
  report.handoffs.push({ bankLineIds: row.plan.bankLineIds, reason });
  await deps.notify.post({ title: `Facture à vérifier : ${row.plan.label}`, body: `${reason}\nVirement de ${money(row.plan.amount)}. Rien ne part sans toi.`, level: "warning", dedupe: `facture-handoff-${row.invoice_key}`, url: CRM });
}

// Fait avancer une facture depuis son état enregistré. Chaque étape vérifie
// d'abord si elle n'a pas déjà été faite.
export async function advance(key: string, deps: Deps, report: Report): Promise<void> {
  let row = await deps.store.getRow(key);
  if (!row) throw new Error(`Facture inconnue : ${key}`);
  const plan = row.plan;
  const set = async (patch: Partial<AutomationRow>) => {
    await deps.store.updateRow(key, patch);
    row = { ...(row as AutomationRow), ...patch };
  };

  if (row.state === "planned" || row.state === "creating") {
    if (plan.kind === "existing" && plan.existingInvoiceId) {
      await set({ state: "created", odoo_invoice_id: plan.existingInvoiceId });
    } else {
      // Marqué avant l'appel : après un arrêt, on cherche ce qui a pu être créé.
      await set({ state: "creating" });
      const same = (await deps.odoo.findInvoices({ partnerId: plan.partnerId, dateFrom: plan.date, dateTo: plan.date })).filter((i) => i.state !== "cancel" && i.amountTotal === plan.amount);
      if (same.length > 1) return handoff(row, `${same.length} factures identiques existent déjà dans Odoo`, deps, report);
      const id = same[0]?.id ?? (await deps.odoo.createInvoice(plan));
      await set({ state: "created", odoo_invoice_id: id });
    }
  }

  if (row.state === "created") {
    const inv = await deps.odoo.getInvoice(row.odoo_invoice_id as number);
    if (plan.kind === "new") {
      const wrong: string[] = [];
      if (inv.amountTotal !== plan.amount) wrong.push(`total ${inv.amountTotal} au lieu de ${plan.amount}`);
      if (inv.amountTax !== plan.expectedTax) wrong.push(`TVA ${inv.amountTax} au lieu de ${plan.expectedTax}`);
      if (inv.positionId !== plan.positionId) wrong.push(`position fiscale ${inv.positionId} au lieu de ${plan.positionId}`);
      if (wrong.length) {
        if (inv.state === "draft") await deps.odoo.deleteDraft(inv.id);
        return handoff(row, `Facture non conforme, non validée : ${wrong.join(", ")}`, deps, report);
      }
    }
    if (inv.state === "draft") await deps.odoo.post(inv.id);
    const posted = await deps.odoo.getInvoice(inv.id);
    if (posted.state !== "posted" || !posted.name) return handoff(row, "Odoo n'a pas validé la facture", deps, report);
    await set({ state: "posted", number: posted.name });
  }

  if (row.state === "posted") {
    const open: number[] = [];
    for (const id of plan.bankLineIds) if (!(await deps.odoo.isReconciled(id))) open.push(id);
    if (open.length) await deps.odoo.reconcile(open, row.odoo_invoice_id as number);
    const after = await deps.odoo.getInvoice(row.odoo_invoice_id as number);
    if (after.amountResidual !== 0) return handoff(row, `${row.number} : il reste ${money(after.amountResidual)} à rapprocher après le virement`, deps, report);
    await set({ state: "reconciled" });
  }

  if (row.state === "reconciled") {
    // Facture préexistante : déjà envoyée au client, il ne reste rien à faire.
    if (plan.kind === "existing") {
      await set({ state: "done" });
      report.handled.push({ key, state: "done", number: row.number });
      await deps.notify.post({ title: `${row.number} payée : ${plan.label}`, body: `Virement de ${money(plan.amount)} rapproché, pas de nouvelle facture.${reserveLine(plan)}`, level: "success", dedupe: `facture-done-${key}` });
      return;
    }
    const pdf = await deps.odoo.pdf(row.odoo_invoice_id as number);
    const problems = checkInvoiceText(await deps.pdf.text(pdf), { number: row.number as string, mention: plan.mention, total: plan.amount });
    if (problems.length) return handoff(row, `PDF de ${row.number} à vérifier, non envoyé : ${problems.join(" ; ")}`, deps, report);
    const stored = await deps.store.storeInvoice(row, row.number as string, pdf);
    await set({ state: "crm_ready", invoice_id: stored.id });
    report.pdfs.push({ number: row.number as string, invoiceId: stored.id });
  }

  if (row.state === "crm_ready") {
    if (!plan.sendEmail) {
      await set({ state: "done" });
      report.handled.push({ key, state: "done", number: row.number });
      await deps.notify.post({ title: `Facture ${row.number} créée : ${plan.label}`, body: `${money(plan.amount)}, rien à envoyer.${reserveLine(plan)}`, level: "success", dedupe: `facture-done-${key}`, url: CRM });
      return;
    }
    await set({ state: "waiting_send" });
  }

  if (row.state === "waiting_send") {
    const status = await deps.store.invoiceStatus(row.invoice_id as string);
    if (status === "sent") {
      await set({ state: "done" });
      report.handled.push({ key, state: "done", number: row.number });
      return;
    }
    // Statut "sending" : on ne sait pas si le mail est parti. Jamais de nouvel essai.
    if (status === "sending") return handoff(row, `Envoi incertain pour ${row.number} : à vérifier chez Brevo avant tout renvoi`, deps, report);
    if (status !== "draft") return handoff(row, `Statut inattendu pour ${row.number} : ${status}`, deps, report);
    if (!(await deps.store.autoSendEnabled())) {
      report.handled.push({ key, state: "waiting_send", number: row.number });
      await deps.notify.post({ title: `Facture ${row.number} prête : ${plan.label}`, body: `${money(plan.amount)}. Relis le mail puis clique sur Envoyer.${reserveLine(plan)}`, level: "info", dedupe: `facture-ready-${key}`, url: CRM });
      return;
    }
    try {
      await deps.store.send(row.invoice_id as string);
    } catch (err) {
      return handoff(row, `Envoi de ${row.number} échoué, pas de nouvel essai : ${err instanceof Error ? err.message : String(err)}`, deps, report);
    }
    await set({ state: "done" });
    report.handled.push({ key, state: "done", number: row.number });
    await deps.notify.post({ title: `Facture ${row.number} envoyée : ${plan.label}`, body: `${money(plan.amount)} à ${plan.clientEmail ?? "l'élève"}.${reserveLine(plan)}`, level: "success", dedupe: `facture-sent-${key}`, url: CRM });
  }
}

function reserveLine(plan: Plan): string {
  const parts: string[] = [];
  if (plan.reserve.vat > 0) parts.push(`${money(plan.reserve.vat)} vers EUR TVA`);
  if (plan.reserve.closer > 0) parts.push(`${money(plan.reserve.closer)} vers EUR Closers`);
  return parts.length ? `\nÀ mettre de côté : ${parts.join(", ")}.` : "";
}

// Lecture seule : ce que le job ferait, sans rien écrire nulle part.
export async function scan(deps: Deps): Promise<{ line: BankLine; decision: string }[]> {
  const [lines, students] = await Promise.all([deps.odoo.listOpenCredits(), deps.store.loadStudents()]);
  const out: { line: BankLine; decision: string }[] = [];
  const readOnly: Deps = { ...deps, odoo: { ...deps.odoo, createPartner: async () => { throw new Error("__needs_partner__"); } } as OdooPort, store: { ...deps.store, linkStudentPartner: async () => undefined } as StorePort };
  for (const line of lines) {
    const known = await deps.store.knownLine(line.id);
    if (known?.decision === "ignored") {
      out.push({ line, decision: "déjà ignoré" });
      continue;
    }
    if (known?.decision === "planned") {
      out.push({ line, decision: `en cours : ${known.invoice_key}` });
      continue;
    }
    try {
      const d = await decideLine(line, students, known?.assigned_student_id ?? null, readOnly);
      if ("ignore" in d) out.push({ line, decision: `ignorer : ${d.ignore}` });
      else if ("handoff" in d) out.push({ line, decision: d.handoff === "__skool__" ? "Skool : facture du mois" : `à vérifier : ${d.handoff}` });
      else out.push({ line, decision: `${d.plan.kind === "existing" ? "rapprocher une facture existante" : "créer une facture"} : ${d.plan.label}, ${d.plan.amount} €, TVA ${d.plan.expectedTax} €` });
    } catch (err) {
      out.push({ line, decision: err instanceof Error && err.message === "__needs_partner__" ? "créer la fiche client puis la facture" : `erreur : ${String(err)}` });
    }
  }
  return out;
}

export async function run(deps: Deps): Promise<Report> {
  const report: Report = { handled: [], handoffs: [], ignored: 0, errors: [], warnings: [], pdfs: [] };
  const today = deps.today();

  // La connexion bancaire d'Odoo peut expirer sans prévenir.
  const latest = await deps.odoo.latestBankDate();
  if (!latest || Date.parse(today) - Date.parse(latest) > 5 * 86_400_000) {
    const warning = `Odoo ne reçoit plus de mouvements bancaires depuis le ${latest ?? "?"} : connexion bancaire à vérifier.`;
    report.warnings.push(warning);
    await deps.notify.post({ title: "Banque : plus de mouvements dans Odoo", body: warning, level: "warning", dedupe: `facture-banque-${today}` });
  }

  // 1. Reprendre ce qui s'est arrêté en route.
  for (const row of await deps.store.openRows()) {
    try {
      await advance(row.invoice_key, deps, report);
    } catch (err) {
      await failed(row.invoice_key, err, deps, report);
    }
  }

  // 2. Nouveaux virements.
  const [lines, students] = await Promise.all([deps.odoo.listOpenCredits(), deps.store.loadStudents()]);
  const skool: BankLine[] = [];
  for (const line of lines) {
    const known = await deps.store.knownLine(line.id);
    if (known && (known.decision === "ignored" || known.decision === "planned")) {
      if (known.decision === "ignored") report.ignored += 1;
      continue;
    }
    if (classifyLine(line).kind === "skool") {
      skool.push(line);
      continue;
    }
    try {
      const d = await decideLine(line, students, known?.assigned_student_id ?? null, deps);
      if ("ignore" in d) {
        await deps.store.recordLine(line, "ignored", d.ignore, null);
        report.ignored += 1;
      } else if ("handoff" in d) {
        await deps.store.recordLine(line, "handoff", d.handoff, null);
        report.handoffs.push({ bankLineIds: [line.id], reason: d.handoff });
        await deps.notify.post({ title: `Virement à vérifier : ${money(line.amount)}`, body: `${line.date}, ${line.partner_name || line.payment_ref}\n${d.handoff}`, level: "warning", dedupe: `facture-ligne-${line.id}`, url: CRM });
      } else {
        await startPlan(d.plan, [line], deps, report);
      }
    } catch (err) {
      report.errors.push({ key: baseKey(line), error: err instanceof Error ? err.message : String(err) });
      await deps.notify.post({ title: "Facturation : erreur", body: `Virement ${line.id} : ${err instanceof Error ? err.message : String(err)}`, level: "error", dedupe: `facture-erreur-${line.id}-${today}` });
    }
  }

  if (skool.length) {
    const s = await planSkool(skool, today, deps);
    if (s.handoff) report.handoffs.push({ bankLineIds: skool.map((l) => l.id), reason: s.handoff });
    for (const plan of s.plans) {
      try {
        await startPlan(plan, skool.filter((l) => plan.bankLineIds.includes(l.id)), deps, report);
      } catch (err) {
        report.errors.push({ key: plan.key, error: err instanceof Error ? err.message : String(err) });
      }
    }
  }
  return report;
}

async function startPlan(plan: Plan, lines: BankLine[], deps: Deps, report: Report) {
  const created = await deps.store.createRow(plan);
  if (!created) {
    // Déjà planifiée par un passage précédent. Un virement arrivé après coup ne
    // doit pas rester invisible.
    const row = await deps.store.getRow(plan.key);
    for (const line of lines) {
      if (row?.plan.bankLineIds.includes(line.id)) continue;
      const reason = `Une facture existe déjà pour ${plan.label} : virement à rattacher à la main`;
      await deps.store.recordLine(line, "handoff", reason, null);
      report.handoffs.push({ bankLineIds: [line.id], reason });
      await deps.notify.post({ title: `Virement à vérifier : ${money(line.amount)}`, body: reason, level: "warning", dedupe: `facture-ligne-${line.id}`, url: CRM });
    }
    return;
  }
  for (const line of lines) await deps.store.recordLine(line, "planned", null, plan.key);
  try {
    await advance(plan.key, deps, report);
  } catch (err) {
    await failed(plan.key, err, deps, report);
  }
}

async function failed(key: string, err: unknown, deps: Deps, report: Report) {
  const message = err instanceof Error ? err.message : String(err);
  report.errors.push({ key, error: message });
  await deps.store.updateRow(key, { last_error: message }).catch(() => undefined);
  await deps.notify.post({ title: "Facturation : arrêt, reprise au prochain passage", body: `${key} : ${message}`, level: "error", dedupe: `facture-arret-${key}-${deps.today()}` }).catch(() => undefined);
}

export { EUR, INCOME_ACCOUNT, SALES_JOURNAL, validVatFormat };
