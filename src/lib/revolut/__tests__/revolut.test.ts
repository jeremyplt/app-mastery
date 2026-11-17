import assert from "node:assert/strict";
import { test } from "node:test";
import type { Student } from "../../facturation/match";
import { expectedSignature, verifySignature } from "../signature";
import { parseReference } from "../reference";
import { MAIN_EUR_ACCOUNT_ID, decide } from "../rapprochement";
import { handleEvent, type Alert, type Outcome, type RevolutStore, type StoredTransaction, type WebhookDeps } from "../webhook";
import type { RevolutTransaction } from "../types";

// Élèves et virements fictifs (le dépôt est public). Le cas réel de référence :
// « App Mastery {Prénom} {Nom} 2/3 », virement d'une société, compte Main EUR.

// --- Signature ---------------------------------------------------------------

// Vecteur de test officiel de la documentation Revolut.
const SECRET = "wsk_r59a4HfWVAKycbCaNO1RvgCJec02gRd8";
const TS = "1683650202360";
const BODY = '{"data":{"id":"645a7696-22f3-aa47-9c74-cbae0449cc46","new_state":"completed","old_state":"pending","request_id":"app_charges-9f5d5eb3-1e06-46c5-b1c0-3914763e0bcb"},"event":"TransactionStateChanged","timestamp":"2023-05-09T16:36:38.028960Z"}';
const SIG = "v1=bca326fb378d0da7f7c490ad584a8106bab9723d8d9cdd0d50b4c5b3be3837c0";
const NOW = Number(TS) + 1000;

test("signature : vecteur officiel de Revolut", () => {
  assert.equal(expectedSignature(SECRET, TS, BODY), SIG);
  assert.deepEqual(verifySignature({ secret: SECRET, timestamp: TS, signatures: SIG, rawBody: BODY, now: NOW }), { ok: true });
});

test("signature : rotation du secret, une des signatures suffit", () => {
  assert.equal(verifySignature({ secret: SECRET, timestamp: TS, signatures: `v1=${"0".repeat(64)}, ${SIG}`, rawBody: BODY, now: NOW }).ok, true);
});

test("signature : tout le reste est refusé", () => {
  const base = { secret: SECRET, timestamp: TS, signatures: SIG, rawBody: BODY, now: NOW };
  const refused = [
    { ...base, secret: "wsk_autre_secret" },
    { ...base, rawBody: BODY.replace("completed", "reverted") },
    { ...base, rawBody: `${BODY} ` },
    { ...base, signatures: null },
    { ...base, signatures: "" },
    { ...base, signatures: SIG.replace("v1=", "v0=") },
    { ...base, signatures: SIG.slice(0, -2) },
    { ...base, timestamp: null },
    { ...base, timestamp: "pas-un-nombre" },
    // Plus de 5 minutes d'écart, dans un sens ou dans l'autre : rejeu refusé.
    { ...base, now: Number(TS) + 5 * 60 * 1000 + 1 },
    { ...base, now: Number(TS) - 5 * 60 * 1000 - 1 },
    { ...base, secret: "" },
  ];
  for (const input of refused) assert.equal(verifySignature(input).ok, false, JSON.stringify({ ...input, rawBody: input.rawBody.slice(0, 20) }));
  // L'horodatage fait partie de la signature : le changer la casse.
  assert.equal(verifySignature({ ...base, timestamp: String(Number(TS) + 1) }).ok, false);
});

// --- Référence -----------------------------------------------------------------

test("référence : élève et échéance, quelle que soit l'écriture", () => {
  const cases: [string, string, number | null, number | null][] = [
    ["App Mastery Kevin Martin 2/3", "kevin martin", 2, 3],
    ["APP MASTERY KEVIN MARTIN 2/3", "kevin martin", 2, 3],
    ["app mastery kévin martín 2/3", "kevin martin", 2, 3],
    ["App  Mastery   Kevin   Martin   2 / 3", "kevin martin", 2, 3],
    ["AppMastery - Kevin Martin - 2/3", "kevin martin", 2, 3],
    ["App-Mastery: Kevin Martin 2 sur 3", "kevin martin", 2, 3],
    ["PAYMENT FOR COURSE APP MASTERYKEVIN MARTIN 2/3", "payment for course kevin martin", 2, 3],
    ["App Mastery Kevin Martin2/3", "kevin martin", 2, 3],
    ["App Mastery Martin Kevin 3/3", "martin kevin", 3, 3],
    ["APP MASTERY - KEVIN MARTIN", "kevin martin", null, null],
    // Une date n'est pas une échéance.
    ["App Mastery Kevin Martin 17/11", "kevin martin 17 11", null, null],
  ];
  for (const [ref, name, position, total] of cases) assert.deepEqual(parseReference(ref), { name, position, total }, ref);
  assert.equal(parseReference("Deuxieme mensualite"), null);
  assert.equal(parseReference(""), null);
  assert.equal(parseReference(undefined), null);
});

// --- Rapprochement -------------------------------------------------------------

const kevin = (over: Partial<Student> = {}): Student => ({
  id: "st-kevin",
  name: "Kevin Martin",
  email: "kevin@example.com",
  partnerId: 29,
  partnerName: null,
  companyName: "Exemple Conseil",
  schedule: [
    { position: 1, amount: 1000, due: "2026-10-16", paid: true },
    { position: 2, amount: 1000, due: "2026-11-16", paid: false },
    { position: 3, amount: 1000, due: "2026-12-16", paid: false },
  ],
  contractBlocked: false,
  billing: {},
  commissionPerInstallment: 170.94,
  ...over,
});
// Élève importé (paiements saisis sur la fiche), sans vente.
const alice = (): Student => ({
  id: "st-alice",
  name: "Alice Martinez",
  email: null,
  partnerId: 7,
  partnerName: null,
  companyName: null,
  schedule: [
    { position: 1, amount: 1500, due: "2026-10-05", paid: true },
    { position: 2, amount: 1500, due: "2026-11-05", paid: false },
  ],
  contractBlocked: false,
  billing: {},
  commissionPerInstallment: 0,
});
const students = () => [kevin(), alice()];

const TX_ID = "00000000-0000-4000-8000-000000000001";
const tx = (over: Partial<RevolutTransaction> = {}, leg: Partial<RevolutTransaction["legs"][number]> = {}): RevolutTransaction => ({
  id: TX_ID,
  type: "topup",
  state: "completed",
  request_id: "req-1",
  created_at: "2026-11-17T02:28:53.627496Z",
  updated_at: "2026-11-17T02:28:53.990217Z",
  completed_at: "2026-11-17T02:28:53.987836Z",
  reference: "App Mastery Kevin Martin 2/3",
  legs: [{ leg_id: "leg-1", account_id: MAIN_EUR_ACCOUNT_ID, amount: 1000, currency: "EUR", description: "Payment from Exemple Conseil Sarl-s", ...leg }],
  ...over,
});

test("référence 2/3 sur Main EUR : l'échéance 2 est cochée, à la date du virement à Luxembourg", () => {
  const d = decide(tx(), students());
  assert.equal(d.action, "mark");
  if (d.action !== "mark") return;
  assert.equal(d.student.id, "st-kevin");
  assert.equal(d.position, 2);
  assert.equal(d.date, "2026-11-17");
  // 23 h 30 UTC le 16 = 0 h 30 le 17 à Luxembourg.
  const late = decide(tx({ completed_at: "2026-11-16T23:30:00Z" }), students());
  assert.equal(late.action === "mark" && late.date, "2026-11-17");
});

test("référence : accents, casse, espaces, nom collé ou à l'envers, toujours le même élève", () => {
  for (const reference of [
    "APP MASTERY KÉVIN MARTIN 2/3",
    "app mastery kevin martin 2 / 3",
    "AppMastery Martin Kevin 2/3",
    "PAYMENT FOR COURSE APP MASTERYKEVIN MARTIN 2/3",
    "App Mastery KevinMartin 2/3",
    "App Mastery - Kevin - Martin - 2 sur 3",
  ]) {
    const d = decide(tx({ reference }), students());
    assert.equal(d.action, "mark", reference);
    assert.equal(d.action === "mark" && d.position, 2, reference);
  }
});

test("référence sans n/N : l'échéance vient du montant et de la date", () => {
  const d = decide(tx({ reference: "APP MASTERY - KEVIN MARTIN" }), students());
  assert.equal(d.action === "mark" && d.position, 2);
});

test("sans référence App Mastery : nom du payeur et montant, comme le job de factures", () => {
  const d = decide(tx({ reference: "Deuxieme mensualite", completed_at: "2026-11-06T09:00:00Z" }, { amount: 1500, description: "Payment from Alice Martinez" }), students());
  assert.equal(d.action, "mark");
  assert.equal(d.action === "mark" && d.student.id, "st-alice");
  assert.equal(d.action === "mark" && d.position, 2);
});

test("1re échéance : jamais cochée, alerte « à cocher » (elle déclenche le Skool)", () => {
  const first = kevin({ schedule: [{ position: 1, amount: 1000, due: "2026-11-16", paid: false }, { position: 2, amount: 1000, due: "2026-12-16", paid: false }, { position: 3, amount: 1000, due: "2027-01-16", paid: false }] });
  const d = decide(tx({ reference: "App Mastery Kevin Martin 1/3" }), [first, alice()]);
  assert.equal(d.action, "alert");
  assert.equal(d.action === "alert" && d.kind, "premiere");
});

test("doutes : rien n'est coché, Jeremy est prévenu", () => {
  const cases: [string, RevolutTransaction, Student[]][] = [
    ["montant faux", tx({}, { amount: 900 }), students()],
    ["échéance déjà cochée", tx({ reference: "App Mastery Kevin Martin 1/3" }), students()],
    ["nombre d'échéances différent", tx({ reference: "App Mastery Kevin Martin 2/2" }), students()],
    ["élève introuvable", tx({ reference: "App Mastery Inconnu Personne 2/3" }, { description: "Payment from Inconnu Personne" }), students()],
    ["deux élèves du même nom", tx(), [kevin(), kevin({ id: "st-kevin-2" })]],
    ["contrat refusé", tx(), [kevin({ contractBlocked: true })]],
    ["sans référence, montant sans échéance", tx({ reference: "" }, { amount: 700, description: "Payment from Alice Martinez" }), students()],
  ];
  for (const [label, t, list] of cases) {
    const d = decide(t, list);
    assert.equal(d.action, "alert", label);
    assert.equal(d.action === "alert" && d.kind, "doute", label);
  }
});

test("paiement d'élève en dollars ou hors du compte Main EUR : alerte, pas de coche", () => {
  const usd = decide(tx({ reference: "PAYMENT FOR COURSE APP MASTERYKEVIN MARTIN 2/3" }, { account_id: "compte-usd", currency: "USD", amount: 1121 }), students());
  assert.equal(usd.action, "alert");
  assert.equal(usd.action === "alert" && usd.kind, "devise");
  assert.equal(usd.action === "alert" && usd.student?.id, "st-kevin");
  const otherEur = decide(tx({}, { account_id: "compte-tva" }), students());
  assert.equal(otherEur.action === "alert" && otherEur.kind, "devise");
  // En dollars mais pas un élève : simplement ignoré.
  const other = decide(tx({ reference: "Invoice 42" }, { account_id: "compte-usd", currency: "USD", description: "Payment from Some Client Inc" }), students());
  assert.equal(other.action, "ignore");
});

test("pas un paiement d'élève : ignoré sans alerte", () => {
  const cases: RevolutTransaction[] = [
    // Virement entre nos comptes : une jambe négative chez nous.
    tx({ type: "transfer", reference: undefined, legs: [{ account_id: MAIN_EUR_ACCOUNT_ID, amount: -843, currency: "EUR", description: "To EUR TVA" }, { account_id: "compte-tva", amount: 843, currency: "EUR", description: "From EUR Main" }] }),
    tx({ type: "card_payment" }, { amount: -12 }),
    tx({ type: "card_refund", reference: undefined }, { amount: 85.37, description: "Refund from Hotel" }),
    tx({ reference: "SKOOL" }, { amount: 24.73, description: "Payment from Skool.com Inc." }),
    tx({ reference: "GG104L4R9K" }, { amount: 150.97, description: "Payment from Google Ireland Limited" }),
    tx({ reference: "Facture 12" }, { amount: 500, description: "Payment from Inconnu Total" }),
    tx({ state: "pending" }),
  ];
  for (const t of cases) assert.equal(decide(t, students()).action, "ignore", `${t.type} ${t.reference}`);
});

// --- Événements : doublons, désordre, pannes ---------------------------------

function world(opts: { students?: Student[]; bank?: RevolutTransaction } = {}) {
  const list = opts.students ?? students();
  const bank = new Map<string, RevolutTransaction>([[TX_ID, opts.bank ?? tx()]]);
  const rows = new Map<string, StoredTransaction & { raw: RevolutTransaction; last_event: string; match_reason?: string; claimed_at?: number }>();
  const marks: { studentId: string; position: number; date: string }[] = [];
  const alerts: Alert[] = [];
  const c = { fetches: 0, saves: 0 };
  let failMarkOnce = false;
  let clock = Date.parse("2026-11-17T02:29:00Z");

  const store: RevolutStore = {
    async get(id) {
      const r = rows.get(id);
      return r ? { id: r.id, state: r.state, match_status: r.match_status, student_id: r.student_id, schedule_position: r.schedule_position, alerts: { ...r.alerts } } : null;
    },
    async save(t, event) {
      c.saves += 1;
      const r = rows.get(t.id);
      rows.set(t.id, { ...(r ?? { match_status: null, student_id: null, schedule_position: null, alerts: {} }), id: t.id, state: t.state, raw: t, last_event: event });
    },
    async touch(id, event) {
      (rows.get(id) as { last_event: string }).last_event = event;
    },
    async claim(id) {
      const r = rows.get(id);
      if (!r) return false;
      const stale = r.match_status === "processing" && clock - (r.claimed_at ?? 0) > 5 * 60 * 1000;
      if (r.match_status !== null && !stale) return false;
      r.match_status = "processing";
      r.claimed_at = clock;
      return true;
    },
    async release(id) {
      const r = rows.get(id);
      if (r?.match_status === "processing") r.match_status = null;
    },
    async finish(id, o: Outcome) {
      Object.assign(rows.get(id) as object, o);
    },
    async noteAlerts(id, a) {
      (rows.get(id) as StoredTransaction).alerts = a;
    },
  };
  const deps: WebhookDeps = {
    store,
    async fetchTransaction(id) {
      c.fetches += 1;
      const t = bank.get(id);
      if (!t) throw new Error("transaction inconnue chez Revolut");
      return structuredClone(t);
    },
    loadStudents: async () => structuredClone(list),
    async markPaid(studentId, position, date) {
      if (failMarkOnce) {
        failMarkOnce = false;
        throw new Error("Supabase indisponible");
      }
      const e = list.find((s) => s.id === studentId)?.schedule.find((x) => x.position === position);
      if (!e || e.paid) return false;
      e.paid = true;
      marks.push({ studentId, position, date });
      return true;
    },
    async alert(a) {
      alerts.push(a);
    },
    now: () => new Date(clock),
  };
  const created = (t: RevolutTransaction = tx()) => ({ event: "TransactionCreated", timestamp: t.created_at, data: structuredClone(t) });
  const changed = (oldState: string, newState: string, id = TX_ID) => ({ event: "TransactionStateChanged", timestamp: "2026-11-17T02:29:00Z", data: { id, request_id: "req-1", old_state: oldState, new_state: newState } });
  return { deps, rows, marks, alerts, c, bank, created, changed, failMarkOnce: () => (failMarkOnce = true), tick: (ms: number) => (clock += ms) };
}

test("virement réel en un événement : coché une fois, transaction enregistrée", async () => {
  const w = world();
  const r = await handleEvent(w.created(), w.deps);
  assert.match(r.result, /^paid/);
  assert.deepEqual(w.marks, [{ studentId: "st-kevin", position: 2, date: "2026-11-17" }]);
  assert.equal(w.alerts.length, 0);
  const row = w.rows.get(TX_ID);
  assert.equal(row?.match_status, "paid");
  assert.equal(row?.schedule_position, 2);
  assert.equal(row?.student_id, "st-kevin");
  assert.equal(w.c.fetches, 0, "TransactionCreated porte déjà la transaction");
});

test("doublons : le même événement reçu plusieurs fois, et en parallèle, ne coche qu'une fois", async () => {
  const w = world();
  await Promise.all([handleEvent(w.created(), w.deps), handleEvent(w.created(), w.deps)]);
  await handleEvent(w.created(), w.deps);
  await handleEvent(w.changed("pending", "completed"), w.deps);
  assert.equal(w.marks.length, 1);
  assert.equal(w.alerts.length, 0);
  assert.equal(w.rows.get(TX_ID)?.match_status, "paid");
});

test("en attente puis terminé : rien avant, coché quand Revolut annonce « completed »", async () => {
  const w = world({ bank: tx() });
  const r1 = await handleEvent(w.created(tx({ state: "pending", completed_at: undefined })), w.deps);
  assert.match(r1.result, /en attente/);
  assert.equal(w.marks.length, 0);
  assert.equal(w.rows.get(TX_ID)?.state, "pending");
  await handleEvent(w.changed("pending", "completed"), w.deps);
  assert.equal(w.c.fetches, 1, "le montant est relu chez Revolut");
  assert.equal(w.marks.length, 1);
  assert.equal(w.rows.get(TX_ID)?.state, "completed");
});

test("désordre : « completed » arrive avant la création, qui ne fait pas reculer l'état", async () => {
  const w = world();
  await handleEvent(w.changed("pending", "completed"), w.deps);
  assert.equal(w.marks.length, 1);
  await handleEvent(w.created(tx({ state: "pending", completed_at: undefined })), w.deps);
  assert.equal(w.rows.get(TX_ID)?.state, "completed");
  assert.equal(w.rows.get(TX_ID)?.last_event, "TransactionCreated");
  assert.equal(w.marks.length, 1);
  assert.equal(w.c.fetches, 1);
});

test("Revolut relit encore « pending » juste après l'annonce : l'annonce fait foi", async () => {
  const w = world({ bank: tx({ state: "pending" }) });
  await handleEvent(w.changed("pending", "completed"), w.deps);
  assert.equal(w.marks.length, 1);
});

test("1re échéance : une seule alerte, même si l'événement revient", async () => {
  const first = kevin({ schedule: [{ position: 1, amount: 1000, due: "2026-11-16", paid: false }, { position: 2, amount: 1000, due: "2026-12-16", paid: false }, { position: 3, amount: 1000, due: "2027-01-16", paid: false }] });
  const t = tx({ reference: "App Mastery Kevin Martin 1/3" });
  const w = world({ students: [first], bank: t });
  await handleEvent(w.created(t), w.deps);
  await handleEvent(w.created(t), w.deps);
  await handleEvent(w.changed("pending", "completed"), w.deps);
  assert.equal(w.marks.length, 0);
  assert.equal(w.alerts.length, 1);
  assert.match(w.alerts[0].title, /1re échéance reçue, à cocher/);
  assert.equal(w.alerts[0].studentId, "st-kevin");
  assert.equal(w.rows.get(TX_ID)?.match_status, "alert");
  assert.ok(w.rows.get(TX_ID)?.alerts.premiere);
});

test("montant faux et dollars : alerte, rien de coché", async () => {
  for (const t of [tx({}, { amount: 999 }), tx({}, { account_id: "compte-usd", currency: "USD", amount: 1121 })]) {
    const w = world({ bank: t });
    await handleEvent(w.created(t), w.deps);
    assert.equal(w.marks.length, 0);
    assert.equal(w.alerts.length, 1);
    assert.equal(w.rows.get(TX_ID)?.match_status, "alert");
    assert.ok(w.alerts[0].lines.some((l) => l.includes("Rien n'a été coché")));
  }
});

test("panne en cours de route : réservation libérée, Revolut renvoie, coché une seule fois", async () => {
  const w = world();
  w.failMarkOnce();
  await assert.rejects(handleEvent(w.created(), w.deps), /Supabase indisponible/);
  assert.equal(w.rows.get(TX_ID)?.match_status, null);
  assert.equal(w.marks.length, 0);
  await handleEvent(w.created(), w.deps);
  assert.equal(w.marks.length, 1);
});

test("traitement mort sans libérer (délai dépassé) : repris après 5 minutes, pas avant", async () => {
  const w = world();
  await handleEvent(w.created(tx({ state: "pending" })), w.deps);
  // Comme un processus tué juste après la réservation.
  assert.equal(await w.deps.store.claim(TX_ID), true);
  await handleEvent(w.created(), w.deps);
  assert.equal(w.marks.length, 0, "réservation récente : on ne double pas un traitement en cours");
  w.tick(6 * 60 * 1000);
  await handleEvent(w.created(), w.deps);
  assert.equal(w.marks.length, 1);
});

test("virement annulé après coche : Jeremy prévenu une fois, rien décoché tout seul", async () => {
  const w = world();
  await handleEvent(w.created(), w.deps);
  w.bank.set(TX_ID, tx({ state: "reverted" }));
  await handleEvent(w.changed("completed", "reverted"), w.deps);
  await handleEvent(w.changed("completed", "reverted"), w.deps);
  assert.equal(w.alerts.length, 1);
  assert.match(w.alerts[0].title, /annulé/);
  assert.equal(w.rows.get(TX_ID)?.state, "reverted");
  assert.equal(w.rows.get(TX_ID)?.match_status, "paid");
});

test("événements inconnus ou incomplets : ignorés, rien d'enregistré", async () => {
  const w = world();
  for (const p of [{ event: "PayoutLinkCreated", data: { id: TX_ID } }, { event: "TransactionCreated" }, null, "texte"]) {
    await handleEvent(p, w.deps);
  }
  assert.equal(w.rows.size, 0);
  assert.equal(w.c.fetches, 0);
});
