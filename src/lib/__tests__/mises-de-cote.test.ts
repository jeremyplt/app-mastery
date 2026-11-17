import assert from "node:assert/strict";
import { test } from "node:test";
import { closerShare, computeSetAsides, digestSection, parseMode, studentCommission, transferReference, type DigestRow, type InstallmentFacts, type ModeSetting } from "../mises-de-cote/calcul";
import { recordSetAsides, type NewSetAside, type SetAsideStore } from "../mises-de-cote/enregistrement";
import { computeBilan, type BilanInput } from "../mises-de-cote/bilan";

// Élèves fictifs (le dépôt est public). Cas réel de référence : mensualité de
// 1 000 € en 3, élève français (TVA 145,30 €), closer à 512,82 € (170,94 € par
// mensualité), soit 316,24 € mis de côté par mensualité.

const facts = (over: Partial<InstallmentFacts> = {}): InstallmentFacts => ({
  studentId: "st-alice",
  studentName: "Alice Martinez",
  position: 2,
  count: 3,
  invoice: { number: "VEN/2026/00040", odooId: 300, key: "line-40", tax: 145.3, currency: "EUR" },
  commission: { total: 512.82, sources: ["vente"] },
  revolutTransactionId: null,
  source: "factures",
  ...over,
});

const amounts = (f: InstallmentFacts) => Object.fromEntries(computeSetAsides(f).drafts.map((d) => [d.kind, d.amount]));
const total = (f: InstallmentFacts) => Math.round(computeSetAsides(f).drafts.reduce((s, d) => s + d.amount, 0) * 100) / 100;

// --- Calcul -------------------------------------------------------------------

test("TVA et closer : 145,30 + 170,94 = 316,24 € par mensualité de 1 000 €", () => {
  assert.deepEqual(amounts(facts()), { tva: 145.3, closer: 170.94 });
  assert.equal(total(facts()), 316.24);
  const [tva, closer] = computeSetAsides(facts()).drafts;
  assert.equal(tva.target_account, "tva");
  assert.equal(closer.target_account, "closers");
  assert.equal(tva.installment_key, "st-alice:2");
  assert.equal(tva.reference, "TVA Alice M 2/3");
  assert.equal(closer.reference, "Closer Alice M 2/3");
  assert.equal(tva.invoice_number, "VEN/2026/00040");
});

test("closer seul : élève hors UE validé (facture à 0 %), 170,94 €", () => {
  assert.deepEqual(amounts(facts({ invoice: { number: "VEN/2026/00041", odooId: 301, key: "line-41", tax: 0, currency: "EUR" } })), { closer: 170.94 });
});

test("TVA seule : pas de closer, 145,30 €", () => {
  assert.deepEqual(amounts(facts({ commission: { total: 0, sources: [] } })), { tva: 145.3 });
});

test("ni TVA ni closer : rien", () => {
  const r = computeSetAsides(facts({ invoice: { number: "X", odooId: 1, key: "k", tax: 0, currency: "EUR" }, commission: { total: 0, sources: [] } }));
  assert.deepEqual(r.drafts, []);
});

test("TVA telle que facturée, jamais recalculée : société luxembourgeoise ou montant inhabituel", () => {
  // La TVA de la facture est prise telle quelle, même si 17 % du HT donnerait autre chose.
  assert.equal(amounts(facts({ invoice: { number: "V", odooId: 1, key: "k", tax: 290.6, currency: "EUR" } })).tva, 290.6);
  assert.equal(amounts(facts({ invoice: { number: "V", odooId: 1, key: "k", tax: 43.594, currency: "EUR" } })).tva, 43.59);
});

test("facture en devise ou TVA illisible : rien pour la TVA, la raison est donnée", () => {
  const usd = computeSetAsides(facts({ invoice: { number: "V", odooId: 1, key: "k", tax: 20, currency: "USD" } }));
  assert.deepEqual(usd.drafts.map((d) => d.kind), ["closer"]);
  assert.match(usd.notes[0], /USD/);
  const bad = computeSetAsides(facts({ invoice: { number: "V", odooId: 1, key: "k", tax: Number.NaN, currency: "EUR" } }));
  assert.deepEqual(bad.drafts.map((d) => d.kind), ["closer"]);
  assert.match(bad.notes[0], /illisible/);
});

test("échéance incohérente : rien du tout", () => {
  for (const f of [facts({ position: 4 }), facts({ position: 0 }), facts({ count: 0 }), facts({ position: 1.5 })]) {
    const r = computeSetAsides(f);
    assert.deepEqual(r.drafts, []);
    assert.match(r.notes[0], /incohérente/);
  }
});

test("part du closer au centime, arrondi cumulé : la somme fait la commission exacte", () => {
  assert.deepEqual([1, 2, 3].map((p) => closerShare(512.82, 3, p)), [170.94, 170.94, 170.94]);
  assert.deepEqual([1, 2, 3].map((p) => closerShare(500, 3, p)), [166.67, 166.66, 166.67]);
  assert.equal(Math.round([1, 2, 3].reduce((s, p) => s + closerShare(500, 3, p), 0) * 100) / 100, 500);
  assert.equal(closerShare(512.82, 1, 1), 512.82);
  assert.equal(closerShare(512.82, 3, 4), 0);
  assert.equal(closerShare(0, 3, 1), 0);
});

test("commission : vente avec closer, annulée, contrat refusé, commissions manuelles", () => {
  const sale = { closer_email: "closer@example.com", commission_amount: "512.82", commission_rate: "20", commission_cancelled_at: null, total_amount: "3000", contract_status: "completed" };
  assert.deepEqual(studentCommission(sale, []), { total: 512.82, sources: ["vente"] });
  // Pas de montant enregistré : 20 % du HT (TTC / 1,17), comme le registre.
  assert.equal(studentCommission({ ...sale, commission_amount: null }, []).total, 512.82);
  assert.equal(studentCommission({ ...sale, closer_email: null }, []).total, 0);
  assert.equal(studentCommission({ ...sale, commission_cancelled_at: "2026-11-01T00:00:00Z" }, []).total, 0);
  assert.equal(studentCommission({ ...sale, contract_status: "declined" }, []).total, 0);
  assert.equal(studentCommission({ ...sale, contract_status: "voided" }, []).total, 0);
  // Élève sans vente : la commission ajoutée à la main compte, sauf annulée.
  assert.deepEqual(studentCommission(null, [{ amount: "512.82", cancelled_at: null }]), { total: 512.82, sources: ["manuelle"] });
  assert.equal(studentCommission(null, [{ amount: "512.82", cancelled_at: "2026-11-02T00:00:00Z" }]).total, 0);
  // Vente et prime à la main : les deux, comme dans le registre.
  assert.equal(studentCommission(sale, [{ amount: 100, cancelled_at: null }]).total, 612.82);
});

test("commission manuelle : 170,94 € par mensualité pour un élève à 0 %", () => {
  const commission = studentCommission(null, [{ amount: 512.82, cancelled_at: null }]);
  const r = computeSetAsides(facts({ commission, invoice: { number: "V", odooId: 1, key: "k", tax: 0, currency: "EUR" } }));
  assert.deepEqual(r.drafts.map((d) => [d.kind, d.amount, d.detail.sources]), [["closer", 170.94, ["manuelle"]]]);
});

test("référence : prénom, initiale, sans accent, moins de 35 caractères", () => {
  assert.equal(transferReference("tva", "Élodie Le Bihan", 2, 3), "TVA Elodie B 2/3");
  assert.equal(transferReference("closer", "Zoé", 1, 1), "Closer Zoe 1/1");
  assert.equal(transferReference("closer", "Jean-Christophe O'Neil-Dupont", 12, 12), "Closer Jean-Christophe O 12/12");
  const long = transferReference("closer", "Maximiliendebeaumontchristophe Lefebvre", 10, 12);
  assert.ok(long.length <= 34, long);
  assert.match(long, /^Closer Max\S* L 10\/12$/);
  for (const r of [transferReference("tva", "Ñoño Çağlar", 1, 3), long]) assert.match(r, /^[A-Za-z0-9 /.-]{1,34}$/);
});

test("interrupteur : simulation par défaut, jamais « auto » par erreur", () => {
  assert.equal(parseMode(undefined).mode, "simulation");
  assert.equal(parseMode(null).mode, "simulation");
  assert.equal(parseMode({}).mode, "simulation");
  assert.equal(parseMode({ mode: "Auto" }).mode, "simulation");
  assert.equal(parseMode({ mode: "automatique" }).mode, "simulation");
  assert.equal(parseMode({ mode: "off" }).mode, "off");
  assert.equal(parseMode({ mode: "auto" }).mode, "auto");
  assert.equal(parseMode({ mode: "auto", since: "2026-11-18T08:00:00Z" }).since, "2026-11-18T08:00:00Z");
  assert.equal(parseMode({ since: "pas une date" }).since, null);
  assert.deepEqual(parseMode({ mode: "auto", halted: { at: "2026-11-20T08:00:00Z", reason: "écart" } }).halted, { at: "2026-11-20T08:00:00Z", reason: "écart" });
});

// --- Enregistrement : modes et idempotence --------------------------------------

function memoryStore(setting: Partial<ModeSetting> = {}) {
  const rows = new Map<string, NewSetAside>();
  let inserts = 0;
  const store: SetAsideStore = {
    mode: async () => ({ mode: "simulation", since: null, halted: null, ...setting }),
    async insert(list) {
      inserts += 1;
      let created = 0;
      for (const r of list) {
        const key = `${r.installment_key}|${r.kind}`;
        // Comme l'index unique (facture, type) : une facture pour deux mensualités est refusée.
        const sameInvoice = [...rows.values()].find((x) => r.invoice_number && x.invoice_number === r.invoice_number && x.kind === r.kind && x.installment_key !== r.installment_key);
        if (sameInvoice) throw new Error("duplicate key value violates unique constraint set_asides_invoice_kind_idx");
        if (rows.has(key)) continue;
        rows.set(key, r);
        created += 1;
      }
      return created;
    },
  };
  return { store, rows, inserts: () => inserts };
}

test("simulation : lignes « simule », datées, rien à virer", async () => {
  const m = memoryStore();
  const r = await recordSetAsides(m.store, facts(), new Date("2026-11-18T08:00:00Z"));
  assert.equal(r.created, 2);
  assert.deepEqual([...m.rows.values()].map((x) => [x.kind, x.status, x.simulated_at]), [["tva", "simule", "2026-11-18T08:00:00.000Z"], ["closer", "simule", "2026-11-18T08:00:00.000Z"]]);
});

test("auto : lignes « a_faire » ; off : rien n'est écrit", async () => {
  const auto = memoryStore({ mode: "auto" });
  await recordSetAsides(auto.store, facts());
  assert.deepEqual([...auto.rows.values()].map((x) => [x.status, x.simulated_at]), [["a_faire", null], ["a_faire", null]]);
  const off = memoryStore({ mode: "off" });
  const r = await recordSetAsides(off.store, facts());
  assert.equal(r.created, 0);
  assert.equal(off.inserts(), 0);
});

test("idempotent : la même mensualité rejouée par le job puis le webhook ne fait qu'une ligne par type", async () => {
  const m = memoryStore({ mode: "auto" });
  for (let i = 0; i < 3; i++) await recordSetAsides(m.store, facts());
  const again = await recordSetAsides(m.store, facts({ source: "webhook", revolutTransactionId: "tx-1" }));
  assert.equal(again.created, 0);
  assert.equal(m.rows.size, 2);
  assert.equal([...m.rows.values()][0].source, "factures", "la première ligne reste");
  // Mensualité suivante : deux nouvelles lignes.
  await recordSetAsides(m.store, facts({ position: 3, invoice: { number: "VEN/2026/00050", odooId: 310, key: "line-50", tax: 145.3, currency: "EUR" } }));
  assert.equal(m.rows.size, 4);
});

test("une même facture pour deux mensualités : erreur, jamais ignorée", async () => {
  const m = memoryStore();
  await recordSetAsides(m.store, facts());
  await assert.rejects(recordSetAsides(m.store, facts({ position: 3 })), /unique/);
});

// --- Point du jour --------------------------------------------------------------

const digestRow = (over: Partial<DigestRow>): DigestRow => ({ id: "r", kind: "tva", amount: 145.3, status: "simule", student_name: "Alice Martinez", schedule_position: 2, schedule_count: 3, invoice_number: "VEN/2026/00040", ...over });

test("point du jour en simulation : « j'aurais viré X € vers TVA et Y € vers Closers », détail par élève", () => {
  const d = digestSection([
    digestRow({ id: "1" }),
    digestRow({ id: "2", kind: "closer", amount: 170.94 }),
    digestRow({ id: "3", student_name: "Bruno Petit", schedule_position: 1, invoice_number: "VEN/2026/00041", kind: "closer", amount: 170.94 }),
  ]);
  assert.ok(d);
  assert.equal(d.headline.replace(/\s/g, " "), "Mises de côté (simulation) : j'aurais viré 145,30 € vers TVA et 341,88 € vers Closers");
  assert.deepEqual(d.lines.map((l) => l.replace(/\s/g, " ")), ["Alice Martinez 2/3 (VEN/2026/00040) : 145,30 € TVA, 170,94 € Closers", "Bruno Petit 1/3 (VEN/2026/00041) : 170,94 € Closers"]);
});

test("point du jour : rien à dire sans ligne, les annulées ne comptent pas, virées et en attente à part", () => {
  assert.equal(digestSection([]), null);
  assert.equal(digestSection([digestRow({ status: "annule" })]), null);
  const d = digestSection([digestRow({ status: "vire" }), digestRow({ id: "2", status: "a_faire", kind: "closer", amount: 170.94 })]);
  assert.ok(d);
  assert.match(d.headline, /virés vers TVA/);
  assert.match(d.headline, /en attente de virement/);
  assert.match(d.lines.join("\n"), /\[viré\]/);
});

// --- Bilan ----------------------------------------------------------------------

const inv = (name: string, partner: number, tax: number, state = "paid", currency = "EUR") => ({ id: Number(name.slice(-3)), name, move_type: "out_invoice" as const, partner_id: partner, partner: `client ${partner}`, invoice_date: "2026-11-01", amount_total: 1000, amount_tax: tax, amount_residual: state === "paid" ? 0 : 1000, payment_state: state, currency });

const bilanInput = (over: Partial<BilanInput> = {}): BilanInput => ({
  invoices: [inv("VEN/2026/00101", 1, 145.3), inv("VEN/2026/00102", 1, 145.3), inv("VEN/2026/00103", 2, 0), inv("VEN/2026/00104", 3, 0, "not_paid"), inv("VEN/2026/00105", 4, 36.32)],
  students: [
    { id: "a", name: "Alice Martinez", partnerId: 1, count: 3, crmPaid: 2, commission: { total: 512.82, sources: ["vente"] } },
    // Payée en dollars : 2e mensualité reçue sans facture, cochée sur confirmation.
    { id: "b", name: "Bruno Petit", partnerId: 2, count: 3, crmPaid: 2, commission: { total: 512.82, sources: ["manuelle"] } },
    // Cochée dans le CRM, mais la facture est impayée et rien chez Revolut.
    { id: "c", name: "Chloe Durand", partnerId: 3, count: 3, crmPaid: 1, commission: { total: 512.82, sources: ["vente"] } },
    { id: "d", name: "Sans Closer", partnerId: 4, count: 1, crmPaid: 1, commission: { total: 0, sources: [] } },
  ],
  payouts: [],
  unlinkedManual: [],
  pending: [],
  balances: { tva: 300, closers: 700 },
  tvaAlreadyPaid: 0,
  revolut: { b: [{ date: "2026-10-07", amount: 1100, currency: "USD", reference: "" }, { date: "2026-11-09", amount: 1100, currency: "USD", reference: "" }] },
  ...over,
});

test("bilan : TVA des factures payées, part closer des mensualités vraiment reçues", () => {
  const b = computeBilan(bilanInput());
  assert.equal(b.tva.total, 326.92);
  assert.equal(b.tva.delta, 26.92);
  assert.deepEqual(b.closers.students.map((s) => [s.name, s.received, s.share]), [["Alice Martinez", 2, 341.88], ["Bruno Petit", 2, 341.88], ["Chloe Durand", 0, 0]]);
  assert.equal(b.closers.accrued, 683.76);
  assert.equal(b.closers.delta, -16.24);
  assert.equal(b.gaps.length, 2, "Bruno (sans facture) et Chloé (impayée) sont signalés");
});

test("bilan : commissions déjà versées, avoirs, TVA reversée et lignes en attente", () => {
  const b = computeBilan(
    bilanInput({
      payouts: [{ amount: 341.88 }],
      invoices: [...bilanInput().invoices, { ...inv("VEN/2026/00106", 1, 145.3), move_type: "out_refund", amount_tax_signed: -145.3 }],
      tvaAlreadyPaid: 100,
      pending: [{ kind: "tva", amount: 20 }, { kind: "closer", amount: 10 }],
    }),
  );
  assert.equal(b.tva.total, 181.62);
  assert.equal(b.tva.expected, 81.62);
  assert.equal(b.tva.delta, Math.round((81.62 - 300 - 20) * 100) / 100);
  assert.equal(b.closers.expected, 341.88);
  assert.equal(b.closers.delta, Math.round((341.88 - 700 - 10) * 100) / 100);
});

test("bilan : une facture impayée démentie par un virement Revolut compte", () => {
  const b = computeBilan(bilanInput({ revolut: { c: [{ date: "2026-11-10", amount: 1000, currency: "EUR", reference: "App Mastery Chloe Durand 1/3" }] } }));
  assert.equal(b.closers.students.find((s) => s.name === "Chloe Durand")?.received, 1);
});
