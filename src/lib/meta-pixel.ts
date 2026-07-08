// Helpers client pour le Pixel Meta.
// Le même event_id est envoyé par fbq() (navigateur) et par la CAPI (serveur)
// pour que Meta déduplique et ne compte la conversion qu'une fois.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function generateEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// _fbp : identifiant navigateur posé par le Pixel. Jamais hashé.
export function getFbp(): string | undefined {
  return getCookie("_fbp");
}

// _fbc : identifiant de clic publicitaire. Jamais hashé.
export function getFbc(): string | undefined {
  return getCookie("_fbc");
}

// Si l'utilisateur arrive d'une pub Meta (?fbclid=...) mais que le cookie _fbc
// n'existe pas (pixel bloqué, cookie expiré), on le reconstruit nous-mêmes au
// format officiel fb.1.{timestamp_ms}.{fbclid} et on le persiste 90 jours :
// le clic et la conversion (optin, booking) n'arrivent pas au même moment.
export function persistFbclid(fbclid: string | null): void {
  if (!fbclid || typeof document === "undefined") return;
  if (getFbc()) return;
  const value = `fb.1.${Date.now()}.${fbclid}`;
  const maxAge = 90 * 24 * 60 * 60;
  document.cookie = `_fbc=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// Track un événement standard avec eventID (dédup navigateur/serveur).
export function trackMeta(
  eventName: string,
  params?: Record<string, string | number>,
  eventId?: string,
): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", eventName, params || {}, eventId ? { eventID: eventId } : undefined);
}

// Track un événement personnalisé (hors liste standard Meta). Sert aux
// audiences et conversions personnalisées, pas à l'optimisation directe.
export function trackMetaCustom(
  eventName: string,
  params?: Record<string, string | number>,
): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("trackCustom", eventName, params || {});
}

// Champs Meta à joindre aux POST vers nos API routes pour l'envoi CAPI serveur.
export function metaTrackingFields(eventId: string): {
  metaEventId: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl: string;
} {
  return {
    metaEventId: eventId,
    fbp: getFbp(),
    fbc: getFbc(),
    eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
  };
}
