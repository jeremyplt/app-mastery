// Quand envoyer un rappel d'échéance, pour une vente (/admin/ventes) ou pour
// un élève sans vente (/admin/eleves, paiements saisis à la main). Calculs
// purs, sans base de données, pour pouvoir les tester (voir
// src/lib/__tests__/student-reminders.test.ts). L'envoi est dans lib/ventes.
//
// Décalage (offset) : jours avant l'échéance. 3 = J-3, 0 = jour J,
// -3 = J+3 en retard, -7 = J+7, dernier rappel avant suspension.

import type { Sale, SalePayment } from "@/lib/ventes";
import type { StudentPayment } from "@/lib/students";

// Mêmes calculs que parisDay / parisHour de lib/call-reminders, recopiés ici
// parce que ce module-là ouvre la base dès son chargement.
const PARIS = "Europe/Paris";
function parisDay(at: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: PARIS, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
}
function parisHour(at: Date): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: PARIS, hourCycle: "h23", hour: "2-digit" }).format(at));
}

function daysUntil(today: string, due: string): number {
  return Math.round((Date.parse(`${due}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

// Cœur commun aux ventes et aux élèves sans vente : le rappel à envoyer
// maintenant, le plus proche de l'échéance parmi ceux déjà atteints, s'il
// n'est pas encore parti. Les rappels plus anciens ratés (vente déclarée tard,
// cron en panne, rappels activés après coup) sont sautés.
function offsetDue(offsets: number[], dueDate: string, sent: number[], now: Date): number | null {
  const left = daysUntil(parisDay(now), dueDate);
  if (left < -30) return null;
  // Une fois l'échéance passée, seuls les rappels de retard comptent.
  const reached = offsets.filter((o) => o >= left && (o < 0 || left >= 0)).sort((a, b) => a - b);
  if (reached.length === 0) return null;
  const offset = reached[0];
  // Déjà parti, ou déjà relancé pour un rappel plus proche : rien à faire.
  if (sent.some((o) => o <= offset)) return null;
  if (parisHour(now) < 9 || parisHour(now) >= 21) return null;
  return offset;
}

export function reminderDue(sale: Sale, payment: SalePayment, now = new Date()): number | null {
  if (payment.paid || sale.archived) return null;
  if (sale.contract_status === "declined" || sale.contract_status === "voided") return null;
  // Avant l'échéance : pas de rappel pour un paiement dû le jour de la vente.
  // Après : seulement si le contrat est signé (on ne menace pas de couper un
  // accès qui n'a jamais été ouvert).
  const offsets = sale.reminder_offsets.filter((o) =>
    o < 0 ? sale.contract_status === "completed" : payment.due_date > parisDay(new Date(sale.created_at)),
  );
  return offsetDue(offsets, payment.due_date, Object.keys(payment.reminders_sent).map(Number), now);
}

// Élèves sans vente (arrivés avant /admin/ventes, paiements saisis à la main
// dans students.payments) : mêmes rappels que les ventes par défaut, retards
// compris puisque leur accès est déjà ouvert. Pas d'email ou pas de montant :
// pas de rappel.
export const STUDENT_REMINDER_OFFSETS = [3, 1, 0, -3, -7];

export type StudentReminderRow = {
  id: string;
  name: string;
  email: string | null;
  archived: boolean;
  payments: StudentPayment[];
  payment_reminders: Record<string, string> | null;
};

// Clé d'un rappel dans students.payment_reminders : "2026-11-07/1000/-3".
// Le montant évite de confondre deux échéances le même jour. La fiche élève
// relit ces clés (lastReminder dans app/admin/eleves/shared).
function studentReminderPrefix(payment: StudentPayment): string {
  return `${payment.date}/${payment.amount ?? 0}/`;
}

export function studentReminderKey(payment: StudentPayment, offset: number): string {
  return `${studentReminderPrefix(payment)}${offset}`;
}

export function studentReminderDue(student: StudentReminderRow, payment: StudentPayment, now = new Date()): number | null {
  if (payment.paid || student.archived || !student.email?.trim() || !payment.amount) return null;
  const prefix = studentReminderPrefix(payment);
  const sent = Object.keys(student.payment_reminders ?? {})
    .filter((k) => k.startsWith(prefix))
    .map((k) => Number(k.slice(prefix.length)));
  return offsetDue(STUDENT_REMINDER_OFFSETS, payment.date, sent, now);
}
