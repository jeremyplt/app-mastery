// Construit la base de conseils de Jeremy à partir de ses conversations WhatsApp
// avec les élèves (messages écrits et vocaux transcrits).
//
//   npx tsx scripts/whatsapp/conseils.ts <dossier de travail> [--essai] [--themes paywall,pub] [--force]
//
// À lancer sur le Mac (variables de .env.local, session Claude Code ouverte).
// 1. Les conversations où Jeremy a beaucoup écrit sont découpées en paquets, et
//    Claude (sans aucun outil) y relève ses conseils. Chaque paquet est gardé en
//    cache dans le dossier de travail : relancer ne refait que ce qui manque.
// 2. Claude rédige une fiche par thème, enregistrée « à relire » dans
//    whatsapp_conseils. Un thème déjà validé par Jeremy n'est pas touché, sauf
//    avec --force.
//   --essai : relève les conseils du premier paquet et les affiche, sans rien enregistrer.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { contentOf, runClaude, type PromptMessage } from "@/lib/whatsapp/ai";
import { EXTRACT_SCHEMA, EXTRACT_SYSTEM, SYNTH_SCHEMA, SYNTH_SYSTEM, THEMES, extractPrompt, packConversations, parseExtraits, parseSynth, synthPrompt, type ConvLine, type Extrait } from "@/lib/whatsapp/conseils";

const args = process.argv.slice(2);
const workDir = args[0];
if (!workDir || workDir.startsWith("--")) throw new Error("Usage : conseils.ts <dossier de travail> [--essai] [--themes a,b] [--force]");
const essai = args.includes("--essai");
const force = args.includes("--force");
const onlyThemes = args.includes("--themes") ? args[args.indexOf("--themes") + 1].split(",") : null;

// Seules les conversations où Jeremy a vraiment conseillé (pas les prospects).
const MIN_CHARS_JEREMY = 5_000;
const PARALLEL = 3;

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
const day = (iso: string) => new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));

type Row = PromptMessage & { contact: string };

async function allMessages(): Promise<Row[]> {
  const out: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from("whatsapp_messages").select("contact, direction, type, body, transcript, transcript_error, sent_at").order("sent_at").range(from, from + 999);
    if (error) throw new Error(error.message);
    out.push(...((data ?? []) as Row[]));
    if (!data || data.length < 1000) return out;
  }
}

function conversations(rows: Row[]): ConvLine[][] {
  const byContact = new Map<string, Row[]>();
  for (const r of rows) byContact.set(r.contact, [...(byContact.get(r.contact) ?? []), r]);
  const text = (m: Row) => (m.type === "audio" ? m.transcript : ["text", "image", "video", "document"].includes(m.type) ? m.body : null);
  return [...byContact.values()]
    .filter((msgs) => msgs.filter((m) => m.direction === "outbound").reduce((n, m) => n + (text(m)?.length ?? 0), 0) >= MIN_CHARS_JEREMY)
    .map((msgs) =>
      msgs
        .filter((m) => text(m))
        .map((m) => ({ date: day(m.sent_at), who: m.direction === "outbound" ? ("Jeremy" as const) : ("Élève" as const), text: m.type === "audio" ? `(vocal) ${m.transcript}` : contentOf(m) })),
    );
}

async function pool<T, R>(items: T[], n: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i], i);
      }
    }),
  );
  return results;
}

async function ask(system: string, schema: object, prompt: string, model?: string): Promise<unknown> {
  const empty = mkdtempSync(join(tmpdir(), "conseils-vide-"));
  try {
    for (let attempt = 1; ; attempt++) {
      try {
        return await runClaude({ system, schema, prompt, cwd: empty, model, timeoutMs: 900_000, localLogin: true });
      } catch (e) {
        if (attempt >= 2) throw e;
        console.log(`  nouvel essai après : ${e instanceof Error ? e.message : e}`);
      }
    }
  } finally {
    rmSync(empty, { recursive: true, force: true });
  }
}

async function main() {
  mkdirSync(join(workDir, "extraits"), { recursive: true });
  const convs = conversations(await allMessages());
  const chunks = packConversations(convs);
  console.log(`${convs.length} conversations, ${chunks.length} paquets, ${Math.round(chunks.reduce((n, c) => n + c.length, 0) / 1000)} k caractères`);

  // 1. Relevé des conseils, paquet par paquet.
  const todo = essai ? chunks.slice(0, 1) : chunks;
  const extraits = (
    await pool(todo, PARALLEL, async (chunk, i) => {
      const file = join(workDir, "extraits", `${createHash("sha1").update(EXTRACT_SYSTEM + chunk).digest("hex").slice(0, 16)}.json`);
      if (!essai && existsSync(file)) return JSON.parse(readFileSync(file, "utf8")) as Extrait[];
      const t0 = Date.now();
      const { conseils, suspicious } = parseExtraits(await ask(EXTRACT_SYSTEM, EXTRACT_SCHEMA, extractPrompt(chunk), "sonnet"));
      console.log(`  paquet ${i + 1}/${todo.length} : ${conseils.length} conseils (${Math.round((Date.now() - t0) / 1000)} s)${suspicious ? ", CONTENU SUSPECT, à vérifier" : ""}`);
      if (essai) {
        console.log(JSON.stringify(conseils, null, 2));
        return conseils;
      }
      writeFileSync(file, JSON.stringify(conseils));
      return conseils;
    })
  ).flat();
  if (essai) return;
  console.log(`${extraits.length} conseils relevés`);

  // 2. Une fiche par thème.
  const { data: existing } = await db.from("whatsapp_conseils").select("theme, statut");
  const validated = new Set((existing ?? []).filter((r) => r.statut === "valide").map((r) => r.theme as string));
  const themes = THEMES.filter((t) => (!onlyThemes || onlyThemes.includes(t.key)) && (force || !validated.has(t.key)));
  await pool(themes, PARALLEL, async (theme) => {
    const items = extraits.filter((e) => e.theme === theme.key);
    const ordre = THEMES.indexOf(theme);
    if (!items.length) {
      console.log(`  ${theme.titre} : aucun conseil relevé`);
      return;
    }
    const t0 = Date.now();
    const { contenu, a_verifier } = parseSynth(await ask(SYNTH_SYSTEM, SYNTH_SCHEMA, synthPrompt(theme, items)));
    if (!contenu) throw new Error(`fiche vide pour ${theme.titre}`);
    const now = new Date().toISOString();
    const { error } = await db
      .from("whatsapp_conseils")
      .upsert({ theme: theme.key, titre: theme.titre, ordre, contenu, a_verifier, sources: items.length, statut: "a_relire", generated_at: now, validated_at: null, updated_at: now }, { onConflict: "theme" });
    if (error) throw new Error(error.message);
    console.log(`  ${theme.titre} : ${items.length} conseils, fiche de ${contenu.length} caractères, ${a_verifier.length} point(s) à trancher (${Math.round((Date.now() - t0) / 1000)} s)`);
  });
  console.log("FINI");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
