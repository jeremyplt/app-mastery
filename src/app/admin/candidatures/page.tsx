"use client";

import { useEffect, useMemo, useState } from "react";
import { QUESTIONS } from "@/lib/candidature";

type Candidature = {
  id: string;
  created_at: string;
  first_name: string;
  email: string;
  phone: string | null;
  q1_stage: string;
  q2_goal: string;
  q3_revenue: string;
  q4_status: string;
  q5_attentes: string;
  q6_hours: string;
  score: number;
  qualified: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

// value -> label, par question
const LABELS: Record<string, Record<string, string>> = Object.fromEntries(
  QUESTIONS.filter((q) => q.options).map((q) => [
    q.id,
    Object.fromEntries(q.options!.map((o) => [o.value, o.label])),
  ]),
);

function label(qid: string, value: string): string {
  return LABELS[qid]?.[value] ?? value;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function CandidaturesAdmin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "qualified" | "unqualified">("all");
  const [open, setOpen] = useState<string | null>(null);

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
    fetch("/api/admin/candidatures")
      .then((r) => r.json())
      .then((d) => {
        if (d.candidatures) setRows(d.candidatures);
        else setError(d.error || "Impossible de charger les candidatures");
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les candidatures");
        setLoading(false);
      });
  }, [authorized]);

  const filtered = useMemo(() => {
    if (filter === "qualified") return rows.filter((r) => r.qualified);
    if (filter === "unqualified") return rows.filter((r) => !r.qualified);
    return rows;
  }, [rows, filter]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      qualified: rows.filter((r) => r.qualified).length,
      unqualified: rows.filter((r) => !r.qualified).length,
    }),
    [rows],
  );

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Vérification...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Candidatures</h1>
        <p className="mt-2 text-gray-300 font-medium">
          Formulaire de qualification /appel.
        </p>

        {/* Filtres */}
        <div className="mt-6 flex flex-wrap gap-2">
          {([
            ["all", `Toutes (${counts.all})`],
            ["qualified", `Qualifiées (${counts.qualified})`],
            ["unqualified", `Non qualifiées (${counts.unqualified})`],
          ] as const).map(([key, lbl]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                filter === key
                  ? "bg-amber-400 text-gray-950"
                  : "bg-white/10 text-gray-200 hover:bg-white/20"
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        {loading && <p className="mt-8 text-gray-300">Chargement...</p>}
        {error && <p className="mt-8 font-bold text-red-400">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="mt-8 text-gray-300">Aucune candidature pour ce filtre.</p>
        )}

        <div className="mt-6 space-y-3">
          {filtered.map((c) => {
            const isOpen = open === c.id;
            return (
              <div
                key={c.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : c.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-white">
                      {c.first_name}{" "}
                      <span className="font-medium text-gray-400">{c.email}</span>
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-gray-400">
                      {c.phone ? `${c.phone} · ` : ""}
                      {formatDate(c.created_at)}
                      {c.utm_source ? ` · ${c.utm_source}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-bold text-gray-300">
                      {c.score} pts
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        c.qualified
                          ? "bg-green-500/15 text-green-300"
                          : "bg-red-500/15 text-red-300"
                      }`}
                    >
                      {c.qualified ? "Qualifié" : "Non qualifié"}
                    </span>
                    <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/10 px-5 py-4 space-y-3">
                    {QUESTIONS.map((q) => {
                      const key = {
                        q1: c.q1_stage,
                        q2: c.q2_goal,
                        q3: c.q3_revenue,
                        q4: c.q4_status,
                        q5: c.q5_attentes,
                        q6: c.q6_hours,
                      }[q.id];
                      return (
                        <div key={q.id}>
                          <p className="text-sm font-bold text-amber-400">
                            {q.title}
                          </p>
                          <p className="mt-0.5 text-base font-medium text-gray-100 whitespace-pre-wrap">
                            {q.type === "text" ? key : label(q.id, key || "")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
