// Campagnes Brevo des sorties de vidéo : une liste par vidéo, puis une
// campagne en BROUILLON. Ce fichier n'a aucune fonction d'envoi : c'est Jeremy
// qui relit et envoie depuis Brevo.

const API = "https://api.brevo.com/v3";
export const SENDER = { name: "Jeremy Pitault", email: "contact@jeremypitault.com" };
// Dossier « App Mastery » des listes Brevo.
export const LIST_FOLDER_ID = 1;
// Liste « Skool Members » : les élèves ne reçoivent jamais ces emails.
export const EXCLUDED_LIST_IDS = [19];

type FetchLike = typeof fetch;

async function call<T>(key: string, method: string, path: string, body?: unknown, fetchImpl: FetchLike = fetch): Promise<T> {
  const res = await fetchImpl(`${API}${path}`, {
    method,
    headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Brevo ${method} ${path.split("?")[0]} : ${res.status} ${text.slice(0, 200)}`);
  return (text ? JSON.parse(text) : {}) as T;
}

// Un brouillon du même nom existe déjà (passage coupé après la création) ?
export async function findDraftByName(key: string, name: string, fetchImpl?: FetchLike): Promise<number | null> {
  const r = await call<{ campaigns?: { id: number; name: string }[] }>(key, "GET", "/emailCampaigns?type=classic&status=draft&limit=100&sort=desc", undefined, fetchImpl);
  return r.campaigns?.find((c) => c.name === name)?.id ?? null;
}

export async function createList(key: string, name: string, fetchImpl?: FetchLike): Promise<number> {
  const r = await call<{ id: number }>(key, "POST", "/contacts/lists", { name, folderId: LIST_FOLDER_ID }, fetchImpl);
  return r.id;
}

// Ajoute les leads déjà présents dans Brevo, 150 par appel (limite de l'API).
// Ceux qui n'y sont pas ne sont pas créés : ils sont seulement comptés.
export async function addEmailsToList(key: string, listId: number, emails: string[], fetchImpl?: FetchLike): Promise<{ added: number; missing: number }> {
  let added = 0;
  let missing = 0;
  for (let i = 0; i < emails.length; i += 150) {
    const chunk = emails.slice(i, i + 150);
    try {
      const r = await call<{ contacts?: { success?: string[]; failure?: string[] } }>(key, "POST", `/contacts/lists/${listId}/contacts/add`, { emails: chunk }, fetchImpl);
      added += r.contacts?.success?.length ?? 0;
      missing += r.contacts?.failure?.length ?? 0;
    } catch (e) {
      // Brevo répond 400 quand aucun email du paquet n'existe chez lui.
      if (String(e).includes(" 400 ")) missing += chunk.length;
      else throw e;
    }
  }
  return { added, missing };
}

export async function createDraftCampaign(
  key: string,
  c: { name: string; subject: string; previewText: string; html: string; listId: number | null },
  fetchImpl?: FetchLike,
): Promise<number> {
  const r = await call<{ id: number }>(
    key,
    "POST",
    "/emailCampaigns",
    {
      name: c.name,
      subject: c.subject,
      previewText: c.previewText,
      sender: SENDER,
      replyTo: SENDER.email,
      htmlContent: c.html,
      // Pas de « tag » : l'abonnement Brevo le refuse sur les campagnes (405).
      // Chaque campagne a ses statistiques, et les liens portent l'utm_campaign.
      // Sans liste (essai), le brouillon ne peut partir chez personne.
      ...(c.listId ? { recipients: { listIds: [c.listId], exclusionListIds: EXCLUDED_LIST_IDS } } : {}),
    },
    fetchImpl,
  );
  return r.id;
}

// Les brouillons n'ont pas de lien d'aperçu public chez Brevo : on renvoie vers
// la liste des campagnes email, où le brouillon apparaît en tête.
export const CAMPAIGNS_URL = "https://app.brevo.com/campaigns/listing/email";
