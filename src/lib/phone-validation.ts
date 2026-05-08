import { parsePhoneNumberFromString } from "libphonenumber-js";
import { ALLOWED_COUNTRIES } from "./phone-countries";

export type PhoneValidationOk = {
  ok: true;
  e164: string;
  country: string;
};

export type PhoneValidationFail = {
  ok: false;
  reason: "format" | "country" | "pattern";
  message: string;
};

export type PhoneValidationResult = PhoneValidationOk | PhoneValidationFail;

export function looksLikeFakePattern(nationalNumber: string): boolean {
  const n = nationalNumber;

  if (/(\d)\1{4,}/.test(n)) return true;

  if (/(\d{2})\1{2,}/.test(n)) return true;

  if (/(\d{3})\1{1,}/.test(n)) return true;

  if (/(?:01234567|12345678|23456789)/.test(n)) return true;
  if (/(?:98765432|87654321|76543210)/.test(n)) return true;

  const unique = new Set(n.split(""));
  if (unique.size <= 3) return true;

  return false;
}

export function validatePhone(input: string): PhoneValidationResult {
  const trimmed = (input || "").trim();
  if (!trimmed) {
    return { ok: false, reason: "format", message: "Numéro de téléphone requis" };
  }

  const parsed = parsePhoneNumberFromString(trimmed);
  if (!parsed || !parsed.isValid()) {
    return { ok: false, reason: "format", message: "Numéro de téléphone invalide" };
  }

  const country = parsed.country;
  if (!country || !ALLOWED_COUNTRIES.has(country)) {
    return {
      ok: false,
      reason: "country",
      message: "Pays non supporté pour le moment",
    };
  }

  if (country === "FR" && !/^[67]/.test(parsed.nationalNumber)) {
    return {
      ok: false,
      reason: "country",
      message: "Pour la France, utilise un numéro mobile (06 ou 07).",
    };
  }

  if (looksLikeFakePattern(parsed.nationalNumber)) {
    return {
      ok: false,
      reason: "pattern",
      message: "Ce numéro n'est pas valide. Merci de rentrer un vrai numéro.",
    };
  }

  return { ok: true, e164: parsed.format("E.164"), country };
}
