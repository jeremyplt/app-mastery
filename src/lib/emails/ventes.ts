// Rappels d'échéance envoyés aux élèves qui paient en plusieurs fois, par
// virement. Un email par rappel (J-3, J-1, jour J par défaut), avec le montant,
// la date et les coordonnées bancaires.

import type { BuiltEmail } from "@/lib/emails/transactional";
import { P, button, esc, signature, wrap } from "@/lib/emails/layout";

// intermediaryBic : BIC intermédiaire pour les virements émis hors Espace
// économique européen.
export type BankDetails = { holder: string; address: string; iban: string; bic: string; intermediaryBic: string; bank: string };

export type ReminderInput = {
  firstName: string;
  lastName?: string | null;
  amount: number;
  currency: string;
  dueDate: string; // "2026-10-12"
  position: number;
  installments: number;
  offset: number; // jours avant l'échéance (0 = jour J)
  bank: BankDetails;
};

export function formatMoney(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

// "2026-10-12" -> "lundi 12 octobre"
export function formatDueDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );
}

// "FR7612345..." -> "FR76 1234 5..."
function groupIban(iban: string): string {
  return iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 14px 6px 0;font-size:15px;color:#6e6e73;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:6px 0;font-size:15px;font-weight:600;color:#1d1d1f;font-family:ui-monospace,Menlo,monospace">${esc(value)}</td></tr>`;
}

export function paymentReference(input: Pick<ReminderInput, "firstName" | "lastName" | "position" | "installments">): string {
  const name = [input.firstName, input.lastName].filter(Boolean).join(" ");
  return `App Mastery ${name} ${input.position}/${input.installments}`;
}

export function paymentReminder(input: ReminderInput): BuiltEmail {
  const date = formatDueDate(input.dueDate);
  const amount = formatMoney(input.amount, input.currency);
  const ordinal = input.position === 1 ? "1re" : `${input.position}e`;
  const what = `la ${ordinal} échéance de ton accompagnement App Mastery`;

  const when =
    input.offset === 0
      ? `c'est aujourd'hui : ${what} (${amount}) est à régler ce ${date}.`
      : input.offset === 1
        ? `${what} (${amount}) arrive demain, le ${date}.`
        : `${what} (${amount}) arrive le ${date}.`;

  const subject =
    input.offset === 0
      ? "Ton échéance d'aujourd'hui"
      : input.offset === 1
        ? "Ton échéance de demain"
        : `Ton échéance du ${date.replace(/^\S+ /, "")}`;

  const b = input.bank;
  const table = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 22px;padding:14px 18px;background:#f5f5f7;border-radius:12px;border-collapse:separate">
${row("Montant", amount)}
${row("Bénéficiaire", b.holder)}
${b.address ? row("Adresse", b.address) : ""}
${row("IBAN", groupIban(b.iban))}
${b.bic ? row("BIC", b.bic) : ""}
${b.intermediaryBic ? row("BIC intermédiaire (hors EEE)", b.intermediaryBic) : ""}
${b.bank ? row("Banque", b.bank) : ""}
${row("Référence", paymentReference(input))}
</table>`;

  const body = `
<p ${P}>Salut ${esc(input.firstName)},</p>
<p ${P}>Petit rappel, ${esc(when)}</p>
<p ${P}>Voici les informations pour faire le virement :</p>
${table}
<p ${P}>Une fois le virement fait, réponds simplement à cet email avec la capture du virement. Je le note de mon côté.</p>
<p ${P}>Si tu l'as déjà fait, ne tiens pas compte de ce message.</p>
${signature("À très vite")}`;

  return { subject, html: wrap(body), tag: `vente-rappel-j${input.offset}` };
}

// Relance d'un contrat envoyé mais pas encore signé (J+1 puis J+3).
export function contractReminder(firstName: string, link: string, step: 1 | 3): BuiltEmail {
  const body =
    step === 1
      ? `
<p ${P}>Salut ${esc(firstName)},</p>
<p ${P}>Je t'ai envoyé hier ton contrat d'accompagnement App Mastery. Il te reste juste à le signer pour qu'on puisse démarrer.</p>
<p ${P}>Ça prend deux minutes, directement en ligne :</p>
${button("Signer mon contrat", link)}
<p ${P}>Si tu as une question sur un point du contrat, réponds simplement à cet email.</p>
${signature("À très vite")}`
      : `
<p ${P}>Salut ${esc(firstName)},</p>
<p ${P}>Ton contrat App Mastery n'est pas encore signé. Tant qu'il ne l'est pas, je ne peux pas t'ouvrir l'accès à la communauté ni lancer ton accompagnement.</p>
${button("Signer mon contrat", link)}
<p ${P}>Si quelque chose te bloque, dis-le-moi en répondant à cet email, on règle ça ensemble.</p>
${signature("À très vite")}`;
  return {
    subject: step === 1 ? "Ton contrat App Mastery" : "Il manque ta signature",
    html: wrap(body),
    tag: `vente-contrat-j${step}`,
  };
}

// Alerte interne envoyée à Jeremy (jeremypltpro@gmail.com).
export function adminAlert(subject: string, lines: string[], tag = "vente-admin"): BuiltEmail {
  const body = `${lines.map((l) => `<p ${P}>${l}</p>`).join("\n")}
${button("Ouvrir les ventes", "https://www.jeremypitault.com/admin/ventes")}`;
  return { subject, html: wrap(body), tag };
}
