import assert from "node:assert/strict";
import { generateKeyPairSync, verify } from "node:crypto";
import { test } from "node:test";
import type { ModeSetting } from "../../mises-de-cote/calcul";
import { MAIN_EUR_ACCOUNT_ID } from "../rapprochement";
import type { RevolutTransaction } from "../types";
import { LIMITS, TARGET_ACCOUNTS, assertAllowedCall, assertSafeBody, checkTransfer, runTransfers, transferApi, verifyAccounts, type Account, type TransferApi, type TransferBody, type TransferDeps, type TransferRow } from "../virements";

// Faux Revolut et fausse table set_asides : aucun appel réseau. Les montants
// sont ceux d'une mensualité de 1 000 € (TVA 145,30 €, closer 170,94 €).

const ID = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

const ACCOUNTS: Account[] = [
  { id: MAIN_EUR_ACCOUNT_ID, name: "Main", currency: "EUR", balance: 18_000, state: "active" },
  { id: TARGET_ACCOUNTS.tva.id, name: "TVA", currency: "EUR", balance: 2943, state: "active" },
  { id: TARGET_ACCOUNTS.closers.id, name: "Closers", currency: "EUR", balance: 1539, state: "active" },
  { id: "aba1f598-0000-4000-8000-000000000000", name: "Impôts", currency: "EUR", balance: 0, state: "active" },
  { id: "a20668cd-0000-4000-8000-000000000000", name: "Main", currency: "USD", balance: 1121, state: "active" },
  { id: "0f828154-0000-4000-8000-000000000000", currency: "EUR", balance: 0, state: "active" },
];

const row = (n: number, over: Partial<TransferRow> = {}): TransferRow => ({
  id: ID(n),
  kind: "tva",
  target_account: "tva",
  amount: 145.3,
  currency: "EUR",
  status: "a_faire",
  reference: `TVA Alice M ${n}/3`,
  student_name: "Alice Martinez",
  schedule_position: n,
  schedule_count: 3,
  transfer_started_at: null,
  revolut_transfer_id: null,
  ...over,
});

const AUTO: ModeSetting = { mode: "auto", since: null, halted: null };

type World = ReturnType<typeof world>;

function world(opts: { setting?: ModeSetting; rows?: TransferRow[]; accounts?: Account[]; today?: number; answer?: (b: TransferBody) => { state: string; legs?: RevolutTransaction["legs"] }; postFails?: boolean } = {}) {
  let setting = opts.setting ?? AUTO;
  const rows = new Map((opts.rows ?? [row(1), row(1, { id: ID(2), kind: "closer", target_account: "closers", amount: 170.94, reference: "Closer Alice M 1/3" })]).map((r) => [r.id, { ...r, done: false, error: null as string | null }]));
  const txs = new Map<string, RevolutTransaction>();
  const calls: string[] = [];
  const posts: TransferBody[] = [];
  const alerts: string[] = [];
  let apiBuilt = 0;
  let seq = 0;

  const api: TransferApi = {
    async accounts() {
      calls.push("GET accounts");
      return structuredClone(opts.accounts ?? ACCOUNTS);
    },
    async transfer(body) {
      calls.push("POST transfer");
      assertSafeBody(body);
      posts.push(body);
      if (opts.postFails) throw new Error("délai dépassé");
      const existing = [...txs.values()].find((t) => t.request_id === body.request_id);
      if (existing) return { id: existing.id, state: existing.state };
      const a = opts.answer?.(body) ?? { state: "completed" };
      const id = `11111111-0000-4000-8000-${String(++seq).padStart(12, "0")}`;
      txs.set(id, {
        id,
        type: "transfer",
        state: a.state,
        request_id: body.request_id,
        created_at: "2026-11-18T08:00:00Z",
        completed_at: a.state === "completed" ? "2026-11-18T08:00:01Z" : undefined,
        legs: a.legs ?? [
          { account_id: body.source_account_id, amount: -body.amount, currency: "EUR" },
          { account_id: body.target_account_id, amount: body.amount, currency: "EUR" },
        ],
      });
      return { id, state: a.state };
    },
    async transaction(id) {
      calls.push("GET transaction");
      const t = txs.get(id);
      if (!t) throw new Error("introuvable");
      return structuredClone(t);
    },
    async transactionByRequestId(rid) {
      calls.push("GET transaction par request_id");
      return structuredClone([...txs.values()].find((t) => t.request_id === rid) ?? null);
    },
  };

  const deps: TransferDeps = {
    setting: async () => setting,
    pending: async () => [...rows.values()].filter((r) => r.status === "a_faire").map((r) => ({ ...r })),
    transferredToday: async () => opts.today ?? 0,
    async claim(id) {
      const r = rows.get(id);
      if (!r || r.status !== "a_faire" || r.transfer_started_at) return false;
      r.transfer_started_at = "2026-11-18T08:00:00Z";
      return true;
    },
    async noteTransfer(id, transferId) {
      (rows.get(id) as TransferRow).revolut_transfer_id = transferId;
    },
    async done(id, transferId) {
      const r = rows.get(id) as TransferRow;
      r.status = "vire";
      r.revolut_transfer_id = transferId;
    },
    async noteError(id, error) {
      (rows.get(id) as { error: string | null }).error = error;
    },
    async halt(reason) {
      setting = { ...setting, halted: { at: "2026-11-18T08:00:00Z", reason } };
    },
    async alert(title, lines) {
      alerts.push(`${title} | ${lines[0]}`);
    },
    api: () => {
      apiBuilt += 1;
      return api;
    },
    today: () => "2026-11-18",
    now: () => new Date("2026-11-18T08:00:00Z"),
  };
  return { deps, rows, txs, calls, posts, alerts, setting: () => setting, apiBuilt: () => apiBuilt, unhalt: () => (setting = { ...setting, halted: null }) };
}

const statuses = (w: World) => [...w.rows.values()].map((r) => r.status);

// --- Interrupteur ------------------------------------------------------------------

test("modes off et simulation : aucun appel à Revolut, même en lecture, rien ne bouge", async () => {
  for (const mode of ["off", "simulation"] as const) {
    const w = world({ setting: { mode, since: null, halted: null } });
    const r = await runTransfers(w.deps);
    assert.match(r.skipped ?? "", new RegExp(mode));
    assert.equal(w.apiBuilt(), 0);
    assert.deepEqual(w.calls, []);
    assert.deepEqual(statuses(w), ["a_faire", "a_faire"]);
  }
});

test("arrêt total en cours : aucun appel à Revolut", async () => {
  const w = world({ setting: { ...AUTO, halted: { at: "2026-11-17T20:00:00Z", reason: "écart" } } });
  const r = await runTransfers(w.deps);
  assert.match(r.skipped ?? "", /arrêt total/);
  assert.equal(w.apiBuilt(), 0);
});

// --- Cas normal -------------------------------------------------------------------

test("auto : Main EUR vers TVA et Closers, request_id = ligne, vérifié puis « vire »", async () => {
  const w = world();
  const r = await runTransfers(w.deps);
  assert.equal(r.halted, null);
  assert.deepEqual(statuses(w), ["vire", "vire"]);
  assert.deepEqual(w.posts, [
    { request_id: ID(1), source_account_id: MAIN_EUR_ACCOUNT_ID, target_account_id: TARGET_ACCOUNTS.tva.id, amount: 145.3, currency: "EUR", reference: "TVA Alice M 1/3" },
    { request_id: ID(2), source_account_id: MAIN_EUR_ACCOUNT_ID, target_account_id: TARGET_ACCOUNTS.closers.id, amount: 170.94, currency: "EUR", reference: "Closer Alice M 1/3" },
  ]);
  // Relancer ne vire rien de plus.
  await runTransfers(w.deps);
  assert.equal(w.posts.length, 2);
});

test("virement en attente chez Revolut : noté, terminé au passage suivant sans nouvel envoi", async () => {
  let state = "pending";
  const w = world({ rows: [row(1)], answer: () => ({ state }) });
  await runTransfers(w.deps);
  assert.deepEqual(statuses(w), ["a_faire"]);
  assert.ok(w.rows.get(ID(1))?.revolut_transfer_id);
  state = "completed";
  for (const t of w.txs.values()) t.state = "completed";
  await runTransfers(w.deps);
  assert.deepEqual(statuses(w), ["vire"]);
  assert.equal(w.posts.length, 1);
});

// --- Comptes ---------------------------------------------------------------------

test("comptes : cible hors liste, renommée, doublon, source absente : arrêt total, aucun virement", async () => {
  const variants: [string, Account[]][] = [
    ["TVA renommé", ACCOUNTS.map((a) => (a.id === TARGET_ACCOUNTS.tva.id ? { ...a, name: "Impôts 2" } : a))],
    // Noms échangés : chaque nom existe une fois, mais pas sur le bon identifiant.
    ["TVA et Closers inversés", ACCOUNTS.map((a) => (a.id === TARGET_ACCOUNTS.tva.id ? { ...a, name: "Closers" } : a.id === TARGET_ACCOUNTS.closers.id ? { ...a, name: "TVA" } : a))],
    ["Closers absent", ACCOUNTS.filter((a) => a.id !== TARGET_ACCOUNTS.closers.id)],
    ["deux comptes TVA", [...ACCOUNTS, { id: "99999999-0000-4000-8000-000000000000", name: "TVA", currency: "EUR", balance: 0, state: "active" }]],
    ["Main absent", ACCOUNTS.filter((a) => a.id !== MAIN_EUR_ACCOUNT_ID)],
    ["Main fermé", ACCOUNTS.map((a) => (a.id === MAIN_EUR_ACCOUNT_ID ? { ...a, state: "inactive" } : a))],
    ["TVA en dollars", ACCOUNTS.map((a) => (a.id === TARGET_ACCOUNTS.tva.id ? { ...a, currency: "USD" } : a))],
  ];
  for (const [label, accounts] of variants) {
    assert.equal(verifyAccounts(accounts).ok, false, label);
    const w = world({ accounts });
    const r = await runTransfers(w.deps);
    assert.ok(r.halted, label);
    assert.equal(w.posts.length, 0, label);
    assert.ok(w.setting().halted, `${label} : arrêt enregistré`);
    assert.match(w.alerts[0], /arrêt total/, label);
  }
  assert.equal(verifyAccounts(ACCOUNTS).ok, true);
});

test("ligne vers un compte hors liste (Impôts, bénéficiaire) : arrêt total, aucun virement", async () => {
  for (const bad of [row(1, { target_account: "impots" as never }), row(1, { kind: "tva", target_account: "closers" }), row(1, { currency: "USD" })]) {
    const w = world({ rows: [bad] });
    const r = await runTransfers(w.deps);
    assert.ok(r.halted);
    assert.equal(w.posts.length, 0);
  }
});

test("clé de virement absente : rien ne part, les lignes attendent, pas d'arrêt total", async () => {
  const w = world({});
  const deps = { ...w.deps, api: () => transferApi({}) };
  const r = await runTransfers(deps);
  assert.match(r.skipped ?? "", /clé de virement absente : 2 lignes en attente/);
  assert.equal(r.halted, null);
  assert.equal(w.setting().halted, null);
  assert.equal(w.posts.length, 0);
  assert.deepEqual(statuses(w), ["a_faire", "a_faire"]);
});

test("vente payée en une fois : la part du closer (512,82 €) passe sous le plafond", () => {
  assert.equal(checkTransfer(row(1, { kind: "closer", target_account: "closers", amount: 512.82 }), { setting: AUTO, mainBalance: 18_000, transferredToday: 0 }).ok, true);
});

// --- Plafonds et solde -----------------------------------------------------------

test("plafond par virement (600 €) : la ligne attend Jeremy, les autres partent", async () => {
  const w = world({ rows: [row(1, { kind: "closer", target_account: "closers", amount: 683.76, reference: "Closer Bruno P 1/1" }), row(2)] });
  const r = await runTransfers(w.deps);
  assert.equal(r.refused.length, 1);
  assert.match(r.refused[0], /plafond de 600/);
  assert.deepEqual(statuses(w), ["a_faire", "vire"]);
  assert.equal(w.posts.length, 1);
  assert.match(w.rows.get(ID(1))?.error ?? "", /à la main/);
  assert.equal(r.halted, null);
});

test("plafond par jour (2 000 €) : on s'arrête là pour aujourd'hui", async () => {
  const w = world({ today: 1900 });
  const r = await runTransfers(w.deps);
  assert.match(r.stopped ?? "", /par jour/);
  assert.equal(w.posts.length, 0);
  assert.deepEqual(statuses(w), ["a_faire", "a_faire"]);
  // 1 700 € déjà virés : la TVA passe (1 845,30 €), le closer non (2 016,24 €).
  const w2 = world({ today: 1700 });
  await runTransfers(w2.deps);
  assert.equal(w2.posts.length, 1);
});

test("solde de Main EUR : jamais sous 1 000 €", async () => {
  const poor = (balance: number) => ACCOUNTS.map((a) => (a.id === MAIN_EUR_ACCOUNT_ID ? { ...a, balance } : a));
  const w = world({ accounts: poor(1100) });
  const r = await runTransfers(w.deps);
  assert.match(r.stopped ?? "", /sous 1000/);
  assert.equal(w.posts.length, 0);
  // 1 200 € : la TVA passe (reste 1 054,70 €), le closer ferait passer sous 1 000 €.
  const w2 = world({ accounts: poor(1200) });
  await runTransfers(w2.deps);
  assert.equal(w2.posts.length, 1);
  assert.equal(checkTransfer(row(1, { amount: 100 }), { setting: AUTO, mainBalance: 1100, transferredToday: 0 }).ok, true);
  assert.equal(checkTransfer(row(1, { amount: 100.01 }), { setting: AUTO, mainBalance: 1100, transferredToday: 0 }).ok, false);
});

test("checkTransfer : montants invalides et référence douteuse arrêtent tout", () => {
  for (const bad of [row(1, { amount: 0 }), row(1, { amount: -10 }), row(1, { amount: 10.001 }), row(1, { reference: "TVA <script>" }), row(1, { status: "vire" }), row(1, { id: "pas-un-uuid" })]) {
    const c = checkTransfer(bad, { setting: AUTO, mainBalance: 18_000, transferredToday: 0 });
    assert.equal(c.ok, false);
    assert.equal(!c.ok && c.action, "halt", JSON.stringify(bad));
  }
  assert.equal(LIMITS.perTransfer, 600);
  assert.equal(LIMITS.perDay, 2000);
  assert.equal(LIMITS.minMainBalance, 1000);
});

// --- Écarts chez Revolut -----------------------------------------------------------

test("virement refusé, montant ou compte différent chez Revolut : arrêt total", async () => {
  const cases: [string, (b: TransferBody) => { state: string; legs?: RevolutTransaction["legs"] }][] = [
    ["refusé", () => ({ state: "declined" })],
    ["échoué", () => ({ state: "failed" })],
    ["montant", (b) => ({ state: "completed", legs: [{ account_id: b.source_account_id, amount: -(b.amount + 1), currency: "EUR" }, { account_id: b.target_account_id, amount: b.amount + 1, currency: "EUR" }] })],
    ["autre compte", (b) => ({ state: "completed", legs: [{ account_id: b.source_account_id, amount: -b.amount, currency: "EUR" }, { account_id: "aba1f598-0000-4000-8000-000000000000", amount: b.amount, currency: "EUR" }] })],
    ["une seule jambe", (b) => ({ state: "completed", legs: [{ account_id: b.source_account_id, amount: -b.amount, currency: "EUR" }] })],
  ];
  for (const [label, answer] of cases) {
    const w = world({ answer });
    const r = await runTransfers(w.deps);
    assert.ok(r.halted, label);
    assert.equal(w.posts.length, 1, `${label} : on s'arrête au premier`);
    assert.ok(w.setting().halted, label);
  }
});

test("issue incertaine (panne pendant l'envoi) : arrêt total, puis reprise par request_id sans nouvel envoi", async () => {
  const w = world({ rows: [row(1)], postFails: true });
  const r = await runTransfers(w.deps);
  assert.ok(r.halted);
  assert.ok(w.rows.get(ID(1))?.transfer_started_at, "réservée avant l'appel");
  // Jeremy vérifie et lève l'arrêt ; Revolut ne connaît pas le virement : nouvel arrêt, pas de renvoi.
  w.unhalt();
  const again = await runTransfers(w.deps);
  assert.match(again.halted ?? "", /inconnu chez Revolut/);
  assert.equal(w.posts.length, 1);
});

test("reprise : le virement existe chez Revolut, la ligne passe « vire » sans nouvel envoi", async () => {
  const w = world({ rows: [row(1)] });
  // Premier passage arrêté juste après l'envoi : on simule une ligne réservée.
  const body: TransferBody = { request_id: ID(1), source_account_id: MAIN_EUR_ACCOUNT_ID, target_account_id: TARGET_ACCOUNTS.tva.id, amount: 145.3, currency: "EUR", reference: "TVA Alice M 1/3" };
  await w.deps.api().transfer(body);
  (w.rows.get(ID(1)) as TransferRow).transfer_started_at = "2026-11-18T08:00:00Z";
  await runTransfers(w.deps);
  assert.deepEqual(statuses(w), ["vire"]);
  assert.equal(w.posts.length, 1);
});

// --- Dernier verrou et client ---------------------------------------------------------

const safe: TransferBody = { request_id: ID(1), source_account_id: MAIN_EUR_ACCOUNT_ID, target_account_id: TARGET_ACCOUNTS.tva.id, amount: 145.3, currency: "EUR", reference: "TVA Alice M 1/3" };

test("dernier verrou : seulement Main EUR vers TVA ou Closers, en euros, sous 600 €", () => {
  assert.doesNotThrow(() => assertSafeBody(safe));
  const refused: TransferBody[] = [
    { ...safe, target_account_id: "aba1f598-0000-4000-8000-000000000000" },
    { ...safe, source_account_id: TARGET_ACCOUNTS.closers.id },
    { ...safe, amount: 600.01 },
    { ...safe, amount: 0 },
    { ...safe, currency: "USD" as "EUR" },
    { ...safe, request_id: "1" },
    { ...safe, counterparty_id: "x" } as TransferBody,
  ];
  for (const b of refused) assert.throws(() => assertSafeBody(b), /Virement refusé/, JSON.stringify(b));
});

test("client : clé de virement obligatoire, POST signé seulement vers /api/1.0/transfer", async () => {
  assert.throws(() => transferApi({}), /REVOLUT_TRANSFER_API_KEY/);
  // La clé de lecture ne suffit pas.
  assert.throws(() => transferApi({ REVOLUT_API_KEY: "lecture", REVOLUT_SIGNING_KEY: "x" }), /REVOLUT_TRANSFER_API_KEY/);

  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const seen: { url: string; method: string; headers: Record<string, string>; body: string | undefined }[] = [];
  const fakeFetch = (async (url: string, init: RequestInit) => {
    seen.push({ url, method: init.method ?? "GET", headers: init.headers as Record<string, string>, body: init.body as string | undefined });
    return new Response(JSON.stringify({ id: "11111111-0000-4000-8000-000000000001", state: "completed" }), { status: 200 });
  }) as unknown as typeof fetch;
  const api = transferApi({ REVOLUT_TRANSFER_API_KEY: "cle-virement", REVOLUT_TRANSFER_SIGNING_KEY: Buffer.from(pem).toString("base64") }, fakeFetch);

  await api.transfer(safe);
  const call = seen[0];
  assert.equal(call.url, "https://b2b.revolut.com/api/1.0/transfer");
  assert.equal(call.method, "POST");
  assert.equal(call.body, JSON.stringify(safe));
  assert.equal(call.headers.Authorization, "Bearer cle-virement");
  const message = Buffer.from(call.headers["Revolut-Api-Timestamp"] + "POST" + "/api/1.0/transfer" + call.body);
  assert.equal(verify(null, message, publicKey, Buffer.from(call.headers["Revolut-Api-Signature"], "base64")), true);

  // Un corps dangereux est refusé avant tout appel réseau.
  await assert.rejects(api.transfer({ ...safe, target_account_id: "aba1f598-0000-4000-8000-000000000000" }), /hors liste blanche/);
  assert.equal(seen.length, 1);
});

test("client : seuls les GET et POST /api/1.0/transfer sont permis", () => {
  assert.doesNotThrow(() => assertAllowedCall("GET", "/api/1.0/accounts"));
  assert.doesNotThrow(() => assertAllowedCall("POST", "/api/1.0/transfer"));
  for (const [method, path] of [["POST", "/api/1.0/pay"], ["POST", "/api/1.0/counterparty"], ["POST", "/api/1.0/transfer/"], ["DELETE", "/api/1.0/counterparty/x"], ["PATCH", "/api/1.0/transfer"], ["GET", "https://ailleurs.example/api/1.0/accounts"]]) {
    assert.throws(() => assertAllowedCall(method, path), /interdit/, `${method} ${path}`);
  }
});
