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
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Vérification...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Répartition des appels</h1>
          <a
            href="/admin/crm"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-gray-100 transition-colors hover:bg-white/20"
          >
            CRM
          </a>
        </div>
        <p className="mt-2 text-gray-400">
          Répartit les prises de rendez-vous entre les calendriers Calendly selon
          le pourcentage choisi. Le total doit faire 100%. Enregistrer remet les
          compteurs à zéro : la nouvelle répartition repart d&apos;une base propre.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-red-300">
            {error}
          </div>
        )}
        {notice && (
          <div className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-emerald-300">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-xl border border-gray-800 px-5 py-8 text-center text-gray-400">
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
                    className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 font-semibold text-gray-200 hover:border-sky-500 hover:text-white"
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
                    className="rounded-xl border border-gray-800 bg-gray-900/40 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold">{route.label}</div>
                        <div className="text-sm text-gray-400">
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
                          className="w-20 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-right text-lg font-bold text-white focus:border-sky-500 focus:outline-none"
                        />
                        <span className="text-lg font-bold text-gray-300">%</span>
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
                      className="mt-4 w-full accent-sky-500"
                    />

                    <div className="mt-3 text-sm text-gray-400">
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
                  total === 100 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                Total : {total}%
                {total !== 100 && " (doit faire 100%)"}
              </div>
              <button
                onClick={save}
                disabled={saving || total !== 100}
                className="rounded-lg bg-sky-500 px-6 py-2.5 font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
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
