import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { sendQuestionnaire } from "@/lib/questionnaire";

// Envoi (ou renvoi) du questionnaire de démarrage depuis la fiche élève.
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();
    if (typeof id !== "string") return NextResponse.json({ error: "id manquant" }, { status: 400 });
    const r = await sendQuestionnaire(id);
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
    return NextResponse.json({ ok: true, sent_at: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    return NextResponse.json({ error: message === "Accès non autorisé" ? "Non autorisé" : message }, { status: message === "Accès non autorisé" ? 401 : 500 });
  }
}
