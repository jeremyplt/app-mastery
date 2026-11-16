// L'email de sortie d'une vidéo, pour les leads qui n'ont jamais réservé :
// une scène, la promesse de la vidéo, un bouton, une leçon, puis le cadeau et
// l'appel en P.S. Modèle validé par Jeremy le 16 nov. 2026 (vidéo B).
import { P, SITE, button, esc, image, signature, wrap } from "../emails/layout";

export type VideoEmail = {
  objet: string;
  apercu: string;
  // Accroche et promesse de la vidéo, avant le bouton.
  avantBouton: string[];
  bouton: string;
  // Une leçon de la vidéo, après le bouton.
  apresBouton: string[];
  // Paragraphe sur un élève (preuve), suivi de son tableau de bord. Null : la
  // seule image de l'email est alors la miniature de la vidéo.
  preuve: { eleve: EleveId; texte: string } | null;
  // Phrase qui présente le cadeau, puis le texte du lien. Null sans cadeau.
  cadeau: { phrase: string; lien: string } | null;
  // Le P.S. sans « P.S. » ni lien : le lien « réserver mon appel » est ajouté.
  ps: string;
};

export type RenderContext = {
  videoUrl: string;
  thumbnailUrl: string;
  giftUrl: string | null;
  // Tag Brevo et utm_campaign des liens (« video-b-sortie »).
  tag: string;
};

// Les deux élèves qu'on peut citer dans ces emails. Jeremy (16 nov. 2026) :
// alterner entre Florian et Wassim selon le récit qui colle à la vidéo, ce
// qu'ils ont mis en place et les problèmes qu'ils ont eus. Faits vérifiés
// (/temoignages, podcast de Wassim, script A) : Claude n'en utilise pas d'autres.
export type EleveId = "florian" | "wassim";

export const ELEVES: Record<EleveId, { prenom: string; faits: string[]; montants: string[]; image: string; alt: string; legende: string }> = {
  florian: {
    prenom: "Florian",
    faits: [
      "Florian, 20 ans, a une application de productivité (blocage d'apps, routines, temps d'écran, Pomodoro). On ne donne jamais le nom de son app.",
      "Fin mai 2026, il postait deux à trois carrousels par jour. Ils faisaient 700 à 1 000 vues chacun, et son app faisait deux à cinq téléchargements par jour.",
      "Ses carrousels faisaient des vues mais pas assez de téléchargements. Il est passé à des formats où l'app est la raison d'être de la vidéo, par exemple il se filme en train de réagir, choqué, puis on voit l'app marcher. Mi-juin, il faisait des journées à plus de 100 téléchargements, presque 200.",
      "Dès qu'un format marchait, il en sortait un ou deux par jour, et il le postait aussi sur YouTube Shorts.",
      "Il a mis une automatisation : chaque personne qui commente sa vidéo reçoit directement le lien de l'app.",
      "Son erreur : en Asie, il postait avec un VPN et multipliait les comptes. Début juin, ses vues sont tombées à 10, 11 ou 30 par vidéo, et il a dû recréer des comptes propres et les chauffer avant de repartir.",
      "Il a fait un million de vues sur Instagram en un mois, avec des reels à 100 000 et 200 000 vues.",
      "En sept semaines environ, il est passé de deux à cinq téléchargements par jour à 1 793 $ de revenus sur 28 jours, sans un euro de publicité, en postant depuis son téléphone.",
    ],
    montants: ["1 793"],
    image: `${SITE}/emails/florian-revenuecat-1793-v2.jpg`,
    alt: "Tableau de bord RevenueCat de Florian : 1 793 $ de revenus sur 28 jours",
    legende: "Voilà le tableau de bord de Florian sur 28 jours, sans une seule pub.",
  },
  wassim: {
    prenom: "Wassim",
    faits: [
      "Wassim, 22 ans, a une application de style et de mode avec l'IA. On ne donne jamais le nom de son app. Il est accompagné depuis début août 2026.",
      "Ses premiers carrousels de 12 ou 13 images, avec l'appel à l'action à la fin, faisaient des milliers de vues mais ne faisaient pas télécharger. On a déplacé l'appel à l'action au milieu du carrousel.",
      "Il a refait pour son app des contenus qui marchaient déjà dans sa niche, puis il est passé à des démonstrations de l'app à 100 %, ce qui lui a amené un public vraiment intéressé.",
      "Une étape photo de son onboarding faisait partir 15 % des gens. Avec le nouvel onboarding et le nouveau paywall, 80 % des gens arrivent jusqu'au paywall.",
      "Son vrai problème : son contenu attirait des mineurs. La moitié de ses utilisateurs avaient moins de 17 ans, et seulement 2 % d'entre eux prenaient l'essai, contre dix fois plus chez les 25-34 ans. Il a orienté son contenu vers un public plus âgé, et ses revenus ont décollé.",
      "Sa méthode de contenu : il repère des apps qui explosent, même hors de sa niche, fait adapter leur script à son app par Claude, se filme face caméra pour l'accroche puis filme l'app sur son iPhone, sans montage. 3 à 4 heures par jour, au moins 4 comptes, 3 vidéos par compte et par jour.",
      "Résultat : 7 269 $ en 14 jours, avec une journée à 1 700 $ portée par une vidéo à plus de 700 000 vues, 100 % en organique, sans un euro de publicité, et seul.",
    ],
    montants: ["7 269", "1 700"],
    image: `${SITE}/emails/wassim-revenuecat-7269-v1.jpg`,
    alt: "Tableau de bord RevenueCat de Wassim : 7 269 $ de revenus, 251 abonnements actifs, 232 essais en cours",
    legende: "Voilà le tableau de bord de Wassim, sans une seule pub.",
  },
};

export const GREETING = "{% if contact.FIRSTNAME %}Salut {{ contact.FIRSTNAME }},{% else %}Salut,{% endif %}";

export function withUtm(url: string, tag: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "email");
  u.searchParams.set("utm_medium", "broadcast");
  u.searchParams.set("utm_campaign", tag);
  return u.toString();
}

const link = (href: string, text: string) => `<a href="${href}" style="color:#0060df">${esc(text)}</a>`;
const para = (text: string) => `<p ${P}>${esc(text)}</p>`;

function thumbnail(videoUrl: string, src: string): string {
  return `<p style="margin:0 0 6px"><a href="${videoUrl}"><img src="${src}" alt="Miniature de la vidéo" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:12px" /></a></p>`;
}

export function renderVideoEmail(e: VideoEmail, ctx: RenderContext): string {
  const parts: string[] = [`<p ${P}>${GREETING}</p>`, ...e.avantBouton.map(para)];
  if (!e.preuve) parts.push(thumbnail(ctx.videoUrl, ctx.thumbnailUrl));
  parts.push(button(e.bouton, ctx.videoUrl), ...e.apresBouton.map(para));
  if (e.preuve) {
    const eleve = ELEVES[e.preuve.eleve];
    parts.push(para(e.preuve.texte), image(eleve.image, eleve.alt, eleve.legende));
  }
  if (e.cadeau && ctx.giftUrl) parts.push(`<p ${P}>${esc(e.cadeau.phrase)} : ${link(withUtm(ctx.giftUrl, ctx.tag), e.cadeau.lien)}.</p>`);
  parts.push(signature("À très vite"));
  parts.push(`<p style="margin:26px 0 0;font-size:15px;line-height:1.6;color:#55555c">P.S. ${esc(e.ps)} : ${link(withUtm(`${SITE}/appel`, ctx.tag), "réserver mon appel")}.</p>`);
  return wrap(parts.join("\n"));
}

// Email écrit à l'avance et validé par Jeremy, utilisé tel quel quand la vidéo
// du script correspondant sort. Clé : le slug du script dans /admin/scripts.
export const PREWRITTEN: Record<string, { tag: string; email: VideoEmail }> = {
  "analyse-1633-videos": {
    tag: "video-b-sortie",
    email: {
      objet: "63 millions de vues",
      apercu: "Ce que font les vidéos qui font vraiment télécharger des apps.",
      avantBouton: [
        "Je suis tombé sur une vidéo TikTok de dix secondes qui présente une app de bien-être, et elle a fait 63 millions de vues. Je me suis demandé ce que font vraiment les vidéos qui font télécharger des apps, et ce que toutes les autres ne font pas.",
        "Alors avec mon équipe, on a passé au crible environ 12 500 vidéos TikTok et Instagram, et on en a gardé 1 633 qui mettent vraiment une app en avant. J'en ai tiré 32 leçons, et je te les donne toutes dans la vidéo que je viens de publier : comment filmer ton app pour qu'elle ait l'air recommandée et pas vendue, les accroches qui ont fait des millions de vues, et les formats que tu peux refaire dès demain avec ton app.",
      ],
      bouton: "Regarder la vidéo",
      apresBouton: [
        "Il y a une leçon qui m'a surpris plus que les autres. Le même script, tourné mot pour mot par quatre créateurs différents, a fait 428 500 vues chez l'un et 1 701 chez un autre. Le contenu ne fait pas tout : ceux qui gagnent sont ceux qui postent le même format assez de fois pour qu'une vidéo finisse par décoller.",
      ],
      preuve: {
        eleve: "florian",
        texte:
          "Florian, un des élèves que j'accompagne, l'a bien compris. Il a posté ses vidéos depuis son téléphone, sans dépenser un euro en publicité, et son application de productivité est passée de 0 à 1 793 $ en 28 jours.",
      },
      cadeau: {
        phrase: "Si tu veux garder les 32 leçons sous la main, avec le lien vers une vraie vidéo d'exemple pour chacune, je les ai mises dans une checklist gratuite",
        lien: "récupérer la checklist des 32 leçons",
      },
      ps: "Si tu veux qu'on cherche ensemble les vidéos qui feront vendre ton app, tu peux réserver un appel avec mon associé Nolan ou avec moi. On regarde ton projet et le temps que tu peux y consacrer, et on te dit franchement si l'accompagnement est fait pour toi",
    },
  },
};

// Contrôles avant de créer le brouillon : les règles de Jeremy qu'un modèle
// peut oublier. Renvoie la liste des problèmes (vide si tout va bien).
const FORBIDDEN: [RegExp, string][] = [
  [/[—–]/, "tiret long"],
  [/dress ?code/i, "nom de l'app de Wassim"],
  [/\bformation\b/i, "« formation »"],
  [/blueprint|\bcopy\b|\bvivante?s?\b|transversal|reverse trial|sans coder/i, "mot banni"],
  [/https?:|www\.|<|>|\{|\}/i, "lien ou balise dans le texte"],
  [/^p\.?\s?s\.?\s/i, "« P.S. » en double"],
];

// Montants en dollars ou en euros d'un texte, chiffres groupés (« 7 269 »).
export function amounts(text: string): string[] {
  return [...text.matchAll(/(\d{1,3}(?:[\s\u00a0\u202f]\d{3})*|\d+)\s?(?:\$|€|dollars?\b|euros?\b)/g)].map((m) => m[1].replace(/[\s\u00a0\u202f]/g, " "));
}

// L'email validé de la vidéo B fait environ 330 mots, salutation comprise.
export const MAX_WORDS = 340;

export function checkEmail(e: VideoEmail): string[] {
  const problems: string[] = [];
  // « 40 000 $ » compte pour un mot : nombre en un bloc, symboles ignorés.
  const words = e.objet
    .replace(/(\d)[\s  ](?=\d{3}\b)/g, "$1")
    .split(/\s+/)
    .filter((t) => /[\p{L}\d]/u.test(t)).length;
  if (words < 2 || words > 5) problems.push(`objet de ${words} mots (2 à 4 attendus)`);
  if (!e.apercu.trim()) problems.push("texte d'aperçu vide");
  if (e.avantBouton.length < 1 || e.avantBouton.length > 3) problems.push("1 à 3 paragraphes attendus avant le bouton");
  if (e.apresBouton.length > 2) problems.push("2 paragraphes au plus après le bouton");
  if (!e.bouton.trim() || e.bouton.length > 40) problems.push("texte du bouton vide ou trop long");
  if (!e.ps.trim()) problems.push("P.S. vide");
  // Les élèves ne sont cités que dans le paragraphe de preuve, avec leurs vrais
  // montants (ceux de leur tableau de bord) et aucun autre.
  const outside = [e.objet, e.apercu, e.bouton, ...e.avantBouton, ...e.apresBouton, e.cadeau?.phrase ?? "", e.cadeau?.lien ?? "", e.ps];
  if (outside.some((t) => /florian|wassim/i.test(t))) problems.push("élève cité hors du paragraphe de preuve");
  if (e.preuve) {
    const eleve = ELEVES[e.preuve.eleve];
    if (!eleve) problems.push("élève inconnu");
    else {
      if (!e.preuve.texte.includes(eleve.prenom)) problems.push(`le paragraphe de preuve doit nommer ${eleve.prenom}`);
      const found = amounts(e.preuve.texte);
      if (!found.some((m) => eleve.montants.includes(m))) problems.push(`le paragraphe sur ${eleve.prenom} doit reprendre un de ses vrais montants (${eleve.montants.map((m) => `${m} $`).join(" ou ")})`);
      const wrong = found.filter((m) => !eleve.montants.includes(m));
      if (wrong.length) problems.push(`montants inconnus pour ${eleve.prenom} : ${wrong.join(", ")}`);
      if (/florian|wassim/i.test(e.preuve.texte.replaceAll(eleve.prenom, ""))) problems.push("un seul élève par email");
    }
  }
  const texts = [...outside, e.preuve?.texte ?? ""];
  for (const [re, label] of FORBIDDEN) {
    if (label === "« P.S. » en double" ? re.test(e.ps.trim()) : texts.some((t) => re.test(t))) problems.push(label);
  }
  if (texts.some((t) => t.length > 1_200)) problems.push("paragraphe trop long");
  const total = texts.join(" ").split(/\s+/).filter((t) => /[\p{L}\d]/u.test(t)).length;
  if (total > MAX_WORDS) problems.push(`email de ${total} mots (${MAX_WORDS} au plus)`);
  return problems;
}

// Retrouve le script de /admin/scripts qui correspond au titre publié (titre
// principal ou un des titres de rechange), d'après les mots en commun.
function words(s: string): Set<string> {
  const flat = s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/(\d)[\s  ](?=\d{3}\b)/g, "$1")
    .replace(/[^a-z0-9]+/g, " ");
  return new Set(flat.split(" ").filter((w) => w.length > 2 || /\d/.test(w)));
}

export function titleScore(published: string, candidate: string): number {
  const a = words(published);
  const b = words(candidate);
  if (!b.size) return 0;
  let common = 0;
  for (const w of b) if (a.has(w)) common++;
  return common / b.size;
}

export function matchScript<T extends { slug: string; title: string; altTitles: { title: string }[] }>(title: string, scripts: T[], threshold = 0.6): T | null {
  let best: { s: T; score: number } | null = null;
  for (const s of scripts) {
    const score = Math.max(titleScore(title, s.title), ...s.altTitles.map((t) => titleScore(title, t.title)));
    if (score >= threshold && (!best || score > best.score)) best = { s, score };
  }
  return best?.s ?? null;
}
