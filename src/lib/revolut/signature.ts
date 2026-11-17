import { createHmac, timingSafeEqual } from "node:crypto";

// Signature des webhooks Revolut : HMAC-SHA256, avec le secret du webhook, de
// « v1. » + horodatage (ms) + « . » + corps brut. L'en-tête Revolut-Signature
// peut porter plusieurs « v1=<hex> » séparés par des virgules pendant une
// rotation du secret : un seul doit correspondre.

export const MAX_SKEW_MS = 5 * 60 * 1000;

export function expectedSignature(secret: string, timestamp: string, rawBody: string): string {
  return `v1=${createHmac("sha256", secret).update(`v1.${timestamp}.${rawBody}`).digest("hex")}`;
}

export function verifySignature(input: { secret: string; timestamp: string | null; signatures: string | null; rawBody: string; now?: number }): { ok: true } | { ok: false; reason: string } {
  const { secret, timestamp, signatures, rawBody } = input;
  if (!secret) return { ok: false, reason: "secret du webhook absent" };
  if (!timestamp || !/^\d{10,16}$/.test(timestamp)) return { ok: false, reason: "horodatage absent ou illisible" };
  // Un vieil envoi rejoué est refusé, même bien signé.
  if (Math.abs((input.now ?? Date.now()) - Number(timestamp)) > MAX_SKEW_MS) return { ok: false, reason: "horodatage à plus de 5 minutes" };
  if (!signatures) return { ok: false, reason: "signature absente" };
  const expected = Buffer.from(expectedSignature(secret, timestamp, rawBody));
  for (const part of signatures.split(",")) {
    const given = Buffer.from(part.trim());
    if (given.length === expected.length && timingSafeEqual(given, expected)) return { ok: true };
  }
  return { ok: false, reason: "signature invalide" };
}
