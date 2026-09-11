import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { CALL_LEAD_COLUMNS, scheduleReminders, type CallLead } from "@/lib/call-reminders";
import { runSequenceA } from "@/lib/sequence-a";

export const dynamic = "force-dynamic";

// Cron quotidien (Vercel) : programme dans Brevo les rappels "veille" et
// "jour J" des appels qui entrent dans la fenêtre des 72 h. Les appels
// réservés à moins de 72 h sont déjà programmés par le webhook Calendly.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = getAdminClient();
  const now = new Date();
  const horizon = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from("crm_leads")
    .select(CALL_LEAD_COLUMNS)
    .eq("call_booked", true)
    .gt("call_booked_at", now.toISOString())
    .lt("call_booked_at", horizon.toISOString());

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const results: Record<string, unknown> = {};
  for (const lead of (data || []) as CallLead[]) {
    try {
      results[lead.email] = await scheduleReminders(lead);
    } catch (err) {
      results[lead.email] = { error: err instanceof Error ? err.message : String(err) };
    }
  }

  // Séquence A : le passage principal est fait toutes les 15 minutes par
  // Supabase (pg_cron). Celui-ci sert de filet si ce cron tombe.
  let sequenceA: unknown;
  try {
    sequenceA = await runSequenceA();
  } catch (err) {
    sequenceA = { error: err instanceof Error ? err.message : String(err) };
  }

  return NextResponse.json({ ok: true, leads: (data || []).length, results, sequenceA });
}
