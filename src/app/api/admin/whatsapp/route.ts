import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient, withRetry } from "@/lib/supabase";
import { canSendFreeForm, cleanOutgoing, sendText } from "@/lib/whatsapp/send";

// WhatsApp pro dans le CRM : résumés, brouillons et vocaux transcrits par le job
// WhatsApp de Harness Maxxing. Propriétaire seulement : conversations privées.
// Un message ne part que quand Jeremy clique sur « Envoyer » (action envoyer).

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
    const day = new Date(Date.now() - 86_400_000).toISOString();
    const [threads, students, live] = await Promise.all([
      withRetry(() =>
        db.from("whatsapp_threads").select("*, student:students(id, name, app)").or(`last_inbound_at.gte.${since},last_outbound_at.gte.${since}`).order("last_inbound_at", { ascending: false, nullsFirst: false }).limit(150),
      ),
      withRetry(() => db.from("students").select("id, name, phone").eq("archived", false).order("name")),
      // Messages vraiment reçus ces dernières 24 h (pas l'historique importé) :
      // seuls eux ouvrent la fenêtre d'envoi de WhatsApp.
      withRetry(() => db.from("whatsapp_messages").select("contact, sent_at").eq("direction", "inbound").neq("origin", "history_sync").gte("sent_at", day)),
    ]);
    const lastLive = new Map<string, string>();
    for (const m of (live ?? []) as { contact: string; sent_at: string }[]) {
      const cur = lastLive.get(m.contact);
      if (!cur || Date.parse(m.sent_at) > Date.parse(cur)) lastLive.set(m.contact, m.sent_at);
    }
    const withWindow = ((threads ?? []) as { contact: string }[]).map((t) => ({ ...t, last_live_inbound_at: lastLive.get(t.contact) ?? null }));
    return NextResponse.json({ threads: withWindow, students: students ?? [] });
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
//   envoyer   envoie { text } par Kapso, dans les 24 h qui suivent le dernier
//             message reçu (règle de WhatsApp), et l'ajoute à la conversation
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
      case "envoyer": {
        const text = cleanOutgoing(b.text);
        if (!text) return NextResponse.json({ error: "Message vide ou trop long (4 096 caractères au plus)" }, { status: 400 });
        if (!/^\d{8,15}$/.test(contact)) return NextResponse.json({ error: "Numéro masqué par WhatsApp : réponds depuis l'app" }, { status: 400 });
        const apiKey = process.env.KAPSO_API_KEY;
        const phoneNumberId = process.env.KAPSO_PHONE_NUMBER_ID;
        if (!apiKey || !phoneNumberId) return NextResponse.json({ error: "L'envoi n'est pas encore configuré sur le site" }, { status: 503 });
        // La fenêtre de 24 h ne s'ouvre qu'avec un vrai message reçu, pas avec l'historique importé.
        const { data: last } = await db
          .from("whatsapp_messages")
          .select("sent_at")
          .eq("contact", contact)
          .eq("direction", "inbound")
          .neq("origin", "history_sync")
          .order("sent_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        const now = new Date();
        if (!canSendFreeForm(last?.sent_at ?? null, now)) {
          return NextResponse.json({ error: "Plus de 24 h depuis son dernier message : WhatsApp n'autorise l'envoi que depuis l'app. Utilise « Ouvrir dans WhatsApp Web »." }, { status: 409 });
        }
        const id = await sendText({ apiKey, phoneNumberId, to: contact, text });
        const sentAt = now.toISOString();
        const message = { id, contact, direction: "outbound", origin: "cloud_api", type: "text", body: text, sent_at: sentAt };
        const { error: insertError } = await db.from("whatsapp_messages").upsert(message, { onConflict: "id", ignoreDuplicates: true });
        if (insertError) throw new Error(`Message envoyé, mais pas enregistré : ${insertError.message}`);
        await update({ last_outbound_at: sentAt });
        return NextResponse.json({ ok: true, message: { id, direction: "outbound", type: "text", body: text, transcript: null, transcript_error: null, sent_at: sentAt } });
      }
      default:
        return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
