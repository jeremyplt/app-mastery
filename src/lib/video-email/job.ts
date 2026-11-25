import type { SupabaseClient } from "@supabase/supabase-js";
import { SCRIPTS } from "@/app/admin/scripts/scripts-data";
import type { VideoScript } from "@/app/admin/scripts/types";
import { CAMPAIGNS_URL, addEmailsToList, createDraftCampaign, createList, findDraftByName } from "./brevo";
import { PREWRITTEN, checkEmail, matchScript, renderVideoEmail, type EleveId, type VideoEmail } from "./content";
import { writeVideoEmail } from "./write";
import { fetchUploads, findGift, isLongVideo, videoCampaign, videoUrl, type Upload } from "./youtube";

// Tâche Harness « App Mastery · sorties vidéo » (toutes les 15 minutes) :
// 1. lit les dernières vidéos de la chaîne ;
// 2. pour chaque nouvelle vidéo longue, prépare l'email des leads sans RDV
//    (prérédigé s'il existe, sinon écrit par Claude) ;
// 3. crée la liste et la campagne en BROUILLON dans Brevo, puis prévient
//    Jeremy dans le fil Harness (relayé sur Telegram). Rien n'est envoyé.

export type VideoEmailEnv = {
  db: SupabaseClient;
  youtubeKey: string;
  brevoKey: string;
  now?: () => Date;
  notify?: (n: { title: string; body: string; url: string | null; dedupe: string; level: "info" | "error" }) => Promise<void>;
  // Remplaçables dans les tests.
  write?: typeof writeVideoEmail;
  uploads?: () => Promise<Upload[]>;
};

// Au-delà, une vidéo repérée trop tard n'a plus d'email de sortie.
const MAX_AGE_MS = 3 * 86_400_000;
const MAX_ATTEMPTS = 3;
const STALE_MS = 20 * 60_000;

type LeadRow = { email: string | null; call_booked: boolean | null; client: boolean | null; disqualified: boolean | null; seq_c_started_at: string | null; seq_c_step: number | null };

// Leads sans RDV, pas clients, pas disqualifiés, et pas en cours de séquence C
// (ils reçoivent déjà un email par jour). Même règle que la requête du
// brouillon de la vidéo B (1 171 adresses le 16 nov. 2026).
export function selectRecipients(rows: LeadRow[]): string[] {
  const norm = (e: string | null) => (e ?? "").trim().toLowerCase();
  const blocked = new Set<string>();
  for (const r of rows) {
    if (r.call_booked || r.client || (r.seq_c_started_at && (r.seq_c_step ?? 0) < 8)) blocked.add(norm(r.email));
  }
  const out = new Set<string>();
  for (const r of rows) {
    const e = norm(r.email);
    if (e.includes("@") && !blocked.has(e) && !r.disqualified) out.add(e);
  }
  return [...out];
}

export async function loadRecipients(db: SupabaseClient): Promise<string[]> {
  const rows: LeadRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from("crm_leads")
      .select("email, call_booked, client, disqualified, seq_c_started_at, seq_c_step")
      .order("created_at", { ascending: true })
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as LeadRow[]));
    if (!data || data.length < 1000) break;
  }
  return selectRecipients(rows);
}

export type NewRow = { video_id: string; title: string; published_at: string; statut: "ignoree" | "a_faire" };

// Au tout premier passage, les vidéos déjà en ligne sont seulement notées.
export function planNewVideos(longs: Upload[], known: Set<string>, firstRun: boolean, now: Date): NewRow[] {
  return longs
    .filter((v) => !known.has(v.id))
    .map((v) => ({
      video_id: v.id,
      title: v.title,
      published_at: v.publishedAt,
      statut: firstRun || now.getTime() - Date.parse(v.publishedAt) > MAX_AGE_MS ? "ignoree" : "a_faire",
    }));
}

export function videoTag(v: Upload): string {
  return `video-${(videoCampaign(v.description) ?? v.id).toLowerCase()}-sortie`;
}

export const campaignName = (v: Upload) => `Sortie vidéo · ${v.title.slice(0, 90)} · ${v.id}`;

async function thumbnailUrl(id: string): Promise<string> {
  const max = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  try {
    const res = await fetch(max, { method: "HEAD" });
    if (res.ok) return max;
  } catch {
    // réseau : on prend la miniature standard
  }
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export type PreparedEmail = { email: VideoEmail; html: string; tag: string; source: "prérédigé" | "claude"; script: VideoScript | null };

// L'email d'une vidéo, sans rien créer nulle part (sert aussi à l'essai).
// `videoLink` : lien du bouton pour un essai avant la sortie (page de la chaîne).
export async function prepareEmail(v: Upload, opts: { write?: typeof writeVideoEmail; localLogin?: boolean; videoLink?: string; dernierEleve?: EleveId | null } = {}): Promise<PreparedEmail> {
  // Le script de la vidéo : même utm_campaign dans la description (copiée depuis
  // /admin/scripts), sinon un titre assez proche.
  const campaign = videoCampaign(v.description);
  const script = (campaign && SCRIPTS.find((s) => videoCampaign(s.description) === campaign)) || matchScript(v.title, SCRIPTS);
  const pre = script ? PREWRITTEN[script.slug] : undefined;
  const gift = findGift(v.description) ?? (script?.gift ? { url: script.gift.url.split("?")[0], line: script.gift.name } : null);
  const tag = pre?.tag ?? videoTag(v);
  const email = pre ? pre.email : await (opts.write ?? writeVideoEmail)(v, gift, script, { localLogin: opts.localLogin, dernierEleve: opts.dernierEleve });
  const problems = checkEmail(email);
  if (problems.length) throw new Error(`Email refusé par les contrôles : ${problems.join(" ; ")}`);
  // La miniature n'est l'image de l'email que s'il ne cite aucun élève.
  const thumb = email.preuve ? "" : await thumbnailUrl(v.id);
  const html = renderVideoEmail(email, { videoUrl: opts.videoLink ?? videoUrl(v.id), thumbnailUrl: thumb, giftUrl: gift?.url ?? null, tag });
  return { email, html, tag, source: pre ? "prérédigé" : "claude", script };
}

type Row = { video_id: string; statut: string; attempts: number; brevo_list_id: number | null; updated_at: string };

async function processVideo(env: VideoEmailEnv, row: Row, v: Upload): Promise<string> {
  const db = env.db;
  const stamp = () => new Date().toISOString();
  await db.from("video_emails").update({ statut: "en_cours", attempts: row.attempts + 1, updated_at: stamp() }).eq("video_id", v.id);
  // Florian et Wassim alternent quand les deux collent aussi bien à la vidéo.
  const { data: last } = await db.from("video_emails").select("eleve").eq("statut", "brouillon").not("eleve", "is", null).order("published_at", { ascending: false }).limit(1);
  const dernierEleve = (last?.[0]?.eleve as EleveId | undefined) ?? null;
  const prepared = await prepareEmail(v, { write: env.write, dernierEleve });
  const name = campaignName(v);

  let campaignId = await findDraftByName(env.brevoKey, name);
  let added: number | null = null;
  let missing: number | null = null;
  if (!campaignId) {
    let listId = row.brevo_list_id;
    if (!listId) {
      const day = new Date(v.publishedAt).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short", year: "numeric" });
      listId = await createList(env.brevoKey, `Sortie vidéo · ${day} · ${v.title.slice(0, 60)}`);
      await db.from("video_emails").update({ brevo_list_id: listId, updated_at: stamp() }).eq("video_id", v.id);
    }
    const recipients = await loadRecipients(db);
    ({ added, missing } = await addEmailsToList(env.brevoKey, listId, recipients));
    campaignId = await createDraftCampaign(env.brevoKey, { name, subject: prepared.email.objet, previewText: prepared.email.apercu, html: prepared.html, listId });
  }
  await db
    .from("video_emails")
    .update({ statut: "brouillon", source: prepared.source, tag: prepared.tag, subject: prepared.email.objet, eleve: prepared.email.preuve?.eleve ?? null, brevo_campaign_id: campaignId, recipients: added, missing, error: null, updated_at: stamp() })
    .eq("video_id", v.id);

  await env.notify?.({
    title: `Email de la vidéo prêt dans Brevo : « ${prepared.email.objet} »`,
    body: [
      `Vidéo : ${v.title}`,
      added !== null ? `Destinataires : ${added} leads sans RDV${missing ? ` (${missing} leads du CRM absents de Brevo)` : ""}.` : "",
      prepared.source === "prérédigé" ? "Email prérédigé, déjà validé." : "Email écrit par Claude, à relire.",
      prepared.email.preuve ? `Élève cité : ${prepared.email.preuve.eleve === "wassim" ? "Wassim" : "Florian"}.` : "Aucun élève cité.",
      "Rien n'est envoyé : relis le brouillon dans Brevo (Campagnes), puis envoie-le.",
    ].filter(Boolean).join("\n"),
    url: CAMPAIGNS_URL,
    dedupe: `video-email-${v.id}`,
    level: "info",
  });
  return `${v.id} : brouillon ${campaignId}`;
}

export async function runVideoEmails(env: VideoEmailEnv): Promise<{ nouvelles: number; brouillons: string[]; erreurs: string[] }> {
  const now = env.now?.() ?? new Date();
  const uploads = await (env.uploads ?? (() => fetchUploads(env.youtubeKey)))();
  const longs = uploads.filter(isLongVideo);

  const { count, error: countError } = await env.db.from("video_emails").select("video_id", { count: "exact", head: true });
  if (countError) throw new Error(countError.message);
  const { data: knownRows, error } = await env.db.from("video_emails").select("video_id").in("video_id", longs.map((v) => v.id));
  if (error) throw new Error(error.message);
  const fresh = planNewVideos(longs, new Set((knownRows ?? []).map((r) => r.video_id as string)), !count, now);
  if (fresh.length) {
    const { error: insertError } = await env.db.from("video_emails").upsert(fresh, { onConflict: "video_id", ignoreDuplicates: true });
    if (insertError) throw new Error(insertError.message);
  }

  // À traiter : nouvelles, erreurs à reprendre, passages coupés.
  const stale = new Date(now.getTime() - STALE_MS).toISOString();
  const { data: todo, error: todoError } = await env.db
    .from("video_emails")
    .select("video_id, statut, attempts, brevo_list_id, updated_at")
    .in("video_id", longs.map((v) => v.id))
    .or(`statut.eq.a_faire,and(statut.eq.erreur,attempts.lt.${MAX_ATTEMPTS}),and(statut.eq.en_cours,updated_at.lt.${stale})`);
  if (todoError) throw new Error(todoError.message);

  const brouillons: string[] = [];
  const erreurs: string[] = [];
  for (const row of (todo ?? []) as Row[]) {
    const v = longs.find((u) => u.id === row.video_id)!;
    try {
      brouillons.push(await processVideo(env, row, v));
    } catch (e) {
      const message = String(e instanceof Error ? e.message : e).slice(0, 300);
      erreurs.push(`${v.id} : ${message}`);
      await env.db.from("video_emails").update({ statut: "erreur", error: message, updated_at: new Date().toISOString() }).eq("video_id", v.id);
      if (row.attempts + 1 >= MAX_ATTEMPTS) {
        await env.notify?.({ title: "Email de sortie de vidéo non créé", body: `Vidéo : ${v.title}\n${message}`, url: null, dedupe: `video-email-erreur-${v.id}`, level: "error" });
      }
    }
  }
  return { nouvelles: fresh.filter((f) => f.statut === "a_faire").length, brouillons, erreurs };
}
