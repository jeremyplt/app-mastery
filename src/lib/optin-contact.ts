// Contact capturé à l'optin (VSL, plan d'action, guides), persisté en
// localStorage pour pré-remplir et sauter l'étape contact de la candidature
// /appel : le prospect a déjà tout donné, on ne lui redemande pas.

const KEY = "optin_contact";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

export interface OptinContact {
  firstName: string;
  email: string;
  phone: string; // E.164 (+33612345678)
  savedAt: number;
}

export function saveOptinContact(contact: {
  firstName: string;
  email: string;
  phone: string;
}): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...contact, savedAt: Date.now() }));
  } catch {
    // localStorage indisponible : tant pis, l'étape contact s'affichera.
  }
}

export function loadOptinContact(): OptinContact | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const contact = JSON.parse(raw) as OptinContact;
    if (!contact.firstName || !contact.email || !contact.phone) return null;
    if (Date.now() - contact.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return contact;
  } catch {
    return null;
  }
}
