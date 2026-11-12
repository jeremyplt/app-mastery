import assert from "node:assert/strict";
import { test } from "node:test";

// questionnaire.ts importe le client Supabase, qui exige ces variables au chargement.
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://exemple.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "test";

test("email de bienvenue : le lien kick-off pré-remplit le nom et l'email de l'élève", async () => {
  const { kickoffUrl } = await import("../questionnaire");
  const url = new URL(kickoffUrl("Marie Dupont", "marie+app@exemple.fr"));
  assert.equal(url.origin + url.pathname, "https://calendly.com/jeremypltpro/kick-off-app-mastery");
  assert.equal(url.searchParams.get("name"), "Marie Dupont");
  assert.equal(url.searchParams.get("email"), "marie+app@exemple.fr");
});

test("email de bienvenue : questionnaire puis réservation du kick-off, dans cet ordre", async () => {
  const { questionnaireEmail } = await import("../questionnaire");
  const built = questionnaireEmail("Marie", "https://www.jeremypitault.com/questionnaire/abc", "https://calendly.com/jeremypltpro/kick-off-app-mastery?name=Marie");
  assert.equal(built.subject, "Avant de démarrer");
  const q = built.html.indexOf('href="https://www.jeremypitault.com/questionnaire/abc"');
  const k = built.html.indexOf('href="https://calendly.com/jeremypltpro/kick-off-app-mastery?name=Marie"');
  assert.ok(q > 0 && k > q, "le bouton questionnaire vient avant le bouton kick-off");
  assert.match(built.html, /Il dure 30 minutes, le mardi ou le jeudi après-midi/);
  assert.doesNotMatch(built.html, /—/, "pas de tiret cadratin");
});
