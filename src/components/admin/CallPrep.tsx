"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// Préparation d'appel : la fiche que Claude écrit avant un appel avec un élève.
// Deux sortes d'appels : le kick-off (questionnaire, objectifs, points à
// couvrir, prochaines étapes) et le problème à régler (blocage, ce qui a déjà
// été conseillé, trois pistes de solution), chacun avec une checklist de
// clôture. Affichée sur la fiche élève et sur /admin/calendrier. Les fiches
// sont écrites par le job « App Mastery · appels » (toutes les 5 minutes) :
// le bouton les demande.

type ClosingItem = { texte: string; jalon: string | null };
type CallKind = "kickoff" | "probleme";
type Fiche = {
  type: CallKind;
  sujet_probable: string;
  ou_il_en_est: string;
  points: string[];
  cloture: ClosingItem[];
  suspicious_content?: boolean;
  // kick-off
  questionnaire?: string;
  objectifs?: string;
  inquietudes?: string;
  prochaines_etapes?: string[];
  // problème à régler
  blocage?: string;
  deja_conseille?: string;
};
export type CallPrep = {
  id: string;
  event_key: string;
  student_id: string;
  starts_at: string;
  title: string | null;
  statut: "demande" | "en_cours" | "fait" | "erreur";
  fiche: Fiche | null;
  checked: number[] | null;
  error: string | null;
  auto: boolean;
  requested_at: string;
  generated_at: string | null;
};
type Call = {
  key: string;
  student_id: string;
  student_name: string;
  app: string | null;
  starts_at: string;
  title: string;
  join_url: string | null;
  source: "calendly" | "fiche";
  kind: CallKind;
};
type Milestones = { id: string } & Record<string, boolean>;

const JALON_LABELS: Record<string, string> = {
  kickoff: "Kick-off",
  app_published: "App publiée",
  first_sale: "Première vente",
  bilan_done: "Bilan",
  ten_k: "10K",
};

const parisDay = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date(iso));
const hour = (iso: string) => new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date(iso));

function whenLabel(iso: string): string {
  const day = parisDay(iso);
  const today = parisDay(new Date().toISOString());
  const tomorrow = parisDay(new Date(Date.now() + 86_400_000).toISOString());
  if (day === today) return `Aujourd'hui à ${hour(iso)}`;
  if (day === tomorrow) return `Demain à ${hour(iso)}`;
  const d = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" }).format(new Date(iso));
  return `${d.charAt(0).toUpperCase()}${d.slice(1)} à ${hour(iso)}`;
}

function preparedLabel(p: CallPrep): string {
  if (!p.generated_at) return "";
  const d = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date(p.generated_at));
  return `Préparée le ${d}${p.auto ? ", automatiquement le matin" : ""}.`;
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

const KIND_LABELS: Record<CallKind, string> = { kickoff: "Kick-off", probleme: "Problème à régler" };

function KindBadge({ kind }: { kind: CallKind }) {
  return (
    <span
      className={`ml-2 rounded-md px-2 py-0.5 align-middle text-xs font-bold ${
        kind === "kickoff" ? "bg-[color-mix(in_srgb,var(--green)_15%,transparent)] text-[var(--green)]" : "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]"
      }`}
    >
      {KIND_LABELS[kind]}
    </span>
  );
}

function Numbered({ items }: { items: string[] }) {
  return (
    <ol className="mt-1 space-y-2">
      {items.map((p, i) => (
        <li key={i} className="flex gap-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[12px] font-bold text-white">{i + 1}</span>
          <span>{p}</span>
        </li>
      ))}
    </ol>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[12.5px] font-bold uppercase tracking-wide text-[var(--fg2)]">{label}</p>
      <div className="mt-1 text-[14.5px] font-medium leading-relaxed text-[var(--fg)]">{children}</div>
    </div>
  );
}

function PrepBody({
  prep,
  name,
  milestones,
  onToggle,
  onMilestone,
}: {
  prep: CallPrep;
  name: string;
  milestones: Milestones | undefined;
  onToggle: (index: number, done: boolean) => void;
  onMilestone: (jalon: string) => void;
}) {
  const f = prep.fiche;
  if (!f) return null;
  const checked = new Set(prep.checked ?? []);
  const who = firstName(name);
  return (
    <div className="mt-4 space-y-4 rounded-xl bg-[var(--field)] p-4">
      {f.suspicious_content && (
        <p className="text-[13.5px] font-bold text-[var(--orange)]">Un message de la conversation ressemblait à une consigne donnée à l&apos;IA : relis bien la fiche.</p>
      )}
      <p className="text-[15px] font-bold">
        Type d&apos;appel :<KindBadge kind={f.type} />
      </p>
      <Section label={f.type === "kickoff" ? "Objectif du kick-off" : "Problème à régler"}>{f.sujet_probable}</Section>
      <Section label={`Où en est ${who}`}>{f.ou_il_en_est}</Section>
      {f.type === "kickoff" ? (
        <>
          {f.questionnaire && <Section label="Ses réponses au questionnaire">{f.questionnaire}</Section>}
          {f.objectifs && <Section label="Ses objectifs">{f.objectifs}</Section>}
          {f.inquietudes && <Section label="Ce qui l'inquiète">{f.inquietudes}</Section>}
          <Section label="À régler dès le départ">
            <Numbered items={f.points} />
          </Section>
          {(f.prochaines_etapes ?? []).length > 0 && (
            <Section label="Ses prochaines étapes">
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {(f.prochaines_etapes ?? []).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </Section>
          )}
        </>
      ) : (
        <>
          {f.blocage && <Section label="Le blocage">{f.blocage}</Section>}
          {f.deja_conseille && <Section label="Ce que tu lui as déjà conseillé">{f.deja_conseille}</Section>}
          <Section label="Trois pistes de solution">
            <Numbered items={f.points} />
          </Section>
        </>
      )}
      {f.cloture.length > 0 && (
        <Section label="Pour clôturer">
          <ul className="mt-1 space-y-1">
            {f.cloture.map((c, i) => {
              const done = checked.has(i);
              const jalonDone = c.jalon && milestones ? Boolean(milestones[c.jalon]) : false;
              return (
                <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <label className="flex cursor-pointer items-start gap-3 py-1">
                    <input type="checkbox" checked={done} onChange={() => onToggle(i, !done)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--green)]" />
                    <span className={done ? "text-[var(--fg2)] line-through" : ""}>{c.texte}</span>
                  </label>
                  {c.jalon && JALON_LABELS[c.jalon] && milestones && (
                    jalonDone ? (
                      <span className="text-[13px] font-bold text-[var(--green)]">✓ « {JALON_LABELS[c.jalon]} » coché sur la fiche</span>
                    ) : (
                      <button type="button" onClick={() => onMilestone(c.jalon!)} className="mac-btn mac-btn-def mac-btn-sm">
                        Cocher « {JALON_LABELS[c.jalon]} » sur la fiche
                      </button>
                    )
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}
      <p className="text-[12.5px] font-semibold text-[var(--fg2)]">{preparedLabel(prep)}</p>
    </div>
  );
}

function PrepItem({
  call,
  prep,
  studentId,
  name,
  showStudent,
  milestones,
  defaultOpen,
  onRequest,
  onToggle,
  onMilestone,
}: {
  call: Call | null;
  prep: CallPrep | undefined;
  studentId: string;
  name: string;
  showStudent: boolean;
  milestones: Milestones | undefined;
  defaultOpen: boolean;
  onRequest: () => void;
  onToggle: (prep: CallPrep, index: number, done: boolean) => void;
  onMilestone: (studentId: string, jalon: string) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const busy = prep?.statut === "demande" || prep?.statut === "en_cours";
  const hasFiche = Boolean(prep?.fiche);
  return (
    <li className="rounded-xl border-[0.5px] border-[var(--sep)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-bold">
            {call ? whenLabel(call.starts_at) : "Sans rendez-vous précis"}
            {(prep?.fiche?.type ?? call?.kind) && <KindBadge kind={(prep?.fiche?.type ?? call?.kind) as CallKind} />}
            {showStudent && (
              <>
                {" · "}
                <Link href={`/admin/eleves/${studentId}`} className="text-[var(--accent2)] hover:underline">
                  {name}
                </Link>
              </>
            )}
          </p>
          <p className="text-[13px] font-semibold text-[var(--fg2)]">
            {call ? call.title : "Fiche préparée à la demande"}
            {showStudent && call?.app ? `, ${call.app}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasFiche && (
            <button type="button" onClick={() => setOpen(!open)} className="mac-btn mac-btn-def mac-btn-sm">
              {open ? "Masquer la fiche" : "Voir la fiche"}
            </button>
          )}
          {busy ? (
            <span className="text-[13px] font-bold text-[var(--accent2)]">Préparation en cours...</span>
          ) : (
            <button
              type="button"
              onClick={() => {
                onRequest();
                setOpen(true);
              }}
              className={`mac-btn mac-btn-sm ${hasFiche ? "mac-btn-def" : "mac-btn-primary"}`}
            >
              {hasFiche ? "Régénérer" : prep?.statut === "erreur" ? "Réessayer" : "Préparer l'appel"}
            </button>
          )}
        </div>
      </div>
      {busy && <p className="mt-2 text-[13px] font-medium text-[var(--fg2)]">La fiche sera prête dans quelques minutes, tu peux rester sur la page ou revenir plus tard.</p>}
      {prep?.statut === "erreur" && <p className="mt-2 text-[13px] font-semibold text-[var(--red)]">La fiche n&apos;a pas pu être préparée : {prep.error ?? "erreur inconnue"}.</p>}
      {open && prep && (
        <PrepBody
          prep={prep}
          name={name}
          milestones={milestones}
          onToggle={(i, done) => onToggle(prep, i, done)}
          onMilestone={(jalon) => onMilestone(studentId, jalon)}
        />
      )}
    </li>
  );
}

// studentId : fiche élève (ses appels des 30 prochains jours). Sans : tous les
// appels élèves des 14 prochains jours (/admin/calendrier).
export default function CallPrepPanel({ studentId, studentName, onMilestone }: { studentId?: string; studentName?: string; onMilestone?: (jalon: string) => void }) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [preps, setPreps] = useState<CallPrep[]>([]);
  const [milestones, setMilestones] = useState<Milestones[]>([]);
  const [calendly, setCalendly] = useState<string>("ok");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await fetch(`/api/admin/appels${studentId ? `?student_id=${studentId}` : ""}`).then((r) => r.json());
      if (d.error) throw new Error(d.error);
      setCalls(d.calls ?? []);
      setPreps(d.preps ?? []);
      setMilestones(d.milestones ?? []);
      setCalendly(d.calendly ?? "ok");
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chargement impossible");
    } finally {
      setLoaded(true);
    }
  }, [studentId]);

  useEffect(() => {
    load();
  }, [load]);

  // Une fiche en préparation : on regarde toutes les 15 secondes si elle est prête.
  const pending = preps.some((p) => p.statut === "demande" || p.statut === "en_cours");
  useEffect(() => {
    if (!pending) return;
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, [pending, load]);

  async function request(sid: string, call: Call | null) {
    const d = await fetch("/api/admin/appels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "preparer", student_id: sid, event_key: call?.key, starts_at: call?.starts_at, title: call?.title }),
    }).then((r) => r.json());
    if (d.error) return setError(d.error);
    setPreps((list) => [d.prep as CallPrep, ...list.filter((p) => p.event_key !== d.prep.event_key)]);
  }

  async function toggle(prep: CallPrep, index: number, done: boolean) {
    const next = done ? [...(prep.checked ?? []), index] : (prep.checked ?? []).filter((i) => i !== index);
    setPreps((list) => list.map((p) => (p.id === prep.id ? { ...p, checked: next } : p)));
    const d = await fetch("/api/admin/appels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cocher", id: prep.id, index, done }),
    }).then((r) => r.json());
    if (d.error) setError(d.error);
  }

  async function markMilestone(sid: string, jalon: string) {
    setMilestones((list) => list.map((m) => (m.id === sid ? { ...m, [jalon]: true } : m)));
    const d = await fetch("/api/admin/eleves", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sid, [jalon]: true }),
    }).then((r) => r.json());
    if (d.error) return setError(d.error);
    onMilestone?.(jalon);
  }

  const byKey = new Map(preps.map((p) => [p.event_key, p]));
  const manual = studentId ? preps.find((p) => p.event_key === `manuel:${studentId}`) : undefined;
  const msOf = (sid: string) => milestones.find((m) => m.id === sid);
  const today = parisDay(new Date().toISOString());

  if (!loaded) return <p className="text-sm font-semibold text-[var(--fg2)]">Chargement des appels...</p>;

  return (
    <div>
      {error && <p className="mb-3 text-[13.5px] font-semibold text-[var(--red)]">Erreur : {error}</p>}
      {calendly !== "ok" && (
        <p className="mb-3 text-[13px] font-semibold text-[var(--orange)]">
          {calendly === "absent" ? "Agenda Calendly non relié sur le site : seuls les créneaux notés sur les fiches s'affichent." : "Calendly ne répond pas pour l'instant : seuls les créneaux notés sur les fiches s'affichent."}
        </p>
      )}
      {calls.length === 0 && !manual && (
        <p className="text-[14px] font-semibold text-[var(--fg2)]">{studentId ? "Aucun appel réservé avec cet élève pour l'instant." : "Aucun appel avec un élève dans les 14 prochains jours."}</p>
      )}
      <ul className="space-y-3">
        {calls.map((c) => (
          <PrepItem
            key={c.key}
            call={c}
            prep={byKey.get(c.key)}
            studentId={c.student_id}
            name={c.student_name}
            showStudent={!studentId}
            milestones={msOf(c.student_id)}
            defaultOpen={parisDay(c.starts_at) === today || Boolean(studentId)}
            onRequest={() => request(c.student_id, c)}
            onToggle={toggle}
            onMilestone={markMilestone}
          />
        ))}
        {studentId && manual && (
          <PrepItem
            call={null}
            prep={manual}
            studentId={studentId}
            name={studentName ?? ""}
            showStudent={false}
            milestones={msOf(studentId)}
            defaultOpen={calls.length === 0}
            onRequest={() => request(studentId, null)}
            onToggle={toggle}
            onMilestone={markMilestone}
          />
        )}
      </ul>
      {studentId && calls.length === 0 && !manual && (
        <button type="button" onClick={() => request(studentId, null)} className="mac-btn mac-btn-primary mac-btn-sm mt-3">
          Préparer l&apos;appel quand même
        </button>
      )}
    </div>
  );
}
