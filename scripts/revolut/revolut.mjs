// Client minimal de l'API Business de Revolut (clé API + signature Ed25519 de chaque requête).
// Message signé : horodatage (ms) + MÉTHODE + chemin depuis /api + requête sans « ? » + corps JSON minifié.
// Clé : REVOLUT_API_KEY / REVOLUT_SIGNING_KEY (base64 du PEM) dans l'environnement, sinon ~/.config/revolut/.
import { createPrivateKey, sign } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const BASE = "https://b2b.revolut.com";
const lire = (f) => { try { return readFileSync(`${homedir()}/.config/revolut/${f}`, "utf8"); } catch { return null; } };
const CLE = process.env.REVOLUT_API_KEY || (lire("lecture-api-key") || "").trim();
const PEM = process.env.REVOLUT_SIGNING_KEY ? Buffer.from(process.env.REVOLUT_SIGNING_KEY, "base64").toString("utf8") : lire("lecture-private.pem");

export async function appel(methode, chemin, { query = "", corps = null } = {}) {
  if (!CLE || !PEM) throw new Error("clé Revolut absente");
  const ts = String(Date.now());
  const body = corps == null ? "" : JSON.stringify(corps);
  const message = ts + methode.toUpperCase() + chemin + query + body;
  const signature = sign(null, Buffer.from(message), createPrivateKey(PEM)).toString("base64");
  const r = await fetch(BASE + chemin + (query ? "?" + query : ""), {
    method: methode.toUpperCase(),
    headers: { Authorization: `Bearer ${CLE}`, "Revolut-Api-Timestamp": ts, "Revolut-Api-Signature": signature, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body || undefined,
  });
  const texte = await r.text();
  if (!r.ok) throw new Error(`Revolut ${r.status} : ${texte.slice(0, 200)}`);
  return texte ? JSON.parse(texte) : null;
}
