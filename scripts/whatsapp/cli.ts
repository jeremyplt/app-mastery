// Commande du job WhatsApp (lecture seule, rien n'est jamais envoyé) :
//   run              copie les messages, transcrit les vocaux, résume les fils
//   sync             copie seulement les nouveaux messages depuis Kapso
//   sync-complet     relit tout l'historique chez Kapso (messages manquants,
//                    pièces jointes arrivées après coup)
//   status           fils qui attendent une réponse
//   essai <numéro>   résume un fil (avec la base de conseils) et affiche le résultat, sans rien enregistrer
import { createClient } from "@supabase/supabase-js";
import { summarize, type PromptMessage } from "@/lib/whatsapp/ai";
import { loadConseils, summarizeThreads, syncMessages, transcribeVoiceNotes, type JobEnv } from "@/lib/whatsapp/job";
import { awaitingReply, type Thread } from "@/lib/whatsapp/messages";

const [cmd, ...args] = process.argv.slice(2);
const print = (x: unknown) => console.log(JSON.stringify(x, null, 2));

function env(): JobEnv {
  const apiKey = process.env.KAPSO_API_KEY;
  const phoneNumberId = process.env.KAPSO_PHONE_NUMBER_ID;
  if (!apiKey || !phoneNumberId) throw new Error("KAPSO_API_KEY ou KAPSO_PHONE_NUMBER_ID manquant");
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
  return { db, apiKey, phoneNumberId };
}

async function main() {
  switch (cmd) {
    case "run": {
      const e = env();
      const copie = await syncMessages(e);
      // Les fichiers de l'historique arrivent après coup : on repasse sur les
      // messages avec fichier à chaque fois (quelques pages seulement).
      const medias = await syncMessages(e, { media: true, full: true, maxPages: 20 });
      const vocaux = await transcribeVoiceNotes(e);
      const resumes = await summarizeThreads(e);
      return print({ copie: { nouveaux: copie.nouveaux + medias.nouveaux, completes: medias.completes }, vocaux, resumes });
    }
    case "sync": {
      const r = await syncMessages(env());
      return print({ nouveaux: r.nouveaux, completes: r.completes, contacts: r.contacts.length });
    }
    case "sync-complet": {
      const r = await syncMessages(env(), { full: true, maxPages: 300 });
      return print({ nouveaux: r.nouveaux, completes: r.completes, contacts: r.contacts.length });
    }
    case "status": {
      const { data, error } = await env().db.from("whatsapp_threads").select("contact, contact_name, last_inbound_at, last_outbound_at, summarized_through, handled_at, summary, error");
      if (error) throw new Error(error.message);
      const waiting = (data ?? []).filter((t) => awaitingReply(t as Thread));
      return print({ fils: data?.length ?? 0, a_repondre: waiting.map((t) => ({ nom: t.contact_name, depuis: t.last_inbound_at, resume: t.summary ? "oui" : "non", erreur: t.error })) });
    }
    case "essai": {
      const contact = args[0];
      if (!contact) throw new Error("Usage : essai <numéro>");
      const { db } = env();
      const { data } = await db.from("whatsapp_messages").select("direction, type, body, transcript, transcript_error, sent_at").eq("contact", contact).order("sent_at", { ascending: false }).limit(40);
      const { data: t } = await db.from("whatsapp_threads").select("contact_name, last_outbound_at").eq("contact", contact).maybeSingle();
      const messages = ((data ?? []) as PromptMessage[]).reverse();
      const conseils = await loadConseils(db);
      return print(await summarize(messages, { who: `Interlocuteur : ${t?.contact_name ?? "contact"}.`, now: new Date(), newSince: t?.last_outbound_at ?? null, conseils }));
    }
    default:
      throw new Error("Commandes : run, sync, sync-complet, status, essai <numéro>");
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
