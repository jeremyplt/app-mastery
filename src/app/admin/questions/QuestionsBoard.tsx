"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { THEMES } from "@/lib/whatsapp/conseils";
import { sortQuestions, type QuestionStatut, type StudentQuestion } from "@/lib/student-questions";

// Deux pages partagent ce tableau, sur la table student_questions :
// - « Questions des élèves » (/admin/questions) : les questions qui reviennent
//   dans les conversations WhatsApp ;
// - « Vidéos Skool à tourner » (/admin/videos-skool) : les grandes leçons à
//   tourner, chacune sur un sujet entier comme la vidéo sur l'onboarding.
// Jeremy coche « C'est fait » quand il a mis quelque chose en place (leçon
// Skool, FAQ, modèle...), avec son lien : les brouillons WhatsApp le donnent
// ensuite quand le sujet revient. Propriétaire seulement.

export type BoardMode = "questions" | "videos";

const SMALL = "text-[12.5px] font-medium text-[var(--fg2)]";

const BADGE_CLS: Record<QuestionStatut, string> = {
  a_faire: "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]",
  fait: "bg-[color-mix(in_srgb,var(--green)_16%,transparent)] text-[var(--green)]",
  archive: "bg-[color-mix(in_srgb,var(--fg)_8%,transparent)] text-[var(--fg2)]",
};

const themeTitre = (key: string | null) => THEMES.find((t) => t.key === key)?.titre ?? null;

const frDay = (iso: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(iso));

// Une grande vidéo Skool à tourner : elle a sa page, à part des questions.
const isVideo = (q: StudentQuestion) => q.support_format === "grande vidéo Skool";

// « notions » : une notion que les élèves ont du mal à saisir, relevée dans les
// conversations WhatsApp et les audits, pas une question posée telle quelle.
// « jeremy » : une vidéo que Jeremy a lui-même eu l'idée de tourner.
const isNotion = (q: StudentQuestion) => q.source !== "rapport";
const fromJeremy = (q: StudentQuestion) => q.source === "jeremy";

// Labels propres à chaque page.
const COPY: Record<
  BoardMode,
  {
    title: string;
    intro: string;
    badge: Record<QuestionStatut, string>;
    tabs: Record<QuestionStatut, string>;
    empty: Record<QuestionStatut, string>;
    deleteAsk: string;
    placeholder: string;
  }
> = {
  questions: {
    title: "Questions des élèves",
    intro:
      "Les questions qui reviennent dans tes conversations WhatsApp, de celle que le plus d'élèves posent à la moins fréquente. Quand tu as mis quelque chose en place pour y répondre une fois pour toutes, clique sur « C'est fait » et colle son lien. Les grandes vidéos à tourner sont dans « Vidéos Skool à tourner ».",
    badge: { a_faire: "À faire", fait: "Fait", archive: "Archivée" },
    tabs: { a_faire: "À faire", fait: "Faites", archive: "Archivées" },
    empty: {
      a_faire: "Plus rien à faire : chaque question a sa réponse en place.",
      fait: "Rien de coché pour l'instant. Quand tu mets en place une leçon, une FAQ ou un modèle pour une question, clique sur « C'est fait ».",
      archive: "Aucune question archivée.",
    },
    deleteAsk: "Supprimer cette question pour de bon ?",
    placeholder: "Ex. : leçon Skool « Les formats de vidéos qui font télécharger ton app »",
  },
  videos: {
    title: "Vidéos Skool à tourner",
    intro:
      "Les grandes leçons à tourner pour le Skool, chacune sur un sujet entier comme ta vidéo sur l'onboarding. Elles viennent de ce que tes élèves ont du mal à saisir dans vos conversations et dans tes audits, et de tes propres idées. Quand une vidéo est en ligne, clique sur « C'est fait » et colle son lien.",
    badge: { a_faire: "À tourner", fait: "En ligne", archive: "Archivée" },
    tabs: { a_faire: "À tourner", fait: "En ligne", archive: "Archivées" },
    empty: {
      a_faire: "Plus aucune vidéo à tourner pour l'instant.",
      fait: "Aucune vidéo en ligne pour l'instant. Quand une vidéo est sur le Skool, clique sur « C'est fait » et colle son lien.",
      archive: "Aucune vidéo archivée.",
    },
    deleteAsk: "Retirer cette vidéo de la liste pour de bon ?",
    placeholder: "Ex. : leçon « Comment faire un onboarding parfait » dans l'Étape 4",
  },
};

function Meta({ q }: { q: StudentQuestion }) {
  const parts = [
    fromJeremy(q) ? "ton idée" : null,
    q.nb_eleves > 0 || !fromJeremy(q) ? `${q.nb_eleves} élève${q.nb_eleves > 1 ? "s" : ""}` : null,
    fromJeremy(q) ? null : isNotion(q) ? "notion qui coince, relevée dans tes conversations et tes audits" : `posée ${q.nb_fois} fois`,
    q.reponses_longues > 0 ? `${q.reponses_longues} réponse${q.reponses_longues > 1 ? "s" : ""} longue${q.reponses_longues > 1 ? "s" : ""} de ta part` : null,
    themeTitre(q.theme),
  ].filter(Boolean);
  return <p className={`mt-1 ${SMALL}`}>{parts.join(" · ")}</p>;
}

function QuestionCard({
  q,
  mode,
  onChange,
  onDelete,
}: {
  q: StudentQuestion;
  mode: BoardMode;
  onChange: (q: StudentQuestion) => void;
  onDelete: (id: string) => void;
}) {
  const copy = COPY[mode];
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

  const badge = { label: copy.badge[q.statut], cls: BADGE_CLS[q.statut] };
  const openForm = () => setForm({ note: q.note ?? "", lien: q.lien ?? "" });

  return (
    <article className="mac-group p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[16px] font-bold leading-snug">{q.intitule}</h2>
          <Meta q={q} />
          {q.eleves.length > 0 && <p className={`mt-0.5 ${SMALL}`}>{isNotion(q) ? "Vu chez" : "Demandé par"} {q.eleves.join(", ")}</p>}
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
          <p className="text-[13px] font-bold text-[var(--accent2)]">
            {isVideo(q) ? "Le plan que je te propose" : `Ce que je te propose de mettre en place${q.support_format ? ` : ${q.support_format}` : ""}`}
          </p>
          <p className="mt-1 text-[14px] font-bold">{q.support_titre}</p>
          {q.support_contenu && <p className="mt-0.5 whitespace-pre-line text-[13.5px] font-medium leading-relaxed text-[var(--fg)]">{q.support_contenu}</p>}
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
          <summary className="cursor-pointer text-[13px] font-bold text-[var(--accent2)] hover:underline">
            {fromJeremy(q)
              ? "Voir ce qui montre le besoin et ton idée"
              : isNotion(q)
                ? "Voir ce qui coince et comment tu l'expliques"
                : "Voir ce qu'ils ont demandé et ta réponse habituelle"}
          </summary>
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
              <span className="font-bold">{fromJeremy(q) ? "Ton idée : " : isNotion(q) ? "Comment tu l'expliques : " : "Ta réponse habituelle : "}</span>
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
              placeholder={copy.placeholder}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Lien (facultatif)</span>
            <input className="mac-field" inputMode="url" placeholder="https://www.skool.com/..." value={form.lien} onChange={(e) => setForm({ ...form, lien: e.target.value })} />
          </label>
          <p className={SMALL}>Avec un lien, les brouillons WhatsApp le donneront quand le sujet reviendra chez un élève.</p>
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
            <span className="text-[13px] font-bold text-[var(--red)]">{copy.deleteAsk}</span>
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

const TABS: QuestionStatut[] = ["a_faire", "fait", "archive"];

// Les vidéos que Jeremy a eu l'idée de tourner passent devant, puis le tri
// habituel : plus d'élèves concernés d'abord.
function sortForMode(list: StudentQuestion[], mode: BoardMode): StudentQuestion[] {
  const sorted = sortQuestions(list);
  if (mode === "questions") return sorted;
  return [...sorted.filter(fromJeremy), ...sorted.filter((q) => !fromJeremy(q))];
}

export default function QuestionsBoard({ mode }: { mode: BoardMode }) {
  const copy = COPY[mode];
  const [all, setQuestions] = useState<StudentQuestion[]>([]);
  const questions = useMemo(() => all.filter((q) => isVideo(q) === (mode === "videos")), [all, mode]);
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
  const visible = useMemo(() => sortForMode(questions.filter((q) => q.statut === tab), mode), [questions, tab, mode]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-3xl px-5 py-6 sm:py-8">
        <AdminNav current={mode === "videos" ? "videos-skool" : "questions"} isOwner />

        <header>
          <h1 className="text-[28px] font-bold tracking-tight">{copy.title}</h1>
          <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">{copy.intro}</p>
        </header>

        <div className="mt-5 mac-seg">
          {TABS.map((t) => (
            <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
              {copy.tabs[t]} ({counts[t]})
            </button>
          ))}
        </div>

        {loading && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">Chargement...</p>}
        {error && (
          <p role="alert" className="mt-6 text-sm font-semibold text-[var(--red)]">
            {error}
          </p>
        )}
        {!loading && !error && visible.length === 0 && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">{copy.empty[tab]}</p>}

        <div className="mt-4 space-y-3">
          {visible.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              mode={mode}
              onChange={(n) => setQuestions((l) => l.map((x) => (x.id === n.id ? n : x)))}
              onDelete={(id) => setQuestions((l) => l.filter((x) => x.id !== id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
