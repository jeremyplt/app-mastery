import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";
import { inviteToSkool } from "@/lib/skool";
import { getSale, inviteSkoolNow } from "@/lib/ventes";
import { sendQuestionnaire } from "@/lib/questionnaire";

// Invitation Skool depuis la fiche élève. Si l'élève a une vente, on passe
// par elle (comme sur la page Ventes) ; sinon on invite son email et on note
// la date sur l'élève. Le questionnaire part avec, s'il n'est pas encore parti.
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();
    if (typeof id !== "string") return NextResponse.json({ error: "id manquant" }, { status: 400 });
    const supabase = getAdminClient();
    const { data: s } = await supabase.from("students").select("id, email, sale_id, questionnaire_sent_at").eq("id", id).maybeSingle();
    if (!s) return NextResponse.json({ error: "Élève introuvable" }, { status: 404 });
    if (!s.email) return NextResponse.json({ error: "Ajoute d'abord l'email de l'élève sur sa fiche" }, { status: 400 });

    const now = new Date().toISOString();
    if (s.sale_id) {
      const r = await inviteSkoolNow(await getSale(s.sale_id));
      if (!r.invited) return NextResponse.json({ error: r.error ?? "Invitation impossible" }, { status: 500 });
    } else {
      const r = await inviteToSkool(s.email);
      if (!r.ok) return NextResponse.json({ error: r.error ?? "Invitation impossible" }, { status: 500 });
    }
    await supabase.from("students").update({ skool_invited_at: now }).eq("id", s.id);

    let questionnaire_sent_at: string | null = s.questionnaire_sent_at;
    if (!questionnaire_sent_at) {
      const q = await sendQuestionnaire(s.id);
      if (q.ok) questionnaire_sent_at = now;
      else console.error(`Questionnaire non envoyé à ${s.email} : ${q.error}`);
    }
    return NextResponse.json({ ok: true, skool_invited_at: now, questionnaire_sent_at });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
