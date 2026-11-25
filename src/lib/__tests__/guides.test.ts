import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { CRM_GUIDE_LABELS, CRM_GUIDE_SLUGS, getGuide, guides } from "../guides";
import { guide27Regles, guide32LeconsVideos, guide100ContenusViraux, guideNichesEnnuyeuses, promptContenuViral } from "../emails/transactional";

const PUBLIC = join(__dirname, "..", "..", "..", "public");

test("guide 32 leçons : suivi dans le CRM, donc il entre dans la séquence C", () => {
  const guide = getGuide("32-lecons-videos");
  assert.ok(guide, "le guide doit exister");
  assert.equal(guide.crm, true);
  assert.ok(CRM_GUIDE_SLUGS.includes("32-lecons-videos"));
  assert.equal(CRM_GUIDE_LABELS["32-lecons-videos"], "Checklist 32 leçons vidéos");
  assert.equal(guide.brevoListId, 23);
});

test("chaque guide suivi dans le CRM a son PDF et sa couverture dans public/", () => {
  for (const guide of Object.values(guides).filter((g) => g.crm)) {
    if (!guide.isExternalLink) {
      assert.ok(existsSync(join(PUBLIC, guide.downloadUrl)), `PDF manquant pour ${guide.slug}`);
    }
    if (guide.previewImage) {
      assert.ok(existsSync(join(PUBLIC, guide.previewImage)), `couverture manquante pour ${guide.slug}`);
    }
  }
});

test("les emails de livraison pointent vers le même PDF que la page du guide", () => {
  const cases = [
    { slug: "27-regles", email: guide27Regles("Marie") },
    { slug: "prompt-contenu-viral", email: promptContenuViral("Marie") },
    { slug: "32-lecons-videos", email: guide32LeconsVideos("Marie") },
    { slug: "100-contenus-viraux", email: guide100ContenusViraux("Marie") },
    { slug: "niches-ennuyeuses", email: guideNichesEnnuyeuses("Marie") },
  ];
  for (const { slug, email } of cases) {
    const guide = getGuide(slug)!;
    assert.ok(email.html.includes(`https://www.jeremypitault.com${guide.downloadUrl}`), `lien PDF faux pour ${slug}`);
    assert.equal(email.tag, slug, "le tag Brevo doit être le slug, pour les statistiques");
  }
});

test("email des 32 leçons : prénom, appel tracé, aucun prix, aucun tiret cadratin", () => {
  const email = guide32LeconsVideos("Marie");
  assert.ok(email.html.includes("Marie"));
  assert.ok(email.html.includes("utm_campaign=32-lecons-videos"));
  assert.ok(!email.html.includes("—"));
  assert.ok(!/formation/i.test(email.html));
  assert.ok(!/€/.test(email.html), "jamais de prix dans les emails du funnel");
});

test("guide 100 contenus viraux : slug de la description YouTube, CRM, email propre", () => {
  const guide = getGuide("100-contenus-viraux");
  assert.ok(guide, "le guide doit exister");
  assert.equal(guide.crm, true);
  assert.ok(CRM_GUIDE_SLUGS.includes("100-contenus-viraux"));
  const email = guide100ContenusViraux("Marie");
  assert.ok(email.html.includes("Marie"));
  assert.ok(email.html.includes("utm_campaign=100-contenus-viraux"));
  assert.ok(!email.html.includes("—"));
  assert.ok(!/formation/i.test(email.html));
  assert.ok(!/€/.test(email.html), "jamais de prix dans les emails du funnel");
});

test("guide 50 niches ennuyeuses : slug de la description YouTube, CRM, email propre", () => {
  const guide = getGuide("niches-ennuyeuses");
  assert.ok(guide, "le guide doit exister (lien de la description de la vidéo D)");
  assert.equal(guide.crm, true);
  assert.ok(CRM_GUIDE_SLUGS.includes("niches-ennuyeuses"));
  assert.equal(guide.brevoListId, 23);
  const email = guideNichesEnnuyeuses("Marie");
  assert.ok(email.html.includes("Marie"));
  assert.ok(email.html.includes("utm_campaign=niches-ennuyeuses"));
  assert.ok(!email.html.includes("—"));
  assert.ok(!/formation/i.test(email.html));
  assert.ok(!/€/.test(email.html), "jamais de prix dans les emails du funnel");
});
