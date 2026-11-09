import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient, withRetry } from "@/lib/supabase";

// WhatsApp pro dans le CRM : résumés, brouillons et vocaux transcrits par le job
// WhatsApp de Harness Maxxing. Propriétaire seulement : conversations privées.
// Rien n'est envoyé d'ici, Jeremy répond lui-même dans WhatsApp Web.

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

// Sans paramètre : les fils actifs des 30 derniers jours et la liste des élèves
// (pour relier un numéro). ?contact=... : les messages d'un fil.
export async function GET(req: NextRequest) {
  try {
    await requireOwner();
    const db = getAdminClient();
    const contact = req.nextUrl.searchParams.get("contact");
    if (contact) {
      const rows = await withRetry(() =>
        db.from("whatsapp_messages").select("id, direction, type, body, transcript, transcript_error, sent_at").eq("contact", contact).order("sent_at", { ascending: false }).limit(60),
      );
      return NextResponse.json({ messages: (rows ?? []).reverse() });
    }
    const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
    const [threads, students] = await Promise.all([
      withRetry(() =>
        db.from("whatsapp_threads").select("*, student:students(id, name, app)").or(`last_inbound_at.gte.${since},last_outbound_at.gte.${since}`).order("last_inbound_at", { ascending: false, nullsFirst: false }).limit(150),
      ),
      withRetry(() => db.from("students").select("id, name, phone").eq("archived", false).order("name")),
    ]);
    return NextResponse.json({ threads: threads ?? [], students: students ?? [] });
  } catch (err) {
    return fail(err);
  }
}

// { contact, action } :
//   traite    plus rien à faire sur ce fil (jusqu'au prochain message reçu)
//   reprendre annule « traité »
//   resumer   refait le résumé au prochain passage du job (après une erreur)
//   relier    rattache le fil à student_id (null pour détacher) ; note le
//             numéro sur la fiche de l'élève s'il n'en a pas
export async function POST(req: NextRequest) {
  try {
    await requireOwner();
    const b = await req.json();
    const contact = typeof b.contact === "string" ? b.contact : "";
    if (!contact) return NextResponse.json({ error: "Contact manquant" }, { status: 400 });
    const db = getAdminClient();
    const update = async (fields: Record<string, unknown>) => {
      const { data, error } = await db.from("whatsapp_threads").update({ ...fields, updated_at: new Date().toISOString() }).eq("contact", contact).select("contact");
      if (error) throw new Error(error.message);
      if (!data?.length) throw new Error("Conversation introuvable");
    };
    switch (b.action) {
      case "traite":
        await update({ handled_at: new Date().toISOString() });
        break;
      case "reprendre":
        await update({ handled_at: null });
        break;
      case "resumer":
        await update({ summarized_through: null, error: null });
        break;
      case "relier": {
        const studentId = typeof b.student_id === "string" && b.student_id ? b.student_id : null;
        await update({ student_id: studentId });
        if (studentId && /^\d{8,15}$/.test(contact)) {
          await db.from("students").update({ phone: `+${contact}` }).eq("id", studentId).is("phone", null);
        }
        break;
      }
      default:
        return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
