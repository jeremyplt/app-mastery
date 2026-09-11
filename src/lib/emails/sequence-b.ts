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
<p ${P}>Sur la même page, tu verras Florian. Il ne savait pas coder. Six semaines après la sortie de son app, elle lui rapportait 1 793 dollars sur 28 jours, sans un euro de pub.</p>
${button("Regarder la vidéo de 6 minutes", confirmUrl)}
<p ${P}>Le lien de la visio est dans l'email de Calendly.</p>
${signature(`À ${jour}`)}
${ps(ctx.rescheduleUrl, "Si tu sais déjà que tu ne pourras pas être là, décale ton créneau maintenant plutôt que de ne pas venir. Il y a toujours quelqu'un qui attend derrière.")}
`);
    const first = (ctx.firstName || "").trim();
    return { subject: first ? `${first}, avant ton appel de ${jour}` : `Avant ton appel de ${jour}`, html, tag: "seq-b-1-confirm" };
  }

  if (kind === "veille") {
    const florianUrl = utm(`${SITE}/temoignage/florian`, "seq-b-2");
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Avant ton appel de demain, je voulais te parler de Florian, parce qu'il était exactement à ta place il y a quelques mois.</p>
<p ${P}>Florian a vingt ans et il n'avait jamais écrit une ligne de code. Il a passé quatre mois à construire son application de productivité tout seul, en apprenant sur le tas, et il est arrivé à son appel avec une app qui marchait à peu près et beaucoup de doutes sur la suite.</p>
<p ${P}>Son application fonctionnait, mais elle n'était pas du tout optimisée pour transformer les utilisateurs en clients payants. On a vu que son profil collait, on a posé son plan d'action, et pendant un mois on a complètement revu le système de l'app. Un mois plus tard, elle était sur l'App Store, prête à recevoir des utilisateurs et à les convertir en clients premium.</p>
<p ${P}>Il a ensuite appliqué la méthode marketing qu'on lui a donnée, tous les jours, jusqu'à trouver le format de contenu qui marche pour son app.</p>
${image(`${SITE}/emails/florian-revenuecat-1793.jpg`, "Tableau de bord RevenueCat de Florian : 1 793 $ sur 28 jours", "Voilà le tableau de bord de Florian, 28 jours après avoir trouvé le bon format de contenu.")}
<p ${P}>Vingt-huit jours plus tard, son application lui avait rapporté 1 793 dollars, sans dépenser un seul euro en publicité. Aujourd'hui il tourne à plus de cent téléchargements par jour.</p>
<p ${P}>Ce que je retiens de son histoire, c'est ce qu'il a dit lui-même en live devant les autres élèves : quand on prend un accompagnement, on est débutant, on ne sait pas mieux, alors on applique ce qu'on nous dit et on regarde le résultat plus tard.</p>
<p ${P}>Il raconte tout ça en vidéo, avec ses vrais chiffres à l'écran. Si tu veux savoir à quoi ressemble la suite de ton appel de demain, c'est le meilleur endroit pour le voir.</p>
${button("Voir le témoignage de Florian", florianUrl)}
<p ${P}>On se retrouve demain à ${heure}. Le lien de la visio est dans ton email Calendly.</p>
${signature("Bonne soirée")}
${ps(ctx.rescheduleUrl, "Un empêchement ? Décale ton créneau plutôt que de le laisser vide, quelqu'un d'autre pourra en profiter.")}
`);
    return { subject: "Demain, tu seras à la place de Florian", html, tag: "seq-b-2-veille" };
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
