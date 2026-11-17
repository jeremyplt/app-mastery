import { signRequest } from "./client";
import { MAIN_EUR_ACCOUNT_ID } from "./rapprochement";
import type { RevolutTransaction } from "./types";
import { TARGET, type ModeSetting, type SetAsideKind, type TargetAccount } from "@/lib/mises-de-cote/calcul";

// Virements des mises de côté vers les sous-comptes TVA et Closers, par l'API
// Business (POST /api/1.0/transfer : virement entre comptes du même titulaire,
// jamais vers un bénéficiaire). Actifs quand l'interrupteur set_asides_mode est
// sur « auto » ; la clé qui en a le droit (REVOLUT_TRANSFER_API_KEY /
// REVOLUT_TRANSFER_SIGNING_KEY) n'existe que sur le serveur Harness, filtrée sur
// son IP. Sans elle, rien ne part et les lignes attendent. Garde-fous :
// - source : Main EUR seulement ; cibles : TVA et Closers seulement, en liste
//   blanche, chacune vérifiée par son identifiant ET son nom (GET accounts) ;
// - au plus 600 € par virement et 2 000 € par jour ;
// - jamais sous 1 000 € sur Main EUR ;
// - request_id = identifiant de la ligne : Revolut ne vire pas deux fois ;
// - au moindre écart (compte, réponse, état, montant), arrêt total enregistré
//   dans l'interrupteur et alerte : plus rien ne part avant que Jeremy lève l'arrêt.

export const SOURCE_ACCOUNT = { id: MAIN_EUR_ACCOUNT_ID, name: "Main", currency: "EUR" } as const;
export const TARGET_ACCOUNTS: Record<TargetAccount, { id: string; name: string }> = {
  tva: { id: "97db25ba-357c-40d0-89dc-40907a9c11fc", name: "TVA" },
  closers: { id: "8c168065-97fa-4479-8d6b-c0f9fd242fec", name: "Closers" },
};
export const LIMITS = { perTransfer: 600, perDay: 2000, minMainBalance: 1000 } as const;

const BASE = "https://b2b.revolut.com";
const round2 = (n: number) => Math.round(n * 100) / 100;
const isCents = (n: number) => Number.isFinite(n) && Math.abs(n * 100 - Math.round(n * 100)) < 1e-6;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type Account = { id: string; name?: string; currency: string; balance: number; state: string };
export type TransferBody = { request_id: string; source_account_id: string; target_account_id: string; amount: number; currency: "EUR"; reference: string };
export type TransferResponse = { id: string; state: string; created_at?: string; completed_at?: string };

export type TransferRow = {
  id: string;
  kind: SetAsideKind;
  target_account: TargetAccount;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  student_name: string;
  schedule_position: number;
  schedule_count: number;
  transfer_started_at: string | null;
  revolut_transfer_id: string | null;
};

// --- Garde-fous (fonctions pures) -----------------------------------------------

export type VerifiedAccounts = { source: Account; targets: Record<TargetAccount, Account> };

// Comptes lus chez Revolut : Main EUR et les deux cibles doivent exister, actifs,
// en euros, avec le bon nom ET le bon identifiant, et chaque nom une seule fois.
export function verifyAccounts(accounts: Account[]): { ok: true; accounts: VerifiedAccounts } | { ok: false; reason: string } {
  const find = (id: string, name: string): Account | string => {
    const byId = accounts.find((a) => a.id === id);
    if (!byId) return `compte ${name} (${id}) introuvable chez Revolut`;
    if ((byId.name ?? "") !== name) return `le compte ${id} s'appelle « ${byId.name ?? ""} » au lieu de « ${name} »`;
    if (byId.currency !== "EUR") return `le compte ${name} est en ${byId.currency}`;
    if (byId.state !== "active") return `le compte ${name} est ${byId.state}`;
    const twins = accounts.filter((a) => a.currency === "EUR" && (a.name ?? "") === name);
    if (twins.length !== 1) return `${twins.length} comptes EUR nommés « ${name} »`;
    return byId;
  };
  const source = find(SOURCE_ACCOUNT.id, SOURCE_ACCOUNT.name);
  if (typeof source === "string") return { ok: false, reason: source };
  const tva = find(TARGET_ACCOUNTS.tva.id, TARGET_ACCOUNTS.tva.name);
  if (typeof tva === "string") return { ok: false, reason: tva };
  const closers = find(TARGET_ACCOUNTS.closers.id, TARGET_ACCOUNTS.closers.name);
  if (typeof closers === "string") return { ok: false, reason: closers };
  if (!Number.isFinite(Number(source.balance))) return { ok: false, reason: "solde de Main EUR illisible" };
  return { ok: true, accounts: { source, targets: { tva, closers } } };
}

export type Check =
  | { ok: true; body: TransferBody }
  // refuse : cette ligne seulement (laissée « a_faire », Jeremy prévenu).
  // stop : plus rien aujourd'hui (plafond du jour, solde), sans arrêt total.
  // halt : écart, arrêt total enregistré.
  | { ok: false; action: "refuse" | "stop" | "halt"; reason: string };

export function checkTransfer(row: TransferRow, ctx: { setting: ModeSetting; mainBalance: number; transferredToday: number }): Check {
  if (ctx.setting.mode !== "auto") return { ok: false, action: "stop", reason: `mode ${ctx.setting.mode} : aucun virement` };
  if (ctx.setting.halted) return { ok: false, action: "stop", reason: `arrêt total en cours : ${ctx.setting.halted.reason}` };
  const label = `${row.reference} (${row.id})`;
  if (row.status !== "a_faire") return { ok: false, action: "halt", reason: `${label} : statut ${row.status}, pas « a_faire »` };
  if (!UUID.test(row.id)) return { ok: false, action: "halt", reason: `${label} : identifiant de ligne invalide` };
  if (row.currency !== "EUR") return { ok: false, action: "halt", reason: `${label} : devise ${row.currency}` };
  if (TARGET[row.kind] !== row.target_account || !TARGET_ACCOUNTS[row.target_account]) return { ok: false, action: "halt", reason: `${label} : compte cible « ${row.target_account} » hors liste pour ${row.kind}` };
  const amount = Number(row.amount);
  if (!(amount > 0) || !isCents(amount)) return { ok: false, action: "halt", reason: `${label} : montant ${row.amount} invalide` };
  if (!/^[A-Za-z0-9 /.-]{1,34}$/.test(row.reference)) return { ok: false, action: "halt", reason: `${label} : référence invalide` };
  if (amount > LIMITS.perTransfer) return { ok: false, action: "refuse", reason: `${label} : ${amount.toFixed(2)} € dépasse le plafond de ${LIMITS.perTransfer} € par virement, à virer à la main` };
  if (round2(ctx.transferredToday + amount) > LIMITS.perDay) return { ok: false, action: "stop", reason: `plafond de ${LIMITS.perDay} € par jour atteint (${ctx.transferredToday.toFixed(2)} € déjà virés), la suite demain` };
  if (round2(ctx.mainBalance - amount) < LIMITS.minMainBalance) return { ok: false, action: "stop", reason: `Main EUR passerait sous ${LIMITS.minMainBalance} € (solde ${ctx.mainBalance.toFixed(2)} €, virement ${amount.toFixed(2)} €)` };
  return {
    ok: true,
    body: { request_id: row.id, source_account_id: SOURCE_ACCOUNT.id, target_account_id: TARGET_ACCOUNTS[row.target_account].id, amount: round2(amount), currency: "EUR", reference: row.reference },
  };
}

// Le virement vu par Revolut doit être exactement celui demandé : même
// request_id, une jambe −montant sur Main EUR, une jambe +montant sur la cible.
export function verifyTransaction(tx: RevolutTransaction, body: TransferBody): string | null {
  if (tx.request_id !== undefined && tx.request_id !== body.request_id) return `request_id ${tx.request_id} au lieu de ${body.request_id}`;
  if (tx.type !== "transfer") return `type ${tx.type} au lieu de transfer`;
  const legs = tx.legs ?? [];
  const out = legs.filter((l) => l.account_id === body.source_account_id);
  const into = legs.filter((l) => l.account_id === body.target_account_id);
  const others = legs.filter((l) => l.account_id !== body.source_account_id && l.account_id !== body.target_account_id);
  if (others.length) return `jambe sur un autre compte (${others.map((l) => l.account_id).join(", ")})`;
  if (out.length !== 1 || round2(Number(out[0].amount)) !== -body.amount || out[0].currency !== "EUR") return `jambe Main EUR inattendue (${JSON.stringify(out)})`;
  if (into.length !== 1 || round2(Number(into[0].amount)) !== body.amount || into[0].currency !== "EUR") return `jambe cible inattendue (${JSON.stringify(into)})`;
  return null;
}

// --- Client Revolut des virements --------------------------------------------------

export interface TransferApi {
  accounts(): Promise<Account[]>;
  transfer(body: TransferBody): Promise<TransferResponse>;
  transaction(id: string): Promise<RevolutTransaction>;
  // Transaction retrouvée par notre request_id ; null si Revolut ne la connaît pas.
  transactionByRequestId(requestId: string): Promise<RevolutTransaction | null>;
}

// Dernier verrou avant l'appel, indépendant du reste du code : un corps qui ne
// va pas de Main EUR vers TVA ou Closers, en euros, sous le plafond, est refusé.
export function assertSafeBody(body: TransferBody): void {
  const targets = Object.values(TARGET_ACCOUNTS).map((t) => t.id);
  const keys = Object.keys(body).sort().join(",");
  if (keys !== "amount,currency,reference,request_id,source_account_id,target_account_id") throw new Error(`Virement refusé : champs inattendus (${keys})`);
  if (body.source_account_id !== SOURCE_ACCOUNT.id) throw new Error("Virement refusé : la source n'est pas Main EUR");
  if (!targets.includes(body.target_account_id)) throw new Error("Virement refusé : cible hors liste blanche");
  if (body.currency !== "EUR") throw new Error("Virement refusé : devise");
  if (!(body.amount > 0) || body.amount > LIMITS.perTransfer || !isCents(body.amount)) throw new Error(`Virement refusé : montant ${body.amount}`);
  if (!UUID.test(body.request_id)) throw new Error("Virement refusé : request_id");
}

// Appels permis à la clé de virement : lectures, et un seul POST, le virement
// entre nos comptes (jamais /pay, /counterparty...).
export function assertAllowedCall(method: string, path: string): void {
  if (!path.startsWith("/api/1.0/")) throw new Error(`Appel Revolut interdit : ${method} ${path}`);
  if (method === "GET") return;
  if (method === "POST" && path === "/api/1.0/transfer") return;
  throw new Error(`Appel Revolut interdit : ${method} ${path}`);
}

// Clé de virement absente du serveur : rien ne part, les lignes attendent, sans arrêt total.
export class MissingTransferKeyError extends Error {}

export function transferApi(env: Record<string, string | undefined> = process.env, fetcher: typeof fetch = fetch): TransferApi {
  const key = env.REVOLUT_TRANSFER_API_KEY?.trim();
  const pem64 = env.REVOLUT_TRANSFER_SIGNING_KEY?.trim();
  if (!key || !pem64) throw new MissingTransferKeyError("REVOLUT_TRANSFER_API_KEY ou REVOLUT_TRANSFER_SIGNING_KEY manquante : virements impossibles");
  const pem = Buffer.from(pem64, "base64").toString("utf8");

  async function call<T>(method: "GET" | "POST", path: string, query = "", body: TransferBody | null = null): Promise<{ status: number; data: T | null }> {
    assertAllowedCall(method, path);
    const raw = body ? JSON.stringify(body) : "";
    const ts = String(Date.now());
    const res = await fetcher(BASE + path + (query ? `?${query}` : ""), {
      method,
      headers: { Authorization: `Bearer ${key}`, "Revolut-Api-Timestamp": ts, "Revolut-Api-Signature": signRequest(pem, ts, method, path, query, raw), ...(raw ? { "Content-Type": "application/json" } : {}) },
      body: raw || undefined,
      signal: AbortSignal.timeout(20_000),
    });
    const text = await res.text();
    if (res.status === 404 && method === "GET") return { status: 404, data: null };
    if (!res.ok) throw new Error(`Revolut ${res.status} : ${text.slice(0, 200)}`);
    return { status: res.status, data: text ? (JSON.parse(text) as T) : null };
  }

  return {
    accounts: async () => (await call<Account[]>("GET", "/api/1.0/accounts")).data ?? [],
    async transfer(body) {
      assertSafeBody(body);
      const r = await call<TransferResponse>("POST", "/api/1.0/transfer", "", body);
      if (!r.data?.id) throw new Error("Revolut : réponse au virement sans identifiant");
      return r.data;
    },
    async transaction(id) {
      if (!UUID.test(id)) throw new Error(`Identifiant de transaction invalide : ${id.slice(0, 60)}`);
      const r = await call<RevolutTransaction>("GET", `/api/1.0/transaction/${id}`);
      if (!r.data) throw new Error(`Transaction ${id} introuvable`);
      return r.data;
    },
    async transactionByRequestId(requestId) {
      if (!UUID.test(requestId)) throw new Error("request_id invalide");
      return (await call<RevolutTransaction>("GET", `/api/1.0/transaction/${requestId}`, "id_type=request_id")).data;
    },
  };
}

// --- Passage du script (branchements injectés, testés avec des faux) -------------

export interface TransferDeps {
  setting(): Promise<ModeSetting>;
  // Lignes « a_faire », les plus anciennes d'abord.
  pending(): Promise<TransferRow[]>;
  // Total des virements commencés ce jour (Luxembourg).
  transferredToday(day: string): Promise<number>;
  // Réserve la ligne avant l'appel (transfer_started_at). Faux si déjà prise.
  claim(id: string): Promise<boolean>;
  // Identifiant et état donnés par Revolut (virement en attente).
  noteTransfer(id: string, transferId: string, state: string): Promise<void>;
  // Virement terminé et vérifié : statut « vire ».
  done(id: string, transferId: string, at: string): Promise<void>;
  noteError(id: string, error: string): Promise<void>;
  halt(reason: string): Promise<void>;
  alert(title: string, lines: string[]): Promise<void>;
  api(): TransferApi;
  today(): string;
  now(): Date;
}

export type TransferReport = { skipped: string | null; transferred: { id: string; reference: string; amount: number }[]; pending: string[]; refused: string[]; stopped: string | null; halted: string | null };

export async function runTransfers(deps: TransferDeps): Promise<TransferReport> {
  const report: TransferReport = { skipped: null, transferred: [], pending: [], refused: [], stopped: null, halted: null };
  const setting = await deps.setting();
  // Hors mode auto, ou arrêté : aucun appel à Revolut, même en lecture.
  if (setting.mode !== "auto") return { ...report, skipped: `mode ${setting.mode} : aucun virement` };
  if (setting.halted) return { ...report, skipped: `arrêt total depuis ${setting.halted.at} : ${setting.halted.reason}` };
  const rows = await deps.pending();
  if (!rows.length) return { ...report, skipped: "rien à virer" };

  const halt = async (reason: string) => {
    report.halted = reason;
    await deps.halt(reason);
    await deps.alert("🛑 Mises de côté : arrêt total des virements", [reason, "Plus aucun virement automatique avant que tu lèves l'arrêt (set_asides_mode.halted).", "Vérifie les comptes TVA, Closers et Main EUR dans Revolut."]);
    return report;
  };

  let api: TransferApi;
  let verified: VerifiedAccounts;
  try {
    api = deps.api();
  } catch (err) {
    if (err instanceof MissingTransferKeyError) return { ...report, skipped: `clé de virement absente : ${rows.length} ligne${rows.length > 1 ? "s" : ""} en attente` };
    return halt(`Clé de virement illisible : ${err instanceof Error ? err.message : String(err)}`);
  }
  try {
    const v = verifyAccounts(await api.accounts());
    if (!v.ok) return halt(`Comptes Revolut : ${v.reason}`);
    verified = v.accounts;
  } catch (err) {
    return halt(`Lecture des comptes impossible : ${err instanceof Error ? err.message : String(err)}`);
  }
  let balance = Number(verified.source.balance);
  let today = await deps.transferredToday(deps.today());

  // Une transaction Revolut pour cette ligne : vérifiée, puis terminée ou en attente.
  const settle = async (row: TransferRow, body: TransferBody, tx: RevolutTransaction): Promise<string | null> => {
    const wrong = verifyTransaction(tx, body);
    if (wrong) return `${row.reference} : ${wrong}`;
    if (tx.state === "completed") {
      await deps.done(row.id, tx.id, tx.completed_at ?? deps.now().toISOString());
      report.transferred.push({ id: row.id, reference: row.reference, amount: body.amount });
      return null;
    }
    if (tx.state === "pending" || tx.state === "created") {
      await deps.noteTransfer(row.id, tx.id, tx.state);
      report.pending.push(row.reference);
      return null;
    }
    return `${row.reference} : virement ${tx.state} chez Revolut`;
  };

  for (const row of rows) {
    const body: TransferBody = { request_id: row.id, source_account_id: SOURCE_ACCOUNT.id, target_account_id: TARGET_ACCOUNTS[row.target_account]?.id ?? "", amount: round2(Number(row.amount)), currency: "EUR", reference: row.reference };
    try {
      // Reprise d'un virement déjà lancé : on relit chez Revolut, jamais de nouvel envoi.
      if (row.transfer_started_at) {
        const tx = row.revolut_transfer_id ? await api.transaction(row.revolut_transfer_id) : await api.transactionByRequestId(row.id);
        if (!tx) return halt(`${row.reference} : virement lancé le ${row.transfer_started_at}, inconnu chez Revolut (issue incertaine)`);
        const problem = await settle(row, body, tx);
        if (problem) return halt(problem);
        continue;
      }

      const c = checkTransfer(row, { setting, mainBalance: balance, transferredToday: today });
      if (!c.ok) {
        if (c.action === "halt") return halt(c.reason);
        if (c.action === "stop") {
          report.stopped = c.reason;
          await deps.alert("⏸️ Mises de côté : virements arrêtés pour aujourd'hui", [c.reason]);
          break;
        }
        report.refused.push(c.reason);
        await deps.noteError(row.id, c.reason);
        await deps.alert("✋ Mise de côté à virer à la main", [c.reason]);
        continue;
      }
      if (!(await deps.claim(row.id))) continue;
      // Compté avant l'appel : un virement à l'issue incertaine compte aussi.
      balance = round2(balance - c.body.amount);
      today = round2(today + c.body.amount);
      const res = await api.transfer(c.body);
      if (res.state !== "completed" && res.state !== "pending" && res.state !== "created") return halt(`${row.reference} : virement ${res.state} chez Revolut`);
      const problem = await settle(row, c.body, await api.transaction(res.id));
      if (problem) return halt(problem);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await deps.noteError(row.id, message).catch(() => undefined);
      return halt(`${row.reference} : ${message}`);
    }
  }
  return report;
}
