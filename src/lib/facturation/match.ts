// Classe un virement et le rattache à un élève. Fonctions pures.

export type BankLine = { id: number; date: string; amount: number; payment_ref: string; partner_name: string };
export type ScheduleEntry = { position: number; amount: number; due: string; paid: boolean };
export type Student = {
  id: string;
  name: string;
  email: string | null;
  partnerId: number | null;
  partnerName: string | null;
  companyName: string | null;
  schedule: ScheduleEntry[];
  contractBlocked: boolean;
  billing: Record<string, string>;
  commissionPerInstallment: number;
};

export type LineClass =
  | { kind: "ignore"; reason: string }
  | { kind: "handoff"; reason: string }
  | { kind: "existing"; number: string }
  | { kind: "skool" }
  | { kind: "google" }
  | { kind: "client" };

export function classifyLine(line: BankLine): LineClass {
  const text = `${line.payment_ref} ${line.partner_name}`;
  const number = text.match(/VEN\/\d{4}\/\d{5}/)?.[0];
  if (number) return { kind: "existing", number };
  if (/^(To|From) EUR\b/i.test(line.payment_ref)) return { kind: "ignore", reason: "Virement entre comptes Revolut" };
  if (/Auto Top-Up/i.test(text)) return { kind: "ignore", reason: "Recharge automatique" };
  if (/Lib[ée]ration du capital/i.test(text)) return { kind: "ignore", reason: "Libération du capital" };
  // Un paiement en devise n'apparaît qu'au moment du change, sans le nom du payeur.
  if (/^Exchanged to EUR/i.test(line.payment_ref)) return { kind: "handoff", reason: "Virement en devise converti : le payeur n'apparaît pas" };
  if (/skool/i.test(text)) return { kind: "skool" };
  if (/google ireland/i.test(text)) return { kind: "google" };
  if (/payoneer|payment escrow/i.test(text)) return { kind: "handoff", reason: "Upwork : le montant brut et les heures sont à vérifier sur Upwork" };
  return { kind: "client" };
}

const STOP = new Set(["payment", "from", "app", "mastery", "appmastery", "envoye", "depuis", "revolut", "virement", "facture", "mr", "mme", "m", "ei", "sarl", "sa", "sas", "sasu", "llc", "ltd", "limited", "inc", "the", "de", "du", "la", "le"]);

export function tokens(s: string | null | undefined): string[] {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOP.has(t));
}

const same = (a: string, b: string) => a === b || (Math.min(a.length, b.length) >= 4 && (a.startsWith(b) || b.startsWith(a)));

function nameScore(payer: string[], student: Student): number {
  let best = 0;
  for (const label of [student.name, student.partnerName, student.companyName]) {
    const wanted = tokens(label);
    const hits = wanted.filter((w) => payer.some((p) => same(p, w)));
    if (hits.length >= 2 || (hits.length === wanted.length && wanted.length > 0 && hits.join("").length >= 5)) best = Math.max(best, 2);
    else if (hits.some((h) => h.length >= 6)) best = Math.max(best, 1);
  }
  return best;
}

// Élèves dont le nom correspond au payeur. Deux noms qui correspondent valent
// mieux qu'un seul long : on ne garde que le meilleur niveau.
export function matchStudents(line: BankLine, students: Student[]): Student[] {
  const payer = tokens(`${line.payment_ref} ${line.partner_name}`);
  const scored = students.map((s) => ({ s, score: nameScore(payer, s) })).filter((x) => x.score > 0);
  const top = Math.max(0, ...scored.map((x) => x.score));
  return scored.filter((x) => x.score === top).map((x) => x.s);
}

const DAY = 86_400_000;
// Assez court pour qu'une seule échéance mensuelle puisse correspondre. Un
// virement plus éloigné de son échéance passe par Jeremy.
export const SCHEDULE_WINDOW_DAYS = 12;

// L'échéance de même montant la plus proche de la date du virement.
export function findScheduleEntry(line: BankLine, student: Student, taken: Set<number>): ScheduleEntry | null {
  const at = Date.parse(`${line.date}T12:00:00Z`);
  const candidates = student.schedule
    .filter((e) => e.amount === line.amount && !taken.has(e.position))
    .map((e) => ({ e, gap: Math.abs(Date.parse(`${e.due}T12:00:00Z`) - at) / DAY }))
    .filter((x) => x.gap <= SCHEDULE_WINDOW_DAYS)
    .sort((a, b) => a.gap - b.gap);
  return candidates[0]?.e ?? null;
}
