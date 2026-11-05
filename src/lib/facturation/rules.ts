// Règles fiscales de SDG STUDIO. Aucune décision de TVA ne se prend ailleurs :
// ni Claude ni la commande en ligne ne peuvent les contourner. Fonctions pures,
// testées en rejouant les factures existantes (commande "replay").

export const POSITION = { LU_COMPANY: 2, EU_PRIVATE: 3, EU_COMPANY: 4, NON_EU_COMPANY: 5, NON_EU_PRIVATE: 6 } as const;
export const TAX = { S17: 192, IC0: 188, EC0: 187 } as const;
export const PRODUCT = { CONSEIL: 1, ACOMPTE: 2, PLACEMENT: 4, SITE_WEB: 5, SKOOL: 6 } as const;
export const INCOME_ACCOUNT = 639;
export const SALES_JOURNAL = 8;
export const EUR = 125;

export const MENTION_AUTOLIQUIDATION = "Autoliquidation. TVA due par le preneur, article 196 de la directive 2006/112/CE.";
export const MENTION_SOCIETE_HORS_UE =
  "Prestation de services non soumise à la TVA luxembourgeoise. Lieu de la prestation situé hors de l'Union européenne, article 17, paragraphe 1er, de la loi TVA luxembourgeoise (article 44 de la directive 2006/112/CE). TVA éventuellement due par le preneur selon la législation locale.";
export const MENTION_PARTICULIER_HORS_UE =
  "TVA luxembourgeoise non applicable : prestation de conseil localisée au lieu de résidence du preneur, non assujetti établi hors de l'Union européenne (article 17, paragraphe 2, point 8°, lettre c), de la loi modifiée du 12 février 1979 ; article 59, point c), de la directive 2006/112/CE).";

const EU = new Set(["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"]);

export type ClientFacts = {
  isCompany: boolean;
  countryCode: string | null;
  vat: string | null;
  // Position 6 posée à la main sur la fiche ET preuve jointe à une facture.
  hasResidenceProof: boolean;
};

export type TaxDecision =
  | { ok: true; positionId: number; taxId: number; rate: number; mention: string | null; mentionFromPosition: boolean }
  | { ok: false; reason: string };

export function validVatFormat(vat: string | null, countryCode: string): boolean {
  if (!vat) return false;
  const v = vat.replace(/\s/g, "").toUpperCase();
  const prefix = countryCode === "GR" ? "EL" : countryCode;
  return v.startsWith(prefix) && /^[A-Z]{2}[0-9A-Z]{8,12}$/.test(v);
}

export function decideTax(c: ClientFacts): TaxDecision {
  if (!c.countryCode) return { ok: false, reason: "Pays du client inconnu" };
  const inEu = EU.has(c.countryCode);
  if (c.isCompany) {
    if (c.countryCode === "LU") return { ok: true, positionId: POSITION.LU_COMPANY, taxId: TAX.S17, rate: 0.17, mention: null, mentionFromPosition: false };
    if (inEu) {
      if (!validVatFormat(c.vat, c.countryCode)) return { ok: false, reason: "Société de l'UE sans numéro de TVA valide" };
      return { ok: true, positionId: POSITION.EU_COMPANY, taxId: TAX.IC0, rate: 0, mention: MENTION_AUTOLIQUIDATION, mentionFromPosition: false };
    }
    return { ok: true, positionId: POSITION.NON_EU_COMPANY, taxId: TAX.EC0, rate: 0, mention: MENTION_SOCIETE_HORS_UE, mentionFromPosition: false };
  }
  if (inEu) return { ok: true, positionId: POSITION.EU_PRIVATE, taxId: TAX.S17, rate: 0.17, mention: null, mentionFromPosition: false };
  if (!c.hasResidenceProof) return { ok: false, reason: "Particulier hors UE sans preuve de résidence : la TVA dépend de cette preuve" };
  return { ok: true, positionId: POSITION.NON_EU_PRIVATE, taxId: TAX.EC0, rate: 0, mention: MENTION_PARTICULIER_HORS_UE, mentionFromPosition: true };
}

export function htFromTtc(ttc: number, rate: number): number {
  return Math.round((ttc / (1 + rate)) * 100) / 100;
}

function euros(n: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n).replace(/ /g, " ");
}

// Note d'une mensualité. Échéances égales seulement : le reste passe par Jeremy.
export function installmentNote(position: number, amounts: number[], rate: number): { ok: true; note: string } | { ok: false; reason: string } {
  if (amounts.length < 2) return { ok: false, reason: "Une seule échéance : ce n'est pas une mensualité" };
  if (!amounts.every((a) => a === amounts[0])) return { ok: false, reason: "Échéances de montants différents : note à écrire à la main" };
  const total = amounts.reduce((s, a) => s + a, 0);
  const left = amounts.slice(position).reduce((s, a) => s + a, 0);
  const ttc = rate > 0 ? " TTC" : "";
  return {
    ok: true,
    note: `Acompte n°${position} sur le conseil personnalisé App Mastery. Montant total : ${euros(total)} €${ttc}, réglable en ${amounts.length} mensualités de ${euros(amounts[0])} €${ttc}. Solde restant après ce versement : ${euros(left)} €${ttc}.`,
  };
}

const squeeze = (s: string) => s.replace(/\s+/g, " ").trim();

// Contrôle du PDF final : il doit porter le bon numéro, le bon nom, la bonne
// mention une seule fois et aucun mot interdit. Renvoie la liste des problèmes.
export function checkInvoiceText(text: string, expected: { number: string; mention: string | null; total: number }): string[] {
  const t = squeeze(text);
  const compact = t.replace(/\s/g, "");
  const problems: string[] = [];
  if (!t.includes(expected.number)) problems.push(`Numéro ${expected.number} absent du PDF`);
  if (!t.includes("SDG STUDIO SARL-S")) problems.push("Nom SDG STUDIO SARL-S absent du PDF");
  if (/pitault/i.test(t)) problems.push("Ancien nom de la société dans le PDF");
  if (/exon[eé]r/i.test(t)) problems.push("Mot « exonéré » dans le PDF");
  if (/\bformation\b/i.test(t)) problems.push("Mot « formation » dans le PDF");
  if (/\baccompagnement\b/i.test(t)) problems.push("Mot « accompagnement » dans le PDF");
  if (t.includes("—")) problems.push("Tiret cadratin dans le PDF");
  const totalText = expected.total.toFixed(2).replace(".", ",");
  if (!compact.includes(totalText)) problems.push(`Total ${totalText} absent du PDF`);
  if (expected.mention) {
    const needle = expected.mention.replace(/\s/g, "");
    const count = compact.split(needle).length - 1;
    if (count !== 1) problems.push(`Mention fiscale présente ${count} fois au lieu d'une`);
  }
  return problems;
}
