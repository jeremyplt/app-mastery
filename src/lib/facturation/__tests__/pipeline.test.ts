import assert from "node:assert/strict";
import { test } from "node:test";
import { run, scan, type AutomationRow, type Deps, type OdooInvoice, type OdooPort, type PartnerFacts, type Plan, type StorePort } from "../pipeline";
import type { BankLine, Student } from "../match";

// Un faux Odoo et un faux CRM, pour provoquer une panne à chaque appel possible,
// avant ou après que l'appel ait eu son effet, puis relancer le job.

class Crash extends Error {}
type Mode = { at: number; when: "before" | "after" } | null;

function world(opts: { lines?: BankLine[]; students?: Student[]; invoices?: OdooInvoice[]; autoSend?: boolean; partners?: PartnerFacts[] } = {}) {
  const lines = opts.lines ?? [{ id: 10, date: "2026-11-02", amount: 1000, payment_ref: "Payment from Alice Martinez", partner_name: "ALICE MARTINEZ" }];
  const students = opts.students ?? [{ id: "st1", name: "Alice Martinez", email: "alice@example.com", partnerId: 7, partnerName: "Alice Martinez", companyName: null, schedule: [{ position: 1, amount: 1000, due: "2026-11-01", paid: true }, { position: 2, amount: 1000, due: "2026-12-01", paid: false }, { position: 3, amount: 1000, due: "2027-01-01", paid: false }], contractBlocked: false, billing: {}, commissionPerInstallment: 170.94 }];
  const partners = opts.partners ?? [{ id: 7, name: "Alice Martinez", email: "alice@example.com", isCompany: false, countryCode: "FR", vat: null, positionId: null, hasProofAttachment: false }];
  const invoices = new Map<number, OdooInvoice>((opts.invoices ?? []).map((i) => [i.id, i]));
  const reconciled = new Set<number>();
  const rows = new Map<string, AutomationRow>();
  const known = new Map<number, { decision: string; invoice_key: string | null; assigned_student_id: string | null }>();
  const crm = new Map<string, { id: string; number: string; status: string }>();
  const posts: string[] = [];
  const paid = new Set<number>();
  let seq = 100;
  let num = 26;
  const c = { creates: 0, posts: 0, sends: 0, mails: 0, reconciles: 0, pdfStores: 0 };

  let mode: Mode = null;
  let calls = 0;
  let dead = false;
  // Enveloppe chaque appel : panne au n-ième, avant ou après son effet. Comme un
  // vrai crash, plus rien ne s'exécute ensuite : ni la gestion d'erreur, ni
  // l'enregistrement de l'état, ni l'alerte.
  async function step<T>(fn: () => Promise<T> | T): Promise<T> {
    if (dead) throw new Crash("processus arrêté");
    const n = calls++;
    if (mode && mode.at === n && mode.when === "before") {
      dead = true;
      throw new Crash(`panne avant l'appel ${n}`);
    }
    const out = await fn();
    if (mode && mode.at === n && mode.when === "after") {
      dead = true;
      throw new Crash(`panne après l'appel ${n}`);
    }
    return out;
  }

  const odoo: OdooPort = {
    listOpenCredits: () => step(() => lines.filter((l) => !reconciled.has(l.id))),
    latestBankDate: () => step(() => "2026-11-04"),
    isReconciled: (id) => step(() => reconciled.has(id)),
    partnerFacts: (id) => step(() => partners.find((p) => p.id === id) as PartnerFacts),
    findInvoices: (q) => step(() => [...invoices.values()].filter((i) => i.partnerId === q.partnerId && i.date >= q.dateFrom && i.date <= q.dateTo)),
    findInvoiceByNumber: (n) => step(() => [...invoices.values()].find((i) => i.name === n) ?? null),
    findPartnerByVat: () => step(() => null),
    createPartner: () => step(() => 7),
    createInvoice: (plan: Plan) =>
      step(() => {
        c.creates += 1;
        const id = seq++;
        const tax = plan.expectedTax;
        invoices.set(id, { id, name: false, state: "draft", partnerId: plan.partnerId, date: plan.date, amountTotal: plan.amount, amountTax: tax, amountResidual: plan.amount, paymentState: "not_paid", positionId: plan.positionId });
        return id;
      }),
    getInvoice: (id) => step(() => ({ ...(invoices.get(id) as OdooInvoice) })),
    deleteDraft: (id) => step(() => void invoices.delete(id)),
    post: (id) =>
      step(() => {
        c.posts += 1;
        const i = invoices.get(id) as OdooInvoice;
        i.state = "posted";
        i.name = `VEN/2026/000${++num}`;
      }),
    reconcile: (ids, id) =>
      step(() => {
        c.reconciles += 1;
        const i = invoices.get(id) as OdooInvoice;
        ids.forEach((x) => reconciled.add(x));
        i.amountResidual = 0;
        i.paymentState = "paid";
      }),
    pdf: (id) => step(() => Buffer.from(String((invoices.get(id) as OdooInvoice).name))),
  };

  const store: StorePort = {
    loadStudents: () => step(() => students),
    knownLine: (id) => step(() => known.get(id) ?? null),
    recordLine: (l, decision, _r, key) => step(() => void known.set(l.id, { decision, invoice_key: key, assigned_student_id: known.get(l.id)?.assigned_student_id ?? null })),
    takenPositions: (s) => step(() => new Set([...rows.values()].filter((r) => r.plan.studentId === s).map((r) => r.plan.schedulePosition).filter((p): p is number => p !== null))),
    getRow: (k) => step(() => { const r = rows.get(k); return r ? { ...r } : null; }),
    createRow: (plan) =>
      step(() => {
        if (rows.has(plan.key)) return false;
        rows.set(plan.key, { invoice_key: plan.key, state: "planned", plan, odoo_invoice_id: null, number: null, invoice_id: null, handoff_reason: null });
        return true;
      }),
    updateRow: (k, patch) => step(() => void rows.set(k, { ...(rows.get(k) as AutomationRow), ...patch })),
    openRows: () => step(() => [...rows.values()].filter((r) => r.state !== "done" && r.state !== "handoff")),
    linkStudentPartner: () => step(() => undefined),
    markPaid: (_s, position) => step(() => void paid.add(position)),
    storeInvoice: (_row, number) =>
      step(() => {
        const found = [...crm.values()].find((x) => x.number === number);
        if (found) return found;
        c.pdfStores += 1;
        const rec = { id: `crm-${number}`, number, status: "draft" };
        crm.set(rec.id, rec);
        return rec;
      }),
    invoiceStatus: (id) => step(() => crm.get(id)?.status ?? null),
    autoSendEnabled: () => step(() => opts.autoSend ?? true),
    // Comme le vrai envoi : statut "sending" d'abord, puis le mail, puis "sent".
    send: (id) =>
      step(async () => {
        const rec = crm.get(id) as { status: string };
        if (rec.status !== "draft") throw new Error("déjà en cours");
        rec.status = "sending";
        c.sends += 1;
        await step(() => { c.mails += 1; });
        await step(() => { rec.status = "sent"; });
      }),
  };

  const deps: Deps = {
    odoo,
    store,
    pdf: { text: async (b) => `${b.toString()} SDG STUDIO SARL-S Total 1 000,00 €` },
    notify: {
      post: async (e) => {
        if (dead) throw new Crash("processus arrêté");
        posts.push(e.title);
      },
    },
    today: () => "2026-11-05",
  };
  return { deps, c, paid, invoices, rows, crm, posts, known, reconciled, setMode: (m: Mode) => { mode = m; calls = 0; dead = false; }, calls: () => calls };
}

const status0 = (w: { crm: Map<string, { status: string }> }) => [...w.crm.values()][0]?.status;

test("cas normal : une facture, un mail, un rapprochement", async () => {
  const w = world();
  const r = await run(w.deps);
  assert.deepEqual(r.errors, []);
  assert.deepEqual([w.c.creates, w.c.posts, w.c.reconciles, w.c.mails], [1, 1, 1, 1]);
  assert.equal([...w.crm.values()][0].status, "sent");
});

test("mensualité suivante cochée, mais pas la 1re qui déclenche le Skool", async () => {
  const first = world();
  await run(first.deps);
  assert.equal(first.paid.size, 0);
  const second = world({ lines: [{ id: 11, date: "2026-12-01", amount: 1000, payment_ref: "", partner_name: "ALICE MARTINEZ" }] });
  await run(second.deps);
  assert.deepEqual([...second.paid], [2]);
});

test("relancer le job ne refait rien", async () => {
  const w = world();
  for (let i = 0; i < 4; i++) await run(w.deps);
  assert.deepEqual([w.c.creates, w.c.posts, w.c.reconciles, w.c.mails], [1, 1, 1, 1]);
});

test("deux passages en même temps : une seule facture", async () => {
  const w = world();
  await Promise.all([run(w.deps), run(w.deps)]);
  await run(w.deps);
  assert.equal(w.c.creates, 1);
  assert.equal(w.c.mails, 1);
});

test("panne à chaque appel, avant ou après son effet : jamais de doublon", async () => {
  const probe = world();
  await run(probe.deps);
  const total = probe.calls();
  assert.ok(total > 20, `trop peu d'appels pour un test sérieux : ${total}`);
  let scenarios = 0;
  for (let at = 0; at < total + 5; at++) {
    for (const when of ["before", "after"] as const) {
      const w = world();
      w.setMode({ at, when });
      await run(w.deps).catch(() => undefined);
      w.setMode(null);
      for (let i = 0; i < 3; i++) await run(w.deps);
      const label = `panne ${when} l'appel ${at}`;
      const posted = [...w.invoices.values()].filter((i) => i.state === "posted");
      assert.equal(posted.length, 1, `${label} : ${posted.length} factures validées`);
      assert.equal(w.invoices.size, 1, `${label} : ${w.invoices.size} factures en tout, brouillons compris`);
      assert.equal(w.c.creates, 1, `${label} : créée ${w.c.creates} fois`);
      assert.ok(w.c.mails <= 1, `${label} : ${w.c.mails} mails`);
      if (status0(w) === "sent") assert.equal(w.c.mails, 1, `${label} : marquée envoyée sans mail`);
      assert.ok(w.c.sends <= 1, `${label} : ${w.c.sends} envois`);
      assert.equal(w.c.posts, 1, `${label} : validée ${w.c.posts} fois`);
      assert.equal(w.reconciled.size, 1, `${label} : virement non rapproché`);
      const row = [...w.rows.values()][0];
      const status = [...w.crm.values()][0]?.status;
      // Soit tout est fini, soit l'envoi est incertain et Jeremy est prévenu.
      if (w.c.mails === 0 || status !== "sent") assert.equal(row.state === "done" && status === "sent", false, `${label} : état incohérent`);
      if (status === "sending") assert.equal(row.state, "handoff", `${label} : envoi incertain sans alerte`);
      scenarios += 1;
    }
  }
  assert.ok(scenarios > 40);
});

test("sans envoi automatique : la facture attend ton clic", async () => {
  const w = world({ autoSend: false });
  for (let i = 0; i < 3; i++) await run(w.deps);
  assert.equal(w.c.mails, 0);
  assert.equal([...w.crm.values()][0].status, "draft");
  assert.equal([...w.rows.values()][0].state, "waiting_send");
  assert.equal(w.c.creates, 1);
  // Tu cliques sur Envoyer dans le CRM : le job le voit et s'arrête là.
  [...w.crm.values()][0].status = "sent";
  await run(w.deps);
  assert.equal([...w.rows.values()][0].state, "done");
  assert.equal(w.c.mails, 0);
});

test("facture impayée de même montant : rapprochée, sans nouvelle facture ni mail", async () => {
  const w = world({ invoices: [{ id: 50, name: "VEN/2026/00026", state: "posted", partnerId: 7, date: "2026-11-01", amountTotal: 1000, amountTax: 145.3, amountResidual: 1000, paymentState: "not_paid", positionId: 3 }] });
  await run(w.deps);
  assert.equal(w.c.creates, 0);
  assert.equal(w.c.mails, 0);
  assert.equal(w.c.reconciles, 1);
  assert.equal(w.invoices.get(50)?.paymentState, "paid");
});

test("facture payée récente de même montant : doublon possible, on s'arrête", async () => {
  const w = world({ invoices: [{ id: 50, name: "VEN/2026/00026", state: "posted", partnerId: 7, date: "2026-10-30", amountTotal: 1000, amountTax: 145.3, amountResidual: 0, paymentState: "paid", positionId: 3 }] });
  const r = await run(w.deps);
  assert.equal(w.c.creates, 0);
  assert.equal(r.handoffs.length, 1);
  assert.match(r.handoffs[0].reason, /doublon/);
});

test("montant différent, payeur inconnu, hors UE sans preuve : aucune facture", async () => {
  const cases = [
    world({ lines: [{ id: 10, date: "2026-11-02", amount: 750, payment_ref: "", partner_name: "ALICE MARTINEZ" }] }),
    world({ lines: [{ id: 10, date: "2026-11-02", amount: 1000, payment_ref: "", partner_name: "INCONNU TOTAL" }] }),
    world({ partners: [{ id: 7, name: "Alice Martinez", email: null, isCompany: false, countryCode: "CA", vat: null, positionId: null, hasProofAttachment: false }] }),
  ];
  for (const w of cases) {
    const r = await run(w.deps);
    assert.equal(w.c.creates, 0);
    assert.equal(w.c.mails, 0);
    assert.equal(r.handoffs.length, 1);
    assert.equal(w.posts.length, 1, "Jeremy est prévenu");
  }
});

test("hors UE avec preuve : pas de TVA, la mention vient de la position fiscale", async () => {
  const w = world({ partners: [{ id: 7, name: "Alice Martinez", email: null, isCompany: false, countryCode: "CA", vat: null, positionId: 6, hasProofAttachment: true }] });
  w.deps.pdf = { text: async (b) => `${b.toString()} SDG STUDIO SARL-S Total 1 000,00 € TVA luxembourgeoise non applicable : prestation de conseil localisée au lieu de résidence du preneur, non assujetti établi hors de l'Union européenne (article 17, paragraphe 2, point 8°, lettre c), de la loi modifiée du 12 février 1979 ; article 59, point c), de la directive 2006/112/CE).` };
  await run(w.deps);
  const plan = [...w.rows.values()][0].plan;
  assert.equal(plan.expectedTax, 0);
  assert.equal(plan.positionId, 6);
  assert.ok(!plan.narration?.includes("non applicable"), "pas de mention en double");
  assert.equal(w.c.mails, 1);
});

test("PDF non conforme : facture créée mais aucun mail, Jeremy prévenu", async () => {
  const w = world();
  w.deps.pdf = { text: async () => "PITAULT MEDIA SARL-S" };
  const r = await run(w.deps);
  await run(w.deps);
  assert.equal(w.c.mails, 0);
  assert.equal(r.handoffs.length, 1);
  assert.equal([...w.rows.values()][0].state, "handoff");
});

test("Skool : une facture par mois terminé, rien pour le mois en cours", async () => {
  const lines: BankLine[] = [
    { id: 1, date: "2026-10-02", amount: 31.66, payment_ref: "Payment from Skool.com Inc.", partner_name: "SKOOL.COM INC." },
    { id: 2, date: "2026-10-29", amount: 57.13, payment_ref: "Payment from Skool.com Inc.", partner_name: "SKOOL.COM INC." },
    { id: 3, date: "2026-11-03", amount: 20, payment_ref: "Payment from Skool.com Inc.", partner_name: "SKOOL.COM INC." },
  ];
  const w = world({ lines, students: [], partners: [{ id: 21, name: "Skool.com Inc.", email: null, isCompany: true, countryCode: "US", vat: null, positionId: 5, hasProofAttachment: false }] });
  w.deps.pdf = { text: async (b) => `${b.toString()} SDG STUDIO SARL-S Total 88,79 € Prestation de services non soumise à la TVA luxembourgeoise. Lieu de la prestation situé hors de l'Union européenne, article 17, paragraphe 1er, de la loi TVA luxembourgeoise (article 44 de la directive 2006/112/CE). TVA éventuellement due par le preneur selon la législation locale.` };
  await run(w.deps);
  await run(w.deps);
  assert.equal(w.c.creates, 1);
  assert.equal([...w.invoices.values()][0].amountTotal, 88.79);
  assert.equal([...w.invoices.values()][0].date, "2026-10-31");
  assert.deepEqual([...w.reconciled].sort(), [1, 2]);
  assert.equal(w.c.mails, 0);
});

test("virements internes et capital : ignorés sans alerte", async () => {
  const w = world({ lines: [{ id: 1, date: "2026-11-01", amount: 1026, payment_ref: "To EUR Main", partner_name: "" }, { id: 2, date: "2026-08-04", amount: 3000, payment_ref: "From Jeremy P Libération du capital social", partner_name: "" }], students: [] });
  const r = await run(w.deps);
  assert.equal(r.ignored, 2);
  assert.equal(w.posts.length, 0);
  assert.equal(w.c.creates, 0);
});

test("scan n'écrit rien", async () => {
  const w = world();
  const out = await scan(w.deps);
  assert.match(out[0].decision, /créer une facture/);
  assert.deepEqual([w.c.creates, w.c.posts, w.c.mails], [0, 0, 0]);
  assert.equal(w.rows.size, 0);
  assert.equal(w.known.size, 0);
});
