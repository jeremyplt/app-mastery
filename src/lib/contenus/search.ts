// Recherche de vidéos d'inspiration (TikTok) pour la niche d'un élève : lecture
// des résultats, tri et filtres. Fonctions pures, testées.
//
// Règles de Jeremy pour la GIGA BANQUE : la vidéo doit montrer ou expliquer une
// app mobile, au moins 10 000 vues ou 1 000 likes, rester dans la niche, et ne
// jamais citer l'app d'un élève (le document est public).

export type Candidate = {
  plateforme: "TikTok";
  id: string;
  url: string;
  compte: string;
  legende: string;
  vues: number;
  likes: number;
};

export const MIN_VUES = 10_000;
export const MIN_LIKES = 1_000;

type Aweme = {
  aweme_id?: string;
  desc?: string;
  share_url?: string;
  author?: { unique_id?: string };
  statistics?: { play_count?: number; digg_count?: number };
};

// Réponse de ScrapeCreators (GET /v1/tiktok/search/keyword) -> candidats.
export function parseScrapeCreators(raw: unknown): Candidate[] {
  const items = ((raw as { search_item_list?: { aweme_info?: Aweme }[] })?.search_item_list ?? []).map((i) => i?.aweme_info).filter(Boolean) as Aweme[];
  return items
    .filter((a) => a.aweme_id && a.author?.unique_id)
    .map((a) => ({
      plateforme: "TikTok" as const,
      id: String(a.aweme_id),
      url: `https://www.tiktok.com/@${a.author!.unique_id}/video/${a.aweme_id}`,
      compte: `@${a.author!.unique_id}`,
      legende: (a.desc ?? "").replace(/\s+/g, " ").trim(),
      vues: Number(a.statistics?.play_count ?? 0),
      likes: Number(a.statistics?.digg_count ?? 0),
    }));
}

// Lien d'une vidéo TikTok -> identifiant (pour dédoublonner).
export function tiktokId(url: string): string | null {
  const m = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  return m ? m[1] : null;
}

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Un nom interdit (app d'élève) apparaît-il dans le texte ?
export function mentionsAny(text: string, names: string[]): boolean {
  const t = norm(text);
  return names.some((n) => {
    const w = norm(n).trim();
    return w.length >= 3 && new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`).test(t);
  });
}

// Dédoublonne, retire les vidéos trop peu vues et celles qui citent une app
// d'élève, puis garde les plus vues.
export function selectCandidates(list: Candidate[], opts: { exclude: string[]; max: number; dejaVus?: Set<string> }): Candidate[] {
  const seen = new Set<string>(opts.dejaVus ?? []);
  const out: Candidate[] = [];
  for (const c of [...list].sort((a, b) => b.vues - a.vues)) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    if (c.vues < MIN_VUES && c.likes < MIN_LIKES) continue;
    if (mentionsAny(`${c.compte} ${c.legende}`, opts.exclude)) continue;
    out.push(c);
    if (out.length >= opts.max) break;
  }
  return out;
}

export function formatVues(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(".", ",").replace(",0", "")} M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)} k`;
  return String(n);
}

export type Verified = Candidate & { app: string; description: string };

// Ligne de la GIGA BANQUE : « 1,2 M vues · @compte · App : ce qu'on voit ».
export function bankLine(v: Verified): { texte: string; url: string } {
  const what = [v.app, v.description].filter(Boolean).join(" : ");
  return { texte: `${formatVues(v.vues)} vues · ${v.compte}${what ? ` · ${what}` : ""}`.slice(0, 220), url: v.url };
}
