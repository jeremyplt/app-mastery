// Règles de la comptabilité automatique, sans aucun branchement : quelles opérations
// bancaires demandent un justificatif, et quel document va avec quelle dépense.
// Le code décide seul du rapprochement : Claude ne fait que lire les documents.

export type Categorie = "fournisseur" | "frais_bancaires" | "salaire" | "administration";

export type Leg = { amount: number; currency: string; description?: string; account_id?: string; bill_amount?: number; bill_currency?: string; counterparty?: { account_type?: string } };
export type Transaction = {
  id: string;
  type: string;
  state: string;
  created_at: string;
  completed_at?: string;
  reference?: string;
  merchant?: { name?: string; category_code?: string };
  legs: Leg[];
};

export type Depense = {
  id: string;
  date: string; // AAAA-MM-JJ
  montant: number; // positif, dans la devise du compte
  devise: string;
  montant_facture: number | null; // montant prélevé par le marchand dans sa devise, s'il diffère
  devise_facture: string | null;
  marchand: string;
  libelle: string;
  type: string;
  categorie: Categorie;
  statut: "manquant" | "sans_justificatif";
  note: string | null;
};

// Opérations sans pièce fournisseur : la fiche de paie et les courriers de
// l'administration sont faits par SKG ou arrivent par la poste.
const SALAIRE = [/^to jeremy pitault$/i];
const ADMINISTRATION = [/\bACD\b/i, /RECETTE/i, /\bCCSS\b/i, /centre commun/i, /administration/i, /\bAED\b/i];

const jour = (iso: string) => iso.slice(0, 10);

// Une dépense à justifier, ou null pour ce qui n'en est pas une (entrée d'argent,
// virement entre nos comptes, change, paiement annulé).
export function classer(tx: Transaction, nosComptes: Set<string>): Depense | null {
  if (tx.state !== "completed") return null;
  if (!["card_payment", "transfer", "charge", "fee"].includes(tx.type)) return null;
  const sortie = tx.legs.find((l) => l.amount < 0 && (!l.account_id || nosComptes.has(l.account_id)));
  if (!sortie) return null;
  // Virement entre nos propres comptes (TVA, Closers, Impôts…) : deux jambes chez nous.
  if (tx.legs.some((l) => l.amount > 0 && l.account_id && nosComptes.has(l.account_id))) return null;
  const libelle = (sortie.description ?? "").trim();
  if (tx.type === "transfer" && /^to (eur|usd|gbp) /i.test(libelle)) return null;

  const base = {
    id: tx.id,
    date: jour(tx.completed_at ?? tx.created_at),
    montant: Math.round(-sortie.amount * 100) / 100,
    devise: sortie.currency,
    montant_facture: sortie.bill_amount != null && sortie.bill_currency && sortie.bill_currency !== sortie.currency ? Math.round(-sortie.bill_amount * 100) / 100 : null,
    devise_facture: sortie.bill_amount != null && sortie.bill_currency && sortie.bill_currency !== sortie.currency ? sortie.bill_currency : null,
    marchand: tx.merchant?.name ?? libelle.replace(/^to /i, ""),
    libelle: [libelle, tx.reference].filter(Boolean).join(" · "),
    type: tx.type,
  };
  if (tx.type === "charge" || tx.type === "fee") return { ...base, marchand: "Revolut", categorie: "frais_bancaires", statut: "manquant", note: null };
  if (tx.type === "transfer" && SALAIRE.some((r) => r.test(libelle))) return { ...base, categorie: "salaire", statut: "sans_justificatif", note: "Salaire : la fiche de paie est faite par SKG." };
  if (tx.type === "transfer" && ADMINISTRATION.some((r) => r.test(libelle) || r.test(tx.reference ?? ""))) return { ...base, categorie: "administration", statut: "sans_justificatif", note: "Paiement à l'administration : le courrier part à SKG, pas de facture." };
  return { ...base, categorie: "fournisseur", statut: "manquant", note: null };
}

// Les mois d'avant ont été faits à la main par Jeremy : la compta automatique
// commence en novembre 2026. Aucune dépense plus ancienne n'est cherchée.
export const DEBUT = "2026-11-01";

// ── Rapprochement ────────────────────────────────────────────────────────────

export type Lu = {
  id: string;
  nature: "facture" | "recu" | "autre";
  fournisseur: string | null;
  date_doc: string | null;
  total: number | null;
  devise: string | null;
  mail_de: string | null;
  nom_fichier: string | null;
  // Une facture Revolut est déjà rattachée à sa dépense par l'API.
  depense_imposee?: string | null;
  // Pièce déposée par Jeremy lui-même dans Odoo : il l'a choisie pour la compta,
  // et le dossier du mois (« Octobre ») sert d'indice quand la date est illisible.
  deposee_par_jeremy?: boolean;
  mois_dossier?: string | null; // AAAA-MM
  mail_date?: string | null; // AAAA-MM-JJ, date du mail qui portait la pièce
};

const MOTS_VIDES = new Set(["inc", "llc", "ltd", "limited", "gmbh", "sarl", "sas", "sa", "bv", "the", "com", "www", "io", "co", "corp", "corporation", "company", "europe", "ireland", "international", "payments", "billing", "invoice", "receipt", "noreply", "no", "reply", "mail", "email", "info", "support", "hello", "sub", "subscr", "subscription", "plan", "fee", "to", "de", "la", "le", "et", "and"]);

export function mots(s: string | null | undefined): string[] {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((m) => m.length >= 3 && !MOTS_VIDES.has(m));
}

// Le marchand de la banque (« Openai *chatgpt Subscr », « Facebk *01tr ») et le
// fournisseur du document (« OpenAI, LLC », expéditeur invoice+statements@openai.com)
// partagent-ils un mot, ou un mot qui commence par l'autre ?
const ALIAS: Record<string, string[]> = {
  facebook: ["meta", "facebk", "facebook"],
  facebk: ["meta", "facebook"],
  meta: ["facebook", "facebk"],
  skool: ["skool"],
  shine: ["vautrin"],
  whop: ["ipe", "whop"],
  elevenlabs: ["eleven", "elevenlabs"],
  amazon: ["amazon", "amzn"],
  revolut: ["revolut"],
  brevo: ["sendinblue", "brevo"],
  sendinblue: ["brevo"],
};

export function memeFournisseur(marchand: string, doc: Pick<Lu, "fournisseur" | "mail_de" | "nom_fichier">): boolean {
  const a = mots(marchand);
  const b = [...mots(doc.fournisseur), ...mots((doc.mail_de ?? "").split("@")[1] ?? ""), ...mots(doc.nom_fichier)];
  if (!a.length || !b.length) return false;
  for (const x of a) {
    const variantes = [x, ...(ALIAS[x] ?? [])];
    for (const y of b) {
      for (const v of variantes) {
        if (v === y) return true;
        if (Math.min(v.length, y.length) >= 4 && (v.startsWith(y) || y.startsWith(v))) return true;
      }
    }
  }
  return false;
}

const egal = (a: number | null, b: number | null) => a != null && b != null && Math.abs(a - b) < 0.011;
const ecartJours = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

export type Proposition = { depenseId: string; documentId: string; sur: boolean; score: number; raison: string };

export type DepenseOuverte = Pick<Depense, "id" | "date" | "montant" | "devise" | "montant_facture" | "devise_facture" | "marchand"> & {
  restaurant?: boolean; // café, restaurant, bar : le ticket ne compte pas le pourboire
  refuses?: string[]; // pièces déjà refusées par Jeremy pour cette dépense
};

// Codes marchands des restaurants, bars et fast-foods (ISO 18245).
export const MCC_RESTAURANT = new Set(["5812", "5813", "5814"]);

function noter(d: DepenseOuverte, doc: Lu): { score: number; sur: boolean; raison: string } | null {
  if (doc.total == null || d.refuses?.includes(doc.id)) return null;
  const fournisseur = memeFournisseur(d.marchand, doc);
  // Un bon de commande ou une confirmation déposés par Jeremy valent pièce s'ils
  // correspondent exactement ; un relevé bancaire, jamais.
  if (doc.nature === "autre" && !(doc.deposee_par_jeremy && fournisseur && !/revolut|releve|statement/i.test(`${doc.fournisseur} ${doc.nom_fichier}`))) return null;
  const devise = (doc.devise ?? "").toUpperCase();
  const montantExact = (devise === d.devise && egal(doc.total, d.montant)) || (!!d.devise_facture && devise === d.devise_facture && egal(doc.total, d.montant_facture));
  if (!doc.date_doc) {
    // Date illisible : seulement pour une pièce rangée par Jeremy dans le dossier du même mois.
    if (montantExact && doc.deposee_par_jeremy && doc.mois_dossier === d.date.slice(0, 7)) return { score: fournisseur ? 60 : 30, sur: fournisseur, raison: fournisseur ? "même montant, même fournisseur, rangée dans le dossier du mois" : "même montant, rangée dans le dossier du mois, date illisible" };
    // Sinon la date du mail sert d'indice, mais Jeremy confirme.
    if (montantExact && fournisseur && doc.mail_date) {
      const e = ecartJours(doc.mail_date, d.date);
      if (e >= -20 && e <= 40) return { score: 50 - Math.abs(e) / 10, sur: false, raison: `même montant, même fournisseur, date illisible (mail à ${Math.abs(e)} j)` };
    }
    return null;
  }
  const ecart = ecartJours(doc.date_doc, d.date);
  // Restaurant : la carte a payé le ticket plus un pourboire (jusqu'à 25 %).
  if (!montantExact && d.restaurant && devise === d.devise && doc.nature === "recu" && d.montant > doc.total && d.montant <= doc.total * 1.25 + 0.01 && ecart >= 0 && ecart <= 2) {
    const pourboire = (d.montant - doc.total).toFixed(2).replace(".", ",");
    return fournisseur ? { score: 70 - ecart, sur: true, raison: `ticket du même restaurant, ${pourboire} € de pourboire` } : { score: 25 - ecart, sur: false, raison: `ticket de restaurant du même jour, ${pourboire} € de pourboire, nom à confirmer` };
  }
  // Facture dans une autre devise, sans montant d'origine fourni par Revolut
  // (ElevenLabs : 11 USD payés 10,35 EUR) : même fournisseur, quelques jours,
  // montant cohérent avec le change. Jeremy confirme.
  if (!montantExact && fournisseur && devise && devise !== d.devise && !d.devise_facture && doc.nature !== "autre" && ecart >= -3 && ecart <= 5) {
    const ratio = d.montant / doc.total;
    if (ratio >= 0.8 && ratio <= 1.25) {
      const f = (x: number) => x.toFixed(2).replace(".", ",");
      return { score: 45 - Math.abs(ecart), sur: false, raison: `même fournisseur, ${f(doc.total)} ${devise} payés ${f(d.montant)} ${d.devise}, change à confirmer` };
    }
  }
  if (!montantExact) return null;
  // La facture est souvent émise avant le prélèvement (abonnement, facture du mois),
  // parfois quelques jours après (hôtel, facture envoyée en fin de mois).
  // Au-delà de 25 jours avant, ce peut être la facture du mois d'avant d'un
  // abonnement : Jeremy confirme.
  if (fournisseur && ecart >= -20 && ecart <= 40) {
    const score = 100 - Math.abs(ecart) + (doc.nature === "facture" ? 5 : 0);
    return ecart <= 25 ? { score, sur: true, raison: `même montant, même fournisseur, ${Math.abs(ecart)} j d'écart` } : { score, sur: false, raison: `même montant, même fournisseur, mais facture ${ecart} j avant le paiement (celle du mois d'avant ?)` };
  }
  if (!fournisseur && Math.abs(ecart) <= 3) {
    return { score: 40 - Math.abs(ecart), sur: false, raison: `même montant à ${Math.abs(ecart)} j, fournisseur à confirmer` };
  }
  return null;
}

// Associe chaque dépense ouverte à au plus un document, et chaque document à au
// plus une dépense. Les meilleures paires passent en premier ; une facture rattachée
// par Revolut à sa dépense passe avant tout.
export function rapprocher(depenses: DepenseOuverte[], documents: Lu[]): Proposition[] {
  const paires: Proposition[] = [];
  const parId = new Map(depenses.map((d) => [d.id, d]));
  for (const doc of documents) {
    if (doc.depense_imposee) {
      if (parId.has(doc.depense_imposee)) paires.push({ depenseId: doc.depense_imposee, documentId: doc.id, sur: true, score: 1000, raison: "reçu joint à la dépense dans Revolut" });
      continue;
    }
    for (const d of depenses) {
      const n = noter(d, doc);
      if (n) paires.push({ depenseId: d.id, documentId: doc.id, ...n });
    }
  }
  paires.sort((a, b) => b.score - a.score || a.depenseId.localeCompare(b.depenseId) || a.documentId.localeCompare(b.documentId));
  const prisD = new Set<string>();
  const prisDoc = new Set<string>();
  const out: Proposition[] = [];
  for (const p of paires) {
    if (prisD.has(p.depenseId) || prisDoc.has(p.documentId)) continue;
    prisD.add(p.depenseId);
    prisDoc.add(p.documentId);
    out.push(p);
  }
  return out;
}

// ── Rangement dans Odoo ──────────────────────────────────────────────────────

export const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

export const sansAccent = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const EXTENSIONS: Record<string, string> = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png", "image/heic": "heic", "image/webp": "webp" };

// « 2026-11-21 Calendly 40,00 EUR.pdf » : lisible pour la comptable, trié par date.
export function nomDepot(d: Pick<Depense, "date" | "marchand" | "montant" | "devise">, mime: string, nomOriginal?: string | null): string {
  const ext = EXTENSIONS[mime] ?? (nomOriginal?.match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase() ?? "pdf");
  const marchand = d.marchand.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
  const montant = d.montant.toFixed(2).replace(".", ",");
  return `${d.date} ${marchand} ${montant} ${d.devise}.${ext}`;
}
