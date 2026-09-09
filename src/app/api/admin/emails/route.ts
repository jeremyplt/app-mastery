import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";
import { describeTag } from "@/lib/email-families";

export const dynamic = "force-dynamic";

// Vue admin des emails transactionnels : les événements Brevo (requête,
// délivré, ouvert, cliqué, bloqué...) regroupés par message, plus les
// rappels de la séquence B encore programmés (fiches CRM).

type BrevoEvent = {
  email: string;
  date: string;
  messageId: string;
  event: string;
  subject?: string;
  tag?: string;
  reason?: string;
  link?: string;
};

export type EmailRow = {
  messageId: string;
  email: string;
  subject: string;
  tag: string;
  label: string;
  family: string | null;
  test: boolean;
  sentAt: string;
  delivered: boolean;
  opened: boolean;
  clicked: boolean;
  blocked: boolean;
  bounced: boolean;
  deferred: boolean;
  unsubscribed: boolean;
  reason?: string;
};

const EVENT_LIMIT = 2500;

async function fetchEvents(apiKey: string, days: number): Promise<BrevoEvent[]> {
  const all: BrevoEvent[] = [];
  let offset = 0;
  while (all.length < EVENT_LIMIT) {
    const url = `https://api.brevo.com/v3/smtp/statistics/events?days=${days}&limit=500&offset=${offset}&sort=desc`;
    const res = await fetch(url, { headers: { "api-key": apiKey, Accept: "application/json" } });
    if (!res.ok) throw new Error(`Brevo events ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { events?: BrevoEvent[] };
    const batch = data.events ?? [];
    all.push(...batch);
    if (batch.length < 500) break;
    offset += 500;
  }
  return all;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "BREVO_API_KEY manquante" }, { status: 500 });
  }

  const daysParam = Number(req.nextUrl.searchParams.get("days") || 30);
  const days = [7, 30, 90].includes(daysParam) ? daysParam : 30;

  try {
    const [events, aggregatedRes, scheduledRes] = await Promise.all([
      fetchEvents(apiKey, days),
      fetch(`https://api.brevo.com/v3/smtp/statistics/aggregatedReport?days=${days}`, {
        headers: { "api-key": apiKey, Accept: "application/json" },
      }).then((r) => (r.ok ? r.json() : null)),
      getAdminClient()
        .from("crm_leads")
        .select("email, first_name, call_booked_at, call_host, call_mail_veille_at, call_mail_veille_batch, call_mail_jourj_at, call_mail_jourj_batch")
        .eq("call_booked", true)
        .gt("call_booked_at", new Date().toISOString())
        .order("call_booked_at", { ascending: true }),
    ]);

    // Regroupement par message. Les événements arrivent du plus récent au
    // plus ancien : la date d'envoi est celle de l'événement le plus ancien.
    const byMessage = new Map<string, EmailRow>();
    for (const ev of events) {
      const id = ev.messageId;
      if (!id) continue;
      let row = byMessage.get(id);
      if (!row) {
        const tag = ev.tag ?? "";
        const d = describeTag(tag);
        row = {
          messageId: id,
          email: ev.email,
          subject: ev.subject ?? "",
          tag,
          label: d.label,
          family: d.family?.id ?? null,
          test: d.test,
          sentAt: ev.date,
          delivered: false,
          opened: false,
          clicked: false,
          blocked: false,
          bounced: false,
          deferred: false,
          unsubscribed: false,
        };
        byMessage.set(id, row);
      }
      if (ev.date < row.sentAt) row.sentAt = ev.date;
      if (!row.subject && ev.subject) row.subject = ev.subject;
      switch (ev.event) {
        case "delivered":
          row.delivered = true;
          break;
        case "opened":
        case "loadedByProxy":
          row.opened = true;
          break;
        case "clicks":
          row.clicked = true;
          row.opened = true;
          break;
        case "blocked":
          row.blocked = true;
          row.reason = ev.reason;
          break;
        case "hardBounces":
        case "softBounces":
          row.bounced = true;
          row.reason = ev.reason;
          break;
        case "deferred":
          row.deferred = true;
          break;
        case "unsubscribed":
          row.unsubscribed = true;
          break;
      }
    }

    const rows = Array.from(byMessage.values()).sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1));

    // Rappels de la séquence B encore à venir.
    const now = Date.now();
    const scheduled: { email: string; firstName: string | null; kind: string; at: string; callAt: string; host: string | null }[] = [];
    for (const l of scheduledRes.data ?? []) {
      if (l.call_mail_veille_batch && l.call_mail_veille_at && new Date(l.call_mail_veille_at).getTime() > now) {
        scheduled.push({ email: l.email, firstName: l.first_name, kind: "B2 · Demain", at: l.call_mail_veille_at, callAt: l.call_booked_at, host: l.call_host });
      }
      if (l.call_mail_jourj_batch && l.call_mail_jourj_at && new Date(l.call_mail_jourj_at).getTime() > now) {
        scheduled.push({ email: l.email, firstName: l.first_name, kind: "B3 · C'est aujourd'hui", at: l.call_mail_jourj_at, callAt: l.call_booked_at, host: l.call_host });
      }
    }
    scheduled.sort((a, b) => (a.at < b.at ? -1 : 1));

    // Appels à venir sans rappel programmé (réservés à plus de 72 h, en
    // attente du cron quotidien).
    const waiting = (scheduledRes.data ?? [])
      .filter((l) => !l.call_mail_veille_batch && !l.call_mail_jourj_batch)
      .map((l) => ({ email: l.email, firstName: l.first_name, callAt: l.call_booked_at, host: l.call_host }));

    return NextResponse.json({
      days,
      truncated: events.length >= EVENT_LIMIT,
      totals: aggregatedRes,
      rows,
      scheduled,
      waiting,
    });
  } catch (err) {
    console.error("Admin emails error:", err);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
