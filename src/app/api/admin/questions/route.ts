import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient, withRetry } from "@/lib/supabase";
import { MAX_NOTE, STATUTS, cleanLien, type QuestionStatut } from "@/lib/student-questions";

// Questions qui reviennent chez les élèves (student_questions), suivies dans
// /admin/questions. Tirées des conversations WhatsApp : propriétaire seulement.

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET() {
  try {
    await requireOwner();
    const rows = await withRetry(() => getAdminClient().from("student_questions").select("*").order("nb_eleves", { ascending: false }).order("nb_fois", { ascending: false }));
    return NextResponse.json({ questions: rows ?? [] });
  } catch (err) {
    return fail(err);
  }
}

// { id, statut?, note?, lien? } : « fait » quand un support est en place
// (avec ce qui a été fait et son lien), « archive », ou retour « a_faire ».
export async function PATCH(req: NextRequest) {
  try {
    await requireOwner();
    const b = await req.json();
    if (typeof b.id !== "string") return NextResponse.json({ error: "id manquant" }, { status: 400 });
    const now = new Date().toISOString();
    const fields: Record<string, unknown> = { updated_at: now };
    if (b.statut !== undefined) {
      if (!STATUTS.includes(b.statut as QuestionStatut)) return NextResponse.json({ error: "Statut inconnu" }, { status: 400 });
      fields.statut = b.statut;
      fields.fait_at = b.statut === "fait" ? now : null;
    }
    if (b.note !== undefined) {
      if (b.note !== null && typeof b.note !== "string") return NextResponse.json({ error: "Note invalide" }, { status: 400 });
      const note = (b.note ?? "").trim();
      if (note.length > MAX_NOTE) return NextResponse.json({ error: `Note trop longue (${MAX_NOTE} caractères au plus)` }, { status: 400 });
      fields.note = note || null;
    }
    const lien = cleanLien(b.lien);
    if (b.lien !== undefined && lien === undefined) return NextResponse.json({ error: "Le lien doit commencer par https://" }, { status: 400 });
    if (lien !== undefined) fields.lien = lien;
    const { data, error } = await getAdminClient().from("student_questions").update(fields).eq("id", b.id).select("*");
    if (error) throw new Error(error.message);
    if (!data?.length) return NextResponse.json({ error: "Question introuvable" }, { status: 404 });
    return NextResponse.json({ question: data[0] });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireOwner();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });
    const { error } = await getAdminClient().from("student_questions").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
