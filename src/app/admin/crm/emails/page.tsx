"use client";

import { useEffect, useMemo, useState } from "react";
import { EMAIL_FAMILIES, FLOWS } from "@/lib/email-families";

type Row = {
  messageId: string;
  email: string;
  subject: string;
  tag: string;
  label: string;
  family: string | null;
  test: boolean;
  sentAt: string;
  delivered: boolean;
  opened: boolean;
  clicked: boolean;
  blocked: boolean;
  bounced: boolean;
  deferred: boolean;
  unsubscribed: boolean;
  reason?: string;
};

type Scheduled = { email: string; firstName: string | null; kind: string; at: string; callAt: string; host: string | null };
type Waiting = { email: string; firstName: string | null; callAt: string; host: string | null };

type Totals = {
  requests: number;
  delivered: number;
  uniqueOpens: number;
  uniqueClicks: number;
  blocked: number;
  hardBounces: number;
  softBounces: number;
  unsubscribed: number;
} | null;

type EmailContent = { email: string; subject: string; date: string; body: string; events: { name: string; time: string }[] };

type Sheet = {
  kind: "sent" | "preview";
  label: string;
  subject: string;
  meta: string;
  body?: string;
  events?: { name: string; time: string }[];
  error?: string;
};

type Payload = { days: number; truncated: boolean; totals: Totals; rows: Row[]; scheduled: Scheduled[]; waiting: Waiting[] };

const DAYS = [7, 30, 90] as const;

const EVENT_LABELS: Record<string, string> = {
  sent: "Envoyé",
  requests: "Envoyé",
  delivered: "Délivré",
  open: "Ouvert",
  opened: "Ouvert",
  click: "Cliqué",
  clicks: "Cliqué",
  blocked: "Bloqué",
  hardBounce: "Rebond",
  softBounce: "Rebond",
  deferred: "Différé",
  unsubscribe: "Désabonné",
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(d);
}

function fmtDateLong(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(d);
}

function Status({ r }: { r: Row }) {
  const chip = (text: string, tone: "green" | "blue" | "red" | "orange" | "gray") => {
    const colors = {
      green: "bg-[color-mix(in_srgb,var(--green)_15%,transparent)] text-[var(--green)]",
      blue: "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent2)]",
      red: "bg-[color-mix(in_srgb,var(--red)_14%,transparent)] text-[var(--red)]",
      orange: "bg-[color-mix(in_srgb,#e0821a_16%,transparent)] text-[#e0821a]",
      gray: "bg-[var(--field)] text-[var(--fg2)]",
    };
    return <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${colors[tone]}`}>{text}</span>;
  };
  if (r.blocked) return chip("Bloqué", "red");
  if (r.bounced) return chip("Rebond", "red");
  if (r.clicked) return chip("Cliqué", "green");
  if (r.opened) return chip("Ouvert", "blue");
  if (r.delivered) return chip("Délivré", "gray");
  if (r.deferred) return chip("Différé", "orange");
  return chip("Envoyé", "gray");
}

export default function AdminEmailsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [days, setDays] = useState<(typeof DAYS)[number]>(30);
  const [family, setFamily] = useState<string>("all");
  const [hideTests, setHideTests] = useState(true);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Fiche ouverte : un email envoyé (contenu stocké par Brevo) ou l'aperçu
  // d'un gabarit du schéma (rendu avec des données d'exemple).
  const [sheet, setSheet] = useState<Sheet | null>(null);

  function openRow(r: Row) {
    setSheet({ kind: "sent", label: r.label, subject: r.subject, meta: `À ${r.email} · ${fmtDateLong(r.sentAt)}` });
    fetch(`/api/admin/emails/content?email=${encodeURIComponent(r.email)}&messageId=${encodeURIComponent(r.messageId)}`)
      .then(async (res) => {
        const d = (await res.json()) as EmailContent & { error?: string };
        if (!res.ok) throw new Error(d.error || "Erreur");
        setSheet((s) =>
          s && s.kind === "sent"
            ? { ...s, subject: d.subject, meta: `À ${d.email} · ${fmtDateLong(d.date)}`, body: d.body, events: d.events }
            : s,
        );
      })
      .catch((e) => setSheet((s) => (s ? { ...s, error: e instanceof Error ? e.message : "Erreur" } : s)));
  }

  function openStep(step: { tag: string; preview?: string; subject: string; label: string; when: string }, flowTitle: string) {
    const tag = step.preview ?? step.tag;
    setSheet({ kind: "preview", label: `${flowTitle} · ${step.label}`, subject: step.subject, meta: `Aperçu du gabarit, envoi : ${step.when.toLowerCase()}` });
    fetch(`/api/admin/emails/preview?tag=${encodeURIComponent(tag)}`)
      .then(async (res) => {
        const d = (await res.json()) as { subject: string; body: string; source: string; sample?: string; error?: string };
        if (!res.ok) throw new Error(d.error || "Erreur");
        setSheet((s) =>
          s && s.kind === "preview"
            ? {
                ...s,
                subject: d.subject,
                body: d.body,
                meta: d.source === "brevo" ? "Modèle Brevo, tel qu'il est enregistré" : `Aperçu avec un prospect d'exemple (${d.sample ?? "Thomas"})`,
              }
            : s,
        );
      })
      .catch((e) => setSheet((s) => (s ? { ...s, error: e instanceof Error ? e.message : "Erreur" } : s)));
  }
  // Chargement déduit : pas de données, ou données d'une autre période.
  const loading = !error && (data === null || data.days !== days);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        if (d.admin) setAuthorized(true);
        else window.location.href = "/membres";
      })
      .catch(() => {
        window.location.href = "/membres";
      });
  }, []);

  useEffect(() => {
    if (!authorized) return;
    let cancelled = false;
    fetch(`/api/admin/emails?days=${days}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Erreur");
        if (!cancelled) {
          setError(null);
          setData(d);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur");
      });
    return () => {
      cancelled = true;
    };
  }, [authorized, days]);

  const rows = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.rows.filter((r) => {
      if (hideTests && r.test) return false;
      if (family !== "all" && r.family !== family) return false;
      if (q && !r.email.toLowerCase().includes(q) && !r.subject.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, family, hideTests, search]);

  // Nombre d'envois par tag sur la période (hors tests), pour le schéma.
  const tagCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of data?.rows ?? []) {
      if (r.test) continue;
      const base = r.tag;
      c[base] = (c[base] ?? 0) + 1;
      // Regroupements du schéma : guides et bienvenue.
      const fam = EMAIL_FAMILIES.find((f) => f.id === "guides");
      if (fam && fam.tags.includes(base)) c["guides"] = (c["guides"] ?? 0) + 1;
      if (base.startsWith("welcome-")) c["welcome"] = (c["welcome"] ?? 0) + 1;
    }
    return c;
  }, [data]);

  const familyCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of data?.rows ?? []) {
      if (hideTests && r.test) continue;
      const k = r.family ?? "autre";
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [data, hideTests]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center">
        Vérification...
      </div>
    );
  }

  const t = data?.totals;
  const tiles = t
    ? [
        { label: "Envoyés", value: t.requests },
        { label: "Délivrés", value: t.delivered, pct: t.requests ? Math.round((t.delivered / t.requests) * 100) : 0 },
        { label: "Ouverts", value: t.uniqueOpens, pct: t.delivered ? Math.round((t.uniqueOpens / t.delivered) * 100) : 0 },
        { label: "Cliqués", value: t.uniqueClicks, pct: t.delivered ? Math.round((t.uniqueClicks / t.delivered) * 100) : 0 },
        { label: "Bloqués + rebonds", value: t.blocked + t.hardBounces + t.softBounces },
        { label: "Désabonnés", value: t.unsubscribed },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Emails</h1>
            <p className="mt-2 text-[var(--fg2)] font-medium">
              Tous les emails transactionnels envoyés par le site via Brevo, et les rappels de la séquence B encore programmés.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin/crm" className="rounded-lg bg-[var(--field)] px-4 py-2 text-sm font-bold text-[var(--fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]">
              CRM
            </a>
          </div>
        </div>

        {/* Période */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                days === d ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--field)] text-[var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
              }`}
            >
              {d} jours
            </button>
          ))}
          <label className="ml-2 flex items-center gap-2 text-sm font-medium text-[var(--fg2)]">
            <input type="checkbox" checked={hideTests} onChange={(e) => setHideTests(e.target.checked)} />
            Masquer les tests
          </label>
        </div>

        {error && (
          <div className="mt-4 rounded-[12px] border-[0.5px] border-[color-mix(in_srgb,var(--red)_40%,transparent)] bg-[color-mix(in_srgb,var(--red)_12%,transparent)] px-4 py-3 text-[var(--red)]">
            {error}
          </div>
        )}

        {/* Totaux */}
        {tiles.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {tiles.map((tile) => (
              <div key={tile.label} className="rounded-[14px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] px-4 py-3">
                <p className="text-[13px] font-semibold text-[var(--fg2)]">{tile.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {tile.value}
                  {"pct" in tile && tile.pct !== undefined && (
                    <span className="ml-1.5 text-sm font-semibold text-[var(--fg2)]">{tile.pct}%</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Schéma des automatisations */}
        <div className="mt-8">
          <h2 className="text-lg font-bold tracking-tight">Automatisations en place</h2>
          <p className="mt-1 text-sm text-[var(--fg2)] font-medium">
            Ce qui part, après quel déclencheur, et quand. Clique sur un email pour le voir tel qu&apos;il partirait aujourd&apos;hui. Le chiffre sous chaque email est le nombre d&apos;envois sur la période choisie. En pointillé : prévu, pas encore en place.
          </p>
          <div className="mt-4 grid gap-3">
            {FLOWS.map((flow) => (
              <div key={flow.id} className="rounded-[14px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-bold">{flow.title}</h3>
                  <button onClick={() => setFamily(flow.family)} className="text-xs font-semibold text-[var(--accent2)] hover:underline">
                    Voir les envois
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-stretch gap-2">
                  <div className="flex min-w-[180px] max-w-[260px] flex-col justify-center rounded-[10px] bg-[var(--field)] px-3 py-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg2)]">Déclencheur</span>
                    <span className="mt-0.5 text-[13px] font-semibold leading-snug">{flow.trigger}</span>
                  </div>
                  {flow.steps.map((step) => (
                    <div key={step.tag} className="flex items-center gap-2">
                      <span className="text-[var(--fg2)]" aria-hidden>→</span>
                      <button
                        type="button"
                        disabled={step.status !== "live" || step.tag === "candidature-admin"}
                        onClick={() => openStep(step, flow.title)}
                        className={`flex w-[190px] flex-col rounded-[10px] border px-3 py-2 text-left transition-colors ${
                          step.status === "live"
                            ? "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] cursor-pointer disabled:cursor-default disabled:hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                            : "border-dashed border-[var(--sep)] bg-transparent opacity-70 cursor-default"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent2)]">{step.label}</span>
                          <span className="text-[12px] font-bold">{step.when}</span>
                        </div>
                        <span className="mt-1 text-[13px] font-semibold leading-snug">{step.subject}</span>
                        {step.note && <span className="mt-1 text-[11.5px] leading-snug text-[var(--fg2)]">{step.note}</span>}
                        <span className="mt-1.5 text-[11.5px] font-semibold text-[var(--fg2)]">
                          {step.status === "live" ? `${tagCounts[step.tag] ?? 0} envoi${(tagCounts[step.tag] ?? 0) > 1 ? "s" : ""} sur ${days} j · voir` : "À venir"}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
                {flow.exit && <p className="mt-3 text-[12.5px] text-[var(--fg2)]">{flow.exit}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Programmés */}
        {data && (data.scheduled.length > 0 || data.waiting.length > 0) && (
          <div className="mt-8 rounded-[14px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-5">
            <h2 className="text-lg font-bold tracking-tight">Rappels programmés</h2>
            <p className="mt-1 text-sm text-[var(--fg2)] font-medium">
              Emails de la séquence B en attente dans Brevo. Ils partent à l&apos;heure indiquée, et sont annulés si le prospect annule ou décale.
            </p>
            {data.scheduled.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-[var(--fg2)]">
                      <th className="py-2 pr-4">Part le</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Destinataire</th>
                      <th className="py-2 pr-4">Appel</th>
                      <th className="py-2">Hôte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.scheduled.map((s, i) => (
                      <tr key={i} className="border-t border-[var(--sep)]">
                        <td className="py-2 pr-4 font-semibold whitespace-nowrap">{fmtDateLong(s.at)}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">{s.kind}</td>
                        <td className="py-2 pr-4">
                          {s.firstName ? <span className="font-semibold">{s.firstName} </span> : null}
                          <span className="text-[var(--fg2)]">{s.email}</span>
                        </td>
                        <td className="py-2 pr-4 whitespace-nowrap">{fmtDateLong(s.callAt)}</td>
                        <td className="py-2">{s.host ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {data.waiting.length > 0 && (
              <p className="mt-4 text-sm text-[var(--fg2)]">
                En attente du cron (appel à plus de 72 h) :{" "}
                {data.waiting.map((w) => `${w.firstName ?? w.email} le ${fmtDateLong(w.callAt)}`).join(", ")}.
              </p>
            )}
          </div>
        )}

        {/* Filtres */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFamily("all")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${family === "all" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--field)] text-[var(--fg)]"}`}
          >
            Tous ({Object.values(familyCounts).reduce((a, b) => a + b, 0)})
          </button>
          {EMAIL_FAMILIES.map((f) => (
            <button
              key={f.id}
              onClick={() => setFamily(f.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${family === f.id ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--field)] text-[var(--fg)]"}`}
            >
              {f.label} ({familyCounts[f.id] ?? 0})
            </button>
          ))}
          {(familyCounts["autre"] ?? 0) > 0 && (
            <button
              onClick={() => setFamily("autre")}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${family === "autre" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--field)] text-[var(--fg)]"}`}
            >
              Autres ({familyCounts["autre"]})
            </button>
          )}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un email ou un objet"
            className="ml-auto min-w-[240px] rounded-lg border border-[var(--sep)] bg-[var(--field)] px-3 py-1.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg2)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Liste */}
        <div className="mt-4 overflow-x-auto rounded-[14px] border-[0.5px] border-[var(--sep)] bg-[var(--card)]">
          {loading ? (
            <div className="px-5 py-10 text-center text-[var(--fg2)]">Chargement des envois Brevo...</div>
          ) : rows.length === 0 ? (
            <div className="px-5 py-10 text-center text-[var(--fg2)]">Aucun email sur cette période.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[var(--fg2)]">
                  <th className="px-4 py-3">Envoyé le</th>
                  <th className="px-4 py-3">Destinataire</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Objet</th>
                  <th className="px-4 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.messageId}
                    onClick={() => openRow(r)}
                    className="border-t border-[var(--sep)] align-top cursor-pointer hover:bg-[color-mix(in_srgb,var(--fg)_5%,transparent)]"
                  >
                    <td className="px-4 py-2.5 whitespace-nowrap text-[var(--fg2)]">{fmtDate(r.sentAt)}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{r.email}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap font-semibold">{r.label}</td>
                    <td className="px-4 py-2.5 text-[var(--fg2)]">{r.subject}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <Status r={r} />
                      {r.reason && <span className="ml-2 text-xs text-[var(--fg2)]">{r.reason}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {sheet && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6"
            onClick={() => setSheet(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[18px] border-[0.5px] border-[var(--sep)] bg-[var(--bg)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[var(--sep)] px-5 py-4">
                <div className="min-w-0">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[var(--accent2)]">{sheet.label}</p>
                  <h3 className="mt-1 text-lg font-bold tracking-tight">{sheet.subject}</h3>
                  <p className="mt-1 text-sm text-[var(--fg2)]">{sheet.meta}</p>
                  {sheet.events && sheet.events.length > 0 && (
                    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] font-medium text-[var(--fg2)]">
                      {sheet.events.map((ev, i) => (
                        <span key={i}>
                          {EVENT_LABELS[ev.name] ?? ev.name} {fmtDate(ev.time)}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSheet(null)}
                  className="shrink-0 rounded-lg bg-[var(--field)] px-3 py-1.5 text-sm font-bold text-[var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
                >
                  Fermer
                </button>
              </div>
              <div className="min-h-[300px] flex-1 overflow-hidden bg-white">
                {sheet.error ? (
                  <div className="px-5 py-10 text-center text-[var(--fg2)]">{sheet.error}</div>
                ) : sheet.body === undefined ? (
                  <div className="px-5 py-10 text-center text-[var(--fg2)]">Chargement du contenu...</div>
                ) : (
                  <iframe title="Contenu de l'email" srcDoc={sheet.body} sandbox="" className="h-[70vh] w-full border-0 bg-white" />
                )}
              </div>
            </div>
          </div>
        )}

        {data?.truncated && (
          <p className="mt-3 text-sm text-[var(--fg2)]">Liste limitée aux 2 500 derniers événements Brevo. Réduis la période pour tout voir.</p>
        )}
      </div>
    </div>
  );
}
