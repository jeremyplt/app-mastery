// Séquence C : les emails envoyés après le Plan d'Action (optin organique),
// tant qu'aucun rendez-vous n'est pris. Un email par jour à 9 h, du jour 1 au
// jour 8. Textes validés par Jeremy (voir l'artefact "Séquences email App
// Mastery"), générés depuis l'artefact pour qu'ils soient identiques.
//
// L'envoi et le calendrier sont dans src/lib/sequence-c.ts.

import { LI, P, SITE, button, esc, footnote, image, imagePair, signature, utm, wrap } from "@/lib/emails/layout";
import type { BuiltEmail } from "@/lib/emails/transactional";

export type SequenceCStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export const SEQUENCE_C_LAST_STEP = 8;

export type SequenceCContext = {
  firstName: string;
  email: string;
  // Porte d'entrée dans la séquence : le Plan d'Action (défaut) ou un lead
  // magnet en rapport avec les apps mobiles (checklist des 27 règles, guide
  // monétisation). Seuls le pied de page et deux passages changent.
  source?: "plan-action" | "guide";
};

function foot(ctx: SequenceCContext): string {
  const origin = ctx.source === "guide" ? "tu as demandé un de mes guides gratuits" : "tu as demandé le Plan d'Action";
  return `Tu reçois cet email parce que ${origin}. Dès que tu réserves ton appel, ces emails s'arrêtent.`;
}

// Lien de réservation, pré-rempli : le prospect a déjà tout donné à l'optin.
function bookingUrl(ctx: SequenceCContext, campaign: string): string {
  const u = new URL(`${SITE}/appel/reserver`);
  if (ctx.firstName) u.searchParams.set("firstName", ctx.firstName);
  if (ctx.email) u.searchParams.set("email", ctx.email);
  return utm(u.toString(), campaign);
}

function subjectWithName(first: string, withName: string, without: string): string {
  return first ? `${first}, ${withName}` : without;
}

function ps(text: string): string {
  return `<p style="margin:26px 0 0;font-size:15px;line-height:1.6;color:#55555c">P.S. ${text}</p>`;
}

export function buildSequenceCEmail(step: SequenceCStep, ctx: SequenceCContext): BuiltEmail & { preview: string } {
  const first = (ctx.firstName || "").trim();
  const prenom = esc(first);
  const salut = prenom ? `Salut ${prenom},` : "Salut,";
  const tag = `seq-c-${step}`;
  const booking = bookingUrl(ctx, tag);
  const florianUrl = utm(`${SITE}/temoignage/florian`, tag);
  const accompagnementUrl = utm(`${SITE}/accompagnement`, tag);
  const planActionUrl = utm(`${SITE}/plan-action/video`, tag);

  if (step === 1) {
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Hier je t'ai promis de te raconter d'où vient Shinobi Japanese. Beaucoup de gens pensent que l'application a marché parce que je suis développeur. C'est faux. Ce qui a fait la différence, je ne l'ai pas appris en codant.</p>
<p ${P}>Voilà mon parcours, en quatre étapes.</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>J'ai commencé des études de médecine,</b> et je les ai arrêtées.</li>
<li ${LI}><b>J'ai enchaîné les projets</b> jusqu'au burn-out.</li>
<li ${LI}><b>J'ai passé des années dans le e-commerce,</b> et j'y ai appris à la dure, avec mon argent, tout ce qui fait vendre : comment trouver un produit que les gens veulent, comment écrire une page qui convertit, comment faire du contenu qui accroche, et comment tester des prix.</li>
<li ${LI}><b>Puis j'ai appris à coder,</b> pour faire du développement web.</li>
</ol>
<p ${P}>Et quand l'IA est arrivée, ça m'a paru une évidence : il fallait lancer une application mobile, tout de suite. Personne n'en parlait, et je savais qu'il y avait énormément d'argent à faire.</p>
<p ${P}>J'ai donc combiné ce que le e-commerce m'avait appris en marketing avec mes compétences techniques. On a commencé le marketing avant même que Shinobi soit sur les stores, l'inverse de ce que font la plupart des développeurs.</p>
${image(`${SITE}/jeremy-bureau.jpg`, "Jeremy à son bureau, en train de travailler sur une application", "C'est mon bureau aujourd'hui. Le code, je sais faire depuis longtemps, mais ce qui a fait Shinobi, c'est tout le reste.")}
<p ${P}>Résultat, l'application a rapporté de l'argent dès le premier mois, et la courbe n'est jamais redescendue. Aujourd'hui, elle me rapporte plus de 400 000 euros par an, et elle a plus de 5 000 notes avec une moyenne de 4,9 sur 5 sur l'App Store.</p>
<p ${P}>Ce que je veux que tu retiennes, c'est qu'il existe des centaines d'applications de japonais aussi bien codées que la mienne, et qu'elles dorment sur l'App Store. La différence n'est pas dans le code. Elle est dans le marketing, que j'ai appliqué dès le premier jour.</p>
<p ${P}>C'est exactement ce que j'apprends à mes élèves, qu'ils arrivent sans idée ou avec une application déjà publiée qui ne rapporte rien. Dans tous les cas, j'applique la même méthode et j'enseigne le marketing en priorité, parce que neuf fois sur dix, ce qui bloque, ce n'est pas le code.</p>
${image(`${SITE}/eleves-appel.jpg`, "Florian, Wassim et Soraya, trois élèves de l'accompagnement", "Florian, Wassim et Soraya sont trois élèves que j'ai accompagnés. Aucun des trois ne savait faire connaître une application en arrivant.")}
<p ${P}>Ces élèves, je les accompagne pendant trois mois. Si tu veux savoir si c'est fait pour toi, ça commence par un appel de trente minutes avec Nolan, mon associé. Il te pose des questions sur ton projet et sur le temps que tu peux y consacrer, et vous décidez ensemble si ça a du sens qu'on travaille avec toi.</p>
${button("Réserver mon appel", booking)}
<p ${P}>Demain, je te dis pourquoi le code ne sera jamais un problème pour toi non plus.</p>
${signature("À demain")}
${ps(
    ctx.source === "guide"
      ? `Tu as le guide. Pour la méthode complète, de l'idée au marketing, regarde le Plan d'Action avant l'email de demain : <a href="${planActionUrl}" style="color:#0060df">voir le Plan d'Action</a>.`
      : `Si tu n'as pas encore regardé le Plan d'Action, fais-le avant l'email de demain, tu comprendras mieux la suite.`,
  )}
${footnote(foot(ctx))}
`);
    return { subject: subjectWithName(first, "pourquoi Shinobi a marché dès le premier mois", "Pourquoi shinobi a marché dès le premier mois"), html, tag: "seq-c-1", preview: "Ce n'est pas grâce au code. Je suis développeur, et pourtant." };
  }

  if (step === 2) {
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Voilà ce que je vois sur presque tous les appels. Les gens arrivent avec une application qu'ils ont déjà construite avec l'IA, en quelques jours. Elle marche, elle est jolie, elle est sur l'App Store.</p>
<p ${P}>Et il ne se passe rien. L'application fait deux téléchargements, puis cinq, et sur les cinq, quatre viennent de la famille.</p>
<p ${P}>En 2026, faire une application qui fonctionne n'est plus compliqué. Tout le monde peut le faire. Je suis développeur, et je ne code plus une ligne moi-même.</p>
${image(`${SITE}/emails/claude-code-ecran-stats.jpg`, "Claude Code qui construit un écran de statistiques de lecture, avec le résultat affiché sur un iPhone à droite", "Aujourd'hui je code Shinobi entièrement avec l'IA. Je lui dis quoi faire, et je vois les changements en temps réel, exactement comme je les veux.")}
<p ${P}>Ce qui est compliqué, c'est tout ce qui vient après, et c'est là que 93 % des applications échouent :</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>Il faut faire une application qui convertit.</b> L'utilisateur doit comprendre en trente secondes ce qu'elle lui apporte, sortir sa carte, et revenir le lendemain.</li>
<li ${LI}><b>Il faut amener des gens dessus.</b> Ça veut dire trouver le format de contenu qui marche, tenir le rythme jusqu'à ce que ça décolle, et faire en sorte que l'application soit vue.</li>
</ol>
<p ${P}>Construire, c'est 20 % du travail. Convertir et faire connaître, c'est les 80 % qui restent, et c'est là que se fait tout le résultat. Personne n'enseigne ça, parce que tout le monde vend "crée ton app avec l'IA".</p>
<p ${P}>C'est pour ça que Shinobi rapporte plus de 400 000 euros par an, alors que des centaines d'applications de japonais aussi bien codées dorment sur l'App Store.</p>
<p ${P}>Si tu te demandes comment gagner de l'argent avec ton application et comment la faire connaître, c'est exactement ce qu'on règle dans l'accompagnement. Pour savoir s'il est fait pour toi, réserve un appel avec nous. Nolan, mon associé, prend trente minutes pour te poser des questions sur ton projet et sur ta situation, et vous décidez ensemble si ça a du sens qu'on travaille avec toi.</p>
${button("Réserver mon appel", booking)}
<p ${P}>Demain, je te donne une méthode concrète pour savoir en 48 heures si ton idée vaut le coup, avant d'y passer trois mois.</p>
${signature("À demain")}
${footnote(foot(ctx))}
`);
    return { subject: "Le code n'a jamais été ton problème", html, tag: "seq-c-2", preview: "En 2026, tout le monde peut faire une application qui marche. Et après ?" };
  }

  if (step === 3) {
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Aujourd'hui, je te donne une méthode que tu peux appliquer ce soir. La plupart des applications échouent parce que personne n'a vérifié que quelqu'un voulait ce qu'elles font. Voilà comment valider une idée en 48 heures, sans écrire une ligne de code.</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>Trouve une niche où les gens paient déjà.</b> Sur l'App Store, cherche des applications de ton domaine avec des achats intégrés ou un abonnement. Si elles gagnent de l'argent, les gens sont prêts à payer.</li>
</ol>
${image(`${SITE}/emails/app-store-niche-budget.jpg`, "Résultats de recherche App Store pour budget et suivi de dépenses, avec plusieurs applications concurrentes", "Dans cette niche, il y a plusieurs concurrents qui vendent des abonnements. C'est exactement ce qu'on cherche.", 320)}
<ol start="2" style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>Lis les avis à une étoile des concurrents.</b> Ils te disent ce que les utilisateurs veulent et n'obtiennent pas. Pour Shinobi, le même reproche revenait partout : trop de théorie, pas assez de pratique. J'ai construit l'inverse, et l'idée était validée avant la première ligne de code.</li>
<li ${LI}><b>Vérifie que tu as un angle.</b> Tu ne vas pas faire une meilleure version d'une application qui existe déjà. Tu vas résoudre un problème précis que les autres ignorent. C'est ce qui te rendra facile à expliquer, donc facile à faire connaître.</li>
<li ${LI}><b>Fais le test des dix personnes.</b> Décris ton idée en une phrase à dix personnes de ta cible, sur Reddit, Facebook ou Discord. Si sept te répondent "je téléchargerais ça", tu tiens quelque chose.</li>
</ol>
<p ${P}>Fais ces quatre étapes cette semaine et tu seras déjà en avance sur la grande majorité. Et si tu veux être guidé sur ces étapes, et sur toutes celles d'après, c'est exactement le rôle de l'accompagnement. Réserve un appel avec nous pour voir si c'est fait pour toi, et on décide ensemble de la suite.</p>
${button("Réserver mon appel", booking)}
<p ${P}>Demain, je te montre la stratégie qui a fait des millions de vues à Shinobi, sans un euro de pub.</p>
${signature("À bientôt")}
${footnote(foot(ctx))}
`);
    return { subject: "Comment valider ton idée d'app en 48 heures", html, tag: "seq-c-3", preview: "La méthode exacte, à appliquer ce soir, sans écrire une ligne de code." };
  }

  if (step === 4) {
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Il y a deux jours, je t'ai dit que le marketing était le vrai travail. Voilà ce que ça veut dire concrètement, avec ce qui a fait décoller Shinobi. On n'a pas dépensé un euro en pub, tout est venu du contenu.</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>On a misé sur le format court vertical.</b> On a publié des vidéos de 15 à 60 secondes sur TikTok, Instagram et YouTube. Elles montrent l'application en action, sans ressembler à une pub.</li>
</ol>
${image(`${SITE}/emails/reels-millions-de-vues.jpg`, "Trois reels de Shinobi Japanese à 1,9, 2,1 et 2,5 millions de vues", "Voilà trois de nos reels. Tout est vérifiable sur le compte Instagram de Shinobi Japanese.")}
<ol start="2" style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>On soigne la première seconde.</b> Elle décide de tout. Nos accroches qui ont le mieux marché sont une question qui pique, comme "Tu utilises vraiment Duolingo pour apprendre le japonais ?", un résultat surprenant, ou une rupture visuelle dès la première image.</li>
<li ${LI}><b>On fait du volume.</b> On a publié trois à cinq vidéos par semaine pendant six mois. La plupart font entre 1 000 et 10 000 vues, quelques-unes dépassent les deux millions, et personne ne sait à l'avance laquelle.</li>
</ol>
<p ${P}>Quand le contenu tourne, on ajoute un deuxième levier. On est allés chercher les créateurs qui parlaient déjà aux gens qui apprennent le japonais, on leur a écrit, et beaucoup ont répondu oui. Tu peux faire exactement pareil dans ta niche.</p>
${image(`${SITE}/emails/influenceur-collaboration.jpg`, "Conversation Instagram avec une créatrice qui accepte une collaboration pour Shinobi Japanese", "Cette créatrice a accepté une collaboration après deux messages. C'est plus simple que la plupart des gens ne le pensent.")}
<p ${P}>Cette stratégie coûte zéro euro. Elle demande du temps, de la régularité, et surtout quelqu'un qui te dise par où commencer. C'est ce que je fais avec les élèves de l'accompagnement. Pour savoir s'il est fait pour toi, réserve un appel avec nous.</p>
${button("Réserver mon appel", booking)}
<p ${P}>Demain, on parle argent. Je t'explique quel modèle de prix choisir, et les erreurs qui font perdre des mois de revenus.</p>
${signature("À bientôt")}
${ps(`Cette stratégie marche pour n'importe quelle niche. Le principe reste le même partout : tu fais du contenu natif, tu en fais beaucoup, et tu soignes la première seconde.`)}
${footnote(foot(ctx))}
`);
    return { subject: subjectWithName(first, "des millions de vues sans un euro de pub", "Des millions de vues sans un euro de pub"), html, tag: "seq-c-4", preview: "Ce qu'on a fait exactement, et pourquoi tu peux le copier ce soir." };
  }

  if (step === 5) {
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Parlons argent. Tu sais valider une idée et faire du contenu. Mais combien tu factures, et comment ? C'est là que beaucoup se plantent, et ça leur coûte des mois de revenus.</p>
<p ${P}>L'erreur fatale, c'est de lancer une application entièrement gratuite sans stratégie de monétisation. Tu attires des gens qui ne paieront jamais, et le jour où tu ajoutes un abonnement, ils se vengent dans les avis. On l'a vécu sur Shinobi.</p>
<p ${P}>Il y a deux façons de faire payer une application :</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>Le freemium.</b> Une partie de l'application est gratuite, le reste est payant.</li>
<li ${LI}><b>Le hard paywall.</b> On ne peut rien utiliser sans payer.</li>
</ol>
<p ${P}>Lequel choisir ? Ça dépend de ta niche et de ta fonctionnalité principale. Souvent, on commence en freemium pour avoir plus d'utilisateurs et plus de retours, puis on passe en hard paywall une fois que l'application est solide.</p>
<p ${P}>Côté prix, ce qui marche bien, c'est par exemple 15 euros par mois et 50 euros par an. L'écart est volontairement énorme pour pousser vers l'annuel : un abonné annuel, c'est un revenu sécurisé sur douze mois et de la trésorerie tout de suite, que tu réinvestis dans le marketing.</p>
<p ${P}>Et deux détails qui changent tout :</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>Tu mets le paywall à la fin de l'onboarding.</b> Sur Shinobi, 71 % des premium achètent avant d'avoir lu une seule histoire.</li>
<li ${LI}><b>Tu proposes un essai gratuit de 7 jours, uniquement sur l'annuel.</b> Les gens qui testent convertissent bien mieux que ceux qui voient juste un prix, et comme l'essai n'existe que sur l'annuel, c'est une raison de plus pour eux de le choisir.</li>
</ol>
${image(`${SITE}/emails/revenue-mensuel-sep25-juin26.jpg`, "Courbe des revenus mensuels de septembre 2025 à juin 2026, de 10 000 à près de 40 000 dollars par mois", "Voilà les revenus de Shinobi mois par mois. Le modèle de prix explique une grande partie de cette courbe.")}
<p ${P}>Freemium ou hard paywall, quel prix, quel essai : ce sont des choix qui dépendent de ton application, et c'est exactement ce qu'on définit ensemble dans l'accompagnement. Si tu veux le rejoindre, ça commence par un appel avec nous, pour voir si ton profil correspond.</p>
${button("Réserver mon appel", booking)}
<p ${P}>Demain, je t'envoie un email un peu différent, sur les raisons pour lesquelles certaines applications restent à zéro téléchargement pendant des mois.</p>
${signature("À bientôt")}
${footnote(foot(ctx))}
`);
    return { subject: "Le modèle de prix qui convertit le mieux", html, tag: "seq-c-5", preview: "L'erreur qui m'a coûté des milliers d'euros, et ce qui marche aujourd'hui." };
  }

  if (step === 6) {
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Si tu as déjà publié une application, tu connais peut-être ce moment. Tu rafraîchis l'App Store Connect tous les matins, et rien ne bouge. C'est là que la plupart des gens abandonnent.</p>
<p ${P}>Dans ce cas, le problème n'est pas à chercher dans l'application. Ce n'est pas l'application qui amène les téléchargements, c'est le marketing.</p>
<p ${P}>Et je vais être honnête avec toi, il n'y a pas de secret. Ce qui amène des téléchargements, c'est de créer du contenu et d'en publier tous les jours. Pas trois fois par semaine quand tu as le temps, tous les jours. C'est comme ça que Shinobi a décollé, et c'est comme ça que Florian, un de mes élèves, a décollé (je te raconte son histoire dans le prochain email).</p>
<p ${P}>La seule vraie difficulté, c'est de trouver le bon contenu pour ton application. Le format, l'angle, la façon de montrer l'app, ce qui fait que les gens s'arrêtent sur ta vidéo au lieu de passer à la suivante. Tant que tu ne l'as pas trouvé, tu publies dans le vide. Le jour où tu le trouves, tout change.</p>
${image(`${SITE}/emails/giga-banque-de-contenu-floutee.jpg`, "Six pages floutées de la banque de contenu donnée aux élèves, classée par niche", "Voilà une partie du document qu'on donne aux élèves : des centaines de vidéos qui ont marché, classées par niche, pour trouver le bon contenu sans partir de zéro. Je l'ai flouté, il est réservé à l'accompagnement.")}
<p ${P}>Et ça, on peut t'aider à le trouver. C'est une grosse partie de ce qu'on fait dans l'accompagnement : on regarde ce qui marche déjà dans ta niche, on définit les formats à tester, et tu publies jusqu'à ce que ça prenne. Pour savoir si c'est fait pour toi, réserve un appel avec mon associé Nolan. Il va te poser des questions sur ton projet, et vous déciderez ensemble.</p>
${button("Réserver mon appel", booking)}
<p ${P}>Demain, je te présente Florian, qui était exactement là où tu es il y a quelques mois.</p>
${signature("À demain")}
${footnote(foot(ctx))}
`);
    return { subject: "Ton app est sur l'App Store et il ne se passe rien", html, tag: "seq-c-6", preview: "La seule chose qui amène des téléchargements, et elle n'est pas dans l'application." };
  }

  if (step === 7) {
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Est-ce que ça marche pour quelqu'un qui part de zéro ? Florian, un de mes élèves, répond à cette question mieux que moi.</p>
${image(`${SITE}/florian.jpg`, "Florian", "Voilà Florian. Il raconte toute son histoire en vidéo, le lien est en bas de cet email.", 320)}
<p ${P}>Florian a vingt ans et il n'avait jamais écrit une ligne de code. Il a construit son application de productivité tout seul, avec l'IA, en quatre mois. Elle marchait, mais elle ne transformait aucun utilisateur en client payant.</p>
<p ${P}>C'est exactement le problème dont je te parle depuis une semaine. Voilà ce qu'on a fait ensemble.</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>On a passé un mois à revoir tout le système de l'application,</b> pour qu'elle convertisse.</li>
<li ${LI}><b>Il a appliqué la méthode marketing tous les jours,</b> jusqu'à trouver le format de contenu qui marche pour son app.</li>
</ol>
<p ${P}>Vingt-huit jours après l'avoir trouvé, son application lui avait rapporté 1 793 dollars, sans un euro de publicité. Aujourd'hui, elle fait plus de cent téléchargements par jour.</p>
${image(`${SITE}/emails/florian-revenuecat-1793-v2.jpg`, "Tableau de bord RevenueCat de Florian : 1 793 $ de revenus sur 28 jours, 70 abonnements actifs", "Voilà le tableau de bord que Florian a montré en live aux autres élèves.")}
<p ${P}>Ce qu'il a dit devant les autres élèves, c'est que quand on prend un accompagnement, on est débutant, on ne sait pas mieux, alors on applique ce qu'on nous dit et on regarde le résultat plus tard.</p>
<p ${P}>Wassim et Soraya ont suivi le même chemin, et plusieurs de mes élèves dépassent aujourd'hui 2 000 euros par mois. La différence avec ceux qui restent bloqués, ce n'est ni le talent ni le code. C'est qu'ils ont eu quelqu'un qui regardait leur projet de l'extérieur.</p>
<p ${P}>Florian raconte tout ça lui-même en vidéo, avec ses vrais chiffres à l'écran. Prends dix minutes pour la regarder, c'est la meilleure façon de savoir si tu te reconnais dans son parcours.</p>
${button("Voir le témoignage de Florian", florianUrl)}
<p ${P}>Et si tu veux que ce soit ton tour, ça commence par un appel de trente minutes avec nous, pour voir si l'accompagnement est fait pour toi. Tu peux <a href="${booking}" style="color:#0060df">réserver ton appel ici</a>.</p>
${signature("À bientôt")}
${footnote(foot(ctx))}
`);
    return { subject: "1 793 $ en 28 jours, sans savoir coder", html, tag: "seq-c-7", preview: "Florian a vingt ans, il n'avait jamais écrit une ligne de code, et voilà ce qu'il a fait." };
  }

  if (step === 8) {
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>C'est le dernier email de cette série. En huit jours, je t'ai donné quatre choses.</p>
<ul style="margin:0 0 18px;padding-left:22px">
<li ${LI}>Tu sais valider une idée en 48 heures.</li>
<li ${LI}>Tu connais la stratégie de contenu qui a fait des millions de vues.</li>
<li ${LI}>Tu as le modèle de prix qui convertit.</li>
<li ${LI}>Tu sais ce qui amène vraiment des téléchargements, et ce qui n'en amène pas.</li>
</ul>
<p ${P}>Si tu n'en appliques qu'une seule, tu es déjà en avance sur la plupart des gens. Mais je vais être direct : la différence entre ceux qui réussissent et ceux qui restent bloqués, ce n'est pas l'information. C'est quelqu'un qui regarde ton projet de l'extérieur et qui te dit : fais ça, ne fais pas ça, concentre-toi là-dessus.</p>
<p ${P}>C'est ce que je fais dans l'accompagnement, qui a trois parties.</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>Tu rejoins la communauté et les cours.</b> Tu as accès à vie à plus d'une centaine de vidéos.</li>
<li ${LI}><b>Tu participes aux coachings de groupe.</b> Deux fois par mois, j'analyse des applications en direct et je réponds à toutes les questions.</li>
<li ${LI}><b>Tu as un suivi personnel avec moi.</b> Je te suis moi-même pendant plusieurs mois, avec des corrections directement sur ton application.</li>
</ol>
<p ${P}>Je te montre tout ça de l'intérieur dans une vidéo de six minutes : <a href="${accompagnementUrl}" style="color:#0060df">voir ce qu'il y a dans l'accompagnement</a>.</p>
${imagePair({ src: `${SITE}/emails/nolan-appel.jpg`, alt: "Nolan en appel vidéo" }, { src: `${SITE}/emails/jeremy-appel.jpg`, alt: "Jeremy en appel vidéo" }, "Pendant l'appel, mon associé Nolan ou moi prenons trente minutes pour parler de ton projet et voir si l'accompagnement est fait pour toi.")}
<p ${P}>Il y a deux choses que je dois te dire avant de te laisser tranquille.</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}><b>Les places sont limitées.</b> Le suivi personnel, c'est moi qui le fais, et je ne peux pas suivre cinquante personnes en même temps.</li>
<li ${LI}><b>Le prix va augmenter.</b> Mon process s'est affiné, les résultats des élèves arrivent plus vite, et ceux qui réservent maintenant gardent les conditions actuelles.</li>
</ol>
<p ${P}>Si ce n'est vraiment pas le moment, aucun souci, tu gardes ${ctx.source === "guide" ? "le guide" : "le Plan d'Action"} et tu recevras mes vidéos. Mais si tu hésites depuis une semaine, c'est sans doute que tu as envie d'y aller. Dans ce cas, c'est maintenant.</p>
${button("Réserver mon appel", booking)}
${signature("Merci d'avoir lu jusqu'ici")}
${ps(`Si tu as une question, réponds à cet email. Je lis tout et je réponds personnellement. Et si tu veux revoir l'histoire de Florian avant de te décider, elle est ici : <a href="${florianUrl}" style="color:#0060df">le témoignage de Florian</a>.`)}
${footnote(foot(ctx))}
`);
    return { subject: subjectWithName(first, "mon dernier email, et une mauvaise nouvelle", "Mon dernier email, et une mauvaise nouvelle"), html, tag: "seq-c-8", preview: "Les places sont limitées et le prix de l'accompagnement va augmenter." };
  }

  throw new Error(`Étape inconnue de la séquence C : ${step}`);
}
