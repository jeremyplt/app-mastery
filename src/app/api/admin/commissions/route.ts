import { NextRequest, NextResponse } from "next/server";
import { getAdminRole, requireOwner } from "@/lib/admin";
import { getSessionEmail } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase";
import { closerSummaries } from "@/lib/commissions";

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

// Propriétaire : tous les closers. Closer : seulement lui-même.
export async function GET() {
  try {
    const role = await getAdminRole();
    if (role === "owner") return NextResponse.json({ role, closers: await closerSummaries() });
    if (role === "closer") {
      const email = (await getSessionEmail())!.trim().toLowerCase();
      return NextResponse.json({ role, closers: await closerSummaries(email) });
    }
    throw new Error("Accès non autorisé");
  } catch (err) {
    return fail(err);
  }
}

// Enregistrer un versement à un closer (propriétaire seulement).
export async function POST(req: NextRequest) {
  try {
    await requireOwner();
    const b = await req.json();
    const amount = Number(b.amount);
    const email = String(b.closer_email ?? "").trim().toLowerCase();
    if (!email || !(amount > 0)) return NextResponse.json({ error: "Closer et montant obligatoires" }, { status: 400 });
    const { error } = await getAdminClient()
      .from("closer_payouts")
      .insert({
        closer_email: email,
        amount,
        paid_on: /^\d{4}-\d{2}-\d{2}$/.test(b.paid_on ?? "") ? b.paid_on : undefined,
        note: String(b.note ?? "").trim() || null,
      });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireOwner();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });
    const { error } = await getAdminClient().from("closer_payouts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
