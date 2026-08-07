import { getAdminClient } from "@/lib/supabase";

// Répartition des appels entre plusieurs calendriers Calendly. Le split en %
// est configuré dans la table calendar_routing et éditable depuis l'admin.
// Calendly n'offre pas ce split nativement : on assigne le calendrier côté
// serveur, de façon atomique et pondérée (RPC assign_calendar).

export type CalendarRoute = {
  slug: string;
  label: string;
  calendly_base: string;
  weight: number;
  assigned_count: number;
  active: boolean;
  sort_order: number;
};

// Base utilisée si l'assignation échoue (DB down, etc.) pour ne jamais
// casser la prise de RDV.
export const FALLBACK_CALENDLY_BASE =
  "https://calendly.com/jeremypltpro/30min";

// Choisit un calendrier selon les poids et incrémente son compteur (atomique).
// Retourne la base Calendly à afficher. Best-effort : fallback si erreur.
export async function assignCalendar(): Promise<{
  slug: string;
  label: string;
  calendlyBase: string;
}> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase.rpc("assign_calendar");
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.out_calendly_base) throw new Error("Aucun calendrier configuré");
    return {
      slug: row.out_slug,
      label: row.out_label,
      calendlyBase: row.out_calendly_base,
    };
  } catch (err) {
    console.error("assignCalendar error:", err);
    return {
      slug: "fallback",
      label: "Jeremy",
      calendlyBase: FALLBACK_CALENDLY_BASE,
    };
  }
}

export async function listCalendarRoutes(): Promise<CalendarRoute[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("calendar_routing")
    .select("slug, label, calendly_base, weight, assigned_count, active, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []) as CalendarRoute[];
}
