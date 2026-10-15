// Séquence B : les trois emails envoyés entre la réservation Calendly et
// l'appel découverte. Textes validés par Jeremy (voir l'artefact
// "Séquences email App Mastery"). Envoyés via l'API transactionnelle
// Brevo, en HTML simple : un email de Jeremy, pas une newsletter.
//
// - confirm : tout de suite après la réservation
// - veille  : la veille de l'appel à 18 h (heure de Paris)
// - jourj   : le jour de l'appel à 8 h (ou la veille à 20 h si l'appel est
//             avant 10 h)

import { LI, P, PARIS, SITE, button, esc, image, signature, utm, wrap } from "@/lib/emails/layout";

export type CallHost = "Nolan" | "Jeremy";

export type SequenceBContext = {
  firstName: string;
  host: CallHost;
  startTime: Date;
  rescheduleUrl: string;
  joinUrl: string;
};

export type SequenceBKind = "confirm" | "veille" | "jourj";

// "mardi 9 septembre"
export function formatDayFr(d: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: PARIS,
  }).format(d);
}

// "14h30"
export function formatHourFr(d: Date): string {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: PARIS,
  }).formatToParts(d);
  const h = parts.find((p) => p.type === "hour")?.value ?? "00";
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${h}h${m}`;
}


function ps(rescheduleUrl: string, text: string): string {
  return `<p style="margin:26px 0 0;font-size:15px;line-height:1.6;color:#55555c">P.S. ${text} <a href="${rescheduleUrl}" style="color:#0060df">Décaler mon créneau</a></p>`;
}

export function buildSequenceBEmail(
  kind: SequenceBKind,
  ctx: SequenceBContext,
): { subject: string; html: string; tag: string } {
  const prenom = esc(ctx.firstName || "");
  const jour = formatDayFr(ctx.startTime);
  const heure = formatHourFr(ctx.startTime);
  const salut = prenom ? `Salut ${prenom},` : "Salut,";

  if (kind === "confirm") {
    const hostParagraph =
      ctx.host === "Nolan"
        ? `<p ${P}>C'est Nolan, mon associé, qui va te recevoir. On a construit l'accompagnement ensemble et il prend en charge tous les premiers appels, ce qui me permet de rester à cent pour cent sur les élèves qu'on accompagne déjà.</p>`
        : `<p ${P}>C'est moi qui vais te recevoir. D'habitude c'est Nolan, mon associé, qui prend les premiers appels, mais sur ce créneau ce sera moi.</p>`;

    // Page dédiée à la vidéo de présentation de l'accompagnement.
    const confirmUrl = utm(`${SITE}/accompagnement`, "seq-b-1");

    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Ton appel est réservé pour ${jour} à ${heure}. Avant ça, je veux te dire à quoi il sert, parce que la plupart des gens l'imaginent mal.</p>
${hostParagraph}
<p ${P}>Je préfère te prévenir tout de suite : ce n'est pas un appel où on te donne des conseils gratuits pendant une demi-heure. C'est un échange où on regarde ton projet, ta situation et le temps que tu peux y consacrer, pour décider ensemble si ça a du sens qu'on travaille avec toi.</p>
<p ${P}>On ne prend pas tout le monde, et si ce n'est pas le bon moment pour toi, on te le dit honnêtement.</p>
<p ${P}>Si ton profil correspond et qu'on décide d'avancer ensemble, voilà ce qui se passe pendant l'appel :</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}>On valide que tu as ce qu'il faut pour rejoindre l'accompagnement : le temps, le sérieux, l'envie.</li>
<li ${LI}>On commence à poser ton plan d'action, à partir de tes objectifs à toi.</li>
<li ${LI}>Tu rejoins la communauté et tu as accès à toutes nos ressources dès le soir même.</li>
</ol>
${image(`${SITE}/jeremy-bureau.jpg`, "Jeremy à son bureau", ctx.host === "Nolan" ? "Pendant que Nolan prend les appels, je passe mes journées sur les applications des élèves." : "Le reste du temps, je passe mes journées sur les applications des élèves.")}
<p ${P}>Pour que ça se passe comme ça, prends six minutes d'ici là pour regarder la vidéo de présentation de l'accompagnement. J'y montre ce qu'il y a dedans : l'espace de formation et la communauté, les coachings de groupe, et le suivi personnel avec moi. Note les questions qui te viennent en la regardant, l'appel est fait pour y répondre.</p>
<p ${P}>Et si quelqu'un d'autre fait partie du projet, ou gère les finances avec toi, il faut que cette personne soit présente à l'appel. Sinon vous devrez en refaire un, et les créneaux sont limités.</p>
<p ${P}>Sur la même page, tu verras Wassim. Son application ne vendait presque rien quand il nous a rejoints. Deux mois plus tard, elle lui a rapporté 1 700 dollars en une seule journée, sans un euro de pub.</p>
${button("Regarder la vidéo de 6 minutes", confirmUrl)}
<p ${P}>Le lien de la visio est dans l'email de Calendly.</p>
${signature(`À ${jour}`)}
${ps(ctx.rescheduleUrl, "Si tu sais déjà que tu ne pourras pas être là, décale ton créneau maintenant plutôt que de ne pas venir. Il y a toujours quelqu'un qui attend derrière.")}
`);
    const first = (ctx.firstName || "").trim();
    return { subject: first ? `${first}, avant ton appel de ${jour}` : `Avant ton appel de ${jour}`, html, tag: "seq-b-1-confirm" };
  }

  if (kind === "veille") {
    const wassimUrl = utm(`${SITE}/temoignage/wassim`, "seq-b-2");
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Avant ton appel de demain, je voulais te parler de Wassim, parce qu'il était exactement à ta place il y a deux mois.</p>
<p ${P}>Wassim a vingt-deux ans. Il est arrivé à son appel avec une application déjà sur l'App Store, qui ne faisait presque aucune vente, et beaucoup de doutes. Il se demandait si les applications pouvaient vraiment marcher, et si j'étais la bonne personne pour l'aider.</p>
<p ${P}>On a vu que son profil collait et on a posé son plan d'action. On a commencé par un audit complet de son app, puis il s'est mis au contenu tous les jours. À chaque blocage, on cherchait ensemble ce qui coinçait : l'appel à l'action caché à la fin de ses carrousels, une étape de l'onboarding qui faisait partir 15 % des gens, et surtout un contenu qui attirait des moins de 17 ans qui ne pouvaient pas payer.</p>
${image(`${SITE}/emails/wassim-revenuecat-7269-v1.jpg`, "Tableau de bord RevenueCat de Wassim : 7 269 $ de revenus, 251 abonnements actifs, 232 essais en cours", "Voilà le tableau de bord de Wassim, deux mois après son appel.")}
<p ${P}>Résultat : 7 269 dollars en 14 jours, dont 1 700 dollars en une seule journée, sans dépenser un seul euro en publicité.</p>
<p ${P}>Ce que je retiens de son histoire, c'est sa façon de travailler. Chaque conseil que je lui donnais était appliqué le lendemain. C'est ce qui fait la différence entre ceux qui avancent et ceux qui restent bloqués.</p>
<p ${P}>Il raconte tout ça dans un podcast, avec ses vrais chiffres à l'écran. Si tu veux savoir à quoi ressemble la suite de ton appel de demain, c'est le meilleur endroit pour le voir.</p>
${button("Voir le témoignage de Wassim", wassimUrl)}
<p ${P}>On se retrouve demain à ${heure}. Le lien de la visio est dans ton email Calendly.</p>
${signature("Bonne soirée")}
${ps(ctx.rescheduleUrl, "Un empêchement ? Décale ton créneau plutôt que de le laisser vide, quelqu'un d'autre pourra en profiter.")}
`);
    return { subject: "Demain, tu seras à la place de Wassim", html, tag: "seq-b-2-veille" };
  }

  // jourj
  const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Ton appel est à ${heure}. Quatre choses qui font une vraie différence sur la qualité de l'échange :</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li ${LI}>Installe-toi dans un endroit calme, pas dans les transports ni dans une salle d'attente, parce qu'il faut pouvoir se concentrer pendant trente minutes.</li>
<li ${LI}>Prépare tes questions sur l'accompagnement et note-les, c'est le moment de les poser.</li>
<li ${LI}>Si quelqu'un d'autre fait partie du projet ou gère les finances avec toi, cette personne doit être là aussi, sinon vous devrez refaire un appel.</li>
<li ${LI}>Sois à l'heure, ${ctx.host} le sera. Au-delà de cinq minutes de retard, on passe à l'appel suivant et le créneau ne se reprend pas.</li>
</ol>
${image(`${SITE}/eleves-appel.jpg`, "Florian, Wassim et Soraya", "Florian, Wassim et Soraya ont passé ce même appel il y a quelques mois.")}
${button(`Rejoindre l'appel à ${heure}`, ctx.joinUrl)}
${signature("Bon appel")}
`);
  const first = (ctx.firstName || "").trim();
  return { subject: first ? `${first}, c'est aujourd'hui à ${heure}` : `C'est aujourd'hui à ${heure}`, html, tag: "seq-b-3-jourj" };
}
