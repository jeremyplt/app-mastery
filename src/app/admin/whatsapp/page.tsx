"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { awaitingReply, recentWindow } from "@/lib/whatsapp/messages";
import { sendWindowEnd } from "@/lib/whatsapp/send";

// WhatsApp pro : résumés, brouillons et vocaux transcrits, préparés toutes les
// 5 minutes par le job WhatsApp de Harness Maxxing. Rien n'est envoyé d'ici :
// Jeremy répond lui-même dans WhatsApp Web. Propriétaire seulement.
// L'onglet « Base de conseils » sert à relire et valider, thème par thème, les
// conseils tirés de ses anciennes réponses : seuls les thèmes validés servent
// aux brouillons.

type Thread = {
  contact: string;
  contact_name: string | null;
  student_id: string | null;
  student: { id: string; name: string; app: string | null } | null;
  last_inbound_at: string | null;
  last_outbound_at: string | null;
  last_live_inbound_at?: string | null; // dernier vrai message reçu (pas l'historique importé) : ouvre la fenêtre d'envoi
  progress?: Progress | null;
  summary: string | null;
  points: string[] | null;
  draft: string | null;
  needs_reply: boolean | null;
  suspicious: boolean;
  summarized_at: string | null;
  summarized_through: string | null;
  handled_at: string | null;
  error: string | null;
};
type StepStatut = "fait" | "en_cours" | "a_venir" | "erreur";
type Step = { cle: string; label: string; statut: StepStatut; detail?: string };
type Progress = {
  redaction?: { statut: "en_cours" | "fait"; maj: string };
  contenus?: { etapes: Step[]; maj: string; lien?: string | null; nb?: number };
};
type Message = { id: string; direction: "inbound" | "outbound"; type: string; body: string | null; transcript: string | null; transcript_error: string | null; sent_at: string };
type StudentOption = { id: string; name: string; phone: string | null };
type Conseil = {
  theme: string;
  titre: string;
  contenu: string;
  a_verifier: string[];
  sources: number;
  statut: "a_relire" | "valide";
  validated_at: string | null;
  updated_at: string;
};
type Tab = "todo" | "all" | "conseils";

const SMALL = "text-[12.5px] font-medium text-[var(--fg2)]";

function ago(iso: string | null): string {
  if (!iso) return "";
  const min = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "hier" : `il y a ${d} jours`;
}


const nameOf = (t: Thread) => t.student?.name ?? t.contact_name ?? `+${t.contact}`;
const isPhone = (contact: string) => /^\d{8,15}$/.test(contact);

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

const hourOf = (iso: string) => new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const dayOf = (iso: string) => new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long" }).format(new Date(iso));

// Une bulle, comme dans WhatsApp : l'élève à gauche, toi à droite en vert.
function Bubble({ m }: { m: Message }) {
  const mine = m.direction === "outbound";
  const label: Record<string, string> = {
    image: "Photo",
    video: "Vidéo",
    document: "Document",
    sticker: "Autocollant",
    reaction: "Réaction",
    edit: "Message modifié",
    media_placeholder: "Pièce jointe (historique, non récupérée)",
    errors: "Message illisible",
  };
  return (
    <li className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-[14px] px-3 py-1.5 text-[14.5px] leading-snug shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] ${
          mine ? "rounded-tr-[4px] bg-[var(--wa-out)]" : "rounded-tl-[4px] bg-[var(--wa-in)]"
        }`}
      >
        {m.type === "audio" ? (
          <>
            <span className="block text-[12px] font-bold text-[var(--fg2)]">🎙️ Vocal transcrit</span>
            <span className="whitespace-pre-wrap">{m.transcript ?? (m.transcript_error ? `Transcription impossible : ${m.transcript_error}` : "Transcription en cours…")}</span>
          </>
        ) : (
          <>
            {label[m.type] && <span className="block text-[12px] font-bold text-[var(--fg2)]">{label[m.type]}</span>}
            <span className="whitespace-pre-wrap break-words">{m.body ?? (label[m.type] ? "" : `(${m.type})`)}</span>
          </>
        )}
        <span className="float-right ml-3 mt-1.5 text-[11px] font-medium text-[var(--fg2)]">{hourOf(m.sent_at)}</span>
      </div>
    </li>
  );
}

// Où en est la réponse : message reçu, vocal transcrit, brouillon écrit par
// l'IA (toutes les 5 minutes), et pour les contenus d'inspiration : recherche
// TikTok, vérification des vidéos, ajout à la GIGA BANQUE, brouillon refait.
function preparationSteps(t: Thread, fresh: boolean, messages: Message[] | null, now: number): Step[] {
  const since = [t.last_outbound_at, t.handled_at].filter(Boolean).sort().at(-1) ?? null;
  const fresh_ = (m: Message) => m.direction === "inbound" && (!since || Date.parse(m.sent_at) > Date.parse(since));
  const steps: Step[] = [{ cle: "recu", label: "Message reçu", statut: "fait", detail: t.last_inbound_at ? ago(t.last_inbound_at) : undefined }];
  const vocal = (messages ?? []).filter((m) => fresh_(m) && m.type === "audio");
  if (vocal.length) {
    const pending = vocal.some((m) => !m.transcript && !m.transcript_error);
    steps.push({ cle: "vocal", label: pending ? "Transcription du vocal" : "Vocal transcrit", statut: pending ? "en_cours" : "fait" });
  }
  const quiet = t.last_inbound_at ? now - Date.parse(t.last_inbound_at) < 4 * 60_000 : false;
  if (!fresh && quiet) steps.push({ cle: "attente", label: "J'attends que l'élève ait fini d'écrire", statut: "en_cours", detail: "4 minutes sans nouveau message" });
  const writing = t.progress?.redaction?.statut === "en_cours" && now - Date.parse(t.progress.redaction.maj) < 10 * 60_000;
  steps.push({
    cle: "redaction",
    label: "Rédaction du brouillon",
    statut: fresh ? "fait" : writing ? "en_cours" : "a_venir",
    detail: fresh ? undefined : writing ? "l'IA lit la conversation et ta base de conseils" : "au prochain passage, toutes les 5 minutes",
  });
  const c = t.progress?.contenus;
  if (c) {
    steps.push(...c.etapes);
    const done = c.etapes.every((e) => e.statut === "fait");
    if (done) steps.push({ cle: "refait", label: "Brouillon refait avec le lien du Drive", statut: fresh ? "fait" : writing ? "en_cours" : "a_venir" });
  }
  return steps;
}

function Preparation({ steps, lien }: { steps: Step[]; lien?: string | null }) {
  const icon: Record<StepStatut, string> = { fait: "✓", en_cours: "", a_venir: "○", erreur: "!" };
  const tone: Record<StepStatut, string> = {
    fait: "text-[var(--green)]",
    en_cours: "text-[var(--accent2)]",
    a_venir: "text-[var(--fg3)]",
    erreur: "text-[var(--red)]",
  };
  return (
    <div className="rounded-lg bg-[var(--field)] px-3 py-2.5" aria-live="polite">
      <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--fg2)]">Préparation de la réponse</p>
      <ol className="mt-1.5 space-y-1">
        {steps.map((s) => (
          <li key={s.cle} className={`flex items-start gap-2 text-[13.5px] font-semibold ${s.statut === "a_venir" ? "text-[var(--fg2)]" : "text-[var(--fg)]"}`}>
            <span className={`mt-[1px] grid h-4 w-4 shrink-0 place-items-center text-[12px] font-bold ${tone[s.statut]}`} aria-hidden>
              {s.statut === "en_cours" ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" /> : icon[s.statut]}
            </span>
            <span>
              {s.label}
              {s.detail && <span className="font-medium text-[var(--fg2)]"> · {s.detail}</span>}
              <span className="sr-only"> ({s.statut === "fait" ? "terminé" : s.statut === "en_cours" ? "en cours" : s.statut === "erreur" ? "erreur" : "à venir"})</span>
            </span>
          </li>
        ))}
      </ol>
      {lien && (
        <a href={lien} target="_blank" rel="noreferrer" className="mt-1.5 inline-block text-[13px] font-bold text-[var(--accent2)] hover:underline">
          Voir la section dans la GIGA BANQUE
        </a>
      )}
    </div>
  );
}

// Une conversation, présentée comme dans WhatsApp : les derniers messages en
// haut, la réponse à envoyer en bas, déjà remplie avec le brouillon de l'IA.
function ThreadCard({ t, students, onChange }: { t: Thread; students: StudentOption[]; onChange: () => Promise<void> }) {
  const waiting = awaitingReply(t);
  const fresh = Boolean(t.summarized_through && t.last_inbound_at && Date.parse(t.summarized_through) >= Date.parse(t.last_inbound_at));
  const [draft, setDraft] = useState(t.draft ?? "");
  const [edited, setEdited] = useState(false);
  const [open, setOpen] = useState(waiting);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const windowEnd = sendWindowEnd(t.last_live_inbound_at ?? null, new Date());
  const canSend = isPhone(t.contact) && windowEnd !== null;

  // Un nouveau brouillon remplace le texte, sauf si tu as commencé à l'écrire.
  useEffect(() => {
    if (!edited) setDraft(t.draft ?? "");
  }, [t.draft, edited]);

  // Le champ grandit avec le texte, comme dans WhatsApp.
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [draft, open]);

  useEffect(() => {
    if (!open || messages) return;
    let cancelled = false;
    fetch(`/api/admin/whatsapp?contact=${encodeURIComponent(t.contact)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Chargement impossible");
        if (!cancelled) setMessages(data.messages);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Erreur réseau"));
    return () => {
      cancelled = true;
    };
  }, [open, messages, t.contact]);

  // On arrive en bas de la conversation, sur les derniers messages.
  useEffect(() => {
    const el = scroller.current;
    if (el && messages && !showAll) el.scrollTop = el.scrollHeight;
  }, [messages, showAll]);

  async function act(action: string, extra: Record<string, unknown> = {}) {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/admin/whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contact: t.contact, action, ...extra }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Action impossible");
      if (action === "envoyer" && data.message) {
        setMessages((l) => [...(l ?? []), data.message]);
        setDraft("");
        setEdited(true);
        setSent(true);
        setTimeout(() => onChange().catch(() => undefined), 2500);
        return;
      }
      await onChange();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(null);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copie impossible : sélectionne le texte à la main.");
    }
  }

  const since = [t.last_outbound_at, t.handled_at].filter(Boolean).sort().at(-1) ?? null;
  const win = messages ? recentWindow(messages, since) : null;
  const from = !win || showAll ? 0 : win.start;
  const shown = messages ? messages.slice(from) : [];
  const name = nameOf(t);
  const steps = preparationSteps(t, fresh, messages, Date.now());
  const contenusEnCours = Boolean(t.progress?.contenus && !t.progress.contenus.etapes.every((e) => e.statut === "fait"));
  const showSteps = waiting && (!fresh || contenusEnCours || steps.some((s) => s.statut !== "fait"));

  return (
    <article className="mac-group overflow-hidden !p-0">
      {/* En-tête, comme celui d'une discussion WhatsApp */}
      <header className="flex items-center gap-3 border-b-[0.5px] border-[var(--sep)] px-4 py-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--wa-head)] text-[14px] font-bold text-white" aria-hidden>
          {initials(name)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[16px] font-bold">
            {t.student ? (
              <Link href={`/admin/eleves/${t.student.id}`} className="hover:underline">
                {t.student.name}
              </Link>
            ) : (
              name
            )}
          </h2>
          <p className={`truncate ${SMALL}`}>
            {isPhone(t.contact) ? `+${t.contact}` : "Numéro masqué par WhatsApp"}
            {t.student?.app ? ` · ${t.student.app}` : ""}
            {t.last_inbound_at ? ` · reçu ${ago(t.last_inbound_at)}` : ""}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-bold ${
            waiting ? "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]" : "bg-[var(--field)] text-[var(--fg2)]"
          }`}
        >
          {waiting ? "À répondre" : t.handled_at && (!t.last_outbound_at || t.handled_at > t.last_outbound_at) ? "Traité" : "Répondu"}
        </span>
      </header>

      {/* Résumé de l'IA, court, au-dessus de la conversation */}
      {(t.summary || t.suspicious || showSteps || (waiting && t.error && fresh)) && (
        <div className="space-y-2 border-b-[0.5px] border-[var(--sep)] px-4 py-3">
          {showSteps && <Preparation steps={steps} lien={t.progress?.contenus?.lien} />}
          {t.suspicious && (
            <p className="rounded-lg bg-[color-mix(in_srgb,var(--orange)_14%,transparent)] px-3 py-2 text-[13px] font-semibold text-[var(--orange)]">
              Un message contient ce qui ressemble à une consigne adressée à l&apos;IA. Relis la conversation toi-même avant de te fier au résumé.
            </p>
          )}
          {waiting && t.error && fresh && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-[color-mix(in_srgb,var(--red)_12%,transparent)] px-3 py-2">
              <p className="text-[13px] font-semibold text-[var(--red)]">Le résumé a échoué : {t.error}</p>
              <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy !== null} onClick={() => act("resumer")}>
                Réessayer
              </button>
            </div>
          )}
          {t.summary && (
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--fg2)]">{fresh ? "Résumé" : "Résumé précédent"}</p>
              <p className="mt-0.5 text-[14px] font-medium leading-relaxed">{t.summary}</p>
              {(t.points ?? []).length > 0 && (
                <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[13.5px] font-semibold">
                  {(t.points ?? []).map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {waiting && fresh && t.needs_reply === false && <p className={SMALL}>D&apos;après l&apos;IA, rien n&apos;appelle de réponse. Clique sur « Traité » si c&apos;est bon.</p>}
        </div>
      )}

      {/* La conversation */}
      {open ? (
        <div ref={scroller} className="max-h-[460px] overflow-y-auto bg-[var(--wa-bg)] px-3 py-3" aria-label={`Conversation avec ${name}`}>
          {!messages ? (
            <p className={`text-center ${SMALL}`}>Chargement…</p>
          ) : messages.length === 0 ? (
            <p className={`text-center ${SMALL}`}>Aucun message enregistré.</p>
          ) : (
            <>
              {from > 0 && (
                <div className="mb-2 text-center">
                  <button className="rounded-full bg-[var(--wa-in)] px-3 py-1 text-[12.5px] font-bold text-[var(--accent2)] shadow-sm hover:underline" onClick={() => setShowAll(true)}>
                    Voir les {from} messages plus anciens
                  </button>
                </div>
              )}
              <ul className="space-y-1.5">
                {shown.map((m, i) => {
                  const idx = from + i;
                  const prev = idx > 0 ? messages[idx - 1] : null;
                  const newDay = !prev || dayOf(prev.sent_at) !== dayOf(m.sent_at);
                  return (
                    <Fragment key={m.id}>
                      {newDay && (
                        <li className="flex justify-center py-1">
                          <span className="rounded-md bg-[var(--wa-in)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--fg2)] shadow-sm">{dayOf(m.sent_at)}</span>
                        </li>
                      )}
                      {win && idx === win.firstNew && (
                        <li className="flex justify-center py-1" aria-label="Nouveaux messages">
                          <span className="rounded-md bg-[color-mix(in_srgb,var(--orange)_18%,var(--wa-in))] px-2.5 py-0.5 text-[12px] font-bold text-[var(--orange)]">
                            {since ? "Nouveaux depuis ta dernière réponse" : "Nouveaux messages"}
                          </span>
                        </li>
                      )}
                      <Bubble m={m} />
                    </Fragment>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      ) : (
        <div className="px-4 py-2.5">
          <button className="text-[13px] font-bold text-[var(--accent2)] hover:underline" aria-expanded={open} onClick={() => setOpen(true)}>
            Voir la conversation
          </button>
        </div>
      )}

      {/* La réponse, comme la barre d'écriture de WhatsApp */}
      <footer className="border-t-[0.5px] border-[var(--sep)] bg-[var(--wa-bar)] px-3 py-3">
        {sent && <p className="mb-2 text-[13px] font-bold text-[var(--green)]">Envoyé. Il apparaît aussi dans ton WhatsApp.</p>}
        <label htmlFor={`draft-${t.contact}`} className="sr-only">
          Ta réponse à {name}
        </label>
        <textarea
          id={`draft-${t.contact}`}
          ref={field}
          rows={1}
          className="mac-field min-h-[44px] resize-none rounded-[22px] !px-4 !py-2.5 text-[14.5px] leading-relaxed"
          placeholder={waiting && fresh && t.needs_reply !== false ? "Écris ta réponse…" : "Écris un message…"}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setEdited(true);
            setSent(false);
          }}
        />
        {waiting && fresh && t.draft && !edited && <p className={`mt-1 px-2 ${SMALL}`}>Brouillon de l&apos;IA : relis-le et complète les passages entre crochets avant d&apos;envoyer.</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            className="mac-btn mac-btn-sm !bg-[var(--wa-send)] !text-white disabled:opacity-50"
            disabled={busy !== null || !canSend || !draft.trim() || /\[[^\]]+\]/.test(draft)}
            onClick={() => act("envoyer", { text: draft })}
            title={!canSend ? "WhatsApp n'autorise pas l'envoi d'ici pour ce message : utilise WhatsApp Web." : /\[[^\]]+\]/.test(draft) ? "Complète d'abord les passages entre crochets." : undefined}
          >
            {busy === "envoyer" ? "Envoi…" : "Envoyer"}
          </button>
          <button className="mac-btn mac-btn-def mac-btn-sm" disabled={!draft.trim()} onClick={copy}>
            {copied ? "Copié" : "Copier"}
          </button>
          {isPhone(t.contact) && (
            <a className="mac-btn mac-btn-def mac-btn-sm" href={`https://web.whatsapp.com/send?phone=${t.contact}&text=${encodeURIComponent(draft)}`} target="_blank" rel="noreferrer">
              WhatsApp Web
            </a>
          )}
          {waiting ? (
            <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy !== null} onClick={() => act("traite")}>
              Traité
            </button>
          ) : (
            t.handled_at && (
              <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy !== null} onClick={() => act("reprendre")}>
                Remettre à répondre
              </button>
            )
          )}
          {!t.student && (
            <select
              className="mac-field !w-auto !py-[7px] !text-[13px]"
              aria-label="Relier à un élève"
              value=""
              disabled={busy !== null}
              onChange={(e) => e.target.value && act("relier", { student_id: e.target.value })}
            >
              <option value="">Relier à un élève…</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          {t.student && (
            <button className="ml-auto text-[12.5px] font-semibold text-[var(--fg2)] hover:underline" disabled={busy !== null} onClick={() => act("relier", { student_id: null })}>
              Ce n&apos;est pas {t.student.name.split(" ")[0]}
            </button>
          )}
        </div>
        {!canSend && isPhone(t.contact) && waiting && (
          <p className={`mt-2 px-1 ${SMALL}`}>
            Envoi d&apos;ici impossible : WhatsApp ne l&apos;autorise que dans les 24 h qui suivent un message reçu depuis le branchement de l&apos;outil (9 novembre, 20 h 48). Utilise « WhatsApp Web ».
          </p>
        )}
        {canSend && windowEnd && <p className={`mt-2 px-1 ${SMALL}`}>Envoi possible d&apos;ici jusqu&apos;à {hourOf(windowEnd.toISOString())} {dayOf(windowEnd.toISOString()) !== dayOf(new Date().toISOString()) ? dayOf(windowEnd.toISOString()) : "aujourd'hui"}.</p>}
        {error && (
          <p role="alert" className="mt-2 px-1 text-[13px] font-semibold text-[var(--red)]">
            {error}
          </p>
        )}
      </footer>
    </article>
  );
}

// Hauteur du champ selon la longueur du texte (environ 85 caractères par ligne).
const rowsFor = (text: string) => Math.min(40, Math.max(6, text.split("\n").reduce((n, l) => n + Math.max(1, Math.ceil(l.length / 85)), 0)));

function ConseilCard({ c, onSaved }: { c: Conseil; onSaved: (c: Conseil) => void }) {
  const [text, setText] = useState(c.contenu);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valide = c.statut === "valide";
  const dirty = text.trim() !== c.contenu.trim();

  useEffect(() => setText(c.contenu), [c.contenu]);

  async function save(statut?: Conseil["statut"]) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/whatsapp/conseils", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: c.theme, contenu: text, ...(statut ? { statut } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Enregistrement impossible");
      onSaved(data.conseil);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="mac-group p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[16px] font-bold">{c.titre}</h2>
          <p className={SMALL}>
            Tiré de {c.sources} conseil{c.sources > 1 ? "s" : ""} relevé{c.sources > 1 ? "s" : ""} dans tes conversations
            {valide && c.validated_at ? ` · validé ${ago(c.validated_at)}` : ""}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${
            valide ? "bg-[color-mix(in_srgb,var(--green)_16%,transparent)] text-[var(--green)]" : "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]"
          }`}
        >
          {valide ? "Validé" : "À relire"}
        </span>
      </div>

      {c.a_verifier.length > 0 && (
        <div className="mt-3 rounded-lg bg-[color-mix(in_srgb,var(--orange)_14%,transparent)] px-3 py-2">
          <p className="text-[13px] font-bold text-[var(--orange)]">
            {valide ? "À trancher (la fiche sert déjà aux brouillons, ces points n'y sont pas encore) :" : "À trancher avant de valider :"}
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-[13.5px] font-semibold">
            {c.a_verifier.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      <label htmlFor={`conseil-${c.theme}`} className="sr-only">
        Texte du thème {c.titre}
      </label>
      <textarea id={`conseil-${c.theme}`} className="mac-field mt-3 text-[14px] leading-relaxed" rows={rowsFor(text)} value={text} onChange={(e) => setText(e.target.value)} />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {!valide && (
          <button className="mac-btn mac-btn-primary mac-btn-sm" disabled={busy || !text.trim()} onClick={() => save("valide")}>
            {dirty ? "Enregistrer et valider" : "Valider"}
          </button>
        )}
        {dirty && (
          <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy} onClick={() => save()}>
            Enregistrer
          </button>
        )}
        {dirty && (
          <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy} onClick={() => setText(c.contenu)}>
            Annuler
          </button>
        )}
        {valide && !dirty && (
          <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy} onClick={() => save("a_relire")}>
            Ne plus utiliser pour les brouillons
          </button>
        )}
        {saved && <span className={SMALL}>Enregistré</span>}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-[13px] font-semibold text-[var(--red)]">
          {error}
        </p>
      )}
    </article>
  );
}

function ConseilsPanel() {
  const [list, setList] = useState<Conseil[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/whatsapp/conseils")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Chargement impossible");
        setList(data.conseils);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur réseau"));
  }, []);

  if (error)
    return (
      <p role="alert" className="text-sm font-semibold text-[var(--red)]">
        {error}
      </p>
    );
  if (!list) return <p className={SMALL}>Chargement…</p>;
  const valides = list.filter((c) => c.statut === "valide").length;

  return (
    <>
      <div className="mac-group p-5">
        <p className="text-[14.5px] font-medium leading-relaxed">
          Tes conseils, relevés dans tes vocaux et tes messages aux élèves, puis rangés par thème. Relis chaque thème, corrige ce qui ne va pas et valide-le. Seuls les thèmes validés servent à préparer les brouillons.
        </p>
        {list.length > 0 && (
          <p className="mt-2 text-[14px] font-bold">
            {valides} {valides > 1 ? "thèmes validés" : "thème validé"} sur {list.length}
          </p>
        )}
      </div>
      {list.length === 0 ? (
        <div className="mac-group p-6 text-center">
          <p className="text-[15px] font-bold">La base de conseils n&apos;est pas encore prête.</p>
          <p className={`mt-1 ${SMALL}`}>Les thèmes apparaîtront ici dès qu&apos;ils seront rédigés.</p>
        </div>
      ) : (
        list.map((c) => <ConseilCard key={c.theme} c={c} onSaved={(n) => setList((l) => (l ?? []).map((x) => (x.theme === n.theme ? n : x)))} />)
      )}
    </>
  );
}

export default function WhatsAppPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("todo");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/whatsapp");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Erreur de chargement");
    setThreads(data.threads);
    setStudents(data.students);
  }, []);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        if (d.role !== "owner") {
          window.location.href = d.admin ? "/admin/crm" : "/membres";
          return;
        }
        return load();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur réseau"))
      .finally(() => setLoading(false));
  }, [load]);

  // Les résumés arrivent toutes les 5 minutes : la page se met à jour seule.
  useEffect(() => {
    const timer = setInterval(() => load().catch(() => undefined), 60_000);
    return () => clearInterval(timer);
  }, [load]);

  const todo = useMemo(() => threads.filter(awaitingReply).sort((a, b) => Date.parse(a.last_inbound_at!) - Date.parse(b.last_inbound_at!)), [threads]);
  const all = useMemo(
    () => [...threads].sort((a, b) => Math.max(Date.parse(b.last_inbound_at ?? "0"), Date.parse(b.last_outbound_at ?? "0")) - Math.max(Date.parse(a.last_inbound_at ?? "0"), Date.parse(a.last_outbound_at ?? "0"))),
    [threads],
  );
  const visible = tab === "todo" ? todo : all;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-3xl px-5 py-6 sm:py-8">
        <AdminNav current="whatsapp" isOwner />

        <header>
          <h1 className="text-[28px] font-bold tracking-tight">WhatsApp</h1>
          <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">
            L&apos;IA lit ton WhatsApp pro toutes les 5 minutes, transcrit les vocaux et prépare un résumé et un brouillon. Rien ne part sans toi : tu relis, puis tu cliques sur « Envoyer ».
          </p>
        </header>

        <div className="mt-5 mac-seg">
          <button className={tab === "todo" ? "on" : ""} onClick={() => setTab("todo")}>
            À répondre ({todo.length})
          </button>
          <button className={tab === "all" ? "on" : ""} onClick={() => setTab("all")}>
            <span className="sm:hidden">30 jours</span>
            <span className="hidden sm:inline">30 derniers jours</span> ({all.length})
          </button>
          <button className={tab === "conseils" ? "on" : ""} onClick={() => setTab("conseils")}>
            <span className="sm:hidden">Conseils</span>
            <span className="hidden sm:inline">Base de conseils</span>
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-[var(--red)]">
            {error}
          </p>
        )}

        <div className="mt-5 space-y-4">
          {tab === "conseils" ? (
            <ConseilsPanel />
          ) : loading ? (
            <p className={SMALL}>Chargement…</p>
          ) : visible.length === 0 ? (
            <div className="mac-group p-6 text-center">
              <p className="text-[15px] font-bold">{tab === "todo" ? "Personne n'attend de réponse." : "Aucune conversation ces 30 derniers jours."}</p>
              <p className={`mt-1 ${SMALL}`}>Les nouveaux messages apparaissent ici quelques minutes après leur arrivée.</p>
            </div>
          ) : (
            visible.map((t) => <ThreadCard key={t.contact} t={t} students={students} onChange={load} />)
          )}
        </div>
      </div>
    </div>
  );
}
