// Envoi d'un email construit dans le code via l'API transactionnelle Brevo.
// Expéditeur et réponse : contact@jeremypitault.com. Chaque envoi porte son
// tag, c'est ce qui permet de le retrouver dans l'admin (/admin/emails).

import type { BuiltEmail } from "@/lib/emails/transactional";

const BREVO_SMTP = "https://api.brevo.com/v3/smtp/email";

export type SendResult = { ok: boolean; messageId?: string; error?: string };

export async function sendBuiltEmail(
  to: { email: string; name?: string },
  built: BuiltEmail,
): Promise<SendResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { ok: false, error: "BREVO_API_KEY manquante" };

  const res = await fetch(BREVO_SMTP, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Jeremy Pitault", email: "contact@jeremypitault.com" },
      replyTo: { name: "Jeremy Pitault", email: "contact@jeremypitault.com" },
      to: [to],
      subject: built.subject,
      htmlContent: built.html,
      tags: [built.tag],
    }),
  });
  const body = await res.text();
  console.log(`Brevo ${built.tag} to ${to.email}: ${res.status} ${body}`);
  if (!res.ok) return { ok: false, error: body };
  let messageId: string | undefined;
  try {
    messageId = (JSON.parse(body) as { messageId?: string }).messageId;
  } catch {
    // Réponse non JSON : on garde juste le succès.
  }
  return { ok: true, messageId };
}
