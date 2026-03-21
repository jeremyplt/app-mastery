import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 },
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 },
      );
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return NextResponse.json(
        { error: "Service temporairement indisponible" },
        { status: 500 },
      );
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Jeremy Pitault", email: "contact@jeremypitault.com" },
        to: [{ email: "contact@jeremypitault.com" }],
        replyTo: { name, email },
        subject: `[Contact App Mastery] Message de ${name}`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="color: #111; font-size: 18px; margin-bottom: 24px;">Nouveau message depuis le formulaire de contact</h2>
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 4px;"><strong>Prénom :</strong> ${name}</p>
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 4px;"><strong>Email :</strong> ${email}</p>
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 16px;"><strong>Message :</strong></p>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      console.error("Brevo contact email error:", await res.json());
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du message" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 },
    );
  }
}
