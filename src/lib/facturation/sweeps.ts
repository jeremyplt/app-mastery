import { createClient } from "@supabase/supabase-js";
import { INVOICE_BUCKET } from "@/lib/invoices";
import { PROOF_BUCKET } from "@/lib/residence-proofs";
import { proofVerdict } from "@/lib/residence-rules";
import { readProof } from "./proof-ai";
import { odooClient } from "./adapters";
import type { NotifyPort } from "./pipeline";
import { POSITION } from "./rules";

// Travaux après les factures, indépendants de l'envoi des mails : une panne du
// Drive ne bloque jamais une facture. Tout se relance sans doublon.

type Sweep = { factures_rangees: number; justificatifs_ranges: number; erreurs: string[] };

const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

async function drive(url: string, secret: string, body: Record<string, unknown>): Promise<string> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ secret, ...body }), redirect: "follow", signal: AbortSignal.timeout(120_000) });
  const text = await res.text();
  let d: { ok?: boolean; id?: string; error?: string };
  try {
    d = JSON.parse(text);
  } catch {
    throw new Error(`Drive : réponse illisible (${res.status})`);
  }
  if (!d.ok || !d.id) throw new Error(`Drive : ${d.error ?? "refusé"}`);
  return d.id;
}

export async function fileInvoices(notify: NotifyPort, out: Sweep): Promise<void> {
  const url = process.env.DRIVE_SCRIPT_URL;
  const secret = process.env.DRIVE_SCRIPT_SECRET;
  if (!url || !secret) return;
  const client = db();
  const { data: rows } = await client.from("invoices").select("id, number, client_name, invoice_date, pdf_path, student_id, students(name)").is("drive_file_id", null).limit(25);
  for (const r of rows ?? []) {
    try {
      const { data: blob, error } = await client.storage.from(INVOICE_BUCKET).download(r.pdf_path);
      if (error || !blob) throw new Error("PDF introuvable dans le CRM");
      const st = (Array.isArray(r.students) ? r.students[0] : r.students) as { name?: string } | null;
      const student = st?.name ? st.name.trim().split(/\s+/)[0] : null;
      const name = `${r.invoice_date} - ${r.number.replace(/\//g, "-")} - ${r.client_name.replace(/[/\\]/g, "-")}.pdf`;
      const id = await drive(url, secret, { kind: "facture", student, name, mime: "application/pdf", base64: Buffer.from(await blob.arrayBuffer()).toString("base64") });
      await client.from("invoices").update({ drive_file_id: id, drive_error: null }).eq("id", r.id);
      out.factures_rangees += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      out.erreurs.push(`${r.number} : ${message}`);
      await client.from("invoices").update({ drive_error: message.slice(0, 300) }).eq("id", r.id);
      await notify.post({ title: `Drive : ${r.number} non rangée`, body: `${message}\nNouvel essai au prochain passage.`, level: "warning", dedupe: `facture-drive-${r.number}` });
    }
  }
}

// Un justificatif validé par Jeremy : position fiscale sur la fiche, pièce jointe
// dans Odoo et copie sur le Drive. Seul ce clic de validation ouvre le 0 % de TVA.
export async function syncProofs(notify: NotifyPort, out: Sweep): Promise<void> {
  const client = db();
  const { data: rows } = await client.from("residence_proofs").select("id, file_path, file_name, mime_type, created_at, odoo_attachment_id, drive_file_id, student_id, students(name, odoo_partner_id)").eq("status", "accepted").is("synced_at", null).limit(10);
  if (!rows?.length) return;
  const { port, kw } = odooClient();
  for (const p of rows) {
    try {
      const st = (Array.isArray(p.students) ? p.students[0] : p.students) as { name: string; odoo_partner_id: number | null } | null;
      if (!st?.odoo_partner_id) throw new Error("Pas encore de fiche Odoo pour cet élève : à reprendre après sa première facture");
      const facts = await port.partnerFacts(st.odoo_partner_id);
      const EU_NOTE = "Le pays de la fiche Odoo est dans l'UE ou inconnu : position fiscale non modifiée";
      if (!facts.countryCode || ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"].includes(facts.countryCode)) throw new Error(EU_NOTE);
      const { data: blob, error } = await client.storage.from(PROOF_BUCKET).download(p.file_path);
      if (error || !blob) throw new Error("Document introuvable dans le CRM");
      const base64 = Buffer.from(await blob.arrayBuffer()).toString("base64");
      const ext = p.file_path.split(".").pop();
      const name = `${facts.name} - ${facts.countryCode} - Justificatif ${p.created_at.slice(0, 10)}.${ext}`.replace(/[/\\]/g, "-");

      let attachmentId = p.odoo_attachment_id;
      if (!attachmentId) {
        const same = await kw<number[]>("ir.attachment", "search", [[["res_model", "=", "res.partner"], ["res_id", "=", st.odoo_partner_id], ["name", "=", name]]], { limit: 1 });
        attachmentId = same[0] ?? (await kw<number>("ir.attachment", "create", [{ name, datas: base64, res_model: "res.partner", res_id: st.odoo_partner_id, mimetype: p.mime_type }]));
        await client.from("residence_proofs").update({ odoo_attachment_id: attachmentId }).eq("id", p.id);
      }
      if (facts.positionId !== POSITION.NON_EU_PRIVATE && !facts.isCompany) {
        await kw("res.partner", "write", [[st.odoo_partner_id], { property_account_position_id: POSITION.NON_EU_PRIVATE }]);
      }
      let driveId = p.drive_file_id;
      const url = process.env.DRIVE_SCRIPT_URL;
      const secret = process.env.DRIVE_SCRIPT_SECRET;
      if (!driveId && url && secret) {
        driveId = await drive(url, secret, { kind: "justificatif", name, mime: p.mime_type, base64 });
        await client.from("residence_proofs").update({ drive_file_id: driveId }).eq("id", p.id);
      }
      if (driveId) {
        await client.from("residence_proofs").update({ synced_at: new Date().toISOString(), sync_error: null }).eq("id", p.id);
        out.justificatifs_ranges += 1;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      out.erreurs.push(`Justificatif ${p.id} : ${message}`);
      await client.from("residence_proofs").update({ sync_error: message.slice(0, 300) }).eq("id", p.id);
      await notify.post({ title: "Justificatif validé, rangement à reprendre", body: message, level: "warning", dedupe: `justificatif-${p.id}-${message.slice(0, 30)}` });
    }
  }
}

const MAX_AI_ATTEMPTS = 3;

// Fait relire par l'IA les justificatifs reçus et pas encore traités par Jeremy.
// Le résultat ne sert qu'à l'affichage dans le CRM : rien n'est validé, rien
// n'est envoyé à l'élève.
export async function reviewProofs(today: string): Promise<{ lus: number; erreurs: string[] }> {
  const client = db();
  const out = { lus: 0, erreurs: [] as string[] };
  const { data: rows, error } = await client.from("residence_proofs").select("id, file_path, mime_type, ai_attempts, student_id, students(name, odoo_partner_id, sale:sales(first_name, last_name, billing))").eq("status", "pending").eq("ai_status", "pending").order("created_at").limit(5);
  if (error) throw new Error(error.message);
  if (!rows?.length) return out;
  const odoo = odooClient();
  type Sale = { first_name?: string; last_name?: string | null; billing?: Record<string, string> | null };
  type St = { name: string; odoo_partner_id: number | null; sale: Sale | Sale[] | null };
  for (const p of rows) {
    const attempts = (p.ai_attempts ?? 0) + 1;
    await client.from("residence_proofs").update({ ai_attempts: attempts }).eq("id", p.id);
    try {
      const st = (Array.isArray(p.students) ? p.students[0] : p.students) as unknown as St | null;
      const sale = Array.isArray(st?.sale) ? st?.sale[0] : st?.sale;
      const b = sale?.billing ?? {};
      let name = [sale?.first_name, sale?.last_name].filter(Boolean).join(" ") || (st?.name ?? "");
      let address = [b["Adresse postale"], b["Code postal"], b["Ville"], b["Pays"]].filter(Boolean).join(", ") || null;
      // Sans contrat dans le CRM, on reprend la fiche Odoo de l'élève.
      if (st?.odoo_partner_id && (!sale || !address)) {
        const [partner] = await odoo.kw<{ name: string; is_company: boolean; street: string | false; zip: string | false; city: string | false; country_id: [number, string] | false }[]>("res.partner", "read", [[st.odoo_partner_id], ["name", "is_company", "street", "zip", "city", "country_id"]]);
        if (partner && !partner.is_company) {
          if (!sale) name = partner.name;
          address = address ?? ([partner.street, partner.zip, partner.city, partner.country_id ? partner.country_id[1] : null].filter(Boolean).join(", ") || null);
        }
      }
      const { data: blob, error: dlError } = await client.storage.from(PROOF_BUCKET).download(p.file_path);
      if (dlError || !blob) throw new Error("Document introuvable");
      const extract = await readProof(Buffer.from(await blob.arrayBuffer()), p.mime_type, { name, address, today });
      const review = proofVerdict(extract, today, Boolean(address));
      await client.from("residence_proofs").update({ ai_status: "done", ai_verdict: review.verdict, ai_result: { ...review, expected: { name, address } }, ai_checked_at: new Date().toISOString(), ai_error: null }).eq("id", p.id);
      out.lus += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      out.erreurs.push(`${p.id} : ${message}`);
      await client.from("residence_proofs").update({ ai_error: message.slice(0, 300), ...(attempts >= MAX_AI_ATTEMPTS ? { ai_status: "error" } : {}) }).eq("id", p.id);
    }
  }
  return out;
}
