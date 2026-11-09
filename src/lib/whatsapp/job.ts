import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import type { SupabaseClient } from "@supabase/supabase-js";
import { summarize, type PromptMessage } from "./ai";
import { needsSummary, phoneDigits, toRow, type KapsoMessage, type MessageRow, type Thread } from "./messages";

// Passage du job WhatsApp sur Harness Maxxing (toutes les 5 minutes) :
// 1. copie les nouveaux messages depuis Kapso ;
// 2. transcrit les vocaux avec Whisper, sur le serveur ;
// 3. résume les fils qui attendent une réponse et prépare un brouillon.
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

// 1. Synchronisation. Kapso renvoie les messages les plus récents d'abord. On
// s'arrête à la première page déjà entièrement connue : l'ordre suit l'arrivée
// chez Kapso, pas la date du message (l'historique importé arrive en vrac).
export async function syncMessages(env: JobEnv, maxPages = 30): Promise<{ nouveaux: number; contacts: string[] }> {
  const contacts = new Set<string>();
  let saved = 0;
  let after: string | null | undefined;
  for (let page = 0; page < maxPages; page++) {
    const q = new URLSearchParams({ phone_number_id: env.phoneNumberId, limit: "100" });
    if (after) q.set("after", after);
    const res = await kapso<Page>(env, `/platform/v1/whatsapp/messages?${q}`);
    const rows = res.data.map(toRow).filter((r): r is MessageRow => r !== null);
    if (rows.length) {
      const { data: known, error } = await env.db.from("whatsapp_messages").select("id").in("id", rows.map((r) => r.id));
      if (error) throw new Error(error.message);
      const knownIds = new Set((known ?? []).map((k) => k.id as string));
      const fresh = rows.filter((r) => !knownIds.has(r.id));
      if (fresh.length) {
        const { error: insertError } = await env.db.from("whatsapp_messages").upsert(fresh, { onConflict: "id", ignoreDuplicates: true });
        if (insertError) throw new Error(insertError.message);
        saved += fresh.length;
        for (const r of fresh) contacts.add(r.contact);
      }
      if (!fresh.length) break;
    }
    after = res.paging?.next;
    if (!after || !res.data.length) break;
  }
  if (contacts.size) await refreshThreads(env.db, [...contacts]);
  return { nouveaux: saved, contacts: [...contacts] };
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

// 2. Transcription des vocaux. Les plus récents d'abord, dans la limite du
// temps donné : les autres attendent le passage suivant.
export async function transcribeVoiceNotes(env: JobEnv, budgetMs = 240_000): Promise<{ transcrits: number; erreurs: number }> {
  const now = env.now?.() ?? new Date();
  const since = new Date(now.getTime() - 7 * 86_400_000).toISOString();
  const { data, error } = await env.db
    .from("whatsapp_messages")
    .select("id, media_url, media_type")
    .eq("type", "audio")
    .is("transcript", null)
    .is("transcript_error", null)
    .gte("sent_at", since)
    .order("sent_at", { ascending: false })
    .limit(10);
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
  return { transcrits: ok, erreurs: ko };
}

async function transcribe(env: JobEnv, url: string | null, mime: string | null): Promise<string> {
  if (!url) throw new Error("Pas de fichier audio");
  // La clé Kapso ne part que vers Kapso.
  if (new URL(url).hostname !== "api.kapso.ai") throw new Error("Lien audio inattendu");
  const res = await fetch(url, { headers: { "X-API-Key": env.apiKey } });
  if (!res.ok) throw new Error(`Téléchargement impossible (${res.status})`);
  const audio = Buffer.from(await res.arrayBuffer());
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
      const s = await summarize(messages, { who: await whoLine(env.db, t), now, newSince });
      await env.db
        .from("whatsapp_threads")
        .update({ summary: s.summary, points: s.points, draft: s.draft, needs_reply: s.needs_reply, suspicious: s.suspicious_content, summarized_at: now.toISOString(), summarized_through: t.last_inbound_at, error: null })
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

async function whoLine(db: SupabaseClient, t: ThreadRow): Promise<string> {
  if (t.student_id) {
    const { data: s } = await db.from("students").select("name, app, start_date").eq("id", t.student_id).maybeSingle();
    if (s) return `Interlocuteur : ${s.name}, élève accompagné par Jeremy${s.app ? `, app ${s.app}` : ""}${s.start_date ? `, accompagnement commencé le ${s.start_date}` : ""}.`;
  }
  return `Interlocuteur : ${t.contact_name ?? "contact"} (pas relié à un élève dans le CRM : peut-être un prospect ou un élève dont le numéro n'est pas noté).`;
}
