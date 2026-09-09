import { NextRequest, NextResponse } from "next/server";
import { magicLink as magicLinkEmail } from "@/lib/emails/transactional";
import { createMagicLinkToken, hasEssentielAccess } from "@/lib/auth";
import { getRoleForEmail } from "@/lib/admin";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Les membres de l'équipe admin n'ont pas d'achat LemonSqueezy :
    // on les laisse toujours recevoir un lien.
    const isTeamMember = (await getRoleForEmail(email)) !== null;
    const hasAccess = isTeamMember || (await hasEssentielAccess(email));
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Aucun achat trouvé pour cet email. Vérifie que tu utilises le même email que lors de ton achat." },
        { status: 403 }
      );
    }

    const token = await createMagicLinkToken(email);
    const magicLink = `${req.nextUrl.origin}/api/auth/verify?token=${token}`;
    const built = magicLinkEmail(magicLink);

    // Send email via Brevo
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return NextResponse.json(
        { error: "Service temporairement indisponible" },
        { status: 500 }
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
        to: [{ email }],
        tags: [built.tag],
        subject: built.subject,
        htmlContent: built.html,
      }),
    });

    if (!res.ok) {
      console.error("Brevo email error:", await res.json());
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send link error:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
