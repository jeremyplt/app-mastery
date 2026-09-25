import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";

const POSTHOG_HOST = "https://us.posthog.com";
// 0 = depuis le début (le suivi PostHog démarre en mars 2026).
const ALLOWED_DAYS = [0, 7, 30, 90, 365];
const CHANNEL_HANDLE = "@jeremyptlt";

type Video = {
  id: string;
  title: string;
  publishedAt: string;
  views: number;
  campaigns: string[];
};

// Vidéos de la chaîne avec leurs vues totales. Le lien vidéo ↔ stats se fait
// par les utm_campaign trouvés dans la description (bloc CTA de chaque vidéo).
async function fetchVideos(key: string): Promise<Video[]> {
  const api = "https://www.googleapis.com/youtube/v3";
  const get = async (url: string) => {
    const res = await fetch(`${url}&key=${key}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`YouTube a répondu ${res.status}`);
    return res.json();
  };

  const channel = await get(`${api}/channels?part=contentDetails&forHandle=${encodeURIComponent(CHANNEL_HANDLE)}`);
  const uploads: string | undefined = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error("Chaîne YouTube introuvable");

  const ids: string[] = [];
  let pageToken = "";
  do {
    const page = await get(
      `${api}/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}&pageToken=${pageToken}`,
    );
    for (const item of page.items ?? []) ids.push(item.contentDetails.videoId);
    pageToken = page.nextPageToken ?? "";
  } while (pageToken);

  const videos: Video[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const batch = await get(`${api}/videos?part=snippet,statistics&id=${ids.slice(i, i + 50).join(",")}`);
    for (const v of batch.items ?? []) {
      const description: string = v.snippet?.description ?? "";
      const campaigns = [...new Set([...description.matchAll(/utm_campaign=([\w-]+)/g)].map((m) => m[1]))];
      if (campaigns.length === 0) continue;
      videos.push({
        id: v.id,
        title: v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        views: Number(v.statistics?.viewCount ?? 0),
        campaigns,
      });
    }
  }
  return videos;
}

// Attribution premier contact : chaque visiteur est rattaché à la première
// vidéo YouTube (utm_campaign) et à la première page (le CTA cliqué) par
// laquelle il est arrivé. Les conversions sont comptées par personne sur la
// période. Les robots de YouTube qui vérifient les liens des descriptions
// (une seule page vue, jamais de $pageleave) sont exclus.
const CONVERSION_EVENTS =
  "'plan_action_form_submitted', 'guide_optin_submitted', 'candidature_submitted', 'appel_booked', 'calendly_booked'";

function buildQuery(days: number): string {
  const yt = "event = '$pageview' AND properties.utm_source = 'youtube'";
  const since = days > 0 ? `timestamp >= now() - INTERVAL ${days} DAY` : "timestamp >= toDateTime('2026-01-01')";
  return `
    SELECT
      campaign,
      landing,
      count() AS visitors,
      countIf(is_pa) AS plan_action,
      countIf(is_guide) AS guide,
      countIf(is_cand) AS candidature,
      countIf(is_rdv) AS rdv,
      countIf(is_pa OR is_guide OR is_cand OR is_rdv) AS leads,
      min(first_ts) AS first_seen
    FROM (
      SELECT
        person_id,
        argMinIf(properties.utm_campaign, timestamp, ${yt}) AS campaign,
        argMinIf(properties.$pathname, timestamp, ${yt}) AS landing,
        minIf(timestamp, ${yt}) AS first_ts,
        countIf(event = '$pageleave') > 0 OR countIf(event = '$pageview') > 1 AS engaged,
        countIf(event = 'plan_action_form_submitted') > 0 AS is_pa,
        countIf(event = 'guide_optin_submitted') > 0 AS is_guide,
        countIf(event = 'candidature_submitted') > 0 AS is_cand,
        countIf(event IN ('appel_booked', 'calendly_booked')) > 0 AS is_rdv
      FROM events
      WHERE ${since}
        AND event IN ('$pageview', '$pageleave', ${CONVERSION_EVENTS})
        AND person_id IN (
          SELECT person_id FROM events
          WHERE ${yt} AND ${since}
        )
      GROUP BY person_id
    )
    WHERE engaged OR is_pa OR is_guide OR is_cand OR is_rdv
    GROUP BY campaign, landing
    ORDER BY visitors DESC
    LIMIT 1000
  `;
}

type Row = {
  campaign: string;
  landing: string;
  visitors: number;
  planAction: number;
  guide: number;
  candidature: number;
  rdv: number;
  leads: number;
  firstSeen: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// PostHog répond 503/429 quand ses serveurs de requêtes saturent : on
// retente deux fois avant d'abandonner.
async function queryPostHog(key: string, projectId: string, days: number): Promise<Row[]> {
  let lastStatus = 0;
  for (const delay of [0, 1500, 4000]) {
    if (delay) await sleep(delay);
    const res = await fetch(`${POSTHOG_HOST}/api/projects/${projectId}/query/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { kind: "HogQLQuery", query: buildQuery(days) },
        name: "admin-youtube-attribution",
      }),
      cache: "no-store",
    });

    if (res.ok) {
      const data = (await res.json()) as { results: unknown[][] };
      return (data.results ?? []).map((r) => ({
        campaign: (r[0] as string | null) || "(sans campagne)",
        landing: (r[1] as string | null) || "/",
        visitors: Number(r[2]),
        planAction: Number(r[3]),
        guide: Number(r[4]),
        candidature: Number(r[5]),
        rdv: Number(r[6]),
        leads: Number(r[7]),
        firstSeen: r[8] as string,
      }));
    }

    lastStatus = res.status;
    console.error(`PostHog query error: ${res.status} ${await res.text()}`);
    if (res.status !== 503 && res.status !== 429 && res.status !== 504) break;
  }
  throw new Error(
    lastStatus === 503 || lastStatus === 429
      ? "PostHog est surchargé en ce moment"
      : `PostHog a répondu ${lastStatus}`,
  );
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const days = Number(req.nextUrl.searchParams.get("days") || 90);
    if (!ALLOWED_DAYS.includes(days)) {
      return NextResponse.json({ error: "Période invalide" }, { status: 400 });
    }

    const key = process.env.POSTHOG_PERSONAL_API_KEY;
    const projectId = process.env.POSTHOG_PROJECT_ID || "337648";
    if (!key) {
      return NextResponse.json(
        { error: "POSTHOG_PERSONAL_API_KEY manquante (clé personnelle PostHog avec le droit query:read)" },
        { status: 500 },
      );
    }

    const ytKey = process.env.YOUTUBE_API_KEY;
    const videosPromise = ytKey
      ? fetchVideos(ytKey).catch((err) => {
          console.error("YouTube API error:", err);
          return null;
        })
      : Promise.resolve(null);

    const cacheKey = `youtube_stats_${days}`;
    const supabase = getAdminClient();
    let rows: Row[] | null = null;
    let stale: { reason: string; savedAt: string } | null = null;

    try {
      rows = await queryPostHog(key, projectId, days);
      // Garde le dernier résultat : PostHog renvoie parfois 503 quand ses
      // serveurs de requêtes saturent, on réaffiche alors ces chiffres.
      await supabase
        .from("site_settings")
        .upsert({ key: cacheKey, value: { rows }, updated_at: new Date().toISOString() })
        .then(({ error }) => error && console.error("Cache stats YouTube:", error.message));
    } catch (err) {
      const reason = err instanceof Error ? err.message : "PostHog indisponible";
      console.error("PostHog query error:", reason);
      const { data } = await supabase
        .from("site_settings")
        .select("value, updated_at")
        .eq("key", cacheKey)
        .maybeSingle();
      if (!data?.value?.rows) {
        return NextResponse.json({ error: `${reason}. Réessaie dans quelques minutes.` }, { status: 502 });
      }
      rows = data.value.rows as Row[];
      stale = { reason, savedAt: data.updated_at };
    }

    const videos = await videosPromise;
    return NextResponse.json({ rows, videos, days, stale });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
