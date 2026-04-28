import { NextRequest, NextResponse } from "next/server";

// Map Brevo list IDs to transactional template IDs and tags
const LIST_CONFIG: Record<number, { templateId: number; tag: string }> = {
  12: { templateId: 16, tag: "piscine-epitech" },
  13: { templateId: 17, tag: "prompt-50-saas" },
  14: { templateId: 19, tag: "workflow-make" },
  15: { templateId: 11, tag: "monetisation" },
  16: { templateId: 14, tag: "openclaw" },
};

async function sendAppelEmail(apiKey: string, email: string, firstName?: string) {
  const greeting = firstName ? `Salut ${firstName},` : "Salut,";
  const htmlContent = `
<p>${greeting}</p>

<p>Merci d'avoir rempli le formulaire pour réserver un appel découverte.</p>

<p>Si tu n'as pas encore choisi de créneau, voici le lien direct pour le faire maintenant :</p>

<p><a href="https://www.jeremypitault.com/appel/reserver">Réserver mon appel</a></p>

<p>Avant qu'on se parle, prends 2 minutes pour bien comprendre l'objectif de cet appel :</p>

<ul>
  <li>On fait le point sur ton projet d'app et ta situation actuelle</li>
  <li>Je te dis honnêtement si la formation ou l'accompagnement peuvent t'aider</li>
  <li>Si oui, on définit ensemble la solution la plus adaptée</li>
  <li>Si non, je te donne quand même un plan d'action concret pour avancer seul</li>
</ul>

<p>L'idée de l'appel, c'est vraiment de voir ensemble si on peut travailler ensemble. Pour que ce soit utile pour toi, viens en étant ouvert à investir sur toi et sur ton projet, c'est ce qui fait toute la différence.</p>

<p>À très vite,<br>Jeremy</p>

<p>P.S. Si tu as des questions avant l'appel, réponds directement à cet email. Je lis tout.</p>
`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Jeremy Pitault", email: "contact@jeremypitault.com" },
      to: [{ email }],
      subject: "Ton appel découverte est presque réservé",
      htmlContent,
      tags: ["appel-decouverte"],
    }),
  });

  const body = await res.text();
  console.log(`Brevo appel email to ${email}: ${res.status} ${body}`);
  return res.ok;
}

async function sendPlanActionEmail(apiKey: string, email: string, firstName?: string) {
  const greeting = firstName ? `Salut ${firstName},` : "Salut,";
  const htmlContent = `
<p>${greeting}</p>

<p>Merci d'avoir demandé le Plan d'Action.</p>

<p>Voici ton accès : <a href="https://www.jeremypitault.com/plan-action/video">Regarder le Plan d'Action</a></p>

<p>Dedans, tu vas découvrir :</p>

<ul>
  <li>Comment j'ai trouvé et validé mon idée d'app (et l'erreur qui m'a fait perdre 3 mois)</li>
  <li>Le workflow exact que j'utilise pour créer des apps avec l'IA, sans coder moi-même</li>
  <li>La stratégie marketing qui a généré des millions de vues en organique</li>
  <li>La stratégie de scaling pour atteindre 10k MRR</li>
</ul>

<p>Prends quelques minutes pour la regarder. C'est la version condensée de tout ce que j'ai appris en 3 ans.</p>

<p>Mais il y a un truc que je n'ai pas mis dans la vidéo.</p>

<p>C'est le moment précis où tout a basculé pour moi. Le jour où j'ai failli tout abandonner, et ce qui s'est passé juste après.</p>

<p>Je t'en parle demain.</p>

<p>En attendant, si tu as déjà une app ou un projet en tête et que tu veux un regard extérieur, je propose un audit gratuit de 30 minutes. Toi et moi, en appel. On analyse ton projet et je te donne un plan d'action personnalisé.</p>

<p><a href="https://www.jeremypitault.com/appel">Réserve ton audit gratuit</a></p>

<p>À demain,<br>Jeremy</p>

<p>P.S. Si tu as des questions après avoir regardé le Plan d'Action, réponds directement à cet email. Je lis tout.</p>
`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Jeremy Pitault", email: "contact@jeremypitault.com" },
      to: [{ email }],
      subject: "Ton Plan d'Action est prêt",
      htmlContent,
      tags: ["plan-action"],
    }),
  });

  const body = await res.text();
  console.log(`Brevo plan-action email to ${email}: ${res.status} ${body}`);
  return res.ok;
}

async function sendTransactionalEmail(apiKey: string, email: string, templateId: number, tag: string) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Jeremy Pitault", email: "contact@jeremypitault.com" },
      templateId,
      to: [{ email }],
      tags: [tag],
    }),
  });

  const body = await res.text();
  console.log(`Brevo transactional email (template ${templateId}) to ${email}: ${res.status} ${body}`);
  return res.ok;
}

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, phone, listId, source, utmSource, utmMedium, utmCampaign, budget, appIdea, motivation } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    if (phone) {
      const phoneDigitsOnly = phone.replace(/\D/g, "");
      if (phoneDigitsOnly.length < 6 || phoneDigitsOnly.length > 15) {
        return NextResponse.json(
          { error: "Numéro de téléphone invalide" },
          { status: 400 }
        );
      }
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID
      ? parseInt(process.env.BREVO_LIST_ID)
      : undefined;

    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY is not configured");
      return NextResponse.json(
        { error: "Service temporairement indisponible" },
        { status: 500 }
      );
    }

    const targetListId = listId ? parseInt(listId) : BREVO_LIST_ID;

    // Step 1: Create or update the contact with safe attributes only
    // (custom attrs like BUDGET, APP_IDEA, MOTIVATION may not exist in Brevo
    // and would make the entire create call fail. They're applied in step 1c below.)
    const attributes: Record<string, string | boolean> = {};
    if (firstName) attributes.FIRSTNAME = firstName;
    if (utmSource) attributes.UTM_SOURCE = utmSource;
    if (utmMedium) attributes.UTM_MEDIUM = utmMedium;
    if (utmCampaign) attributes.UTM_CAMPAIGN = utmCampaign;

    const createRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        listIds: targetListId ? [targetListId] : [],
        attributes,
      }),
    });

    if (!createRes.ok) {
      const data = await createRes.json();
      console.error("Brevo create contact error:", JSON.stringify(data));
      if (data.code === "duplicate_parameter") {
        // Contact exists, add to list separately
        if (targetListId) {
          const listRes = await fetch(
            `https://api.brevo.com/v3/contacts/lists/${targetListId}/contacts/add`,
            {
              method: "POST",
              headers: {
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ emails: [email] }),
            },
          );
          if (!listRes.ok) {
            const listData = await listRes.json();
            console.error("Brevo add to list error:", JSON.stringify(listData));
          }
        }
      }
    } else {
      console.log(`Brevo contact created: ${email} (list ${targetListId})`);
    }

    // Step 1b: Mettre à jour le SMS séparément (format peut être invalide)
    // Ignorer les numéros qui ne contiennent que le code pays (ex: "+33")
    console.log(`Phone received for ${email}: "${phone || "(none)"}"`);
    const phoneDigits = phone ? phone.replace(/\D/g, "") : "";
    if (phone && phoneDigits.length >= 6) {
      const smsRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          attributes: { SMS: phone },
        }),
      });
      if (!smsRes.ok) {
        const smsData = await smsRes.json();
        console.error("Brevo SMS update error:", JSON.stringify(smsData));
      }
    }

    // Step 1c: Best-effort update of custom attributes (BUDGET, APP_IDEA, MOTIVATION).
    // If any attribute doesn't exist in Brevo, this call fails — but contact and SMS
    // are already saved by previous steps, so the form submission is not affected.
    const customAttributes: Record<string, string> = {};
    if (budget) customAttributes.BUDGET = budget;
    if (appIdea) customAttributes.APP_IDEA = appIdea;
    if (motivation) customAttributes.MOTIVATION = motivation;
    if (Object.keys(customAttributes).length > 0) {
      const customRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ attributes: customAttributes }),
      });
      if (!customRes.ok) {
        const customData = await customRes.json();
        console.error("Brevo custom attributes update error:", JSON.stringify(customData));
      }
    }

    // Step 2: Send first email instantly via transactional API
    if (source === "plan-action") {
      await sendPlanActionEmail(BREVO_API_KEY, email, firstName);
    } else if (source === "appel") {
      await sendAppelEmail(BREVO_API_KEY, email, firstName);
    } else {
      const config = targetListId ? LIST_CONFIG[targetListId] : undefined;
      if (config) {
        await sendTransactionalEmail(BREVO_API_KEY, email, config.templateId, config.tag);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    console.error("Subscribe error");
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
