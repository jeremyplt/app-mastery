import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { sendBuiltEmail } from "@/lib/emails/send";
import { adminAlert } from "@/lib/emails/ventes";
import { esc } from "@/lib/emails/layout";
import { ACCESS_ANSWER_ID, QUESTIONS, answerEntries } from "@/lib/questionnaire-questions";

// Questionnaire de démarrage, côté élève (pas de connexion : le jeton unique
// de l'élève dans l'URL fait office de clé).

const UUID = /^[0-9a-f-]{36}$/i;

async function findStudent(token: string | null) {
  if (!token || !UUID.test(token)) return null;
  const { data } = await getAdminClient()
    .from("students")
    .select("id, name, app, links, questionnaire, questionnaire_answered_at")
    .eq("questionnaire_token", token)
    .maybeSingle();
  return data;
}

export async function GET(req: NextRequest) {
  const s = await findStudent(req.nextUrl.searchParams.get("token"));
  if (!s) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });
  return NextResponse.json({
    firstName: s.name.split(" ")[0],
    name: s.name,
    answered: Boolean(s.questionnaire_answered_at),
    // Le nom de l'app déjà connu pré-remplit la première question.
    answers: s.questionnaire ?? (s.app ? { app: s.app } : {}),
    questions: QUESTIONS,
  });
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const s = await findStudent(b.token);
  if (!s) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });

  const raw = (k: string) => String(b.answers?.[k] ?? "").trim().slice(0, 3000);
  const answers: Record<string, string> = {};
  for (const q of QUESTIONS) {
    if (q.type === "fields") {
      for (const f of q.fields ?? []) if (raw(`${q.id}.${f.id}`)) answers[`${q.id}.${f.id}`] = raw(`${q.id}.${f.id}`);
      continue;
    }
    const v = raw(q.id);
    if (q.required && !v) return NextResponse.json({ error: `Réponds à : « ${q.label} »` }, { status: 400 });
    if (q.type === "choice" && v && !q.choices?.includes(v)) return NextResponse.json({ error: "Réponse invalide" }, { status: 400 });
    if (v) answers[q.id] = v;
  }
  if (b.answers?.[ACCESS_ANSWER_ID] === "Oui") answers[ACCESS_ANSWER_ID] = "Oui";

  // Les réponses complètent la fiche : nom de l'app s'il manque, et les liens
  // (stores, réseaux sociaux) ajoutés à « Liens et documents ».
  const update: Record<string, unknown> = { questionnaire: answers, questionnaire_answered_at: new Date().toISOString() };
  if (answers.app && !s.app) update.app = answers.app;
  const links = [...((s.links ?? []) as { label: string; url: string }[])];
  const linkLabels: Record<string, string> = { "app_links.ios": "App Store", "app_links.android": "Google Play" };
  for (const q of QUESTIONS.filter((x) => x.type === "fields")) {
    for (const f of q.fields ?? []) {
      const key = `${q.id}.${f.id}`;
      const v = answers[key];
      if (!f.url || !v) continue;
      const url = /^https?:\/\//.test(v) ? v : /^[\w-]+(\.[\w-]+)+/.test(v) ? `https://${v}` : null;
      if (url && !links.some((l) => l.url === url)) links.push({ label: linkLabels[key] ?? f.label, url });
    }
  }
  if (links.length !== (s.links ?? []).length) update.links = links;
  const { error } = await getAdminClient().from("students").update(update).eq("id", s.id);
  if (error) return NextResponse.json({ error: "Enregistrement impossible, réessaie" }, { status: 500 });

  // Alerte à Jeremy avec les réponses.
  const lines = [
    `<b>${esc(s.name)}</b> a répondu au questionnaire de démarrage.`,
    ...answerEntries(answers).map((e) => `<b>${esc(e.label)}</b><br>${esc(e.value).replace(/\n/g, "<br>")}`),
  ];
  await sendBuiltEmail(
    { email: "jeremypltpro@gmail.com", name: "Jeremy" },
    adminAlert(`📝 ${s.name} a répondu au questionnaire`, lines, "eleve-questionnaire-admin", {
      label: "Ouvrir sa fiche",
      href: `https://www.jeremypitault.com/admin/eleves/${s.id}`,
    }),
  ).catch(() => null);

  return NextResponse.json({ ok: true });
}
