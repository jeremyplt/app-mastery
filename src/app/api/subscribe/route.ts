import { NextRequest, NextResponse } from "next/server";
import { validatePhone } from "@/lib/phone-validation";
import { sendMetaEvent, getClientInfo } from "@/lib/meta-capi";
import { getAdminClient } from "@/lib/supabase";

// Map lead-magnet sources to their Brevo transactional template ID and tag.
// Keyed by `source` (the guide slug), not by list ID: tous les leads magnets
// partagent désormais la liste maître "Lead" (23), donc le template de
// livraison ne peut plus être déduit de la liste.
const SOURCE_CONFIG: Record<string, { templateId: number; tag: string }> = {
  "piscine-epitech": { templateId: 16, tag: "piscine-epitech" },
  "prompt-50-saas": { templateId: 17, tag: "prompt-50-saas" },
  "workflow-make": { templateId: 19, tag: "workflow-make" },
  monetisation: { templateId: 11, tag: "monetisation" },
  openclaw: { templateId: 14, tag: "openclaw" },
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
  <li>Je te dis honnêtement si un accompagnement peut t'aider</li>
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

async function sendVslEmail(apiKey: string, email: string, firstName?: string) {
  const greeting = firstName ? `Salut ${firstName},` : "Salut,";
  const htmlContent = `
<p>${greeting}</p>

<p>Merci de t'être inscrit à la conférence privée.</p>

<p>Voici ton accès direct : <a href="https://www.jeremypitault.com/conference/live">Accéder à la conférence</a></p>

<p>Dedans, tu vas découvrir :</p>

<ul>
  <li>Pourquoi 93% des applications ne sont jamais rentables (et comment éviter ce piège)</li>
  <li>Les 3 piliers indispensables pour générer jusqu'à 10 000€ par mois avec une seule app</li>
  <li>La méthode exacte pour créer ton app avec l'IA en moins d'une semaine, sans coder</li>
</ul>

<p>Regarde-la en entier. À la fin, tu sauras exactement quoi faire pour lancer ton app rentable.</p>

<p>À très vite,<br>Jeremy</p>

<p>P.S. Si tu as des questions, réponds directement à cet email. Je lis tout.</p>
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
      subject: "Ton accès à la conférence privée",
      htmlContent,
      tags: ["vsl-conference"],
    }),
  });

  const body = await res.text();
  console.log(`Brevo vsl email to ${email}: ${res.status} ${body}`);
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

<p>En attendant, si tu as déjà une app ou un projet en tête, je propose un appel découverte. On fait le point sur ton projet et on voit si on peut travailler ensemble. Réponds à quelques questions et choisis ton créneau :</p>

<p><a href="https://www.jeremypitault.com/appel?utm_source=email&utm_medium=email&utm_campaign=plan-action">Réserver mon appel découverte</a></p>

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

async function sendMetabaseEmail(apiKey: string, email: string, firstName?: string) {
  const greeting = firstName ? `Salut ${firstName},` : "Salut,";
  const htmlContent = `
<p>${greeting}</p>

<p>Merci d'avoir demandé le pack Metabase. Voici ton fichier à télécharger :</p>

<p><a href="https://www.jeremypitault.com/downloads/metabase-hostinger-m9k4p2.zip">Télécharger le pack .zip</a></p>

<p>Dedans, tu trouveras :</p>

<ul>
  <li>Le tutoriel pas à pas pour préparer ton VPS Hostinger (KVM 2)</li>
  <li>Le prompt IA qui installe et sécurise Metabase pour toi, en Docker</li>
  <li>Tout ce qu'il faut pour avoir ton dashboard analytics auto-hébergé en HTTPS</li>
</ul>

<p>Suis le tutoriel d'abord, il te prépare le VPS et te donne les infos à copier dans le prompt. Ensuite, tu envoies le prompt à l'IA et tu la laisses installer Metabase.</p>

<p>À très vite,<br>Jeremy</p>

<p>P.S. Si tu bloques quelque part, réponds directement à cet email. Je lis tout.</p>
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
      subject: "Ton pack Metabase est prêt",
      htmlContent,
      tags: ["metabase"],
    }),
  });

  const body = await res.text();
  console.log(`Brevo metabase email to ${email}: ${res.status} ${body}`);
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
    const { email, firstName, phone, listId, source, utmSource, utmMedium, utmCampaign, budget, appIdea, motivation, metaEventId, fbp, fbc, eventSourceUrl } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    let validatedPhone: string | undefined;
    if (phone) {
      const result = validatePhone(phone);
      if (!result.ok) {
        console.log(`Phone rejected (${result.reason}) for ${email}: "${phone}"`);
        return NextResponse.json(
          { error: result.message },
          { status: 400 }
        );
      }
      validatedPhone = result.e164;
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
    if (source) attributes.LEAD_SOURCE = source;
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

    // Step 1b: Mettre à jour le SMS séparément (format peut être invalide côté Brevo)
    if (validatedPhone) {
      console.log(`Phone validated for ${email}: ${validatedPhone}`);
      const smsRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          attributes: { SMS: validatedPhone },
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

    // Step 1d: Enregistrer le lead dans le CRM (Supabase) pour les sources VSL
    // et Plan d'action. Best-effort, ne bloque jamais l'inscription.
    if (source === "vsl" || source === "plan-action") {
      try {
        const supabase = getAdminClient();
        const { error: crmError } = await supabase
          .from("crm_leads")
          .upsert(
            {
              email: email.toLowerCase(),
              source,
              ...(firstName && { first_name: firstName }),
              ...(validatedPhone && { phone: validatedPhone }),
            },
            { onConflict: "email,source" },
          );
        if (crmError) {
          console.error("CRM lead upsert error:", crmError.message);
        }
      } catch (err) {
        console.error("CRM lead upsert error:", err);
      }
    }

    // Meta CAPI : événement Lead serveur, dédupliqué avec le Pixel navigateur
    // via metaEventId. Best-effort, ne bloque jamais l'inscription.
    if (metaEventId) {
      await sendMetaEvent({
        eventName: "Lead",
        eventId: metaEventId,
        eventSourceUrl: eventSourceUrl || "https://www.jeremypitault.com/",
        userData: {
          email,
          phone: validatedPhone,
          firstName,
          fbp,
          fbc,
          ...getClientInfo(req),
        },
        // value/currency requis par Meta sur Lead pour le calcul du ROAS
        // (valeur nominale, Meta exige value > 0).
        customData: {
          value: 1,
          currency: "EUR",
          ...(source ? { content_name: source } : {}),
        },
      });
    }

    // Step 2: Send first email instantly via transactional API
    if (source === "vsl") {
      await sendVslEmail(BREVO_API_KEY, email, firstName);
    } else if (source === "plan-action") {
      await sendPlanActionEmail(BREVO_API_KEY, email, firstName);
    } else if (source === "appel") {
      await sendAppelEmail(BREVO_API_KEY, email, firstName);
    } else if (source === "metabase") {
      await sendMetabaseEmail(BREVO_API_KEY, email, firstName);
    } else {
      const config = source ? SOURCE_CONFIG[source] : undefined;
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
