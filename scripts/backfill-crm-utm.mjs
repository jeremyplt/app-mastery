// Remplit après coup les UTM du premier contact (crm_leads.utm_*) des fiches
// créées avant le 16 nov. 2026, date où /api/subscribe a commencé à les garder.
//
// - Optins (plan-action, guide, vsl) : l'événement PostHog d'inscription porte
//   les UTM de la page. Il est relié à la fiche par l'email (navigateur
//   identifié, depuis sept. 2026), sinon par l'heure : un seul événement du
//   même formulaire entre 5 s avant et 30 s après la création de la fiche.
// - Réservations directes (source calendly) : UTM du lien de réservation,
//   lues sur l'invité Calendly.
//
// Ne touche qu'aux fiches sans UTM. Par défaut, simulation ; --apply écrit.
//   node --env-file=.env.local scripts/backfill-crm-utm.mjs [--apply]

import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EVENT_OF = { "plan-action": "plan_action_form_submitted", guide: "guide_optin_submitted", vsl: "vsl_optin_submitted" };
// Écart mesuré entre la fiche et l'événement : 1 à 4 s (180 sur 194 sous 30 s).
const WINDOW_BEFORE = 5_000;
const WINDOW_AFTER = 30_000;

const clean = (v) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 120) : null);

async function leadsWithoutUtm() {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("crm_leads")
      .select("id, email, source, guide_slug, created_at")
      .is("utm_source", null)
      .order("created_at", { ascending: true })
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

async function optinEvents() {
  const query = `
    SELECT event, timestamp, properties.utm_source, properties.utm_medium, properties.utm_campaign,
           properties.guide, person.properties.email
    FROM events
    WHERE event IN ('plan_action_form_submitted', 'guide_optin_submitted', 'vsl_optin_submitted')
      AND timestamp >= toDateTime('2026-03-01')
    ORDER BY timestamp
    LIMIT 20000`;
  const res = await fetch(`https://us.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID || "337648"}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query }, name: "backfill-crm-utm" }),
  });
  if (!res.ok) throw new Error(`PostHog ${res.status}: ${await res.text()}`);
  const { results } = await res.json();
  return results.map(([event, ts, source, medium, campaign, guide, email]) => ({
    event,
    at: new Date(ts).getTime(),
    utm: clean(source) ? { utm_source: clean(source), utm_medium: clean(medium), utm_campaign: clean(campaign) } : null,
    guide: guide || null,
    email: typeof email === "string" ? email.trim().toLowerCase() : null,
    used: false,
  }));
}

function matchOptin(lead, events) {
  const type = EVENT_OF[lead.source];
  if (!type) return null;
  const t = new Date(lead.created_at).getTime();
  const email = lead.email.toLowerCase();
  // Événements du même formulaire au moment de la création de la fiche (une
  // réinscription des semaines plus tard n'est pas le premier contact), sauf
  // ceux d'un autre email identifié.
  const near = events.filter(
    (e) =>
      e.event === type &&
      !e.used &&
      (lead.source !== "guide" || !e.guide || e.guide === lead.guide_slug) &&
      e.at >= t - WINDOW_BEFORE &&
      e.at <= t + WINDOW_AFTER &&
      (!e.email || e.email === email),
  );

  // 1. Même email : le plus proche.
  const mine = near.filter((e) => e.email === email);
  if (mine.length) return { how: "email", event: mine.reduce((a, b) => (Math.abs(a.at - t) <= Math.abs(b.at - t) ? a : b)) };
  // 2. Sinon un seul événement anonyme dans la fenêtre.
  if (near.length === 1) return { how: "heure", event: near[0] };
  return null;
}

async function calendlyUtm(email) {
  const headers = { Authorization: `Bearer ${process.env.CALENDLY_PAT}` };
  const me = await fetch("https://api.calendly.com/users/me", { headers }).then((r) => r.json());
  const org = me.resource?.current_organization;
  const params = new URLSearchParams({ organization: org, invitee_email: email, sort: "start_time:asc", count: "20" });
  const events = await fetch(`https://api.calendly.com/scheduled_events?${params}`, { headers }).then((r) => r.json());
  for (const ev of events.collection ?? []) {
    const uuid = ev.uri.split("/").pop();
    const inv = await fetch(`https://api.calendly.com/scheduled_events/${uuid}/invitees?email=${encodeURIComponent(email)}`, { headers }).then((r) => r.json());
    const tracking = inv.collection?.[0]?.tracking;
    if (clean(tracking?.utm_source)) {
      return { utm_source: clean(tracking.utm_source), utm_medium: clean(tracking.utm_medium), utm_campaign: clean(tracking.utm_campaign) };
    }
  }
  return null;
}

const leads = await leadsWithoutUtm();
const events = await optinEvents();
console.log(`${leads.length} fiches sans UTM, ${events.length} événements d'optin PostHog`);

const updates = [];
const stats = {};
const bump = (source, key) => {
  stats[source] ??= { fiches: 0, email: 0, heure: 0, "sans utm à l'optin": 0, calendly: 0, "pas trouvé": 0 };
  stats[source][key] += 1;
};

for (const lead of leads) {
  bump(lead.source, "fiches");
  if (lead.source === "calendly") {
    const utm = await calendlyUtm(lead.email);
    if (utm) {
      updates.push({ id: lead.id, utm });
      bump(lead.source, "calendly");
    } else bump(lead.source, "pas trouvé");
    continue;
  }
  const m = matchOptin(lead, events);
  if (!m) {
    bump(lead.source, "pas trouvé");
    continue;
  }
  m.event.used = true;
  if (m.event.utm) {
    updates.push({ id: lead.id, utm: m.event.utm });
    bump(lead.source, m.how);
  } else bump(lead.source, "sans utm à l'optin");
}

console.table(stats);
const byCampaign = {};
for (const u of updates) {
  const k = `${u.utm.utm_source} · ${u.utm.utm_campaign ?? "(sans campagne)"}`;
  byCampaign[k] = (byCampaign[k] ?? 0) + 1;
}
console.table(Object.entries(byCampaign).sort((a, b) => b[1] - a[1]).slice(0, 40));

if (!APPLY) {
  console.log(`Simulation : ${updates.length} fiches à remplir. Relancer avec --apply pour écrire.`);
} else {
  let done = 0;
  for (const u of updates) {
    const { error } = await supabase.from("crm_leads").update(u.utm).eq("id", u.id).is("utm_source", null);
    if (error) console.error(u.id, error.message);
    else done += 1;
  }
  console.log(`${done} fiches remplies.`);
}
