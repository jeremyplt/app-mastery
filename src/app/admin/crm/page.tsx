"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { CRM_GUIDE_LABELS } from "@/lib/guides";

type Source = "vsl" | "plan-action" | "guide";

type Lead = {
  id: string;
  created_at: string;
  email: string;
  source: Source;
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
  // Source "guide" : slug du dernier lead magnet demandé.
  guide_slug: string | null;
};

type Filter =
  | "all"
  | "to_contact"
  | "waiting"
  | "replied"
  | "booked"
  | "unreachable"
  | "disqualified";

const SOURCES: Source[] = ["vsl", "plan-action", "guide"];

const SOURCE_LABELS: Record<Source, string> = {
  vsl: "VSL (conférence)",
  "plan-action": "Plan d'action",
  guide: "Lead magnets",
};

const SOURCE_HINTS: Record<Source, string> = {
  vsl: "Inscrits à la conférence privée.",
  "plan-action": "Inscrits au Plan d'Action.",
  guide: "Lead magnets en rapport avec les apps mobiles (checklist des 27 règles, guide monétisation).",
};

// Clés localStorage + messages WhatsApp par défaut, un par source. {prenom} est
// remplacé par le prénom du lead au moment du clic.
const WA_TEMPLATE_KEY = "crm_whatsapp_template"; // ancienne clé (message unique)
const WA_TEMPLATES_KEY = "crm_whatsapp_templates"; // nouvelle clé (JSON par source)
const WA_DEFAULT_TEMPLATES: Record<Source, string> = {
  vsl: "Bonjour {prenom}, c'est Jeremy de App Mastery. Merci d'avoir suivi la conférence ! J'aimerais échanger avec toi sur ton projet d'application. Tu es dispo quand pour un rapide appel ?",
  "plan-action":
    "Bonjour {prenom}, c'est Jeremy de App Mastery. Merci pour ton inscription ! J'aimerais échanger avec toi sur ton projet d'application. Tu es dispo quand pour un rapide appel ?",
  guide:
    "Bonjour {prenom}, c'est Jeremy de App Mastery. Tu as bien reçu la checklist ? J'aimerais échanger avec toi sur ton projet d'application. Tu es dispo quand pour un rapide appel ?",
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

// Statut lisible d'un lead, dans l'ordre de priorité d'affichage.
type Status = { key: Filter; label: string; tone: "red" | "orange" | "green" | "blue" | "gray" | "accent" };
function statusOf(lead: Lead): Status {
  if (lead.disqualified) return { key: "disqualified", label: "Disqualifié", tone: "red" };
  if (lead.unreachable) return { key: "unreachable", label: "Injoignable", tone: "orange" };
  if (lead.call_booked) return { key: "booked", label: "Call booké", tone: "green" };
  if (lead.replied) return { key: "replied", label: "A répondu", tone: "blue" };
  if (lead.contacted) return { key: "waiting", label: "En attente", tone: "gray" };
  return { key: "to_contact", label: "À contacter", tone: "accent" };
}

const TONE_CLASSES: Record<Status["tone"], string> = {
  red: "bg-[color-mix(in_srgb,var(--red)_14%,transparent)] text-[var(--red)]",
  orange: "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]",
  green: "bg-[color-mix(in_srgb,var(--green)_15%,transparent)] text-[var(--green)]",
  blue: "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent2)]",
  gray: "bg-[var(--field)] text-[var(--fg2)]",
  accent: "bg-[var(--accent)] text-[var(--accent-fg)]",
};

function Chip({ tone, children }: { tone: Status["tone"]; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}

// Bouton d'état : coché = coloré, sinon neutre. Remplace les cases à cocher
// pour que l'état se lise d'un coup d'œil.
function Toggle({
  on,
  tone,
  label,
  onChange,
}: {
  on: boolean;
  tone: "green" | "blue" | "orange" | "red" | "gray";
  label: string;
  onChange: (next: boolean) => void;
}) {
  const onClasses: Record<typeof tone, string> = {
    green: "bg-[color-mix(in_srgb,var(--green)_18%,transparent)] text-[var(--green)] ring-[color-mix(in_srgb,var(--green)_45%,transparent)]",
    blue: "bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent2)] ring-[color-mix(in_srgb,var(--accent)_45%,transparent)]",
    orange: "bg-[color-mix(in_srgb,var(--orange)_18%,transparent)] text-[var(--orange)] ring-[color-mix(in_srgb,var(--orange)_45%,transparent)]",
    red: "bg-[color-mix(in_srgb,var(--red)_16%,transparent)] text-[var(--red)] ring-[color-mix(in_srgb,var(--red)_45%,transparent)]",
    gray: "bg-[color-mix(in_srgb,var(--fg)_12%,transparent)] text-[var(--fg)] ring-[var(--field-brd)]",
  };
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 transition-colors ${
        on ? onClasses[tone] : "bg-transparent text-[var(--fg3)] ring-[var(--sep)] hover:text-[var(--fg2)] hover:ring-[var(--field-brd)]"
      }`}
    >
      {label}
    </button>
  );
}

function Stat({
  label,
  value,
  rate,
  tone,
  hint,
}: {
  label: string;
  value: number;
  rate?: string;
  tone?: "green" | "blue";
  hint: string;
}) {
  const rateClass = tone === "green" ? "text-[var(--green)]" : "text-[var(--accent2)]";
  return (
    <div className="mac-tile">
      <p className="text-[12.5px] font-semibold text-[var(--fg2)]">{label}</p>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="text-[26px] font-bold tracking-tight leading-none">{value}</span>
        {rate && <span className={`text-[14px] font-bold ${rateClass}`}>{rate}</span>}
      </p>
      <p className="mt-1.5 text-[12px] font-medium text-[var(--fg3)]">{hint}</p>
    </div>
  );
}

export default function CrmAdmin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [leads, setLeads] = useState<Record<Source, Lead[]>>({ vsl: [], "plan-action": [], guide: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Source>("vsl");
  const [filter, setFilter] = useState<Filter>("all");
  const [guideFilter, setGuideFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [openNotes, setOpenNotes] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [waEditorOpen, setWaEditorOpen] = useState(false);
  const [waDraft, setWaDraft] = useState<Record<Source, string>>(WA_DEFAULT_TEMPLATES);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    });
  }

  // Templates WhatsApp lus dans le localStorage à la demande (ouverture de
  // l'éditeur ou clic sur un numéro), jamais au rendu : pas d'écart entre le
  // serveur et le navigateur.
  function readWaTemplates(): Record<Source, string> {
    try {
      const saved = localStorage.getItem(WA_TEMPLATES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Record<Source, string>>;
        return {
          vsl: parsed.vsl || WA_DEFAULT_TEMPLATES.vsl,
          "plan-action": parsed["plan-action"] || WA_DEFAULT_TEMPLATES["plan-action"],
          guide: parsed.guide || WA_DEFAULT_TEMPLATES.guide,
        };
      }
      // Migration depuis l'ancien message unique : on l'applique aux sources historiques.
      const legacy = localStorage.getItem(WA_TEMPLATE_KEY);
      if (legacy) return { ...WA_DEFAULT_TEMPLATES, vsl: legacy, "plan-action": legacy };
    } catch {
      /* localStorage indisponible */
    }
    return WA_DEFAULT_TEMPLATES;
  }

  function saveWaTemplates() {
    const next: Record<Source, string> = {
      vsl: waDraft.vsl.trim() || WA_DEFAULT_TEMPLATES.vsl,
      "plan-action": waDraft["plan-action"].trim() || WA_DEFAULT_TEMPLATES["plan-action"],
      guide: waDraft.guide.trim() || WA_DEFAULT_TEMPLATES.guide,
    };
    try {
      localStorage.setItem(WA_TEMPLATES_KEY, JSON.stringify(next));
    } catch {
      /* localStorage indisponible */
    }
    setWaEditorOpen(false);
  }

  // Copie le numéro puis ouvre WhatsApp avec le message pré-rempli selon la source.
  function openWhatsApp(lead: Lead) {
    if (!lead.phone) return;
    copy(lead.phone, `${lead.id}-phone`);
    const digits = lead.phone.replace(/\D/g, "");
    const template = readWaTemplates()[lead.source] || WA_DEFAULT_TEMPLATES[lead.source];
    const message = template.replace(/\{prenom\}/gi, lead.first_name?.trim() || "");
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
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

  // Lecture des trois funnels. `loading` démarre à true : le premier
  // chargement n'a rien à poser avant la réponse, et les rechargements
  // (après une sync) gardent la liste affichée.
  async function fetchLeads(): Promise<{ leads?: Record<Source, Lead[]>; error?: string }> {
    try {
      const results = await Promise.all(
        SOURCES.map((s) => fetch(`/api/admin/crm?source=${s}`).then((r) => r.json())),
      );
      if (results.every((r) => r.leads)) {
        return { leads: { vsl: results[0].leads, "plan-action": results[1].leads, guide: results[2].leads } };
      }
      return { error: results.find((r) => r.error)?.error || "Impossible de charger les leads" };
    } catch {
      return { error: "Impossible de charger les leads" };
    }
  }

  function applyLeads(res: { leads?: Record<Source, Lead[]>; error?: string }) {
    if (res.leads) {
      setLeads(res.leads);
      setError(null);
    } else {
      setError(res.error ?? "Impossible de charger les leads");
    }
    setLoading(false);
  }

  async function loadLeads() {
    applyLeads(await fetchLeads());
  }

  useEffect(() => {
    if (!authorized) return;
    fetchLeads().then(applyLeads);
  }, [authorized]);

  async function syncBrevo() {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/admin/crm/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        const r = data.results ?? {};
        const sum = (k: "contacted" | "unreachable" | "booked") =>
          SOURCES.reduce((n, s) => n + (r[s]?.[k] ?? 0), 0);
        setSyncMessage(
          `Sync OK : ${r.vsl?.synced ?? 0} leads VSL, ${r["plan-action"]?.synced ?? 0} Plan d'action, ${r.guide?.synced ?? 0} lead magnets importés depuis Brevo (dont ${sum("contacted")} contactés, ${sum("unreachable")} injoignables, ${sum("booked")} calls bookés).`,
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
  // à l'intérieur de chaque groupe. Sans effet hors VSL (tous null).
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

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: rows.length,
      to_contact: 0,
      waiting: 0,
      replied: 0,
      booked: 0,
      unreachable: 0,
      disqualified: 0,
    };
    for (const r of rows) {
      if (r.disqualified) c.disqualified++;
      if (r.replied && !r.disqualified) c.replied++;
      if (r.call_booked && !r.disqualified) c.booked++;
      if (r.unreachable && !r.disqualified) c.unreachable++;
      if (!r.contacted && !r.disqualified && !r.call_booked && !r.unreachable) c.to_contact++;
      if (r.contacted && !r.replied && !r.disqualified && !r.call_booked && !r.unreachable) c.waiting++;
    }
    return c;
  }, [rows]);

  // Lead magnets présents dans l'onglet "guide", pour le filtre secondaire.
  const guideSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const r of leads.guide) if (r.guide_slug) set.add(r.guide_slug);
    return Array.from(set);
  }, [leads.guide]);

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
    if (tab === "guide" && guideFilter !== "all") list = list.filter((r) => r.guide_slug === guideFilter);
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
  }, [rows, filter, search, tab, guideFilter]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center">
        Vérification...
      </div>
    );
  }

  const FILTERS: [Filter, string][] = [
    ["all", "Tous"],
    ["to_contact", "À contacter"],
    ["waiting", "En attente"],
    ["replied", "A répondu"],
    ["booked", "Call booké"],
    ["unreachable", "Injoignables"],
    ["disqualified", "Disqualifiés"],
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:py-8">
        <AdminNav current="crm" isOwner={isOwner} />

        {/* En-tête : titre à gauche, actions de la page à droite */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">CRM</h1>
            <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">
              Suivi des leads par funnel. « Call booké » se coche tout seul quand le lead réserve via Calendly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setWaDraft(readWaTemplates());
                setWaEditorOpen((o) => !o);
              }}
              className="mac-btn mac-btn-def mac-btn-sm"
            >
              Messages WhatsApp
            </button>
            <button onClick={syncBrevo} disabled={syncing} className="mac-btn mac-btn-def mac-btn-sm disabled:opacity-50">
              {syncing ? "Synchronisation..." : "Synchroniser depuis Brevo"}
            </button>
          </div>
        </header>

        {syncMessage && (
          <p className="mt-3 text-sm font-semibold text-[var(--accent2)]">{syncMessage}</p>
        )}

        {waEditorOpen && (
          <div className="mac-group mt-5 p-4">
            <p className="text-sm font-medium text-[var(--fg2)]">
              Un message par source, envoyé quand tu cliques sur un numéro. Utilise{" "}
              <code className="rounded bg-[var(--field)] px-1 font-mono text-[var(--accent2)]">{"{prenom}"}</code>{" "}
              pour insérer le prénom du lead. Les emojis sont acceptés.
            </p>

            {SOURCES.map((s) => (
              <div key={s} className="mt-4">
                <label htmlFor={`wa-${s}`} className="block text-sm font-bold text-[var(--fg)]">
                  Message {SOURCE_LABELS[s]}
                </label>
                <textarea
                  id={`wa-${s}`}
                  value={waDraft[s]}
                  onChange={(e) => setWaDraft((d) => ({ ...d, [s]: e.target.value }))}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-[var(--sep)] bg-[var(--field)] px-3 py-2 text-sm font-medium text-[var(--fg)] outline-none focus:border-[var(--accent)]"
                  placeholder={WA_DEFAULT_TEMPLATES[s]}
                />
              </div>
            ))}

            <div className="mt-3 flex items-center gap-2">
              <button onClick={saveWaTemplates} className="mac-btn mac-btn-primary mac-btn-sm">
                Enregistrer
              </button>
              <button onClick={() => setWaEditorOpen(false)} className="mac-btn mac-btn-def mac-btn-sm">
                Annuler
              </button>
              <button
                onClick={() => setWaDraft(WA_DEFAULT_TEMPLATES)}
                className="ml-auto text-sm font-semibold text-[var(--fg2)] underline transition-colors hover:text-[var(--fg)]"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}

        {/* Sélecteur de funnel */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="mac-seg">
            {SOURCES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setTab(s);
                  setFilter("all");
                  setGuideFilter("all");
                }}
                className={tab === s ? "on" : ""}
                aria-pressed={tab === s}
              >
                {SOURCE_LABELS[s]}
                <span className={`ml-1.5 text-[12px] ${tab === s ? "text-[var(--fg2)]" : "text-[var(--fg3)]"}`}>
                  {leads[s].length}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[13px] font-medium text-[var(--fg3)]">{SOURCE_HINTS[tab]}</p>
        </div>

        {/* Entonnoir : quatre chiffres qui comptent, le reste en une ligne */}
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Leads" value={stats.total} hint={`${stats.unreachable} injoignables · ${stats.disqualified} disqualifiés`} />
          <Stat label="Contactés" value={stats.contacted} rate={stats.contactedRate} hint="des leads joignables" />
          <Stat label="Réponses" value={stats.replied} rate={stats.replyRate} hint="des contactés" />
          <Stat
            label="Calls bookés"
            value={stats.booked}
            rate={stats.bookedRate}
            tone="green"
            hint={`${stats.bookedDirect} en direct · ${stats.bookedAfterReply} après réponse (${stats.bookedFromReplyRate})`}
          />
        </div>

        {/* Filtres + recherche */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="mac-seg flex-wrap">
            {FILTERS.map(([key, lbl]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={filter === key ? "on" : ""}
                aria-pressed={filter === key}
              >
                {lbl}
                <span className={`ml-1.5 text-[12px] ${filter === key ? "text-[var(--fg2)]" : "text-[var(--fg3)]"}`}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>
          {tab === "guide" && guideSlugs.length > 0 && (
            <select
              value={guideFilter}
              onChange={(e) => setGuideFilter(e.target.value)}
              aria-label="Filtrer par lead magnet"
              className="rounded-lg border border-[var(--sep)] bg-[var(--card)] px-3 py-2 text-sm font-semibold text-[var(--fg)] outline-none focus:border-[var(--accent)]"
            >
              <option value="all">Tous les lead magnets</option>
              {guideSlugs.map((slug) => (
                <option key={slug} value={slug}>
                  {CRM_GUIDE_LABELS[slug] ?? slug}
                </option>
              ))}
            </select>
          )}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (nom, email, tel)"
            aria-label="Rechercher un lead"
            className="ml-auto w-full rounded-lg border border-[var(--sep)] bg-[var(--card)] px-3 py-2 text-sm font-semibold text-[var(--fg)] placeholder-[var(--fg3)] outline-none focus:border-[var(--accent)] sm:w-64"
          />
        </div>

        {loading && <p className="mt-8 text-[var(--fg2)]">Chargement...</p>}
        {error && <p className="mt-8 font-bold text-[var(--red)]">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="mac-group mt-5 p-8 text-center">
            <p className="font-semibold text-[var(--fg)]">Aucun lead pour ce filtre.</p>
            {tab === "guide" && rows.length === 0 && (
              <p className="mt-1 text-sm font-medium text-[var(--fg2)]">
                Les inscrits arrivent ici automatiquement. Pour importer les anciens depuis Brevo, clique sur « Synchroniser depuis Brevo ».
              </p>
            )}
          </div>
        )}

        {/* Liste des leads */}
        {filtered.length > 0 && (
          <div className="mac-group mt-5">
            {filtered.map((lead) => {
              const notesOpen = openNotes === lead.id;
              const status = statusOf(lead);
              const dimmed = lead.disqualified || lead.unreachable || (lead.source === "vsl" && lead.qualified === null);
              return (
                <div key={lead.id} className={`border-b border-[var(--sep)] last:border-b-0 ${dimmed ? "opacity-60" : ""}`}>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
                    {/* Identité */}
                    <div className="min-w-0 flex-1 basis-[280px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[15px] font-bold text-[var(--fg)]">
                          {lead.first_name || "(sans prénom)"}
                        </p>
                        <Chip tone={status.tone}>{status.label}</Chip>
                        {lead.call_booked && lead.call_booked_auto && <Chip tone="green">Auto</Chip>}
                        {lead.source === "guide" && lead.guide_slug && (
                          <Chip tone="gray">{CRM_GUIDE_LABELS[lead.guide_slug] ?? lead.guide_slug}</Chip>
                        )}
                        {lead.source === "vsl" &&
                          (lead.qualified === true ? (
                            <Chip tone="green">Pré-qualifié</Chip>
                          ) : lead.qualified === false ? (
                            <Chip tone="red">Non qualifié</Chip>
                          ) : (
                            <Chip tone="gray">Sans réponses</Chip>
                          ))}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <button
                          type="button"
                          onClick={() => copy(lead.email, `${lead.id}-email`)}
                          className="inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[13px] font-medium text-[var(--fg2)] transition-colors hover:bg-[var(--field)] hover:text-[var(--fg)]"
                          title="Copier l'email"
                        >
                          <span className="truncate">{lead.email}</span>
                          <span className="text-[11px] font-semibold text-[var(--accent2)]">
                            {copied === `${lead.id}-email` ? "Copié ✓" : "Copier"}
                          </span>
                        </button>
                        {lead.phone && (
                          <button
                            type="button"
                            onClick={() => openWhatsApp(lead)}
                            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[13px] font-medium text-[var(--fg2)] transition-colors hover:bg-[var(--field)] hover:text-[var(--fg)]"
                            title="Copier le numéro et ouvrir WhatsApp"
                          >
                            <span>{lead.phone}</span>
                            <span className="text-[11px] font-semibold text-[var(--green)]">
                              {copied === `${lead.id}-phone` ? "Copié ✓ · WhatsApp" : "WhatsApp"}
                            </span>
                          </button>
                        )}
                        <span className="text-[12px] font-medium text-[var(--fg3)]">{formatDate(lead.created_at)}</span>
                      </div>
                      {lead.source === "vsl" && (lead.age || lead.profession || lead.objectif || lead.invest) && (
                        <p
                          className="mt-0.5 truncate text-[12px] font-medium text-[var(--fg3)]"
                          title={[lead.age, lead.profession, lead.objectif, lead.invest].filter(Boolean).join(" · ")}
                        >
                          {[lead.age, lead.profession, lead.objectif, lead.invest].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>

                    {/* États + actions */}
                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                      <Toggle on={lead.contacted} tone="gray" label="Contacté" onChange={(v) => patchLead(lead.id, lead.source, { contacted: v })} />
                      <Toggle on={lead.replied} tone="blue" label="A répondu" onChange={(v) => patchLead(lead.id, lead.source, { replied: v })} />
                      <Toggle on={lead.call_booked} tone="green" label="Call booké" onChange={(v) => patchLead(lead.id, lead.source, { call_booked: v })} />
                      <Toggle on={lead.unreachable} tone="orange" label="Injoignable" onChange={(v) => patchLead(lead.id, lead.source, { unreachable: v })} />
                      <Toggle on={lead.disqualified} tone="red" label="Disqualifié" onChange={(v) => patchLead(lead.id, lead.source, { disqualified: v })} />
                      <span className="mx-1 h-5 w-px bg-[var(--sep)]" aria-hidden />
                      <button
                        type="button"
                        onClick={() => {
                          if (notesOpen) {
                            setOpenNotes(null);
                          } else {
                            setOpenNotes(lead.id);
                            setNoteDraft(lead.notes || "");
                          }
                        }}
                        aria-expanded={notesOpen}
                        className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                          lead.notes
                            ? "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent2)] hover:bg-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
                            : "text-[var(--fg3)] hover:bg-[var(--field)] hover:text-[var(--fg)]"
                        }`}
                      >
                        {lead.notes ? "Notes ●" : "Notes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLead(lead)}
                        className="rounded-md px-2 py-1 text-xs font-bold text-[var(--fg3)] transition-colors hover:bg-[color-mix(in_srgb,var(--red)_14%,transparent)] hover:text-[var(--red)]"
                        title="Supprimer ce lead du CRM et de la liste Brevo"
                        aria-label={`Supprimer ${lead.first_name || lead.email}`}
                      >
                        Suppr.
                      </button>
                    </div>
                  </div>

                  {notesOpen && (
                    <div className="border-t border-[var(--sep)] bg-[var(--field)] px-4 py-3">
                      <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        rows={3}
                        placeholder="Notes sur ce lead..."
                        aria-label="Notes sur ce lead"
                        className="w-full rounded-lg border border-[var(--sep)] bg-[var(--group)] px-3 py-2 text-sm font-medium text-[var(--fg)] placeholder-[var(--fg3)] outline-none focus:border-[var(--accent)]"
                      />
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => saveNote(lead)} disabled={savingNote} className="mac-btn mac-btn-primary mac-btn-sm disabled:opacity-50">
                          {savingNote ? "Enregistrement..." : "Enregistrer"}
                        </button>
                        <button onClick={() => setOpenNotes(null)} className="mac-btn mac-btn-def mac-btn-sm">
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
