import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanHalf, frNumber, halfFilled, halfPatch, journalStats, previousEntry, previousLine, statsLines, type JournalEntry } from "../appels/journal";

function entry(over: Partial<JournalEntry>): JournalEntry {
  return {
    id: "x",
    event_key: null,
    student_id: "s1",
    call_at: "2026-11-12T16:00:00.000Z",
    label: null,
    apprehension: null,
    inquietude: null,
    prevision: null,
    avant_at: null,
    deroulement: null,
    duree_min: null,
    parole: null,
    crainte: null,
    pourquoi: null,
    apres_at: null,
    ...over,
  };
}

test("ressentis : champs nettoyés, invalides ou vides => null", () => {
  assert.deepEqual(cleanHalf("avant", { apprehension: 7, inquietude: "  Pas sûr de pouvoir l'aider ", prevision: "2" }), {
    apprehension: 7,
    inquietude: "Pas sûr de pouvoir l'aider",
    prevision: 2,
  });
  assert.deepEqual(cleanHalf("avant", { apprehension: 11, inquietude: "   ", prevision: 0 }), { apprehension: null, inquietude: null, prevision: null });
  assert.deepEqual(cleanHalf("apres", { deroulement: 5, duree_min: "75", parole: "moi", crainte: "en_partie", pourquoi: "Il était cool" }), {
    deroulement: 5,
    duree_min: 75,
    parole: "moi",
    crainte: "en_partie",
    pourquoi: "Il était cool",
  });
  assert.deepEqual(cleanHalf("apres", { deroulement: 6, duree_min: "", parole: "lui", crainte: "peut-être", pourquoi: 3 }), {
    deroulement: null,
    duree_min: null,
    parole: null,
    crainte: null,
    pourquoi: null,
  });
  // 0 est une appréhension valable, pas un champ vide.
  assert.equal(halfFilled("avant", cleanHalf("avant", { apprehension: 0 })), true);
  assert.equal(halfFilled("apres", cleanHalf("apres", {})), false);
});

test("ressentis : l'heure de remplissage est gardée à la correction, effacée si on vide", () => {
  const now = new Date("2026-11-12T15:50:00Z");
  const first = halfPatch("avant", { apprehension: 8 }, null, now);
  assert.equal(first.avant_at, "2026-11-12T15:50:00.000Z");
  const later = halfPatch("avant", { apprehension: 6 }, { avant_at: "2026-11-12T15:50:00.000Z" }, new Date("2026-11-12T18:00:00Z"));
  assert.equal(later.avant_at, "2026-11-12T15:50:00.000Z");
  assert.equal(later.apprehension, 6);
  const emptied = halfPatch("avant", {}, { avant_at: "2026-11-12T15:50:00.000Z" }, now);
  assert.equal(emptied.avant_at, null);
  // L'après n'a pas d'heure tant qu'il est vide.
  assert.equal(halfPatch("apres", { pourquoi: "" }, null, now).apres_at, null);
  assert.equal("avant_at" in halfPatch("apres", { pourquoi: "ok" }, null, now), false);
});

test("ressentis : bilan, prévision et réalité comparées sur les appels notés avant et après", () => {
  const list = [
    entry({ apprehension: 8, prevision: 2, deroulement: 5, crainte: "non", parole: "equilibre", duree_min: 60 }),
    entry({ apprehension: 6, prevision: 3, deroulement: 4, crainte: "en_partie", parole: "moi", duree_min: 75 }),
    entry({ apprehension: 4, prevision: 4, deroulement: 4, crainte: "non" }),
    // Après seulement : compte pour la crainte mais pas pour l'écart.
    entry({ deroulement: 2, crainte: "oui" }),
    // Rien de noté.
    entry({}),
  ];
  const s = journalStats(list);
  assert.equal(s.total, 5);
  assert.equal(s.apprehension.avg, 6);
  assert.equal(s.apprehension.n, 3);
  assert.equal(s.ecart.n, 3);
  assert.equal(s.ecart.prevision, 3);
  assert.equal(frNumber(s.ecart.deroulement as number), "4,3");
  assert.deepEqual([s.ecart.mieux, s.ecart.pareil, s.ecart.moins], [2, 1, 0]);
  assert.deepEqual(s.crainte, { oui: 1, en_partie: 1, non: 2 });
  assert.equal(s.duree.avg, 67.5);
  assert.deepEqual(s.parole, { moi: 1, equilibre: 1, eleve: 0 });

  const lines = statsLines(s);
  assert.deepEqual(lines, [
    "Appréhension moyenne avant l'appel : 6/10 (3 appels).",
    "Tu prévoyais en moyenne 3/5, ça s'est passé 4,3/5 (3 appels notés avant et après : mieux que prévu 2 fois, comme prévu 1 fois).",
    "Ta crainte s'est réalisée : oui 1, en partie 1, non 2.",
    "Durée réelle moyenne : 68 min (2 appels).",
    "Qui a le plus parlé : toi 1, équilibré 1, l'élève 0.",
  ]);
  for (const l of lines) assert.doesNotMatch(l, /—/, "pas de tiret cadratin");
});

test("ressentis : bilan vide tant que rien n'est noté", () => {
  assert.deepEqual(statsLines(journalStats([])), []);
  // Que du texte (les deux ressentis de départ) : pas de chiffres inventés.
  assert.deepEqual(statsLines(journalStats([entry({ inquietude: "De l'appréhension", pourquoi: "Agréable au final" })])), []);
});

test("ressentis : la carte rappelle le dernier appel du même élève, pas l'appel lui-même", () => {
  const list = [
    entry({ id: "a", call_at: "2026-10-29T14:00:00Z", prevision: 2, deroulement: 5, crainte: "non" }),
    entry({ id: "b", call_at: "2026-11-12T16:00:00Z", event_key: "cal:kevin", prevision: 3 }),
    entry({ id: "c", student_id: "s2", call_at: "2026-11-10T14:00:00Z", deroulement: 1 }),
  ];
  assert.equal(previousEntry(list, "s1", "2026-11-12T16:00:00Z", "cal:kevin")?.id, "a");
  assert.equal(previousEntry(list, "s1", "2026-11-19T14:00:00Z", "cal:suivant")?.id, "b");
  assert.equal(previousEntry(list, "s1", "2026-10-01T14:00:00Z"), null);
  assert.equal(previousLine(list[0]), "Dernier appel (29 octobre) : tu prévoyais 2/5, ça s'est passé 5/5, crainte réalisée : non.");
  assert.equal(previousLine(entry({ call_at: "2026-11-12T16:00:00Z", crainte: "en_partie" })), "Dernier appel (12 novembre) : crainte réalisée : en partie.");
  assert.equal(previousLine(entry({ pourquoi: "Agréable" })), null);
});
