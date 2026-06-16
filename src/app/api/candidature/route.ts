import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import {
  QUESTIONS,
  qualify,
  isValidAnswer,
  type CandidatureAnswers,
} from "@/lib/candidature";

const BREVO_LIST_ID = 20;

// Ajoute / met à jour le contact dans la liste Brevo #20 (best-effort).
async function addToBrevoList(
  email: string,
  firstName: string,
  phone: string,
  utm: { source?: string; medium?: string; campaign?: string },
) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("BREVO_API_KEY manquante, contact non ajouté");
    return;
  }

  const attributes: Record<string, string> = {};
  if (firstName) attributes.FIRSTNAME = firstName;
  if (utm.source) attributes.UTM_SOURCE = utm.source;
  if (utm.medium) attributes.UTM_MEDIUM = utm.medium;
  if (utm.campaign) attributes.UTM_CAMPAIGN = utm.campaign;

  const createRes = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      updateEnabled: true,
      listIds: [BREVO_LIST_ID],
      attributes,
    }),
  });

  if (!createRes.ok) {
    const data = await createRes.json();
    // Contact déjà existant : on l'ajoute à la liste séparément.
    if (data.code === "duplicate_parameter") {
      const listRes = await fetch(
        `https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}/contacts/add`,
        {
          method: "POST",
          headers: { "api-key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({ emails: [email] }),
        },
      );
      if (!listRes.ok) {
        console.error("Brevo add to list error:", JSON.stringify(await listRes.json()));
      }
    } else {
      console.error("Brevo create contact error:", JSON.stringify(data));
    }
  }

  // SMS séparément (peut échouer si format refusé côté Brevo, sans bloquer).
  if (phone) {
    const smsRes = await fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
      {
        method: "PUT",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ attributes: { SMS: phone } }),
      },
    );
    if (!smsRes.ok) {
      console.error("Brevo SMS update error:", JSON.stringify(await smsRes.json()));
    }
  }
}

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

    // Ajout à la liste Brevo #20 (best-effort, ne bloque pas la redirection).
    try {
      await addToBrevoList(email, firstName, phone, {
        source: body.utmSource,
        medium: body.utmMedium,
        campaign: body.utmCampaign,
      });
    } catch (err) {
      console.error("Brevo indisponible pour candidature:", err);
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
