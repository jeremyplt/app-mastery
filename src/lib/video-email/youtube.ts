// Vidéos de la chaîne @jeremyptlt, lues par l'API YouTube Data avec une clé
// simple (lecture seule). Deux appels par passage, soit moins de 200 unités
// par jour sur les 10 000 offertes.

// Playlist « uploads » de la chaîne (UC… devient UU…).
export const UPLOADS_PLAYLIST = "UUG3ElQ0v4dyI71RDdac4ftw";
// Les Shorts durent au plus 3 minutes, les vidéos longues de Jeremy plus de 15.
export const SHORT_MAX_SECONDS = 180;
export const SITE_HOST = "www.jeremypitault.com";

export type Upload = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  durationS: number;
  // none, upcoming (première programmée) ou live
  live: string;
  privacy: string;
};

// « PT1H1M33S » => 3693 secondes.
export function parseDuration(iso: string): number {
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(iso);
  if (!m) return 0;
  const [d, h, min, s] = m.slice(1).map((x) => Number(x ?? 0));
  return d * 86_400 + h * 3_600 + min * 60 + s;
}

// Une vidéo longue, publique et déjà diffusée (pas un Short, pas une première).
export function isLongVideo(v: Upload): boolean {
  return v.durationS > SHORT_MAX_SECONDS && v.live === "none" && v.privacy === "public";
}

export const videoUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

type YtItem = {
  id: string;
  snippet?: { title?: string; description?: string; publishedAt?: string; liveBroadcastContent?: string };
  contentDetails?: { duration?: string };
  status?: { privacyStatus?: string };
};

export async function fetchUploads(key: string, max = 15, fetchImpl: typeof fetch = fetch): Promise<Upload[]> {
  const api = "https://www.googleapis.com/youtube/v3";
  const get = async (path: string) => {
    const res = await fetchImpl(`${api}/${path}&key=${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error(`YouTube a répondu ${res.status}`);
    return res.json();
  };
  const list = await get(`playlistItems?part=contentDetails&maxResults=${max}&playlistId=${UPLOADS_PLAYLIST}`);
  const ids: string[] = (list.items ?? []).map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId);
  if (!ids.length) return [];
  const data = await get(`videos?part=snippet,contentDetails,status&id=${ids.join(",")}`);
  return ((data.items ?? []) as YtItem[]).map((v) => ({
    id: v.id,
    title: v.snippet?.title ?? "",
    description: v.snippet?.description ?? "",
    publishedAt: v.snippet?.publishedAt ?? "",
    durationS: parseDuration(v.contentDetails?.duration ?? ""),
    live: v.snippet?.liveBroadcastContent ?? "none",
    privacy: v.status?.privacyStatus ?? "",
  }));
}

// Liens du site trouvés dans la description, sans leurs paramètres UTM.
function siteLinks(description: string): URL[] {
  const out: URL[] = [];
  for (const m of description.matchAll(/https:\/\/www\.jeremypitault\.com\/[^\s)]+/g)) {
    try {
      out.push(new URL(m[0]));
    } catch {
      // lien mal formé : ignoré
    }
  }
  return out;
}

// Le cadeau de la vidéo : le premier lien /guide/… de la description, avec la
// ligne qui le présente (« 🎁 La checklist GRATUITE des 32 leçons… »).
export function findGift(description: string): { url: string; line: string } | null {
  const gift = siteLinks(description).find((u) => u.pathname.startsWith("/guide/"));
  if (!gift) return null;
  const line = description.split("\n").find((l) => l.includes(gift.pathname)) ?? "";
  return { url: `${gift.origin}${gift.pathname}`, line: line.replace(/https:\/\/\S+/g, "").replace(/\s*:\s*$/, "").trim() };
}

// Le utm_campaign du bloc d'appel à l'action de la description : c'est le nom
// de la vidéo dans les statistiques (/admin/youtube).
export function videoCampaign(description: string): string | null {
  for (const u of siteLinks(description)) {
    const c = u.searchParams.get("utm_campaign");
    if (c && /^[\w-]+$/.test(c)) return c;
  }
  return null;
}
