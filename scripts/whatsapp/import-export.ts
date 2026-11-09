// Rattache au CRM les vocaux d'exports WhatsApp (« Exporter la discussion »,
// audio seulement). Meta n'envoie pas les fichiers de plus de 14 jours ni ceux
// envoyés par Jeremy : ils restent en « pièce jointe non récupérée » dans
// whatsapp_messages. L'export, lui, contient tout, avec la date à la seconde.
//
//   npx tsx scripts/whatsapp/import-export.ts <dossier des .zip> <dossier de travail>
//
// À lancer sur le Mac (variables de .env.local). Transcrit avec whisper.cpp en
// local, puis complète la pièce jointe correspondante (même contact,
// même sens, même seconde à 2 s près) ou ajoute le vocal s'il manque. Relançable :
// ce qui est déjà transcrit n'est pas refait.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { phoneDigits } from "@/lib/whatsapp/messages";

const [zipDir, workDir] = process.argv.slice(2);
if (!zipDir || !workDir) throw new Error("Usage : import-export.ts <dossier des .zip> <dossier de travail>");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
const ME = "Jeremy Pitault";

// Phrases que Whisper invente sur les silences (génériques de sous-titres).
const HALLUCINATION = /sous-titr|amara\.org|ST' ?501|merci d'avoir regardé|abonnez-vous/i;

type Voice = { file: string; direction: "inbound" | "outbound"; sentAt: Date };

// Heure de l'export (heure du téléphone, Europe/Paris) vers UTC.
function parisToUtc(y: number, mo: number, d: number, h: number, mi: number, s: number): Date {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(new Date(guess));
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const asParis = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return new Date(guess - (asParis - guess));
}

// « [02/11/2026, 7:06:18 PM] Jeremy Pitault: <attached: 00000002-AUDIO-….opus> »
const LINE = /^‎?\[(\d{2})\/(\d{2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2})[\s ]?([AP]M)?\] ([^:]+): ‎?<attached: ([^>]+\.(?:opus|m4a|mp3|ogg))>/;

function voicesOf(chatTxt: string): Voice[] {
  const out: Voice[] = [];
  for (const raw of chatTxt.split("\n")) {
    const m = raw.match(LINE);
    if (!m) continue;
    let h = Number(m[4]);
    if (m[7] === "PM" && h < 12) h += 12;
    if (m[7] === "AM" && h === 12) h = 0;
    out.push({ file: m[9], direction: m[8].trim() === ME ? "outbound" : "inbound", sentAt: parisToUtc(Number(m[3]), Number(m[2]), Number(m[1]), h, Number(m[5]), Number(m[6])) });
  }
  return out;
}

// whisper.cpp avec la puce graphique du Mac : environ 20 fois plus rapide que le
// temps réel. Modèle ggml local (WHISPER_MODEL, par défaut celui de superwhisper).
const MODEL = process.env.WHISPER_MODEL ?? join(process.env.HOME ?? "", "Library/Application Support/superwhisper/ggml-small.bin");
const txtOf = (dir: string, file: string) => join(dir, "txt", `${basename(file).replace(/\.[^.]+$/, "")}.txt`);

function transcribe(dir: string, files: string[]): void {
  const todo = files.filter((f) => !existsSync(txtOf(dir, f)));
  mkdirSync(join(dir, "txt"), { recursive: true });
  todo.forEach((f, i) => {
    const wav = join(dir, "txt", "tmp.wav");
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", join(dir, f), "-ar", "16000", "-ac", "1", wav]);
    const out = execFileSync("whisper-cli", ["-m", MODEL, "-l", "fr", "-f", wav, "-nt", "-np"], { encoding: "utf8", maxBuffer: 50 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
    writeFileSync(txtOf(dir, f), out);
    if ((i + 1) % 20 === 0 || i + 1 === todo.length) console.log(`  ${i + 1}/${todo.length} vocaux transcrits`);
  });
}

function textOf(dir: string, file: string): string | null {
  if (!existsSync(txtOf(dir, file))) return null;
  const text = readFileSync(txtOf(dir, file), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !HALLUCINATION.test(l) && !/^\[(BLANK_AUDIO|Musique|Music)\]$/i.test(l))
    .join(" ");
  return text.trim() || "(vocal sans parole)";
}

async function contactFor(chatName: string): Promise<string | null> {
  const digits = /^[+\d\s]+$/.test(chatName) ? phoneDigits(chatName) : null;
  if (digits) return digits;
  const { data } = await db.from("whatsapp_threads").select("contact").eq("contact_name", chatName);
  return data?.length === 1 ? (data[0].contact as string) : null;
}

async function main() {
  const zips = readdirSync(zipDir).filter((f) => /^WhatsApp Chat - .+\.zip$/.test(f));
  const total = { vocaux: 0, completes: 0, ajoutes: 0, deja: 0 };
  for (const zip of zips) {
    const chatName = zip.replace(/^WhatsApp Chat - /, "").replace(/\.zip$/, "");
    const contact = await contactFor(chatName);
    if (!contact) {
      console.log(`? ${chatName} : contact introuvable dans le CRM, ignoré`);
      continue;
    }
    const dir = join(workDir, contact);
    mkdirSync(dir, { recursive: true });
    execFileSync("unzip", ["-o", "-q", join(zipDir, zip), "-d", dir]);
    const voices = voicesOf(readFileSync(join(dir, "_chat.txt"), "utf8")).filter((v) => existsSync(join(dir, v.file)));
    console.log(`${chatName} : ${voices.length} vocaux`);
    transcribe(dir, voices.map((v) => v.file));

    const { data: rows } = await db.from("whatsapp_messages").select("id, direction, type, transcript, sent_at").eq("contact", contact).in("type", ["media_placeholder", "audio"]);
    const pool = (rows ?? []).map((r) => ({ ...r, t: Date.parse(r.sent_at as string), used: false }));
    for (const v of voices) {
      total.vocaux++;
      const text = textOf(dir, v.file);
      const match = pool
        .filter((r) => !r.used && r.direction === v.direction && Math.abs(r.t - v.sentAt.getTime()) <= 2000)
        .sort((a, b) => (a.type === "audio" ? 0 : 1) - (b.type === "audio" ? 0 : 1))[0];
      if (match) {
        match.used = true;
        if (match.type === "audio" && match.transcript) {
          total.deja++;
          continue;
        }
        await db.from("whatsapp_messages").update({ type: "audio", body: null, media_type: "audio/ogg", transcript: text, transcript_error: null }).eq("id", match.id);
        total.completes++;
      } else {
        await db.from("whatsapp_messages").upsert(
          { id: `export:${contact}:${v.file}`, contact, direction: v.direction, origin: "export", type: "audio", media_type: "audio/ogg", transcript: text, sent_at: v.sentAt.toISOString() },
          { onConflict: "id" },
        );
        total.ajoutes++;
      }
    }
    await db.rpc("whatsapp_refresh_threads", { contacts: [contact] });
  }
  console.log(JSON.stringify(total));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
