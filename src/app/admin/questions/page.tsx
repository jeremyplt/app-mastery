"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { THEMES } from "@/lib/whatsapp/conseils";
import { sortQuestions, type QuestionStatut, type StudentQuestion } from "@/lib/student-questions";

// Les questions qui reviennent chez les élèves, relevées dans les conversations
// WhatsApp. Jeremy coche « C'est fait » quand il a mis quelque chose en place
// (leçon Skool, FAQ, modèle...), avec son lien : les brouillons WhatsApp le
// donnent ensuite quand la question revient. Propriétaire seulement.

const SMALL = "text-[12.5px] font-medium text-[var(--fg2)]";

const STATUT_BADGE: Record<QuestionStatut, { label: string; cls: string }> = {
  a_faire: { label: "À faire", cls: "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]" },
  fait: { label: "Fait", cls: "bg-[color-mix(in_srgb,var(--green)_16%,transparent)] text-[var(--green)]" },
  archive: { label: "Archivée", cls: "bg-[color-mix(in_srgb,var(--fg)_8%,transparent)] text-[var(--fg2)]" },
};

const themeTitre = (key: string | null) => THEMES.find((t) => t.key === key)?.titre ?? null;

const frDay = (iso: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(iso));

function Meta({ q }: { q: StudentQuestion }) {
  const parts = [
    `${q.nb_eleves} élève${q.nb_eleves > 1 ? "s" : ""}`,
    `posée ${q.nb_fois} fois`,
    q.reponses_longues > 0 ? `${q.reponses_longues} réponse${q.reponses_longues > 1 ? "s" : ""} longue${q.reponses_longues > 1 ? "s" : ""} de ta part` : null,
    themeTitre(q.theme),
  ].filter(Boolean);
  return <p className={`mt-1 ${SMALL}`}>{parts.join(" · ")}</p>;
}

function QuestionCard({ q, onChange, onDelete }: { q: StudentQuestion; onChange: (q: StudentQuestion) => void; onDelete: (id: string) => void }) {
  const [form, setForm] = useState<{ note: string; lien: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function patch(fields: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: q.id, ...fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Enregistrement impossible");
      setForm(null);
      onChange(data.question);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/questions?id=${encodeURIComponent(q.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Suppression impossible");
      onDelete(q.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
      setBusy(false);
    }
  }

  const badge = STATUT_BADGE[q.statut];
  const openForm = () => setForm({ note: q.note ?? "", lien: q.lien ?? "" });

  return (
    <article className="mac-group p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[16px] font-bold leading-snug">{q.intitule}</h2>
          <Meta q={q} />
          {q.eleves.length > 0 && <p className={`mt-0.5 ${SMALL}`}>Demandé par {q.eleves.join(", ")}</p>}
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-bold ${badge.cls}`}>{badge.label}</span>
      </div>

      {q.statut === "fait" && (q.note || q.lien) && (
        <div className="mt-3 rounded-lg bg-[color-mix(in_srgb,var(--green)_12%,transparent)] px-3 py-2">
          <p className="text-[13px] font-bold text-[var(--green)]">Ce que tu as mis en place{q.fait_at ? ` (le ${frDay(q.fait_at)})` : ""} :</p>
          {q.note && <p className="mt-1 whitespace-pre-line text-[13.5px] font-semibold">{q.note}</p>}
          {q.lien && (
            <a href={q.lien} target="_blank" rel="noreferrer" className="mt-1 block break-all text-[13.5px] font-bold text-[var(--accent2)] hover:underline">
              {q.lien}
            </a>
          )}
        </div>
      )}

      {q.statut !== "fait" && q.support_titre && (
        <div className="mt-3 rounded-lg bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-3 py-2">
          <p className="text-[13px] font-bold text-[var(--accent2)]">Ce que je te propose de mettre en place{q.support_format ? ` : ${q.support_format}` : ""}</p>
          <p className="mt-1 text-[14px] font-bold">{q.support_titre}</p>
          {q.support_contenu && <p className="mt-0.5 text-[13.5px] font-medium leading-relaxed text-[var(--fg)]">{q.support_contenu}</p>}
        </div>
      )}

      {q.couvert && (
        <p className={`mt-2 ${SMALL}`}>
          {q.couvert === "oui"
            ? "Ta base de conseils y répond déjà : les brouillons WhatsApp suivent ta réponse habituelle."
            : q.couvert === "en partie"
              ? "Ta base de conseils n'y répond qu'en partie."
              : "Ta base de conseils n'y répond pas encore."}
        </p>
      )}

      {(q.exemples.length > 0 || q.reponse) && (
        <details className="mt-2 group">
          <summary className="cursor-pointer text-[13px] font-bold text-[var(--accent2)] hover:underline">Voir ce qu&apos;ils ont demandé et ta réponse habituelle</summary>
          {q.exemples.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {q.exemples.map((e, i) => (
                <li key={i} className="text-[13.5px] font-medium leading-snug">
                  « {e.question} » <span className="text-[var(--fg2)]">{e.name}, {frDay(e.date)}</span>
                </li>
              ))}
            </ul>
          )}
          {q.reponse && (
            <p className="mt-2 text-[13.5px] font-medium leading-relaxed">
              <span className="font-bold">Ta réponse habituelle : </span>
              {q.reponse}
            </p>
          )}
        </details>
      )}

      {form && (
        <div className="mt-3 space-y-2">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Ce que tu as mis en place (facultatif)</span>
            <textarea
              className="mac-field text-[14px]"
              rows={2}
              placeholder="Ex. : leçon Skool « Les formats de vidéos qui font télécharger ton app »"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Lien (facultatif)</span>
            <input className="mac-field" inputMode="url" placeholder="https://www.skool.com/..." value={form.lien} onChange={(e) => setForm({ ...form, lien: e.target.value })} />
          </label>
          <p className={SMALL}>Avec un lien, les brouillons WhatsApp le donneront quand un élève reposera la question.</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {form ? (
          <>
            <button className="mac-btn mac-btn-primary mac-btn-sm" disabled={busy} onClick={() => patch({ statut: "fait", note: form.note, lien: form.lien })}>
              {q.statut === "fait" ? "Enregistrer" : "Enregistrer comme fait"}
            </button>
            <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy} onClick={() => setForm(null)}>
              Annuler
            </button>
          </>
        ) : confirmDelete ? (
          <>
            <span className="text-[13px] font-bold text-[var(--red)]">Supprimer cette question pour de bon ?</span>
            <button className="mac-btn mac-btn-sm !bg-[var(--red)] !text-white" disabled={busy} onClick={remove}>
              Oui, supprimer
            </button>
            <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy} onClick={() => setConfirmDelete(false)}>
              Annuler
            </button>
          </>
        ) : (
          <>
            {q.statut === "a_faire" && (
              <button className="mac-btn mac-btn-primary mac-btn-sm" disabled={busy} onClick={openForm}>
                C&apos;est fait
              </button>
            )}
            {q.statut === "fait" && (
              <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy} onClick={openForm}>
                Modifier
              </button>
            )}
            {q.statut !== "a_faire" && (
              <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy} onClick={() => patch({ statut: "a_faire" })}>
                Remettre à faire
              </button>
            )}
            {q.statut !== "archive" && (
              <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy} onClick={() => patch({ statut: "archive" })}>
                Archiver
              </button>
            )}
            <button className="mac-btn mac-btn-def mac-btn-sm !text-[var(--red)]" disabled={busy} onClick={() => setConfirmDelete(true)}>
              Supprimer
            </button>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-[13px] font-semibold text-[var(--red)]">
          {error}
        </p>
      )}
    </article>
  );
}

const TABS: [QuestionStatut, string][] = [
  ["a_faire", "À faire"],
  ["fait", "Faites"],
  ["archive", "Archivées"],
];

const EMPTY: Record<QuestionStatut, string> = {
  a_faire: "Plus rien à faire : chaque question a sa réponse en place.",
  fait: "Rien de coché pour l'instant. Quand tu mets en place une leçon, une FAQ ou un modèle pour une question, clique sur « C'est fait ».",
  archive: "Aucune question archivée.",
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<QuestionStatut>("a_faire");

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then(async (d) => {
        if (d.role !== "owner") {
          window.location.href = d.admin ? "/admin/crm" : "/membres";
          return;
        }
        const res = await fetch("/api/admin/questions", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Chargement impossible");
        setQuestions(data.questions);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur réseau"))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const c: Record<QuestionStatut, number> = { a_faire: 0, fait: 0, archive: 0 };
    for (const q of questions) c[q.statut]++;
    return c;
  }, [questions]);
  const visible = useMemo(() => sortQuestions(questions.filter((q) => q.statut === tab)), [questions, tab]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-3xl px-5 py-6 sm:py-8">
        <AdminNav current="questions" isOwner />

        <header>
          <h1 className="text-[28px] font-bold tracking-tight">Questions des élèves</h1>
          <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">
            Les questions qui reviennent dans tes conversations WhatsApp, de celle que le plus d&apos;élèves posent à la moins fréquente. Quand tu as mis quelque chose en place pour y répondre une
            fois pour toutes, clique sur « C&apos;est fait » et colle son lien.
          </p>
        </header>

        <div className="mt-5 mac-seg">
          {TABS.map(([t, label]) => (
            <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
              {label} ({counts[t]})
            </button>
          ))}
        </div>

        {loading && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">Chargement...</p>}
        {error && (
          <p role="alert" className="mt-6 text-sm font-semibold text-[var(--red)]">
            {error}
          </p>
        )}
        {!loading && !error && visible.length === 0 && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">{EMPTY[tab]}</p>}

        <div className="mt-4 space-y-3">
          {visible.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              onChange={(n) => setQuestions((l) => l.map((x) => (x.id === n.id ? n : x)))}
              onDelete={(id) => setQuestions((l) => l.filter((x) => x.id !== id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
