import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { sendBuiltEmail } from "@/lib/emails/send";
import { adminAlert } from "@/lib/emails/ventes";
import { esc } from "@/lib/emails/layout";
import { QUESTIONS } from "@/lib/questionnaire";

// Questionnaire de démarrage, côté élève (pas de connexion : le jeton unique
// de l'élève dans l'URL fait office de clé).

const UUID = /^[0-9a-f-]{36}$/i;

async function findStudent(token: string | null) {
  if (!token || !UUID.test(token)) return null;
  const { data } = await getAdminClient()
    .from("students")
    .select("id, name, app, phone, links, questionnaire, questionnaire_answered_at")
    .eq("questionnaire_token", token)
    .maybeSingle();
  return data;
}

export async function GET(req: NextRequest) {
  const s = await findStudent(req.nextUrl.searchParams.get("token"));
  if (!s) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });
  return NextResponse.json({
    firstName: s.name.split(" ")[0],
    answered: Boolean(s.questionnaire_answered_at),
    answers: s.questionnaire ?? {},
    questions: QUESTIONS,
  });
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const s = await findStudent(b.token);
  if (!s) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });

  const answers: Record<string, string> = {};
  for (const q of QUESTIONS) {
    const v = String(b.answers?.[q.id] ?? "").trim().slice(0, 3000);
    if (q.required && !v) return NextResponse.json({ error: `Réponds à : « ${q.label} »` }, { status: 400 });
    if (q.type === "choice" && v && !q.choices?.includes(v)) return NextResponse.json({ error: "Réponse invalide" }, { status: 400 });
    if (v) answers[q.id] = v;
  }

  // Les réponses complètent la fiche quand elle est vide : app, téléphone,
  // lien de l'app.
  const update: Record<string, unknown> = { questionnaire: answers, questionnaire_answered_at: new Date().toISOString() };
  if (answers.app && !s.app) update.app = answers.app;
  if (answers.whatsapp && !s.phone) update.phone = answers.whatsapp;
  const links = (s.links ?? []) as { label: string; url: string }[];
  if (answers.store_link && /^https?:\/\//.test(answers.store_link) && !links.some((l) => l.url === answers.store_link)) {
    update.links = [...links, { label: "Lien de l'app", url: answers.store_link }];
  }
  const { error } = await getAdminClient().from("students").update(update).eq("id", s.id);
  if (error) return NextResponse.json({ error: "Enregistrement impossible, réessaie" }, { status: 500 });

  // Alerte à Jeremy avec les réponses.
  const lines = [
    `<b>${esc(s.name)}</b> a répondu au questionnaire de démarrage.`,
    ...QUESTIONS.filter((q) => answers[q.id]).map((q) => `<b>${esc(q.label)}</b><br>${esc(answers[q.id]).replace(/\n/g, "<br>")}`),
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
