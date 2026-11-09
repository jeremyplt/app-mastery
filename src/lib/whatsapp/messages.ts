// WhatsApp pro de Jeremy, lu via Kapso (mode coexistence : le numéro reste dans
// l'app WhatsApp Business et dans WhatsApp Web). Calculs purs, testés dans
// src/lib/__tests__/whatsapp.test.ts. Rien n'est jamais envoyé depuis ce code.

// Numéro du WhatsApp pro, branché sur Kapso le 9 nov. 2026.
export const BUSINESS_NUMBER = "33756823921";

// Numéro réduit à ses chiffres, avec indicatif : "+33 6 44 70 59 92", "0644705992"
// et "0033644705992" donnent tous "33644705992". Les numéros copiés depuis
// WhatsApp contiennent parfois des caractères invisibles, ignorés aussi.
export function phoneDigits(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  // Numéro français écrit sans indicatif.
  if (d.length === 10 && d.startsWith("0")) d = `33${d.slice(1)}`;
  return d.length >= 8 ? d : null;
}

// Message tel que renvoyé par l'API Kapso (format Meta + champ kapso).
export type KapsoMessage = {
  id: string;
  timestamp: string;
  type: string;
  from?: string | null;
  to?: string | null;
  from_user_id?: string | null;
  to_user_id?: string | null;
  text?: { body?: string };
  image?: { caption?: string };
  video?: { caption?: string };
  document?: { caption?: string; filename?: string };
  reaction?: { emoji?: string };
  location?: { name?: string; address?: string };
  kapso?: {
    direction?: string;
    origin?: string;
    contact_name?: string | null;
    content?: string | null;
    media_url?: string | null;
    media_data?: { content_type?: string | null } | null;
    transcript?: { text?: string | null } | null;
  };
};

export type MessageRow = {
  id: string;
  contact: string;
  contact_name: string | null;
  direction: "inbound" | "outbound";
  origin: string | null;
  type: string;
  body: string | null;
  media_url: string | null;
  media_type: string | null;
  transcript: string | null;
  sent_at: string;
};

function bodyOf(m: KapsoMessage): string | null {
  const text =
    m.text?.body ??
    m.image?.caption ??
    m.video?.caption ??
    m.document?.caption ??
    m.document?.filename ??
    m.reaction?.emoji ??
    (m.location ? ["Position partagée", m.location.name, m.location.address].filter(Boolean).join(" : ") : undefined);
  if (text?.trim()) return text.trim();
  // Types rares (boutons, contacts...) : le texte que Kapso en tire, sans les médias
  // ni ses textes techniques (« [Media - pending] » pour une pièce jointe de
  // l'historique, « [Errors message] » pour un message illisible, « [Edit message] »).
  if (["text", "image", "video", "audio", "document", "sticker", "media_placeholder", "errors", "edit"].includes(m.type)) return null;
  return m.kapso?.content?.trim() || null;
}

// Ligne à enregistrer, ou null pour un message qu'on ne sait pas rattacher.
export function toRow(m: KapsoMessage): MessageRow | null {
  const direction = m.kapso?.direction;
  if (direction !== "inbound" && direction !== "outbound") return null;
  const other = direction === "inbound" ? (m.from ?? m.from_user_id) : (m.to ?? m.to_user_id);
  // Identifiant WhatsApp sans numéro (« US.1349... ») : gardé tel quel.
  const contact = other && /^\+?[\d\s]+$/.test(other) ? phoneDigits(other) : other?.trim() || null;
  const seconds = Number(m.timestamp);
  if (!contact || contact === BUSINESS_NUMBER || !Number.isFinite(seconds) || seconds <= 0) return null;
  return {
    id: m.id,
    contact,
    contact_name: direction === "inbound" ? m.kapso?.contact_name?.trim() || null : null,
    direction,
    origin: m.kapso?.origin ?? null,
    type: m.type,
    body: bodyOf(m),
    media_url: m.kapso?.media_url ?? null,
    media_type: m.kapso?.media_data?.content_type ?? null,
    transcript: m.type === "audio" ? m.kapso?.transcript?.text?.trim() || null : null,
    sent_at: new Date(seconds * 1000).toISOString(),
  };
}

export type Thread = {
  contact: string;
  last_inbound_at: string | null;
  last_outbound_at: string | null;
  summarized_through: string | null;
  handled_at: string | null;
};

const after = (a: string | null, b: string | null) => Boolean(a) && (!b || Date.parse(a!) > Date.parse(b));

// L'élève attend une réponse : son dernier message est plus récent que la
// dernière réponse de Jeremy et que son clic sur « Traité ».
export function awaitingReply(t: Thread): boolean {
  return after(t.last_inbound_at, t.last_outbound_at) && after(t.last_inbound_at, t.handled_at);
}

// Fil à résumer maintenant : il attend une réponse, il y a du neuf depuis le
// dernier résumé, l'élève a fini d'écrire (rien depuis `quietMinutes`) et ce
// n'est pas un vieux fil importé avec l'historique.
export function needsSummary(t: Thread, now: Date, quietMinutes = 4, maxAgeDays = 7): boolean {
  if (!awaitingReply(t) || !after(t.last_inbound_at, t.summarized_through)) return false;
  const age = now.getTime() - Date.parse(t.last_inbound_at!);
  return age >= quietMinutes * 60_000 && age <= maxAgeDays * 86_400_000;
}
