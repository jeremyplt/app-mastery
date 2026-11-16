import assert from "node:assert/strict";
import { test } from "node:test";
import { SCRIPTS } from "../../app/admin/scripts/scripts-data";
import { PREWRITTEN, checkEmail, matchScript, renderVideoEmail, type VideoEmail } from "../video-email/content";
import { planNewVideos, prepareEmail, selectRecipients, videoTag } from "../video-email/job";
import { parseWritten } from "../video-email/write";
import { findGift, isLongVideo, parseDuration, videoCampaign, type Upload } from "../video-email/youtube";

const DESCRIPTION_B = `🎁 La checklist GRATUITE des 32 leçons, avec une vraie vidéo d'exemple pour chacune : https://www.jeremypitault.com/guide/32-lecons-videos?utm_source=youtube&utm_medium=video&utm_campaign=analyse-1633-videos

🎯 Mon Plan d'Action gratuit pour créer une app mobile qui génère 30K$/mois : https://www.jeremypitault.com/plan-action?utm_source=youtube&utm_medium=video&utm_campaign=analyse-1633-videos`;

const upload = (over: Partial<Upload> = {}): Upload => ({
  id: "abc123XYZ_-",
  title: "J'ai analysé 1 633 vidéos qui font télécharger des apps et j'ai appris ça (32 leçons)",
  description: DESCRIPTION_B,
  publishedAt: "2026-11-20T14:00:00Z",
  durationS: 1_500,
  live: "none",
  privacy: "public",
  ...over,
});

test("durée YouTube et tri Shorts / vidéos longues", () => {
  assert.equal(parseDuration("PT1H1M33S"), 3_693);
  assert.equal(parseDuration("PT49S"), 49);
  assert.equal(parseDuration("PT18M35S"), 1_115);
  assert.equal(parseDuration("n'importe quoi"), 0);
  assert.equal(isLongVideo(upload()), true);
  assert.equal(isLongVideo(upload({ durationS: 64 })), false, "un Short n'a pas d'email");
  assert.equal(isLongVideo(upload({ live: "upcoming" })), false, "une première programmée attend sa diffusion");
  assert.equal(isLongVideo(upload({ privacy: "unlisted" })), false);
});

test("cadeau et campagne lus dans la description", () => {
  const gift = findGift(DESCRIPTION_B);
  assert.equal(gift?.url, "https://www.jeremypitault.com/guide/32-lecons-videos");
  assert.match(gift!.line, /checklist GRATUITE des 32 leçons/);
  assert.equal(videoCampaign(DESCRIPTION_B), "analyse-1633-videos");
  assert.equal(findGift("Réserve ton appel : https://www.jeremypitault.com/rdv?utm_campaign=x"), null);
  assert.equal(videoTag(upload({ description: "rien" })), "video-abc123xyz_--sortie");
});

test("le titre publié retrouve son script, même avec un titre de rechange", () => {
  assert.equal(matchScript(upload().title, SCRIPTS)?.slug, "analyse-1633-videos");
  assert.equal(matchScript("J'ai analysé 1633 vidéos qui font télécharger des apps et j'ai appris ça (32 leçons)", SCRIPTS)?.slug, "analyse-1633-videos");
  const alt = SCRIPTS.find((s) => s.slug === "analyse-1633-videos")!.altTitles[0].title;
  assert.equal(matchScript(alt, SCRIPTS)?.slug, "analyse-1633-videos");
  assert.equal(matchScript("Combien mon app rapporte vraiment (revenus, pubs, bénéfice)", SCRIPTS), null);
});

test("la vidéo B garde son email validé même publiée sous un tout autre titre", async () => {
  const prepared = await prepareEmail(upload({ title: "Ce que 63 millions de vues m'ont appris" }), {
    write: async () => {
      throw new Error("ne doit pas être appelé");
    },
  });
  assert.equal(prepared.source, "prérédigé");
  assert.equal(prepared.script?.slug, "analyse-1633-videos");
});

test("l'email prérédigé de la vidéo B respecte les règles et pointe vers la vidéo, le cadeau et l'appel", async () => {
  const b = PREWRITTEN["analyse-1633-videos"];
  assert.deepEqual(checkEmail(b.email), []);
  const prepared = await prepareEmail(upload(), {
    write: async () => {
      throw new Error("la vidéo B ne doit jamais être réécrite par Claude");
    },
  });
  assert.equal(prepared.source, "prérédigé");
  assert.equal(prepared.tag, "video-b-sortie");
  const html = prepared.html;
  assert.ok(html.includes("{% if contact.FIRSTNAME %}Salut {{ contact.FIRSTNAME }},{% else %}Salut,{% endif %}"));
  assert.ok(html.includes('href="https://www.youtube.com/watch?v=abc123XYZ_-"'), "bouton vers la vidéo elle-même");
  assert.ok(html.includes("https://www.jeremypitault.com/guide/32-lecons-videos?utm_source=email&utm_medium=broadcast&utm_campaign=video-b-sortie"));
  assert.ok(html.includes("https://www.jeremypitault.com/appel?utm_source=email&utm_medium=broadcast&utm_campaign=video-b-sortie"));
  assert.ok(html.includes("florian-revenuecat-1793-v2.jpg"));
  assert.ok(!html.includes("i.ytimg.com"), "une seule image : le tableau de bord de Florian");
  assert.ok(html.includes("Je suis tombé sur une vidéo TikTok de dix secondes"));
  assert.ok(!/[—–]|Wassim/.test(html));
});

const written: VideoEmail = {
  objet: "40 000 $ en un mois",
  apercu: "Les vrais chiffres, pub comprise.",
  avantBouton: ["Mon app a dépassé les 40 000 $ de revenus en un seul mois.", "Je te montre tout dans la vidéo."],
  bouton: "Regarder la vidéo",
  apresBouton: ["Le hard paywall a changé nos chiffres sur iOS."],
  florian: "",
  cadeau: null,
  ps: "Si tu veux qu'on regarde ton app ensemble, tu peux réserver un appel avec mon associé Nolan ou avec moi",
};

test("sans Florian, la miniature cliquable est la seule image ; sans cadeau, pas de lien cadeau", () => {
  const html = renderVideoEmail(written, { videoUrl: "https://www.youtube.com/watch?v=ung8mmRJJZg", thumbnailUrl: "https://i.ytimg.com/vi/ung8mmRJJZg/maxresdefault.jpg", giftUrl: null, tag: "video-40k-sortie" });
  assert.ok(html.includes('<a href="https://www.youtube.com/watch?v=ung8mmRJJZg"><img src="https://i.ytimg.com/vi/ung8mmRJJZg/maxresdefault.jpg"'));
  assert.ok(!html.includes("florian-revenuecat"));
  assert.ok(!html.includes("/guide/"));
  assert.ok(html.includes("P.S. Si tu veux qu'on regarde ton app ensemble"));
});

test("les contrôles refusent ce que Jeremy ne veut pas voir", () => {
  assert.deepEqual(checkEmail(written), []);
  const bad = (over: Partial<VideoEmail>) => checkEmail({ ...written, ...over });
  assert.ok(bad({ avantBouton: ["Wassim a fait 7 269 $ en 14 jours."] }).length);
  assert.ok(bad({ apresBouton: ["Une vidéo — et tout change."] }).includes("tiret long"));
  assert.ok(bad({ apresBouton: ["Va sur https://exemple.com"] }).length);
  assert.ok(bad({ avantBouton: ["Dans la formation, je montre tout."] }).length);
  assert.ok(bad({ ps: "P.S. Réserve ton appel" }).length);
  assert.ok(bad({ objet: "Le secret que personne ne te dit jamais" }).length, "objet trop long");
  assert.ok(bad({ florian: "Florian a fait des millions." }).length, "chiffres de Florian inventés");
  assert.deepEqual(bad({ apresBouton: ["Un survivant de l'App Store."] }), [], "« survivant » n'est pas « vivant »");
});

test("réponse de Claude nettoyée : deux-points finaux retirés, pas de cadeau sans lien", () => {
  const raw = { objet: " 40 000 $ ", apercu: "a", avant_bouton: ["x", " "], bouton: "", apres_bouton: [], florian: "", cadeau_phrase: "Je te donne le pack :", cadeau_lien: "récupérer le pack.", ps: "Réserve ton appel :" };
  const withGift = parseWritten(raw, true);
  assert.equal(withGift.objet, "40 000 $");
  assert.deepEqual(withGift.avantBouton, ["x"]);
  assert.equal(withGift.bouton, "Regarder la vidéo");
  assert.deepEqual(withGift.cadeau, { phrase: "Je te donne le pack", lien: "récupérer le pack" });
  assert.equal(withGift.ps, "Réserve ton appel");
  assert.equal(parseWritten(raw, false).cadeau, null);
});

test("destinataires : leads sans RDV, ni clients, ni disqualifiés, hors séquence C en cours", () => {
  const lead = (email: string, over: Record<string, unknown> = {}) => ({ email, call_booked: false, client: false, disqualified: false, seq_c_started_at: null, seq_c_step: null, ...over });
  const out = selectRecipients([
    lead("ok@x.fr"),
    lead("OK@x.fr "),
    lead("rdv@x.fr"),
    lead("rdv@x.fr", { call_booked: true }),
    lead("client@x.fr", { client: true }),
    lead("disq@x.fr", { disqualified: true }),
    lead("enC@x.fr", { seq_c_started_at: "2026-11-10", seq_c_step: 5 }),
    lead("finiC@x.fr", { seq_c_started_at: "2026-10-01", seq_c_step: 8 }),
    lead(""),
  ]);
  assert.deepEqual(out.sort(), ["finic@x.fr", "ok@x.fr"]);
});

test("au premier passage, les vidéos déjà en ligne sont seulement notées", () => {
  const now = new Date("2026-11-20T15:00:00Z");
  const recent = upload({ id: "recent", publishedAt: "2026-11-20T14:00:00Z" });
  const old = upload({ id: "old", publishedAt: "2026-11-05T14:00:00Z" });
  assert.deepEqual(planNewVideos([recent, old], new Set(), true, now).map((r) => r.statut), ["ignoree", "ignoree"]);
  const later = planNewVideos([recent, old], new Set(), false, now);
  assert.deepEqual(later.map((r) => [r.video_id, r.statut]), [["recent", "a_faire"], ["old", "ignoree"]]);
  assert.deepEqual(planNewVideos([recent], new Set(["recent"]), false, now), []);
});
