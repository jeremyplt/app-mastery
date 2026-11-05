import { ADMIN_EMAIL } from "@/lib/admin";
import { esc, P, wrap } from "@/lib/emails/layout";
import { sendBuiltEmail } from "@/lib/emails/send";
import { formatMoney, type BankDetails } from "@/lib/emails/ventes";
import { getAdminClient, withRetry } from "@/lib/supabase";

// Factures à envoyer depuis le CRM (/admin/factures). Le PDF vient d'Odoo, qui
// reste la comptabilité officielle. Ici : le brouillon du mail et le suivi de
// l'envoi. Rien ne part sans un clic de Jeremy.

export const INVOICE_BUCKET = "invoices";
// Reçoit une copie de chaque facture envoyée : les envois par Brevo
// n'apparaissent pas dans les messages envoyés de la boîte OVH.
const COPY_TO = "contact@jeremypitault.com";

export type InvoiceStatus = "draft" | "sending" | "sent" | "no_send";
export type InvoiceKind = "paid" | "due";
export type SendMode = "send" | "resend" | "test";

export type Invoice = {
  id: string;
  created_at: string;
  number: string;
  odoo_id: number | null;
  client_name: string;
  client_email: string | null;
  student_id: string | null;
  invoice_date: string;
  amount: number;
  currency: string;
  kind: InvoiceKind;
  pdf_path: string;
  email_subject: string;
  email_body: string;
  status: InvoiceStatus;
  sent_at: string | null;
  sent_to: string | null;
  brevo_message_id: string | null;
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function longDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );
}

// "VEN/2026/00026" -> "VEN-2026-00026", pour les noms de fichiers.
export function invoiceSlug(number: string): string {
  return number.trim().replace(/[^A-Za-z0-9]+/g, "-");
}

// Le mail proposé par défaut : tutoiement pour un élève, vouvoiement sinon.
// L'IBAN n'apparaît que si la facture reste à régler.
export function defaultDraft(
  input: { clientName: string; number: string; amount: number; currency: string; kind: InvoiceKind; invoiceDate: string; isStudent: boolean },
  bank: BankDetails,
): { subject: string; body: string } {
  const money = formatMoney(input.amount, input.currency);
  const iban = bank.iban.replace(/(.{4})/g, "$1 ").trim();
  const coords = [`IBAN : ${iban}`, bank.bic ? `BIC : ${bank.bic}` : "", `Communication : ${input.number}`].filter(Boolean).join("\n");

  if (!input.isStudent) {
    const paragraphs = ["Bonjour,"];
    if (input.kind === "due") {
      paragraphs.push(
        `Vous trouverez en pièce jointe la facture ${input.number}, d'un montant de ${money}, à régler pour le ${longDate(input.invoiceDate)} par virement avec ces coordonnées :`,
        coords,
      );
    } else {
      paragraphs.push(`Vous trouverez en pièce jointe la facture ${input.number}, d'un montant de ${money}. Le paiement a bien été reçu, merci.`);
    }
    paragraphs.push("Bien à vous,\nJeremy Pitault");
    return { subject: `Facture ${input.number}`, body: paragraphs.join("\n\n") };
  }

  const first = input.clientName.trim().split(/\s+/)[0];
  const paragraphs = [`Salut ${first},`];
  if (input.kind === "due") {
    paragraphs.push(
      `Je t'envoie en pièce jointe la facture ${input.number}, d'un montant de ${money}. L'échéance est le ${longDate(input.invoiceDate)}, et tu peux la régler par virement avec ces coordonnées :`,
      coords,
    );
  } else {
    paragraphs.push(`Je t'envoie en pièce jointe la facture ${input.number}, d'un montant de ${money}. Elle correspond au virement que j'ai bien reçu, merci à toi. Tu n'as rien d'autre à faire.`);
  }
  paragraphs.push("À très vite,\nJeremy");
  return { subject: `Ta facture ${input.number}`, body: paragraphs.join("\n\n") };
}

// Le texte du mail devient du HTML simple : une ligne vide sépare les paragraphes.
export function bodyToHtml(body: string): string {
  const paragraphs = body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p ${P}>${esc(p.trim()).replace(/\n/g, "<br/>")}</p>`);
  return wrap(paragraphs.join("\n"));
}

export async function getInvoice(id: string): Promise<Invoice> {
  const row = await withRetry(() => getAdminClient().from("invoices").select("*").eq("id", id).maybeSingle());
  if (!row) throw new Error("Facture introuvable");
  return { ...row, amount: Number(row.amount) } as Invoice;
}

async function pdfBase64(path: string): Promise<string> {
  const { data, error } = await getAdminClient().storage.from(INVOICE_BUCKET).download(path);
  if (error || !data) throw new Error(`PDF introuvable : ${error?.message ?? path}`);
  return Buffer.from(await data.arrayBuffer()).toString("base64");
}

async function deliver(invoice: Invoice, to: string, subject: string, tag: string, copy: boolean) {
  const content = await pdfBase64(invoice.pdf_path);
  const result = await sendBuiltEmail(
    { email: to, name: invoice.client_name },
    { subject, html: bodyToHtml(invoice.email_body), tag },
    {
      attachments: [{ name: `Facture-${invoiceSlug(invoice.number)}.pdf`, content }],
      ...(copy ? { bcc: [{ email: COPY_TO }] } : {}),
    },
  );
  if (!result.ok) throw new Error(`Brevo a refusé l'envoi : ${result.error ?? "erreur inconnue"}`);
  return result;
}

// Envoie la facture. Le passage en "sending" se fait d'abord, sous condition du
// statut attendu : un double clic ne peut pas envoyer le mail deux fois.
export async function sendInvoice(id: string, mode: SendMode): Promise<Invoice> {
  const invoice = await getInvoice(id);
  if (!invoice.email_subject.trim() || !invoice.email_body.trim()) throw new Error("L'objet et le message ne peuvent pas être vides");

  // Le test part vers Jeremy, sans copie et sans changer le statut de la facture.
  if (mode === "test") {
    await deliver(invoice, ADMIN_EMAIL, `[Test] ${invoice.email_subject}`, "facture-test", false);
    return invoice;
  }

  const to = invoice.client_email?.trim() ?? "";
  if (!EMAIL_RE.test(to)) throw new Error("L'adresse du destinataire n'est pas valide");

  const expected: InvoiceStatus = mode === "resend" ? "sent" : "draft";
  const db = getAdminClient();
  const { data: claimed, error: claimError } = await db
    .from("invoices")
    .update({ status: "sending" })
    .eq("id", id)
    .eq("status", expected)
    .select("id");
  if (claimError) throw new Error(claimError.message);
  if (!claimed?.length) throw new Error("Le statut de cette facture a changé : recharge la page avant de réessayer");

  try {
    const result = await deliver(invoice, to, invoice.email_subject, "facture", true);
    const { error } = await db
      .from("invoices")
      .update({ status: "sent", sent_at: new Date().toISOString(), sent_to: to, brevo_message_id: result.messageId ?? null })
      .eq("id", id);
    // Le mail est parti : on le signale sans laisser croire qu'il a échoué.
    if (error) console.error(`Facture ${invoice.number} envoyée mais non enregistrée :`, error.message);
    return { ...invoice, status: "sent", sent_at: new Date().toISOString(), sent_to: to, brevo_message_id: result.messageId ?? null };
  } catch (err) {
    await db.from("invoices").update({ status: expected }).eq("id", id);
    throw err;
  }
}
