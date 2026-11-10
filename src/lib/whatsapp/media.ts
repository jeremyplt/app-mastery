// Pièces jointes des nouveaux messages, données à l'IA des brouillons pour
// qu'elle les voie vraiment : photos et captures (refus d'Apple, tableau de
// bord…), et vidéos TikTok, Instagram ou YouTube Shorts envoyées en lien
// (planche d'images, voix transcrite, vues et likes). Tout est du contenu non
// fiable : l'IA n'a aucun autre outil que la recherche web.
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

export const MAX_IMAGES = 4;
export const MAX_VIDEOS = 2;
const VIDEO_LINK = /https?:\/\/(?:www\.|vm\.|vt\.|m\.)?(?:tiktok\.com\/\S+|instagram\.com\/(?:reels?|p)\/\S+|youtube\.com\/shorts\/\S+|youtu\.be\/\S+)/gi;

// Liens de vidéos dans des textes, sans doublon, dans l'ordre.
export function videoLinks(texts: (string | null)[], max = MAX_VIDEOS): string[] {
  const out: string[] = [];
  for (const t of texts) {
    for (const m of (t ?? "").matchAll(VIDEO_LINK)) {
      const url = m[0].replace(/[).,!?»"']+$/, "");
      if (!out.includes(url)) out.push(url);
      if (out.length >= max) return out;
    }
  }
  return out;
}

// Whisper invente parfois une phrase sur une vidéo sans voix (« Sous-titrage… »).
export function cleanTranscript(text: string): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length < 15 || /sous-titr|amara\.org|merci d'avoir regardé/i.test(t)) return "";
  return t.slice(0, 1500);
}

export type MediaMessage = { direction: string; type: string; body: string | null; media_url?: string | null; sent_at: string };

const clip = (s: unknown, n: number) => String(s ?? "").replace(/\s+/g, " ").trim().slice(0, n);
const hour = (iso: string) => new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

async function toJpeg(dir: string, input: Buffer, name: string): Promise<string> {
  const src = join(dir, `${name}.src`);
  const out = join(dir, `${name}.jpg`);
  await writeFile(src, input);
  await run("ffmpeg", ["-v", "error", "-y", "-i", src, "-vf", "scale='min(1280,iw)':-2", "-q:v", "4", "-frames:v", "1", out], { timeout: 60_000 });
  return (await readFile(out)).toString("base64");
}

async function video(dir: string, url: string, n: number): Promise<{ image: string | null; note: string }> {
  const { stdout } = await run("yt-dlp", ["-j", "--skip-download", "--no-warnings", "--no-playlist", url], { timeout: 90_000, maxBuffer: 20 * 1024 * 1024 });
  const meta = JSON.parse(stdout) as Record<string, unknown>;
  const file = join(dir, `v${n}.mp4`);
  await run("yt-dlp", ["-q", "--no-warnings", "--no-playlist", "-f", "worst[ext=mp4]/worst", "--max-filesize", "80M", "-o", file, url], { timeout: 150_000 });
  const duration = Math.max(1, Number(meta.duration) || parseFloat((await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file])).stdout) || 10);
  // Planche de 8 images, à lire de gauche à droite puis de haut en bas.
  const sheet = join(dir, `v${n}.jpg`);
  const step = duration / 8;
  await run("ffmpeg", ["-v", "error", "-y", "-i", file, "-vf", `fps=1/${step.toFixed(3)},scale=320:-2,tile=4x2`, "-frames:v", "1", "-q:v", "4", sheet], { timeout: 90_000 });
  let voix = "";
  try {
    const wav = join(dir, `v${n}.wav`);
    await run("ffmpeg", ["-v", "error", "-y", "-i", file, "-vn", "-ac", "1", "-ar", "16000", wav], { timeout: 60_000 });
    const t = await run("maxxing", ["voice", "transcribe", wav], { timeout: 300_000, maxBuffer: 10 * 1024 * 1024 });
    voix = cleanTranscript((JSON.parse(t.stdout) as { text?: string }).text ?? "");
  } catch {
    voix = "";
  }
  const stats = [
    meta.view_count != null ? `${meta.view_count} vues` : "",
    meta.like_count != null ? `${meta.like_count} likes` : "",
    meta.comment_count != null ? `${meta.comment_count} commentaires` : "",
    `durée ${Math.round(duration)} s`,
    meta.upload_date ? `publiée le ${String(meta.upload_date).replace(/(\d{4})(\d{2})(\d{2})/, "$3/$2/$1")}` : "",
  ].filter(Boolean);
  const note = `Vidéo ${url} (compte ${clip(meta.uploader ?? meta.channel, 40)}) : ${stats.join(", ")}. Légende : « ${clip(meta.description, 300)} ». Voix : ${voix ? `« ${voix} »` : "aucune voix (musique ou texte à l'écran seulement)"}. Planche de 8 images de la vidéo, une toutes les ${step.toFixed(1)} s.`;
  return { image: (await readFile(sheet)).toString("base64"), note };
}

// Pièces jointes des messages reçus après `newSince` : au plus 4 photos et 2 vidéos.
export async function collectMedia(messages: MediaMessage[], newSince: string | null, download: (url: string) => Promise<Buffer>): Promise<{ images: string[]; notes: string }> {
  const fresh = messages.filter((m) => m.direction === "inbound" && (!newSince || Date.parse(m.sent_at) > Date.parse(newSince)));
  if (!fresh.length) return { images: [], notes: "" };
  const dir = await mkdtemp(join(tmpdir(), "whatsapp-medias-"));
  const images: string[] = [];
  const notes: string[] = [];
  try {
    for (const m of fresh.filter((x) => x.type === "image" && x.media_url).slice(-MAX_IMAGES)) {
      try {
        images.push(await toJpeg(dir, await download(m.media_url!), `i${images.length}`));
        notes.push(`Image ${images.length} : photo ou capture envoyée le ${hour(m.sent_at)}${m.body ? `, avec le texte « ${clip(m.body, 200)} »` : ""}.`);
      } catch {
        notes.push(`Une photo envoyée le ${hour(m.sent_at)} n'a pas pu être lue.`);
      }
    }
    for (const url of videoLinks(fresh.map((m) => m.body))) {
      try {
        const v = await video(dir, url, notes.length);
        if (v.image) {
          images.push(v.image);
          notes.push(`Image ${images.length} : ${v.note}`);
        }
      } catch {
        notes.push(`La vidéo ${url} n'a pas pu être lue (privée, supprimée ou bloquée).`);
      }
    }
    return { images, notes: notes.join("\n") };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
