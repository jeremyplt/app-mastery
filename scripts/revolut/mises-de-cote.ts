// Mises de côté TVA et Closers, pour le serveur Harness (lancé par
// scripts/revolut/mises-de-cote.sh, qui donne les secrets au seul processus).
//   virer            vire les lignes « a_faire » vers TVA et Closers, SEULEMENT
//                    en mode auto (sinon : aucun appel à Revolut)
//   apercu <clé>     ce que la mise de côté d'une facture du job donnerait
//                    (clé invoice_automation, ex. line-151), sans rien écrire
//   etat             interrupteur et lignes par statut, sans rien écrire
// Variables : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY ; pour virer,
// REVOLUT_TRANSFER_API_KEY et REVOLUT_TRANSFER_SIGNING_KEY (clé limitée aux
// virements entre nos comptes, filtrée sur l'IP du serveur) ; BREVO_API_KEY
// pour l'alerte par email (facultatif, le fil Harness reçoit tout).
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { sendBuiltEmail } from "@/lib/emails/send";
import { adminAlert } from "@/lib/emails/ventes";
import { esc } from "@/lib/emails/layout";
import { computeSetAsides, digestSection, type DigestRow } from "@/lib/mises-de-cote/calcul";
import { installmentContext, readMode } from "@/lib/mises-de-cote/enregistrement";
import { luxDate } from "@/lib/revolut/rapprochement";
import { runTransfers, transferApi, type TransferDeps, type TransferRow } from "@/lib/revolut/virements";
import type { AutomationRow } from "@/lib/facturation/pipeline";

const [cmd, ...args] = process.argv.slice(2);
const print = (x: unknown) => console.log(JSON.stringify(x, null, 2));
const ALERT_EMAIL = "jeremypltpro@gmail.com";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquante");
  return createClient(url, key);
}

function check<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(`Supabase : ${r.error.message}`);
  return r.data;
}

// Fil Harness, comme le job de factures (adapters.ts notifyPort), sans tirer
// tout le module des factures.
async function feed(title: string, body: string, level: "warning" | "error", dedupe: string) {
  try {
    await promisify(execFile)("maxxing", ["feed", "post", title, "--body", body, "--level", level, "--source", "mises-de-cote", "--dedupe", dedupe, "--quiet"]);
  } catch {
    console.error(`[notification] ${level} ${title} : ${body}`);
  }
}

function realDeps(): TransferDeps {
  const sb = db();
  const now = () => new Date().toISOString();
  return {
    setting: () => readMode(sb),
    async pending() {
      const rows = check(await sb.from("set_asides").select("id, kind, target_account, amount, currency, status, reference, student_name, schedule_position, schedule_count, transfer_started_at, revolut_transfer_id").eq("status", "a_faire").is("cancelled_at", null).order("created_at"));
      return ((rows ?? []) as TransferRow[]).map((r) => ({ ...r, amount: Number(r.amount) }));
    },
    async transferredToday(day) {
      const since = new Date(Date.now() - 36 * 3_600_000).toISOString();
      const rows = check(await sb.from("set_asides").select("amount, transfer_started_at").gte("transfer_started_at", since));
      return Math.round((rows ?? []).filter((r) => luxDate(r.transfer_started_at as string) === day).reduce((s, r) => s + Number(r.amount), 0) * 100) / 100;
    },
    async claim(id) {
      const rows = check(await sb.from("set_asides").update({ transfer_started_at: now(), updated_at: now() }).eq("id", id).eq("status", "a_faire").is("transfer_started_at", null).select("id"));
      return (rows ?? []).length === 1;
    },
    async noteTransfer(id, transferId, state) {
      check(await sb.from("set_asides").update({ revolut_transfer_id: transferId, revolut_transfer_state: state, updated_at: now() }).eq("id", id));
    },
    async done(id, transferId, at) {
      check(await sb.from("set_asides").update({ status: "vire", revolut_transfer_id: transferId, revolut_transfer_state: "completed", transferred_at: at, last_error: null, updated_at: now() }).eq("id", id).eq("status", "a_faire"));
    },
    async noteError(id, error) {
      check(await sb.from("set_asides").update({ last_error: error.slice(0, 500), updated_at: now() }).eq("id", id));
    },
    async halt(reason) {
      const row = check(await sb.from("site_settings").select("value").eq("key", "set_asides_mode").maybeSingle());
      const value = { ...((row?.value as Record<string, unknown>) ?? { mode: "auto" }), halted: { at: now(), reason: reason.slice(0, 500) } };
      check(await sb.from("site_settings").upsert({ key: "set_asides_mode", value, updated_at: now() }));
    },
    async alert(title, lines) {
      await feed(title, lines.join("\n"), title.startsWith("🛑") ? "error" : "warning", `mises-de-cote-${title}-${luxDate(now())}`);
      if (process.env.BREVO_API_KEY) {
        const r = await sendBuiltEmail({ email: ALERT_EMAIL, name: "Jeremy" }, adminAlert(title, lines.map(esc), "mises-de-cote-alerte", { label: "Ouvrir les factures", href: "https://www.jeremypitault.com/admin/factures" }));
        if (!r.ok) console.error(`Alerte email non envoyée : ${r.error}`);
      }
    },
    api: () => transferApi(process.env),
    today: () => luxDate(now()),
    now: () => new Date(),
  };
}

// Lecture seule : la mise de côté qu'une facture du job donnerait.
async function apercu(key: string) {
  const sb = db();
  const row = check(await sb.from("invoice_automation").select("invoice_key, state, plan, number, odoo_invoice_id").eq("invoice_key", key).maybeSingle()) as (AutomationRow & { state: string }) | null;
  if (!row) throw new Error(`Facture du job inconnue : ${key}`);
  const plan = row.plan;
  if (!plan.studentId || !plan.schedulePosition) return print({ cle: key, note: "pas d'élève ou d'échéance : rien à mettre de côté automatiquement" });
  const ctx = await installmentContext(sb, plan.studentId);
  if (!ctx) throw new Error("Élève introuvable");
  const setting = await readMode(sb);
  const { drafts, notes } = computeSetAsides({
    studentId: plan.studentId,
    studentName: ctx.name,
    position: plan.schedulePosition,
    count: ctx.count,
    invoice: { number: row.number, odooId: row.odoo_invoice_id, key, tax: Number(plan.expectedTax), currency: "EUR" },
    commission: ctx.commission,
    revolutTransactionId: null,
    source: "factures",
  });
  const status = setting.mode === "auto" ? "a_faire" : "simule";
  const digest = digestSection(drafts.map((d, i): DigestRow => ({ id: String(i), kind: d.kind, amount: d.amount, status, student_name: d.student_name, schedule_position: d.schedule_position, schedule_count: d.schedule_count, invoice_number: d.invoice_number })));
  print({
    cle: key,
    etat_facture: row.state,
    interrupteur: setting,
    lignes: drafts.map((d) => ({ type: d.kind, compte: d.target_account, montant: d.amount, reference: d.reference, statut: setting.mode === "off" ? "(rien, mode off)" : status, detail: d.detail })),
    notes,
    point_du_jour: digest ? [digest.headline, ...digest.lines.map((l) => `• ${l}`)] : null,
  });
}

async function etat() {
  const sb = db();
  const rows = check(await sb.from("set_asides").select("status, kind, amount, last_error"));
  const parts: Record<string, { lignes: number; montant: number }> = {};
  for (const r of rows ?? []) {
    const k = `${r.status} ${r.kind}`;
    parts[k] = { lignes: (parts[k]?.lignes ?? 0) + 1, montant: Math.round(((parts[k]?.montant ?? 0) + Number(r.amount)) * 100) / 100 };
  }
  print({ interrupteur: await readMode(sb), lignes: parts, erreurs: (rows ?? []).filter((r) => r.last_error).length });
}

async function main() {
  switch (cmd) {
    case "virer":
      return print(await runTransfers(realDeps()));
    case "apercu":
      if (!args[0]) throw new Error("Usage : apercu <clé de facture du job>");
      return apercu(args[0]);
    case "etat":
      return etat();
    default:
      throw new Error("Commande inconnue : virer, apercu <clé>, etat");
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
