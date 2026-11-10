// Contenus d'inspiration (GIGA BANQUE), lancé par Harness Maxxing (run.sh).
//   run                          traite la plus ancienne demande en attente
//   essai "<niche>" "mot1|mot2"  essai à blanc : cherche et vérifie, n'écrit rien
import { createClient } from "@supabase/supabase-js";
import { existingSteps, processRequest, stepsAt, type InspirationRequest } from "@/lib/contenus/pipeline";

const [cmd, ...args] = process.argv.slice(2);
const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
const print = (o: unknown) => console.log(JSON.stringify(o, null, 2));

function env(dryRun = false) {
  const scrapeKey = process.env.SCRAPECREATORS_API_KEY;
  if (!scrapeKey) throw new Error("SCRAPECREATORS_API_KEY manquant");
  return { db: db(), scrapeKey, scriptUrl: process.env.GIGA_BANQUE_SCRIPT_URL, scriptSecret: process.env.GIGA_BANQUE_SCRIPT_SECRET, dryRun, log: (s: string) => console.error(s) };
}

async function main() {
  switch (cmd) {
    case "run": {
      const e = env();
      const { data: req } = await e.db.from("inspiration_requests").select("id, student_id, contact, niche, mots_cles").eq("statut", "a_faire").order("created_at").limit(1).maybeSingle();
      if (!req) return print({ demandes: 0 });
      await e.db.from("inspiration_requests").update({ statut: "en_cours", updated_at: new Date().toISOString() }).eq("id", req.id);
      try {
        const r = await processRequest(e, req as InspirationRequest);
        const now = new Date().toISOString();
        await e.db
          .from("inspiration_requests")
          .update({ statut: "fait", etape: "fini", lien: r.lien, nb_liens: r.videos.length, liens: r.videos, section_titre: r.existante ?? null, erreur: null, updated_at: now })
          .eq("id", req.id);
        // Le brouillon est refait au prochain passage du job WhatsApp, avec le lien.
        if (req.contact) {
          const { data: t } = await e.db.from("whatsapp_threads").select("progress").eq("contact", req.contact).maybeSingle();
          const cur = (t?.progress ?? {}) as Record<string, unknown>;
          await e.db
            .from("whatsapp_threads")
            .update({ summarized_through: null, progress: { ...cur, contenus: { etapes: r.existante ? existingSteps(r.existante) : stepsAt("fini"), maj: now, lien: r.lien, nb: r.videos.length } } })
            .eq("contact", req.contact);
        }
        return print({ ok: true, videos: r.videos.length, lien: r.lien, existante: r.existante ?? null });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const { data: cur } = await e.db.from("inspiration_requests").select("etape").eq("id", req.id).maybeSingle();
        await e.db.from("inspiration_requests").update({ statut: "erreur", erreur: message, updated_at: new Date().toISOString() }).eq("id", req.id);
        if (req.contact) {
          const step = (["banque", "recherche", "verification", "drive"].includes(cur?.etape ?? "") ? cur!.etape : "banque") as "banque" | "recherche" | "verification" | "drive";
          const { data: t } = await e.db.from("whatsapp_threads").select("progress").eq("contact", req.contact).maybeSingle();
          const p = (t?.progress ?? {}) as Record<string, unknown>;
          await e.db.from("whatsapp_threads").update({ progress: { ...p, contenus: { etapes: stepsAt(step, "erreur", message), maj: new Date().toISOString() } } }).eq("contact", req.contact);
        }
        throw err;
      }
    }
    case "essai": {
      const [niche, mots] = args;
      if (!niche || !mots) throw new Error('Usage : essai "<niche>" "mot1|mot2"');
      const r = await processRequest(env(true), { id: "essai", student_id: null, contact: null, niche, mots_cles: mots.split("|") });
      if (r.existante) return print({ existante: r.existante, lien: r.lien });
      return print(r.videos.map((v) => ({ url: v.url, vues: v.vues, likes: v.likes, compte: v.compte, app: v.app, description: v.description })));
    }
    default:
      throw new Error('Commandes : run, essai "<niche>" "mot1|mot2"');
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
