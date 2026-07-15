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

// Mapping CRM -> attributs Brevo.
// WHATSAPP_CONTACTED est tri-état : true = contacté, false = injoignable,
// vide ("") = pas encore essayé.
async function syncBrevoAttributes(
  body: Record<string, unknown>,
  lead: { email: string; contacted: boolean; replied: boolean; call_booked: boolean; disqualified: boolean; unreachable: boolean },
) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) return;

  const attributes: Record<string, boolean | string> = {};

  if (typeof body.contacted === "boolean" || typeof body.unreachable === "boolean") {
    attributes.WHATSAPP_CONTACTED = lead.contacted ? true : lead.unreachable ? false : "";
  }
  if (typeof body.replied === "boolean") {
    attributes.WHATSAPP_REPLIED = lead.replied;
  }
  if (typeof body.call_booked === "boolean") {
    attributes.CALL_BOOKED = lead.call_booked;
  }
  if (typeof body.disqualified === "boolean") {
    attributes.DISQUALIFIED = lead.disqualified;
  }

  if (Object.keys(attributes).length === 0) return;

  const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(lead.email)}`, {
    method: "PUT",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ attributes }),
  });
  if (!res.ok) {
    console.error(`Brevo CRM sync error for ${lead.email}: ${res.status} ${await res.text()}`);
  } else {
    console.log(`Brevo CRM sync: ${lead.email} ${JSON.stringify(attributes)}`);
  }
}

// Suppression d'un lead (ex : lead de test). Retire aussi le contact de la
// liste Brevo du funnel, sinon "Synchroniser depuis Brevo" le ré-importerait
// au prochain sync. Le contact reste dans la base Brevo, juste hors liste.
const LIST_FOR_SOURCE: Record<string, number> = { vsl: 22, "plan-action": 17 };

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const { id } = await req.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id manquant" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data: lead, error: fetchError } = await supabase
      .from("crm_leads")
      .select("email, source")
      .eq("id", id)
      .single();

    if (fetchError || !lead) {
      return NextResponse.json({ error: "Lead introuvable" }, { status: 404 });
    }

    const { error: deleteError } = await supabase.from("crm_leads").delete().eq("id", id);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const listId = LIST_FOR_SOURCE[lead.source];
    if (BREVO_API_KEY && listId) {
      const res = await fetch(
        `https://api.brevo.com/v3/contacts/lists/${listId}/contacts/remove`,
        {
          method: "POST",
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ emails: [lead.email] }),
        },
      );
      if (!res.ok) {
        console.error(`Brevo list remove error for ${lead.email}: ${res.status} ${await res.text()}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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

    // Répercuter les cases cochées sur le profil Brevo. Best-effort :
    // une erreur Brevo ne bloque pas la mise à jour du CRM.
    await syncBrevoAttributes(body, data).catch((err) =>
      console.error("Brevo CRM sync error:", err),
    );

    return NextResponse.json({ lead: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
