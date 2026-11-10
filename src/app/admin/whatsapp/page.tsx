"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { awaitingReply, recentWindow } from "@/lib/whatsapp/messages";

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

const time = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

const nameOf = (t: Thread) => t.student?.name ?? t.contact_name ?? `+${t.contact}`;
const isPhone = (contact: string) => /^\d{8,15}$/.test(contact);

function MessageLine({ m }: { m: Message }) {
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
      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[14px] font-medium ${mine ? "bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]" : "bg-[var(--field)]"}`}>
        {m.type === "audio" ? (
          <>
            <span className="mb-0.5 block text-[12px] font-bold text-[var(--fg2)]">🎙️ Vocal transcrit</span>
            <span className="whitespace-pre-wrap">{m.transcript ?? (m.transcript_error ? `Transcription impossible : ${m.transcript_error}` : "Transcription en cours…")}</span>
          </>
        ) : (
          <>
            {label[m.type] && <span className="mb-0.5 block text-[12px] font-bold text-[var(--fg2)]">{label[m.type]}</span>}
            <span className="whitespace-pre-wrap">{m.body ?? (label[m.type] ? "" : `(${m.type})`)}</span>
          </>
        )}
        <span className="mt-1 block text-right text-[11px] font-semibold text-[var(--fg2)]">{time(m.sent_at)}</span>
      </div>
    </li>
  );
}

function ThreadCard({ t, students, onChange }: { t: Thread; students: StudentOption[]; onChange: () => Promise<void> }) {
  const waiting = awaitingReply(t);
  const fresh = Boolean(t.summarized_through && t.last_inbound_at && Date.parse(t.summarized_through) >= Date.parse(t.last_inbound_at));
  const [draft, setDraft] = useState(t.draft ?? "");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setDraft(t.draft ?? ""), [t.draft]);

  async function act(action: string, extra: Record<string, unknown> = {}) {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/admin/whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contact: t.contact, action, ...extra }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Action impossible");
      await onChange();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(null);
    }
  }

  async function toggleConversation() {
    if (open) return setOpen(false);
    setOpen(true);
    if (messages) return;
    try {
      const res = await fetch(`/api/admin/whatsapp?contact=${encodeURIComponent(t.contact)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chargement impossible");
      setMessages(data.messages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
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

  return (
    <article className="mac-group p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[16px] font-bold">
            {t.student ? (
              <Link href={`/admin/eleves/${t.student.id}`} className="hover:underline">
                {t.student.name}
              </Link>
            ) : (
              nameOf(t)
            )}
          </h2>
          <p className={SMALL}>
            {isPhone(t.contact) ? `+${t.contact}` : "Numéro masqué par WhatsApp"}
            {t.student?.app ? ` · ${t.student.app}` : ""}
            {t.last_inbound_at ? ` · dernier message reçu ${ago(t.last_inbound_at)}` : ""}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${
            waiting ? "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]" : "bg-[var(--field)] text-[var(--fg2)]"
          }`}
        >
          {waiting ? "À répondre" : t.handled_at && (!t.last_outbound_at || t.handled_at > t.last_outbound_at) ? "Traité" : "Répondu"}
        </span>
      </div>

      {t.suspicious && (
        <p className="mt-3 rounded-lg bg-[color-mix(in_srgb,var(--orange)_14%,transparent)] px-3 py-2 text-[13px] font-semibold text-[var(--orange)]">
          Un message contient ce qui ressemble à une consigne adressée à l&apos;IA. Relis la conversation toi-même avant de te fier au résumé.
        </p>
      )}

      {waiting && t.error && fresh && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-[color-mix(in_srgb,var(--red)_12%,transparent)] px-3 py-2">
          <p className="text-[13px] font-semibold text-[var(--red)]">Le résumé a échoué : {t.error}</p>
          <button className="mac-btn mac-btn-def mac-btn-sm" disabled={busy !== null} onClick={() => act("resumer")}>
            Réessayer
          </button>
        </div>
      )}

      {waiting && !fresh && <p className={`mt-3 ${SMALL}`}>Résumé en préparation : il arrive dans les 5 minutes après le dernier message (un peu plus pour un long vocal).</p>}

      {t.summary && (
        <div className="mt-3">
          {!fresh && <p className={`mb-1 ${SMALL}`}>Résumé précédent, avant les derniers messages :</p>}
          <p className="text-[14.5px] font-medium leading-relaxed">{t.summary}</p>
          {(t.points ?? []).length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] font-semibold">
              {(t.points ?? []).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {waiting && fresh && t.needs_reply === false && <p className={`mt-3 ${SMALL}`}>D&apos;après l&apos;IA, rien n&apos;appelle de réponse. Clique sur « Traité » si c&apos;est bon.</p>}

      {waiting && fresh && t.draft && (
        <div className="mt-4">
          <label htmlFor={`draft-${t.contact}`} className="mb-1 block text-[12.5px] font-bold text-[var(--fg2)]">
            Brouillon de réponse (complète les passages entre crochets)
          </label>
          <textarea id={`draft-${t.contact}`} className="mac-field min-h-[140px] text-[14px] leading-relaxed" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div className="mt-2 flex flex-wrap gap-2">
            <button className="mac-btn mac-btn-primary mac-btn-sm" onClick={copy}>
              {copied ? "Copié" : "Copier"}
            </button>
            {isPhone(t.contact) && (
              <a className="mac-btn mac-btn-def mac-btn-sm" href={`https://web.whatsapp.com/send?phone=${t.contact}&text=${encodeURIComponent(draft)}`} target="_blank" rel="noreferrer">
                Ouvrir dans WhatsApp Web
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
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
        <button className="mac-btn mac-btn-def mac-btn-sm" aria-expanded={open} onClick={toggleConversation}>
          {open ? "Masquer la conversation" : "Voir la conversation"}
        </button>
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
          <button className="text-[12.5px] font-semibold text-[var(--fg2)] hover:underline" disabled={busy !== null} onClick={() => act("relier", { student_id: null })}>
            Ce n&apos;est pas {t.student.name.split(" ")[0]}
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-[13px] font-semibold text-[var(--red)]">
          {error}
        </p>
      )}

      {open && (
        <div className="mt-4 border-t-[0.5px] border-[var(--field-brd)] pt-4">
          {!messages ? (
            <p className={SMALL}>Chargement…</p>
          ) : messages.length === 0 ? (
            <p className={SMALL}>Aucun message enregistré.</p>
          ) : (
            (() => {
              const since = [t.last_outbound_at, t.handled_at].filter(Boolean).sort().at(-1) ?? null;
              const { start, firstNew } = recentWindow(messages, since);
              const from = showAll ? 0 : start;
              return (
                <>
                  {from > 0 && (
                    <button className="mb-3 text-[13px] font-bold text-[var(--accent2)] hover:underline" onClick={() => setShowAll(true)}>
                      Voir les {from} messages plus anciens
                    </button>
                  )}
                  <ul className="space-y-2">
                    {messages.slice(from).map((m, i) => (
                      <Fragment key={m.id}>
                        {from + i === firstNew && (
                          <li className="flex items-center gap-2 py-1 text-[12px] font-bold text-[var(--orange)]" aria-label="Nouveaux messages">
                            <span className="h-px flex-1 bg-[color-mix(in_srgb,var(--orange)_45%,transparent)]" />
                            {since ? "Nouveaux depuis ta dernière réponse" : "Nouveaux messages"}
                            <span className="h-px flex-1 bg-[color-mix(in_srgb,var(--orange)_45%,transparent)]" />
                          </li>
                        )}
                        <MessageLine m={m} />
                      </Fragment>
                    ))}
                  </ul>
                </>
              );
            })()
          )}
        </div>
      )}
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
            L&apos;IA lit ton WhatsApp pro toutes les 5 minutes, transcrit les vocaux et prépare un résumé et un brouillon. Rien n&apos;est envoyé : tu réponds toi-même dans WhatsApp Web.
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
