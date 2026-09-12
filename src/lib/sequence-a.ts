import { getAdminClient, withRetry } from "@/lib/supabase";
import { parisDay, parisHour, parisTime } from "@/lib/call-reminders";
import { sendBuiltEmail } from "@/lib/emails/send";
import { buildSequenceAEmail, variantFor, type SequenceAStep } from "@/lib/emails/sequence-a";

// Séquence A : calendrier et envoi des emails après l'optin conférence.
//
// Un lead entre dans la séquence quand il est qualifié à l'optin
// (seq_a_started_at posé par /api/vsl-qualify). Il en sort dès qu'un
// rendez-vous est pris (call_booked) ou qu'il est disqualifié.
//
// La route /api/cron/sequence-a est appelée toutes les 15 minutes par
// Supabase (pg_cron) et une fois par jour par le cron Vercel des rappels
// d'appel, en filet de sécurité. Elle est idempotente : à chaque passage,
// elle envoie au plus un email par lead, celui dont l'heure est venue.
//
// - Email 1 : 3 h après la qualification, dans la journée (8 h à 22 h,
//   heure de Paris). Un optin le soir reçoit l'email 1 le lendemain à 8 h.
// - Emails 2 à 8 : J1 à J7 à 9 h. Jamais deux emails le même jour (heure de
//   Paris), et jamais la nuit : si le cron a pris du retard, la séquence se
//   décale au lieu de rattraper d'un coup.

export const SEQUENCE_A_LAST_STEP = 8;
const FIRST_DELAY_MS = 3 * 60 * 60 * 1000;

export type SequenceALead = {
  id: string;
  email: string;
  first_name: string | null;
  qualified: boolean | null;
  call_booked: boolean;
  disqualified: boolean;
  vsl_watch_seconds: number | null;
  seq_a_started_at: string | null;
  seq_a_step: number | null;
  seq_a_last_sent_at: string | null;
};

export const SEQUENCE_A_COLUMNS =
  "id, email, first_name, qualified, call_booked, disqualified, vsl_watch_seconds, seq_a_started_at, seq_a_step, seq_a_last_sent_at";

// Heure d'envoi prévue d'un email pour un lead entré à `startedAt`.
export function sequenceADueAt(startedAt: Date, step: SequenceAStep): Date {
  if (step === 1) return new Date(startedAt.getTime() + FIRST_DELAY_MS);
  return parisTime(startedAt, step - 1, 9);
}

// Prochain email à envoyer maintenant, ou null.
export function nextStepDue(lead: SequenceALead, now = new Date()): SequenceAStep | null {
  if (!lead.seq_a_started_at || lead.call_booked || lead.disqualified) return null;
  const done = lead.seq_a_step ?? 0;
  if (done >= SEQUENCE_A_LAST_STEP) return null;
  const step = (done + 1) as SequenceAStep;
  const due = sequenceADueAt(new Date(lead.seq_a_started_at), step);
  if (due.getTime() > now.getTime()) return null;

  const hour = parisHour(now);
  if (step === 1) return hour >= 8 && hour < 22 ? step : null;

  if (hour < 9 || hour >= 21) return null;
  if (lead.seq_a_last_sent_at && parisDay(new Date(lead.seq_a_last_sent_at)) === parisDay(now)) return null;
  return step;
}

export async function sendSequenceAStep(lead: SequenceALead, step: SequenceAStep): Promise<{ ok: boolean; tag: string; error?: string }> {
  const watchSeconds = lead.vsl_watch_seconds ?? 0;
  const built = buildSequenceAEmail(step, { firstName: lead.first_name || "", email: lead.email, watchSeconds });
  const r = await sendBuiltEmail({ email: lead.email, name: lead.first_name || undefined }, built);
  if (!r.ok) return { ok: false, tag: built.tag, error: r.error };

  await getAdminClient()
    .from("crm_leads")
    .update({
      seq_a_step: step,
      seq_a_last_sent_at: new Date().toISOString(),
      ...(step === 1 ? { seq_a_variant: variantFor(watchSeconds) } : {}),
    })
    .eq("id", lead.id);
  return { ok: true, tag: built.tag };
}

// Un passage du cron : envoie l'email dû de chaque lead actif.
export async function runSequenceA(now = new Date()): Promise<{ active: number; sent: Record<string, string>; errors: Record<string, string> }> {
  const supabase = getAdminClient();
  const data = await withRetry(() =>
    supabase
      .from("crm_leads")
      .select(SEQUENCE_A_COLUMNS)
      .eq("source", "vsl")
      .not("seq_a_started_at", "is", null)
      .lt("seq_a_step", SEQUENCE_A_LAST_STEP)
      .eq("call_booked", false)
      .eq("disqualified", false),
  );

  const leads = (data || []) as SequenceALead[];
  const sent: Record<string, string> = {};
  const errors: Record<string, string> = {};
  for (const lead of leads) {
    const step = nextStepDue(lead, now);
    if (!step) continue;
    try {
      const r = await sendSequenceAStep(lead, step);
      if (r.ok) sent[lead.email] = r.tag;
      else errors[lead.email] = r.error || "envoi refusé";
    } catch (err) {
      errors[lead.email] = err instanceof Error ? err.message : String(err);
    }
  }
  return { active: leads.length, sent, errors };
}
