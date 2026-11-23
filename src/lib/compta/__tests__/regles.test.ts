import assert from "node:assert/strict";
import { test } from "node:test";
import { classer, memeFournisseur, nomDepot, rapprocher, type DepenseOuverte, type Lu, type Transaction } from "../regles";

const NOS = new Set(["main", "tva"]);
const tx = (o: Partial<Transaction> & { legs: Transaction["legs"] }): Transaction => ({ id: "t1", type: "card_payment", state: "completed", created_at: "2026-11-20T15:35:21Z", completed_at: "2026-11-21T02:29:04Z", ...o });

test("une dépense par carte est à justifier, à la date où elle est passée", () => {
  const d = classer(tx({ merchant: { name: "Calendly" }, legs: [{ amount: -40, currency: "EUR", account_id: "main", description: "Calendly" }] }), NOS);
  assert.equal(d?.categorie, "fournisseur");
  assert.equal(d?.statut, "manquant");
  assert.equal(d?.date, "2026-11-21");
  assert.equal(d?.montant, 40);
});

test("le montant dans la devise du marchand est gardé", () => {
  const d = classer(tx({ merchant: { name: "Railway" }, legs: [{ amount: -4.45, currency: "EUR", bill_amount: -5, bill_currency: "USD", account_id: "main" }] }), NOS);
  assert.equal(d?.montant_facture, 5);
  assert.equal(d?.devise_facture, "USD");
});

test("entrées d'argent, virements entre nos comptes, paiements annulés : pas de pièce", () => {
  assert.equal(classer(tx({ type: "topup", legs: [{ amount: 1000, currency: "EUR", account_id: "main" }] }), NOS), null);
  assert.equal(classer(tx({ type: "transfer", legs: [{ amount: -92.8, currency: "EUR", account_id: "main", description: "To EUR TVA" }, { amount: 92.8, currency: "EUR", account_id: "tva" }] }), NOS), null);
  assert.equal(classer(tx({ type: "transfer", legs: [{ amount: -388.2, currency: "EUR", account_id: "main", description: "To EUR Impôts" }] }), NOS), null);
  assert.equal(classer(tx({ state: "reverted", legs: [{ amount: -0.87, currency: "EUR", account_id: "main" }] }), NOS), null);
});

test("salaire et administration : pas de facture à chercher", () => {
  const s = classer(tx({ type: "transfer", legs: [{ amount: -3611.8, currency: "EUR", account_id: "main", description: "To Jeremy Pitault" }] }), NOS);
  assert.equal(s?.categorie, "salaire");
  assert.equal(s?.statut, "sans_justificatif");
  const a = classer(tx({ type: "transfer", legs: [{ amount: -562.4, currency: "EUR", account_id: "main", description: "To ACD-RECETTE LUXEMBOURG" }] }), NOS);
  assert.equal(a?.categorie, "administration");
  const f = classer(tx({ type: "transfer", reference: "Pitault Media Coworking 2026100784", legs: [{ amount: -232.83, currency: "EUR", account_id: "main", description: "To Colors SARL" }] }), NOS);
  assert.equal(f?.categorie, "fournisseur");
  assert.equal(f?.marchand, "Colors SARL");
});

test("les frais Revolut sont à justifier par le reçu Revolut", () => {
  const d = classer(tx({ type: "charge", legs: [{ amount: -35, currency: "EUR", account_id: "main", description: "Company Pro plan fee" }] }), NOS);
  assert.equal(d?.categorie, "frais_bancaires");
  assert.equal(d?.marchand, "Revolut");
});

test("même fournisseur malgré les noms de banque abrégés", () => {
  assert.ok(memeFournisseur("Openai *chatgpt Subscr", { fournisseur: "OpenAI, LLC", mail_de: null, nom_fichier: null }));
  assert.ok(memeFournisseur("Facebk *01tr", { fournisseur: "Meta Platforms Ireland", mail_de: null, nom_fichier: null }));
  assert.ok(memeFournisseur("Brevo", { fournisseur: "Sendinblue", mail_de: null, nom_fichier: "Invoice-SIB-6021295.pdf" }));
  assert.ok(memeFournisseur("Elevenlabs", { fournisseur: null, mail_de: "invoice+statements@elevenlabs.io", nom_fichier: null }));
  assert.ok(!memeFournisseur("Calendly", { fournisseur: "Hetzner Online GmbH", mail_de: null, nom_fichier: null }));
});

const dep = (o: Partial<DepenseOuverte> = {}): DepenseOuverte => ({ id: "d1", date: "2026-11-21", montant: 40, devise: "EUR", montant_facture: null, devise_facture: null, marchand: "Calendly", ...o });
const doc = (o: Partial<Lu> = {}): Lu => ({ id: "f1", nature: "facture", fournisseur: "Calendly LLC", date_doc: "2026-11-20", total: 40, devise: "EUR", mail_de: null, nom_fichier: null, ...o });

test("même montant et même fournisseur : rapprochement sûr", () => {
  const [p] = rapprocher([dep()], [doc()]);
  assert.equal(p.documentId, "f1");
  assert.equal(p.sur, true);
});

test("montant différent : rien", () => {
  assert.equal(rapprocher([dep()], [doc({ total: 46.8 })]).length, 0);
});

test("facture en dollars d'une dépense prélevée en euros", () => {
  const [p] = rapprocher([dep({ marchand: "Railway", montant: 4.45, montant_facture: 5, devise_facture: "USD" })], [doc({ fournisseur: "Railway Corporation", total: 5, devise: "USD", date_doc: "2026-11-05", nature: "recu" })]);
  assert.equal(p?.sur, true);
});

test("même montant, autre nom, même jour : à valider par Jeremy", () => {
  const [p] = rapprocher([dep({ marchand: "Brickny Europe GmbH", montant: 119.35 })], [doc({ fournisseur: "Kushitei of Tokyo", total: 119.35, date_doc: "2026-11-21", nature: "recu" })]);
  assert.equal(p?.sur, false);
});

test("ticket de restaurant avec pourboire", () => {
  const sur = rapprocher([dep({ marchand: "Augustiner Am Heumarkt", montant: 62.98, date: "2026-10-18", restaurant: true })], [doc({ fournisseur: "Augustiner am Heumarkt", total: 57.25, date_doc: "2026-10-17", nature: "recu" })]);
  assert.equal(sur[0]?.sur, true);
  const aValider = rapprocher([dep({ marchand: "Brickny Europe GmbH", montant: 119.35, date: "2026-10-19", restaurant: true })], [doc({ fournisseur: "Kushitei of Tokyo", total: 108.5, date_doc: "2026-10-18", nature: "recu" })]);
  assert.equal(aValider[0]?.sur, false);
  // Pas de pourboire hors restaurant, ni au-delà de 25 %.
  assert.equal(rapprocher([dep({ montant: 62.98 })], [doc({ total: 57.25, nature: "recu" })]).length, 0);
  assert.equal(rapprocher([dep({ marchand: "Bestial", montant: 97, restaurant: true })], [doc({ fournisseur: "Bestial", total: 76.8, nature: "recu", date_doc: "2026-11-21" })]).length, 0);
});

test("une pièce par dépense et une dépense par pièce, la plus proche d'abord", () => {
  const ps = rapprocher([dep({ id: "a", date: "2026-09-03", marchand: "Facebook", montant: 7 }), dep({ id: "b", date: "2026-09-03", marchand: "Facebook", montant: 7 })], [doc({ id: "x", fournisseur: "Meta", total: 7, date_doc: "2026-09-03", nature: "recu" }), doc({ id: "y", fournisseur: "Meta", total: 7, date_doc: "2026-09-03", nature: "recu" }), doc({ id: "z", fournisseur: "Meta", total: 7, date_doc: "2026-09-02", nature: "recu" })]);
  assert.equal(ps.length, 2);
  assert.deepEqual(new Set(ps.map((p) => p.documentId)), new Set(["x", "y"]));
});

test("le reçu joint dans Revolut gagne toujours", () => {
  const [p] = rapprocher([dep({ id: "d1" })], [doc({ id: "mail" }), doc({ id: "revolut", nature: "recu", depense_imposee: "d1" })]);
  assert.equal(p.documentId, "revolut");
});

test("une pièce refusée par Jeremy n'est plus proposée", () => {
  assert.equal(rapprocher([dep({ refuses: ["f1"] })], [doc()]).length, 0);
});

test("relevé bancaire : jamais une pièce ; bon de commande rangé par Jeremy : oui s'il correspond", () => {
  assert.equal(rapprocher([dep({ marchand: "Revolut", montant: 10 })], [doc({ nature: "autre", fournisseur: "Revolut Business", total: 10, deposee_par_jeremy: true, nom_fichier: "transaction-statement.pdf" })]).length, 0);
  const [p] = rapprocher([dep({ marchand: "LuxTrust", montant: 160, date: "2026-09-08" })], [doc({ nature: "autre", fournisseur: "LuxTrust", total: 160, date_doc: "2026-09-07", deposee_par_jeremy: true })]);
  assert.equal(p?.sur, true);
  assert.equal(rapprocher([dep({ marchand: "LuxTrust", montant: 160, date: "2026-09-08" })], [doc({ nature: "autre", fournisseur: "LuxTrust", total: 160, date_doc: "2026-09-07" })]).length, 0);
});

test("date illisible : seulement une pièce de Jeremy rangée dans le bon mois", () => {
  const p = rapprocher([dep({ marchand: "Cloche Dor", montant: 27.3, date: "2026-10-07" })], [doc({ fournisseur: "Pokawa", total: 27.3, date_doc: null, nature: "recu", deposee_par_jeremy: true, mois_dossier: "2026-10" })]);
  assert.equal(p[0]?.sur, false);
  assert.equal(rapprocher([dep({ marchand: "Cloche Dor", montant: 27.3, date: "2026-10-07" })], [doc({ total: 27.3, date_doc: null, deposee_par_jeremy: true, mois_dossier: "2026-09" })]).length, 0);
});

test("nom du fichier déposé dans Odoo", () => {
  assert.equal(nomDepot({ date: "2026-11-21", marchand: "Calendly", montant: 40, devise: "EUR" }, "application/pdf"), "2026-11-21 Calendly 40,00 EUR.pdf");
  assert.equal(nomDepot({ date: "2026-10-18", marchand: "Augustiner/Heumarkt", montant: 62.98, devise: "EUR" }, "image/jpeg"), "2026-10-18 Augustiner Heumarkt 62,98 EUR.jpg");
});
