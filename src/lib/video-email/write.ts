// Claude écrit l'email de sortie d'une vidéo qui n'a pas d'email prérédigé.
// Il tourne sans aucun outil, dans un dossier vide, et répond dans un format
// imposé : le code ajoute les liens, l'image, la salutation et la signature.
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { VideoScript } from "@/app/admin/scripts/types";
import { runClaude } from "../whatsapp/ai";
import { FLORIAN_FACTS, PREWRITTEN, checkEmail, type VideoEmail } from "./content";
import type { Upload } from "./youtube";

const MODEL = PREWRITTEN["analyse-1633-videos"].email;

function modelAsText(e: VideoEmail): string {
  return [
    `Objet : ${e.objet}`,
    `Aperçu : ${e.apercu}`,
    "",
    "Salut Prénom,",
    ...e.avantBouton,
    `[Bouton : ${e.bouton}]`,
    ...e.apresBouton,
    e.florian,
    "[Image : tableau de bord de Florian]",
    `${e.cadeau?.phrase} : [lien : ${e.cadeau?.lien}].`,
    "À très vite,\nJeremy",
    `P.S. ${e.ps} : [lien : réserver mon appel].`,
  ].join("\n\n");
}

export const WRITE_SYSTEM = `Tu écris, au nom de Jeremy Pitault, l'email qui annonce sa nouvelle vidéo YouTube à ses leads. Jeremy développe des applications mobiles (son app Shinobi Japanese rapporte plus de 30 000 $ par mois) et accompagne, avec son associé Nolan, des gens qui créent, publient et font connaître une app mobile avec l'IA. Les destinataires ont téléchargé un de ses guides gratuits mais n'ont jamais réservé d'appel. Ce ne sont pas des développeurs : ils veulent utiliser l'IA pour créer une app de niche et la faire connaître avec du contenu viral.

Le but de l'email : leur donner envie de regarder la vidéo tout de suite, puis de récupérer le cadeau de la vidéo, et rappeler en P.S. qu'ils peuvent réserver un appel.

Structure, dans cet ordre :
1. avant_bouton : 1 ou 2 paragraphes. Le premier est l'accroche : un fait concret et frappant tiré de la vidéo, raconté en une ou deux vraies phrases à la première personne. Le second donne la promesse de la vidéo en une ou deux phrases, avec deux ou trois choses précises qu'ils vont apprendre, pas tout le sommaire.
2. bouton : le texte du bouton vers la vidéo, « Regarder la vidéo » sauf raison particulière.
3. apres_bouton : 1 paragraphe avec une leçon ou un chiffre surprenant de la vidéo, qui donne envie d'en voir plus.
4. florian : un paragraphe sur Florian, seulement s'il illustre naturellement la leçon (sinon une chaîne vide). Faits autorisés, et seulement ceux-là : ${FLORIAN_FACTS} Écris « 1 793 $ » tel quel.
5. cadeau_phrase et cadeau_lien : s'il y a un cadeau, une phrase qui le présente (le code ajoute « : » puis le lien), et le texte du lien, par exemple « récupérer la checklist des 32 leçons ». S'il n'y a pas de cadeau, deux chaînes vides.
6. ps : le P.S. qui propose un appel avec Nolan ou avec Jeremy, sans écrire « P.S. » (le code l'ajoute, puis « : réserver mon appel »).

Règles de Jeremy, sans exception :
- Objet de 2 à 4 mots, mystérieux, qui donne envie d'ouvrir, comme « 63 millions de vues ». Aperçu : une phrase courte qui complète l'objet.
- De vraies phrases complètes, comme on parle. Jamais de suite de fragments (« Une vidéo de dix secondes, une fille dans son lit, une app à l'écran »), jamais de description de scène en morceaux, jamais de tournure question-réponse (« Le secret ? C'est… »).
- Tutoiement, français correct avec tous les accents, simple et sans jargon. Mots interdits : blueprint, vivant, transversal, copy, reverse trial, sans coder, formation.
- Jamais de tiret long ni de tiret moyen. Pas d'emoji, pas de lien, pas de balise, pas d'accolade : le code ajoute les liens.
- Aucun prix de l'accompagnement. Les résultats se disent en argent.
- Ne parle jamais de Wassim ni d'un autre élève que Florian.
- N'invente rien : chaque fait et chaque chiffre vient du titre, de la description ou du script fournis. Dans le doute, reste général plutôt que d'inventer.
- Court : 200 à 280 mots en tout, jamais plus de 320. Ne répète pas la même tournure d'une phrase à l'autre (« je te montre », « tu verras »).

Voici l'email validé par Jeremy pour une autre vidéo. Garde ce ton, cette longueur et ce rythme, sans en reprendre les faits :

${modelAsText(MODEL)}`;

export const WRITE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["objet", "apercu", "avant_bouton", "bouton", "apres_bouton", "florian", "cadeau_phrase", "cadeau_lien", "ps"],
  properties: {
    objet: { type: "string" },
    apercu: { type: "string" },
    avant_bouton: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 3 },
    bouton: { type: "string" },
    apres_bouton: { type: "array", items: { type: "string" }, maxItems: 2 },
    florian: { type: "string" },
    cadeau_phrase: { type: "string" },
    cadeau_lien: { type: "string" },
    ps: { type: "string" },
  },
};

export function scriptText(s: VideoScript, max = 24_000): string {
  const lines = [`Titre prévu : ${s.title}`, `Cadeau : ${s.gift.name}`, "Ce que la vidéo doit tenir :", ...s.plan.map((p) => `- ${p}`), "", "Ce que Jeremy dit dans la vidéo :"];
  for (const section of s.sections) {
    lines.push(`## ${section.title}`);
    for (const b of section.beats) if (b.say) lines.push(b.say);
  }
  const text = lines.join("\n");
  return text.length > max ? `${text.slice(0, max)}\n[…]` : text;
}

export function buildWritePrompt(v: Upload, gift: { line: string } | null, script: VideoScript | null, problems: string[] = []): string {
  return [
    `Titre de la vidéo publiée : ${v.title}`,
    "",
    "Description YouTube :",
    v.description.replace(/https?:\/\/\S+/g, "[lien]").slice(0, 5_000),
    "",
    gift ? `Cadeau de la vidéo (le lien est ajouté par le code) : ${gift.line}` : "Cette vidéo n'a pas de cadeau : laisse cadeau_phrase et cadeau_lien vides.",
    "",
    script ? scriptText(script) : "Pas de script écrit pour cette vidéo : appuie-toi seulement sur le titre et la description.",
    ...(problems.length ? ["", `Ta première version avait ces problèmes, corrige-les : ${problems.join(" ; ")}.`] : []),
    "",
    "Écris l'email de sortie de cette vidéo.",
  ].join("\n");
}

type Raw = { objet: string; apercu: string; avant_bouton: string[]; bouton: string; apres_bouton: string[]; florian: string; cadeau_phrase: string; cadeau_lien: string; ps: string };

export function parseWritten(raw: unknown, hasGift: boolean): VideoEmail {
  const r = raw as Raw;
  const clean = (s: unknown) => String(s ?? "").trim();
  const ps = clean(r.ps).replace(/\s*[:.]\s*$/, "");
  const phrase = clean(r.cadeau_phrase).replace(/\s*[:.]\s*$/, "");
  return {
    objet: clean(r.objet),
    apercu: clean(r.apercu),
    avantBouton: (r.avant_bouton ?? []).map(clean).filter(Boolean),
    bouton: clean(r.bouton) || "Regarder la vidéo",
    apresBouton: (r.apres_bouton ?? []).map(clean).filter(Boolean),
    florian: clean(r.florian),
    cadeau: hasGift && phrase && clean(r.cadeau_lien) ? { phrase, lien: clean(r.cadeau_lien).replace(/[.:]$/, "") } : null,
    ps,
  };
}

// Deux essais au plus : le second reçoit les problèmes relevés par checkEmail.
export async function writeVideoEmail(v: Upload, gift: { line: string } | null, script: VideoScript | null, opts: { localLogin?: boolean } = {}): Promise<VideoEmail> {
  const empty = await mkdtemp(join(tmpdir(), "video-email-"));
  try {
    let problems: string[] = [];
    for (let attempt = 0; attempt < 2; attempt++) {
      const raw = await runClaude({ system: WRITE_SYSTEM, schema: WRITE_SCHEMA, prompt: buildWritePrompt(v, gift, script, problems), cwd: empty, timeoutMs: 300_000, localLogin: opts.localLogin });
      const email = parseWritten(raw, Boolean(gift));
      problems = checkEmail(email);
      if (!problems.length) return email;
    }
    throw new Error(`Email refusé par les contrôles : ${problems.join(" ; ")}`);
  } finally {
    await rm(empty, { recursive: true, force: true });
  }
}
