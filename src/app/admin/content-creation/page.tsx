"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_HINTS,
  CATEGORY_LABELS,
  HOOKS,
  SOURCES,
  type Hook,
  type HookCategory,
  type Source,
} from "./hooks-data";

type Filter = "all" | HookCategory;

const CATEGORY_ORDER: HookCategory[] = [
  "secret",
  "verite",
  "question",
  "urgence",
  "confession",
  "recit",
  "template",
  "visuel",
];

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".0", "")}K`;
  return String(n);
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard indisponible */
        }
      }}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
        copied
          ? "bg-emerald-500/15 text-emerald-500"
          : "bg-[var(--field)] text-[var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
      }`}
    >
      {copied ? "Copié" : label}
    </button>
  );
}

function HookCard({ hook, source }: { hook: Hook; source: Source | undefined }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--sep)] bg-[var(--group)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--accent)]/12 px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]">
            {CATEGORY_LABELS[hook.category]}
          </span>
          {hook.views && (
            <span className="rounded-full bg-[var(--field)] px-2.5 py-0.5 text-xs font-bold text-[var(--fg2)]">
              {hook.views}
            </span>
          )}
        </div>
        <CopyButton text={hook.fr} />
      </div>

      <p className="text-xl font-bold leading-snug tracking-tight">{hook.fr}</p>

      <div className="rounded-xl bg-[var(--field)] px-4 py-3">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--fg2)]">
            Version App Mastery
          </span>
          <CopyButton text={hook.exemple} label="Copier l'exemple" />
        </div>
        <p className="font-medium leading-relaxed">{hook.exemple}</p>
      </div>

      {hook.note && (
        <p className="text-sm font-medium text-[var(--fg2)]">{hook.note}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[var(--sep)] pt-3 text-sm">
        {hook.en ? (
          <span className="italic text-[var(--fg2)]">« {hook.en} »</span>
        ) : (
          <span className="text-[var(--fg2)]">Original en français</span>
        )}
        {source && (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[var(--accent)] hover:underline"
          >
            {source.author} ↗
          </a>
        )}
      </div>
    </div>
  );
}

function SourceCard({ source, hookCount }: { source: Source; hookCount: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[var(--sep)] bg-[var(--group)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-lg font-bold tracking-tight">{source.title}</div>
          <div className="mt-0.5 font-medium text-[var(--fg2)]">
            {source.author}
            {source.handle !== source.author && ` · ${source.handle}`}
          </div>
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--accent-fg)] hover:bg-[var(--accent2)]"
        >
          Voir le reel ↗
        </a>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-[var(--fg2)]">
        <span className="rounded-full bg-[var(--field)] px-2.5 py-0.5">
          {formatCount(source.likes)} likes
        </span>
        <span className="rounded-full bg-[var(--field)] px-2.5 py-0.5">
          {formatCount(source.comments)} commentaires
        </span>
        <span className="rounded-full bg-[var(--field)] px-2.5 py-0.5">
          {hookCount} hook{hookCount > 1 ? "s" : ""}
        </span>
        <span className="rounded-full bg-[var(--field)] px-2.5 py-0.5">
          {source.lang === "fr" ? "Français" : "Anglais"}
        </span>
      </div>

      <p className="mt-3 font-medium leading-relaxed">{source.summary}</p>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-3 text-sm font-bold text-[var(--accent)] hover:underline"
      >
        {open ? "Masquer la transcription" : "Voir la transcription"}
      </button>
      {open && (
        <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-[var(--field)] px-4 py-3 font-sans text-sm leading-relaxed text-[var(--fg)]">
          {source.transcript}
        </pre>
      )}
    </div>
  );
}

export default function ContentCreationAdmin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"hooks" | "sources">("hooks");

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        if (d.role === "owner") setAuthorized(true);
        else if (d.admin) window.location.href = "/admin/crm";
        else window.location.href = "/membres";
      })
      .catch(() => {
        window.location.href = "/membres";
      });
  }, []);

  const sourcesById = useMemo(
    () => Object.fromEntries(SOURCES.map((s) => [s.id, s])) as Record<string, Source>,
    []
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: HOOKS.length };
    for (const h of HOOKS) c[h.category] = (c[h.category] || 0) + 1;
    return c;
  }, []);

  const hookCountBySource = useMemo(() => {
    const c: Record<string, number> = {};
    for (const h of HOOKS) c[h.sourceId] = (c[h.sourceId] || 0) + 1;
    return c;
  }, []);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return HOOKS.filter((h) => {
      if (filter !== "all" && h.category !== filter) return false;
      if (!q) return true;
      const hay = normalize(
        [h.fr, h.en || "", h.exemple, h.note || "", sourcesById[h.sourceId]?.author || ""].join(" ")
      );
      return hay.includes(q);
    });
  }, [filter, query, sourcesById]);

  const copyAll = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => {
        const list = HOOKS.filter((h) => h.category === cat);
        if (!list.length) return "";
        return `## ${CATEGORY_LABELS[cat]}\n${list.map((h) => `- ${h.fr}`).join("\n")}`;
      })
        .filter(Boolean)
        .join("\n\n"),
    []
  );

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center">
        Vérification...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Création de contenu</h1>
            <p className="mt-2 max-w-2xl font-medium text-[var(--fg2)]">
              Hub d&apos;inspirations pour les pubs et les contenus. Hooks traduits
              et adaptés à App Mastery depuis {SOURCES.length} reels de référence,
              avec les transcriptions originales.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/crm"
              className="rounded-lg bg-[var(--field)] px-4 py-2 text-sm font-bold text-[var(--fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
            >
              CRM
            </a>
            <CopyButton text={copyAll} label="Copier tous les hooks" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Hooks", value: HOOKS.length },
            { label: "Visuels", value: counts.visuel || 0 },
            { label: "À trous", value: counts.template || 0 },
            { label: "Reels sources", value: SOURCES.length },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-[var(--sep)] bg-[var(--group)] px-5 py-4"
            >
              <div className="text-3xl font-bold tracking-tight">{s.value}</div>
              <div className="font-bold text-[var(--fg2)]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-1 rounded-xl bg-[var(--field)] p-1 w-fit">
          {(
            [
              ["hooks", "Hooks"],
              ["sources", "Sources"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                tab === key
                  ? "bg-[var(--group)] text-[var(--fg)] shadow-sm"
                  : "text-[var(--fg2)] hover:text-[var(--fg)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "hooks" ? (
          <>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un hook, un mot, un auteur..."
                className="flex-1 rounded-lg border border-[var(--sep)] bg-[var(--group)] px-4 py-2.5 font-medium text-[var(--fg)] placeholder-gray-500 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(["all", ...CATEGORY_ORDER] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
                    filter === f
                      ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                      : "bg-[var(--field)] text-[var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
                  }`}
                >
                  {f === "all" ? "Tous" : CATEGORY_LABELS[f]}
                  <span className="ml-1.5 opacity-70">{counts[f] || 0}</span>
                </button>
              ))}
            </div>

            {filter !== "all" && (
              <p className="mt-4 rounded-xl border border-[var(--sep)] bg-[var(--group)] px-4 py-3 font-medium text-[var(--fg2)]">
                {CATEGORY_HINTS[filter]}
              </p>
            )}

            {visible.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-[var(--sep)] px-5 py-10 text-center font-medium text-[var(--fg2)]">
                Aucun hook ne correspond.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {visible.map((h) => (
                  <HookCard key={h.id} hook={h} source={sourcesById[h.sourceId]} />
                ))}
              </div>
            )}

            <div className="mt-10 rounded-2xl border border-[var(--sep)] bg-[var(--group)] p-5">
              <div className="text-lg font-bold tracking-tight">
                Pourquoi ces hooks marchent
              </div>
              <p className="mt-2 font-medium leading-relaxed">
                Ils créent un manque d&apos;information que le cerveau veut combler,
                tout en donnant une raison de croire que la réponse va être utile.
                Un bon hook ne donne pas juste envie de connaître la suite : il fait
                sentir que ça vaut le coup de la connaître. Et côté visuel, on a
                environ une seconde : ce qui se passe à l&apos;écran avant le premier
                mot décide si le pouce s&apos;arrête.
              </p>
            </div>
          </>
        ) : (
          <div className="mt-6 grid gap-4">
            {SOURCES.map((s) => (
              <SourceCard key={s.id} source={s} hookCount={hookCountBySource[s.id] || 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
