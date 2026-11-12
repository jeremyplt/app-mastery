"use client";

import { useState, useSyncExternalStore } from "react";
import AdminNav from "@/components/admin/AdminNav";
import type { VideoScript } from "./types";

type Tab = "script" | "packaging" | "description" | "prep";

const TABS: { id: Tab; label: string }[] = [
  { id: "script", label: "Script" },
  { id: "packaging", label: "Titre et miniature" },
  { id: "description", label: "Description" },
  { id: "prep", label: "Avant le tournage" },
];

function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "ok" | "ko">("idle");
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setState("ok");
        } catch {
          setState("ko");
        }
        setTimeout(() => setState("idle"), 1600);
      }}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
        state === "ok"
          ? "bg-emerald-500/15 text-emerald-500"
          : "bg-[var(--field)] text-[var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
      }`}
    >
      {state === "ok" ? "Copié" : state === "ko" ? "Sélectionne à la main" : label}
    </button>
  );
}

function Card({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--sep)] bg-[var(--group)] p-5 sm:p-6">
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="text-lg font-bold tracking-tight">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

// Le texte à dire, section par section, pour le prompteur ou les notes.
function spokenText(s: VideoScript, withShow: boolean): string {
  const parts = [s.title, ""];
  for (const sec of s.sections) {
    parts.push(`${sec.time} · ${sec.title}`, "");
    for (const b of sec.beats) {
      if (withShow && b.show) parts.push(`[${b.show}]`);
      if (b.say) parts.push(b.say);
      if (b.say || (withShow && b.show)) parts.push("");
    }
  }
  return parts.join("\n").trim();
}

function ScriptTab({ s }: { s: VideoScript }) {
  const [showNotes, setShowNotes] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 font-bold text-[var(--fg2)]">
          <input
            type="checkbox"
            checked={showNotes}
            onChange={(e) => setShowNotes(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Indications de montage
        </label>
        <div className="flex flex-wrap gap-2">
          <CopyButton text={spokenText(s, false)} label="Copier le texte à dire" />
          <CopyButton text={spokenText(s, true)} label="Copier avec le montage" />
        </div>
      </div>

      {s.sections.map((sec) => (
        <Card key={sec.time + sec.title}>
          <div className="mb-4 flex items-baseline gap-3">
            <span className="rounded-md bg-[var(--accent)]/12 px-2 py-0.5 font-mono text-sm font-bold text-[var(--accent)]">
              {sec.time}
            </span>
            <h2 className="text-lg font-bold tracking-tight">{sec.title}</h2>
          </div>
          <div className="flex flex-col gap-3">
            {sec.beats.map((b, i) => {
              if (!b.say && !(showNotes && b.show)) return null;
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  {showNotes && b.show && (
                    <p className="rounded-lg bg-[var(--field)] px-3 py-2 text-sm font-semibold text-[var(--fg2)]">
                      🎬 {b.show}
                    </p>
                  )}
                  {b.say && <p className="text-[17px] font-medium leading-relaxed">{b.say}</p>}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

function PackagingTab({ s }: { s: VideoScript }) {
  return (
    <div className="flex flex-col gap-4">
      <Card title="Titres">
        <ol className="flex flex-col gap-4">
          {s.altTitles.map((t, i) => (
            <li key={t.title} className="flex flex-col gap-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="text-[17px] font-bold">
                  {i + 1}. {t.title}
                </span>
                <CopyButton text={t.title} />
              </div>
              <p className="font-medium text-[var(--fg2)]">{t.why}</p>
            </li>
          ))}
        </ol>
      </Card>
      <Card title="Miniature">
        <div className="flex flex-col gap-3">
          <p className="w-fit rounded-md bg-yellow-300 px-3 py-1 text-xl font-black text-black">{s.thumbnail.text}</p>
          <p className="font-medium leading-relaxed">{s.thumbnail.layout}</p>
          <p className="font-medium leading-relaxed text-[var(--fg2)]">{s.thumbnail.variant}</p>
        </div>
      </Card>
      <Card title="Prompt de génération (gpt-image-2, 1920x1088)" action={<CopyButton text={s.thumbnail.prompt} label="Copier le prompt" />}>
        <pre className="whitespace-pre-wrap rounded-xl bg-[var(--field)] px-4 py-3 font-mono text-[13px] leading-relaxed">{s.thumbnail.prompt}</pre>
      </Card>
      <Card title="Ce qui doit être vrai à la fin pour que le titre soit vrai">
        <ol className="flex list-decimal flex-col gap-2 pl-5 font-medium">
          {s.plan.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function DescriptionTab({ s }: { s: VideoScript }) {
  return (
    <div className="flex flex-col gap-4">
      <Card title="Le cadeau">
        <p className="font-bold">{s.gift.name}</p>
        <p className="mt-1 font-medium text-[var(--fg2)]">{s.gift.note}</p>
        <a href={s.gift.url} target="_blank" rel="noreferrer" className="mt-2 inline-block break-all font-bold text-[var(--accent)] hover:underline">
          {s.gift.url}
        </a>
      </Card>
      <Card title="Description YouTube" action={<CopyButton text={s.description} label="Copier la description" />}>
        <pre className="whitespace-pre-wrap break-words font-sans text-[15px] font-medium leading-relaxed">{s.description}</pre>
      </Card>
      <Card title="Shorts à tirer de la vidéo">
        <ol className="flex list-decimal flex-col gap-2 pl-5 font-medium">
          {s.shorts.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function PrepTab({ s }: { s: VideoScript }) {
  return (
    <div className="flex flex-col gap-4">
      <Card title="À préparer">
        <ul className="flex list-disc flex-col gap-2 pl-5 font-medium">
          {s.prepare.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Card>
      <Card title="Checklist avant publication">
        <div className="flex flex-col divide-y divide-[var(--sep)]">
          {s.checklist.map((c) => (
            <div key={c.point} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5">
              <span className="font-medium">{c.point}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${
                  c.state.startsWith("OK") ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                }`}
              >
                {c.state}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Le script ouvert est gardé dans l'adresse (#slug), pour pouvoir partager le lien.
function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export default function ScriptsView({ scripts }: { scripts: VideoScript[] }) {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => ""
  );
  const [tab, setTab] = useState<Tab>("script");
  const current = scripts.find((s) => s.slug === hash) ?? scripts[0];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-5 sm:py-8">
        <AdminNav current="scripts" isOwner />
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Scripts vidéo</h1>
          <p className="mt-2 max-w-2xl font-medium text-[var(--fg2)]">
            Les scripts YouTube prêts à tourner, avec le titre, la miniature, la description et ce qu&apos;il faut préparer.
          </p>
        </div>

        {!current ? (
          <p className="mt-8 font-medium text-[var(--fg2)]">Aucun script pour l&apos;instant.</p>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {scripts.map((s) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  onClick={() => setTab("script")}
                  className={`rounded-xl border px-4 py-2 text-left text-sm font-bold transition-colors ${
                    s.slug === current.slug
                      ? "border-[var(--accent)] bg-[var(--accent)]/12 text-[var(--accent)]"
                      : "border-[var(--sep)] bg-[var(--group)] text-[var(--fg2)] hover:text-[var(--fg)]"
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </div>

            <header className="mt-6 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-emerald-500">{current.status}</span>
                <span className="text-[var(--fg2)]">Mis à jour le {current.updatedAt}</span>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-[26px]">{current.title}</h2>
                <CopyButton text={current.title} label="Copier le titre" />
              </div>
              <p className="max-w-3xl font-medium leading-relaxed text-[var(--fg2)]">{current.why}</p>
              <dl className="mt-1 grid gap-2 sm:grid-cols-2">
                {current.facts.map((f) => (
                  <div key={f.label} className="rounded-xl border border-[var(--sep)] bg-[var(--group)] px-4 py-3">
                    <dt className="text-xs font-bold uppercase tracking-wide text-[var(--fg2)]">{f.label}</dt>
                    <dd className="mt-0.5 font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </header>

            <div className="sticky top-0 z-30 -mx-4 mt-6 bg-[var(--bg)] px-4 py-2 sm:-mx-5 sm:px-5">
              <div className="flex w-full gap-1 overflow-x-auto rounded-xl bg-[var(--field)] p-1 sm:w-fit">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                      tab === t.id ? "bg-[var(--group)] text-[var(--fg)] shadow-sm" : "text-[var(--fg2)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pb-16">
              {tab === "script" && <ScriptTab s={current} />}
              {tab === "packaging" && <PackagingTab s={current} />}
              {tab === "description" && <DescriptionTab s={current} />}
              {tab === "prep" && <PrepTab s={current} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
