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

// Segmentation : marque le contact qualifié / non qualifié (best-effort).
// Nécessite des attributs Brevo CANDIDATURE (texte) et CANDIDATURE_SCORE (nombre).
// Si absents côté Brevo, l'appel échoue sans bloquer le reste.
async function tagBrevoQualification(email: string, qualified: boolean, score: number) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;
  const res = await fetch(
    `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
    {
      method: "PUT",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        attributes: {
          CANDIDATURE: qualified ? "qualifie" : "non-qualifie",
          CANDIDATURE_SCORE: score,
        },
      }),
    },
  );
  if (!res.ok) {
    console.error("Brevo tag qualification error:", JSON.stringify(await res.json()));
  }
}

// value -> label lisible, depuis la config des questions.
function answerLabel(qid: keyof CandidatureAnswers, value: string): string {
  const q = QUESTIONS.find((x) => x.id === qid);
  if (!q || q.type === "text") return value;
  return q.options?.find((o) => o.value === value)?.label ?? value;
}

async function sendEmail(payload: Record<string, unknown>): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Jeremy Pitault", email: "contact@jeremypitault.com" },
      ...payload,
    }),
  });
  if (!res.ok) console.error("Brevo email error:", await res.text());
  return res.ok;
}

// Notification interne à chaque candidature.
async function sendAdminNotif(
  firstName: string,
  email: string,
  phone: string,
  answers: CandidatureAnswers,
  score: number,
  qualified: boolean,
) {
  const rows = (Object.keys(answers) as (keyof CandidatureAnswers)[])
    .map((id) => {
      const q = QUESTIONS.find((x) => x.id === id);
      const val = q?.type === "text" ? answers[id] : answerLabel(id, answers[id]);
      return `<p style="margin:0 0 6px"><strong>${q?.title ?? id} :</strong> ${val}</p>`;
    })
    .join("");

  await sendEmail({
    to: [{ email: "contact@jeremypitault.com" }],
    replyTo: { name: firstName, email },
    subject: `[Candidature ${qualified ? "QUALIFIÉ ✅" : "non qualifié"}] ${firstName} (${score} pts)`,
    tags: ["candidature-admin"],
    htmlContent: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="font-size:18px">Nouvelle candidature ${qualified ? "qualifiée" : "non qualifiée"}</h2>
        <p style="margin:0 0 4px"><strong>Prénom :</strong> ${firstName}</p>
        <p style="margin:0 0 4px"><strong>Email :</strong> ${email}</p>
        <p style="margin:0 0 4px"><strong>Téléphone :</strong> ${phone}</p>
        <p style="margin:0 0 16px"><strong>Score :</strong> ${score} / 100</p>
        ${rows}
      </div>`,
  });
}

// Email de confirmation au prospect (contenu selon qualification).
async function sendProspectEmail(firstName: string, email: string, qualified: boolean) {
  const greeting = `Salut ${firstName},`;
  const htmlContent = qualified
    ? `
      <p>${greeting}</p>
      <p>Merci pour ta candidature, elle est validée.</p>
      <p>Dernière étape : choisis ton créneau pour qu'on se parle 30 minutes de ton projet.</p>
      <p><a href="https://www.jeremypitault.com/appel/reserver?firstName=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}">Réserver mon appel</a></p>
      <p>Tant que tu n'as pas choisi de créneau, rien n'est réservé.</p>
      <p>À très vite,<br>Jeremy</p>`
    : `
      <p>${greeting}</p>
      <p>Merci pour ta candidature.</p>
      <p>Vu là où tu en es, le mieux est de commencer par poser des bases solides avant un appel. Voici par où démarrer, gratuitement :</p>
      <p><a href="https://www.jeremypitault.com/plan-action/video">Le plan d'action gratuit</a></p>
      <p>Avance avec ça, et on se reparle quand ton projet aura pris de l'ampleur.</p>
      <p>À bientôt,<br>Jeremy</p>`;

  await sendEmail({
    to: [{ email }],
    subject: qualified
      ? "Ta candidature est validée, réserve ton appel"
      : "Merci pour ta candidature",
    tags: [qualified ? "candidature-qualifie" : "candidature-non-qualifie"],
    htmlContent,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot : un bot remplit ce champ caché. On simule un succès neutre.
    if ((body.website || "").toString().trim()) {
      return NextResponse.json({ qualified: false, redirectUrl: "/appel/ressource" });
    }

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

    // Brevo + emails (best-effort, ne bloquent jamais la redirection).
    try {
      await addToBrevoList(email, firstName, phone, {
        source: body.utmSource,
        medium: body.utmMedium,
        campaign: body.utmCampaign,
      });
      await tagBrevoQualification(email, qualified, score);
    } catch (err) {
      console.error("Brevo indisponible pour candidature:", err);
    }

    try {
      await Promise.all([
        sendAdminNotif(firstName, email, phone, answers, score, qualified),
        sendProspectEmail(firstName, email, qualified),
      ]);
    } catch (err) {
      console.error("Envoi emails candidature échoué:", err);
    }

    const redirectUrl = qualified
      ? `/appel/reserver?firstName=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}`
      : `/appel/ressource`;

    return NextResponse.json({ qualified, redirectUrl });
  } catch (err) {
    console.error("Erreur candidature:", err);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
