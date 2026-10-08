import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getSale, inviteSkoolNow } from "@/lib/ventes";

// Invitation Skool forcée à la main (renvoi, ou cas particulier).
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();
    if (typeof id !== "string") return NextResponse.json({ error: "id manquant" }, { status: 400 });
    const r = await inviteSkoolNow(await getSale(id));
    if (!r.invited) return NextResponse.json({ error: r.error ?? "Invitation impossible" }, { status: 500 });
    return NextResponse.json({ sale: await getSale(id) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
