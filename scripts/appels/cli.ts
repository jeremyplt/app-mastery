// Commande du job « App Mastery · appels » (rien n'est jamais envoyé aux élèves) :
//   run                 demande les fiches des appels du jour (à partir de 6 h),
//                       puis écrit les fiches demandées depuis le CRM
//   a-venir [jours]     appels élèves des prochains jours (7 par défaut)
//   essai <élève>       écrit la fiche du prochain appel d'un élève (id ou
//                       début du nom) et l'affiche, sans rien enregistrer ;
//                       `--local` pour utiliser la session Claude Code du Mac,
//                       `--type=kickoff|probleme` pour forcer le type d'appel
import { createClient } from "@supabase/supabase-js";
import { upcomingStudentCalls } from "@/lib/appels/calls";
import { processPreps, prepParts, queueTodayCalls, type PrepJobEnv } from "@/lib/appels/job";
import { generatePrep } from "@/lib/appels/prep";
import { loadConseils } from "@/lib/whatsapp/job";

const [cmd, ...args] = process.argv.slice(2);
const print = (x: unknown) => console.log(JSON.stringify(x, null, 2));

function env(): PrepJobEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant");
  return { db: createClient(url, key), calendlyPat: process.env.CALENDLY_PAT ?? null };
}

async function main() {
  switch (cmd) {
    case "run": {
      const e = env();
      const matin = await queueTodayCalls(e);
      const fiches = await processPreps(e);
      return print({ matin, fiches });
    }
    case "a-venir": {
      const e = env();
      const days = Number(args[0]) || 7;
      const now = new Date();
      const r = await upcomingStudentCalls(e.db, { pat: e.calendlyPat, from: new Date(now.getTime() - 2 * 3_600_000), to: new Date(now.getTime() + days * 86_400_000) });
      return print({ calendly: r.calendly, appels: r.calls.map((c) => ({ quand: c.starts_at, eleve: c.student_name, titre: c.title, type: c.kind, relie_par: c.match })) });
    }
    case "essai": {
      const who = args.filter((a) => !a.startsWith("--")).join(" ").trim();
      if (!who) throw new Error("Usage : essai <id ou nom de l'élève> [--local]");
      const e = env();
      const isId = /^[0-9a-f-]{36}$/i.test(who);
      const base = e.db.from("students").select("id, name");
      const { data: students } = await (isId ? base.eq("id", who) : base.ilike("name", `${who}%`));
      if (!students?.length) throw new Error("Élève introuvable");
      if (students.length > 1) throw new Error(`Plusieurs élèves : ${students.map((s) => s.name).join(", ")}`);
      const student = students[0];
      const now = new Date();
      const { calls } = await upcomingStudentCalls(e.db, { pat: e.calendlyPat, from: new Date(now.getTime() - 2 * 3_600_000), to: new Date(now.getTime() + 30 * 86_400_000), studentId: student.id });
      const call = calls[0];
      const row = call
        ? { student_id: student.id, starts_at: call.starts_at, title: call.title, event_key: call.key }
        : { student_id: student.id, starts_at: now.toISOString(), title: null, event_key: `manuel:${student.id}` };
      const parts = await prepParts(e.db, row, now, await loadConseils(e.db));
      // --type=kickoff ou --type=probleme : forcer le type pour un essai.
      const forced = args.find((a) => a.startsWith("--type="))?.slice(7);
      if (forced === "kickoff" || forced === "probleme") parts.kind = forced;
      const fiche = await generatePrep(parts, { localLogin: args.includes("--local") });
      return print({ eleve: student.name, appel: call ?? "aucun rendez-vous", type: parts.kind, fiche });
    }
    default:
      throw new Error("Commandes : run, a-venir [jours], essai <élève> [--local]");
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
