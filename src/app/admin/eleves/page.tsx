"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import {
  MILESTONES,
  TONE_CLASSES,
  avatarColor,
  bilanDate,
  daysFrom,
  endDate,
  frDate,
  initials,
  isLate,
  lastContactLabel,
  money,
  paymentsOf,
  relative,
  statusOf,
  today,
  type Payment,
  type Student,
} from "./shared";

// Liste des élèves : une ligne par élève, résumé en colonnes. Un clic ouvre
// la fiche (/admin/eleves/[id]) où tout se modifie.

type View = "active" | "late" | "archived";

const EMPTY_FORM = { name: "", email: "", phone: "", app: "", start_date: "", payment_label: "" };

// Avancement : les 6 étapes du parcours en petites pastilles.
function Progress({ s }: { s: Student }) {
  const done = MILESTONES.filter(([k]) => s[k]).length;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1" aria-hidden>
        {MILESTONES.map(([k, label]) => (
          <span key={k} title={label} className={`h-2 w-4 rounded-full ${s[k] ? "bg-[var(--green)]" : "bg-[var(--field-brd)]"}`} />
        ))}
      </div>
      <span className="text-[13px] font-semibold text-[var(--fg2)]">
        {done}/{MILESTONES.length}
      </span>
    </div>
  );
}

// Paiements : barre de progression du montant encaissé.
function PaymentsSummary({ s }: { s: Student }) {
  const list = paymentsOf(s);
  if (list.length === 0) return <span className="text-[13px] font-semibold text-[var(--fg3)]">Aucun</span>;
  const paid = list.filter((p) => p.paid).length;
  const late = list.some(isLate);
  const total = list.reduce((n, p) => n + (p.amount ?? 0), 0);
  const cashed = list.filter((p) => p.paid).reduce((n, p) => n + (p.amount ?? 0), 0);
  return (
    <div className="min-w-[120px]">
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--field-brd)]">
        <div
          className={`h-full rounded-full ${late ? "bg-[var(--red)]" : "bg-[var(--green)]"}`}
          style={{ width: `${(paid / list.length) * 100}%` }}
        />
      </div>
      <p className={`mt-1 text-[12.5px] font-semibold ${late ? "text-[var(--red)]" : "text-[var(--fg2)]"}`}>
        {paid}/{list.length} payés{total > 0 ? ` · ${money(cashed)} / ${money(total)}` : ""}
      </p>
    </div>
  );
}

function DateCell({ iso, muted }: { iso: string | null; muted?: boolean }) {
  if (!iso) return <span className="text-[13px] text-[var(--fg3)]">-</span>;
  const left = daysFrom(iso);
  const cls = muted ? "text-[var(--fg3)]" : left < 0 ? "text-[var(--fg3)]" : left <= 14 ? "text-[var(--orange)]" : "text-[var(--fg)]";
  return (
    <div>
      <p className={`text-[13.5px] font-semibold ${cls}`}>{frDate(iso)}</p>
      <p className="text-[12px] font-medium text-[var(--fg3)]">{relative(iso)}</p>
    </div>
  );
}

export default function ElevesPage() {
  const [authorized, setAuthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState<string | null>(null);
  const [view, setView] = useState<View>("active");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formPayments, setFormPayments] = useState<Payment[]>([]);

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
    fetch("/api/admin/eleves")
      .then((r) => r.json())
      .catch(() => ({ error: "réseau" }))
      .then((d: { students?: Student[]; error?: string }) => {
        if (d.students) setStudents(d.students);
        else setFlash(`Erreur : ${d.error}`);
        setLoading(false);
      });
  }, [authorized]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const d = await fetch("/api/admin/eleves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, payments: formPayments }),
    }).then((r) => r.json());
    if (d.error) {
      setFlash(`Erreur : ${d.error}`);
      return;
    }
    // Direction la fiche du nouvel élève pour compléter le reste.
    window.location.href = `/admin/eleves/${d.student.id}`;
  }

  const counts = useMemo(
    () => ({
      active: students.filter((s) => !s.archived).length,
      late: students.filter((s) => !s.archived && paymentsOf(s).some(isLate)).length,
      archived: students.filter((s) => s.archived).length,
    }),
    [students],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (view === "archived" ? !s.archived : s.archived) return false;
      if (view === "late" && !paymentsOf(s).some(isLate)) return false;
      if (!q) return true;
      return [s.name, s.app, s.email].some((v) => v?.toLowerCase().includes(q));
    });
  }, [students, view, query]);

  if (!authorized) return null;

  const tabs: [View, string][] = [
    ["active", `En cours (${counts.active})`],
    ["late", `Paiement en retard (${counts.late})`],
    ["archived", `Archivés (${counts.archived})`],
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:py-8">
        <AdminNav current="eleves" isOwner={isOwner} />

        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">Élèves</h1>
            <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">
              Le suivi de chaque élève. Une vente déclarée crée l&apos;élève toute seule. Clique sur un élève pour ouvrir sa fiche.
            </p>
          </div>
          <button onClick={() => setFormOpen((o) => !o)} className="mac-btn mac-btn-primary mac-btn-sm">
            + Ajouter un élève
          </button>
        </header>

        {flash && <p className="mt-3 text-sm font-semibold text-[var(--red)]">{flash}</p>}

        {formOpen && (
          <form onSubmit={submit} className="mac-group mt-5 p-4 sm:p-5">
            <h2 className="text-lg font-bold">Nouvel élève</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <input className="mac-field" required placeholder="Nom et prénom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="mac-field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="mac-field" placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="mac-field" placeholder="App" value={form.app} onChange={(e) => setForm({ ...form, app: e.target.value })} />
              <label>
                <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Date de début</span>
                <input className="mac-field" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </label>
              <input className="mac-field self-end" placeholder="Paiement (ex. 3x1000)" value={form.payment_label} onChange={(e) => setForm({ ...form, payment_label: e.target.value })} />
            </div>

            <p className="mac-grouplabel mt-4">Paiements</p>
            {formPayments.map((p, i) => (
              <div key={i} className="mb-2 flex flex-wrap items-center gap-2">
                <input
                  className="mac-field !w-44 !py-2"
                  type="date"
                  value={p.date}
                  onChange={(e) => setFormPayments((l) => l.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))}
                />
                <input
                  className="mac-field !w-32 !py-2"
                  inputMode="decimal"
                  placeholder="Montant"
                  value={p.amount ?? ""}
                  onChange={(e) => setFormPayments((l) => l.map((x, j) => (j === i ? { ...x, amount: Number(e.target.value) || null } : x)))}
                />
                <label className="flex items-center gap-1.5 text-sm font-semibold">
                  <input type="checkbox" checked={p.paid} onChange={(e) => setFormPayments((l) => l.map((x, j) => (j === i ? { ...x, paid: e.target.checked } : x)))} />
                  Payé
                </label>
                <button type="button" onClick={() => setFormPayments((l) => l.filter((_, j) => j !== i))} className="text-sm font-bold text-[var(--red)]">
                  Retirer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormPayments((l) => [...l, { date: form.start_date || today(), amount: null, paid: false }])}
              className="text-sm font-bold text-[var(--accent2)]"
            >
              + Ajouter un paiement
            </button>

            <div className="mt-4 flex gap-2">
              <button type="submit" className="mac-btn mac-btn-primary mac-btn-sm">
                Créer la fiche
              </button>
              <button type="button" onClick={() => setFormOpen(false)} className="mac-btn mac-btn-def mac-btn-sm">
                Annuler
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="mac-seg">
            {tabs.map(([v, label]) => (
              <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
                {label}
              </button>
            ))}
          </div>
          <input
            className="mac-field !w-64 !py-2"
            placeholder="Rechercher un élève ou une app"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher"
          />
        </div>

        {loading && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">Chargement...</p>}
        {!loading && visible.length === 0 && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">Aucun élève ici.</p>}

        {visible.length > 0 && (
          <div className="mac-group mt-4">
            {/* En-têtes (écran large) */}
            <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_20px] gap-4 border-b border-[var(--sep)] px-4 py-2.5 text-xs font-bold text-[var(--fg2)] md:grid">
              <span>Élève</span>
              <span>Avancement</span>
              <span>Paiements</span>
              <span>Fin</span>
              <span>Bilan</span>
              <span />
            </div>
            {visible.map((s) => {
              const status = statusOf(s);
              return (
                <Link
                  key={s.id}
                  href={`/admin/eleves/${s.id}`}
                  className="group grid grid-cols-1 gap-3 border-b border-[var(--sep)] px-4 py-3.5 transition-colors last:border-b-0 hover:bg-[color-mix(in_srgb,var(--fg)_3%,transparent)] md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_20px] md:items-center md:gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[14px] font-bold text-white"
                      style={{ background: avatarColor(s.name) }}
                    >
                      {initials(s.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-bold text-[var(--fg)] group-hover:text-[var(--accent2)]">{s.name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className="truncate text-[13px] font-medium text-[var(--fg2)]">{s.app || "App à définir"}</span>
                        <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${TONE_CLASSES[status.tone]}`}>{status.label}</span>
                      </div>
                      <p className="mt-0.5 text-[12px] font-medium text-[var(--fg3)]">
                        Dernier échange : {lastContactLabel(s.last_contact_at)} ·{" "}
                        {s.questionnaire_answered_at ? (
                          <span className="font-semibold text-[var(--green)]">Kick-start reçu</span>
                        ) : s.questionnaire_sent_at ? (
                          <span className="font-semibold text-[var(--orange)]">Kick-start envoyé, pas encore rempli</span>
                        ) : (
                          "Kick-start pas envoyé"
                        )}
                      </p>
                    </div>
                  </div>
                  <Progress s={s} />
                  <PaymentsSummary s={s} />
                  <DateCell iso={endDate(s)} />
                  <DateCell iso={bilanDate(s)} muted={s.bilan_done} />
                  <span className="hidden text-[18px] text-[var(--fg3)] group-hover:text-[var(--accent2)] md:block" aria-hidden>
                    ›
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
