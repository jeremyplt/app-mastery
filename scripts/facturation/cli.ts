// Commande du job de facturation. Aucune option ne permet de choisir une TVA,
// une mention ou de renvoyer un mail : ces décisions restent dans le code.
//   scan                      ce que le job ferait, sans rien écrire
//   run                       traite les virements et affiche le rapport
//   replay                    compare les règles aux factures existantes
//   status                    factures en cours et cas à traiter
//   assign <virement> <élève> rattache un virement à un élève, contrôles compris
//   retry <clé>               relance une facture après correction
import { createClient } from "@supabase/supabase-js";
import { odooClient, realDeps } from "@/lib/facturation/adapters";
import { run, scan } from "@/lib/facturation/pipeline";
import { decideTax, MENTION_AUTOLIQUIDATION, MENTION_PARTICULIER_HORS_UE, MENTION_SOCIETE_HORS_UE } from "@/lib/facturation/rules";

const [cmd, ...args] = process.argv.slice(2);
const print = (x: unknown) => console.log(JSON.stringify(x, null, 2));
const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

async function replay() {
  const { kw } = odooClient();
  const invoices = await kw<{ id: number; name: string; partner_id: [number, string]; narration: string | false; fiscal_position_id: [number, string] | false; invoice_line_ids: number[]; currency_id: [number, string] }[]>("account.move", "search_read", [[["move_type", "=", "out_invoice"], ["state", "=", "posted"]]], { fields: ["name", "partner_id", "narration", "fiscal_position_id", "invoice_line_ids", "currency_id"], order: "name" });
  const port = odooClient().port;
  const diffs: unknown[] = [];
  let same = 0;
  for (const inv of invoices) {
    const f = await port.partnerFacts(inv.partner_id[0]);
    const d = decideTax({ isCompany: f.isCompany, countryCode: f.countryCode, vat: f.vat, hasResidenceProof: f.positionId === 6 && f.hasProofAttachment });
    const lines = await kw<{ tax_ids: number[]; display_type: string | false }[]>("account.move.line", "read", [inv.invoice_line_ids, ["tax_ids", "display_type"]]);
    const actualTax = lines.find((l) => l.tax_ids.length)?.tax_ids[0] ?? null;
    const text = (inv.narration || "").replace(/<[^>]+>/g, " ").replace(/&#39;/g, "'");
    const actualMention = [MENTION_AUTOLIQUIDATION, MENTION_SOCIETE_HORS_UE, MENTION_PARTICULIER_HORS_UE].find((m) => text.includes(m)) ?? null;
    if (!d.ok) {
      diffs.push({ facture: inv.name, client: inv.partner_id[1], regle: d.reason, reel: { taxe: actualTax, mention: actualMention?.slice(0, 30) ?? null } });
      continue;
    }
    if (d.taxId === actualTax && (d.mention ?? null) === actualMention) same += 1;
    else diffs.push({ facture: inv.name, client: inv.partner_id[1], pays: f.countryCode, societe: f.isCompany, regle: { taxe: d.taxId, mention: d.mention?.slice(0, 30) ?? null }, reel: { taxe: actualTax, mention: actualMention?.slice(0, 30) ?? null } });
  }
  print({ total: invoices.length, identiques: same, differences: diffs });
}

async function main() {
  switch (cmd) {
    case "scan":
      return print((await scan(realDeps())).map(({ line, decision }) => ({ virement: line.id, date: line.date, montant: line.amount, payeur: line.partner_name || line.payment_ref, decision })));
    case "run":
      return print(await run(realDeps()));
    case "replay":
      return replay();
    case "status": {
      const [{ data: rows }, { data: lines }, { data: auto }] = await Promise.all([
        db().from("invoice_automation").select("invoice_key, state, number, handoff_reason, last_error, updated_at").neq("state", "done"),
        db().from("invoice_bank_lines").select("bank_line_id, bank_date, amount, label, reason").eq("decision", "handoff"),
        db().from("site_settings").select("value").eq("key", "invoices_auto_send").maybeSingle(),
      ]);
      return print({ envoi_automatique: auto?.value, factures_en_cours: rows, virements_a_verifier: lines });
    }
    case "assign": {
      const [line, student] = args;
      if (!line || !student) throw new Error("Usage : assign <virement> <élève>");
      const { data, error } = await db().from("invoice_bank_lines").update({ assigned_student_id: student }).eq("bank_line_id", Number(line)).eq("decision", "handoff").select("bank_line_id");
      if (error) throw new Error(error.message);
      if (!data?.length) throw new Error("Ce virement n'est pas en attente de vérification");
      return print({ ok: true, note: "Pris en compte au prochain run, avec les contrôles habituels" });
    }
    case "retry": {
      const key = args[0];
      const { data: row } = await db().from("invoice_automation").select("state, odoo_invoice_id, number, invoice_id").eq("invoice_key", key).maybeSingle();
      if (!row || row.state !== "handoff") throw new Error("Cette facture n'est pas en attente de vérification");
      const state = row.invoice_id ? "waiting_send" : row.number ? "posted" : row.odoo_invoice_id ? "created" : "planned";
      const { error } = await db().from("invoice_automation").update({ state, handoff_reason: null }).eq("invoice_key", key);
      if (error) throw new Error(error.message);
      return print({ ok: true, reprise: state });
    }
    default:
      throw new Error("Commande inconnue : scan, run, replay, status, assign, retry");
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
