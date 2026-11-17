// Référence de virement demandée aux élèves : « App Mastery {Nom} {n}/{N} ».
// Les élèves l'écrivent à leur façon : majuscules, accents, tirets, espaces en
// trop ou en moins (« APP MASTERYMALIKA SANI 2/3 »), nom à l'envers, texte de
// leur banque devant (« PAYMENT FOR COURSE »), sans le n/N.

export type ParsedReference = {
  // Ce qui reste une fois « App Mastery » et le n/N retirés : le nom, en gros.
  name: string;
  position: number | null;
  total: number | null;
};

export function fold(s: string | null | undefined): string {
  return (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const APP_MASTERY = /app[\s\-_.:]*mastery/;
const PART = /(\d{1,2})\s*(?:\/|sur)\s*(\d{1,2})(?!\d)/g;

export function parseReference(reference: string | null | undefined): ParsedReference | null {
  const text = fold(reference);
  const m = APP_MASTERY.exec(text);
  if (!m) return null;
  let rest = `${text.slice(0, m.index)} ${text.slice(m.index + m[0].length)}`;
  let position: number | null = null;
  let total: number | null = null;
  // Le dernier « n/N » plausible (une date comme 17/11 n'en est pas un).
  const parts = [...rest.matchAll(PART)].filter((p) => Number(p[1]) >= 1 && Number(p[2]) >= 1 && Number(p[2]) <= 12 && Number(p[1]) <= Number(p[2]));
  const last = parts.at(-1);
  if (last) {
    position = Number(last[1]);
    total = Number(last[2]);
    rest = rest.slice(0, last.index) + " " + rest.slice((last.index ?? 0) + last[0].length);
  }
  const name = rest.replace(/[^a-z0-9]+/g, " ").trim();
  return { name, position, total };
}
