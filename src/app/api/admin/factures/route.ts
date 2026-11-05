import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient, withRetry } from "@/lib/supabase";
import { getBankDetails } from "@/lib/ventes";
import { EMAIL_RE, INVOICE_BUCKET, defaultDraft, invoiceSlug, needsRenameNote, type Invoice } from "@/lib/invoices";

// Factures du CRM : liste et ajout d'un PDF. Propriétaire seulement.

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PDF = 5 * 1024 * 1024;

export async function GET() {
  try {
    await requireOwner();
    const db = getAdminClient();
    const [rows, students, lines, stuck, setting] = await Promise.all([
      withRetry(() => db.from("invoices").select("*").order("invoice_date", { ascending: false }).order("number", { ascending: false }).limit(500)),
      withRetry(() => db.from("students").select("id, name, email, archived, sale:sales(email)").order("name")),
      withRetry(() => db.from("invoice_bank_lines").select("bank_line_id, bank_date, amount, label, reason").eq("decision", "handoff").order("bank_date", { ascending: false })),
      withRetry(() => db.from("invoice_automation").select("invoice_key, number, plan, handoff_reason, updated_at").eq("state", "handoff").order("updated_at", { ascending: false })),
      withRetry(() => db.from("site_settings").select("value").eq("key", "invoices_auto_send").maybeSingle()),
    ]);
    const invoices = (rows ?? []) as Invoice[];

    // Liens temporaires vers les PDF : le stockage reste privé.
    const urls = new Map<string, string>();
    if (invoices.length) {
      const { data } = await db.storage.from(INVOICE_BUCKET).createSignedUrls(invoices.map((i) => i.pdf_path), 60 * 60);
      for (const s of data ?? []) if (s.path && s.signedUrl) urls.set(s.path, s.signedUrl);
    }

    return NextResponse.json({
      autoSend: (setting?.value as { enabled?: boolean } | undefined)?.enabled === true,
      toCheck: [
        ...(lines ?? []).map((l) => ({ key: `v-${l.bank_line_id}`, date: l.bank_date, amount: Number(l.amount), label: l.label ?? "Virement", reason: l.reason ?? "" })),
        ...(stuck ?? []).map((r) => {
          const plan = r.plan as { date: string; amount: number; label: string };
          return { key: r.invoice_key, date: plan.date, amount: Number(plan.amount), label: plan.label, reason: r.handoff_reason ?? "" };
        }),
      ],
      invoices: invoices.map((i) => ({ ...i, amount: Number(i.amount), pdf_url: urls.get(i.pdf_path) ?? null })),
      students: (students ?? [])
        .filter((s) => !s.archived)
        .map((s) => {
          const sale = (Array.isArray(s.sale) ? s.sale[0] : s.sale) as { email?: string } | null;
          return { id: s.id, name: s.name, email: s.email ?? sale?.email ?? null };
        }),
    });
  } catch (err) {
    return fail(err);
  }
}

// Interrupteur de l'envoi automatique par le job de facturation.
export async function PUT(req: NextRequest) {
  try {
    await requireOwner();
    const { autoSend } = await req.json();
    if (typeof autoSend !== "boolean") return NextResponse.json({ error: "Valeur invalide" }, { status: 400 });
    const { error } = await getAdminClient().from("site_settings").upsert({ key: "invoices_auto_send", value: { enabled: autoSend }, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return NextResponse.json({ autoSend });
  } catch (err) {
    return fail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireOwner();
    const form = await req.formData();
    const file = form.get("file");
    const number = String(form.get("number") ?? "").trim();
    const clientName = String(form.get("client_name") ?? "").trim();
    const clientEmail = String(form.get("client_email") ?? "").trim().toLowerCase();
    const studentId = String(form.get("student_id") ?? "").trim() || null;
    const invoiceDate = String(form.get("invoice_date") ?? "").trim();
    const amount = Number(String(form.get("amount") ?? "").replace(/\s/g, "").replace(",", "."));
    const currency = String(form.get("currency") ?? "EUR").trim().toUpperCase();
    const kind = form.get("kind") === "due" ? "due" : "paid";

    if (!(file instanceof File) || !file.size) return NextResponse.json({ error: "Ajoute le PDF de la facture" }, { status: 400 });
    if (file.size > MAX_PDF) return NextResponse.json({ error: "Le PDF dépasse 5 Mo" }, { status: 400 });
    if (!number) return NextResponse.json({ error: "Le numéro de facture est obligatoire" }, { status: 400 });
    if (!clientName) return NextResponse.json({ error: "Le nom du client est obligatoire" }, { status: 400 });
    if (clientEmail && !EMAIL_RE.test(clientEmail)) return NextResponse.json({ error: "L'adresse email n'est pas valide" }, { status: 400 });
    if (!ISO_DATE.test(invoiceDate)) return NextResponse.json({ error: "La date de la facture n'est pas valide" }, { status: 400 });
    if (!(amount > 0)) return NextResponse.json({ error: "Le montant n'est pas valide" }, { status: 400 });
    if (!/^[A-Z]{3}$/.test(currency)) return NextResponse.json({ error: "La devise n'est pas valide" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.subarray(0, 5).toString() !== "%PDF-") return NextResponse.json({ error: "Ce fichier n'est pas un PDF" }, { status: 400 });

    const db = getAdminClient();
    const { data: existing } = await db.from("invoices").select("id").eq("number", number).maybeSingle();
    if (existing) return NextResponse.json({ error: `La facture ${number} existe déjà` }, { status: 409 });

    const path = `${invoiceSlug(number)}-${Date.now()}.pdf`;
    const { error: uploadError } = await db.storage.from(INVOICE_BUCKET).upload(path, buffer, { contentType: "application/pdf", upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const renameNote = studentId ? await needsRenameNote(studentId) : false;
    const draft = defaultDraft({ clientName, number, amount, currency, kind, invoiceDate, isStudent: Boolean(studentId), renameNote }, await getBankDetails());
    const { data, error } = await db
      .from("invoices")
      .insert({
        number,
        client_name: clientName,
        client_email: clientEmail || null,
        student_id: studentId,
        invoice_date: invoiceDate,
        amount,
        currency,
        kind,
        pdf_path: path,
        email_subject: draft.subject,
        email_body: draft.body,
      })
      .select("*")
      .single();
    if (error) {
      await db.storage.from(INVOICE_BUCKET).remove([path]);
      throw new Error(error.message);
    }
    return NextResponse.json({ invoice: { ...data, amount: Number(data.amount) } }, { status: 201 });
  } catch (err) {
    return fail(err);
  }
}
