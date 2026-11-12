import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient, withRetry } from "@/lib/supabase";
import { upcomingStudentCalls } from "@/lib/appels/calls";
import { halfPatch, JOURNAL_COLUMNS, type Half, type JournalEntry } from "@/lib/appels/journal";

// Ressentis d'appels (/admin/ressentis et carte « Ressenti » des appels).
// Propriétaire seulement : c'est le journal personnel de Jeremy.

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isDate = (v: unknown): v is string => typeof v === "string" && !Number.isNaN(Date.parse(v));

// Tous les ressentis (les plus récents d'abord), les élèves pour le
// formulaire, et les appels élèves des 14 derniers jours qui n'ont pas encore
// de ressenti (Calendly et créneaux des fiches).
export async function GET() {
  try {
    await requireOwner();
    const db = getAdminClient();
    const [entries, students] = await Promise.all([
      withRetry(() => db.from("call_journal").select(JOURNAL_COLUMNS).order("call_at", { ascending: false }).limit(500)),
      withRetry(() => db.from("students").select("id, name, archived").order("name")),
    ]);
    const list = (entries ?? []) as JournalEntry[];
    const now = Date.now();
    const { calls, calendly } = await upcomingStudentCalls(db, { pat: process.env.CALENDLY_PAT, from: new Date(now - 14 * 86_400_000), to: new Date(now) });
    const done = new Set(list.map((e) => e.event_key).filter(Boolean));
    const recents = calls
      .filter((c) => !done.has(c.key))
      .reverse()
      .map((c) => ({ key: c.key, student_id: c.student_id, student_name: c.student_name, starts_at: c.starts_at, title: c.title }));
    return NextResponse.json({ entries: list, students: students ?? [], recents, calendly });
  } catch (err) {
    return fail(err);
  }
}

// { action: "enregistrer", id?, event_key?, student_id?, call_at?, label?, avant?: {...}, apres?: {...} }
//   Crée ou met à jour le ressenti d'un appel (retrouvé par id, sinon par
//   event_key). Chaque moitié envoyée remplace ses champs ; celle qui manque
//   n'est pas touchée.
// { action: "supprimer", id }
export async function POST(req: NextRequest) {
  try {
    await requireOwner();
    const b = await req.json();
    const db = getAdminClient();
    if (b.action === "enregistrer") {
      const id = typeof b.id === "string" && UUID.test(b.id) ? b.id : null;
      const eventKey = typeof b.event_key === "string" && b.event_key ? b.event_key.slice(0, 300) : null;
      let existing: JournalEntry | null = null;
      if (id || eventKey) {
        const q = db.from("call_journal").select(JOURNAL_COLUMNS);
        const { data, error } = await (id ? q.eq("id", id) : q.eq("event_key", eventKey as string)).maybeSingle();
        if (error) throw new Error(error.message);
        existing = (data as JournalEntry | null) ?? null;
        if (id && !existing) return NextResponse.json({ error: "Ressenti introuvable" }, { status: 404 });
      }
      const now = new Date();
      const patch: Record<string, unknown> = { updated_at: now.toISOString() };
      for (const half of ["avant", "apres"] as Half[]) {
        if (b[half] && typeof b[half] === "object") Object.assign(patch, halfPatch(half, b[half] as Record<string, unknown>, existing, now));
      }
      if (b.student_id === null || (typeof b.student_id === "string" && UUID.test(b.student_id))) patch.student_id = b.student_id;
      if (isDate(b.call_at)) patch.call_at = new Date(b.call_at).toISOString();
      if (typeof b.label === "string") patch.label = b.label.trim().slice(0, 200) || null;

      if (existing) {
        const { data, error } = await db.from("call_journal").update(patch).eq("id", existing.id).select(JOURNAL_COLUMNS).single();
        if (error) throw new Error(error.message);
        return NextResponse.json({ entry: data });
      }
      if (!patch.call_at) return NextResponse.json({ error: "Date de l'appel manquante" }, { status: 400 });
      const { data, error } = await db
        .from("call_journal")
        .insert({ ...patch, event_key: eventKey })
        .select(JOURNAL_COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      return NextResponse.json({ entry: data });
    }
    if (b.action === "supprimer") {
      if (typeof b.id !== "string" || !UUID.test(b.id)) return NextResponse.json({ error: "Ressenti manquant" }, { status: 400 });
      const { error } = await db.from("call_journal").delete().eq("id", b.id);
      if (error) throw new Error(error.message);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (err) {
    return fail(err);
  }
}
