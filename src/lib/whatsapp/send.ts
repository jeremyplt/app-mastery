// Envoi d'une réponse depuis /admin/whatsapp, seulement quand Jeremy clique sur
// « Envoyer ». Passe par Kapso (même numéro, en coexistence : le message
// apparaît aussi dans l'app WhatsApp Business).
//
// Règle de WhatsApp : un message libre (pas un modèle validé par Meta) ne part
// par l'API que dans les 24 h qui suivent le dernier message de la personne.
// L'historique importé n'ouvre pas cette fenêtre. Au-delà, Jeremy répond depuis
// l'app ou WhatsApp Web.

export const SEND_WINDOW_MS = 24 * 3_600_000;
const MARGIN_MS = 5 * 60_000; // l'envoi doit arriver chez Meta avant la fin de la fenêtre
export const MAX_TEXT = 4096; // limite d'un message texte WhatsApp

export function canSendFreeForm(lastLiveInboundAt: string | null, now: Date): boolean {
  if (!lastLiveInboundAt) return false;
  const age = now.getTime() - Date.parse(lastLiveInboundAt);
  return age >= 0 && age < SEND_WINDOW_MS - MARGIN_MS;
}

// Fin de la fenêtre d'envoi, pour l'afficher (null si fermée ou inconnue).
export function sendWindowEnd(lastInboundAt: string | null, now: Date): Date | null {
  if (!canSendFreeForm(lastInboundAt, now)) return null;
  return new Date(Date.parse(lastInboundAt!) + SEND_WINDOW_MS - MARGIN_MS);
}

export function cleanOutgoing(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const text = raw.replace(/\r\n/g, "\n").trim();
  if (!text || text.length > MAX_TEXT) return null;
  return text;
}

// Renvoie l'identifiant WhatsApp du message (wamid), le même que celui que la
// synchronisation lira ensuite chez Kapso : pas de doublon.
export async function sendText(opts: { apiKey: string; phoneNumberId: string; to: string; text: string; fetchImpl?: typeof fetch }): Promise<string> {
  if (!/^\d{8,15}$/.test(opts.to)) throw new Error("Numéro invalide");
  const res = await (opts.fetchImpl ?? fetch)(`https://api.kapso.ai/meta/whatsapp/v24.0/${opts.phoneNumberId}/messages`, {
    method: "POST",
    headers: { "X-API-Key": opts.apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: opts.to, type: "text", text: { body: opts.text, preview_url: true } }),
    signal: AbortSignal.timeout(20_000),
  });
  const data = (await res.json().catch(() => ({}))) as { messages?: { id?: string }[]; error?: { message?: string; error_user_msg?: string } };
  if (!res.ok) throw new Error(`WhatsApp a refusé l'envoi : ${data.error?.error_user_msg ?? data.error?.message ?? res.status}`.slice(0, 300));
  const id = data.messages?.[0]?.id;
  if (!id) throw new Error("WhatsApp n'a pas renvoyé d'identifiant de message");
  return id;
}

// Marque la conversation comme lue chez WhatsApp (coches bleues pour l'élève),
// pour que la pastille « non lu » disparaisse aussi de l'app après une réponse
// envoyée depuis le CRM. Il suffit de marquer le dernier message reçu.
export async function markRead(opts: { apiKey: string; phoneNumberId: string; messageId: string; fetchImpl?: typeof fetch }): Promise<void> {
  const res = await (opts.fetchImpl ?? fetch)(`https://api.kapso.ai/meta/whatsapp/v24.0/${opts.phoneNumberId}/messages`, {
    method: "POST",
    headers: { "X-API-Key": opts.apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", status: "read", message_id: opts.messageId }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Lecture non marquée (${res.status})`);
}

// Réaction (👍, ❤️…) sur un message reçu : même règle des 24 h que les messages.
export const REACTIONS = ["👍", "❤️", "🙏", "🔥", "😂"] as const;

export async function sendReaction(opts: { apiKey: string; phoneNumberId: string; to: string; messageId: string; emoji: string; fetchImpl?: typeof fetch }): Promise<string> {
  if (!/^\d{8,15}$/.test(opts.to)) throw new Error("Numéro invalide");
  if (!(REACTIONS as readonly string[]).includes(opts.emoji)) throw new Error("Réaction inconnue");
  const res = await (opts.fetchImpl ?? fetch)(`https://api.kapso.ai/meta/whatsapp/v24.0/${opts.phoneNumberId}/messages`, {
    method: "POST",
    headers: { "X-API-Key": opts.apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: opts.to, type: "reaction", reaction: { message_id: opts.messageId, emoji: opts.emoji } }),
    signal: AbortSignal.timeout(20_000),
  });
  const data = (await res.json().catch(() => ({}))) as { messages?: { id?: string }[]; error?: { message?: string; error_user_msg?: string } };
  if (!res.ok) throw new Error(`WhatsApp a refusé la réaction : ${data.error?.error_user_msg ?? data.error?.message ?? res.status}`.slice(0, 300));
  return data.messages?.[0]?.id ?? `reaction-${Date.now()}`;
}
