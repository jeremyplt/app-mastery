// Ce que chaque campagne (utm_campaign, donc chaque vidéo) a rapporté dans le
// CRM : leads, RDV, élèves et euros.
//
// Une personne = un email. Elle est rattachée aux UTM de sa plus ancienne
// fiche qui en porte (crm_leads ou candidature), et comptée sur la période
// de son premier contact. Ses ventes comptent en entier, même signées après.

import { firstTouch } from "./utm";

export type ContactRow = {
  email: string;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  call_booked?: boolean | null;
};

// Une vente ou un élève sans vente, déjà ramené en euros.
export type RevenueRow = { email: string; created_at: string; signed: number; cashed: number };

export type AttributionRow = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  leads: number;
  rdv: number;
  students: number;
  signed: number;
  cashed: number;
};

type Person = { first: string; contacts: ContactRow[]; booked: boolean; signed: number; cashed: number; student: boolean };

export function attribute(contacts: ContactRow[], revenue: RevenueRow[], since: string | null): AttributionRow[] {
  const people = new Map<string, Person>();
  const personOf = (email: string, at: string) => {
    const key = email.trim().toLowerCase();
    let p = people.get(key);
    if (!p) {
      p = { first: at, contacts: [], booked: false, signed: 0, cashed: 0, student: false };
      people.set(key, p);
    }
    if (at < p.first) p.first = at;
    return p;
  };

  for (const c of contacts) {
    if (!c.email) continue;
    const p = personOf(c.email, c.created_at);
    p.contacts.push(c);
    if (c.call_booked) p.booked = true;
  }
  revenue.forEach((r, i) => {
    // Élève sans email : compté à part (dans « sans UTM »), pour que les
    // euros collent au chiffre d'affaires.
    const p = personOf(r.email || `sans-email-${i}`, r.created_at);
    p.student = true;
    p.signed += r.signed;
    p.cashed += r.cashed;
  });

  const rows = new Map<string, AttributionRow>();
  for (const p of people.values()) {
    if (since && p.first < since) continue;
    const utm = firstTouch(p.contacts);
    const key = JSON.stringify([utm?.utm_source ?? null, utm?.utm_medium ?? null, utm?.utm_campaign ?? null]);
    let row = rows.get(key);
    if (!row) {
      row = {
        source: utm?.utm_source ?? null,
        medium: utm?.utm_medium ?? null,
        campaign: utm?.utm_campaign ?? null,
        leads: 0,
        rdv: 0,
        students: 0,
        signed: 0,
        cashed: 0,
      };
      rows.set(key, row);
    }
    row.leads += 1;
    // Un élève a forcément eu son appel, même si la fiche ne le dit pas.
    if (p.booked || p.student) row.rdv += 1;
    if (p.student) row.students += 1;
    row.signed += p.signed;
    row.cashed += p.cashed;
  }

  return [...rows.values()]
    .map((r) => ({ ...r, signed: Math.round(r.signed * 100) / 100, cashed: Math.round(r.cashed * 100) / 100 }))
    .sort((a, b) => b.signed - a.signed || b.leads - a.leads);
}
