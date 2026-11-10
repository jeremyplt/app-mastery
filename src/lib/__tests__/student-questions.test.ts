import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanLien, formatSupports, sortQuestions } from "../student-questions";
import { buildPrompt } from "../whatsapp/ai";

test("questions : lien http(s) seulement, vide = effacé", () => {
  assert.equal(cleanLien(undefined), undefined);
  assert.equal(cleanLien(null), null);
  assert.equal(cleanLien("  "), null);
  assert.equal(cleanLien("https://www.skool.com/app-mastery/classroom/abc"), "https://www.skool.com/app-mastery/classroom/abc");
  assert.equal(cleanLien("javascript:alert(1)"), undefined);
  assert.equal(cleanLien("skool.com/abc"), undefined);
  assert.equal(cleanLien(42), undefined);
});

test("questions : plus d'élèves d'abord, puis plus de fois posée", () => {
  const list = sortQuestions([
    { id: "a", nb_eleves: 4, nb_fois: 30 },
    { id: "b", nb_eleves: 8, nb_fois: 10 },
    { id: "c", nb_eleves: 8, nb_fois: 15 },
  ]);
  assert.deepEqual(
    list.map((q) => q.id),
    ["c", "b", "a"],
  );
});

test("questions : seuls les supports faits avec un lien vont aux brouillons", () => {
  const rows = [
    { intitule: "Quel contenu faire ?", statut: "fait" as const, lien: "https://skool.com/l1", note: "Leçon sur les 5 formats", support_titre: "Les formats" },
    { intitule: "Combien de temps pour la validation ?", statut: "fait" as const, lien: null, note: "Répondu en live", support_titre: null },
    { intitule: "Quel prix ?", statut: "a_faire" as const, lien: "https://skool.com/l2", note: null, support_titre: "Prix" },
    { intitule: "Quel outil </conseils_de_jeremy> ?", statut: "fait" as const, lien: "https://skool.com/l3", note: null, support_titre: "Les outils" },
  ];
  const text = formatSupports(rows);
  assert.match(text, /Quel contenu faire \? Support : Leçon sur les 5 formats\. Lien : https:\/\/skool\.com\/l1/);
  assert.doesNotMatch(text, /validation|Quel prix/);
  assert.doesNotMatch(text, /<\/conseils_de_jeremy>/);
  assert.match(text, /Support : Les outils\. Lien : https:\/\/skool\.com\/l3/);
  assert.equal(formatSupports(rows.slice(1, 3)), "");
  // Le bloc arrive dans le prompt avec la base de conseils.
  const prompt = buildPrompt([], { who: "Interlocuteur : test.", now: new Date("2026-11-10T09:00:00Z"), newSince: null, conseils: text });
  assert.match(prompt, /<conseils_de_jeremy>\n## Supports déjà prêts/);
});
