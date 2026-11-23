// Comptabilité automatique de SDG STUDIO.
//   passage   récupère les dépenses et les pièces, les rapproche, dépose dans Odoo
//             (--sans-depot : tout sauf le dépôt dans Odoo)
//   apercu    compte ce qui est nouveau, sans rien écrire
//   etat      dépenses par mois et par statut
import { db, passage } from "@/lib/compta/pipeline";

const [cmd = "passage", ...options] = process.argv.slice(2);
const print = (x: unknown) => console.log(JSON.stringify(x, null, 2));

async function etat() {
  const { data, error } = await db().from("compta_depenses").select("date, statut, categorie, marchand, montant, devise").eq("societe", "sdg").order("date");
  if (error) throw new Error(error.message);
  const parMois: Record<string, Record<string, number>> = {};
  for (const d of data ?? []) {
    const m = d.date.slice(0, 7);
    parMois[m] ??= {};
    parMois[m][d.statut] = (parMois[m][d.statut] ?? 0) + 1;
  }
  print(parMois);
}

async function main() {
  if (cmd === "etat") return etat();
  if (cmd !== "passage" && cmd !== "apercu") throw new Error(`Commande inconnue : ${cmd}`);
  const r = await passage({ ecrire: cmd === "passage", deposer: !options.includes("--sans-depot"), lecturesMax: 100, log: (m) => console.error(m) });
  print(r);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
