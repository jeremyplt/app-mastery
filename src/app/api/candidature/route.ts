import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import {
  QUESTIONS,
  qualify,
  isValidAnswer,
  type CandidatureAnswers,
} from "@/lib/candidature";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const firstName = (body.firstName || "").toString().trim();
    const email = (body.email || "").toString().trim().toLowerCase();
    const phone = (body.phone || "").toString().trim();

    if (!firstName) {
      return NextResponse.json({ error: "Entre ton prénom" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Entre une adresse email valide" }, { status: 400 });
    }
    if (!/^\+[1-9]\d{6,14}$/.test(phone)) {
      return NextResponse.json({ error: "Entre un numéro de téléphone valide" }, { status: 400 });
    }

    const answers: CandidatureAnswers = {
      q1: (body.q1 || "").toString(),
      q2: (body.q2 || "").toString(),
      q3: (body.q3 || "").toString(),
      q4: (body.q4 || "").toString(),
      q5: (body.q5 || "").toString().trim(),
      q6: (body.q6 || "").toString(),
    };

    for (const q of QUESTIONS) {
      if (!isValidAnswer(q, answers[q.id])) {
        return NextResponse.json(
          { error: `Réponse manquante ou invalide : ${q.title}` },
          { status: 400 },
        );
      }
    }

    const { score, qualified } = qualify(answers);

    // Stockage Supabase (best-effort : on ne bloque pas la redirection si la DB échoue).
    try {
      const supabase = getAdminClient();
      const { error } = await supabase.from("candidatures").insert({
        first_name: firstName,
        email,
        phone,
        q1_stage: answers.q1,
        q2_goal: answers.q2,
        q3_revenue: answers.q3,
        q4_status: answers.q4,
        q5_attentes: answers.q5,
        q6_hours: answers.q6,
        score,
        qualified,
        utm_source: body.utmSource || null,
        utm_medium: body.utmMedium || null,
        utm_campaign: body.utmCampaign || null,
      });
      if (error) console.error("Insert candidature échoué:", error.message);
    } catch (err) {
      console.error("Supabase indisponible pour candidature:", err);
    }

    const redirectUrl = qualified
      ? `/appel/reserver?firstName=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}`
      : `/candidature/ressource`;

    return NextResponse.json({ qualified, redirectUrl });
  } catch (err) {
    console.error("Erreur candidature:", err);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
