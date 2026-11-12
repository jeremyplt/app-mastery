"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { JournalForm, defaultHalf, draftOf, journalStatus, type JournalSave } from "@/components/admin/CallJournal";
import { CRAINTE_LABELS, PAROLE_LABELS, journalStats, statsLines, type JournalEntry } from "@/lib/appels/journal";

// Ressentis d'appels : avant chaque appel avec un élève, ce que tu crains et
// ce que tu prévois ; après, ce qui s'est vraiment passé. Le bilan en haut
// montre l'écart entre les deux. Propriétaire seulement.

type StudentOption = { id: string; name: string; archived: boolean | null };
type Recent = { key: string; student_id: string; student_name: string; starts_at: string; title: string };

const fullDate = (iso: string) => {
  const d = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date(iso));
  return `${d.charAt(0).toUpperCase()}${d.slice(1)}`;
};
const shortDate = (iso: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date(iso));

// Valeur d'un champ datetime-local (heure du navigateur).
function localInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function post(body: Record<string, unknown>) {
  const d = await fetch("/api/admin/ressentis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json());
  if (d.error) throw new Error(d.error);
  return d;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-[14px] font-medium leading-relaxed">
      <span className="font-bold text-[var(--fg2)]">{label} : </span>
      {children}
    </p>
  );
}

function EntryView({ e }: { e: JournalEntry }) {
  const avant = [e.apprehension !== null && `appréhension ${e.apprehension}/10`, e.prevision !== null && `prévu ${e.prevision}/5`].filter(Boolean).join(", ");
  const apres = [
    e.deroulement !== null && `${e.deroulement}/5`,
    e.duree_min !== null && `${e.duree_min} min`,
    e.parole && `a le plus parlé : ${PAROLE_LABELS[e.parole].toLowerCase()}`,
    e.crainte && `crainte réalisée : ${CRAINTE_LABELS[e.crainte].toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(", ");
  if (!e.avant_at && !e.apres_at) return <p className="mt-2 text-[13.5px] font-semibold text-[var(--fg3)]">Rien de noté pour l&apos;instant.</p>;
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      <div className="space-y-1 rounded-xl bg-[var(--field)] p-3">
        <p className="text-[12.5px] font-bold uppercase tracking-wide text-[var(--fg2)]">Avant</p>
        {avant && <p className="text-[14px] font-semibold">{avant}</p>}
        {e.inquietude && <Field label="Ce qui m'inquiétait">{e.inquietude}</Field>}
        {!e.avant_at && <p className="text-[13.5px] font-semibold text-[var(--fg3)]">Pas noté.</p>}
      </div>
      <div className="space-y-1 rounded-xl bg-[var(--field)] p-3">
        <p className="text-[12.5px] font-bold uppercase tracking-wide text-[var(--fg2)]">Après</p>
        {apres && <p className="text-[14px] font-semibold">{apres}</p>}
        {e.pourquoi && <Field label="Pourquoi">{e.pourquoi}</Field>}
        {!e.apres_at && <p className="text-[13.5px] font-semibold text-[var(--fg3)]">Pas encore noté.</p>}
      </div>
    </div>
  );
}

function EntryItem({ e, studentName, onSaved, onDeleted }: { e: JournalEntry; studentName: string | null; onSaved: (e: JournalEntry) => void; onDeleted: (id: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const half = defaultHalf(e.call_at);

  async function save(s: JournalSave) {
    try {
      const d = await post({ action: "enregistrer", id: e.id, ...s });
      onSaved(d.entry as JournalEntry);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
      return false;
    }
  }

  async function remove() {
    if (!window.confirm("Supprimer ce ressenti ?")) return;
    try {
      await post({ action: "supprimer", id: e.id });
      onDeleted(e.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
    }
  }

  const status = journalStatus(e);
  return (
    <li className="rounded-xl border-[0.5px] border-[var(--sep)] bg-[var(--group)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-bold">
            {fullDate(e.call_at)}
            {studentName && (
              <>
                {" · "}
                {e.student_id ? (
                  <Link href={`/admin/eleves/${e.student_id}`} className="text-[var(--accent2)] hover:underline">
                    {studentName}
                  </Link>
                ) : (
                  studentName
                )}
              </>
            )}
          </p>
          <p className="text-[13px] font-semibold text-[var(--fg2)]">
            {e.label ?? "Appel"}
            {status ? `, ${status.toLowerCase()}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setEditing(!editing)} className="mac-btn mac-btn-def mac-btn-sm">
            {editing ? "Fermer" : "Modifier"}
          </button>
          <button type="button" onClick={remove} className="mac-btn mac-btn-def mac-btn-sm !text-[var(--red)]">
            Supprimer
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-[13px] font-semibold text-[var(--red)]">Erreur : {error}</p>}
      {editing ? (
        <div className="mt-3">
          <JournalForm initial={draftOf(e)} half={half} onSave={save} onCancel={() => setEditing(false)} />
        </div>
      ) : (
        <EntryView e={e} />
      )}
    </li>
  );
}

function AddForm({ students, recents, onCreated, onClose }: { students: StudentOption[]; recents: Recent[]; onCreated: (e: JournalEntry) => void; onClose: () => void }) {
  const [pick, setPick] = useState<Recent | null>(null);
  const [studentId, setStudentId] = useState("");
  const [when, setWhen] = useState(localInput(new Date()));
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const active = students.filter((s) => !s.archived);
  const archived = students.filter((s) => s.archived);

  async function create(s: JournalSave) {
    const callAt = pick ? pick.starts_at : when ? new Date(when).toISOString() : "";
    if (!callAt) {
      setError("Indique la date de l'appel.");
      return false;
    }
    try {
      const d = await post({
        action: "enregistrer",
        event_key: pick?.key ?? null,
        student_id: pick ? pick.student_id : studentId || null,
        call_at: callAt,
        label: pick ? pick.title : label,
        ...s,
      });
      onCreated(d.entry as JournalEntry);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
      return false;
    }
  }

  return (
    <section className="mac-group mt-5 p-4 sm:p-5">
      <h2 className="text-lg font-bold">Nouveau ressenti</h2>
      {recents.length > 0 && (
        <>
          <p className="mac-grouplabel mt-3">Un appel des 14 derniers jours</p>
          <div className="flex flex-wrap gap-2">
            {recents.map((r) => {
              const on = pick?.key === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPick(on ? null : r)}
                  className={`rounded-[9px] border-[0.5px] px-3 py-2 text-left text-[13.5px] font-semibold transition-colors ${
                    on ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--fg)]" : "border-[var(--field-brd)] bg-[var(--field)] text-[var(--fg)] hover:border-[var(--accent)]"
                  }`}
                >
                  {r.student_name}, {shortDate(r.starts_at)}
                </button>
              );
            })}
          </div>
        </>
      )}
      {!pick && (
        <>
          <p className="mac-grouplabel mt-4">{recents.length ? "Ou un autre appel" : "L'appel"}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <select className="mac-field" value={studentId} onChange={(e) => setStudentId(e.target.value)} aria-label="Élève">
              <option value="">Choisis l&apos;élève</option>
              {active.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
              {archived.length > 0 && (
                <optgroup label="Archivés">
                  {archived.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <input className="mac-field" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} aria-label="Date et heure de l'appel" />
            <input className="mac-field" placeholder="Type d'appel (facultatif)" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
        </>
      )}
      {error && <p className="mt-3 text-[13px] font-semibold text-[var(--red)]">Erreur : {error}</p>}
      <div className="mt-4">
        <JournalForm
          key={pick?.key ?? "autre"}
          initial={draftOf(null)}
          half="avant"
          onSave={create}
          onCancel={onClose}
          saveLabel="Ajouter"
        />
      </div>
    </section>
  );
}

export default function RessentisAdmin() {
  const [authorized, setAuthorized] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [recents, setRecents] = useState<Recent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        // Journal personnel : propriétaire seulement.
        if (d.role === "owner") setAuthorized(true);
        else window.location.href = d.admin ? "/admin/crm" : "/membres";
      })
      .catch(() => {
        window.location.href = "/membres";
      });
  }, []);

  useEffect(() => {
    if (!authorized) return;
    fetch("/api/admin/ressentis")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setEntries(d.entries ?? []);
        setStudents(d.students ?? []);
        setRecents(d.recents ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Chargement impossible"))
      .finally(() => setLoaded(true));
  }, [authorized]);

  const names = useMemo(() => new Map(students.map((s) => [s.id, s.name])), [students]);
  const lines = useMemo(() => statsLines(journalStats(entries)), [entries]);

  function upsert(e: JournalEntry) {
    setEntries((list) => [e, ...list.filter((x) => x.id !== e.id)].sort((a, b) => Date.parse(b.call_at) - Date.parse(a.call_at)));
    if (e.event_key) setRecents((list) => list.filter((r) => r.key !== e.event_key));
  }

  if (!authorized) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--fg)]">Vérification...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-5 sm:py-8">
        <AdminNav current="ressentis" isOwner />
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">Ressentis d&apos;appels</h1>
            <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">
              Avant un appel, note ce qui t&apos;inquiète et comment tu penses que ça va se passer. Après, note comment ça s&apos;est vraiment passé. Avec le temps, l&apos;écart se voit.
            </p>
          </div>
          {!adding && (
            <button type="button" onClick={() => setAdding(true)} className="mac-btn mac-btn-primary mac-btn-sm">
              + Ajouter un ressenti
            </button>
          )}
        </header>

        {error && <p className="mt-4 text-[13.5px] font-semibold text-[var(--red)]">Erreur : {error}</p>}

        {adding && (
          <AddForm
            students={students}
            recents={recents}
            onCreated={(e) => {
              upsert(e);
              setAdding(false);
            }}
            onClose={() => setAdding(false)}
          />
        )}

        {lines.length > 0 && (
          <section className="mac-group mt-6 p-5">
            <h2 className="text-lg font-bold">Bilan</h2>
            <ul className="mt-2 space-y-1.5 text-[14.5px] font-medium leading-relaxed">
              {lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6">
          {!loaded ? (
            <p className="text-sm font-semibold text-[var(--fg2)]">Chargement...</p>
          ) : entries.length === 0 ? (
            <p className="text-[14px] font-semibold text-[var(--fg2)]">
              Aucun ressenti pour l&apos;instant. Avant ton prochain appel, ouvre-le dans le{" "}
              <Link href="/admin/calendrier" className="text-[var(--accent2)] hover:underline">
                calendrier
              </Link>{" "}
              et clique sur « Ressenti ».
            </p>
          ) : (
            <ul className="space-y-3">
              {entries.map((e) => (
                <EntryItem
                  key={e.id}
                  e={e}
                  studentName={e.student_id ? names.get(e.student_id) ?? null : null}
                  onSaved={upsert}
                  onDeleted={(id) => setEntries((list) => list.filter((x) => x.id !== id))}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
