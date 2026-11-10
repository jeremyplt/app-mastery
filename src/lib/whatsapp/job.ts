import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import type { SupabaseClient } from "@supabase/supabase-js";
import { summarize, type PromptMessage } from "./ai";
import { formatConseils, formatSkoolLessons, type ConseilRow, type SkoolLesson } from "./conseils";
import { formatSupports } from "../student-questions";
import { queuedSteps } from "../contenus/pipeline";
import { needsSummary, paymentsLine, phoneDigits, toRow, type KapsoMessage, type MessageRow, type PaymentInfo, type Thread } from "./messages";

// Passage du job WhatsApp sur Harness Maxxing (toutes les 5 minutes) :
// 1. copie les nouveaux messages depuis Kapso ;
// 2. transcrit les vocaux avec Whisper, sur le serveur ;
// 3. résume les fils qui attendent une réponse et prépare un brouillon, en
//    s'appuyant sur la base de conseils validée par Jeremy.
// Lecture seule : ce code n'envoie jamais rien sur WhatsApp.

const run = promisify(execFile);
const KAPSO = "https://api.kapso.ai";

export type JobEnv = { db: SupabaseClient; apiKey: string; phoneNumberId: string; now?: () => Date };

async function kapso<T>(env: JobEnv, path: string): Promise<T> {
  const res = await fetch(`${KAPSO}${path}`, { headers: { "X-API-Key": env.apiKey } });
  if (!res.ok) throw new Error(`Kapso ${res.status} sur ${path.split("?")[0]}`);
  return (await res.json()) as T;
}

type Page = { data: KapsoMessage[]; paging?: { next?: string | null } };

// 1. Synchronisation. Kapso renvoie les messages les plus récents d'abord (dans
// l'ordre d'arrivée chez Kapso, pas la date du message : l'historique importé
// arrive en vrac, par paquets). Par défaut, on s'arrête à la première page où il
// n'y a plus rien de neuf. `full` parcourt tout, `media` seulement les messages
// avec fichier : c'est là que Meta complète après coup les pièces jointes de
// l'historique (« [Media - pending] » devient un vrai vocal, même identifiant).
export async function syncMessages(env: JobEnv, opts: { full?: boolean; media?: boolean; maxPages?: number } = {}): Promise<{ nouveaux: number; completes: number; contacts: string[] }> {
  const contacts = new Set<string>();
  let saved = 0;
  let completed = 0;
  let after: string | null | undefined;
  for (let page = 0; page < (opts.maxPages ?? 30); page++) {
    const q = new URLSearchParams({ phone_number_id: env.phoneNumberId, limit: "100" });
    if (opts.media) q.set("has_media", "true");
    if (after) q.set("after", after);
    const res = await kapso<Page>(env, `/platform/v1/whatsapp/messages?${q}`);
    const rows = res.data.map(toRow).filter((r): r is MessageRow => r !== null);
    let changed = 0;
    if (rows.length) {
      const { data: known, error } = await env.db.from("whatsapp_messages").select("id, type").in("id", rows.map((r) => r.id));
      if (error) throw new Error(error.message);
      const stored = new Map((known ?? []).map((k) => [k.id as string, k.type as string]));
      const fresh = rows.filter((r) => !stored.has(r.id));
      if (fresh.length) {
        const { error: insertError } = await env.db.from("whatsapp_messages").upsert(fresh, { onConflict: "id", ignoreDuplicates: true });
        if (insertError) throw new Error(insertError.message);
        saved += fresh.length;
        for (const r of fresh) contacts.add(r.contact);
      }
      // Pièce jointe de l'historique arrivée depuis : on complète la ligne.
      const upgrades = rows.filter((r) => stored.get(r.id) === "media_placeholder" && r.type !== "media_placeholder");
      for (const r of upgrades) {
        const { error: updateError } = await env.db
          .from("whatsapp_messages")
          .update({ type: r.type, body: r.body, media_url: r.media_url, media_type: r.media_type, transcript: r.transcript })
          .eq("id", r.id);
        if (updateError) throw new Error(updateError.message);
        contacts.add(r.contact);
      }
      completed += upgrades.length;
      changed = fresh.length + upgrades.length;
    }
    after = res.paging?.next;
    if (!after || !res.data.length || (!opts.full && rows.length && !changed)) break;
  }
  if (contacts.size) await refreshThreads(env.db, [...contacts]);
  return { nouveaux: saved, completes: completed, contacts: [...contacts] };
}

// Dates des fils, puis rattachement à un élève par son numéro (sans jamais
// défaire un rattachement fait à la main).
async function refreshThreads(db: SupabaseClient, contacts: string[]) {
  const { error } = await db.rpc("whatsapp_refresh_threads", { contacts });
  if (error) throw new Error(error.message);
  const [{ data: threads }, { data: students }] = await Promise.all([
    db.from("whatsapp_threads").select("contact").in("contact", contacts).is("student_id", null),
    db.from("students").select("id, phone").not("phone", "is", null),
  ]);
  const byPhone = new Map((students ?? []).map((s) => [phoneDigits(s.phone as string), s.id as string]));
  for (const t of threads ?? []) {
    const id = byPhone.get(t.contact as string);
    if (id) await db.from("whatsapp_threads").update({ student_id: id }).eq("contact", t.contact);
  }
}

// 2. Transcription des vocaux, reçus comme envoyés. Les plus récents d'abord,
// dans la limite du temps donné : les autres (dont les anciens vocaux de
// l'historique) attendent le passage suivant.
export async function transcribeVoiceNotes(env: JobEnv, budgetMs = 200_000): Promise<{ transcrits: number; erreurs: number; restants: number }> {
  const { data, error, count } = await env.db
    .from("whatsapp_messages")
    .select("id, media_url, media_type", { count: "exact" })
    .eq("type", "audio")
    .is("transcript", null)
    .is("transcript_error", null)
    .order("sent_at", { ascending: false })
    .limit(40);
  if (error) throw new Error(error.message);
  const start = Date.now();
  let ok = 0;
  let ko = 0;
  for (const m of data ?? []) {
    if (Date.now() - start > budgetMs) break;
    try {
      const text = await transcribe(env, m.media_url as string | null, m.media_type as string | null);
      await env.db.from("whatsapp_messages").update({ transcript: text || "(vocal sans parole)" }).eq("id", m.id);
      ok++;
    } catch (e) {
      await env.db.from("whatsapp_messages").update({ transcript_error: String(e instanceof Error ? e.message : e).slice(0, 300) }).eq("id", m.id);
      ko++;
    }
  }
  return { transcrits: ok, erreurs: ko, restants: Math.max(0, (count ?? 0) - ok - ko) };
}

// Fichier d'un vocal. Kapso le sert depuis son API (clé requise) ou, pour
// l'historique, depuis un lien app.kapso.ai qui redirige vers un lien signé de
// son stockage. La clé ne part que vers api.kapso.ai, jamais vers le stockage
// vers lequel on est redirigé.
export async function downloadMedia(url: string, apiKey: string, get: typeof fetch = fetch): Promise<Buffer> {
  const host = new URL(url).hostname;
  if (host !== "api.kapso.ai" && host !== "app.kapso.ai") throw new Error("Lien audio inattendu");
  let res = await get(url, { headers: host === "api.kapso.ai" ? { "X-API-Key": apiKey } : {}, redirect: "manual" });
  for (let hop = 0; hop < 3 && res.status >= 300 && res.status < 400; hop++) {
    const next = res.headers.get("location");
    if (!next) break;
    res = await get(new URL(next, url).toString(), { redirect: "manual" });
  }
  if (!res.ok) throw new Error(`Téléchargement impossible (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

async function transcribe(env: JobEnv, url: string | null, mime: string | null): Promise<string> {
  if (!url) throw new Error("Pas de fichier audio");
  const audio = await downloadMedia(url, env.apiKey);
  if (audio.length > 25 * 1024 * 1024) throw new Error("Vocal trop lourd");
  const dir = await mkdtemp(join(tmpdir(), "whatsapp-vocal-"));
  try {
    const ext = mime?.includes("mpeg") ? "mp3" : mime?.includes("mp4") || mime?.includes("aac") ? "m4a" : "ogg";
    const file = join(dir, `vocal.${ext}`);
    await writeFile(file, audio);
    const { stdout } = await run("maxxing", ["voice", "transcribe", file], { timeout: 600_000, maxBuffer: 10 * 1024 * 1024 });
    const parsed = JSON.parse(stdout) as { text?: string };
    return (parsed.text ?? "").trim();
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

type ThreadRow = Thread & { contact_name: string | null; student_id: string | null };

// 3. Résumés. Un fil n'est résumé qu'une fois par série de messages : un échec
// est noté sur le fil et n'est retenté qu'au prochain message (ou depuis le CRM).
export async function summarizeThreads(env: JobEnv, max = 5): Promise<{ resumes: number; en_attente: number; erreurs: string[] }> {
  const now = env.now?.() ?? new Date();
  const { data, error } = await env.db
    .from("whatsapp_threads")
    .select("contact, contact_name, student_id, last_inbound_at, last_outbound_at, summarized_through, handled_at")
    .gte("last_inbound_at", new Date(now.getTime() - 7 * 86_400_000).toISOString())
    .order("last_inbound_at", { ascending: true });
  if (error) throw new Error(error.message);
  const todo = ((data ?? []) as ThreadRow[]).filter((t) => needsSummary(t, now));
  const conseils = todo.length ? await loadConseils(env.db) : "";
  let done = 0;
  let waiting = 0;
  const errors: string[] = [];
  for (const t of todo.slice(0, max)) {
    const { data: rows, error: msgError } = await env.db
      .from("whatsapp_messages")
      .select("direction, type, body, transcript, transcript_error, sent_at")
      .eq("contact", t.contact)
      .gte("sent_at", new Date(now.getTime() - 45 * 86_400_000).toISOString())
      .order("sent_at", { ascending: false })
      .limit(40);
    if (msgError) throw new Error(msgError.message);
    const messages = ((rows ?? []) as PromptMessage[]).reverse();
    const newSince = [t.last_outbound_at, t.handled_at].filter(Boolean).sort().at(-1) ?? null;
    // Un vocal reçu pas encore transcrit : on attend le passage suivant.
    if (messages.some((m) => m.type === "audio" && m.direction === "inbound" && !m.transcript && !m.transcript_error && (!newSince || m.sent_at > newSince))) {
      waiting++;
      continue;
    }
    try {
      // Avancement affiché dans le CRM : le brouillon est en cours d'écriture.
      const { data: cur } = await env.db.from("whatsapp_threads").select("progress").eq("contact", t.contact).maybeSingle();
      const progress = (cur?.progress ?? {}) as Record<string, unknown>;
      await env.db.from("whatsapp_threads").update({ progress: { ...progress, redaction: { statut: "en_cours", maj: new Date().toISOString() } } }).eq("contact", t.contact);
      const s = await summarize(messages, { who: await whoLine(env.db, t, now), now, newSince, conseils });
      const next: Record<string, unknown> = { ...progress, redaction: { statut: "fait", maj: new Date().toISOString() } };
      // Contenus d'inspiration à chercher : une demande par élève, traitée par
      // le job « contenus » ; le brouillon sera refait avec le lien du Drive.
      if (s.besoin_contenus && t.student_id) {
        const { data: existing } = await env.db.from("inspiration_requests").select("id").eq("student_id", t.student_id).neq("statut", "erreur").limit(1);
        if (!existing?.length) {
          await env.db.from("inspiration_requests").insert({ student_id: t.student_id, contact: t.contact, niche: s.niche, mots_cles: s.mots_cles });
          next.contenus = { etapes: queuedSteps(), maj: new Date().toISOString() };
        }
      }
      await env.db
        .from("whatsapp_threads")
        .update({ summary: s.summary, points: s.points, draft: s.draft, needs_reply: s.needs_reply, suspicious: s.suspicious_content, summarized_at: now.toISOString(), summarized_through: t.last_inbound_at, error: null, progress: next })
        .eq("contact", t.contact);
      done++;
    } catch (e) {
      const message = String(e instanceof Error ? e.message : e).slice(0, 300);
      errors.push(`${t.contact_name ?? "contact"} : ${message}`);
      await env.db.from("whatsapp_threads").update({ error: message, summarized_through: t.last_inbound_at }).eq("contact", t.contact);
    }
  }
  return { resumes: done, en_attente: waiting + Math.max(0, todo.length - max), erreurs: errors };
}

// Les thèmes validés par Jeremy dans /admin/whatsapp. Sans base (ou en cas de
// souci de lecture), les brouillons se font comme avant.
// S'y ajoutent les supports faits avec un lien dans /admin/questions, pour que
// le brouillon donne le lien quand la question revient.
export async function loadConseils(db: SupabaseClient): Promise<string> {
  const [{ data, error }, { data: supports }, { data: lessons }] = await Promise.all([
    db.from("whatsapp_conseils").select("theme, titre, contenu, statut").eq("statut", "valide").order("ordre"),
    db.from("student_questions").select("intitule, statut, lien, note, support_titre").eq("statut", "fait").not("lien", "is", null),
    db.from("skool_lessons").select("cours, module, titre, url").eq("pour_brouillons", true).order("ordre"),
  ]);
  const base = error ? "" : formatConseils((data ?? []) as ConseilRow[]);
  const ready = formatSupports((supports ?? []) as Parameters<typeof formatSupports>[0]);
  const skool = formatSkoolLessons((lessons ?? []) as SkoolLesson[]);
  return [base, ready, skool].filter(Boolean).join("\n\n");
}

export async function whoLine(db: SupabaseClient, t: Pick<ThreadRow, "student_id" | "contact_name">, now: Date): Promise<string> {
  if (t.student_id) {
    const { data: s } = await db.from("students").select("name, app, start_date, sale_id, payments").eq("id", t.student_id).maybeSingle();
    if (s) {
      // Échéancier : celui de la vente quand il y en a une, sinon celui saisi sur la fiche.
      let payments: PaymentInfo[] = Array.isArray(s.payments) ? (s.payments as PaymentInfo[]) : [];
      let currency: string | null = null;
      if (s.sale_id) {
        const { data: sale } = await db.from("sales").select("currency, sale_payments(amount, due_date, paid)").eq("id", s.sale_id).maybeSingle();
        if (sale) {
          currency = sale.currency ?? null;
          payments = ((sale.sale_payments ?? []) as { amount: number; due_date: string; paid: boolean }[]).map((p) => ({ date: p.due_date, amount: Number(p.amount), paid: p.paid }));
        }
      }
      const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(now);
      const pay = paymentsLine(payments, today, currency);
      const { data: insp } = await db.from("inspiration_requests").select("statut, lien, nb_liens").eq("student_id", t.student_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      const contenus = !insp
        ? ""
        : insp.statut === "fait" && insp.lien
          ? `Contenus d'inspiration : ${insp.nb_liens ?? ""} vidéos de sa niche trouvées et ajoutées à la GIGA BANQUE, lien de sa section : ${insp.lien}`
          : insp.statut === "erreur"
            ? "Contenus d'inspiration : la recherche a échoué, ne promets pas de lien."
            : "Contenus d'inspiration : recherche en cours.";
      return [`Interlocuteur : ${s.name}, élève accompagné par Jeremy${s.app ? `, app ${s.app}` : ""}${s.start_date ? `, accompagnement commencé le ${s.start_date}` : ""}.`, pay, contenus].filter(Boolean).join("\n");
    }
  }
  return `Interlocuteur : ${t.contact_name ?? "contact"} (pas relié à un élève dans le CRM : peut-être un prospect ou un élève dont le numéro n'est pas noté).`;
}
