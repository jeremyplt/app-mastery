import { createPrivateKey, sign } from "node:crypto";
import type { RevolutTransaction } from "./types";

// Client de l'API Business de Revolut, en LECTURE SEULE : il ne sait faire que
// des GET. Chaque requête est signée en Ed25519 : horodatage (ms) + MÉTHODE +
// chemin depuis /api + requête sans « ? » + corps (vide pour un GET), en base64.
// REVOLUT_API_KEY : la clé API. REVOLUT_SIGNING_KEY : la clé privée PEM, en base64.

const BASE = "https://b2b.revolut.com";

export function signRequest(pem: string, timestamp: string, method: string, path: string, query = "", body = ""): string {
  return sign(null, Buffer.from(timestamp + method.toUpperCase() + path + query + body), createPrivateKey(pem)).toString("base64");
}

export async function revolutGet<T>(path: string, query = ""): Promise<T> {
  const key = process.env.REVOLUT_API_KEY?.trim();
  const pem64 = process.env.REVOLUT_SIGNING_KEY?.trim();
  if (!key || !pem64) throw new Error("REVOLUT_API_KEY ou REVOLUT_SIGNING_KEY manquante");
  if (!path.startsWith("/api/")) throw new Error(`Chemin Revolut inattendu : ${path}`);
  const ts = String(Date.now());
  const signature = signRequest(Buffer.from(pem64, "base64").toString("utf8"), ts, "GET", path, query);
  const res = await fetch(BASE + path + (query ? `?${query}` : ""), {
    headers: { Authorization: `Bearer ${key}`, "Revolut-Api-Timestamp": ts, "Revolut-Api-Signature": signature },
    signal: AbortSignal.timeout(10_000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Revolut ${res.status} : ${text.slice(0, 200)}`);
  return JSON.parse(text) as T;
}

export async function fetchTransaction(id: string): Promise<RevolutTransaction> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error(`Identifiant de transaction invalide : ${id.slice(0, 60)}`);
  return revolutGet<RevolutTransaction>(`/api/1.0/transaction/${id}`);
}
