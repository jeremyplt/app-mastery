// Brevo list IDs per plan
const BREVO_LIST_IDS: Record<string, number> = {
  essentiel: 6,
  complet: 7,
  vip: 8,
};

// Brevo transactional template IDs for welcome emails per plan
const WELCOME_TEMPLATE_IDS: Record<string, number> = {
  essentiel: 8,
  complet: 9,
  vip: 10,
};

function getApiKey() {
  return process.env.BREVO_API_KEY!;
}

/**
 * Create or update a Brevo contact and add to the correct list.
 * Also fires a custom event to reliably trigger automations
 * (the "Ajouté à une liste" trigger is unreliable via API).
 */
export async function addBrevoContact(email: string, tag: string, eventName: string, eventProperties?: Record<string, unknown>) {
  const apiKey = getApiKey();
  if (!apiKey) return;

  const listId = BREVO_LIST_IDS[tag];

  // Step 1: Create/update contact with list assignment
  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        listIds: listId ? [listId] : [],
        attributes: {
          APP_MASTERY_PLAN: tag,
        },
      }),
    });

    const body = await res.text();
    console.log(`Brevo contact ${email}: ${res.status} ${body}`);
  } catch (err) {
    console.error("Brevo contact creation failed:", err);
  }

  // Step 2: Send welcome email instantly via transactional API
  const welcomeTemplateId = WELCOME_TEMPLATE_IDS[tag];
  if (welcomeTemplateId) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          templateId: welcomeTemplateId,
          to: [{ email }],
          tags: [`welcome-${tag}`],
        }),
      });

      const body = await res.text();
      console.log(`Brevo welcome email (template ${welcomeTemplateId}) to ${email}: ${res.status} ${body}`);
    } catch (err) {
      console.error("Brevo welcome email failed:", err);
    }
  }

  // Step 3: Fire a custom event to trigger the automation
  // This is the reliable way to trigger automations via API
  try {
    const res = await fetch("https://api.brevo.com/v3/events", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: eventName,
        identifiers: {
          email_id: email,
        },
        contact_properties: {
          APP_MASTERY_PLAN: tag,
        },
        event_properties: {
          plan: tag,
          ...eventProperties,
        },
      }),
    });

    // 204 = success for events API
    console.log(`Brevo event "${eventName}" for ${email}: ${res.status}`);
  } catch (err) {
    console.error("Brevo event failed:", err);
  }
}
