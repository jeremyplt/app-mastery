import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const source = req.nextUrl.searchParams.get("source");
    if (source !== "vsl" && source !== "plan-action") {
      return NextResponse.json({ error: "Source invalide" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("crm_leads")
      .select("*")
      .eq("source", source)
      .order("created_at", { ascending: false })
      .limit(2000);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leads: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const BOOLEAN_FIELDS = ["contacted", "replied", "call_booked", "disqualified", "unreachable"] as const;
type BooleanField = (typeof BOOLEAN_FIELDS)[number];

// Champ booléen -> colonne timestamp associée
const TIMESTAMP_FOR: Partial<Record<BooleanField, string>> = {
  contacted: "contacted_at",
  replied: "replied_at",
  call_booked: "call_booked_at",
};

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { id } = body;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id manquant" }, { status: 400 });
    }

    const update: Record<string, unknown> = {};

    for (const field of BOOLEAN_FIELDS) {
      if (typeof body[field] === "boolean") {
        update[field] = body[field];
        const tsColumn = TIMESTAMP_FOR[field];
        if (tsColumn) {
          update[tsColumn] = body[field] ? new Date().toISOString() : null;
        }
        // Un (dé)cochage manuel de "call booké" reprend la main sur le webhook
        if (field === "call_booked") {
          update.call_booked_auto = false;
        }
      }
    }

    if (typeof body.notes === "string") {
      update.notes = body.notes.trim() || null;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("crm_leads")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lead: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
