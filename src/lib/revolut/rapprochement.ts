import { classifyLine, findScheduleEntry, matchStudents, tokens, type BankLine, type ScheduleEntry, type Student } from "@/lib/facturation/match";
import { fold, parseReference, type ParsedReference } from "./reference";
import type { RevolutLeg, RevolutTransaction } from "./types";

// Un virement reçu sur Revolut : quelle échéance d'élève paie-t-il ? Fonction
// pure. Au moindre doute, on ne coche rien et on prévient Jeremy.

// Compte « Main » en euros de SDG STUDIO : le seul où les élèves paient.
export const MAIN_EUR_ACCOUNT_ID = "820e8d4c-a0b4-459a-9f13-53b8f45d91c1";

export type Decision =
  | { action: "ignore"; reason: string }
  // premiere : 1re échéance, cochée par Jeremy (elle déclenche le Skool).
  // devise : paiement d'élève hors du compte Main EUR. doute : tout le reste.
  | { action: "alert"; kind: "premiere" | "doute" | "devise"; reason: string; student: Student | null; position: number | null }
  | { action: "mark"; student: Student; position: number; date: string; reason: string };

const round2 = (n: number) => Math.round(n * 100) / 100;
export const money = (n: number, currency = "EUR") => new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n);

// Date du virement à Luxembourg (un virement de 0 h 30 est du jour même).
export function luxDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Luxembourg" }).format(new Date(iso));
}

// Argent venu de l'extérieur : un virement reçu (topup) ou un paiement de
// Revolut à Revolut (transfer), une seule jambe, positive. Un virement entre
// nos comptes ou un change a aussi une jambe négative chez nous.
export function incomingLeg(tx: RevolutTransaction): RevolutLeg | null {
  if (tx.type !== "topup" && tx.type !== "transfer") return null;
  const legs = tx.legs ?? [];
  if (legs.length !== 1 || !(Number(legs[0].amount) > 0)) return null;
  return legs[0];
}

export function toBankLine(tx: RevolutTransaction, leg: RevolutLeg): BankLine {
  return { id: 0, date: luxDate(tx.completed_at ?? tx.created_at), amount: round2(Number(leg.amount)), payment_ref: tx.reference ?? "", partner_name: leg.description ?? "" };
}

// Nom collé (« KEVINMARTIN », « MASTERYMALIKA ») : le nom complet de l'élève,
// dans un sens ou dans l'autre, se lit dans la référence sans espaces.
function gluedMatches(text: string, students: Student[]): Student[] {
  const hay = fold(text).replace(/[^a-z]/g, "");
  return students.filter((s) => {
    const parts = tokens(s.name);
    if (parts.length < 2) return false;
    const forward = parts.join("");
    return forward.length >= 8 && (hay.includes(forward) || hay.includes([...parts].reverse().join("")));
  });
}

// L'élève désigné par la référence, sinon par le payeur (référence sans nom).
function studentsFromReference(ref: ParsedReference, line: BankLine, students: Student[]): Student[] {
  const named = matchStudents({ ...line, payment_ref: ref.name, partner_name: "" }, students);
  if (named.length) return named;
  const glued = gluedMatches(ref.name, students);
  if (glued.length) return glued;
  return matchStudents(line, students);
}

function doubt(reason: string, student: Student | null, position: number | null): Decision {
  return { action: "alert", kind: "doute", reason, student, position };
}

function checkEntry(student: Student, entry: ScheduleEntry, line: BankLine, how: string): Decision {
  const label = `${entry.position}/${student.schedule.length}`;
  if (student.contractBlocked) return doubt(`Contrat refusé ou expiré pour ${student.name}.`, student, entry.position);
  if (round2(entry.amount) !== line.amount) return doubt(`${student.name} : ${money(line.amount)} reçus, mais l'échéance ${label} est de ${money(entry.amount)}.`, student, entry.position);
  if (entry.paid) return doubt(`${student.name} : l'échéance ${label} est déjà cochée. Doublon possible, ou paiement d'une autre échéance.`, student, entry.position);
  if (entry.position === 1) return { action: "alert", kind: "premiere", reason: `${student.name} : 1re échéance reçue (${money(line.amount)}). À cocher toi-même, c'est elle qui déclenche le Skool.`, student, position: 1 };
  return { action: "mark", student, position: entry.position, date: line.date, reason: `${student.name} ${label} (${how})` };
}

export function decide(tx: RevolutTransaction, students: Student[], mainAccountId = MAIN_EUR_ACCOUNT_ID): Decision {
  if (tx.state !== "completed") return { action: "ignore", reason: `Pas encore reçu (${tx.state})` };
  const leg = incomingLeg(tx);
  if (!leg) return { action: "ignore", reason: `${tx.type} : pas un paiement reçu de l'extérieur` };
  const line = toBankLine(tx, leg);
  const ref = parseReference(tx.reference);
  const cls = classifyLine(line);
  const mayBeClient = cls.kind === "client" || cls.kind === "existing";

  // Ailleurs que sur Main EUR (dollars surtout) : jamais de coche automatique.
  if (leg.account_id !== mainAccountId || leg.currency !== "EUR") {
    const who = ref ? studentsFromReference(ref, line, students) : mayBeClient ? matchStudents(line, students) : [];
    if (!ref && who.length === 0) return { action: "ignore", reason: `Reçu en ${leg.currency} hors du compte Main EUR, pas un paiement d'élève` };
    const student = who.length === 1 ? who[0] : null;
    const where = leg.currency === "EUR" ? "sur un autre compte que Main EUR" : `en ${leg.currency}`;
    return { action: "alert", kind: "devise", reason: `Paiement ${student ? `de ${student.name}` : "d'élève"} reçu ${where} (${money(line.amount, leg.currency)}). Pas de coche automatique : à cocher à la main une fois le montant vérifié.`, student, position: ref?.position ?? null };
  }

  if (ref) {
    const who = studentsFromReference(ref, line, students);
    if (who.length === 0) return doubt(`Référence App Mastery, mais aucun élève ne correspond à « ${ref.name || "(sans nom)"} ».`, null, ref.position);
    if (who.length > 1) return doubt(`Plusieurs élèves possibles : ${who.map((s) => s.name).join(", ")}.`, null, ref.position);
    const student = who[0];
    if (ref.position !== null) {
      const count = student.schedule.length;
      if (ref.total !== count) return doubt(`${student.name} : la référence dit ${ref.position}/${ref.total}, mais son échéancier compte ${count} échéance${count > 1 ? "s" : ""}.`, student, ref.position);
      const entry = student.schedule.find((e) => e.position === ref.position);
      if (!entry) return doubt(`${student.name} : échéance ${ref.position}/${ref.total} introuvable.`, student, ref.position);
      return checkEntry(student, entry, line, "référence");
    }
    const entry = findScheduleEntry(line, student, new Set());
    if (!entry) return doubt(`${student.name} : le montant ou la date ne correspondent à aucune échéance.`, student, null);
    return checkEntry(student, entry, line, "référence sans n/N, montant et date");
  }

  // Sans référence App Mastery : la logique du job de factures (nom + montant).
  if (!mayBeClient) return { action: "ignore", reason: cls.kind === "ignore" || cls.kind === "handoff" ? cls.reason : cls.kind === "skool" ? "Skool" : "Google AdSense" };
  const who = matchStudents(line, students);
  if (who.length === 0) return { action: "ignore", reason: "Payeur inconnu : aucun élève ne correspond (le job de factures le verra)" };
  if (who.length > 1) return doubt(`Plusieurs élèves possibles : ${who.map((s) => s.name).join(", ")}.`, null, null);
  const entry = findScheduleEntry(line, who[0], new Set());
  if (!entry) return doubt(`${who[0].name} : le montant ou la date ne correspondent à aucune échéance.`, who[0], null);
  return checkEntry(who[0], entry, line, "nom et montant");
}
