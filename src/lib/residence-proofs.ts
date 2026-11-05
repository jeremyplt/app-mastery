import { getAdminClient } from "@/lib/supabase";
import { sendBuiltEmail } from "@/lib/emails/send";
import { P, button, esc, signature, wrap } from "@/lib/emails/layout";
import type { BuiltEmail } from "@/lib/emails/transactional";

export { countryZone, matchesType, proofDecision } from "@/lib/residence-rules";

// Justificatifs de domicile des élèves hors UE. Sans TVA, il faut pouvoir prouver
// où le client réside en cas de contrôle (voir le dossier facturation). L'élève
// dépose son document sur /justificatif/[token], Jeremy le valide dans le CRM,
// puis le job de facturation le range dans Odoo et sur le Drive.

export const PROOF_BUCKET = "residence-proofs";
export const MAX_PROOF_BYTES = 10 * 1024 * 1024;
export const MAX_PROOFS_PER_STUDENT = 8;
export const PROOF_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/webp": "webp",
};

const SITE = "https://www.jeremypitault.com";

export function proofUrl(token: string): string {
  return `${SITE}/justificatif/${token}`;
}

function requestEmail(firstName: string, link: string): BuiltEmail {
  const body = `
<p ${P}>Salut ${esc(firstName)},</p>
<p ${P}>Comme tu habites hors de l'Union européenne, je ne te facture pas la TVA luxembourgeoise. En échange, je dois pouvoir prouver où tu résides en cas de contrôle.</p>
<p ${P}>J'ai donc besoin d'un justificatif de domicile récent, à ton nom et à l'adresse de ton contrat : une facture d'électricité, d'eau ou d'internet, un relevé bancaire ou ton bail. Un PDF ou une photo nette, ça me va très bien.</p>
${button("Déposer mon justificatif", link)}
<p ${P}>Si tu as la moindre question, réponds simplement à cet email.</p>
${signature("Merci à toi")}`;
  return { subject: "Ton justificatif de domicile", html: wrap(body), tag: "justificatif-demande" };
}

function rejectEmail(firstName: string, reason: string, link: string): BuiltEmail {
  const body = `
<p ${P}>Salut ${esc(firstName)},</p>
<p ${P}>Je n'ai pas pu garder le justificatif de domicile que tu m'as envoyé, pour cette raison : ${esc(reason)}</p>
<p ${P}>Tu peux en déposer un autre au même endroit :</p>
${button("Déposer un autre justificatif", link)}
${signature("Merci à toi")}`;
  return { subject: "Ton justificatif de domicile", html: wrap(body), tag: "justificatif-refus" };
}

type StudentRow = { id: string; name: string; email: string | null; proof_token: string; sale: { email: string } | { email: string }[] | null };

async function loadStudent(studentId: string): Promise<(StudentRow & { to: string | null }) | null> {
  const { data } = await getAdminClient().from("students").select("id, name, email, proof_token, sale:sales(email)").eq("id", studentId).maybeSingle();
  const s = data as unknown as StudentRow | null;
  if (!s) return null;
  const sale = Array.isArray(s.sale) ? s.sale[0] : s.sale;
  return { ...s, to: s.email ?? sale?.email ?? null };
}

export async function sendProofRequest(studentId: string): Promise<{ ok: boolean; error?: string }> {
  const s = await loadStudent(studentId);
  if (!s) return { ok: false, error: "Élève introuvable" };
  if (!s.to) return { ok: false, error: "Ajoute d'abord l'email de l'élève sur sa fiche" };
  const r = await sendBuiltEmail({ email: s.to, name: s.name }, requestEmail(s.name.split(" ")[0], proofUrl(s.proof_token)));
  if (!r.ok) return { ok: false, error: r.error ?? "Envoi impossible" };
  await getAdminClient().from("students").update({ proof_requested_at: new Date().toISOString() }).eq("id", s.id);
  return { ok: true };
}

// Demande automatique après la signature du contrat. Le statut est réservé avant
// l'envoi : la signature peut arriver en même temps par le webhook et le cron, et
// l'élève ne doit recevoir qu'un seul mail. Ne bloque jamais la signature.
export async function requestProofAfterSignature(saleId: string): Promise<{ action: "sent" | "already" | "failed"; error?: string }> {
  const db = getAdminClient();
  const { data: claimed } = await db.from("students").update({ proof_requested_at: new Date().toISOString() }).eq("sale_id", saleId).is("proof_requested_at", null).select("id");
  const id = claimed?.[0]?.id as string | undefined;
  if (!id) return { action: "already" };
  const r = await sendProofRequest(id);
  if (r.ok) return { action: "sent" };
  await db.from("students").update({ proof_requested_at: null }).eq("id", id);
  return { action: "failed", error: r.error };
}

export async function sendProofRejection(studentId: string, reason: string): Promise<{ ok: boolean; error?: string }> {
  const s = await loadStudent(studentId);
  if (!s?.to) return { ok: false, error: "Adresse de l'élève introuvable" };
  const r = await sendBuiltEmail({ email: s.to, name: s.name }, rejectEmail(s.name.split(" ")[0], reason, proofUrl(s.proof_token)));
  return r.ok ? { ok: true } : { ok: false, error: r.error ?? "Envoi impossible" };
}
