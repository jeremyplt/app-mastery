// Élèves sans nouvelles, d'après leur fil WhatsApp pro relié dans le CRM
// (whatsapp_threads.student_id). Sans importer de code serveur : sert à la
// fois aux pages élèves et au point du jour de 9 h.

export const SILENT_DAYS = 7;

export type ThreadDates = { last_inbound_at: string | null; last_outbound_at?: string | null };

const latest = (dates: (string | null | undefined)[]): string | null =>
  dates.filter((d): d is string => Boolean(d)).sort((a, b) => Date.parse(a) - Date.parse(b)).at(-1) ?? null;

const parisDay = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(d);
const dayGap = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);

// Fin de l'accompagnement : début + 3 mois (même calcul que addMonths).
function endOf(start: string): string {
  const [y, m, d] = start.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + 3, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, last));
  return target.toISOString().slice(0, 10);
}

// Dernier échange connu : noté à la main sur la fiche, ou lu sur WhatsApp
// (message de l'élève ou réponse de Jeremy).
export function lastExchange(lastContactAt: string | null, threads: ThreadDates[] | null | undefined): string | null {
  return latest([lastContactAt, ...(threads ?? []).flatMap((t) => [t.last_inbound_at, t.last_outbound_at])]);
}

// Nombre de jours depuis le dernier message de l'élève, seulement pendant
// l'accompagnement (du début à début + 3 mois) et à partir de SILENT_DAYS.
// null : rien à signaler (pas de fil relié, accompagnement pas commencé ou
// terminé, ou message récent).
export function silentDays(s: { start_date: string | null; archived?: boolean; whatsapp_threads?: ThreadDates[] | null }, now = new Date()): number | null {
  if (s.archived || !s.start_date) return null;
  const today = parisDay(now);
  if (today < s.start_date || today > endOf(s.start_date)) return null;
  const last = latest((s.whatsapp_threads ?? []).map((t) => t.last_inbound_at));
  if (!last) return null;
  const days = dayGap(parisDay(new Date(last)), today);
  return days >= SILENT_DAYS ? days : null;
}
