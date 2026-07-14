import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";

// Listes Brevo correspondant aux deux funnels du CRM
const SOURCES: { source: "vsl" | "plan-action"; listId: number }[] = [
  { source: "vsl", listId: 22 },
  { source: "plan-action", listId: 17 },
];

type BrevoContact = {
  email: string;
  createdAt?: string;
  attributes?: {
    FIRSTNAME?: string;
    SMS?: string;
    CALL_BOOKED?: boolean;
    WHATSAPP_CONTACTED?: boolean;
  };
};

async function fetchListContacts(apiKey: string, listId: number): Promise<BrevoContact[]> {
  const contacts: BrevoContact[] = [];
  const limit = 500;
  // Garde-fou : 20 pages max, soit 10 000 contacts par liste
  for (let page = 0; page < 20; page++) {
    const res = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${listId}/contacts?limit=${limit}&offset=${page * limit}`,
      { headers: { "api-key": apiKey, Accept: "application/json" } },
    );
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Brevo list ${listId}: ${res.status} ${body}`);
    }
    const data = await res.json();
    const batch: BrevoContact[] = data.contacts ?? [];
    contacts.push(...batch);
    if (batch.length < limit) break;
  }
  return contacts;
}

export async function POST() {
  try {
    await requireAdmin();

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return NextResponse.json({ error: "BREVO_API_KEY manquante" }, { status: 500 });
    }

    const supabase = getAdminClient();
    const results: Record<
      string,
      { synced: number; booked: number; contacted: number; unreachable: number }
    > = {};

    for (const { source, listId } of SOURCES) {
      const contacts = await fetchListContacts(BREVO_API_KEY, listId);

      if (contacts.length > 0) {
        const rows = contacts.map((c) => ({
          email: c.email.toLowerCase(),
          source,
          first_name: c.attributes?.FIRSTNAME || null,
          phone: c.attributes?.SMS || null,
          ...(c.createdAt && { created_at: c.createdAt }),
        }));

        // Upsert par lots de 500 : ne touche que l'identité du lead,
        // jamais les cases cochées manuellement
        for (let i = 0; i < rows.length; i += 500) {
          const { error } = await supabase
            .from("crm_leads")
            .upsert(rows.slice(i, i + 500), { onConflict: "email,source" });
          if (error) {
            return NextResponse.json(
              { error: `Upsert ${source} : ${error.message}` },
              { status: 500 },
            );
          }
        }
      }

      // Coche une case (une seule fois, ne décoche jamais) pour une liste d'emails
      async function setFlag(emails: string[], update: Record<string, boolean>, flag: string) {
        if (emails.length === 0) return null;
        const { error } = await supabase
          .from("crm_leads")
          .update(update)
          .eq("source", source)
          .eq(flag, false)
          .in("email", emails);
        return error;
      }

      // CALL_BOOKED = true dans Brevo -> case "Call booké" cochée auto
      const bookedEmails = contacts
        .filter((c) => c.attributes?.CALL_BOOKED === true)
        .map((c) => c.email.toLowerCase());

      // WHATSAPP_CONTACTED = true -> contacté ; false -> injoignable
      // (faux numéro ou pas dispo WhatsApp) ; absent -> pas encore essayé
      const contactedEmails = contacts
        .filter((c) => c.attributes?.WHATSAPP_CONTACTED === true)
        .map((c) => c.email.toLowerCase());
      const unreachableEmails = contacts
        .filter((c) => c.attributes?.WHATSAPP_CONTACTED === false)
        .map((c) => c.email.toLowerCase());

      const flagUpdates: [string[], Record<string, boolean>, string][] = [
        [bookedEmails, { call_booked: true, call_booked_auto: true }, "call_booked"],
        [contactedEmails, { contacted: true }, "contacted"],
        [unreachableEmails, { unreachable: true }, "unreachable"],
      ];
      for (const [emails, update, flag] of flagUpdates) {
        const error = await setFlag(emails, update, flag);
        if (error) {
          return NextResponse.json(
            { error: `Update ${flag} ${source} : ${error.message}` },
            { status: 500 },
          );
        }
      }

      results[source] = {
        synced: contacts.length,
        booked: bookedEmails.length,
        contacted: contactedEmails.length,
        unreachable: unreachableEmails.length,
      };
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
