import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const db = getAdminClient();
    const { table, items } = await req.json();

    if (!table || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: "table et items requis" }, { status: 400 });
    }

    if (table !== "modules" && table !== "lessons") {
      return NextResponse.json({ error: "Table invalide" }, { status: 400 });
    }

    // Update each item's position
    await Promise.all(
      items.map((item: { id: string; position: number }) =>
        db.from(table).update({ position: item.position }).eq("id", item.id)
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }
}
