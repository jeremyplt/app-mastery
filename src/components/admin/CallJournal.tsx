"use client";

import { useState } from "react";
import { CRAINTE_LABELS, PAROLE_LABELS, previousLine, type Crainte, type Half, type JournalEntry, type Parole } from "@/lib/appels/journal";

// Ressenti d'un appel avec un élève : avant (30 secondes), ce que tu crains
// et comment tu penses que ça va se passer ; après (1 à 2 minutes), comment
// ça s'est vraiment passé. Tout est facultatif. Utilisé sur la carte de
// l'appel (calendrier, fiche élève) et sur /admin/ressentis.

export type JournalDraft = {
  apprehension: number | null;
  inquietude: string;
  prevision: number | null;
  deroulement: number | null;
  duree_min: string;
  parole: Parole | null;
  crainte: Crainte | null;
  pourquoi: string;
};

export type JournalSave = { avant: Record<string, unknown>; apres: Record<string, unknown> };

export function draftOf(e: JournalEntry | null | undefined): JournalDraft {
  return {
    apprehension: e?.apprehension ?? null,
    inquietude: e?.inquietude ?? "",
    prevision: e?.prevision ?? null,
    deroulement: e?.deroulement ?? null,
    duree_min: e?.duree_min ? String(e.duree_min) : "",
    parole: e?.parole ?? null,
    crainte: e?.crainte ?? null,
    pourquoi: e?.pourquoi ?? "",
  };
}

export function saveOf(d: JournalDraft): JournalSave {
  return {
    avant: { apprehension: d.apprehension, inquietude: d.inquietude, prevision: d.prevision },
    apres: { deroulement: d.deroulement, duree_min: d.duree_min, parole: d.parole, crainte: d.crainte, pourquoi: d.pourquoi },
  };
}

// Avant pour un appel à venir, après pour un appel commencé.
export function defaultHalf(callAt: string): Half {
  return Date.parse(callAt) > Date.now() ? "avant" : "apres";
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <p className="text-[13.5px] font-bold text-[var(--fg)]">
      {children}
      {hint && <span className="ml-2 text-[12px] font-semibold text-[var(--fg3)]">{hint}</span>}
    </p>
  );
}

// Boutons à toucher : un clic choisit, un second clic sur la même valeur l'efface.
function Choices<T extends string | number>({ options, value, onChange, labels }: { options: T[]; value: T | null; onChange: (v: T | null) => void; labels?: Record<string, string> }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = value === o;
        return (
          <button
            key={String(o)}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? null : o)}
            className={`min-h-10 min-w-10 rounded-[9px] border-[0.5px] px-3 text-[14px] font-bold transition-colors ${
              on ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]" : "border-[var(--field-brd)] bg-[var(--group)] text-[var(--fg)] hover:border-[var(--accent)]"
            }`}
          >
            {labels?.[String(o)] ?? o}
          </button>
        );
      })}
    </div>
  );
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

// Ce que tu avais noté avant, rappelé en haut de l'après : c'est la comparaison
// qui compte.
function AvantRecap({ d }: { d: JournalDraft }) {
  const bits: string[] = [];
  if (d.apprehension !== null) bits.push(`appréhension ${d.apprehension}/10`);
  if (d.prevision !== null) bits.push(`tu prévoyais ${d.prevision}/5`);
  if (!bits.length && !d.inquietude.trim()) return null;
  return (
    <div className="rounded-[10px] border-[0.5px] border-[var(--sep)] px-3 py-2 text-[13px] font-medium text-[var(--fg2)]">
      <span className="font-bold">Avant : </span>
      {bits.join(", ")}
      {d.inquietude.trim() && (
        <>
          {bits.length ? ". " : ""}
          Ta crainte : « {d.inquietude.trim()} »
        </>
      )}
    </div>
  );
}

export function JournalForm({
  initial,
  half: startHalf,
  onSave,
  onCancel,
  saveLabel = "Enregistrer",
}: {
  initial: JournalDraft;
  half: Half;
  onSave: (save: JournalSave) => Promise<boolean>;
  onCancel?: () => void;
  saveLabel?: string;
}) {
  const [d, setD] = useState<JournalDraft>(initial);
  const [half, setHalf] = useState<Half>(startHalf);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const set = <K extends keyof JournalDraft>(k: K, v: JournalDraft[K]) => {
    setD((cur) => ({ ...cur, [k]: v }));
    setSaved(false);
  };

  async function save() {
    setSaving(true);
    const ok = await onSave(saveOf(d));
    setSaving(false);
    setSaved(ok);
  }

  return (
    <div className="space-y-4 rounded-xl bg-[var(--field)] p-4">
      <div className="mac-seg" role="tablist">
        {(["avant", "apres"] as Half[]).map((h) => (
          <button
            key={h}
            type="button"
            role="tab"
            aria-selected={half === h}
            onClick={() => setHalf(h)}
            className={half === h ? "bg-[var(--group)] !text-[var(--fg)] shadow-[0_0.5px_1.5px_rgba(0,0,0,0.18)]" : ""}
          >
            {h === "avant" ? "Avant l'appel" : "Après l'appel"}
          </button>
        ))}
      </div>

      {half === "avant" ? (
        <>
          <div>
            <Label hint="0 aucune, 10 très forte">Appréhension</Label>
            <Choices options={range(0, 10)} value={d.apprehension} onChange={(v) => set("apprehension", v)} />
          </div>
          <div>
            <Label>Ce qui m&apos;inquiète</Label>
            <textarea className="mac-field mt-1.5 !bg-[var(--group)]" rows={2} value={d.inquietude} onChange={(e) => set("inquietude", e.target.value)} placeholder="En une phrase" />
          </div>
          <div>
            <Label hint="1 mal, 5 très bien">Comment je pense que ça va se passer</Label>
            <Choices options={range(1, 5)} value={d.prevision} onChange={(v) => set("prevision", v)} />
          </div>
        </>
      ) : (
        <>
          <AvantRecap d={d} />
          <div>
            <Label hint="1 mal, 5 très bien">Comment ça s&apos;est passé</Label>
            <Choices options={range(1, 5)} value={d.deroulement} onChange={(v) => set("deroulement", v)} />
          </div>
          <div>
            <Label hint="facultatif">Durée réelle en minutes</Label>
            <input
              className="mac-field mt-1.5 !w-32 !bg-[var(--group)]"
              inputMode="numeric"
              value={d.duree_min}
              onChange={(e) => set("duree_min", e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
              placeholder="60"
            />
          </div>
          <div>
            <Label>Qui a le plus parlé ?</Label>
            <Choices options={["moi", "equilibre", "eleve"] as Parole[]} value={d.parole} onChange={(v) => set("parole", v)} labels={PAROLE_LABELS} />
          </div>
          <div>
            <Label>Ma crainte s&apos;est-elle réalisée ?</Label>
            <Choices options={["oui", "en_partie", "non"] as Crainte[]} value={d.crainte} onChange={(v) => set("crainte", v)} labels={CRAINTE_LABELS} />
          </div>
          <div>
            <Label>Pourquoi je me suis senti bien ou mal</Label>
            <textarea className="mac-field mt-1.5 !bg-[var(--group)]" rows={3} value={d.pourquoi} onChange={(e) => set("pourquoi", e.target.value)} />
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={save} disabled={saving} className="mac-btn mac-btn-primary mac-btn-sm">
          {saving ? "Enregistrement..." : saveLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="mac-btn mac-btn-def mac-btn-sm">
            Fermer
          </button>
        )}
        {saved && <span className="text-[13px] font-bold text-[var(--green)]">✓ Enregistré</span>}
      </div>
    </div>
  );
}

// Où en est le ressenti d'un appel, en quelques mots.
export function journalStatus(e: JournalEntry | null | undefined): string {
  if (!e) return "";
  if (e.avant_at && e.apres_at) return "Avant et après notés";
  if (e.avant_at) return "Avant noté";
  if (e.apres_at) return "Après noté";
  return "";
}

// Bloc « Ressenti » de la carte d'un appel : la ligne du dernier appel avec
// l'élève, et le formulaire à déplier.
export function CallJournalBlock({
  callAt,
  entry,
  previous,
  open,
  onClose,
  onSave,
}: {
  callAt: string;
  entry: JournalEntry | undefined;
  previous: JournalEntry | null;
  open: boolean;
  onClose: () => void;
  onSave: (save: JournalSave) => Promise<boolean>;
}) {
  const line = previous ? previousLine(previous) : null;
  const status = journalStatus(entry);
  return (
    <>
      {(line || status) && (
        <p className="mt-2 text-[13px] font-semibold text-[var(--fg2)]">
          {line}
          {line && status ? " " : ""}
          {status && <span className="text-[var(--accent2)]">Ressenti : {status.toLowerCase()}.</span>}
        </p>
      )}
      {open && (
        <div className="mt-3">
          <JournalForm initial={draftOf(entry)} half={defaultHalf(callAt)} onSave={onSave} onCancel={onClose} />
        </div>
      )}
    </>
  );
}
