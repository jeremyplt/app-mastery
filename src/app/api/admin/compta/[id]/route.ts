import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";

// Décisions de Jeremy sur une dépense :
//  - valider : la pièce proposée par le job est la bonne ;
//  - refuser : ce n'est pas la bonne, le job ne la reproposera plus ;
//  - sans_piece : aucune pièce à fournir (dépense perso, par exemple) ;
//  - remettre : annule « sans pièce », la dépense redevient à justifier.
// Le dépôt dans Odoo est fait ensuite par le job du serveur.

const ID_RE = /^[0-9a-f-]{36}$/i;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireOwner();
    const { id } = await params;
    if (!ID_RE.test(id)) return NextResponse.json({ error: "Dépense inconnue" }, { status: 400 });
    const b = await req.json().catch(() => ({}));
    const action = String(b.action ?? "");
    const raison = typeof b.raison === "string" ? b.raison.trim().slice(0, 300) : "";

    const db = getAdminClient();
    const { data: d, error } = await db.from("compta_depenses").select("id, statut, document_id, documents_refuses").eq("id", id).eq("societe", "sdg").maybeSingle();
    if (error) throw new Error(error.message);
    if (!d) return NextResponse.json({ error: "Dépense introuvable" }, { status: 404 });
    const now = new Date().toISOString();
    const refuses = (d.documents_refuses ?? []) as string[];

    let patch: Record<string, unknown>;
    let attendu: string[];
    if (action === "valider") {
      if (d.statut !== "a_valider" || !d.document_id) return NextResponse.json({ error: "Cette dépense n'a plus de pièce à valider, recharge la page" }, { status: 409 });
      patch = { statut: "justifie", note: "Pièce validée par Jeremy." };
      attendu = ["a_valider"];
    } else if (action === "refuser") {
      if (d.statut !== "a_valider" || !d.document_id) return NextResponse.json({ error: "Cette dépense n'a plus de pièce à valider, recharge la page" }, { status: 409 });
      patch = { statut: "manquant", document_id: null, rapprochement: null, note: null, documents_refuses: [...new Set([...refuses, d.document_id])] };
      attendu = ["a_valider"];
    } else if (action === "sans_piece") {
      if (d.statut !== "manquant" && d.statut !== "a_valider") return NextResponse.json({ error: "Cette dépense est déjà traitée, recharge la page" }, { status: 409 });
      patch = { statut: "sans_justificatif", document_id: null, rapprochement: null, note: raison || "Pas de pièce, choix de Jeremy.", documents_refuses: d.document_id ? [...new Set([...refuses, d.document_id])] : refuses };
      attendu = ["manquant", "a_valider"];
    } else if (action === "remettre") {
      if (d.statut !== "sans_justificatif") return NextResponse.json({ error: "Cette dépense n'est pas classée sans pièce" }, { status: 409 });
      patch = { statut: "manquant", note: null };
      attendu = ["sans_justificatif"];
    } else {
      return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
    }

    // Le statut attendu protège d'un passage du job entre la lecture et l'écriture.
    const { data: updated, error: upError } = await db.from("compta_depenses").update({ ...patch, updated_at: now }).eq("id", id).in("statut", attendu).select("id").maybeSingle();
    if (upError) throw new Error(upError.message);
    if (!updated) return NextResponse.json({ error: "La dépense vient de changer, recharge la page" }, { status: 409 });
    if (action === "valider" && d.document_id) await db.from("compta_documents").update({ statut: "rapproche", updated_at: now }).eq("id", d.document_id).eq("statut", "lu");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
