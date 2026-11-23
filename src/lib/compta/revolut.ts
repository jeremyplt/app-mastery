import { revolutGet, signRequest } from "@/lib/revolut/client";
import type { Transaction } from "./regles";

// Lecture seule de Revolut Business pour la compta : opérations, dépenses (le
// « justificatif manquant » de l'app) et reçus joints depuis le téléphone.

export type Expense = { id: string; state: string; transaction_id: string | null; transaction_type: string; receipt_ids: string[] };

export async function comptes(): Promise<Set<string>> {
  const rows = await revolutGet<{ id: string }[]>("/api/1.0/accounts");
  return new Set(rows.map((r) => r.id));
}

// Toutes les opérations depuis une date, page par page (1 000 au plus par appel).
export async function operations(depuis: string): Promise<Transaction[]> {
  const out = new Map<string, Transaction>();
  let jusqua: string | null = null;
  for (let page = 0; page < 20; page++) {
    const q: string = `from=${depuis}&count=1000${jusqua ? `&to=${encodeURIComponent(jusqua)}` : ""}`;
    const rows: Transaction[] = await revolutGet<Transaction[]>("/api/1.0/transactions", q);
    for (const t of rows) out.set(t.id, t);
    if (rows.length < 1000) break;
    jusqua = rows[rows.length - 1].created_at;
  }
  return [...out.values()];
}

export async function depensesRevolut(): Promise<Expense[]> {
  const out = new Map<string, Expense>();
  let jusqua: string | null = null;
  for (let page = 0; page < 20; page++) {
    const rows: (Expense & { expense_date: string })[] = await revolutGet<(Expense & { expense_date: string })[]>("/api/1.0/expenses", `count=500${jusqua ? `&to=${encodeURIComponent(jusqua)}` : ""}`);
    for (const e of rows) out.set(e.id, e);
    if (rows.length < 500) break;
    jusqua = rows[rows.length - 1].expense_date;
  }
  return [...out.values()];
}

export async function recu(expenseId: string, receiptId: string): Promise<{ contenu: Buffer; mime: string }> {
  if (!/^[0-9a-f-]{36}$/i.test(expenseId) || !/^[0-9a-f-]{36}$/i.test(receiptId)) throw new Error("Identifiant de reçu invalide");
  const key = process.env.REVOLUT_API_KEY?.trim();
  const pem64 = process.env.REVOLUT_SIGNING_KEY?.trim();
  if (!key || !pem64) throw new Error("REVOLUT_API_KEY ou REVOLUT_SIGNING_KEY manquante");
  const path = `/api/1.0/expenses/${expenseId}/receipts/${receiptId}/content`;
  const ts = String(Date.now());
  const res = await fetch(`https://b2b.revolut.com${path}`, {
    headers: { Authorization: `Bearer ${key}`, "Revolut-Api-Timestamp": ts, "Revolut-Api-Signature": signRequest(Buffer.from(pem64, "base64").toString("utf8"), ts, "GET", path) },
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`Revolut ${res.status} sur le reçu ${receiptId}`);
  return { contenu: Buffer.from(await res.arrayBuffer()), mime: (res.headers.get("content-type") ?? "application/pdf").split(";")[0] };
}
