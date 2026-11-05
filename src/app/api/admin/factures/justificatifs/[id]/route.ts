import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { sendProofRejection } from "@/lib/residence-proofs";
import { getAdminClient } from "@/lib/supabase";

// Valide ou refuse un justificatif. Validé, le job de facturation le range dans
// Odoo et sur le Drive, et l'élève peut être facturé sans TVA.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireOwner();
    const { id } = await params;
    const { status, reason } = await req.json();
    if (status !== "accepted" && status !== "rejected") return NextResponse.json({ error: "Décision inconnue" }, { status: 400 });
    const cleanReason = typeof reason === "string" ? reason.trim() : "";
    if (status === "rejected" && !cleanReason) return NextResponse.json({ error: "Indique pourquoi, l'élève recevra ce motif" }, { status: 400 });

    const db = getAdminClient();
    const { data, error } = await db
      .from("residence_proofs")
      .update({ status, reject_reason: status === "rejected" ? cleanReason : null, reviewed_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", "pending")
      .select("student_id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Ce justificatif a déjà été traité" }, { status: 409 });

    if (status === "rejected") {
      const mail = await sendProofRejection(data.student_id, cleanReason);
      if (!mail.ok) return NextResponse.json({ ok: true, warning: `Refus enregistré, mais l'email n'est pas parti : ${mail.error}` });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
