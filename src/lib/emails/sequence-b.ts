// Séquence B : les trois emails envoyés entre la réservation Calendly et
// l'appel découverte. Textes validés par Jeremy (voir l'artefact
// "Séquences email App Mastery"). Envoyés via l'API transactionnelle
// Brevo, en HTML simple : un email de Jeremy, pas une newsletter.
//
// - confirm : tout de suite après la réservation
// - veille  : la veille de l'appel à 18 h (heure de Paris)
// - jourj   : le jour de l'appel à 8 h (ou la veille à 20 h si l'appel est
//             avant 10 h)

const SITE = "https://www.jeremypitault.com";
const PARIS = "Europe/Paris";

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

function utm(url: string, campaign: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "email");
  u.searchParams.set("utm_medium", "email");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const P = 'style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#1d1d1f"';
const LI = 'style="margin:0 0 10px;font-size:16px;line-height:1.6;color:#1d1d1f"';

function button(label: string, href: string): string {
  return `<p style="margin:26px 0"><a href="${href}" style="display:inline-block;background:#0a84ff;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:13px 24px;border-radius:10px">${esc(label)}</a></p>`;
}

function image(src: string, alt: string, caption: string): string {
  return `<p style="margin:0 0 6px"><img src="${src}" alt="${esc(alt)}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:12px" /></p>
<p style="margin:0 0 22px;font-size:14px;line-height:1.5;color:#6e6e73;font-style:italic">${esc(caption)}</p>`;
}

function wrap(body: string): string {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#ffffff">
<div style="max-width:600px;margin:0 auto;padding:28px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
${body}
</div></body></html>`;
}

function signature(closing: string): string {
  return `<p ${P}>${closing},<br>Jeremy</p>`;
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

    const confirmUrl = utm(
      `${SITE}/appel/confirme?invitee_first_name=${encodeURIComponent(ctx.firstName)}&event_start_time=${encodeURIComponent(ctx.startTime.toISOString())}`,
      "seq-b-1",
    );

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
${image(`${SITE}/jeremy-bureau.jpg`, "Jeremy à son bureau", "Entre deux appels, je suis sur les apps des élèves.")}
<p ${P}>Pour que ça se passe comme ça, prends dix minutes d'ici là pour regarder la vidéo sur ta page de confirmation. J'y montre comment se déroulent les douze semaines de l'accompagnement. Note les questions qui te viennent en la regardant, l'appel est fait pour y répondre.</p>
<p ${P}>Et si quelqu'un d'autre fait partie du projet, ou gère les finances avec toi, il faut que cette personne soit présente à l'appel. Sinon vous devrez en refaire un, et les créneaux sont limités.</p>
<p ${P}>Juste en dessous, tu verras Florian. Il ne savait pas coder. Six semaines après la sortie de son app, elle lui rapportait 1 793 dollars sur 28 jours, sans un euro de pub.</p>
${button("Regarder la vidéo de 10 minutes", confirmUrl)}
<p ${P}>Le lien de la visio est dans l'email de Calendly.</p>
${signature(`À ${jour}`)}
${ps(ctx.rescheduleUrl, "Si tu sais déjà que tu ne pourras pas être là, décale ton créneau maintenant plutôt que de ne pas venir. Il y a toujours quelqu'un qui attend derrière.")}
`);
    return { subject: "Avant ton appel", html, tag: "seq-b-1-confirm" };
  }

  if (kind === "veille") {
    const florianUrl = utm(`${SITE}/temoignage/florian`, "seq-b-2");
    const html = wrap(`
<p ${P}>${salut}</p>
<p ${P}>Avant ton appel de demain, je voulais te parler de Florian, parce qu'il était exactement à ta place il y a quelques mois.</p>
<p ${P}>Florian a vingt ans et il n'avait jamais écrit une ligne de code. Il a passé quatre mois à construire son application de productivité tout seul, en apprenant sur le tas, et il est arrivé à son appel avec une app qui marchait à peu près et beaucoup de doutes sur la suite.</p>
<p ${P}>Son application fonctionnait, mais elle n'était pas du tout optimisée pour transformer les utilisateurs en clients payants. On a vu que son profil collait, on a posé son plan d'action, et pendant un mois on a complètement revu le système de l'app. Un mois plus tard, elle était sur l'App Store, prête à recevoir des utilisateurs et à les convertir en clients premium.</p>
<p ${P}>Il a ensuite appliqué la méthode marketing qu'on lui a donnée, tous les jours, jusqu'à trouver le format de contenu qui marche pour son app.</p>
${image(`${SITE}/florian-poster.jpg`, "Florian", "Florian, pendant le live où il montre ses chiffres aux autres élèves.")}
<p ${P}>Vingt-huit jours plus tard, son application lui avait rapporté 1 793 dollars, sans dépenser un seul euro en publicité. Aujourd'hui il tourne à plus de cent téléchargements par jour.</p>
<p ${P}>Ce que je retiens de son histoire, c'est ce qu'il a dit lui-même en live devant les autres élèves : quand on prend un accompagnement, on est débutant, on ne sait pas mieux, alors on applique ce qu'on nous dit et on regarde le résultat plus tard.</p>
<p ${P}>Il raconte tout ça en vidéo, avec ses vrais chiffres à l'écran. Si tu veux savoir à quoi ressemble la suite de ton appel de demain, c'est le meilleur endroit pour le voir.</p>
${button("Voir le témoignage de Florian", florianUrl)}
<p ${P}>On se retrouve demain à ${heure}. Le lien de la visio est dans ton email Calendly.</p>
${signature("Bonne soirée")}
${ps(ctx.rescheduleUrl, "Un empêchement ? Décale ton créneau plutôt que de le laisser vide, quelqu'un d'autre pourra en profiter.")}
`);
    return { subject: "Demain", html, tag: "seq-b-2-veille" };
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
  return { subject: "C'est aujourd'hui", html, tag: "seq-b-3-jourj" };
}
