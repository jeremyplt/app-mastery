import { getAdminClient, withRetry } from "@/lib/supabase";
import { parisDay, parisHour, parisTime } from "@/lib/call-reminders";
import { sendBuiltEmail } from "@/lib/emails/send";
import { SEQUENCE_C_LAST_STEP, buildSequenceCEmail, type SequenceCStep } from "@/lib/emails/sequence-c";

// Séquence C : calendrier et envoi des emails après le Plan d'Action
// (optin organique). Même moteur que la séquence A.
//
// Un lead entre dans la séquence à la création de sa fiche plan-action
// (seq_c_started_at posé par /api/subscribe), sauf s'il est déjà dans la
// séquence A. Il en sort dès qu'un rendez-vous est pris (call_booked) ou
// qu'il est disqualifié.
//
// La route /api/cron/sequence-a fait tourner A et C toutes les 15 minutes
// (Supabase pg_cron), et le cron Vercel quotidien repasse en filet. Un
// email par jour à 9 h (heure de Paris), du jour 1 au jour 8, jamais deux
// le même jour, jamais la nuit.

export type SequenceCLead = {
  id: string;
  email: string;
  first_name: string | null;
  call_booked: boolean;
  disqualified: boolean;
  seq_c_started_at: string | null;
  seq_c_step: number | null;
  seq_c_last_sent_at: string | null;
};

export const SEQUENCE_C_COLUMNS =
  "id, email, first_name, call_booked, disqualified, seq_c_started_at, seq_c_step, seq_c_last_sent_at";

// Heure d'envoi prévue : J+step à 9 h.
export function sequenceCDueAt(startedAt: Date, step: SequenceCStep): Date {
  return parisTime(startedAt, step, 9);
}

// Prochain email à envoyer maintenant, ou null.
export function nextStepDue(lead: SequenceCLead, now = new Date()): SequenceCStep | null {
  if (!lead.seq_c_started_at || lead.call_booked || lead.disqualified) return null;
  const done = lead.seq_c_step ?? 0;
  if (done >= SEQUENCE_C_LAST_STEP) return null;
  const step = (done + 1) as SequenceCStep;
  const due = sequenceCDueAt(new Date(lead.seq_c_started_at), step);
  if (due.getTime() > now.getTime()) return null;
  const hour = parisHour(now);
  if (hour < 9 || hour >= 21) return null;
  if (lead.seq_c_last_sent_at && parisDay(new Date(lead.seq_c_last_sent_at)) === parisDay(now)) return null;
  return step;
}

export async function sendSequenceCStep(lead: SequenceCLead, step: SequenceCStep): Promise<{ ok: boolean; tag: string; error?: string }> {
  const built = buildSequenceCEmail(step, { firstName: lead.first_name || "", email: lead.email });
  const r = await sendBuiltEmail({ email: lead.email, name: lead.first_name || undefined }, built);
  if (!r.ok) return { ok: false, tag: built.tag, error: r.error };
  await getAdminClient()
    .from("crm_leads")
    .update({ seq_c_step: step, seq_c_last_sent_at: new Date().toISOString() })
    .eq("id", lead.id);
  return { ok: true, tag: built.tag };
}

// Démarre la séquence pour un lead plan-action, une seule fois, et jamais
// si le même email est déjà dans la séquence A (une séquence à la fois).
export async function startSequenceC(email: string): Promise<"started" | "already" | "in-sequence-a"> {
  const supabase = getAdminClient();
  const { data: inA } = await supabase
    .from("crm_leads")
    .select("id")
    .eq("email", email)
    .eq("source", "vsl")
    .not("seq_a_started_at", "is", null)
    .lt("seq_a_step", 8)
    .eq("call_booked", false)
    .limit(1);
  if (inA && inA.length > 0) return "in-sequence-a";

  const { data } = await supabase
    .from("crm_leads")
    .update({ seq_c_started_at: new Date().toISOString() })
    .eq("email", email)
    .eq("source", "plan-action")
    .is("seq_c_started_at", null)
    .select("id");
  return data && data.length > 0 ? "started" : "already";
}

// Un passage du cron : envoie l'email dû de chaque lead actif.
export async function runSequenceC(now = new Date()): Promise<{ active: number; sent: Record<string, string>; errors: Record<string, string> }> {
  const supabase = getAdminClient();
  const data = await withRetry(() =>
    supabase
      .from("crm_leads")
      .select(SEQUENCE_C_COLUMNS)
      .eq("source", "plan-action")
      .not("seq_c_started_at", "is", null)
      .lt("seq_c_step", SEQUENCE_C_LAST_STEP)
      .eq("call_booked", false)
      .eq("disqualified", false),
  );
  const leads = (data || []) as SequenceCLead[];
  const sent: Record<string, string> = {};
  const errors: Record<string, string> = {};
  for (const lead of leads) {
    const step = nextStepDue(lead, now);
    if (!step) continue;
    try {
      const r = await sendSequenceCStep(lead, step);
      if (r.ok) sent[lead.email] = r.tag;
      else errors[lead.email] = r.error || "envoi refusé";
    } catch (err) {
      errors[lead.email] = err instanceof Error ? err.message : String(err);
    }
  }
  return { active: leads.length, sent, errors };
}
