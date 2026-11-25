// Vérifie la clé Revolut : liste les comptes (nom, devise, solde) et les 5 derniers mouvements. Lecture seule.
import { appel } from "./revolut.mjs";
const comptes = await appel("GET", "/api/1.0/accounts");
console.log("Comptes :");
for (const c of comptes) console.log(`  ${c.name || "(sans nom)"} ${c.currency} : ${c.balance}`);
const tx = await appel("GET", "/api/1.0/transactions", { query: "count=5" });
console.log("5 derniers mouvements :");
for (const t of tx) console.log(`  ${t.created_at.slice(0, 16)} ${t.type} ${t.state} ${(t.legs || []).map((l) => `${l.amount} ${l.currency}`).join(" / ")} · ${(t.legs && t.legs[0] && t.legs[0].description) || t.reference || ""}`);
