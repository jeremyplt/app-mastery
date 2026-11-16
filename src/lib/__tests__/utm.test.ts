import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanUtm, firstTouch } from "../utm";
import { attribute, type ContactRow } from "../crm-attribution";

test("UTM reçues : nettoyées, ignorées sans utm_source", () => {
  assert.deepEqual(cleanUtm({ source: " youtube ", medium: "organic", campaign: "1633-videos" }), {
    utm_source: "youtube",
    utm_medium: "organic",
    utm_campaign: "1633-videos",
  });
  assert.deepEqual(cleanUtm({ source: "youtube", medium: "", campaign: undefined }), {
    utm_source: "youtube",
    utm_medium: null,
    utm_campaign: null,
  });
  assert.equal(cleanUtm({ campaign: "1633-videos" }), null);
  assert.equal(cleanUtm({ source: "   " }), null);
  assert.equal(cleanUtm({ source: 42 }), null);
  assert.equal(cleanUtm({ source: "x".repeat(500) })?.utm_source.length, 120);
});

test("premier contact : la plus ancienne fiche qui a des UTM", () => {
  const rows = [
    { created_at: "2026-11-10T10:00:00Z", utm_source: "youtube", utm_medium: "organic", utm_campaign: "video-b" },
    { created_at: "2026-10-01T10:00:00Z", utm_source: null, utm_medium: null, utm_campaign: null },
    { created_at: "2026-10-20T10:00:00Z", utm_source: "youtube", utm_medium: "organic", utm_campaign: "video-a" },
  ];
  assert.equal(firstTouch(rows)?.utm_campaign, "video-a");
  assert.equal(firstTouch([rows[1]]), null);
  assert.equal(firstTouch([]), null);
});

const lead = (email: string, created_at: string, campaign: string | null, call_booked = false): ContactRow => ({
  email,
  created_at,
  utm_source: campaign ? "youtube" : null,
  utm_medium: campaign ? "organic" : null,
  utm_campaign: campaign,
  call_booked,
});

test("par vidéo : une personne comptée une fois, sur sa première vidéo, avec ses euros", () => {
  const contacts = [
    lead("a@x.fr", "2026-10-20T10:00:00Z", "video-a"),
    lead("A@x.fr", "2026-11-10T10:00:00Z", "video-b", true), // 2e inscription : reste sur video-a
    lead("b@x.fr", "2026-11-12T10:00:00Z", "video-b"),
    lead("c@x.fr", "2026-11-13T10:00:00Z", null),
  ];
  const revenue = [{ email: "a@x.fr", created_at: "2026-11-14T10:00:00Z", signed: 3000, cashed: 1000 }];
  const rows = attribute(contacts, revenue, null);

  const a = rows.find((r) => r.campaign === "video-a")!;
  assert.deepEqual(
    { leads: a.leads, rdv: a.rdv, students: a.students, signed: a.signed, cashed: a.cashed },
    { leads: 1, rdv: 1, students: 1, signed: 3000, cashed: 1000 },
  );
  const b = rows.find((r) => r.campaign === "video-b")!;
  assert.deepEqual({ leads: b.leads, rdv: b.rdv, students: b.students }, { leads: 1, rdv: 0, students: 0 });
  assert.equal(rows.find((r) => r.source === null)?.leads, 1);
  // Trié par euros signés.
  assert.equal(rows[0].campaign, "video-a");
});

test("par vidéo : période sur la date du premier contact, élève sans fiche dans « sans UTM »", () => {
  const contacts = [lead("a@x.fr", "2026-09-01T10:00:00Z", "video-a"), lead("b@x.fr", "2026-11-12T10:00:00Z", "video-b")];
  const revenue = [
    { email: "a@x.fr", created_at: "2026-11-14T10:00:00Z", signed: 3000, cashed: 3000 },
    { email: "d@x.fr", created_at: "2026-11-15T10:00:00Z", signed: 3000, cashed: 0 },
  ];
  const rows = attribute(contacts, revenue, "2026-11-01T00:00:00Z");
  assert.equal(rows.find((r) => r.campaign === "video-a"), undefined);
  assert.equal(rows.find((r) => r.campaign === "video-b")?.leads, 1);
  const none = rows.find((r) => r.source === null)!;
  assert.deepEqual({ leads: none.leads, students: none.students, signed: none.signed }, { leads: 1, students: 1, signed: 3000 });
});
