// Questions qui reviennent chez les élèves (relevées dans WhatsApp), suivies
// dans /admin/questions : Jeremy coche « fait » quand il a mis quelque chose en
// place (leçon Skool, FAQ, modèle...), archive ou supprime le reste. Les
// supports faits avec un lien servent aux brouillons WhatsApp.

export type QuestionStatut = "a_faire" | "fait" | "archive";

export const STATUTS: QuestionStatut[] = ["a_faire", "fait", "archive"];

export type QuestionExemple = { question: string; name: string; date: string };

export type StudentQuestion = {
  id: string;
  intitule: string;
  theme: string | null;
  nb_eleves: number;
  nb_fois: number;
  reponses_longues: number;
  eleves: string[];
  exemples: QuestionExemple[];
  derniere_fois: string | null;
  couvert: "oui" | "en partie" | "non" | null;
  reponse: string | null;
  support_format: string | null;
  support_titre: string | null;
  support_contenu: string | null;
  statut: QuestionStatut;
  note: string | null;
  lien: string | null;
  fait_at: string | null;
  source: string;
  created_at: string;
  updated_at: string;
};

export const MAX_NOTE = 2_000;

// Lien http(s) seulement, sinon null. Une valeur vide efface le lien.
export function cleanLien(raw: unknown): string | null | undefined {
  if (raw === undefined) return undefined;
  if (raw === null) return null;
  if (typeof raw !== "string") return undefined;
  const v = raw.trim();
  if (!v) return null;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

// Plus d'élèves concernés d'abord, puis plus de fois posée.
export function sortQuestions<T extends Pick<StudentQuestion, "nb_eleves" | "nb_fois">>(list: T[]): T[] {
  return [...list].sort((a, b) => b.nb_eleves - a.nb_eleves || b.nb_fois - a.nb_fois);
}

// Supports déjà en place (faits, avec un lien), ajoutés à la base de conseils
// des brouillons pour que l'IA donne le lien quand la question revient.
export function formatSupports(rows: Pick<StudentQuestion, "intitule" | "statut" | "lien" | "note" | "support_titre">[]): string {
  const ready = rows.filter((r) => r.statut === "fait" && r.lien);
  if (!ready.length) return "";
  const clean = (s: string) => s.replace(/<\/?[a-z_]+>/gi, "").replace(/\s+/g, " ").trim();
  return [
    "## Supports déjà prêts (donne le lien quand la question s'en rapproche)",
    ...ready.map((r) => {
      const what = clean(r.note || r.support_titre || "");
      return `- Question : ${clean(r.intitule)}${what ? ` Support : ${what}.` : ""} Lien : ${r.lien}`;
    }),
  ].join("\n");
}
