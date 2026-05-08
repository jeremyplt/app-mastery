import type { CountryCode } from "libphonenumber-js";

export type CountryEntry = {
  code: string;
  flag: string;
  country: CountryCode;
};

export const COUNTRY_CODES: CountryEntry[] = [
  { code: "+33", flag: "🇫🇷", country: "FR" },
  { code: "+32", flag: "🇧🇪", country: "BE" },
  { code: "+41", flag: "🇨🇭", country: "CH" },
  { code: "+1", flag: "🇨🇦", country: "CA" },
  { code: "+352", flag: "🇱🇺", country: "LU" },
  { code: "+377", flag: "🇲🇨", country: "MC" },
  { code: "+1", flag: "🇺🇸", country: "US" },
  { code: "+44", flag: "🇬🇧", country: "GB" },
  { code: "+49", flag: "🇩🇪", country: "DE" },
  { code: "+34", flag: "🇪🇸", country: "ES" },
  { code: "+39", flag: "🇮🇹", country: "IT" },
  { code: "+351", flag: "🇵🇹", country: "PT" },
  { code: "+31", flag: "🇳🇱", country: "NL" },
  { code: "+43", flag: "🇦🇹", country: "AT" },
  { code: "+353", flag: "🇮🇪", country: "IE" },
  { code: "+45", flag: "🇩🇰", country: "DK" },
  { code: "+46", flag: "🇸🇪", country: "SE" },
  { code: "+47", flag: "🇳🇴", country: "NO" },
  { code: "+358", flag: "🇫🇮", country: "FI" },
  { code: "+61", flag: "🇦🇺", country: "AU" },
  { code: "+64", flag: "🇳🇿", country: "NZ" },
  { code: "+81", flag: "🇯🇵", country: "JP" },
  { code: "+65", flag: "🇸🇬", country: "SG" },
  { code: "+972", flag: "🇮🇱", country: "IL" },
  { code: "+971", flag: "🇦🇪", country: "AE" },
];

export const ALLOWED_COUNTRIES: ReadonlySet<CountryCode> = new Set(
  COUNTRY_CODES.map((c) => c.country),
);

const TIMEZONE_TO_COUNTRY: Record<string, CountryCode> = {
  "Europe/Paris": "FR",
  "Europe/Brussels": "BE",
  "Europe/Zurich": "CH",
  "America/Toronto": "CA",
  "America/Montreal": "CA",
  "America/Vancouver": "CA",
  "Europe/Luxembourg": "LU",
  "Europe/Monaco": "MC",
  "Europe/London": "GB",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "Europe/Berlin": "DE",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Lisbon": "PT",
  "Europe/Amsterdam": "NL",
  "Europe/Vienna": "AT",
  "Europe/Dublin": "IE",
  "Europe/Copenhagen": "DK",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Helsinki": "FI",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Perth": "AU",
  "Pacific/Auckland": "NZ",
  "Asia/Tokyo": "JP",
  "Asia/Singapore": "SG",
  "Asia/Jerusalem": "IL",
  "Asia/Dubai": "AE",
};

export function detectCountry(): CountryCode {
  if (typeof Intl === "undefined") return "FR";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  return TIMEZONE_TO_COUNTRY[tz] ?? "FR";
}
