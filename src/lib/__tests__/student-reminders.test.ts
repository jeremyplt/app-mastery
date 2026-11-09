import assert from "node:assert/strict";
import { test } from "node:test";
import { reminderDue, studentReminderDue, studentReminderKey, type StudentReminderRow } from "../payment-reminders";
import type { Sale, SalePayment } from "../ventes";

// 10 h à Paris le jour donné (UTC+1 en novembre-décembre).
const at = (day: string, hour = 10) => new Date(`${day}T${String(hour - 1).padStart(2, "0")}:00:00Z`);

const student = (over: Partial<StudentReminderRow> = {}): StudentReminderRow => ({
  id: "s",
  name: "Malika Sani",
  email: "malika@example.com",
  archived: false,
  payments: [],
  payment_reminders: {},
  ...over,
});
const due = { date: "2026-11-07", amount: 1000, paid: false };

test("élève sans vente : J-3, J-1, jour J, puis J+3 et J+7", () => {
  const s = student();
  assert.equal(studentReminderDue(s, due, at("2026-11-03")), null);
  assert.equal(studentReminderDue(s, due, at("2026-11-04")), 3);
  assert.equal(studentReminderDue(s, due, at("2026-11-05")), 3);
  assert.equal(studentReminderDue(s, due, at("2026-11-06")), 1);
  assert.equal(studentReminderDue(s, due, at("2026-11-07")), 0);
  // J+1, J+2 : rien de neuf, le rappel du jour J est passé.
  assert.equal(studentReminderDue(s, due, at("2026-11-08")), null);
  assert.equal(studentReminderDue(s, due, at("2026-11-09")), null);
  assert.equal(studentReminderDue(s, due, at("2026-11-10")), -3);
  assert.equal(studentReminderDue(s, due, at("2026-11-14")), -7);
  assert.equal(studentReminderDue(s, due, at("2026-11-20")), -7);
  // Plus de 30 jours de retard : on arrête.
  assert.equal(studentReminderDue(s, due, at("2026-12-08")), null);
});

test("élève sans vente : un rappel déjà parti ne repart pas", () => {
  const sentJ3 = student({ payment_reminders: { [studentReminderKey(due, -3)]: "2026-11-09T08:00:00Z" } });
  assert.equal(studentReminderDue(sentJ3, due, at("2026-11-10")), null);
  assert.equal(studentReminderDue(sentJ3, due, at("2026-11-12")), null);
  assert.equal(studentReminderDue(sentJ3, due, at("2026-11-14")), -7);
  const sentJ7 = student({ payment_reminders: { [studentReminderKey(due, -7)]: "2026-11-14T08:00:00Z" } });
  assert.equal(studentReminderDue(sentJ7, due, at("2026-11-20")), null);
  // Le rappel d'une autre échéance ne compte pas pour celle-ci.
  const other = student({ payment_reminders: { [studentReminderKey({ ...due, date: "2026-10-07" }, -3)]: "2026-10-10T08:00:00Z" } });
  assert.equal(studentReminderDue(other, due, at("2026-11-10")), -3);
});

test("élève sans vente : activés après coup, les rappels ratés sont sautés", () => {
  // Activation le 9 nov. pour une échéance du 7 : pas de rafale J-3, J-1, J.
  assert.equal(studentReminderDue(student(), due, at("2026-11-09")), null);
  assert.equal(studentReminderDue(student(), { ...due, date: "2026-12-01" }, at("2026-11-09")), null);
  assert.equal(studentReminderDue(student(), { ...due, date: "2026-12-01" }, at("2026-11-28")), 3);
});

test("élève sans vente : pas de rappel sans email, sans montant, payé ou archivé", () => {
  assert.equal(studentReminderDue(student({ email: null }), due, at("2026-11-10")), null);
  assert.equal(studentReminderDue(student({ email: "  " }), due, at("2026-11-10")), null);
  assert.equal(studentReminderDue(student(), { ...due, amount: null }, at("2026-11-10")), null);
  assert.equal(studentReminderDue(student(), { ...due, paid: true }, at("2026-11-10")), null);
  assert.equal(studentReminderDue(student({ archived: true }), due, at("2026-11-10")), null);
});

test("élève sans vente : seulement entre 9 h et 21 h, heure de Paris", () => {
  assert.equal(studentReminderDue(student(), due, at("2026-11-10", 8)), null);
  assert.equal(studentReminderDue(student(), due, at("2026-11-10", 9)), -3);
  assert.equal(studentReminderDue(student(), due, at("2026-11-10", 21)), null);
});

// Les ventes gardent exactement leurs règles.
const sale = (over: Partial<Sale> = {}): Sale =>
  ({
    id: "v",
    created_at: "2026-10-07T10:00:00Z",
    archived: false,
    contract_status: "completed",
    reminder_offsets: [3, 1, 0, -3, -7],
    ...over,
  }) as Sale;
const salePayment = (over: Partial<SalePayment> = {}): SalePayment => ({
  id: "p",
  sale_id: "v",
  position: 2,
  amount: 1000,
  due_date: "2026-11-07",
  paid: false,
  paid_at: null,
  reminders_sent: {},
  ...over,
});

test("ventes : mêmes rappels qu'avant", () => {
  assert.equal(reminderDue(sale(), salePayment(), at("2026-11-04")), 3);
  assert.equal(reminderDue(sale(), salePayment({ reminders_sent: { "3": "x" } }), at("2026-11-05")), null);
  assert.equal(reminderDue(sale(), salePayment({ reminders_sent: { "3": "x" } }), at("2026-11-06")), 1);
  assert.equal(reminderDue(sale(), salePayment({ reminders_sent: { "0": "x" } }), at("2026-11-06")), null);
  assert.equal(reminderDue(sale(), salePayment(), at("2026-11-10")), -3);
  assert.equal(reminderDue(sale(), salePayment({ reminders_sent: { "-7": "x" } }), at("2026-11-20")), null);
  // Contrat pas signé : pas de rappel de retard.
  assert.equal(reminderDue(sale({ contract_status: "sent" }), salePayment(), at("2026-11-10")), null);
  // Acompte dû le jour de la vente : pas de rappel avant l'échéance.
  assert.equal(reminderDue(sale({ created_at: "2026-11-07T10:00:00Z" }), salePayment(), at("2026-11-07")), null);
  assert.equal(reminderDue(sale({ contract_status: "declined" }), salePayment(), at("2026-11-04")), null);
});
