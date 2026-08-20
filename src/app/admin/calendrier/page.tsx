"use client";

import { useEffect, useState } from "react";

type CalendarRoute = {
  slug: string;
  label: string;
  calendly_base: string;
  weight: number;
  assigned_count: number;
  active: boolean;
  sort_order: number;
};

export default function CalendrierAdmin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [routes, setRoutes] = useState<CalendarRoute[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
    if (authorized) load();
  }, [authorized]);

  async function load() {
    try {
      const r = await fetch("/api/admin/calendar-routing");
      const d = await r.json();
      if (d.routes) {
        setRoutes(d.routes);
        setWeights(
          Object.fromEntries(
            d.routes.map((x: CalendarRoute) => [x.slug, x.weight])
          )
        );
      } else {
        setError(d.error || "Impossible de charger la répartition");
      }
    } catch {
      setError("Impossible de charger la répartition");
    } finally {
      setLoading(false);
    }
  }

  const total = Object.values(weights).reduce((s, w) => s + (w || 0), 0);

  function setWeight(slug: string, value: number) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    setWeights((w) => ({ ...w, [slug]: clamped }));
  }

  // Presets rapides quand il y a exactement 2 calendriers.
  function applyPreset(firstPct: number) {
    if (routes.length !== 2) return;
    setWeights({
      [routes[0].slug]: firstPct,
      [routes[1].slug]: 100 - firstPct,
    });
  }

  async function save() {
    if (saving || total !== 100) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const r = await fetch("/api/admin/calendar-routing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weights }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Une erreur est survenue");
      } else {
        setRoutes(d.routes);
        setWeights(
          Object.fromEntries(
            d.routes.map((x: CalendarRoute) => [x.slug, x.weight])
          )
        );
        setNotice("Répartition enregistrée. Les compteurs repartent de zéro.");
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  }

  const totalAssigned = routes.reduce((s, r) => s + r.assigned_count, 0);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center">
        Vérification...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Répartition des appels</h1>
          <a href="/admin/crm" className="mac-btn mac-btn-def mac-btn-sm">
            CRM
          </a>
        </div>
        <p className="mt-2 text-[var(--fg2)]">
          Répartit les prises de rendez-vous entre les calendriers Calendly selon
          le pourcentage choisi. Le total doit faire 100%. Enregistrer remet les
          compteurs à zéro : la nouvelle répartition repart d&apos;une base propre.
        </p>

        {error && (
          <div className="mt-4 rounded-[12px] border-[0.5px] border-[color-mix(in_srgb,var(--red)_40%,transparent)] bg-[color-mix(in_srgb,var(--red)_12%,transparent)] px-4 py-3 text-[var(--red)]">
            {error}
          </div>
        )}
        {notice && (
          <div className="mt-4 rounded-[12px] border-[0.5px] border-[color-mix(in_srgb,var(--green)_40%,transparent)] bg-[color-mix(in_srgb,var(--green)_12%,transparent)] px-4 py-3 text-[var(--green)]">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-xl border border-[var(--sep)] px-5 py-8 text-center text-[var(--fg2)]">
            Chargement...
          </div>
        ) : (
          <>
            {routes.length === 2 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  { label: "100 / 0", pct: 100 },
                  { label: "70 / 30", pct: 70 },
                  { label: "50 / 50", pct: 50 },
                  { label: "30 / 70", pct: 30 },
                  { label: "0 / 100", pct: 0 },
                ].map((p) => (
                  <button
                    key={p.pct}
                    onClick={() => applyPreset(p.pct)}
                    className="rounded-lg border border-[var(--sep)] bg-[var(--group)] px-4 py-2 font-semibold text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--fg)]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-4">
              {routes.map((route) => {
                const w = weights[route.slug] ?? 0;
                const share =
                  totalAssigned > 0
                    ? Math.round((route.assigned_count / totalAssigned) * 100)
                    : 0;
                return (
                  <div
                    key={route.slug}
                    className="rounded-[14px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold">{route.label}</div>
                        <div className="text-sm text-[var(--fg2)]">
                          {route.calendly_base.replace("https://calendly.com/", "")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={w}
                          onChange={(e) =>
                            setWeight(route.slug, Number(e.target.value))
                          }
                          className="w-20 rounded-lg border border-[var(--sep)] bg-[var(--bg)] px-3 py-2 text-right text-lg font-bold text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none"
                        />
                        <span className="text-lg font-bold text-[var(--fg2)]">%</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={w}
                      onChange={(e) =>
                        setWeight(route.slug, Number(e.target.value))
                      }
                      className="mt-4 w-full accent-[var(--accent)]"
                    />

                    <div className="mt-3 text-sm text-[var(--fg2)]">
                      {route.assigned_count} appel
                      {route.assigned_count > 1 ? "s" : ""} attribué
                      {route.assigned_count > 1 ? "s" : ""} depuis le dernier
                      changement
                      {totalAssigned > 0 && ` (${share}% réel)`}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div
                className={`text-lg font-bold ${
                  total === 100 ? "text-[var(--green)]" : "text-[var(--red)]"
                }`}
              >
                Total : {total}%
                {total !== 100 && " (doit faire 100%)"}
              </div>
              <button
                onClick={save}
                disabled={saving || total !== 100}
                className="mac-btn mac-btn-primary"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
