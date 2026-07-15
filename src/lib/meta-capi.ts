import { createHash } from "crypto";
import { NextRequest } from "next/server";

// Meta Conversions API (server-side).
// Envoie les événements en doublon du Pixel navigateur avec le même event_id :
// Meta déduplique (event_name + event_id identiques, fenêtre 48h) et récupère
// les conversions perdues côté navigateur (adblockers, iOS ATT).
// Docs : https://developers.facebook.com/docs/marketing-api/conversions-api

const GRAPH_API_VERSION = "v22.0";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

// Normalisation requise par Meta AVANT hash (sinon le matching échoue) :
// email -> trim + minuscules ; téléphone -> chiffres uniquement avec indicatif
// pays (E.164 sans le +) ; noms -> trim + minuscules.
export function hashEmail(email: string): string {
  return sha256(email.trim().toLowerCase());
}

export function hashPhone(phoneE164: string): string {
  return sha256(phoneE164.replace(/\D/g, ""));
}

export function hashName(name: string): string {
  return sha256(name.trim().toLowerCase());
}

// Géo (ct/st/zp/country) : minuscules, sans accents, sans espaces ni
// ponctuation (format requis par Meta avant hash, ex. "île-de-france" -> "iledefrance").
function hashGeo(value: string): string {
  return sha256(
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, ""),
  );
}

export interface MetaUserData {
  email?: string;
  phone?: string; // E.164 (+33612345678)
  firstName?: string;
  lastName?: string;
  // Géo dérivée de l'IP (headers Vercel). Améliore l'Event Match Quality.
  city?: string;
  state?: string; // code région ISO (ex. "IDF")
  zip?: string;
  country?: string; // ISO-2 (ex. "FR")
  // fbp / fbc : cookies Meta bruts, JAMAIS hashés.
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
}

export interface MetaEventInput {
  eventName: "Lead" | "SubmitApplication" | "Schedule" | "Purchase" | "PageView" | "ViewContent";
  // Doit être identique à l'eventID envoyé par fbq() côté navigateur (dédup).
  eventId: string;
  eventSourceUrl: string;
  userData: MetaUserData;
  customData?: Record<string, string | number>;
}

// Extrait IP + user-agent + géolocalisation de la requête entrante : ces
// paramètres ne peuvent être envoyés que côté serveur et boostent fortement
// l'Event Match Quality. La géo vient des headers Vercel (dérivée de l'IP,
// gratuite, URL-encodée pour la ville).
export function getClientInfo(req: NextRequest): {
  clientIp?: string;
  userAgent?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
} {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp =
    forwardedFor?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined;
  const userAgent = req.headers.get("user-agent") || undefined;

  const geoHeader = (name: string): string | undefined => {
    const value = req.headers.get(name);
    if (!value) return undefined;
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  return {
    clientIp,
    userAgent,
    city: geoHeader("x-vercel-ip-city"),
    state: geoHeader("x-vercel-ip-country-region"),
    zip: geoHeader("x-vercel-ip-postal-code"),
    country: geoHeader("x-vercel-ip-country"),
  };
}

// Envoi best-effort : ne throw jamais, ne bloque jamais la réponse utilisateur.
export async function sendMetaEvent(input: MetaEventInput): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("Meta CAPI non configurée (NEXT_PUBLIC_META_PIXEL_ID / META_CAPI_ACCESS_TOKEN manquants)");
    return;
  }

  const { userData } = input;

  const user_data: Record<string, string[] | string> = {};
  if (userData.email) user_data.em = [hashEmail(userData.email)];
  if (userData.phone) user_data.ph = [hashPhone(userData.phone)];
  if (userData.firstName) user_data.fn = [hashName(userData.firstName)];
  if (userData.lastName) user_data.ln = [hashName(userData.lastName)];
  // external_id : identifiant stable inter-événements. On utilise le hash de
  // l'email pour relier optin -> candidature -> booking chez Meta.
  if (userData.email) user_data.external_id = [hashEmail(userData.email)];
  if (userData.city) user_data.ct = [hashGeo(userData.city)];
  if (userData.state) user_data.st = [hashGeo(userData.state)];
  if (userData.zip) user_data.zp = [hashGeo(userData.zip)];
  if (userData.country) user_data.country = [hashGeo(userData.country)];
  if (userData.fbp?.startsWith("fb.")) user_data.fbp = userData.fbp;
  if (userData.fbc?.startsWith("fb.")) user_data.fbc = userData.fbc;
  if (userData.clientIp) user_data.client_ip_address = userData.clientIp;
  if (userData.userAgent) user_data.client_user_agent = userData.userAgent;

  const event: Record<string, unknown> = {
    event_name: input.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    event_source_url: input.eventSourceUrl,
    action_source: "website",
    user_data,
  };
  if (input.customData) event.custom_data = input.customData;

  const payload: Record<string, unknown> = { data: [event] };
  // Code de test (onglet "Événements de test" de l'Events Manager).
  // À définir uniquement en dev/staging : les événements de test n'optimisent pas.
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const body = await res.text();
    if (!res.ok) {
      console.error(`Meta CAPI ${input.eventName} error: ${res.status} ${body}`);
    } else {
      console.log(`Meta CAPI ${input.eventName} envoyé (event_id: ${input.eventId})`);
    }
  } catch (err) {
    console.error(`Meta CAPI ${input.eventName} fetch failed:`, err);
  }
}
