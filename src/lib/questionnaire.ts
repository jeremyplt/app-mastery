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

function questionnaireEmail(firstName: string, link: string): BuiltEmail {
  const body = `
<p ${P}>Salut ${esc(firstName)},</p>
<p ${P}>Bienvenue dans l'accompagnement App Mastery ! Pour qu'on démarre du bon pied, j'ai besoin de mieux connaître ton projet.</p>
<p ${P}>Ça prend cinq minutes : où tu en es, ton objectif, ce qui te bloque. Je lis tes réponses avant notre appel de démarrage, pour qu'on aille droit à l'essentiel.</p>
${button("Répondre au questionnaire", link)}
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
  const r = await sendBuiltEmail({ email: s.email, name: s.name }, questionnaireEmail(s.name.split(" ")[0], questionnaireUrl(s.questionnaire_token)));
  if (!r.ok) return { ok: false, error: r.error ?? "Envoi impossible" };
  await supabase.from("students").update({ questionnaire_sent_at: new Date().toISOString() }).eq("id", s.id);
  return { ok: true };
}
