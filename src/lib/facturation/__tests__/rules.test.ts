import assert from "node:assert/strict";
import { test } from "node:test";
import { checkInvoiceText, decideTax, htFromTtc, installmentNote, MENTION_AUTOLIQUIDATION, MENTION_PARTICULIER_HORS_UE, MENTION_SOCIETE_HORS_UE, POSITION, TAX } from "../rules";
import { classifyLine, findScheduleEntry, matchStudents, type BankLine, type Student } from "../match";

const line = (over: Partial<BankLine>): BankLine => ({ id: 1, date: "2026-11-02", amount: 1000, payment_ref: "", partner_name: "", ...over });
const student = (over: Partial<Student>): Student => ({ id: "s", name: "Prénom Nom", email: "a@b.fr", partnerId: 1, partnerName: null, companyName: null, schedule: [], contractBlocked: false, billing: {}, commissionPerInstallment: 0, ...over });

test("TVA : chaque type de client", () => {
  const t = (isCompany: boolean, countryCode: string | null, vat: string | null = null, hasResidenceProof = false) => decideTax({ isCompany, countryCode, vat, hasResidenceProof });
  assert.deepEqual(t(false, "FR"), { ok: true, positionId: POSITION.EU_PRIVATE, taxId: TAX.S17, rate: 0.17, mention: null, mentionFromPosition: false });
  assert.deepEqual(t(true, "LU"), { ok: true, positionId: POSITION.LU_COMPANY, taxId: TAX.S17, rate: 0.17, mention: null, mentionFromPosition: false });
  assert.deepEqual(t(true, "FR", "FR19939066767"), { ok: true, positionId: POSITION.EU_COMPANY, taxId: TAX.IC0, rate: 0, mention: MENTION_AUTOLIQUIDATION, mentionFromPosition: false });
  assert.deepEqual(t(true, "US"), { ok: true, positionId: POSITION.NON_EU_COMPANY, taxId: TAX.EC0, rate: 0, mention: MENTION_SOCIETE_HORS_UE, mentionFromPosition: false });
  assert.deepEqual(t(false, "CA", null, true), { ok: true, positionId: POSITION.NON_EU_PRIVATE, taxId: TAX.EC0, rate: 0, mention: MENTION_PARTICULIER_HORS_UE, mentionFromPosition: true });
});

test("TVA : on s'arrête plutôt que de deviner", () => {
  assert.equal(decideTax({ isCompany: false, countryCode: "CA", vat: null, hasResidenceProof: false }).ok, false);
  assert.equal(decideTax({ isCompany: true, countryCode: "FR", vat: null, hasResidenceProof: false }).ok, false);
  assert.equal(decideTax({ isCompany: true, countryCode: "FR", vat: "DE123456789", hasResidenceProof: false }).ok, false);
  assert.equal(decideTax({ isCompany: false, countryCode: null, vat: null, hasResidenceProof: false }).ok, false);
});

test("montants et note de mensualité", () => {
  assert.equal(htFromTtc(1000, 0.17), 854.7);
  assert.equal(htFromTtc(1000, 0), 1000);
  const n = installmentNote(2, [1000, 1000, 1000], 0.17);
  assert.ok(n.ok);
  assert.ok(n.ok && n.note.startsWith("Acompte n°2 sur le conseil personnalisé App Mastery."));
  assert.ok(n.ok && n.note.endsWith("Solde restant après ce versement : 1 000 € TTC."));
  assert.equal(installmentNote(1, [500, 2500], 0.17).ok, false);
});

test("contrôle du PDF", () => {
  const ok = `SDG STUDIO Facture VEN/2026/00040 Total 1 000,00 € ${MENTION_AUTOLIQUIDATION} SDG STUDIO SARL-S | RCS`;
  assert.deepEqual(checkInvoiceText(ok, { number: "VEN/2026/00040", mention: MENTION_AUTOLIQUIDATION, total: 1000 }), []);
  const bad = (t: string) => checkInvoiceText(t, { number: "VEN/2026/00040", mention: MENTION_AUTOLIQUIDATION, total: 1000 }).length > 0;
  assert.ok(bad(ok.replace("SDG STUDIO SARL-S", "PITAULT MEDIA SARL-S")));
  assert.ok(bad(ok.replace(MENTION_AUTOLIQUIDATION, "")));
  assert.ok(bad(`${ok} ${MENTION_AUTOLIQUIDATION}`));
  assert.ok(bad(`${ok} prestation exonérée`));
  assert.ok(bad(`${ok} formation`));
  assert.ok(bad(ok.replace("1 000,00", "999,00")));
  assert.deepEqual(checkInvoiceText(`${ok} information`, { number: "VEN/2026/00040", mention: MENTION_AUTOLIQUIDATION, total: 1000 }), []);
});

test("classement des virements", () => {
  assert.equal(classifyLine(line({ payment_ref: "To EUR Main" })).kind, "ignore");
  assert.equal(classifyLine(line({ payment_ref: "Auto Top-Up by *9445" })).kind, "ignore");
  assert.equal(classifyLine(line({ payment_ref: "From X Libération du capital social" })).kind, "ignore");
  assert.equal(classifyLine(line({ payment_ref: "Exchanged to EUR Main" })).kind, "handoff");
  assert.equal(classifyLine(line({ payment_ref: "Payment from Payoneer Europe Ltd" })).kind, "handoff");
  assert.equal(classifyLine(line({ payment_ref: "Payment from Skool.com Inc." })).kind, "skool");
  assert.equal(classifyLine(line({ payment_ref: "Payment from Google Ireland Limited" })).kind, "google");
  assert.deepEqual(classifyLine(line({ payment_ref: "Payment from Une Societe VEN/2026/00020" })), { kind: "existing", number: "VEN/2026/00020" });
  assert.equal(classifyLine(line({ payment_ref: "From Prénom N" })).kind, "client");
});

test("rattachement à un élève", () => {
  const a = student({ id: "a", name: "Alice Martinez" });
  const b = student({ id: "b", name: "Bruno Martinez" });
  const c = student({ id: "c", name: "Chloe Dubois", partnerName: "ACME-IT sarl-S" });
  const list = [a, b, c];
  assert.deepEqual(matchStudents(line({ partner_name: "MRS MARTINEZ ALICE ROSE" }), list).map((s) => s.id), ["a"]);
  assert.deepEqual(matchStudents(line({ payment_ref: "Payment from Acme-it Sarl-s App Mastery" }), list).map((s) => s.id), ["c"]);
  assert.equal(matchStudents(line({ partner_name: "Martinez" }), list).length, 2, "deux élèves possibles : Jeremy tranche");
  assert.equal(matchStudents(line({ partner_name: "Quelqu'un D'autre" }), list).length, 0);
});

test("une seule échéance possible, proche de la date et de même montant", () => {
  const s = student({ schedule: [{ position: 1, amount: 1000, due: "2026-10-01", paid: true }, { position: 2, amount: 1000, due: "2026-11-01", paid: false }, { position: 3, amount: 1000, due: "2026-12-01", paid: false }] });
  assert.equal(findScheduleEntry(line({ date: "2026-11-02" }), s, new Set())?.position, 2);
  assert.equal(findScheduleEntry(line({ date: "2026-11-02" }), s, new Set([2])), null, "échéance déjà facturée");
  assert.equal(findScheduleEntry(line({ date: "2026-11-02", amount: 999 }), s, new Set()), null, "mauvais montant");
  assert.equal(findScheduleEntry(line({ date: "2026-11-16" }), s, new Set()), null, "trop loin de toute échéance");
});
