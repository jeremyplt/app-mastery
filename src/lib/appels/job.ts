import type { SupabaseClient } from "@supabase/supabase-js";
import { addMonths } from "../students";
import { answerEntries } from "../questionnaire-questions";
import { contentOf, type PromptMessage } from "../whatsapp/ai";
import { loadConseils } from "../whatsapp/job";
import { generatePrep, type PrepPromptParts } from "./prep";
import { callKind, parisDay, parisHour, upcomingStudentCalls } from "./calls";

// Job « App Mastery · appels » sur Harness Maxxing (toutes les 5 minutes) :
// 1. à partir de 6 h, demande la fiche des appels du jour qui n'en ont pas ;
// 2. écrit les fiches demandées (bouton « Préparer l'appel » du CRM ou étape 1).
// Les fiches restent dans le CRM : aucune notification, rien n'est envoyé à
// l'élève.

export type PrepJobEnv = { db: SupabaseClient; calendlyPat?: string | null; now?: () => Date };

export type CallPrepRow = {
  id: string;
  event_key: string;
  student_id: string;
  starts_at: string;
  title: string | null;
  statut: "demande" | "en_cours" | "fait" | "erreur";
};

const MORNING_HOUR = 6;

// 1. Pré-génération des appels du jour.
export async function queueTodayCalls(env: PrepJobEnv): Promise<{ demandes: number; calendly: string }> {
  const now = env.now?.() ?? new Date();
  if (parisHour(now) < MORNING_HOUR) return { demandes: 0, calendly: "pas encore l'heure" };
  const { calls, calendly } = await upcomingStudentCalls(env.db, { pat: env.calendlyPat, from: new Date(now.getTime() - 30 * 60_000), to: new Date(now.getTime() + 24 * 3_600_000) });
  const today = calls.filter((c) => parisDay(c.starts_at) === parisDay(now));
  if (!today.length) return { demandes: 0, calendly };
  const { data: known, error } = await env.db.from("call_preps").select("event_key").in("event_key", today.map((c) => c.key));
  if (error) throw new Error(error.message);
  const have = new Set((known ?? []).map((k) => k.event_key as string));
  const fresh = today.filter((c) => !have.has(c.key));
  if (fresh.length) {
    const { error: insertError } = await env.db.from("call_preps").upsert(
      fresh.map((c) => ({ event_key: c.key, student_id: c.student_id, starts_at: c.starts_at, title: c.title, statut: "demande", auto: true })),
      { onConflict: "event_key", ignoreDuplicates: true },
    );
    if (insertError) throw new Error(insertError.message);
  }
  return { demandes: fresh.length, calendly };
}

// 2. Fiches demandées. Une fiche restée « en cours » plus de 20 minutes (job
// coupé) est reprise.
export async function processPreps(env: PrepJobEnv, max = 3): Promise<{ faites: number; erreurs: string[] }> {
  const now = env.now?.() ?? new Date();
  const stale = new Date(now.getTime() - 20 * 60_000).toISOString();
  const { data, error } = await env.db
    .from("call_preps")
    .select("id, event_key, student_id, starts_at, title, statut")
    .or(`statut.eq.demande,and(statut.eq.en_cours,updated_at.lt.${stale})`)
    .order("starts_at", { ascending: true })
    .limit(max);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as CallPrepRow[];
  const conseils = rows.length ? await loadConseils(env.db).catch(() => "") : "";
  let done = 0;
  const errors: string[] = [];
  for (const row of rows) {
    await env.db.from("call_preps").update({ statut: "en_cours", updated_at: new Date().toISOString() }).eq("id", row.id);
    try {
      const parts = await prepParts(env.db, row, now, conseils);
      const fiche = await generatePrep(parts);
      if (!fiche.points.length) throw new Error("Fiche vide");
      await env.db
        .from("call_preps")
        .update({ statut: "fait", fiche, checked: [], error: null, generated_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", row.id);
      done++;
    } catch (e) {
      const message = String(e instanceof Error ? e.message : e).slice(0, 300);
      errors.push(message);
      await env.db.from("call_preps").update({ statut: "erreur", error: message, updated_at: new Date().toISOString() }).eq("id", row.id);
    }
  }
  return { faites: done, erreurs: errors };
}

const MILESTONE_LABELS: [string, string][] = [
  ["kickoff", "Kick-off"],
  ["app_published", "App publiée"],
  ["first_sale", "Première vente"],
  ["bilan_done", "Bilan"],
  ["ten_k", "10K"],
];

const frDay = (iso: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso));
const frWhen = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date(iso));
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

type StudentRow = {
  name: string;
  app: string | null;
  start_date: string | null;
  notes: string | null;
  consignes_ia: string | null;
  questionnaire: Record<string, string> | null;
  kickoff_call_at: string | null;
  closing_call_at: string | null;
  milestones_auto: Record<string, { date: string | null; preuve: string }> | null;
} & Record<string, unknown>;

// Fiche du CRM en texte : dates, jalons (avec la preuve WhatsApp), notes.
export function ficheText(s: StudentRow, now: Date): string {
  const today = parisDay(now);
  const lines = [`Élève : ${s.name}${s.app ? `, app ${s.app}` : ""}.`];
  if (s.start_date) {
    const end = addMonths(s.start_date, 3);
    const bilan = addMonths(s.start_date, 6);
    const left = daysBetween(today, end);
    lines.push(`Accompagnement commencé le ${frDay(s.start_date)}.`);
    lines.push(left < 0 ? `Les trois mois d'accompagnement sont terminés depuis le ${frDay(end)} (il y a ${-left} jours).` : `Fin des trois mois d'accompagnement le ${frDay(end)} (dans ${left} jours).`);
    lines.push(`Date notée dans le CRM pour le jalon Bilan (fin de la période de garantie) : ${frDay(bilan)}.`);
  } else lines.push("Date de démarrage non notée.");
  const auto = s.milestones_auto ?? {};
  for (const [k, label] of MILESTONE_LABELS) {
    const proof = auto[k];
    lines.push(`Jalon ${label} (${k}) : ${s[k] ? "coché" : "pas encore coché"}${s[k] && proof ? `, d'après WhatsApp${proof.date ? ` le ${frDay(proof.date)}` : ""} : ${proof.preuve}` : ""}.`);
  }
  if (s.kickoff_call_at) lines.push(`Appel de démarrage noté le ${frWhen(s.kickoff_call_at)}.`);
  if (s.closing_call_at) lines.push(`Appel de clôture noté le ${frWhen(s.closing_call_at)}.`);
  if (s.notes?.trim()) lines.push(`Notes de Jeremy : ${s.notes.trim().slice(0, 1200)}`);
  if (s.consignes_ia?.trim()) lines.push(`À savoir sur cet élève (noté par Jeremy) : ${s.consignes_ia.trim().slice(0, 800)}`);
  return lines.join("\n");
}

const parisShort = (iso: string) => new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

// Conversation des 30 derniers jours (80 messages au plus, vocaux transcrits),
// précédée du dernier résumé fait par le job WhatsApp.
export function whatsappText(threads: { summary: string | null; points: string[] | null }[], messages: PromptMessage[]): string {
  const head = threads
    .filter((t) => t.summary)
    .map((t) => `Dernier résumé du CRM : ${t.summary}${t.points?.length ? ` Questions en attente : ${t.points.join(" ; ")}` : ""}`);
  const lines = messages.map((m) => `[${parisShort(m.sent_at)}] ${m.direction === "outbound" ? "Jeremy" : "Élève"} : ${contentOf(m).replace(/\s*\n\s*/g, " / ").slice(0, 1500)}`);
  return [...head, ...lines].join("\n");
}

export async function prepParts(db: SupabaseClient, row: Pick<CallPrepRow, "student_id" | "starts_at" | "title" | "event_key">, now: Date, conseils: string): Promise<PrepPromptParts> {
  const { data: s, error } = await db
    .from("students")
    .select("name, app, start_date, notes, consignes_ia, questionnaire, kickoff_call_at, closing_call_at, milestones_auto, kickoff, app_published, first_sale, bilan_done, ten_k")
    .eq("id", row.student_id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!s) throw new Error("Élève introuvable");
  const { data: threads } = await db.from("whatsapp_threads").select("contact, summary, points").eq("student_id", row.student_id);
  const contacts = (threads ?? []).map((t) => t.contact as string);
  let messages: PromptMessage[] = [];
  if (contacts.length) {
    const { data: rows, error: msgError } = await db
      .from("whatsapp_messages")
      .select("direction, type, body, transcript, transcript_error, sent_at")
      .in("contact", contacts)
      .gte("sent_at", new Date(now.getTime() - 30 * 86_400_000).toISOString())
      .order("sent_at", { ascending: false })
      .limit(80);
    if (msgError) throw new Error(msgError.message);
    messages = ((rows ?? []) as PromptMessage[]).filter((m) => m.type !== "reaction").reverse();
  }
  const answers = s.questionnaire && typeof s.questionnaire === "object" ? answerEntries(s.questionnaire as Record<string, string>) : [];
  const manual = row.event_key.startsWith("manuel:");
  const kind = callKind(s as { start_date: string | null; kickoff: boolean; kickoff_call_at: string | null }, { key: row.event_key, starts_at: row.starts_at, title: row.title });
  return {
    kind,
    call: manual ? "pas de rendez-vous précis dans l'agenda, Jeremy prépare un échange à venir." : `${frWhen(row.starts_at)}${row.title ? `, rendez-vous « ${row.title} »` : ""}.`,
    fiche: ficheText(s as StudentRow, now),
    questionnaire: answers.map((a) => `${a.label} : ${a.value.slice(0, 600)}`).join("\n").slice(0, 4000),
    whatsapp: messages.length ? whatsappText((threads ?? []) as { summary: string | null; points: string[] | null }[], messages) : "",
    conseils,
    now,
  };
}
