"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  id: string;
  created_at: string;
  email: string;
  source: "vsl" | "plan-action";
  first_name: string | null;
  phone: string | null;
  contacted: boolean;
  contacted_at: string | null;
  replied: boolean;
  replied_at: string | null;
  call_booked: boolean;
  call_booked_at: string | null;
  call_booked_auto: boolean;
  disqualified: boolean;
  unreachable: boolean;
  notes: string | null;
  // Pré-qualification opt-in VSL. null = opt-in avant la mise en place des
  // questions, ou questions abandonnées.
  age: string | null;
  profession: string | null;
  objectif: string | null;
  invest: string | null;
  qualified: boolean | null;
};

type Source = "vsl" | "plan-action";
type Filter =
  | "all"
  | "to_contact"
  | "waiting"
  | "replied"
  | "booked"
  | "unreachable"
  | "disqualified";

const SOURCE_LABELS: Record<Source, string> = {
  vsl: "VSL (conférence)",
  "plan-action": "Plan d'action",
};

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

function pct(part: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

export default function CrmAdmin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [leads, setLeads] = useState<Record<Source, Lead[]>>({ vsl: [], "plan-action": [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Source>("vsl");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [openNotes, setOpenNotes] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    });
  }

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

  async function loadLeads() {
    setLoading(true);
    setError(null);
    try {
      const [vslRes, paRes] = await Promise.all([
        fetch("/api/admin/crm?source=vsl").then((r) => r.json()),
        fetch("/api/admin/crm?source=plan-action").then((r) => r.json()),
      ]);
      if (vslRes.leads && paRes.leads) {
        setLeads({ vsl: vslRes.leads, "plan-action": paRes.leads });
      } else {
        setError(vslRes.error || paRes.error || "Impossible de charger les leads");
      }
    } catch {
      setError("Impossible de charger les leads");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!authorized) return;
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized]);

  async function syncBrevo() {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/admin/crm/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        const v = data.results?.vsl;
        const p = data.results?.["plan-action"];
        setSyncMessage(
          `Sync OK : ${v?.synced ?? 0} leads VSL, ${p?.synced ?? 0} leads Plan d'action importés depuis Brevo (dont ${(v?.contacted ?? 0) + (p?.contacted ?? 0)} contactés, ${(v?.unreachable ?? 0) + (p?.unreachable ?? 0)} injoignables, ${(v?.booked ?? 0) + (p?.booked ?? 0)} calls bookés).`,
        );
        await loadLeads();
      } else {
        setSyncMessage(`Erreur de sync : ${data.error || "inconnue"}`);
      }
    } catch {
      setSyncMessage("Erreur de sync : réseau");
    }
    setSyncing(false);
  }

  async function patchLead(id: string, source: Source, fields: Partial<Lead>) {
    // Mise à jour optimiste
    const previous = leads[source];
    setLeads((l) => ({
      ...l,
      [source]: l[source].map((lead) => (lead.id === id ? { ...lead, ...fields } : lead)),
    }));

    try {
      const res = await fetch("/api/admin/crm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...fields }),
      });
      const data = await res.json();
      if (data.lead) {
        setLeads((l) => ({
          ...l,
          [source]: l[source].map((lead) => (lead.id === id ? data.lead : lead)),
        }));
      } else {
        setLeads((l) => ({ ...l, [source]: previous }));
      }
    } catch {
      setLeads((l) => ({ ...l, [source]: previous }));
    }
  }

  async function saveNote(lead: Lead) {
    setSavingNote(true);
    await patchLead(lead.id, lead.source, { notes: noteDraft } as Partial<Lead>);
    setSavingNote(false);
    setOpenNotes(null);
  }

  async function deleteLead(lead: Lead) {
    const ok = window.confirm(
      `Supprimer ${lead.first_name || lead.email} ? Le lead sera retiré du CRM et de la liste Brevo du funnel.`,
    );
    if (!ok) return;
    try {
      const res = await fetch("/api/admin/crm", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((l) => ({
          ...l,
          [lead.source]: l[lead.source].filter((r) => r.id !== lead.id),
        }));
      } else {
        window.alert(`Suppression impossible : ${data.error || "erreur inconnue"}`);
      }
    } catch {
      window.alert("Suppression impossible : erreur réseau");
    }
  }

  // Priorité de contact : pré-qualifiés d'abord, puis sans réponses aux
  // questions (abandon du form ou lead d'avant la mise en place), puis les
  // non-qualifiés explicites. Tri stable : l'ordre chronologique est conservé
  // à l'intérieur de chaque groupe. Sans effet sur Plan d'action (tous null).
  function contactPriority(lead: Lead): number {
    if (lead.qualified === true) return 0;
    if (lead.qualified === null) return 1;
    return 2;
  }

  const rows = leads[tab];

  const stats = useMemo(() => {
    const total = rows.length;
    // Base des taux = tout sauf injoignables (les disqualifiés gardent leur historique contacté/répondu/booké)
    const active = rows.filter((r) => !r.unreachable);
    const contacted = active.filter((r) => r.contacted);
    const replied = active.filter((r) => r.replied);
    const booked = active.filter((r) => r.call_booked);
    // Booké en direct = sans avoir été contacté (ex : depuis la page VSL)
    const bookedDirect = booked.filter((r) => !r.contacted);
    // Conversion réponse -> call : uniquement les leads qui ont répondu PUIS booké
    const bookedAfterReply = booked.filter((r) => r.replied);
    const unreachable = rows.filter((r) => r.unreachable && !r.disqualified);
    const disqualified = rows.filter((r) => r.disqualified);
    return {
      total,
      contacted: contacted.length,
      replied: replied.length,
      booked: booked.length,
      bookedDirect: bookedDirect.length,
      bookedAfterReply: bookedAfterReply.length,
      unreachable: unreachable.length,
      disqualified: disqualified.length,
      contactedRate: pct(contacted.length, active.length),
      replyRate: pct(replied.length, contacted.length),
      bookedRate: pct(booked.length, active.length),
      bookedFromReplyRate: pct(bookedAfterReply.length, replied.length),
      unreachableRate: pct(unreachable.length, total),
      disqualifiedRate: pct(disqualified.length, total),
    };
  }, [rows]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      to_contact: rows.filter(
        (r) => !r.contacted && !r.disqualified && !r.call_booked && !r.unreachable,
      ).length,
      waiting: rows.filter(
        (r) => r.contacted && !r.replied && !r.disqualified && !r.call_booked && !r.unreachable,
      ).length,
      replied: rows.filter((r) => r.replied && !r.disqualified).length,
      booked: rows.filter((r) => r.call_booked && !r.disqualified).length,
      unreachable: rows.filter((r) => r.unreachable && !r.disqualified).length,
      disqualified: rows.filter((r) => r.disqualified).length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    let list = rows;
    if (filter === "to_contact")
      list = list.filter((r) => !r.contacted && !r.disqualified && !r.call_booked && !r.unreachable);
    if (filter === "waiting")
      list = list.filter(
        (r) => r.contacted && !r.replied && !r.disqualified && !r.call_booked && !r.unreachable,
      );
    if (filter === "replied") list = list.filter((r) => r.replied && !r.disqualified);
    if (filter === "booked") list = list.filter((r) => r.call_booked && !r.disqualified);
    if (filter === "unreachable") list = list.filter((r) => r.unreachable && !r.disqualified);
    if (filter === "disqualified") list = list.filter((r) => r.disqualified);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.email.toLowerCase().includes(q) ||
          (r.first_name || "").toLowerCase().includes(q) ||
          (r.phone || "").includes(q),
      );
    }
    return [...list].sort((a, b) => contactPriority(a) - contactPriority(b));
  }, [rows, filter, search]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Vérification...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
            <p className="mt-2 text-gray-300 font-medium">
              Suivi des leads VSL et Plan d&apos;action. La case &quot;Call booké&quot; se coche
              automatiquement quand le lead réserve via Calendly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isOwner && (
              <a
                href="/admin/equipe"
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-gray-100 transition-colors hover:bg-white/20"
              >
                Équipe
              </a>
            )}
            <button
              onClick={syncBrevo}
              disabled={syncing}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-gray-100 transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              {syncing ? "Synchronisation..." : "Synchroniser depuis Brevo"}
            </button>
          </div>
        </div>

        {syncMessage && (
          <p className="mt-3 text-sm font-semibold text-amber-300">{syncMessage}</p>
        )}

        {/* Onglets source */}
        <div className="mt-6 flex gap-2">
          {(Object.keys(SOURCE_LABELS) as Source[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setTab(s);
                setFilter("all");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                tab === s
                  ? "bg-amber-400 text-gray-950"
                  : "bg-white/10 text-gray-200 hover:bg-white/20"
              }`}
            >
              {SOURCE_LABELS[s]} ({leads[s].length})
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-gray-300">Leads</p>
            <p className="mt-1 text-2xl font-bold">{stats.total}</p>
            <p className="mt-1 text-xs font-semibold text-gray-400">
              dont {stats.disqualified} disqualifiés ({stats.disqualifiedRate})
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-gray-300">Contactés</p>
            <p className="mt-1 text-2xl font-bold">
              {stats.contacted}{" "}
              <span className="text-base font-bold text-amber-300">{stats.contactedRate}</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-gray-400">des leads actifs</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-gray-300">Injoignables</p>
            <p className="mt-1 text-2xl font-bold">
              {stats.unreachable}{" "}
              <span className="text-base font-bold text-orange-300">{stats.unreachableRate}</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-gray-400">faux numéro / pas WhatsApp</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-gray-300">Réponses</p>
            <p className="mt-1 text-2xl font-bold">
              {stats.replied}{" "}
              <span className="text-base font-bold text-amber-300">{stats.replyRate}</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-gray-400">des contactés</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-gray-300">Calls bookés</p>
            <p className="mt-1 text-2xl font-bold">
              {stats.booked}{" "}
              <span className="text-base font-bold text-green-300">{stats.bookedRate}</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-gray-400">
              dont {stats.bookedDirect} en direct (sans contact)
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-gray-300">Réponse → call</p>
            <p className="mt-1 text-2xl font-bold">
              {stats.bookedAfterReply}{" "}
              <span className="text-base font-bold text-green-300">{stats.bookedFromReplyRate}</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-gray-400">
              ont répondu puis booké un call
            </p>
          </div>
        </div>

        {/* Filtres + recherche */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {([
            ["all", `Tous (${counts.all})`],
            ["to_contact", `À contacter (${counts.to_contact})`],
            ["waiting", `En attente de réponse (${counts.waiting})`],
            ["replied", `A répondu (${counts.replied})`],
            ["booked", `Call booké (${counts.booked})`],
            ["unreachable", `Injoignables (${counts.unreachable})`],
            ["disqualified", `Disqualifiés (${counts.disqualified})`],
          ] as const).map(([key, lbl]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                filter === key
                  ? "bg-amber-400 text-gray-950"
                  : "bg-white/10 text-gray-200 hover:bg-white/20"
              }`}
            >
              {lbl}
            </button>
          ))}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (nom, email, tel)"
            className="ml-auto w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white placeholder-gray-500 outline-none focus:border-amber-400 sm:w-64"
          />
        </div>

        {loading && <p className="mt-8 text-gray-300">Chargement...</p>}
        {error && <p className="mt-8 font-bold text-red-400">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="mt-8 text-gray-300">Aucun lead pour ce filtre.</p>
        )}

        <div className="mt-6 space-y-2">
          {filtered.map((lead) => {
            const notesOpen = openNotes === lead.id;
            return (
              <div
                key={lead.id}
                className={`rounded-xl border bg-white/5 ${
                  lead.disqualified
                    ? "border-red-500/20 opacity-60"
                    : lead.unreachable
                      ? "border-orange-500/20 opacity-70"
                      : lead.call_booked
                        ? "border-green-500/30"
                        : lead.source === "vsl" && lead.qualified === null
                          ? "border-white/10 opacity-60"
                          : "border-white/10"
                }`}
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white">
                      {lead.first_name || "(sans prénom)"}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => copy(lead.email, `${lead.id}-email`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            copy(lead.email, `${lead.id}-email`);
                          }
                        }}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 text-sm font-semibold text-gray-100 transition-colors hover:bg-white/20"
                        title="Copier l'email"
                      >
                        <span className="truncate">{lead.email}</span>
                        <span className="text-xs text-amber-300">
                          {copied === `${lead.id}-email` ? "Copié ✓" : "Copier"}
                        </span>
                      </span>
                      {lead.phone && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => copy(lead.phone!, `${lead.id}-phone`)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              copy(lead.phone!, `${lead.id}-phone`);
                            }
                          }}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 text-sm font-semibold text-gray-100 transition-colors hover:bg-white/20"
                          title="Copier le numéro"
                        >
                          <span>{lead.phone}</span>
                          <span className="text-xs text-amber-300">
                            {copied === `${lead.id}-phone` ? "Copié ✓" : "Copier"}
                          </span>
                        </span>
                      )}
                      <span className="text-xs font-medium text-gray-400">
                        {formatDate(lead.created_at)}
                      </span>
                    </div>
                    {lead.source === "vsl" && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {lead.qualified !== null ? (
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
                              lead.qualified
                                ? "bg-green-500/15 text-green-300"
                                : "bg-red-500/15 text-red-300"
                            }`}
                          >
                            {lead.qualified ? "Pré-qualifié ✓" : "Non qualifié"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold text-gray-400">
                            Sans réponses aux questions
                          </span>
                        )}
                        <span className="text-xs font-medium text-gray-300">
                          {[lead.age, lead.profession, lead.objectif, lead.invest]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <label className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-gray-200">
                      <input
                        type="checkbox"
                        checked={lead.contacted}
                        onChange={(e) =>
                          patchLead(lead.id, lead.source, { contacted: e.target.checked })
                        }
                        className="h-4 w-4 accent-amber-400"
                      />
                      Contacté
                    </label>
                    <label className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-gray-200">
                      <input
                        type="checkbox"
                        checked={lead.replied}
                        onChange={(e) =>
                          patchLead(lead.id, lead.source, { replied: e.target.checked })
                        }
                        className="h-4 w-4 accent-amber-400"
                      />
                      A répondu
                    </label>
                    <label className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-gray-200">
                      <input
                        type="checkbox"
                        checked={lead.call_booked}
                        onChange={(e) =>
                          patchLead(lead.id, lead.source, { call_booked: e.target.checked })
                        }
                        className="h-4 w-4 accent-green-400"
                      />
                      Call booké
                      {lead.call_booked_auto && (
                        <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-300">
                          Auto
                        </span>
                      )}
                    </label>
                    <label className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-gray-200">
                      <input
                        type="checkbox"
                        checked={lead.unreachable}
                        onChange={(e) =>
                          patchLead(lead.id, lead.source, { unreachable: e.target.checked })
                        }
                        className="h-4 w-4 accent-orange-400"
                      />
                      Injoignable
                    </label>
                    <label className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-gray-200">
                      <input
                        type="checkbox"
                        checked={lead.disqualified}
                        onChange={(e) =>
                          patchLead(lead.id, lead.source, { disqualified: e.target.checked })
                        }
                        className="h-4 w-4 accent-red-400"
                      />
                      Disqualifié
                    </label>
                    <button
                      onClick={() => {
                        if (notesOpen) {
                          setOpenNotes(null);
                        } else {
                          setOpenNotes(lead.id);
                          setNoteDraft(lead.notes || "");
                        }
                      }}
                      className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                        lead.notes
                          ? "bg-amber-400/15 text-amber-300 hover:bg-amber-400/25"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {lead.notes ? "Notes ●" : "Notes"}
                    </button>
                    <button
                      onClick={() => deleteLead(lead)}
                      className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/20"
                      title="Supprimer ce lead du CRM et de la liste Brevo"
                    >
                      Suppr.
                    </button>
                  </div>
                </div>

                {notesOpen && (
                  <div className="border-t border-white/10 px-4 py-3">
                    <textarea
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      rows={3}
                      placeholder="Notes sur ce lead..."
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white placeholder-gray-500 outline-none focus:border-amber-400"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => saveNote(lead)}
                        disabled={savingNote}
                        className="rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-bold text-gray-950 transition-colors hover:bg-amber-300 disabled:opacity-50"
                      >
                        {savingNote ? "Enregistrement..." : "Enregistrer"}
                      </button>
                      <button
                        onClick={() => setOpenNotes(null)}
                        className="rounded-lg bg-white/10 px-4 py-1.5 text-sm font-bold text-gray-200 transition-colors hover:bg-white/20"
                      >
                        Annuler
                      </button>
                    </div>
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
