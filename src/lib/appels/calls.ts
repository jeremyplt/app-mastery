import type { SupabaseClient } from "@supabase/supabase-js";

// Appels à venir avec les élèves, pour la préparation d'appel (fiche élève et
// /admin/calendrier). Source principale : l'agenda Calendly de Jeremy (jeton
// CALENDLY_PAT, en lecture seule). Secours : les créneaux de kick-off et de
// clôture notés sur la fiche par le webhook Calendly. Les invités sont reliés à
// un élève par leur email, puis par leur nom. Les rendez-vous de vente
// (appels stratégiques, découverte, closing : c'est Nolan qui les fait) et les
// prospects sans fiche élève sont ignorés.

const CALENDLY = "https://api.calendly.com";

export type CalendlyInvitee = { name: string; email: string };
export type CalendlyCall = { uri: string; name: string; eventType: string | null; start: string; joinUrl: string | null; invitees: CalendlyInvitee[] };

// Jeremy ne fait que deux sortes d'appels avec ses élèves : le kick-off au
// démarrage, et l'appel pour régler un problème (bilan de fin compris).
export type CallKind = "kickoff" | "probleme";

// Rendez-vous de vente : événement de Nolan, ou appel stratégique gratuit,
// découverte, closing. Jamais de fiche pour eux, même si l'invité a une fiche.
const SALES_EVENT_TYPES = new Set(["https://api.calendly.com/event_types/8dada1ac-c858-4c5f-84c8-b16f68fd51ca"]);
const SALES_NAME = /strat[ée]gique|d[ée]couverte|closing|\bvente\b|gratuit|incubateur/i;

export function isSalesEvent(c: Pick<CalendlyCall, "name" | "eventType">): boolean {
  return (c.eventType !== null && SALES_EVENT_TYPES.has(c.eventType)) || SALES_NAME.test(c.name);
}

export type StudentLite = {
  id: string;
  name: string;
  email: string | null;
  app: string | null;
  archived?: boolean | null;
  start_date?: string | null;
  kickoff?: boolean | null;
  kickoff_call_at?: string | null;
  closing_call_at?: string | null;
};

export type UpcomingCall = {
  key: string; // URI Calendly, ou "fiche:<id>:<kickoff|cloture>"
  student_id: string;
  student_name: string;
  app: string | null;
  starts_at: string;
  title: string;
  join_url: string | null;
  source: "calendly" | "fiche";
  match: "email" | "nom" | "fiche";
  kind: CallKind;
};

// Type d'appel : kick-off quand le titre ou le créneau le disent (titre
// « kick-off » ou « démarrage », créneau de démarrage noté sur la fiche), ou
// quand l'élève vient de démarrer sans kick-off coché ; sinon un problème à
// régler, dont le sujet vient des derniers messages WhatsApp.
const KICKOFF_TITLE = /kick[\s-]?off|d[ée]marrage/i;

export function callKind(s: Pick<StudentLite, "start_date" | "kickoff" | "kickoff_call_at">, call: { key: string; starts_at: string; title?: string | null }): CallKind {
  if (call.key.startsWith("manuel:")) return s.kickoff ? "probleme" : "kickoff";
  if (call.key.endsWith(":kickoff") || (call.title && KICKOFF_TITLE.test(call.title))) return "kickoff";
  const at = Date.parse(call.starts_at);
  if (s.kickoff_call_at && Math.abs(Date.parse(s.kickoff_call_at) - at) < 30 * 60_000) return "kickoff";
  if (!s.kickoff) {
    if (!s.start_date) return "kickoff";
    const days = (at - Date.parse(`${s.start_date}T00:00:00Z`)) / 86_400_000;
    if (days < 45) return "kickoff";
  }
  return "probleme";
}

export type CalendlyState = "ok" | "absent" | "erreur";

// "Sóraya  ERRIAHI-ben" -> ["soraya", "erriahi", "ben"]
export function nameTokens(name: string | null | undefined): string[] {
  return (name ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2);
}

// Élève correspondant à un invité Calendly : même email, sinon un seul élève
// dont le nom contient tous les mots du nom de l'invité (ou l'inverse, quand
// la fiche n'a que le prénom). Dans le doute (deux élèves possibles), aucun.
export function matchStudent(invitee: CalendlyInvitee, students: StudentLite[]): { student: StudentLite; by: "email" | "nom" } | null {
  const active = students.filter((s) => !s.archived);
  const pool = active.length ? [...active, ...students.filter((s) => s.archived)] : students;
  const email = invitee.email.trim().toLowerCase();
  if (email) {
    const byEmail = pool.filter((s) => s.email && s.email.trim().toLowerCase() === email);
    if (byEmail.length) return { student: byEmail[0], by: "email" };
  }
  const inv = nameTokens(invitee.name);
  if (!inv.length || inv.join("").length < 3) return null;
  const contains = (big: string[], small: string[]) => small.length > 0 && small.every((t) => big.includes(t));
  for (const group of [active, students.filter((s) => s.archived)]) {
    const exact = group.filter((s) => nameTokens(s.name).join(" ") === inv.join(" "));
    if (exact.length === 1) return { student: exact[0], by: "nom" };
    const loose = group.filter((s) => {
      const st = nameTokens(s.name);
      return contains(st, inv) || contains(inv, st);
    });
    if (loose.length === 1) return { student: loose[0], by: "nom" };
    if (loose.length > 1) return null;
  }
  return null;
}

async function calendly<T>(pat: string, url: string, get: typeof fetch): Promise<T> {
  const res = await get(url, { headers: { Authorization: `Bearer ${pat}` }, cache: "no-store" });
  if (!res.ok) throw new Error(`Calendly ${res.status}`);
  return (await res.json()) as T;
}

// Rendez-vous actifs de l'agenda de Jeremy entre deux dates, avec leurs invités.
export async function fetchCalendlyCalls(pat: string, from: Date, to: Date, get: typeof fetch = fetch): Promise<CalendlyCall[]> {
  const me = await calendly<{ resource: { uri: string } }>(pat, `${CALENDLY}/users/me`, get);
  const q = new URLSearchParams({
    user: me.resource.uri,
    min_start_time: from.toISOString(),
    max_start_time: to.toISOString(),
    status: "active",
    count: "100",
    sort: "start_time:asc",
  });
  const events = await calendly<{ collection: { uri: string; name: string; event_type?: string; start_time: string; location?: { join_url?: string } | null }[] }>(
    pat,
    `${CALENDLY}/scheduled_events?${q}`,
    get,
  );
  return Promise.all(
    events.collection.map(async (e) => {
      const inv = await calendly<{ collection: { name?: string; email?: string }[] }>(pat, `${e.uri}/invitees?status=active&count=20`, get);
      return {
        uri: e.uri,
        name: e.name,
        eventType: e.event_type ?? null,
        start: e.start_time,
        joinUrl: e.location?.join_url ?? null,
        invitees: inv.collection.map((i) => ({ name: i.name ?? "", email: i.email ?? "" })),
      };
    }),
  );
}

// Assemble les appels élèves : Calendly d'abord, puis les créneaux de la fiche
// absents de Calendly (à 30 minutes près).
export function mergeCalls(calendlyCalls: CalendlyCall[], students: StudentLite[], from: Date, to: Date): UpcomingCall[] {
  const out: UpcomingCall[] = [];
  for (const c of calendlyCalls) {
    if (isSalesEvent(c)) continue;
    for (const inv of c.invitees) {
      const m = matchStudent(inv, students);
      if (!m) continue;
      const startsAt = new Date(c.start).toISOString();
      out.push({
        key: c.uri,
        student_id: m.student.id,
        student_name: m.student.name,
        app: m.student.app,
        starts_at: startsAt,
        title: c.name,
        join_url: c.joinUrl,
        source: "calendly",
        match: m.by,
        kind: callKind(m.student, { key: c.uri, starts_at: startsAt, title: c.name }),
      });
      break;
    }
  }
  const near = (studentId: string, at: string) => out.some((c) => c.student_id === studentId && Math.abs(Date.parse(c.starts_at) - Date.parse(at)) < 30 * 60_000);
  for (const s of students) {
    if (s.archived) continue;
    for (const [kind, at, title] of [
      ["kickoff", s.kickoff_call_at, "Appel de démarrage (kick-off)"],
      ["cloture", s.closing_call_at, "Appel de clôture"],
    ] as const) {
      if (!at) continue;
      const t = Date.parse(at);
      if (Number.isNaN(t) || t < from.getTime() || t > to.getTime() || near(s.id, at)) continue;
      const key = `fiche:${s.id}:${kind}`;
      const startsAt = new Date(t).toISOString();
      out.push({ key, student_id: s.id, student_name: s.name, app: s.app, starts_at: startsAt, title, join_url: null, source: "fiche", match: "fiche", kind: callKind(s, { key, starts_at: startsAt }) });
    }
  }
  return out.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
}

// Appels élèves entre deux dates. Sans jeton Calendly (ou si Calendly ne
// répond pas), seulement les créneaux notés sur les fiches.
export async function upcomingStudentCalls(
  db: SupabaseClient,
  opts: { pat?: string | null; from: Date; to: Date; studentId?: string | null; get?: typeof fetch },
): Promise<{ calls: UpcomingCall[]; calendly: CalendlyState }> {
  const { data, error } = await db.from("students").select("id, name, email, app, archived, start_date, kickoff, kickoff_call_at, closing_call_at");
  if (error) throw new Error(error.message);
  const students = (data ?? []) as StudentLite[];
  let fromCalendly: CalendlyCall[] = [];
  let state: CalendlyState = "absent";
  if (opts.pat) {
    try {
      fromCalendly = await fetchCalendlyCalls(opts.pat, opts.from, opts.to, opts.get);
      state = "ok";
    } catch {
      state = "erreur";
    }
  }
  const calls = mergeCalls(fromCalendly, students, opts.from, opts.to);
  return { calls: opts.studentId ? calls.filter((c) => c.student_id === opts.studentId) : calls, calendly: state };
}

// "2026-11-12" (jour à Paris)
export function parisDay(d: Date | string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(typeof d === "string" ? new Date(d) : d);
}

export function parisHour(d: Date): number {
  return Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", hour12: false }).format(d)) % 24;
}
