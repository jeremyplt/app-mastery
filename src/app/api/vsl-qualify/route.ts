import { NextRequest, NextResponse } from "next/server";
import { sendMetaEvent, getClientInfo } from "@/lib/meta-capi";
import { getAdminClient } from "@/lib/supabase";
import { VSL_QUESTIONS, qualifyVslLead, type VslAnswers } from "@/lib/vsl-qualification";

// Étape 2 de l'opt-in conférence : le contact est déjà créé par /api/subscribe,
// cette route enregistre les réponses de pré-qualification et n'envoie
// l'événement Meta Lead (CAPI) QUE si le lead est qualifié. Le Pixel
// navigateur envoie le même event_id : Meta déduplique.

function isValidAnswer(id: VslQuestionId, value: unknown): value is string {
  const question = VSL_QUESTIONS.find((q) => q.id === id);
  return Boolean(question && typeof value === "string" && question.options.includes(value));
}

type VslQuestionId = (typeof VSL_QUESTIONS)[number]["id"];

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, phone, age, profession, objectif, invest, metaEventId, fbp, fbc, eventSourceUrl } =
      await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    if (
      !isValidAnswer("age", age) ||
      !isValidAnswer("profession", profession) ||
      !isValidAnswer("objectif", objectif) ||
      !isValidAnswer("invest", invest)
    ) {
      return NextResponse.json({ error: "Réponses invalides" }, { status: 400 });
    }

    const answers: VslAnswers = { age, profession, objectif, invest };
    const qualified = qualifyVslLead(answers);
    const normalizedEmail = String(email).toLowerCase();

    // Attributs Brevo (best-effort) : segmentation des campagnes et lecture
    // rapide du profil depuis la fiche contact.
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (BREVO_API_KEY) {
      const brevoRes = await fetch(
        `https://api.brevo.com/v3/contacts/${encodeURIComponent(normalizedEmail)}`,
        {
          method: "PUT",
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            attributes: {
              VSL_AGE: age,
              VSL_PROFESSION: profession,
              VSL_OBJECTIF: objectif,
              VSL_INVEST: invest,
              VSL_QUALIFIED: qualified,
            },
          }),
        },
      );
      if (!brevoRes.ok) {
        console.error("Brevo VSL attributes update error:", await brevoRes.text());
      }
    }

    // CRM Supabase (best-effort) : réponses visibles dans l'admin.
    try {
      const supabase = getAdminClient();
      const { error: crmError } = await supabase
        .from("crm_leads")
        .update({ age, profession, objectif, invest, qualified })
        .eq("email", normalizedEmail)
        .eq("source", "vsl");
      if (crmError) {
        console.error("CRM qualification update error:", crmError.message);
      }
    } catch (err) {
      console.error("CRM qualification update error:", err);
    }

    // Meta CAPI : Lead uniquement pour les leads qualifiés, pour que Meta
    // optimise le ciblage sur les bons profils.
    if (qualified && metaEventId) {
      await sendMetaEvent({
        eventName: "Lead",
        eventId: metaEventId,
        eventSourceUrl: eventSourceUrl || "https://www.jeremypitault.com/",
        userData: {
          email: normalizedEmail,
          phone: phone || undefined,
          firstName: firstName || undefined,
          fbp,
          fbc,
          ...getClientInfo(req),
        },
        // value/currency requis par Meta sur Lead pour le calcul du ROAS
        // (valeur nominale, Meta exige value > 0).
        customData: { content_name: "vsl", value: 1, currency: "EUR" },
      });
    }

    return NextResponse.json({ success: true, qualified });
  } catch {
    console.error("VSL qualify error");
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
