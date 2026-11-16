// Commande de la tâche « App Mastery · sorties vidéo » (aucun email n'est
// jamais envoyé, seulement des brouillons Brevo) :
//   run                       repère les nouvelles vidéos et crée leurs brouillons
//   etat                      les vidéos suivies et où en est leur email
//   essai [id vidéo | --script=<slug>] [--local] [--brevo]
//                             prépare l'email d'une vidéo (la dernière par
//                             défaut, ou une vidéo pas encore sortie d'après
//                             son script) et écrit son HTML dans un fichier, sans
//                             rien enregistrer. `--local` utilise la session
//                             Claude Code du Mac ; `--brevo` crée en plus un
//                             brouillon « [ESSAI] » SANS destinataires.
import { execFile } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { SCRIPTS } from "@/app/admin/scripts/scripts-data";
import { createDraftCampaign } from "@/lib/video-email/brevo";
import { campaignName, prepareEmail, runVideoEmails, type VideoEmailEnv } from "@/lib/video-email/job";
import { fetchUploads, isLongVideo, type Upload } from "@/lib/video-email/youtube";

const run = promisify(execFile);
const [cmd, ...args] = process.argv.slice(2);
const print = (x: unknown) => console.log(JSON.stringify(x, null, 2));

function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} manquant`);
  return v;
}

// Fil de notifications Harness, relayé sur Telegram. Absent sur le Mac.
const notify: VideoEmailEnv["notify"] = async (n) => {
  const argv = ["feed", "post", n.title, "--level", n.level, "--source", "videos", "--body", n.body, "--dedupe", n.dedupe];
  if (n.url) argv.push("--url", n.url);
  try {
    await run("maxxing", argv);
  } catch (e) {
    console.error(`Notification non postée : ${e instanceof Error ? e.message : e}`);
  }
};

async function main() {
  switch (cmd) {
    case "run": {
      const db = createClient(need("NEXT_PUBLIC_SUPABASE_URL"), need("SUPABASE_SERVICE_ROLE_KEY"));
      return print(await runVideoEmails({ db, youtubeKey: need("YOUTUBE_API_KEY"), brevoKey: need("BREVO_API_KEY"), notify }));
    }
    case "etat": {
      const db = createClient(need("NEXT_PUBLIC_SUPABASE_URL"), need("SUPABASE_SERVICE_ROLE_KEY"));
      const { data, error } = await db.from("video_emails").select("video_id, title, published_at, statut, source, subject, brevo_campaign_id, recipients, missing, attempts, error").order("published_at", { ascending: false }).limit(20);
      if (error) throw new Error(error.message);
      return print(data);
    }
    case "essai": {
      const id = args.find((a) => !a.startsWith("--"));
      // --script=<slug> : vidéo pas encore sortie, d'après son script de
      // /admin/scripts ; le bouton mène alors à la page Vidéos de la chaîne.
      const slug = args.find((a) => a.startsWith("--script="))?.slice(9);
      let v: Upload | undefined;
      if (slug) {
        const s = SCRIPTS.find((x) => x.slug === slug);
        if (!s) throw new Error(`Script inconnu : ${slug}`);
        v = { id: slug, title: s.title, description: s.description, publishedAt: new Date().toISOString(), durationS: 1_200, live: "none", privacy: "public" };
      } else {
        const uploads = (await fetchUploads(need("YOUTUBE_API_KEY"), 25)).filter(isLongVideo);
        v = id ? uploads.find((u) => u.id === id) : uploads[0];
      }
      if (!v) throw new Error("Vidéo introuvable parmi les 25 dernières vidéos longues");
      const prepared = await prepareEmail(v, { localLogin: args.includes("--local"), videoLink: slug ? "https://www.youtube.com/@jeremyptlt/videos" : undefined });
      const file = join(tmpdir(), `email-sortie-${v.id}.html`);
      await writeFile(file, prepared.html);
      let brouillon: number | null = null;
      if (args.includes("--brevo")) {
        const key = need("BREVO_API_KEY");
        const campaignId = await createDraftCampaign(key, { name: `[ESSAI] ${campaignName(v)}`, subject: prepared.email.objet, previewText: prepared.email.apercu, html: prepared.html, listId: null });
        brouillon = campaignId;
      }
      return print({ video: v.title, source: prepared.source, script: prepared.script?.slug ?? null, tag: prepared.tag, email: prepared.email, html: file, brouillon });
    }
    default:
      throw new Error("Commandes : run, etat, essai [id vidéo | --script=<slug>] [--local] [--brevo]");
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
