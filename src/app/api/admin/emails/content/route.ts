import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

// Contenu d'un email transactionnel envoyé, tel que Brevo l'a stocké
// (objet, corps HTML, historique des événements). Brevo identifie le
// contenu par un uuid : on le retrouve à partir du destinataire et du
// messageId affichés dans la liste.
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "BREVO_API_KEY manquante" }, { status: 500 });

  const email = req.nextUrl.searchParams.get("email");
  const messageId = req.nextUrl.searchParams.get("messageId");
  if (!email || !messageId) {
    return NextResponse.json({ error: "email et messageId requis" }, { status: 400 });
  }

  const headers = { "api-key": apiKey, Accept: "application/json" };

  try {
    const listRes = await fetch(
      `https://api.brevo.com/v3/smtp/emails?email=${encodeURIComponent(email)}&limit=100&sort=desc`,
      { headers },
    );
    if (!listRes.ok) throw new Error(`Brevo list ${listRes.status}`);
    const list = (await listRes.json()) as { transactionalEmails?: { messageId: string; uuid: string }[] };
    const match = (list.transactionalEmails ?? []).find((m) => m.messageId === messageId);
    if (!match) {
      return NextResponse.json(
        { error: "Contenu introuvable chez Brevo (les contenus ne sont gardés que quelques semaines)" },
        { status: 404 },
      );
    }

    const contentRes = await fetch(`https://api.brevo.com/v3/smtp/emails/${encodeURIComponent(match.uuid)}`, { headers });
    if (!contentRes.ok) throw new Error(`Brevo content ${contentRes.status}`);
    const content = (await contentRes.json()) as {
      email: string;
      subject: string;
      date: string;
      body: string;
      events?: { name: string; time: string }[];
    };

    return NextResponse.json({
      email: content.email,
      subject: content.subject,
      date: content.date,
      body: content.body,
      events: content.events ?? [],
    });
  } catch (err) {
    console.error("Admin email content error:", err);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
