"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

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

type Totals = Omit<Row, "campaign" | "landing" | "firstSeen">;

type Group = Totals & { key: string; firstSeen: string; rows: Row[] };

type Video = { id: string; title: string; publishedAt: string; views: number; campaigns: string[] };

// Une ligne du tableau "Par vidéo" : une vidéo YouTube (reliée par ses
// utm_campaign) ou une campagne qu'aucune vidéo actuelle ne porte.
type VideoGroup = Group & { title: string; video: Video | null; partial: boolean };

type SortKey =
  | "views"
  | "visitors"
  | "clickRate"
  | "planAction"
  | "guide"
  | "candidature"
  | "rdv"
  | "leads"
  | "viewLeadRate"
  | "leadRate"
  | "rdvRate"
  | "date";

// Début du suivi PostHog : les vues faites avant ne peuvent pas avoir de clic
// mesuré, donc les ratios vues des vidéos plus anciennes sont sous-estimés.
const TRACKING_START = "2026-03-10";

// Sous ce nombre de vues, un ratio vue → clic ne veut pas dire grand-chose.
const MIN_VIEWS = 300;

const PERIODS = [
  { days: 0, label: "Depuis le début" },
  { days: 7, label: "7 jours" },
  { days: 30, label: "30 jours" },
  { days: 90, label: "90 jours" },
  { days: 365, label: "1 an" },
];

// Sous ce nombre de visiteurs, un taux ne veut pas dire grand-chose.
const MIN_SAMPLE = 10;

// Le CTA = la page d'arrivée du lien mis dans la description.
function ctaOf(path: string): string {
  if (path.startsWith("/plan-action")) return "Plan d'action";
  if (path.startsWith("/rdv")) return "Appel direct (/rdv)";
  if (path.startsWith("/appel")) return "Candidature (/appel)";
  const guide = path.match(/^\/guide\/([^/]+)/);
  if (guide) return `Lead magnet : ${guide[1]}`;
  return `Autre (${path})`;
}

function emptyTotals(): Totals {
  return { visitors: 0, planAction: 0, guide: 0, candidature: 0, rdv: 0, leads: 0 };
}

function add(t: Totals, r: Totals) {
  t.visitors += r.visitors;
  t.planAction += r.planAction;
  t.guide += r.guide;
  t.candidature += r.candidature;
  t.rdv += r.rdv;
  t.leads += r.leads;
}

function groupBy(rows: Row[], keyOf: (r: Row) => string): Group[] {
  const map = new Map<string, Group>();
  for (const r of rows) {
    const key = keyOf(r);
    let g = map.get(key);
    if (!g) {
      g = { key, firstSeen: r.firstSeen, rows: [], ...emptyTotals() };
      map.set(key, g);
    }
    add(g, r);
    g.rows.push(r);
    if (r.firstSeen < g.firstSeen) g.firstSeen = r.firstSeen;
  }
  return [...map.values()];
}

function rate(n: number, d: number): number {
  return d > 0 ? n / d : 0;
}

function pct(n: number, d: number): string {
  if (d === 0) return "–";
  const v = (n / d) * 100;
  const digits = v === 0 || v >= 10 ? 0 : v >= 1 ? 1 : 2;
  return `${v.toLocaleString("fr-FR", { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`;
}

function formatNumber(n: number): string {
  return n.toLocaleString("fr-FR");
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "2-digit" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function sortValue(g: VideoGroup, key: SortKey): number | string {
  const views = g.video?.views ?? 0;
  if (key === "views") return views;
  if (key === "clickRate") return rate(g.visitors, views);
  if (key === "viewLeadRate") return rate(g.leads, views);
  if (key === "leadRate") return rate(g.leads, g.visitors);
  if (key === "rdvRate") return rate(g.rdv, g.visitors);
  if (key === "date") return g.video?.publishedAt ?? g.firstSeen;
  return g[key];
}

// Ratio calculé sur les vues YouTube : pâle si trop peu de vues ou si la vidéo
// date d'avant le suivi (vues sans clic mesurable).
function ViewRateCell({ n, views, partial }: { n: number; views: number | undefined; partial: boolean }) {
  if (views === undefined) {
    return <td className="px-3 py-3 text-right text-[var(--fg3)]">–</td>;
  }
  const weak = partial || views < MIN_VIEWS;
  return (
    <td className="px-3 py-3 text-right whitespace-nowrap">
      <span
        className={`text-[16px] font-extrabold ${weak ? "text-[var(--fg3)]" : "text-[var(--orange)]"}`}
        title={
          partial
            ? "Vidéo publiée avant le début du suivi : une partie des vues n'a pas de clic mesuré"
            : views < MIN_VIEWS
              ? "Moins de 300 vues : ratio peu fiable"
              : undefined
        }
      >
        {pct(n, views)}
        {partial ? "*" : ""}
      </span>
    </td>
  );
}

// Nombre + taux sur les visiteurs, sur deux lignes.
function Cell({ n, d, strong }: { n: number; d: number; strong?: boolean }) {
  return (
    <td className="px-3 py-3 text-right whitespace-nowrap">
      <div className={`text-[15px] font-bold ${n === 0 ? "text-[var(--fg3)]" : "text-[var(--fg)]"}`}>{n}</div>
      <div
        className={`text-[13px] font-semibold ${
          n === 0 ? "text-[var(--fg3)]" : strong ? "text-[var(--accent2)]" : "text-[var(--fg2)]"
        }`}
      >
        {pct(n, d)}
      </div>
    </td>
  );
}

function RateCell({ n, d }: { n: number; d: number }) {
  const small = d < MIN_SAMPLE;
  return (
    <td className="px-3 py-3 text-right whitespace-nowrap">
      <span
        className={`text-[16px] font-extrabold ${small ? "text-[var(--fg3)]" : "text-[var(--accent2)]"}`}
        title={small ? "Moins de 10 visiteurs : taux peu fiable" : undefined}
      >
        {pct(n, d)}
      </span>
    </td>
  );
}

function Tile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-[14px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] px-5 py-4">
      <p className="text-sm font-bold text-[var(--fg2)]">{label}</p>
      <p className="mt-1 text-[30px] font-extrabold tracking-tight text-[var(--fg)]">{value}</p>
      {sub && <p className="text-[15px] font-bold text-[var(--accent2)]">{sub}</p>}
    </div>
  );
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "visitors", label: "Visiteurs" },
  { key: "planAction", label: "Plan d'action" },
  { key: "guide", label: "Lead magnet" },
  { key: "candidature", label: "Candidature" },
  { key: "rdv", label: "RDV" },
  { key: "leads", label: "Leads" },
  { key: "leadRate", label: "Taux lead" },
  { key: "rdvRate", label: "Taux RDV" },
];

const VIDEO_COLUMNS: { key: SortKey; label: string; views?: boolean }[] = [
  { key: "views", label: "Vues", views: true },
  { key: "visitors", label: "Clics" },
  { key: "clickRate", label: "Vue → clic", views: true },
  { key: "leads", label: "Leads" },
  { key: "viewLeadRate", label: "Vue → lead", views: true },
  { key: "leadRate", label: "Clic → lead" },
  { key: "planAction", label: "Plan d'action" },
  { key: "guide", label: "Lead magnet" },
  { key: "candidature", label: "Candidature" },
  { key: "rdv", label: "RDV" },
  { key: "rdvRate", label: "Clic → RDV" },
];

function VideoCells({ g, showViews }: { g: VideoGroup; showViews: boolean }) {
  const views = g.video?.views;
  return (
    <>
      {showViews && (
        <td className="px-3 py-3 text-right text-[16px] font-extrabold whitespace-nowrap">
          {views === undefined ? <span className="text-[var(--fg3)]">–</span> : formatNumber(views)}
        </td>
      )}
      <td className="px-3 py-3 text-right text-[16px] font-extrabold whitespace-nowrap">{g.visitors}</td>
      {showViews && <ViewRateCell n={g.visitors} views={views} partial={g.partial} />}
      <td className="px-3 py-3 text-right text-[16px] font-extrabold whitespace-nowrap">{g.leads}</td>
      {showViews && <ViewRateCell n={g.leads} views={views} partial={g.partial} />}
      <RateCell n={g.leads} d={g.visitors} />
      <Cell n={g.planAction} d={g.visitors} />
      <Cell n={g.guide} d={g.visitors} />
      <Cell n={g.candidature} d={g.visitors} />
      <Cell n={g.rdv} d={g.visitors} />
      <RateCell n={g.rdv} d={g.visitors} />
    </>
  );
}

// Détail par CTA sous une vidéo : les colonnes vues restent vides.
function CtaCells({ g, showViews }: { g: Group; showViews: boolean }) {
  const blank = <td className="px-3 py-3" />;
  return (
    <>
      {showViews && blank}
      <td className="px-3 py-3 text-right text-[16px] font-extrabold whitespace-nowrap">{g.visitors}</td>
      {showViews && blank}
      <td className="px-3 py-3 text-right text-[16px] font-extrabold whitespace-nowrap">{g.leads}</td>
      {showViews && blank}
      <RateCell n={g.leads} d={g.visitors} />
      <Cell n={g.planAction} d={g.visitors} />
      <Cell n={g.guide} d={g.visitors} />
      <Cell n={g.candidature} d={g.visitors} />
      <Cell n={g.rdv} d={g.visitors} />
      <RateCell n={g.rdv} d={g.visitors} />
    </>
  );
}

function MetricCells({ g }: { g: Totals }) {
  return (
    <>
      <td className="px-3 py-3 text-right text-[16px] font-extrabold whitespace-nowrap">{g.visitors}</td>
      <Cell n={g.planAction} d={g.visitors} />
      <Cell n={g.guide} d={g.visitors} />
      <Cell n={g.candidature} d={g.visitors} />
      <Cell n={g.rdv} d={g.visitors} />
      <td className="px-3 py-3 text-right text-[16px] font-extrabold whitespace-nowrap">{g.leads}</td>
      <RateCell n={g.leads} d={g.visitors} />
      <RateCell n={g.rdv} d={g.visitors} />
    </>
  );
}

export default function YouTubeAdmin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [days, setDays] = useState(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "leads", desc: true });
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        if (d.admin) {
          setAuthorized(true);
          setIsOwner(d.role === "owner");
        } else window.location.href = "/membres";
      })
      .catch(() => {
        window.location.href = "/membres";
      });
  }, []);

  useEffect(() => {
    if (!authorized) return;
    fetch(`/api/admin/youtube?days=${days}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.rows) {
          setRows(d.rows);
          setVideos(d.videos ?? null);
        } else setError(d.error || "Impossible de charger les stats");
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les stats");
        setLoading(false);
      });
  }, [authorized, days]);

  const totals = useMemo(() => {
    const t = emptyTotals();
    rows.forEach((r) => add(t, r));
    return t;
  }, [rows]);

  const byCta = useMemo(
    () => groupBy(rows, (r) => ctaOf(r.landing)).sort((a, b) => b.visitors - a.visitors),
    [rows],
  );

  // Les vues YouTube sont des totaux depuis la publication : les ratios vues
  // n'ont de sens que sur toute la période de suivi.
  const showViews = days === 0 && videos !== null;

  const byVideo = useMemo(() => {
    const videoOf = new Map<string, Video>();
    for (const v of videos ?? []) for (const c of v.campaigns) videoOf.set(c, v);

    const groups: VideoGroup[] = groupBy(rows, (r) => videoOf.get(r.campaign)?.id ?? `campaign:${r.campaign}`).map(
      (g) => {
        const video = videoOf.get(g.rows[0].campaign) ?? null;
        return {
          ...g,
          title: video?.title ?? g.rows[0].campaign,
          video,
          partial: video ? video.publishedAt < TRACKING_START : false,
        };
      },
    );

    // Vidéos sans aucun clic : elles comptent aussi (0 % vue → clic).
    if (showViews) {
      const seen = new Set(groups.map((g) => g.video?.id).filter(Boolean));
      for (const v of videos ?? []) {
        if (seen.has(v.id)) continue;
        groups.push({
          key: v.id,
          firstSeen: v.publishedAt,
          rows: [],
          ...emptyTotals(),
          title: v.title,
          video: v,
          partial: v.publishedAt < TRACKING_START,
        });
      }
    }

    return groups.sort((a, b) => {
      const va = sortValue(a, sort.key);
      const vb = sortValue(b, sort.key);
      const cmp = va < vb ? -1 : va > vb ? 1 : b.visitors - a.visitors;
      return sort.desc ? -cmp : cmp;
    });
  }, [rows, videos, sort, showViews]);

  // Ratios globaux sur les vidéos publiées depuis le début du suivi.
  const viewTotals = useMemo(() => {
    let views = 0;
    let visitors = 0;
    let leads = 0;
    for (const g of byVideo) {
      if (!g.video || g.partial) continue;
      views += g.video.views;
      visitors += g.visitors;
      leads += g.leads;
    }
    return { views, visitors, leads };
  }, [byVideo]);

  function selectPeriod(d: number) {
    if (d === days) return;
    setLoading(true);
    setError(null);
    setDays(d);
  }

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, desc: !s.desc } : { key, desc: true }));
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen text-[var(--fg)] flex items-center justify-center">
        Vérification...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:py-8">
        <AdminNav current="youtube" isOwner={isOwner} />
        <h1 className="text-[28px] font-bold tracking-tight">YouTube</h1>
        <p className="mt-2 text-[var(--fg2)] font-medium">
          Chaque vidéo : combien de personnes arrivent sur le site via ses liens (utm_campaign), et combien
          deviennent des leads ou réservent un appel.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => selectPeriod(p.days)}
              className={`rounded-[9px] px-4 py-2 text-sm font-semibold transition-colors ${
                days === p.days
                  ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                  : "bg-[var(--field)] text-[var(--fg2)] hover:bg-[color-mix(in_srgb,var(--fg)_8%,transparent)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading && <p className="mt-8 text-[var(--fg2)]">Chargement...</p>}
        {error && <p className="mt-8 font-semibold text-[var(--red)]">{error}</p>}

        {!loading && !error && rows.length === 0 && (
          <p className="mt-8 text-[var(--fg2)]">Aucune visite YouTube sur cette période.</p>
        )}

        {!loading && !error && rows.length > 0 && (
          <>
            {showViews && (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Tile label="Vues YouTube" value={formatNumber(viewTotals.views)} sub="vidéos publiées depuis mars 2026" />
                <Tile
                  label="Vue → clic"
                  value={pct(viewTotals.visitors, viewTotals.views)}
                  sub={`${formatNumber(viewTotals.visitors)} clics vers le site`}
                />
                <Tile
                  label="Vue → lead"
                  value={pct(viewTotals.leads, viewTotals.views)}
                  sub={`${formatNumber(viewTotals.leads)} leads`}
                />
              </div>
            )}
            {days === 0 && videos === null && (
              <p className="mt-6 font-semibold text-[var(--orange)]">
                Vues YouTube indisponibles (clé YOUTUBE_API_KEY manquante ou API en erreur).
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Tile label="Visiteurs YouTube" value={totals.visitors} />
              <Tile label="Leads" value={totals.leads} sub={`${pct(totals.leads, totals.visitors)} des visiteurs`} />
              <Tile label="Plan d'action" value={totals.planAction} sub={pct(totals.planAction, totals.visitors)} />
              <Tile label="Lead magnets" value={totals.guide} sub={pct(totals.guide, totals.visitors)} />
              <Tile label="RDV réservés" value={totals.rdv} sub={`${pct(totals.rdv, totals.visitors)} des visiteurs`} />
            </div>

            <h2 className="mt-10 text-[20px] font-bold tracking-tight">Par CTA</h2>
            <p className="mt-1 text-[var(--fg2)] font-medium">
              La page sur laquelle les gens arrivent depuis la description, toutes vidéos confondues.
            </p>
            <div className="mt-4 overflow-x-auto rounded-[14px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]">
              <table className="w-full min-w-[820px] text-left">
                <thead>
                  <tr className="border-b border-[var(--sep)] text-sm font-bold text-[var(--fg2)]">
                    <th className="px-4 py-3">CTA</th>
                    {COLUMNS.map((c) => (
                      <th key={c.key} className="px-3 py-3 text-right whitespace-nowrap">{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {byCta.map((g) => (
                    <tr key={g.key} className="border-b border-[var(--sep)] last:border-0">
                      <td className="px-4 py-3 text-[15px] font-bold">{g.key}</td>
                      <MetricCells g={g} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mt-10 text-[20px] font-bold tracking-tight">Par vidéo</h2>
            <p className="mt-1 text-[var(--fg2)] font-medium">
              Clique sur une vidéo pour voir le détail par CTA. Clique sur une colonne pour trier.
              {!showViews && " Les vues et les ratios vue → clic s'affichent sur « Depuis le début » (YouTube ne donne que des vues totales)."}
            </p>
            <div className="mt-4 overflow-x-auto rounded-[14px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]">
              <table className="w-full min-w-[1150px] text-left">
                <thead>
                  <tr className="border-b border-[var(--sep)] text-sm font-bold text-[var(--fg2)]">
                    <th className="px-4 py-3">
                      <button onClick={() => toggleSort("date")} className="whitespace-nowrap hover:text-[var(--fg)]">
                        Vidéo{sort.key === "date" ? (sort.desc ? " ↓" : " ↑") : ""}
                      </button>
                    </th>
                    {VIDEO_COLUMNS.filter((c) => showViews || !c.views).map((c) => (
                      <th key={c.key} className="px-3 py-3 text-right">
                        <button
                          onClick={() => toggleSort(c.key)}
                          className={`whitespace-nowrap hover:text-[var(--fg)] ${sort.key === c.key ? "text-[var(--fg)]" : ""}`}
                        >
                          {c.label}
                          {sort.key === c.key ? (sort.desc ? " ↓" : " ↑") : ""}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {byVideo.map((g) => {
                    const isOpen = open === g.key;
                    const ctas = groupBy(g.rows, (r) => ctaOf(r.landing)).sort((a, b) => b.visitors - a.visitors);
                    return (
                      <Fragment key={g.key}>
                        <tr
                          onClick={() => setOpen(isOpen ? null : g.key)}
                          className="cursor-pointer border-b border-[var(--sep)] hover:bg-[color-mix(in_srgb,var(--fg)_4%,transparent)]"
                        >
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <span className="text-[var(--fg3)]">{isOpen ? "▾" : "▸"}</span>
                              <div className="min-w-[260px] max-w-[360px]">
                                <p className="text-[15px] font-bold leading-snug">{g.title}</p>
                                <p className="mt-0.5 text-[13px] font-semibold text-[var(--fg2)]">
                                  {g.video ? formatDate(g.video.publishedAt) : "Vidéo introuvable"} ·{" "}
                                  {[...new Set(g.rows.map((r) => r.campaign).concat(g.video?.campaigns.slice(0, 1) ?? []))].join(", ")}
                                </p>
                              </div>
                            </div>
                          </td>
                          <VideoCells g={g} showViews={showViews} />
                        </tr>
                        {isOpen &&
                          ctas.map((c) => (
                            <tr
                              key={`${g.key}-${c.key}`}
                              className="border-b border-[var(--sep)] bg-[color-mix(in_srgb,var(--fg)_3%,transparent)]"
                            >
                              <td className="py-3 pl-10 pr-4 text-[14px] font-semibold text-[var(--fg2)]">
                                {c.key}
                              </td>
                              <CtaCells g={c} showViews={showViews} />
                            </tr>
                          ))}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 rounded-[14px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] px-5 py-4 text-[15px] font-medium text-[var(--fg2)] space-y-1.5">
              <p className="font-bold text-[var(--fg)]">Comment c&apos;est calculé</p>
              <p>
                Visiteur = une personne arrivée sur le site avec utm_source=youtube. Elle est rattachée à la
                première vidéo et à la première page par laquelle elle est arrivée.
              </p>
              <p>
                Une conversion compte même si elle arrive plus tard (ex. plan d&apos;action puis appel réservé
                quelques jours après). Leads = personnes avec au moins une conversion.
              </p>
              <p>
                Vue → clic = clics vers le site ÷ vues YouTube totales de la vidéo. Vue → lead = leads ÷ vues. Les
                vidéos publiées avant mars 2026 (début du suivi) ont un astérisque : une partie de leurs vues
                n&apos;a pas de clic mesuré, le ratio est donc sous-estimé.
              </p>
              <p>
                Les robots de YouTube qui vérifient les liens des descriptions sont exclus. Un taux sur moins de
                10 visiteurs est affiché en clair : pas assez de données pour conclure.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
