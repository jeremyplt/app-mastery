import assert from "node:assert/strict";
import { test } from "node:test";
import { countryZone, matchesType, parseExtract, proofDecision, proofVerdict, type ProofExtract } from "../residence-rules";

test("zone du pays, saisi à la main dans le contrat", () => {
  for (const c of ["France", "france ", "FRANCE", "Belgique", "Pays-Bas", "République tchèque", "Luxembourg", "Germany", "FR"]) assert.equal(countryZone(c), "eu", c);
  for (const c of ["Canada", "canada", "Québec", "Suisse", "États-Unis", "Etats Unis", "USA", "Royaume-Uni", "Maroc", "Émirats arabes unis", "Dubaï", "Côte d'Ivoire"]) assert.equal(countryZone(c), "non_eu", c);
  // Faute de frappe, outre-mer, vide : on ne devine pas.
  for (const c of ["Frnace", "La Réunion", "Guadeloupe", "Monaco", "", null, undefined]) assert.equal(countryZone(c), "unknown", String(c));
});

test("décision à la signature : seulement un particulier hors UE", () => {
  assert.equal(proofDecision({ Statut: "Particulier", Pays: "Canada" }), "send");
  assert.equal(proofDecision({ Statut: "particulier", Pays: "États-Unis" }), "send");
  // Société, même hors UE : pas de justificatif.
  assert.equal(proofDecision({ Statut: "Société", Pays: "Canada" }), "skip");
  assert.equal(proofDecision({ Statut: "Societe", Pays: "Suisse" }), "skip");
  // Client de l'UE.
  assert.equal(proofDecision({ Statut: "Particulier", Pays: "France" }), "skip");
  assert.equal(proofDecision({ Pays: "France" }), "skip");
  // Impossible de trancher : aucun mail, Jeremy est prévenu.
  assert.equal(proofDecision({ Statut: "Particulier", Pays: "Frnace" }), "check");
  assert.equal(proofDecision({ Statut: "Particulier" }), "check");
  assert.equal(proofDecision({ Pays: "Canada" }), "check");
  assert.equal(proofDecision({}), "check");
  assert.equal(proofDecision(null), "check");
});

test("le contenu du fichier doit correspondre au type annoncé", () => {
  const bytes = (s: string) => new TextEncoder().encode(s);
  assert.ok(matchesType(bytes("%PDF-1.7"), "application/pdf"));
  assert.ok(!matchesType(bytes("ceci n est pas"), "application/pdf"));
  assert.ok(matchesType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), "image/jpeg"));
  assert.ok(!matchesType(bytes("%PDF-1.7"), "image/jpeg"));
  assert.ok(matchesType(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), "image/png"));
  assert.ok(matchesType(bytes("....ftypheic"), "image/heic"));
  assert.ok(!matchesType(bytes("%PDF-1.7"), "text/html"));
});

const base: ProofExtract = {
  readable: true,
  document_kind: "energie_eau",
  accepted_type: true,
  looks_altered: false,
  suspicious_content: false,
  name_on_document: "Marie Tremblay",
  name_matches: true,
  address_on_document: "123 rue Saint-Denis, Montréal",
  address_matches: true,
  document_date: "2026-10-12",
  lease_end_date: null,
  note: "Tout correspond.",
};
const review = (over: Partial<ProofExtract>, known = true, today = "2026-11-05") => proofVerdict({ ...base, ...over }, today, known);

test("avis de l'IA : valide seulement si tout est vérifié", () => {
  assert.equal(review({}).verdict, "valid");
  assert.equal(review({ name_matches: false }).verdict, "invalid");
  assert.equal(review({ address_matches: false }).verdict, "invalid");
  assert.equal(review({ accepted_type: false, document_kind: "autre" }).verdict, "invalid");
  assert.equal(review({ looks_altered: true }).verdict, "invalid");
  assert.equal(review({ suspicious_content: true }).verdict, "invalid");
  assert.equal(review({ name_matches: null }).verdict, "check");
  assert.equal(review({ address_matches: null }).verdict, "check");
  assert.equal(review({ readable: false }).verdict, "check");
  // Sans adresse de contrat, jamais « valide », même si l'IA dit que ça correspond.
  assert.equal(review({ address_matches: true }, false).verdict, "check");
});

test("moins de 3 mois : calculé par le code, pas par l'IA", () => {
  assert.equal(review({ document_date: "2026-08-05" }).checks.recent.status, "ok", "pile 3 mois");
  assert.equal(review({ document_date: "2026-08-04" }).checks.recent.status, "ko", "3 mois et 1 jour");
  assert.equal(review({ document_date: "2026-11-05" }).checks.recent.status, "ok");
  assert.equal(review({ document_date: "2026-11-20" }).checks.recent.status, "ko", "date dans le futur");
  assert.equal(review({ document_date: null }).checks.recent.status, "unknown");
  assert.equal(review({ document_date: "2026-13-45" }).checks.recent.status, "unknown", "date impossible");
  assert.equal(review({ document_date: "le 12 octobre" }).checks.recent.status, "unknown");
  // Fin de mois : le 30 novembre moins 3 mois ne saute pas au mois suivant.
  assert.equal(review({ document_date: "2026-08-31" }, true, "2026-11-30").checks.recent.status, "ok");
  assert.equal(review({ document_date: "2026-08-29" }, true, "2026-11-30").checks.recent.status, "ko");
});

test("bail : encore en cours, peu importe son ancienneté", () => {
  assert.equal(review({ document_kind: "bail", document_date: "2020-01-01", lease_end_date: "2027-06-30" }).checks.recent.status, "ok");
  assert.equal(review({ document_kind: "bail", lease_end_date: "2026-06-30" }).checks.recent.status, "ko");
  assert.equal(review({ document_kind: "bail", lease_end_date: null }).checks.recent.status, "unknown");
});

test("la réponse de l'IA est contrôlée", () => {
  assert.throws(() => parseExtract({ ...base, readable: "oui" }));
  assert.throws(() => parseExtract({ ...base, document_kind: "valide" }));
  assert.throws(() => parseExtract(null));
  assert.equal(parseExtract({ ...base, note: "Ok — parfait" }).note, "Ok , parfait");
  assert.equal(parseExtract({ ...base, note: "x".repeat(900) }).note.length, 400);
});
