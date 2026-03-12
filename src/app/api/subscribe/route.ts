import { NextRequest, NextResponse } from "next/server";

// Map Brevo list IDs to transactional template IDs and tags
const LIST_CONFIG: Record<number, { templateId: number; tag: string }> = {
  12: { templateId: 16, tag: "piscine-epitech" },
  13: { templateId: 17, tag: "prompt-50-saas" },
  14: { templateId: 19, tag: "workflow-make" },
  15: { templateId: 11, tag: "monetisation" },
  16: { templateId: 14, tag: "openclaw" },
};

async function sendTransactionalEmail(apiKey: string, email: string, templateId: number, tag: string) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
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
    const { email, listId } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
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

    // Step 1: Create or update the contact with list
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
      }),
    });

    if (!createRes.ok) {
      const data = await createRes.json();
      if (data.code !== "duplicate_parameter") {
        console.error("Brevo create contact error:", data);
        return NextResponse.json(
          { error: "Une erreur est survenue" },
          { status: 500 },
        );
      }
      // Contact exists, add to list separately
      if (targetListId) {
        await fetch(
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
      }
    }

    // Step 2: Send first email instantly via transactional API
    const config = targetListId ? LIST_CONFIG[targetListId] : undefined;
    if (config) {
      await sendTransactionalEmail(BREVO_API_KEY, email, config.templateId, config.tag);
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
