import { randomUUID } from "crypto";
import { getAdminClient } from "@/lib/supabase";
import {
  buildSequenceBEmail,
  type CallHost,
  type SequenceBContext,
  type SequenceBKind,
} from "@/lib/emails/sequence-b";

// Séquence B : envoi et programmation des emails avant l'appel.
//
// Brevo permet de programmer un envoi jusqu'à 72 h à l'avance (scheduledAt)
// et de l'annuler par batchId. Deux points d'entrée :
// - le webhook Calendly, à la réservation (email de confirmation tout de
//   suite, rappels programmés si l'appel est dans moins de 72 h) ;
// - le cron quotidien, qui programme les rappels des appels qui viennent
//   d'entrer dans la fenêtre des 72 h.
// L'annulation Calendly supprime les envois programmés.

const PARIS = "Europe/Paris";
const BREVO_SMTP = "https://api.brevo.com/v3/smtp/email";
const MAX_AHEAD_MS = 72 * 60 * 60 * 1000;

// Calendrier de l'associé (Nolan) : calendly.com/masteryapp-jeremy/30min.
// Tout autre type d'événement est mené par Jeremy.
const NOLAN_EVENT_TYPE_URI =
  "https://api.calendly.com/event_types/8dada1ac-c858-4c5f-84c8-b16f68fd51ca";

export function hostForEventType(eventTypeUri: string | undefined): CallHost {
  return eventTypeUri === NOLAN_EVENT_TYPE_URI ? "Nolan" : "Jeremy";
}

// Décalage (ms) entre UTC et l'heure de Paris à un instant donné.
function parisOffsetMs(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PARIS,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - at.getTime();
}

// Construit un instant "heure de Paris" : jour civil (Paris) de `ref`
// décalé de `dayDelta`, à `hour`:00.
function parisTime(ref: Date, dayDelta: number, hour: number): Date {
  const offset = parisOffsetMs(ref);
  const local = new Date(ref.getTime() + offset);
  const target = Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate() + dayDelta,
    hour,
    0,
    0,
  );
  // Le décalage peut changer entre ref et target (changement d'heure) :
  // on le recalcule sur la cible.
  const guess = new Date(target - offset);
  return new Date(target - parisOffsetMs(guess));
}

function parisHour(at: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: PARIS, hourCycle: "h23", hour: "2-digit" }).format(at),
  );
}

// Heures d'envoi des deux rappels pour un appel donné.
export function reminderTimes(startTime: Date): { veille: Date; jourj: Date } {
  const veille = parisTime(startTime, -1, 18);
  // Appel avant 10 h : le rappel "jour J" part la veille à 20 h.
  const jourj = parisHour(startTime) < 10 ? parisTime(startTime, -1, 20) : parisTime(startTime, 0, 8);
  return { veille, jourj };
}

type SendResult = { ok: boolean; batchId?: string; error?: string };

async function sendBrevo(
  to: { email: string; name?: string },
  kind: SequenceBKind,
  ctx: SequenceBContext,
  scheduledAt?: Date,
): Promise<SendResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { ok: false, error: "BREVO_API_KEY manquante" };

  const { subject, html, tag } = buildSequenceBEmail(kind, ctx);
  const batchId = scheduledAt ? randomUUID() : undefined;

  const res = await fetch(BREVO_SMTP, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Jeremy Pitault", email: "contact@jeremypitault.com" },
      replyTo: { name: "Jeremy Pitault", email: "contact@jeremypitault.com" },
      to: [to],
      subject,
      htmlContent: html,
      tags: [tag],
      ...(scheduledAt ? { scheduledAt: scheduledAt.toISOString(), batchId } : {}),
    }),
  });
  const body = await res.text();
  console.log(`Brevo seq-b ${kind} to ${to.email}${scheduledAt ? ` at ${scheduledAt.toISOString()}` : ""}: ${res.status} ${body}`);
  return res.ok ? { ok: true, batchId } : { ok: false, error: body };
}

export async function cancelScheduled(batchId: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;
  const res = await fetch(`${BREVO_SMTP}/${encodeURIComponent(batchId)}`, {
    method: "DELETE",
    headers: { "api-key": apiKey, Accept: "application/json" },
  });
  console.log(`Brevo cancel scheduled ${batchId}: ${res.status}`);
}

export type CallLead = {
  id: string;
  email: string;
  first_name: string | null;
  call_booked: boolean;
  call_booked_at: string | null;
  call_host: string | null;
  call_reschedule_url: string | null;
  call_join_url: string | null;
  call_mail_confirm_at: string | null;
  call_mail_veille_at: string | null;
  call_mail_veille_batch: string | null;
  call_mail_jourj_at: string | null;
  call_mail_jourj_batch: string | null;
};

export const CALL_LEAD_COLUMNS =
  "id, email, first_name, call_booked, call_booked_at, call_host, call_reschedule_url, call_join_url, call_mail_confirm_at, call_mail_veille_at, call_mail_veille_batch, call_mail_jourj_at, call_mail_jourj_batch";

function contextFor(lead: CallLead): SequenceBContext | null {
  if (!lead.call_booked_at) return null;
  return {
    firstName: lead.first_name || "",
    host: lead.call_host === "Nolan" ? "Nolan" : "Jeremy",
    startTime: new Date(lead.call_booked_at),
    rescheduleUrl: lead.call_reschedule_url || "https://calendly.com/masteryapp-jeremy/30min",
    joinUrl: lead.call_join_url || "https://calendly.com/",
  };
}

// Email de confirmation, tout de suite. Une seule fois par réservation.
export async function sendConfirmation(lead: CallLead): Promise<void> {
  const ctx = contextFor(lead);
  if (!ctx || lead.call_mail_confirm_at) return;
  const r = await sendBrevo({ email: lead.email, name: lead.first_name || undefined }, "confirm", ctx);
  if (!r.ok) return;
  await getAdminClient()
    .from("crm_leads")
    .update({ call_mail_confirm_at: new Date().toISOString() })
    .eq("id", lead.id);
}

// Programme (ou envoie tout de suite si l'heure est passée) les rappels
// veille et jour J, pour un appel dans moins de 72 h. Idempotent : ne
// touche pas à un rappel déjà programmé ou envoyé.
export async function scheduleReminders(lead: CallLead): Promise<{ veille?: string; jourj?: string }> {
  const ctx = contextFor(lead);
  if (!ctx || !lead.call_booked) return {};
  const now = Date.now();
  const start = ctx.startTime.getTime();
  if (start <= now) return {};

  const times = reminderTimes(ctx.startTime);
  const update: Record<string, string> = {};
  const done: { veille?: string; jourj?: string } = {};

  const plan = async (kind: "veille" | "jourj", at: Date) => {
    const sentAt = kind === "veille" ? lead.call_mail_veille_at : lead.call_mail_jourj_at;
    const batch = kind === "veille" ? lead.call_mail_veille_batch : lead.call_mail_jourj_batch;
    if (sentAt || batch) return;
    if (at.getTime() - now > MAX_AHEAD_MS) return; // pas encore dans la fenêtre Brevo

    // Heure de rappel déjà passée (réservation tardive) : la veille part
    // tout de suite si l'appel est à plus de 6 h, le jour J est ignoré
    // (l'email de confirmation vient d'arriver).
    if (at.getTime() <= now) {
      if (kind === "jourj" || start - now < 6 * 60 * 60 * 1000) return;
      const r = await sendBrevo({ email: lead.email, name: lead.first_name || undefined }, kind, ctx);
      if (r.ok) {
        update.call_mail_veille_at = new Date().toISOString();
        done.veille = "sent";
      }
      return;
    }

    const r = await sendBrevo({ email: lead.email, name: lead.first_name || undefined }, kind, ctx, at);
    if (r.ok && r.batchId) {
      update[`call_mail_${kind}_batch`] = r.batchId;
      update[`call_mail_${kind}_at`] = at.toISOString();
      done[kind] = "scheduled";
    }
  };

  await plan("veille", times.veille);
  await plan("jourj", times.jourj);

  if (Object.keys(update).length > 0) {
    await getAdminClient().from("crm_leads").update(update).eq("id", lead.id);
  }
  return done;
}

// Annule les rappels programmés (annulation ou report Calendly) et remet
// les compteurs à zéro pour pouvoir reprogrammer.
export async function cancelReminders(lead: CallLead): Promise<void> {
  const now = Date.now();
  for (const [batch, at] of [
    [lead.call_mail_veille_batch, lead.call_mail_veille_at],
    [lead.call_mail_jourj_batch, lead.call_mail_jourj_at],
  ] as const) {
    // Un lot dont l'heure est passée est déjà parti : rien à annuler.
    if (batch && at && new Date(at).getTime() > now) await cancelScheduled(batch);
  }
  await getAdminClient()
    .from("crm_leads")
    .update({
      call_mail_veille_at: null,
      call_mail_veille_batch: null,
      call_mail_jourj_at: null,
      call_mail_jourj_batch: null,
    })
    .eq("id", lead.id);
}
