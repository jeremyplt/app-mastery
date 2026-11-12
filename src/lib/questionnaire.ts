import { getAdminClient } from "@/lib/supabase";
import { sendBuiltEmail } from "@/lib/emails/send";
import { P, button, esc, signature, wrap } from "@/lib/emails/layout";
import type { BuiltEmail } from "@/lib/emails/transactional";

// Questionnaire de démarrage envoyé à chaque nouvel élève (avec l'invitation
// Skool, ou à la main depuis sa fiche). L'élève répond sur
// /questionnaire/[token] ; les réponses arrivent dans sa fiche et Jeremy est
// prévenu par email.

export { QUESTIONS, type Question } from "@/lib/questionnaire-questions";

const SITE = "https://www.jeremypitault.com";

export function questionnaireUrl(token: string): string {
  return `${SITE}/questionnaire/${token}`;
}

// Lien Calendly secret du kick-off (30 min, mardi et jeudi 14 h-17 h, 24 h de
// préavis). Il n'est donné que dans cet email. Nom et email sont pré-remplis :
// l'élève n'a rien à retaper et le RDV se rattache à sa fiche par l'email.
const KICKOFF_URL = "https://calendly.com/jeremypltpro/kick-off-app-mastery";

export function kickoffUrl(name: string, email: string): string {
  const u = new URL(KICKOFF_URL);
  u.searchParams.set("name", name);
  u.searchParams.set("email", email);
  return u.toString();
}

export function questionnaireEmail(firstName: string, link: string, kickoff: string): BuiltEmail {
  const body = `
<p ${P}>Salut ${esc(firstName)},</p>
<p ${P}>Bienvenue dans App Mastery ! Pour qu'on démarre du bon pied, il y a deux étapes.</p>
<p ${P}><strong>1. Réponds au questionnaire.</strong> Ça prend quelques minutes : tes liens, tes outils, tes régies publicitaires, tes réseaux sociaux, tes concurrents. À la fin, je te demande aussi de m'envoyer quelques accès. Je lis tout avant notre appel de démarrage, pour qu'on aille droit à l'essentiel.</p>
${button("Répondre au questionnaire", link)}
<p ${P}><strong>2. Réserve notre appel de démarrage.</strong> Il dure 30 minutes, le mardi ou le jeudi après-midi. Prends le premier créneau qui te convient.</p>
${button("Réserver mon appel de démarrage", kickoff)}
<p ${P}>Pour la suite, la première leçon sur Skool t'explique comment me joindre et quand on s'appelle.</p>
<p ${P}>Si tu as la moindre question, réponds simplement à cet email.</p>
${signature("À très vite")}`;
  return { subject: "Avant de démarrer", html: wrap(body), tag: "eleve-questionnaire" };
}

type StudentRow = { id: string; name: string; email: string | null; questionnaire_token: string };

// Envoie (ou renvoie) le questionnaire à un élève. Retourne une erreur lisible.
export async function sendQuestionnaire(studentId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getAdminClient();
  const { data } = await supabase.from("students").select("id, name, email, questionnaire_token").eq("id", studentId).maybeSingle();
  const s = data as StudentRow | null;
  if (!s) return { ok: false, error: "Élève introuvable" };
  if (!s.email) return { ok: false, error: "Ajoute d'abord l'email de l'élève sur sa fiche" };
  const email = questionnaireEmail(s.name.split(" ")[0], questionnaireUrl(s.questionnaire_token), kickoffUrl(s.name, s.email));
  const r = await sendBuiltEmail({ email: s.email, name: s.name }, email);
  if (!r.ok) return { ok: false, error: r.error ?? "Envoi impossible" };
  await supabase.from("students").update({ questionnaire_sent_at: new Date().toISOString() }).eq("id", s.id);
  return { ok: true };
}
