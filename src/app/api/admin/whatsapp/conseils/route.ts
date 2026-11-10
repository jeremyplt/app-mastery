import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient, withRetry } from "@/lib/supabase";
import { THEME_KEYS, type ThemeKey } from "@/lib/whatsapp/conseils";

// Base de conseils de Jeremy (whatsapp_conseils), relue et validée thème par
// thème dans /admin/whatsapp. Seuls les thèmes validés servent aux brouillons.
// Propriétaire seulement.

const MAX_CONTENU = 12_000;

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET() {
  try {
    await requireOwner();
    const rows = await withRetry(() => getAdminClient().from("whatsapp_conseils").select("*").order("ordre"));
    return NextResponse.json({ conseils: rows ?? [] });
  } catch (err) {
    return fail(err);
  }
}

// { theme, contenu?, statut? } : enregistre le texte corrigé et/ou change le
// statut (« valide » : sert aux brouillons ; « a_relire » : n'y sert plus).
export async function POST(req: NextRequest) {
  try {
    await requireOwner();
    const b = await req.json();
    if (!THEME_KEYS.includes(b.theme as ThemeKey)) return NextResponse.json({ error: "Thème inconnu" }, { status: 400 });
    const now = new Date().toISOString();
    const fields: Record<string, unknown> = { updated_at: now };
    if (b.contenu !== undefined) {
      if (typeof b.contenu !== "string") return NextResponse.json({ error: "Texte invalide" }, { status: 400 });
      const contenu = b.contenu.replace(/\r\n/g, "\n").trim();
      if (contenu.length > MAX_CONTENU) return NextResponse.json({ error: `Texte trop long (${contenu.length} caractères, ${MAX_CONTENU} au plus)` }, { status: 400 });
      fields.contenu = contenu;
    }
    if (b.statut !== undefined) {
      if (b.statut !== "valide" && b.statut !== "a_relire") return NextResponse.json({ error: "Statut inconnu" }, { status: 400 });
      if (b.statut === "valide" && fields.contenu === "") return NextResponse.json({ error: "Impossible de valider un thème vide" }, { status: 400 });
      fields.statut = b.statut;
      fields.validated_at = b.statut === "valide" ? now : null;
    }
    const { data, error } = await getAdminClient().from("whatsapp_conseils").update(fields).eq("theme", b.theme).select("*");
    if (error) throw new Error(error.message);
    if (!data?.length) return NextResponse.json({ error: "Thème introuvable" }, { status: 404 });
    return NextResponse.json({ conseil: data[0] });
  } catch (err) {
    return fail(err);
  }
}
