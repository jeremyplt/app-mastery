import assert from "node:assert/strict";
import { test } from "node:test";
import { bankLine, formatVues, mentionsAny, parseScrapeCreators, selectCandidates, tiktokId } from "../contenus/search";
import { sectionTitle, stepsAt } from "../contenus/pipeline";

const item = (id: string, user: string, desc: string, views: number, likes: number) => ({ aweme_info: { aweme_id: id, desc, author: { unique_id: user }, statistics: { play_count: views, digg_count: likes } } });

test("contenus : lecture des résultats TikTok", () => {
  const list = parseScrapeCreators({ search_item_list: [item("1", "anna", "POV:  ton annonce  Vinted", 40730, 900), { aweme_info: { desc: "sans id" } }] });
  assert.deepEqual(list, [{ plateforme: "TikTok", id: "1", url: "https://www.tiktok.com/@anna/video/1", compte: "@anna", legende: "POV: ton annonce Vinted", vues: 40730, likes: 900 }]);
  assert.deepEqual(parseScrapeCreators(null), []);
  assert.equal(tiktokId("https://www.tiktok.com/@a.b/video/7547388643988622614?x=1"), "7547388643988622614");
});

test("contenus : tri, seuils, doublons et apps d'élèves exclues", () => {
  const all = parseScrapeCreators({
    search_item_list: [
      item("1", "a", "petite vidéo", 900, 50), // trop peu vue
      item("2", "b", "grosse vidéo", 2_000_000, 50_000),
      item("2", "b", "doublon", 2_000_000, 50_000),
      item("3", "c", "app Vintapp géniale", 500_000, 9_000), // app d'un élève
      item("4", "d", "peu de vues mais likée", 5_000, 1_200),
      item("5", "e", "moyenne", 60_000, 300),
    ],
  });
  const kept = selectCandidates(all, { exclude: ["Vintapp", "Ka"], max: 10 });
  assert.deepEqual(
    kept.map((c) => c.id),
    ["2", "5", "4"],
  );
  assert.equal(selectCandidates(all, { exclude: [], max: 1 }).length, 1);
  assert.equal(mentionsAny("Découvre VINTAPP !", ["Vintapp"]), true);
  assert.equal(mentionsAny("vintappeal", ["Vintapp"]), false);
});

test("contenus : ligne de la GIGA BANQUE, titre de section, étapes", () => {
  assert.equal(formatVues(2_000_000), "2 M");
  assert.equal(formatVues(1_250_000), "1,3 M");
  assert.equal(formatVues(40_730), "41 k");
  const line = bankLine({ plateforme: "TikTok", id: "2", url: "https://www.tiktok.com/@b/video/2", compte: "@b", legende: "", vues: 2_000_000, likes: 1, app: "PreLoved AI", description: "annonce rédigée à partir d'une photo" });
  assert.deepEqual(line, { texte: "2 M vues · @b · PreLoved AI : annonce rédigée à partir d'une photo", url: "https://www.tiktok.com/@b/video/2" });
  assert.equal(sectionTitle("apps pour vendre sur Vinted."), "Apps pour vendre sur Vinted");
  assert.deepEqual(
    stepsAt("verification", "en_cours", "5 sur 30").map((s) => `${s.cle}:${s.statut}`),
    ["recherche:fait", "verification:en_cours", "drive:a_venir"],
  );
  assert.equal(stepsAt("fini").every((s) => s.statut === "fait"), true);
});
