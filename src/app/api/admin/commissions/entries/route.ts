import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";

// Registre des commissions (propriétaire seulement) : ajout à la main,
// annulation avec trace, réactivation, suppression.
// kind = "sale" (commission d'une vente) ou "manual" (ajoutée à la main).

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function POST(req: NextRequest) {
  try {
    await requireOwner();
    const b = await req.json();
    const closer = String(b.closer_email ?? "").trim().toLowerCase();
    const label = String(b.label ?? "").trim();
    const amount = Number(b.amount);
    if (!closer || !label || !(amount > 0)) {
      return NextResponse.json({ error: "Closer, libellé et montant obligatoires" }, { status: 400 });
    }
    const { error } = await getAdminClient()
      .from("manual_commissions")
      .insert({
        closer_email: closer,
        label,
        amount: Math.round(amount * 100) / 100,
        student_id: typeof b.student_id === "string" && b.student_id ? b.student_id : null,
        note: String(b.note ?? "").trim() || null,
      });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}

// { kind, id, action: "cancel" | "restore", reason? }
export async function PATCH(req: NextRequest) {
  try {
    await requireOwner();
    const { kind, id, action, reason } = await req.json();
    if (typeof id !== "string" || (kind !== "sale" && kind !== "manual") || (action !== "cancel" && action !== "restore")) {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }
    const cancel = action === "cancel";
    const cancelReason = cancel ? String(reason ?? "").trim() || null : null;
    const supabase = getAdminClient();
    const { error } =
      kind === "sale"
        ? await supabase
            .from("sales")
            .update({ commission_cancelled_at: cancel ? new Date().toISOString() : null, commission_cancel_reason: cancelReason })
            .eq("id", id)
        : await supabase
            .from("manual_commissions")
            .update({ cancelled_at: cancel ? new Date().toISOString() : null, cancel_reason: cancelReason })
            .eq("id", id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}

// Suppression définitive. Pour une vente : on retire seulement le closer de la
// vente (la vente, le contrat et l'élève restent).
export async function DELETE(req: NextRequest) {
  try {
    await requireOwner();
    const kind = req.nextUrl.searchParams.get("kind");
    const id = req.nextUrl.searchParams.get("id");
    if (!id || (kind !== "sale" && kind !== "manual")) return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    const supabase = getAdminClient();
    const { error } =
      kind === "sale"
        ? await supabase
            .from("sales")
            .update({ closer_email: null, commission_amount: null, commission_cancelled_at: null, commission_cancel_reason: null })
            .eq("id", id)
        : await supabase.from("manual_commissions").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
