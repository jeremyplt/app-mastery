// Filtre géographique des candidatures.
//
// Objectif : ne pas proposer de réservation d'appel aux prospects situés en
// Afrique subsaharienne (faible bancarisation -> les stratégies de paiement /
// monétisation ne sont pas applicables). On ne le dit jamais au prospect :
// il est simplement routé comme "non qualifié" (page ressource gratuite).
//
// L'Afrique du Nord / Maghreb (Maroc, Algérie, Tunisie, Libye, Égypte) reste
// éligible : bancarisation suffisante. Ces pays ne sont PAS dans la liste.
//
// Deux signaux, l'un OU l'autre suffit à bloquer :
//   1. indicatif du numéro de téléphone (signal fort, saisi par le prospect)
//   2. pays de l'IP (en-tête `x-vercel-ip-country`, gratuit sur Vercel)

import { parsePhoneNumber, type CountryCode } from "libphonenumber-js";

// Pays d'Afrique subsaharienne (ISO 3166-1 alpha-2).
// Volontairement exhaustif. Maghreb / Afrique du Nord exclus (MA, DZ, TN, LY, EG).
// Pour ré-autoriser un pays mieux bancarisé (ex. Afrique du Sud, Maurice),
// retirer simplement son code de cette liste.
export const BLOCKED_COUNTRIES: ReadonlySet<CountryCode> = new Set<CountryCode>([
  // Afrique de l'Ouest
  "SN", "CI", "ML", "BF", "NE", "GN", "BJ", "TG", "GH", "NG",
  "LR", "SL", "GM", "GW", "CV", "MR",
  // Afrique centrale
  "CM", "CF", "TD", "CG", "CD", "GA", "GQ", "ST", "AO",
  // Afrique de l'Est / Corne / océan Indien
  "KE", "TZ", "UG", "RW", "BI", "ET", "SO", "DJ", "ER", "SS",
  "SD", "KM", "MG", "MU", "SC", "MW", "ZM", "ZW", "MZ",
  // Afrique australe
  "ZA", "NA", "BW", "LS", "SZ",
]);

// Pays ISO -> bloqué ? (utilitaire commun téléphone / IP)
export function isBlockedCountry(country?: string | null): boolean {
  if (!country) return false;
  return BLOCKED_COUNTRIES.has(country.toUpperCase() as CountryCode);
}

// Déduit le pays depuis un numéro E.164 (ex. "+221770000000" -> "SN").
// Retourne undefined si le numéro n'est pas parsable.
export function countryFromPhone(phone: string): CountryCode | undefined {
  try {
    return parsePhoneNumber(phone)?.country;
  } catch {
    return undefined;
  }
}

// Décision finale : le prospect est-il hors cible géographique ?
// `ipCountry` = en-tête x-vercel-ip-country (peut être absent en local).
export function isOutOfRegion(phone: string, ipCountry?: string | null): boolean {
  if (isBlockedCountry(countryFromPhone(phone))) return true;
  if (isBlockedCountry(ipCountry)) return true;
  return false;
}
