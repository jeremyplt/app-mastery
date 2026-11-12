import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient, withRetry } from "@/lib/supabase";
import { upcomingStudentCalls } from "@/lib/appels/calls";

// Préparation d'appel (fiche élève et /admin/calendrier). Les fiches sont
// écrites par le job « App Mastery · appels » sur Harness Maxxing (toutes les
// 5 minutes) : le bouton du CRM ne fait que les demander. Propriétaire
// seulement : la fiche reprend les conversations WhatsApp des élèves.

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

const PREP_COLUMNS = "id, event_key, student_id, starts_at, title, event_type, statut, fiche, checked, error, auto, requested_at, generated_at";
const MILESTONE_COLUMNS = "id, kickoff, app_published, first_sale, bilan_done, ten_k";

// ?student_id=... : les appels à venir de l'élève (30 jours) et ses dernières
// fiches. Sans paramètre : les appels élèves des 14 prochains jours.
export async function GET(req: NextRequest) {
  try {
    await requireOwner();
    const db = getAdminClient();
    const studentId = req.nextUrl.searchParams.get("student_id");
    const now = Date.now();
    const { calls, calendly } = await upcomingStudentCalls(db, {
      pat: process.env.CALENDLY_PAT,
      from: new Date(now - 2 * 3_600_000),
      to: new Date(now + (studentId ? 30 : 14) * 86_400_000),
      studentId,
    });
    const keys = calls.map((c) => c.key);
    const preps = studentId
      ? await withRetry(() => db.from("call_preps").select(PREP_COLUMNS).eq("student_id", studentId).order("starts_at", { ascending: false }).limit(6))
      : keys.length
        ? await withRetry(() => db.from("call_preps").select(PREP_COLUMNS).in("event_key", keys))
        : [];
    const ids = [...new Set(calls.map((c) => c.student_id).concat(studentId ? [studentId] : []))];
    const milestones = ids.length ? await withRetry(() => db.from("students").select(MILESTONE_COLUMNS).in("id", ids)) : [];
    return NextResponse.json({ calls, preps: preps ?? [], milestones: milestones ?? [], calendly });
  } catch (err) {
    return fail(err);
  }
}

// { action: "preparer", student_id, event_key?, starts_at?, title?, event_type? } : demande
//   (ou redemande) la fiche. Sans event_key : fiche sans rendez-vous précis.
//   L'ancienne fiche reste affichée jusqu'à la nouvelle.
// { action: "cocher", id, index, done } : coche une action de clôture.
export async function POST(req: NextRequest) {
  try {
    await requireOwner();
    const b = await req.json();
    const db = getAdminClient();
    if (b.action === "preparer") {
      const studentId = typeof b.student_id === "string" ? b.student_id : "";
      if (!studentId) return NextResponse.json({ error: "Élève manquant" }, { status: 400 });
      const key = typeof b.event_key === "string" && b.event_key ? b.event_key : `manuel:${studentId}`;
      const startsAt = typeof b.starts_at === "string" && !Number.isNaN(Date.parse(b.starts_at)) ? new Date(b.starts_at).toISOString() : new Date().toISOString();
      const eventType = typeof b.event_type === "string" && b.event_type.startsWith("https://api.calendly.com/event_types/") ? b.event_type.slice(0, 200) : null;
      const now = new Date().toISOString();
      const { data, error } = await db
        .from("call_preps")
        .upsert(
          { event_key: key, student_id: studentId, starts_at: startsAt, title: typeof b.title === "string" ? b.title.slice(0, 200) : null, event_type: eventType, statut: "demande", error: null, auto: false, requested_at: now, updated_at: now },
          { onConflict: "event_key" },
        )
        .select(PREP_COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      return NextResponse.json({ prep: data });
    }
    if (b.action === "cocher") {
      if (typeof b.id !== "string" || !Number.isInteger(b.index)) return NextResponse.json({ error: "Fiche ou action manquante" }, { status: 400 });
      const { data: cur, error } = await db.from("call_preps").select("checked").eq("id", b.id).maybeSingle();
      if (error) throw new Error(error.message);
      if (!cur) return NextResponse.json({ error: "Fiche introuvable" }, { status: 404 });
      const set = new Set<number>(Array.isArray(cur.checked) ? (cur.checked as number[]) : []);
      if (b.done) set.add(b.index);
      else set.delete(b.index);
      const checked = [...set].sort((x, y) => x - y);
      const { error: updateError } = await db.from("call_preps").update({ checked, updated_at: new Date().toISOString() }).eq("id", b.id);
      if (updateError) throw new Error(updateError.message);
      return NextResponse.json({ checked });
    }
    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (err) {
    return fail(err);
  }
}
