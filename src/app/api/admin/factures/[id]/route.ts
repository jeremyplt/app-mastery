import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";
import { EMAIL_RE, INVOICE_BUCKET, getInvoice } from "@/lib/invoices";

type Ctx = { params: Promise<{ id: string }> };

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (message === "Facture introuvable") return NextResponse.json({ error: message }, { status: 404 });
  return NextResponse.json({ error: message }, { status: 500 });
}

// Modifie le brouillon du mail ou classe la facture.
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    await requireOwner();
    const { id } = await params;
    const invoice = await getInvoice(id);
    const body = await req.json();
    const patch: Record<string, string | null> = {};

    if (typeof body.client_email === "string") {
      const email = body.client_email.trim().toLowerCase();
      if (email && !EMAIL_RE.test(email)) return NextResponse.json({ error: "L'adresse email n'est pas valide" }, { status: 400 });
      patch.client_email = email || null;
    }
    if (typeof body.email_subject === "string") patch.email_subject = body.email_subject.trim();
    if (typeof body.email_body === "string") patch.email_body = body.email_body;
    if (typeof body.status === "string") {
      // "sent" ne se pose qu'à l'envoi. "sending" bloqué : on peut le remettre en brouillon.
      const allowed =
        (body.status === "no_send" && invoice.status === "draft") ||
        (body.status === "draft" && (invoice.status === "no_send" || invoice.status === "sending"));
      if (!allowed) return NextResponse.json({ error: "Ce changement de statut n'est pas possible" }, { status: 400 });
      patch.status = body.status;
    }
    if (!Object.keys(patch).length) return NextResponse.json({ error: "Rien à modifier" }, { status: 400 });

    const { data, error } = await getAdminClient().from("invoices").update(patch).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ invoice: { ...data, amount: Number(data.amount) } });
  } catch (err) {
    return fail(err);
  }
}

// Retire une facture du CRM (mauvais PDF par exemple). Odoo n'est pas touché.
// Une facture déjà envoyée reste, pour garder la trace de l'envoi.
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    await requireOwner();
    const { id } = await params;
    const invoice = await getInvoice(id);
    if (invoice.status === "sent" || invoice.status === "sending") {
      return NextResponse.json({ error: "Une facture envoyée ne peut pas être retirée" }, { status: 400 });
    }
    const db = getAdminClient();
    const { error } = await db.from("invoices").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await db.storage.from(INVOICE_BUCKET).remove([invoice.pdf_path]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
