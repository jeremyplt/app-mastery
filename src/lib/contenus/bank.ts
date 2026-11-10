// Sections de la GIGA BANQUE DE CONTENU, lues dans l'export public du document
// (il est partagé par lien) : avant toute recherche, on vérifie que la niche de
// l'élève n'a pas déjà sa section, pour ne pas la répéter.
export const BANK_DOC = "1j_5Hru4rpGmoQ4gMNuQ_03IeZ_YXBpOfgqcWvxirLw8";

export type BankSection = { titre: string; id: string };

// Entités HTML de l'export Google Docs (accents français compris).
const NAMED: Record<string, string> = {
  nbsp: " ", amp: "&", quot: '"', lt: "<", gt: ">", apos: "'", rsquo: "'", lsquo: "'", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»", hellip: "…", ndash: "-", mdash: "-",
  agrave: "à", acirc: "â", auml: "ä", aelig: "æ", ccedil: "ç", eacute: "é", egrave: "è", ecirc: "ê", euml: "ë", icirc: "î", iuml: "ï", ocirc: "ô", ouml: "ö", oelig: "œ", ugrave: "ù", ucirc: "û", uuml: "ü", yuml: "ÿ",
  Agrave: "À", Acirc: "Â", Ccedil: "Ç", Eacute: "É", Egrave: "È", Ecirc: "Ê", Icirc: "Î", Ocirc: "Ô", Ugrave: "Ù", Ucirc: "Û", OElig: "Œ",
};

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED[name] ?? m)
    .replace(/\s+/g, " ")
    .trim();

// Titres de niveau 1 (une section par niche) et leur ancre.
export function parseSections(html: string): BankSection[] {
  const out: BankSection[] = [];
  for (const m of html.matchAll(/<h1[^>]*\bid="(h\.[^"]+)"[^>]*>([\s\S]*?)<\/h1>/g)) {
    const titre = decode(m[2]);
    if (titre) out.push({ titre, id: m[1] });
  }
  return out;
}

export const sectionLink = (id: string) => `https://docs.google.com/document/d/${BANK_DOC}/edit#heading=${id}`;

export async function fetchSections(): Promise<BankSection[]> {
  const res = await fetch(`https://docs.google.com/document/d/${BANK_DOC}/export?format=html`, { redirect: "follow", signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`GIGA BANQUE illisible (${res.status})`);
  return parseSections(await res.text());
}
