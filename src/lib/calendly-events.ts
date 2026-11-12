// Types d'événements Calendly de l'agenda de Jeremy (jeremypltpro), utilisés
// par le webhook Calendly et par la préparation d'appel.

const ET = "https://api.calendly.com/event_types/";

// « Kick-off App Mastery » (secret, 30 min, mardi et jeudi 14 h-17 h) : l'appel
// de démarrage, réservé depuis l'email « Avant de démarrer ».
export const KICKOFF_EVENT_TYPE = `${ET}45ccec75-520e-434c-b55e-204522bf934e`;
export const KICKOFF_CALL_URL = "https://calendly.com/jeremypltpro/kick-off-app-mastery";

// « Appel élève App Mastery » (30 min, mardi et jeudi 14 h-17 h) : appel de
// suivi, pour régler un problème, ou de clôture.
export const STUDENT_CALL_EVENT_TYPE = `${ET}c5000937-650b-453a-ab00-809aa89cc409`;
export const STUDENT_CALL_URL = "https://calendly.com/jeremypltpro/appel-eleve-app-mastery";

// Ancien « Appel App Mastery » (60 min), désactivé le 12/11/2026 : ses
// rendez-vous déjà pris restent des appels élèves.
export const OLD_STUDENT_EVENT_TYPE = `${ET}d87fb821-a1fa-47ad-aa84-95c27cb38b26`;

export const STUDENT_EVENT_TYPES: ReadonlySet<string> = new Set([KICKOFF_EVENT_TYPE, STUDENT_CALL_EVENT_TYPE, OLD_STUDENT_EVENT_TYPE]);

// Chemin suivi par le webhook Calendly : « eleve » met seulement la fiche élève
// à jour ; « vente » passe par le CRM, Brevo et la séquence B (emails de
// confirmation et de rappel d'appel de vente).
export function webhookPath(eventTypeUri: string | undefined): "eleve" | "vente" {
  return eventTypeUri && STUDENT_EVENT_TYPES.has(eventTypeUri) ? "eleve" : "vente";
}

// Kick-off ou clôture d'après le type d'événement et le lien de réservation.
// « Kick-off App Mastery » : toujours le kick-off. Sinon, le lien envoyé depuis
// la fiche porte utm_content=kickoff ou cloture ; sans lui, une première
// réservation de l'ancien « Appel App Mastery » était le kick-off. Un appel
// élève sans utm_content (suivi, problème) ne touche à aucun des deux.
export function studentCallKind(eventTypeUri: string | undefined, utmContent: string | undefined, hasKickoffCall: boolean): "kickoff" | "cloture" | null {
  if (eventTypeUri === KICKOFF_EVENT_TYPE) return "kickoff";
  if (utmContent === "cloture") return "cloture";
  if (utmContent === "kickoff") return "kickoff";
  if (eventTypeUri === OLD_STUDENT_EVENT_TYPE && !hasKickoffCall) return "kickoff";
  return null;
}

// Rendez-vous de vente : calendrier de Nolan (masteryapp-jeremy/30min), et
// « 🚀 Appel Stratégique Gratuit » de Jeremy, seul ou en Round Robin avec Nolan.
export const NOLAN_EVENT_TYPE = `${ET}8dada1ac-c858-4c5f-84c8-b16f68fd51ca`;
export const SALES_EVENT_TYPES: ReadonlySet<string> = new Set([NOLAN_EVENT_TYPE, `${ET}8f8ca758-0ffd-44a5-83a2-f4eb4a708f6d`, `${ET}67b15962-8ecd-4e6f-8e9a-95158e04b840`]);
