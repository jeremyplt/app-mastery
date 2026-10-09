"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

// Chiffre d'affaires mois par mois : encaissé, à venir, en retard, et les
// commissions des closers à déduire. Propriétaire seulement.

type Month = { month: string; cashed: number; upcoming: number; late: number; commissions: number; payouts: number };
type Totals = { cashedThisMonth: number; cashedAll: number; upcoming3: number; late: number; commissionsDue: number };

// Couleurs des séries (palette du site, validée : séparation daltonisme OK).
// Le vert est clair sur fond blanc : légende + tableau en relais.
const SERIES = [
  { key: "cashed", label: "Encaissé", color: "var(--green)" },
  { key: "upcoming", label: "À venir", color: "var(--accent)" },
  { key: "late", label: "En retard", color: "var(--red)" },
] as const;

function money(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n);
}

function monthLabel(m: string, long = false) {
  return new Intl.DateTimeFormat("fr-FR", { month: long ? "long" : "short", year: long ? "numeric" : "2-digit", timeZone: "UTC" }).format(new Date(`${m}-01T12:00:00Z`));
}

function Tile({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "green" | "red" | "accent" | "orange" }) {
  const color =
    tone === "green" ? "text-[var(--green)]" : tone === "red" ? "text-[var(--red)]" : tone === "accent" ? "text-[var(--accent2)]" : tone === "orange" ? "text-[var(--orange)]" : "";
  return (
    <div className="mac-group px-4 py-3">
      <p className="text-xs font-bold text-[var(--fg2)]">{label}</p>
      <p className={`mt-1 text-[22px] font-bold tracking-tight ${color}`}>{value}</p>
      {sub && <p className="text-[12.5px] font-medium text-[var(--fg3)]">{sub}</p>}
    </div>
  );
}

export default function ChiffreAffairesPage() {
  const [months, setMonths] = useState<Month[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [today, setToday] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        if (d.role !== "owner") {
          window.location.href = d.admin ? "/admin/crm" : "/membres";
          return;
        }
        return fetch("/api/admin/finances")
          .then((r) => r.json())
          .then((f) => {
            if (f.error) return setError(f.error);
            setMonths(f.months);
            setTotals(f.totals);
            setToday(f.today);
          });
      })
      .catch(() => setError("réseau"));
  }, []);

  const current = today.slice(0, 7);
  const max = Math.max(1, ...months.map((m) => m.cashed + m.upcoming + m.late));
  // Graduations rondes : pas de 1, 2 ou 5 × 10^n, environ 4 intervalles.
  const raw = max / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 5, 10].map((k) => k * pow).find((k) => k >= raw) ?? 10 * pow;
  const top = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const CHART_H = 240;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:py-8">
        <AdminNav current="chiffre-affaires" isOwner />

        <header>
          <h1 className="text-[28px] font-bold tracking-tight">Chiffre d&apos;affaires</h1>
          <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">
            Encaissé au mois où le paiement a été coché, à venir et en retard au mois de l&apos;échéance, commissions au mois de leur déblocage.
          </p>
        </header>

        {error && <p className="mt-4 text-sm font-semibold text-[var(--red)]">Erreur : {error}</p>}
        {!totals && !error && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">Chargement...</p>}

        {totals && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
              <Tile label="Encaissé ce mois-ci" value={money(totals.cashedThisMonth)} tone="green" sub={monthLabel(current, true)} />
              <Tile label="À venir (3 mois)" value={money(totals.upcoming3)} tone="accent" />
              <Tile label="En retard" value={money(totals.late)} tone={totals.late > 0 ? "red" : undefined} />
              <Tile label="Commissions à verser" value={money(totals.commissionsDue)} tone="orange" />
              <Tile label="Encaissé au total" value={money(totals.cashedAll)} />
            </div>

            {/* Graphique : barres empilées par mois */}
            <section className="mac-group mt-5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[16px] font-bold">Mois par mois (TTC)</h2>
                <div className="flex flex-wrap gap-4" aria-label="Légende">
                  {SERIES.map((s) => (
                    <span key={s.key} className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--fg2)]">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} aria-hidden />
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative mt-5 flex gap-3">
                {/* Axe vertical */}
                <div className="relative w-14 shrink-0" style={{ height: CHART_H }} aria-hidden>
                  {ticks.map((t) => (
                    <span key={t} className="absolute right-0 -translate-y-1/2 text-[11px] font-medium text-[var(--fg3)]" style={{ bottom: `${(t / top) * 100}%` }}>
                      {t >= 1000 ? `${(t / 1000).toLocaleString("fr-FR")} k€` : `${t} €`}
                    </span>
                  ))}
                </div>
                <div className="relative flex-1" style={{ height: CHART_H }}>
                  {ticks.map((t) => (
                    <div key={t} className="absolute inset-x-0 border-t border-[var(--sep)]" style={{ bottom: `${(t / top) * 100}%` }} aria-hidden />
                  ))}
                  <div className="absolute inset-0 flex items-end gap-2" role="img" aria-label="Chiffre d'affaires par mois">
                    {months.map((m, i) => {
                      const total = m.cashed + m.upcoming + m.late;
                      return (
                        <div
                          key={m.month}
                          className="relative flex h-full flex-1 cursor-default flex-col justify-end"
                          onMouseEnter={() => setHover(i)}
                          onMouseLeave={() => setHover(null)}
                        >
                          {/* Segments empilés : encaissé en bas, puis en retard, puis à venir */}
                          <div className={`mx-auto flex w-full max-w-[44px] flex-col-reverse gap-[2px] transition-opacity ${hover !== null && hover !== i ? "opacity-50" : ""}`}>
                            {(["cashed", "late", "upcoming"] as const).map((k, j, arr) => {
                              const v = m[k];
                              if (!v) return null;
                              const isTop = arr.slice(j + 1).every((kk) => !m[kk]);
                              return (
                                <div
                                  key={k}
                                  style={{ height: `${(v / top) * CHART_H}px`, background: SERIES.find((s) => s.key === k)!.color }}
                                  className={isTop ? "rounded-t-[4px]" : ""}
                                />
                              );
                            })}
                          </div>
                          {hover === i && (
                            <div className={`pointer-events-none absolute top-0 z-10 w-52 ${i > months.length / 2 ? "right-full mr-2" : "left-full ml-2"} rounded-xl border-[0.5px] border-[var(--field-brd)] bg-[var(--group)] p-3 text-[12.5px] shadow-[0_8px_24px_rgba(0,0,0,0.16)]`}>
                              <p className="font-bold capitalize">{monthLabel(m.month, true)}</p>
                              {SERIES.map((s) => (
                                <p key={s.key} className="mt-1 flex items-center justify-between gap-2 font-semibold text-[var(--fg2)]">
                                  <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
                                    {s.label}
                                  </span>
                                  <span className="text-[var(--fg)]">{money(m[s.key])}</span>
                                </p>
                              ))}
                              <p className="mt-1 flex justify-between gap-2 font-semibold text-[var(--fg2)]">
                                <span>Commissions</span>
                                <span className="text-[var(--fg)]">− {money(m.commissions)}</span>
                              </p>
                              <p className="mt-1 flex justify-between gap-2 border-t border-[var(--sep)] pt-1 font-bold">
                                <span>Total</span>
                                <span>{money(total)}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-3">
                <div className="w-14 shrink-0" />
                <div className="flex flex-1 gap-2">
                  {months.map((m) => (
                    <span
                      key={m.month}
                      className={`flex-1 text-center text-[11.5px] font-semibold capitalize ${m.month === current ? "text-[var(--accent2)]" : "text-[var(--fg3)]"}`}
                    >
                      {monthLabel(m.month)}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Tableau : toutes les valeurs */}
            <section className="mac-group mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-[14px]">
                <thead>
                  <tr className="bg-[var(--field)] text-left text-xs font-bold text-[var(--fg2)]">
                    <th className="px-4 py-2.5">Mois</th>
                    <th className="px-4 py-2.5 text-right">Encaissé</th>
                    <th className="px-4 py-2.5 text-right">À venir</th>
                    <th className="px-4 py-2.5 text-right">En retard</th>
                    <th className="px-4 py-2.5 text-right">Commissions</th>
                    <th className="px-4 py-2.5 text-right">Net estimé</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((m) => (
                    <tr key={m.month} className={`border-t border-[var(--sep)] ${m.month === current ? "bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]" : ""}`}>
                      <td className="px-4 py-2.5 font-bold capitalize">
                        {monthLabel(m.month, true)}
                        {m.month === current && <span className="ml-2 text-[11px] font-bold text-[var(--accent2)]">ce mois-ci</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold">{m.cashed ? money(m.cashed) : "-"}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{m.upcoming ? money(m.upcoming) : "-"}</td>
                      <td className={`px-4 py-2.5 text-right font-semibold ${m.late ? "text-[var(--red)]" : ""}`}>{m.late ? money(m.late) : "-"}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{m.commissions ? `− ${money(m.commissions)}` : "-"}</td>
                      <td className="px-4 py-2.5 text-right font-bold">{money(m.cashed + m.upcoming - m.commissions)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-[var(--sep)] px-4 py-2.5 text-[12.5px] font-medium text-[var(--fg2)]">
                Net estimé = encaissé + à venir − commissions du mois (les retards ne sont pas comptés). Montants TTC.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
