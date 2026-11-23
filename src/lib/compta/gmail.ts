// Client du script Google « SDG Studio - Compta Gmail » (scripts/compta/gmail/Code.gs),
// qui lit Gmail en lecture seule et ne renvoie que les pièces jointes PDF ou image.

export type MailPieces = { id: string; date: number; from: string; subject: string; pieces: { partId: string; filename: string; mimeType: string; size: number }[] };

// Les mails qui portent une facture ou un reçu. Les mails envoyés par Jeremy, par le
// site (factures aux élèves) et par SKG (fiches de paie) n'en sont pas.
export function requeteFactures(depuis: string): string {
  const mots = ["facture", "invoice", "receipt", "reçu", "recu", "rechnung", "quittung", "ricevuta", "factura", "commande", "order", "billing", "paiement", "payment", "subscription", "abonnement", "transaction", "booking", "réservation"];
  return `has:attachment after:${depuis.replace(/-/g, "/")} -from:me -from:jeremypitault.com -from:skg.lu {${mots.join(" ")}}`;
}

function config() {
  const url = process.env.COMPTA_GMAIL_URL;
  const secret = process.env.COMPTA_GMAIL_SECRET;
  return url && secret ? { url, secret } : null;
}

export const gmailBranche = () => config() !== null;

async function appel<T>(corps: Record<string, unknown>): Promise<T> {
  const c = config();
  if (!c) throw new Error("Script Gmail non branché (COMPTA_GMAIL_URL, COMPTA_GMAIL_SECRET)");
  const res = await fetch(c.url, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ secret: c.secret, ...corps }), redirect: "follow", signal: AbortSignal.timeout(180_000) });
  const texte = await res.text();
  let d: { ok?: boolean; error?: string } & T;
  try {
    d = JSON.parse(texte);
  } catch {
    throw new Error(`Gmail : réponse illisible (${res.status})`);
  }
  if (!d.ok) throw new Error(`Gmail : ${d.error ?? "refusé"}`);
  return d;
}

export async function* mailsAvecPieces(requete: string, pagesMax = 20): AsyncGenerator<MailPieces> {
  let pageToken: string | null = null;
  for (let page = 0; page < pagesMax; page++) {
    const r: { messages: MailPieces[]; next: string | null } = await appel({ action: "chercher", q: requete, max: 25, pageToken });
    for (const m of r.messages) yield m;
    if (!r.next) return;
    pageToken = r.next;
  }
}

export async function telechargerPiece(messageId: string, partId: string): Promise<{ contenu: Buffer; mime: string; nom: string }> {
  const r = await appel<{ data: string; mimeType: string; filename: string }>({ action: "piece", messageId, partId });
  return { contenu: Buffer.from(r.data, "base64url"), mime: r.mimeType, nom: r.filename };
}
