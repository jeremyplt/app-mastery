// Séquence A : les emails envoyés après l'optin conférence, tant qu'aucun
// rendez-vous n'est pris. Textes validés par Jeremy (voir l'artefact
// "Séquences email App Mastery"). Un email de Jeremy, un seul bouton.
//
// - 1 : J0 + 3 h, trois versions selon le palier de visionnage
//       (v1 jamais lancée, v2 arrêt avant 18:30, v3 arrivé au bouton)
// - 2 à 8 : J1 à J7, à 9 h (heure de Paris)
//
// L'envoi et le calendrier sont dans src/lib/sequence-a.ts.

import { P, SITE, button, esc, footnote, image, imagePair, signature, utm, wrap } from "@/lib/emails/layout";
import type { BuiltEmail } from "@/lib/emails/transactional";

export type SequenceAStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type SequenceAVariant = "v1" | "v2" | "v3";

export type SequenceAContext = {
  firstName: string;
  email: string;
  // Palier de visionnage atteint (secondes), envoyé par la page live.
  watchSeconds: number;
};

// Le bouton se débloque à 18:30 dans la conférence.
export const CTA_SECONDS = 18 * 60 + 30;

// Vidéo YouTube "Découvre mon application", déjà utilisée sur la page de
// confirmation d'appel.
const APP_TOUR_VIDEO = "https://www.youtube.com/watch?v=--Q8sMT656Y";

const FOOT = "Tu reçois cet email parce que tu t'es inscrit à la conférence. Dès que tu réserves ton appel, ces emails s'arrêtent.";

export function variantFor(watchSeconds: number): SequenceAVariant {
  if (watchSeconds <= 0) return "v1";
  if (watchSeconds < CTA_SECONDS) return "v2";
  return "v3";
}

export function sequenceATag(step: SequenceAStep, variant?: SequenceAVariant): string {
  return step === 1 ? `seq-a-1-${variant ?? "v1"}` : `seq-a-${step}`;
}

// Lien de réservation, pré-rempli : le prospect a déjà tout donné à l'optin.
function bookingUrl(ctx: SequenceAContext, campaign: string): string {
  const u = new URL(`${SITE}/appel/reserver`);
  if (ctx.firstName) u.searchParams.set("firstName", ctx.firstName);
  if (ctx.email) u.searchParams.set("email", ctx.email);
  return utm(u.toString(), campaign);
}

function subjectWithName(first: string, withName: string, without: string): string {
  return first ? `${first}, ${withName}` : without;
}

export function buildSequenceAEmail(step: SequenceAStep, ctx: SequenceAContext): BuiltEmail {
  const first = (ctx.firstName || "").trim();
  const prenom = esc(first);
  const salut = prenom ? `Salut ${prenom},` : "Salut,";
  const variant = variantFor(ctx.watchSeconds);
  const tag = sequenceATag(step, variant);

  if (step === 1) {
    if (variant === "v1") {
      const url = utm(`${SITE}/conference/live`, tag);
      const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Tu t'es inscrit à la conférence il y a quelques heures et tu ne l'as pas encore lancée. Je ne t'en veux pas, on s'inscrit souvent à des choses qu'on regarde plus tard, et plus tard n'arrive jamais.</p>
<p ${P}>Alors je vais te dire ce qu'il y a dans les trois premières minutes, pour que tu décides en connaissance de cause. Sur les 28 derniers jours, mon application m'a rapporté 21 084 euros. Je l'ai créée depuis ma chambre, sans savoir coder, et je t'explique la méthode que les grosses applications utilisent et que l'IA rend accessible à tout le monde aujourd'hui.</p>
<p ${P}>Ce n'est pas une vidéo de motivation. C'est la raison pour laquelle 93 % des applications ne rapportent jamais rien, et les trois choses qui séparent celles qui gagnent des autres.</p>
${image(`${SITE}/emails/revenue-28-jours-21084.png`, "Tableau de bord RevenueCat : 21 084 € de revenus sur les 28 derniers jours", "Voilà ce que mon application m'a rapporté sur les 28 derniers jours.", 482)}
<p ${P}>Elle dure 21 minutes. Regarde-la d'une traite, avec le son, c'est là que tout se joue.</p>
${button("Lancer la conférence", url)}
${signature("À tout de suite")}
${footnote(FOOT)}
`);
      return { subject: subjectWithName(first, "tu ne l'as pas encore ouverte", "Tu ne l'as pas encore ouverte"), html, tag };
    }

    if (variant === "v2") {
      // Le lien remet la vidéo là où le prospect s'est arrêté.
      const resumeAt = Math.max(0, Math.floor(ctx.watchSeconds) - 10);
      const url = utm(`${SITE}/conference/live?t=${resumeAt}`, tag);
      const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Tu as commencé la conférence et tu t'es arrêté en route. Ça arrive, un message, un appel, la vie. Le problème, c'est que la partie la plus importante est à la fin.</p>
<p ${P}>Ce que tu as vu jusque-là, c'est pourquoi les applications mobiles sont l'opportunité du moment. Ce que tu n'as pas encore vu, c'est comment je suis passé de 0 à 6 507 dollars par mois en cinq mois avec ma première application. C'est cette partie qui t'intéresse.</p>
${image(`${SITE}/emails/conference-trois-piliers-v2.jpg`, "Les trois piliers de la conférence, avec 10 000 € par mois affiché au-dessus des trois colonnes", "C'est le passage sur les trois piliers, celui que la plupart des gens ratent.")}
<p ${P}>Le lien ci-dessous te remet exactement là où tu t'es arrêté, tu n'as rien à chercher.</p>
${button("Reprendre la conférence", url)}
${signature("Bonne fin de visionnage")}
${footnote(FOOT)}
`);
      return { subject: "Tu t'es arrêté juste avant le meilleur", html, tag };
    }

    // v3 : arrivé au bouton sans réserver.
    const url = bookingUrl(ctx, tag);
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Tu es allé jusqu'au bout de la conférence, merci, c'est déjà plus que la majorité des gens. Et tu n'as pas cliqué sur le bouton en dessous. Je comprends, on ne sait jamais trop ce qu'il y a derrière ce genre de bouton.</p>
<p ${P}>Alors voilà ce qui se passe. Tu choisis un créneau de trente minutes pour un appel avec Nolan, mon associé, ou avec moi. Pendant cet appel, on regarde ta situation, ton projet, le temps que tu peux y consacrer, et on te dit franchement si l'accompagnement est fait pour toi. Ce n'est pas une session de conseils, et ce n'est pas un appel de vente déguisé non plus. On ne prend pas tout le monde.</p>
<p ${P}>Si ton profil correspond, on commence à poser ton plan d'action pendant l'appel, et tu rejoins la communauté le soir même.</p>
${imagePair({ src: `${SITE}/emails/nolan-appel.jpg`, alt: "Nolan en appel vidéo" }, { src: `${SITE}/emails/jeremy-appel.jpg`, alt: "Jeremy en appel vidéo" }, "Pendant l'appel, c'est Nolan ou moi qui prenons trente minutes pour regarder ton projet avec toi.")}
${button("Réserver mon appel", url)}
${signature("À bientôt")}
${footnote(FOOT)}
`);
    return { subject: subjectWithName(first, "voilà ce qui se passe après le bouton", "Voilà ce qui se passe après le bouton"), html, tag };
  }

  if (step === 2) {
    const url = utm(APP_TOUR_VIDEO, tag);
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Il y a une question qui revient dans presque tous les appels : "Jeremy, pourquoi une application mobile et pas un SaaS ?" Après tout, c'est ce que tout le monde lance en ce moment.</p>
<p ${P}>Justement. En 2026, tout le monde lance un SaaS. Il y en a des milliers par mois, avec les mêmes outils, les mêmes idées, les mêmes pages de vente. Pour vendre un abonnement à un logiciel sur ordinateur, il faut trouver des entreprises, les convaincre une par une, et se battre contre des concurrents qui ont dix fois ton budget.</p>
<p ${P}>Pendant ce temps, les applications mobiles ont été oubliées. Les gens ont l'App Store dans la poche, ils y achètent des abonnements sans y réfléchir, et personne ne se bat sur les petites niches. Une application d'apprentissage du japonais, ce n'est pas un marché qui fait rêver un fonds d'investissement. C'est pourtant celui qui me rapporte 400 000 euros par an, et ça continue de monter. En septembre dernier, l'application faisait 10 000 dollars dans le mois. En juin, elle est passée à près de 40 000 dollars, sans lever un centime et sans embaucher personne.</p>
${image(`${SITE}/emails/revenue-mensuel-sep25-juin26.jpg`, "Courbe des revenus mensuels de septembre 2025 à juin 2026, de 10 000 à près de 40 000 dollars par mois", "Voilà les revenus de l'application, mois par mois, de septembre 2025 à juin 2026.")}
<p ${P}>Et ce n'est pas que moi. Florian, Soraya, Wassim : à chaque fois la même recette, une niche précise, une application construite avec l'IA, et du contenu qui la fait connaître. C'est cette recette qu'on applique avec les élèves, et ça porte ses fruits. Demain je te partagerai les résultats de Florian.</p>
<p ${P}>Si tu veux voir à quoi ressemble une de ces applications de l'intérieur, j'ai fait une vidéo où je te montre la mienne, écran par écran.</p>
${button("Voir l'application de l'intérieur", url)}
${signature("À demain")}
${footnote(FOOT)}
`);
    return { subject: "Pourquoi je n'ai jamais lancé de SaaS", html, tag };
  }

  if (step === 3) {
    const url = utm(`${SITE}/temoignage/florian`, tag);
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Je veux te présenter Florian, parce que son histoire répond à la question que tu te poses sûrement : est-ce que ça marche pour quelqu'un qui part de zéro ?</p>
<p ${P}>Florian a vingt ans. Il n'avait jamais écrit une ligne de code. Il a passé quatre mois à construire son application de productivité tout seul, et il est arrivé avec une app qui fonctionnait mais qui ne transformait aucun utilisateur en client payant.</p>
<p ${P}>On a revu tout le système de l'app pendant un mois. Puis il a appliqué la méthode marketing, tous les jours, jusqu'à trouver le format de contenu qui marche pour son app. Vingt-huit jours après l'avoir trouvé, son application lui avait rapporté 1 793 dollars, sans dépenser un euro en publicité. Aujourd'hui elle tourne à plus de cent téléchargements par jour.</p>
${image(`${SITE}/emails/florian-revenuecat-1793.jpg`, "Tableau de bord RevenueCat de Florian : 1 793 $ de revenus sur 28 jours, 70 abonnements actifs", "Voilà le tableau de bord que Florian a montré en live aux autres élèves.")}
<p ${P}>Ce que je retiens, c'est ce qu'il a dit lui-même devant les autres élèves : quand on prend un accompagnement, on est débutant, on ne sait pas mieux, alors on applique ce qu'on nous dit et on regarde le résultat plus tard.</p>
<p ${P}>Il raconte tout en vidéo, ses vrais chiffres à l'écran.</p>
${button("Voir le témoignage de Florian", url)}
${signature("À demain")}
${footnote(FOOT)}
`);
    return { subject: "1 793 $ en 28 jours, sans savoir coder", html, tag };
  }

  if (step === 4) {
    const url = utm(`${SITE}/accompagnement`, tag);
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Depuis trois jours je te parle de l'accompagnement sans t'avoir vraiment montré ce qu'il y a dedans. Je répare ça aujourd'hui, en six minutes de vidéo.</p>
<p ${P}>Il y a trois parties. La communauté et les cours, avec plus d'une centaine de vidéos pour construire ton application avec l'IA, la faire convertir et la faire connaître, et un accès à vie. Les coachings de groupe, deux fois par mois, où je réponds à toutes les questions. Et le suivi personnel, sur plusieurs mois, avec moi, sur WhatsApp, avec des messages vocaux et des corrections directement sur ton app.</p>
${image(`${SITE}/jeremy-bureau.jpg`, "Jeremy à son bureau, en train de travailler sur une application", "Le suivi personnel, c'est moi qui le fais, pas un coach que tu ne connais pas.")}
<p ${P}>C'est cette dernière partie qui prend du temps, et c'est pour ça que les places sont limitées et qu'il y a un appel avant. Pas pour te vendre quelque chose, pour vérifier qu'on peut vraiment t'aider et que tu as le temps de t'y mettre.</p>
<p ${P}>Regarde la vidéo, et note les questions qui te viennent. Si tu réserves un appel ensuite, c'est le moment de les poser.</p>
${button("Voir ce qu'il y a dans l'accompagnement", url)}
${signature("À demain")}
${footnote(FOOT)}
`);
    return { subject: subjectWithName(first, "voilà ce qu'il y a dans les trois mois", "Voilà ce qu'il y a dans les trois mois"), html, tag };
  }

  if (step === 5) {
    const url = bookingUrl(ctx, tag);
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>"Je n'ai pas d'idée d'application." C'est la phrase que Nolan entend le plus souvent en appel, et c'est souvent dit comme une excuse pour ne pas se lancer.</p>
<p ${P}>Je vais te rassurer : la moitié des gens qui nous rejoignent n'ont pas d'idée en arrivant. Et ceux qui en ont une la changent souvent. Florian voulait faire une application de sport, parce qu'il venait du coaching sportif. Il a regardé le marché, il a vu la concurrence, et il a choisi la productivité, un sujet qui lui parlait plus. C'est cette application qui lui rapporte de l'argent aujourd'hui.</p>
<p ${P}>Trouver l'idée, ce n'est pas avoir une illumination sous la douche. C'est regarder ce qui se vend déjà sur l'App Store, repérer une niche où les applications en place ont un défaut, et arriver avec quelque chose d'un peu différent. C'est un travail de quelques jours, pas de quelques mois, et c'est la première chose qu'on fait ensemble dans l'accompagnement.</p>
${image(`${SITE}/emails/app-store-niche-budget.jpg`, "Résultats de recherche App Store pour budget et suivi de dépenses, avec plusieurs applications concurrentes", "Dans cette niche il y a plusieurs concurrents, et il reste une place à prendre.", 320)}
<p ${P}>Alors ne laisse pas cette phrase te bloquer. Réserve l'appel, dis-le simplement, et on en parle.</p>
${button("Réserver mon appel", url)}
${signature("À demain")}
${footnote(FOOT)}
`);
    return { subject: "Tu n'as pas d'idée d'app ? Tant mieux", html, tag };
  }

  if (step === 6) {
    const url = bookingUrl(ctx, tag);
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Si tu as cherché un peu sur internet, tu es tombé sur des développeurs qui disent que l'IA écrit du code pourri, que ça ne tient pas, que ce n'est pas sérieux. Je veux te répondre là-dessus, parce que c'est l'objection qui empêche le plus de gens de commencer.</p>
<p ${P}>Mes applications sont construites avec l'IA. Elles sont sur l'App Store depuis des années, avec des milliers d'abonnés qui payent chaque mois, et elles me rapportent des centaines de milliers d'euros chaque année. Florian n'avait jamais codé, son application est en ligne et lui rapporte de l'argent. Si le code était pourri, les utilisateurs partiraient. Ils restent.</p>
<p ${P}>Ce que les développeurs oublient, c'est que le code n'a jamais été ce qui fait gagner de l'argent à une application. Ma première application avait un code impeccable et m'a rapporté 81 euros en trois mois. Ce qui compte, c'est que l'application résolve un vrai problème, qu'elle donne envie de payer, et qu'elle soit vue. Le code, l'IA s'en occupe. Le reste, c'est ce qu'on apprend ensemble.</p>
${image(`${SITE}/emails/claude-code-ecran-stats.jpg`, "Claude Code qui construit un écran de statistiques de lecture, avec le résultat affiché sur un iPhone à droite", "Cet écran d'application a été construit en quelques minutes sans écrire une ligne de code.")}
<p ${P}>Si tu veux savoir ce que l'IA peut construire pour ton projet à toi, le plus simple est qu'on en parle. Réserve un appel, viens avec ton idée, même floue, et on te dit franchement si ça tient la route.</p>
${button("Réserver mon appel", url)}
${signature("À demain")}
${footnote(FOOT)}
`);
    return { subject: "Le code pourri de mes applications", html, tag };
  }

  if (step === 7) {
    const url = bookingUrl(ctx, tag);
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Je vais être franc avec toi aujourd'hui, parce que je préfère que tu le saches avant de réserver un appel plutôt que pendant.</p>
<p ${P}>L'accompagnement demande dix heures par semaine, minimum. Pas pour coder, l'IA fait le gros du travail. Pour construire l'application, la corriger, puis surtout pour faire du contenu sur les réseaux sociaux tous les jours, pour trouver un format qui marche et faire connaître ton application. Florian postait plusieurs fois par jour pendant des semaines avant que ça décolle. Il n'y a pas de raccourci là-dessus.</p>
<p ${P}>Si tu ne peux pas dégager ces dix heures, ce n'est pas le bon moment, et je préfère te le dire. Garde l'accès à la conférence et à mes vidéos, et reviens quand ce sera possible. Il n'y a aucune honte à ça.</p>
${image(`${SITE}/eleves-appel.jpg`, "Florian, Wassim et Soraya, trois élèves de l'accompagnement", "Florian, Wassim et Soraya y consacrent chacun dix heures par semaine.")}
<p ${P}>Si tu peux, alors tu as le seul critère qui compte vraiment. Le reste, l'idée, la technique, le marketing, on le construit ensemble. Réserve ton appel, et dis à Nolan combien d'heures tu peux y mettre, honnêtement. C'est la première question qu'il te posera.</p>
${button("Réserver mon appel", url)}
${signature("À demain")}
${footnote(FOOT)}
`);
    return { subject: subjectWithName(first, "10 heures par semaine, sinon ce n'est pas pour toi", "10 heures par semaine, sinon ce n'est pas pour toi"), html, tag };
  }

  // step 8
  const url = bookingUrl(ctx, tag);
  const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Ça fait une semaine que je t'écris, et c'est le dernier email de cette série. Je ne vais pas te relancer indéfiniment, ce n'est pas mon style. Mais avant de te laisser tranquille, il y a deux choses que je dois te dire, parce qu'elles changent la donne si tu comptes attendre.</p>
<p ${P}>La première, c'est que les places sont limitées. Le suivi personnel, c'est moi qui le fais, sur WhatsApp, avec des corrections directement sur ton application. Je ne peux pas suivre cinquante personnes en même temps, donc je prends quelques élèves à la fois, et quand c'est plein, il faut attendre qu'une place se libère.</p>
<p ${P}>La deuxième, c'est que je vais augmenter le prix de l'accompagnement. Pas pour le plaisir. Mon process s'est beaucoup affiné ces derniers mois, les résultats des élèves arrivent de plus en plus vite, et Florian n'est plus le seul à avoir des chiffres à montrer. Ce que tu peux avoir aujourd'hui à ce tarif, tu ne l'auras plus au même prix dans quelques semaines. Ceux qui réservent maintenant gardent les conditions actuelles.</p>
<p ${P}>Tu as vu la conférence. Tu as vu Florian passer de zéro à 1 793 dollars en 28 jours. Tu as vu ce qu'il y a dans l'accompagnement, et ce qu'on attend de toi. Il ne reste qu'une chose que je ne peux pas faire à ta place : réserver l'appel.</p>
<p ${P}>Si ce n'est vraiment pas le moment, aucun souci, tu gardes l'accès à la conférence et tu recevras mes vidéos quand j'en publie. Mais si tu hésites depuis une semaine, c'est sans doute que tu as envie d'y aller. Dans ce cas, c'est maintenant.</p>
${button("Réserver mon appel", url)}
${signature("Merci d'avoir lu jusqu'ici")}
${footnote(FOOT)}
`);
  return { subject: "Mon dernier message, et une mauvaise nouvelle", html, tag };
}
