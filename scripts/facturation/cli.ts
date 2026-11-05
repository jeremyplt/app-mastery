// Commande du job de facturation. Aucune option ne permet de choisir une TVA,
// une mention ou de renvoyer un mail : ces décisions restent dans le code.
//   scan                      ce que le job ferait, sans rien écrire
//   run                       traite les virements et affiche le rapport
//   replay                    compare les règles aux factures existantes
//   status                    factures en cours et cas à traiter
//   assign <virement> <élève> rattache un virement à un élève, contrôles compris
//   retry <clé>               relance une facture après correction
//   smoke <fiches> [--garder] essai de création dans Odoo avec des brouillons
import { createClient } from "@supabase/supabase-js";
import { odooClient, realDeps } from "@/lib/facturation/adapters";
import { classifyLine, matchStudents, type BankLine } from "@/lib/facturation/match";
import { run, scan, type Plan } from "@/lib/facturation/pipeline";
import { fileInvoices, syncProofs } from "@/lib/facturation/sweeps";
import { notifyPort } from "@/lib/facturation/adapters";
import { decideTax, htFromTtc, MENTION_AUTOLIQUIDATION, MENTION_PARTICULIER_HORS_UE, MENTION_SOCIETE_HORS_UE, PRODUCT } from "@/lib/facturation/rules";

const [cmd, ...args] = process.argv.slice(2);
const print = (x: unknown) => console.log(JSON.stringify(x, null, 2));
const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

async function replay() {
  const { kw } = odooClient();
  const invoices = await kw<{ id: number; name: string; partner_id: [number, string]; narration: string | false; fiscal_position_id: [number, string] | false; invoice_line_ids: number[]; currency_id: [number, string] }[]>("account.move", "search_read", [[["move_type", "=", "out_invoice"], ["state", "=", "posted"]]], { fields: ["name", "partner_id", "narration", "fiscal_position_id", "invoice_line_ids", "currency_id"], order: "name" });
  const port = odooClient().port;
  const diffs: unknown[] = [];
  const cases: Record<string, number> = {};
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
    const label = `position ${d.positionId}, taxe ${d.taxId}, ${d.mention ? d.mention.slice(0, 24) : "sans mention"}`;
    cases[label] = (cases[label] ?? 0) + 1;
    if (d.taxId === actualTax && (d.mention ?? null) === actualMention) same += 1;
    else diffs.push({ facture: inv.name, client: inv.partner_id[1], pays: f.countryCode, societe: f.isCompany, regle: { taxe: d.taxId, mention: d.mention?.slice(0, 30) ?? null }, reel: { taxe: actualTax, mention: actualMention?.slice(0, 30) ?? null } });
  }
  print({ total: invoices.length, identiques: same, repartition: cases, differences: diffs });
}

// Rejoue le rattachement sur tous les virements passés et compare au client réel
// de la facture. "faux" doit rester à zéro : un virement rattaché au mauvais élève.
async function replayLines() {
  const { kw } = odooClient();
  const deps = realDeps();
  const students = await deps.store.loadStudents();
  const rows = await kw<{ id: number; date: string; amount: number; payment_ref: string | false; partner_name: string | false; partner_id: [number, string] | false; is_reconciled: boolean }[]>("account.bank.statement.line", "search_read", [[["amount", ">", 0]]], { fields: ["date", "amount", "payment_ref", "partner_name", "partner_id", "is_reconciled"], order: "date", limit: 500 });
  const out = { total: rows.length, bons: 0, faux: [] as unknown[], classes: {} as Record<string, number>, non_rattaches: [] as unknown[], ambigus: [] as unknown[] };
  for (const r of rows) {
    const line: BankLine = { id: r.id, date: r.date, amount: r.amount, payment_ref: r.payment_ref || "", partner_name: r.partner_name || "" };
    const cls = classifyLine(line);
    out.classes[cls.kind] = (out.classes[cls.kind] ?? 0) + 1;
    if (cls.kind !== "client") continue;
    const candidates = matchStudents(line, students);
    const actual = r.partner_id ? r.partner_id[0] : null;
    const payer = line.partner_name || line.payment_ref;
    if (candidates.length === 0) out.non_rattaches.push({ id: r.id, payeur: payer, montant: r.amount, client_reel: r.partner_id ? r.partner_id[1] : null });
    else if (candidates.length > 1) out.ambigus.push({ id: r.id, payeur: payer, candidats: candidates.map((c) => c.name) });
    else if (r.is_reconciled && actual && candidates[0].partnerId !== actual) out.faux.push({ id: r.id, payeur: payer, propose: candidates[0].name, client_reel: r.partner_id ? r.partner_id[1] : null });
    else out.bons += 1;
  }
  print(out);
}

// Vérifie la création de factures dans Odoo avec des brouillons : un brouillon ne
// consomme aucun numéro. Il est contrôlé puis supprimé (sauf avec --garder).
async function smoke(ids: number[], keep: boolean) {
  const { port } = odooClient();
  const today = new Date().toISOString().slice(0, 10);
  const out: unknown[] = [];
  for (const partnerId of ids) {
    const f = await port.partnerFacts(partnerId);
    const d = decideTax({ isCompany: f.isCompany, countryCode: f.countryCode, vat: f.vat, hasResidenceProof: f.positionId === 6 && f.hasProofAttachment });
    if (!d.ok) {
      out.push({ fiche: partnerId, regle: d.reason });
      continue;
    }
    const ht = htFromTtc(1000, d.rate);
    const plan = { key: "smoke", bankLineIds: [], label: "essai", partnerId, studentId: null, schedulePosition: null, date: today, amount: 1000, expectedTax: Math.round((1000 - ht) * 100) / 100, rate: d.rate, positionId: d.positionId, mention: d.mention, narration: d.mentionFromPosition ? null : d.mention, line: { productId: PRODUCT.ACOMPTE, name: null, priceUnit: ht, taxId: d.taxId }, sendEmail: false, clientEmail: null, reserve: { vat: 0, closer: 0 }, kind: "new" } satisfies Plan;
    const id = await port.createInvoice(plan);
    const inv = await port.getInvoice(id);
    const conforme = inv.state === "draft" && !inv.name && inv.amountTotal === 1000 && inv.amountTax === plan.expectedTax && inv.positionId === d.positionId;
    out.push({ fiche: partnerId, brouillon: keep ? id : "supprimé", etat: inv.state, numero: inv.name, total: inv.amountTotal, tva: inv.amountTax, position: inv.positionId, conforme });
    if (!keep) await port.deleteDraft(id);
  }
  print(out);
}

async function main() {
  switch (cmd) {
    case "scan":
      return print((await scan(realDeps())).map(({ line, decision }) => ({ virement: line.id, date: line.date, montant: line.amount, payeur: line.partner_name || line.payment_ref, decision })));
    case "run": {
      const rangement = { factures_rangees: 0, justificatifs_ranges: 0, erreurs: [] as string[] };
      // Justificatifs d'abord : un élève validé peut être facturé dès ce passage.
      await syncProofs(notifyPort, rangement).catch((e) => rangement.erreurs.push(String(e)));
      const report = await run(realDeps());
      await fileInvoices(notifyPort, rangement).catch((e) => rangement.erreurs.push(String(e)));
      return print({ ...report, rangement });
    }
    case "replay":
      return replay();
    case "replay-virements":
      return replayLines();
    case "smoke":
      return smoke(args.filter((a) => /^\d+$/.test(a)).map(Number), args.includes("--garder"));
    case "supprimer-brouillon":
      return odooClient().port.deleteDraft(Number(args[0])).then(() => print({ ok: true }));
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
