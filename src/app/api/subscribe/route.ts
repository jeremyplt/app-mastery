import { NextRequest, NextResponse } from "next/server";

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

    // Step 1: Create or update the contact
    const createRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, updateEnabled: true }),
    });

    if (!createRes.ok) {
      const data = await createRes.json();
      // "duplicate_parameter" means contact already exists - that's fine
      if (data.code !== "duplicate_parameter") {
        console.error("Brevo create contact error:", data);
        return NextResponse.json(
          { error: "Une erreur est survenue" },
          { status: 500 },
        );
      }
    }

    // Step 2: Add contact to list separately so the "Ajouté à une liste"
    // automation trigger fires in Brevo
    const targetListId = listId ? parseInt(listId) : BREVO_LIST_ID;
    if (targetListId) {
      const listRes = await fetch(
        `https://api.brevo.com/v3/contacts/lists/${targetListId}/contacts/add`,
        {
          method: "POST",
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ emails: [email] }),
        },
      );

      if (!listRes.ok) {
        const data = await listRes.json();
        console.error("Brevo add to list error:", data);
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
