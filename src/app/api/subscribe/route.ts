import { NextRequest, NextResponse } from "next/server";
import { validatePhone } from "@/lib/phone-validation";
import { sendMetaEvent, getClientInfo } from "@/lib/meta-capi";
import { getAdminClient } from "@/lib/supabase";
import { appelDecouverte, metabase, planAction, vslAccess, type BuiltEmail } from "@/lib/emails/transactional";

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

// Envoi d'un email construit par src/lib/emails/transactional.ts.
async function sendBuilt(apiKey: string, email: string, built: BuiltEmail) {
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
      subject: built.subject,
      htmlContent: built.html,
      tags: [built.tag],
    }),
  });
  const body = await res.text();
  console.log(`Brevo ${built.tag} email to ${email}: ${res.status} ${body}`);
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
      await sendBuilt(BREVO_API_KEY, email, vslAccess(firstName));
    } else if (source === "plan-action") {
      await sendBuilt(BREVO_API_KEY, email, planAction(firstName));
    } else if (source === "appel") {
      await sendBuilt(BREVO_API_KEY, email, appelDecouverte(firstName));
    } else if (source === "metabase") {
      await sendBuilt(BREVO_API_KEY, email, metabase(firstName));
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
