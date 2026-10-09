import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAdminClient, withRetry } from "@/lib/supabase";
import { MILESTONES, type StudentPayment } from "@/lib/students";

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TEXT_FIELDS = ["name", "email", "phone", "app", "payment_label", "notes"] as const;

function cleanPayments(raw: unknown): StudentPayment[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p) => p && ISO_DATE.test(p.date))
    .map((p) => ({
      date: p.date,
      amount: Number(p.amount) > 0 ? Number(p.amount) : null,
      paid: Boolean(p.paid),
      paid_at: p.paid && typeof p.paid_at === "string" ? p.paid_at : p.paid ? new Date().toISOString() : null,
    }));
}

const SELECT = "*, sales(id, contract_status, skool_invited_at, sale_payments(id, position, amount, due_date, paid))";

// Élèves + paiements de la vente liée (source de vérité quand il y en a une).
// ?id=... : un seul élève (fiche).
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const { data, error } = await getAdminClient().from("students").select(SELECT).eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return NextResponse.json({ error: "Élève introuvable" }, { status: 404 });
      return NextResponse.json({ student: data });
    }
    const rows = await withRetry(() =>
      getAdminClient().from("students").select(SELECT).order("start_date", { ascending: true, nullsFirst: false }),
    );
    return NextResponse.json({ students: rows ?? [] });
  } catch (err) {
    return fail(err);
  }
}

// Ajouter un élève à la main (sans passer par la page Ventes).
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const b = await req.json();
    const name = String(b.name ?? "").trim();
    if (!name) return NextResponse.json({ error: "Nom manquant" }, { status: 400 });
    const row: Record<string, unknown> = { name, payments: cleanPayments(b.payments) };
    for (const f of TEXT_FIELDS) if (f !== "name" && typeof b[f] === "string") row[f] = b[f].trim() || null;
    if (ISO_DATE.test(b.start_date ?? "")) row.start_date = b.start_date;
    const { data, error } = await getAdminClient().from("students").insert(row).select("*").single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ student: { ...data, sales: null } });
  } catch (err) {
    return fail(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const b = await req.json();
    if (typeof b.id !== "string") return NextResponse.json({ error: "id manquant" }, { status: 400 });
    const update: Record<string, unknown> = {};
    for (const f of TEXT_FIELDS) if (typeof b[f] === "string") update[f] = b[f].trim() || (f === "name" ? undefined : null);
    if (b.start_date === null || ISO_DATE.test(b.start_date ?? "")) update.start_date = b.start_date;
    for (const [m] of MILESTONES) if (typeof b[m] === "boolean") update[m] = b[m];
    if (typeof b.archived === "boolean") update.archived = b.archived;
    if (b.payments !== undefined) update.payments = cleanPayments(b.payments);
    // Liens de la fiche (audit, réponses au questionnaire...) : [{ label, url }]
    if (Array.isArray(b.links)) {
      update.links = b.links
        .filter((l: { label?: unknown; url?: unknown }) => typeof l?.url === "string" && /^https?:\/\//.test(l.url))
        .map((l: { label?: unknown; url: string }) => ({ label: String(l.label ?? "").trim() || "Lien", url: l.url.trim() }));
    }
    // Dernier échange : "now" (bouton ou clic sur WhatsApp) ou null pour effacer.
    if (b.last_contact_at === "now") update.last_contact_at = new Date().toISOString();
    else if (b.last_contact_at === null) update.last_contact_at = null;
    for (const k of Object.keys(update)) if (update[k] === undefined) delete update[k];
    if (Object.keys(update).length === 0) return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
    const { error } = await getAdminClient().from("students").update(update).eq("id", b.id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });
    const { error } = await getAdminClient().from("students").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
