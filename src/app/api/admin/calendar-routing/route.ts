import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";
import { listCalendarRoutes } from "@/lib/calendar-routing";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }
  try {
    const routes = await listCalendarRoutes();
    return NextResponse.json({ routes });
  } catch (err) {
    console.error("List calendar routing error:", err);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}

// Met à jour les poids (%). Sauvegarder remet les compteurs à zéro : chaque
// changement de répartition repart d'une base propre ("à partir de maintenant,
// c'est 70/30"). Les poids doivent totaliser 100.
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const weights = body?.weights as Record<string, number> | undefined;
    if (!weights || typeof weights !== "object") {
      return NextResponse.json({ error: "Poids manquants" }, { status: 400 });
    }

    const entries = Object.entries(weights);
    for (const [, w] of entries) {
      if (!Number.isInteger(w) || w < 0 || w > 100) {
        return NextResponse.json(
          { error: "Chaque pourcentage doit être un entier entre 0 et 100" },
          { status: 400 }
        );
      }
    }
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    if (total !== 100) {
      return NextResponse.json(
        { error: `Le total doit faire 100% (actuellement ${total}%)` },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    // Applique chaque poids et remet le compteur à 0 sur la même ligne.
    for (const [slug, weight] of entries) {
      const { error } = await supabase
        .from("calendar_routing")
        .update({ weight, assigned_count: 0, updated_at: new Date().toISOString() })
        .eq("slug", slug);
      if (error) throw error;
    }

    const routes = await listCalendarRoutes();
    return NextResponse.json({ routes });
  } catch (err) {
    console.error("Update calendar routing error:", err);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
