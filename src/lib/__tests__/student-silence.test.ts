import assert from "node:assert/strict";
import { test } from "node:test";
import { lastExchange, silentDays } from "../student-silence";

const now = new Date("2026-11-10T09:00:00Z");

test("sans nouvelles : à partir de 7 jours sans message de l'élève, pendant l'accompagnement", () => {
  const thread = (inbound: string | null) => [{ last_inbound_at: inbound, last_outbound_at: "2026-11-09T10:00:00Z" }];
  assert.equal(silentDays({ start_date: "2026-10-01", whatsapp_threads: thread("2026-11-02T20:00:00Z") }, now), 8);
  assert.equal(silentDays({ start_date: "2026-10-01", whatsapp_threads: thread("2026-11-03T20:00:00Z") }, now), 7);
  // Six jours : rien à signaler, même si Jeremy a écrit depuis.
  assert.equal(silentDays({ start_date: "2026-10-01", whatsapp_threads: thread("2026-11-04T20:00:00Z") }, now), null);
  // Fil pas relié, aucun message reçu, élève archivé : rien.
  assert.equal(silentDays({ start_date: "2026-10-01", whatsapp_threads: [] }, now), null);
  assert.equal(silentDays({ start_date: "2026-10-01", whatsapp_threads: thread(null) }, now), null);
  assert.equal(silentDays({ start_date: "2026-10-01", archived: true, whatsapp_threads: thread("2026-09-01T10:00:00Z") }, now), null);
});

test("sans nouvelles : pas avant le début ni après la fin (début + 3 mois)", () => {
  const old = [{ last_inbound_at: "2026-09-01T10:00:00Z" }];
  assert.equal(silentDays({ start_date: "2026-08-10", whatsapp_threads: old }, now), 70);
  assert.equal(silentDays({ start_date: "2026-08-09", whatsapp_threads: old }, now), null);
  assert.equal(silentDays({ start_date: "2026-12-09", whatsapp_threads: old }, now), null);
  assert.equal(silentDays({ start_date: null, whatsapp_threads: old }, now), null);
});

test("dernier échange : le plus récent entre la fiche et WhatsApp", () => {
  assert.equal(lastExchange("2026-10-16T15:46:40Z", [{ last_inbound_at: "2026-11-09T20:50:59Z", last_outbound_at: "2026-11-04T21:42:07Z" }]), "2026-11-09T20:50:59Z");
  assert.equal(lastExchange("2026-11-10T08:00:00Z", [{ last_inbound_at: "2026-11-09T20:50:59Z" }]), "2026-11-10T08:00:00Z");
  assert.equal(lastExchange(null, null), null);
});
