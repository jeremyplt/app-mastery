import assert from "node:assert/strict";
import { test } from "node:test";

// pipeline.ts importe le client Supabase, qui exige ces variables au chargement.
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://exemple.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "test";

const NOW = new Date("2026-11-16T08:00:00Z"); // un lundi

function daysAgo(n: number): string {
  return new Date(NOW.getTime() - n * 86_400_000).toISOString();
}

// n leads créés il y a `day` jours, dont `booked` avec un RDV posé le même jour.
function leads(n: number, day: number, booked = 0) {
  return Array.from({ length: n }, (_, i) => ({ created_at: daysAgo(day), call_booked_at: i < booked ? daysAgo(day) : null }));
}

test("pipeline : compare la semaine aux 4 semaines d'avant et signale une semaine creuse", async () => {
  const { pipelineStats, pipelineLines } = await import("../pipeline");
  // Semaine en cours : 11 leads et 2 RDV. Avant : 35, 30, 40, 35 leads et 3 RDV par semaine.
  const rows = [...leads(11, 2, 2), ...leads(35, 10, 3), ...leads(30, 17, 3), ...leads(40, 24, 3), ...leads(35, 31, 3)];
  const s = pipelineStats(rows, NOW);
  assert.equal(s.leads, 11);
  assert.equal(s.leadsAvg, 35);
  assert.equal(s.rdv, 2);
  assert.equal(s.rdvAvg, 3);
  assert.equal(s.lowLeads, true);
  assert.equal(s.lowRdv, false);
  const lines = pipelineLines(s);
  assert.match(lines[0], /^11 nouveaux leads sur les 7 derniers jours, pour 35 par semaine/);
  assert.match(lines[1], /^2 RDV de vente posés/);
  assert.ok(lines.some((l) => l.includes("Semaine creuse")));
  assert.ok(lines.every((l) => !l.includes("—")));
});

test("pipeline : une semaine normale ne déclenche pas d'alerte, les vieux leads sont ignorés", async () => {
  const { pipelineStats, pipelineLines } = await import("../pipeline");
  const rows = [...leads(30, 3, 3), ...leads(28, 12, 3), ...leads(32, 20, 2), ...leads(30, 26, 3), ...leads(30, 33, 2), ...leads(200, 60, 20)];
  const s = pipelineStats(rows, NOW);
  assert.equal(s.leads, 30);
  assert.equal(s.leadsAvg, 30);
  assert.equal(s.lowLeads, false);
  assert.equal(s.lowRdv, false);
  assert.equal(pipelineLines(s).length, 2);
});

test("pipeline : un RDV posé cette semaine pour un lead plus ancien compte dans la semaine", async () => {
  const { pipelineStats } = await import("../pipeline");
  const s = pipelineStats([{ created_at: daysAgo(20), call_booked_at: daysAgo(1) }], NOW);
  assert.equal(s.leads, 0);
  assert.equal(s.rdv, 1);
  assert.equal(s.leadsAvg, 0.3);
  // Trop peu de volume pour parler de semaine creuse.
  assert.equal(s.lowLeads, false);
});

test("pipeline : un seul lead s'écrit au singulier, et la moyenne garde une virgule", async () => {
  const { pipelineLines } = await import("../pipeline");
  const lines = pipelineLines({ leads: 1, leadsAvg: 2.5, rdv: 1, rdvAvg: 0.8, lowLeads: false, lowRdv: false });
  assert.match(lines[0], /^1 nouveau lead sur les 7 derniers jours, pour 2,5 par semaine/);
  assert.match(lines[1], /^1 RDV de vente posé sur/);
});
