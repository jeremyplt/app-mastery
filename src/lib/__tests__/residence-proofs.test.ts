import assert from "node:assert/strict";
import { test } from "node:test";
import { countryZone, matchesType, proofDecision } from "../residence-rules";

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
