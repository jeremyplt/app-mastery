"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

// Factures à envoyer : le PDF vient d'Odoo, le mail part de
// contact@jeremypitault.com quand Jeremy clique. Propriétaire seulement.

type Status = "draft" | "sending" | "sent" | "no_send";
type Invoice = {
  id: string;
  number: string;
  client_name: string;
  client_email: string | null;
  invoice_date: string;
  amount: number;
  currency: string;
  kind: "paid" | "due";
  email_subject: string;
  email_body: string;
  status: Status;
  sent_at: string | null;
  sent_to: string | null;
  pdf_url?: string | null;
};
type Student = { id: string; name: string; email: string | null };
type ToCheck = { key: string; date: string; amount: number; label: string; reason: string };
type ProofStudent = { id: string; name: string; email: string | null; link: string; requestedAt: string | null; address: string | null };
type Proof = { id: string; studentId: string; createdAt: string; fileName: string; status: "pending" | "accepted" | "rejected"; rejectReason: string | null; synced: boolean; syncError: string | null; url: string | null };
type Tab = "todo" | "sent" | "no_send";
type Edit = { client_email: string; email_subject: string; email_body: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LABEL = "mb-1 block text-xs font-bold text-[var(--fg2)]";
const CHIP = {
  orange: "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]",
  green: "bg-[color-mix(in_srgb,var(--green)_15%,transparent)] text-[var(--green)]",
  blue: "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent2)]",
};

function money(n: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n);
}

function shortDate(iso: string) {
  const date = iso.length === 10 ? `${iso}T12:00:00Z` : iso;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(date));
}

function tabOf(status: Status): Tab {
  if (status === "sent") return "sent";
  if (status === "no_send") return "no_send";
  return "todo";
}

const editOf = (i: Invoice): Edit => ({ client_email: i.client_email ?? "", email_subject: i.email_subject, email_body: i.email_body });

const EMPTY_FORM = { student_id: "", client_name: "", client_email: "", number: "", invoice_date: "", amount: "", currency: "EUR", kind: "paid" as "paid" | "due" };

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [toCheck, setToCheck] = useState<ToCheck[]>([]);
  const [autoSend, setAutoSend] = useState(false);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [proofStudents, setProofStudents] = useState<ProofStudent[]>([]);
  const [askFor, setAskFor] = useState("");
  const [refusing, setRefusing] = useState<string | null>(null);
  const [refuseReason, setRefuseReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("todo");
  const [openId, setOpenId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Edit | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/factures");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Erreur de chargement");
    setInvoices(data.invoices);
    setStudents(data.students);
    setToCheck(data.toCheck ?? []);
    setAutoSend(Boolean(data.autoSend));
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

  const loadProofs = useCallback(async () => {
    const res = await fetch("/api/admin/factures/justificatifs");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Erreur de chargement");
    setProofs(data.proofs);
    setProofStudents(data.students);
  }, []);

  useEffect(() => {
    loadProofs().catch(() => undefined);
  }, [loadProofs]);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { todo: 0, sent: 0, no_send: 0 };
    for (const i of invoices) c[tabOf(i.status)] += 1;
    return c;
  }, [invoices]);
  const visible = invoices.filter((i) => tabOf(i.status) === tab);

  function toggle(i: Invoice) {
    setNotice(null);
    setError(null);
    if (openId === i.id) {
      setOpenId(null);
      setEdit(null);
    } else {
      setOpenId(i.id);
      setEdit(editOf(i));
    }
  }

  function merge(updated: Invoice) {
    setInvoices((list) => list.map((i) => (i.id === updated.id ? { ...updated, pdf_url: i.pdf_url } : i)));
  }

  async function saveEdit(i: Invoice): Promise<Invoice | null> {
    if (!edit) return i;
    const dirty = edit.client_email !== (i.client_email ?? "") || edit.email_subject !== i.email_subject || edit.email_body !== i.email_body;
    if (!dirty) return i;
    const res = await fetch(`/api/admin/factures/${i.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(edit) });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Enregistrement impossible");
      return null;
    }
    merge(data.invoice);
    return data.invoice;
  }

  async function run(key: string, task: () => Promise<void>) {
    setBusy(key);
    setError(null);
    setNotice(null);
    try {
      await task();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(null);
    }
  }

  const save = (i: Invoice) =>
    run(`save-${i.id}`, async () => {
      const saved = await saveEdit(i);
      if (saved) setNotice("Brouillon enregistré.");
    });

  const send = (i: Invoice, mode: "send" | "resend" | "test") => {
    if (mode === "resend" && !confirm(`Renvoyer la facture ${i.number} à ${edit?.client_email} ?`)) return;
    return run(`${mode}-${i.id}`, async () => {
      const saved = await saveEdit(i);
      if (!saved) return;
      const res = await fetch(`/api/admin/factures/${i.id}/envoyer`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode }) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Envoi impossible");
        await load();
        return;
      }
      if (mode === "test") {
        setNotice("Test envoyé sur ta boîte jeremypltpro@gmail.com. La facture reste à envoyer.");
        return;
      }
      merge(data.invoice);
      setOpenId(null);
      setEdit(null);
      setNotice(`Facture ${i.number} envoyée à ${data.invoice.sent_to}.`);
    });
  };

  const setStatus = (i: Invoice, status: "draft" | "no_send") =>
    run(`status-${i.id}`, async () => {
      const res = await fetch(`/api/admin/factures/${i.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Modification impossible");
      merge(data.invoice);
      setOpenId(null);
      setEdit(null);
    });

  const remove = (i: Invoice) => {
    if (!confirm(`Retirer la facture ${i.number} du CRM ? Elle reste dans Odoo.`)) return;
    return run(`delete-${i.id}`, async () => {
      const res = await fetch(`/api/admin/factures/${i.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Suppression impossible");
      setInvoices((list) => list.filter((x) => x.id !== i.id));
      setOpenId(null);
      setEdit(null);
    });
  };

  const requestProof = () =>
    run("proof-ask", async () => {
      const res = await fetch("/api/admin/factures/justificatifs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId: askFor }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Envoi impossible");
      setNotice(`Demande envoyée à ${proofStudents.find((s) => s.id === askFor)?.name}.`);
      setAskFor("");
      await loadProofs();
    });

  const copyProofLink = () =>
    run("proof-copy", async () => {
      await navigator.clipboard.writeText(proofStudents.find((s) => s.id === askFor)?.link ?? "");
      setNotice("Lien copié.");
    });

  const reviewProof = (id: string, status: "accepted" | "rejected", reason?: string) =>
    run(`proof-${id}`, async () => {
      const res = await fetch(`/api/admin/factures/justificatifs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, reason }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Modification impossible");
      setRefusing(null);
      setRefuseReason("");
      setNotice(data.warning ?? (status === "accepted" ? "Justificatif validé. Il sera rangé dans Odoo et sur le Drive au prochain passage du job." : "Refus enregistré, l'élève a reçu le motif."));
      await loadProofs();
    });

  const toggleAutoSend = () => {
    const next = !autoSend;
    const question = next
      ? "Activer l'envoi automatique ? Chaque facture créée par le job partira au client sans ton clic."
      : "Désactiver l'envoi automatique ? Les factures attendront ton clic.";
    if (!confirm(question)) return;
    return run("auto", async () => {
      const res = await fetch("/api/admin/factures", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ autoSend: next }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Modification impossible");
      setAutoSend(data.autoSend);
      setNotice(data.autoSend ? "Envoi automatique activé." : "Envoi automatique désactivé.");
    });
  };

  function pickStudent(id: string) {
    const s = students.find((x) => x.id === id);
    setForm((f) => ({ ...f, student_id: id, client_name: s?.name ?? f.client_name, client_email: s?.email ?? f.client_email }));
  }

  async function addInvoice(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!file) return setFormError("Ajoute le PDF de la facture.");
    setBusy("add");
    try {
      const body = new FormData();
      body.append("file", file);
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      const res = await fetch("/api/admin/factures", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) return setFormError(data.error ?? "Ajout impossible");
      await load();
      setForm(EMPTY_FORM);
      setFile(null);
      setShowForm(false);
      setTab("todo");
      setOpenId(data.invoice.id);
      setEdit(editOf(data.invoice));
      setNotice(`Facture ${data.invoice.number} ajoutée. Relis le mail puis envoie-la.`);
    } catch {
      setFormError("Erreur réseau, réessaie.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-4xl px-5 py-6 sm:py-8">
        <AdminNav current="factures" isOwner />

        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">Factures</h1>
            <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">
              Relis le mail, puis envoie. Il part de contact@jeremypitault.com, avec une copie dans cette boîte.
            </p>
          </div>
          <button onClick={() => setShowForm((v) => !v)} aria-expanded={showForm} className="mac-btn mac-btn-def">
            {showForm ? "Fermer" : "Ajouter une facture"}
          </button>
        </header>

        {showForm && (
          <form onSubmit={addInvoice} className="mac-group mt-5 p-5">
            <h2 className="text-[16px] font-bold">Ajouter une facture depuis Odoo</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className={LABEL}>PDF de la facture</span>
                <input className="mac-field" type="file" accept="application/pdf" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
              <label>
                <span className={LABEL}>Élève (facultatif)</span>
                <select className="mac-field" value={form.student_id} onChange={(e) => pickStudent(e.target.value)}>
                  <option value="">Pas un élève</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className={LABEL}>Numéro de facture</span>
                <input className="mac-field font-mono" required placeholder="VEN/2026/00033" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
              </label>
              <label>
                <span className={LABEL}>Nom du client</span>
                <input className="mac-field" required value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
              </label>
              <label>
                <span className={LABEL}>Email du client</span>
                <input className="mac-field" type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} />
              </label>
              <label>
                <span className={LABEL}>Date de la facture</span>
                <input className="mac-field" type="date" required value={form.invoice_date} onChange={(e) => setForm({ ...form, invoice_date: e.target.value })} />
              </label>
              <div className="grid grid-cols-[1fr_90px] gap-3">
                <label>
                  <span className={LABEL}>Montant TTC</span>
                  <input className="mac-field" required inputMode="decimal" placeholder="1000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </label>
                <label>
                  <span className={LABEL}>Devise</span>
                  <select className="mac-field" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                    <option>EUR</option>
                    <option>USD</option>
                  </select>
                </label>
              </div>
              <label className="sm:col-span-2">
                <span className={LABEL}>Paiement</span>
                <select className="mac-field" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as "paid" | "due" })}>
                  <option value="paid">Virement déjà reçu</option>
                  <option value="due">À régler (le mail donne l&apos;IBAN)</option>
                </select>
              </label>
            </div>
            {formError && (
              <p role="alert" className="mt-3 text-sm font-semibold text-[var(--red)]">
                {formError}
              </p>
            )}
            <button type="submit" disabled={busy === "add"} className="mac-btn mac-btn-primary mt-4 disabled:opacity-50">
              {busy === "add" ? "Ajout..." : "Ajouter"}
            </button>
          </form>
        )}

        {!loading && (
          <section className="mac-group mt-5 flex flex-wrap items-center justify-between gap-3 px-4 py-3" aria-label="Envoi automatique">
            <div>
              <p className="text-[14px] font-bold">Envoi automatique : {autoSend ? "activé" : "désactivé"}</p>
              <p className="text-[13px] font-medium text-[var(--fg2)]">
                {autoSend ? "Les factures créées par le job partent toutes seules au client." : "Le job crée les factures, puis elles attendent ton clic ici."}
              </p>
            </div>
            <button onClick={toggleAutoSend} disabled={busy !== null} className="mac-btn mac-btn-def disabled:opacity-50">
              {autoSend ? "Désactiver" : "Activer"}
            </button>
          </section>
        )}

        {toCheck.length > 0 && (
          <section className="mac-group mt-5 px-4 py-3" aria-label="Virements à vérifier">
            <h2 className="text-[15px] font-bold text-[var(--orange)]">À vérifier ({toCheck.length})</h2>
            <p className="text-[13px] font-medium text-[var(--fg2)]">Le job s&apos;est arrêté sur ces cas plutôt que de deviner.</p>
            <ul className="mt-2 divide-y divide-[var(--sep)]">
              {toCheck.map((c) => (
                <li key={c.key} className="py-2">
                  <p className="text-[14px] font-bold">
                    {c.label} · {money(c.amount, "EUR")} · {shortDate(c.date)}
                  </p>
                  <p className="text-[13px] font-medium text-[var(--fg2)]">{c.reason}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!loading && (
          <section className="mac-group mt-5 px-4 py-3" aria-label="Justificatifs de domicile">
            <h2 className="text-[15px] font-bold">Justificatifs de domicile (hors UE)</h2>
            <p className="text-[13px] font-medium text-[var(--fg2)]">Sans justificatif validé, le job ne facture pas un particulier hors UE sans TVA : il s&apos;arrête et te prévient.</p>

            {proofs.length > 0 && (
              <ul className="mt-2 divide-y divide-[var(--sep)]">
                {proofs.map((p) => {
                  const st = proofStudents.find((s) => s.id === p.studentId);
                  return (
                    <li key={p.id} className="py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[14px] font-bold">
                          {st?.name ?? "Élève"} · {shortDate(p.createdAt)}
                        </p>
                        <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${p.status === "accepted" ? CHIP.green : p.status === "rejected" ? "bg-[color-mix(in_srgb,var(--red)_14%,transparent)] text-[var(--red)]" : CHIP.orange}`}>
                          {p.status === "accepted" ? (p.synced ? "Validé et rangé" : "Validé") : p.status === "rejected" ? "Refusé" : "À vérifier"}
                        </span>
                      </div>
                      {st?.address && <p className="text-[13px] font-medium text-[var(--fg2)]">Adresse du contrat : {st.address}</p>}
                      {p.rejectReason && <p className="text-[13px] font-medium text-[var(--fg2)]">Motif : {p.rejectReason}</p>}
                      {p.syncError && <p className="text-[13px] font-semibold text-[var(--orange)]">Rangement à reprendre : {p.syncError}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noreferrer" className="mac-btn mac-btn-def">
                            Voir le document
                          </a>
                        )}
                        {p.status === "pending" && (
                          <>
                            <button onClick={() => reviewProof(p.id, "accepted")} disabled={busy !== null} className="mac-btn mac-btn-primary disabled:opacity-50">
                              Valider
                            </button>
                            <button onClick={() => setRefusing(refusing === p.id ? null : p.id)} disabled={busy !== null} aria-expanded={refusing === p.id} className="mac-btn mac-btn-def disabled:opacity-50">
                              Refuser
                            </button>
                          </>
                        )}
                      </div>
                      {refusing === p.id && (
                        <div className="mt-2 flex flex-wrap items-end gap-2">
                          <label className="min-w-[240px] flex-1">
                            <span className={LABEL}>Motif, envoyé à l&apos;élève</span>
                            <input className="mac-field" placeholder="Le document a plus de 3 mois." value={refuseReason} onChange={(e) => setRefuseReason(e.target.value)} />
                          </label>
                          <button onClick={() => reviewProof(p.id, "rejected", refuseReason)} disabled={busy !== null || !refuseReason.trim()} className="mac-btn mac-btn-def disabled:opacity-50">
                            Envoyer le refus
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-3 flex flex-wrap items-end gap-2">
              <label className="min-w-[220px] flex-1">
                <span className={LABEL}>Demander un justificatif à</span>
                <select className="mac-field" value={askFor} onChange={(e) => setAskFor(e.target.value)}>
                  <option value="">Choisir un élève</option>
                  {proofStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                      {s.requestedAt ? " (déjà demandé)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={requestProof} disabled={busy !== null || !askFor} className="mac-btn mac-btn-primary disabled:opacity-50">
                {busy === "proof-ask" ? "Envoi..." : "Envoyer la demande"}
              </button>
              <button onClick={copyProofLink} disabled={busy !== null || !askFor} className="mac-btn mac-btn-def disabled:opacity-50">
                Copier le lien
              </button>
            </div>
          </section>
        )}

        <div className="mt-6 flex items-center gap-2">
          <div className="mac-seg">
            <button className={tab === "todo" ? "on" : ""} onClick={() => setTab("todo")}>
              À envoyer ({counts.todo})
            </button>
            <button className={tab === "sent" ? "on" : ""} onClick={() => setTab("sent")}>
              Envoyées ({counts.sent})
            </button>
            <button className={tab === "no_send" ? "on" : ""} onClick={() => setTab("no_send")}>
              Rien à envoyer ({counts.no_send})
            </button>
          </div>
        </div>

        <div aria-live="polite">
          {notice && <p className="mt-4 text-sm font-semibold text-[var(--green)]">{notice}</p>}
          {error && (
            <p role="alert" className="mt-4 text-sm font-semibold text-[var(--red)]">
              {error}
            </p>
          )}
        </div>

        {loading && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">Chargement...</p>}
        {!loading && !error && visible.length === 0 && (
          <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">
            {tab === "todo" ? "Aucune facture à envoyer." : tab === "sent" ? "Aucune facture envoyée pour l'instant." : "Aucune facture classée ici."}
          </p>
        )}

        <div className="mt-4 space-y-3">
          {visible.map((i) => {
            const open = openId === i.id && edit;
            const validEmail = edit ? EMAIL_RE.test(edit.client_email.trim()) : false;
            const isBusy = busy !== null;
            return (
              <article key={i.id} className="mac-group overflow-hidden">
                <button onClick={() => toggle(i)} aria-expanded={Boolean(open)} className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-left">
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold">{i.client_name}</span>
                    <span className="block text-[13px] font-medium text-[var(--fg2)]">
                      <span className="font-mono">{i.number}</span> · {shortDate(i.invoice_date)}
                      {i.sent_at ? ` · envoyée le ${shortDate(i.sent_at)} à ${i.sent_to}` : ""}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    {i.status === "sending" && <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${CHIP.blue}`}>Envoi en cours</span>}
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${i.kind === "due" ? CHIP.orange : CHIP.green}`}>{i.kind === "due" ? "À régler" : "Déjà payée"}</span>
                    <span className="text-[15px] font-bold">{money(i.amount, i.currency)}</span>
                  </span>
                </button>

                {open && (
                  <div className="border-t border-[var(--sep)] px-4 py-4">
                    <div className="grid gap-3">
                      <label>
                        <span className={LABEL}>Destinataire</span>
                        <input className="mac-field" type="email" value={edit.client_email} onChange={(e) => setEdit({ ...edit, client_email: e.target.value })} />
                      </label>
                      <label>
                        <span className={LABEL}>Objet</span>
                        <input className="mac-field" value={edit.email_subject} onChange={(e) => setEdit({ ...edit, email_subject: e.target.value })} />
                      </label>
                      <label>
                        <span className={LABEL}>Message</span>
                        <textarea className="mac-field min-h-[330px] leading-relaxed" value={edit.email_body} onChange={(e) => setEdit({ ...edit, email_body: e.target.value })} />
                      </label>
                    </div>

                    <p className="mt-3 text-[13px] font-semibold">
                      Pièce jointe :{" "}
                      {i.pdf_url ? (
                        <a href={i.pdf_url} target="_blank" rel="noreferrer" className="text-[var(--accent2)] underline">
                          voir le PDF de la facture
                        </a>
                      ) : (
                        <span className="text-[var(--red)]">PDF introuvable, recharge la page</span>
                      )}
                    </p>

                    {!validEmail && i.status !== "no_send" && <p className="mt-2 text-[13px] font-semibold text-[var(--orange)]">Ajoute une adresse email valide pour pouvoir envoyer.</p>}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {i.status === "draft" && (
                        <button onClick={() => send(i, "send")} disabled={isBusy || !validEmail} className="mac-btn mac-btn-primary disabled:opacity-50">
                          {busy === `send-${i.id}` ? "Envoi..." : validEmail ? `Envoyer à ${edit.client_email.trim()}` : "Envoyer"}
                        </button>
                      )}
                      {i.status === "sent" && (
                        <button onClick={() => send(i, "resend")} disabled={isBusy || !validEmail} className="mac-btn mac-btn-def disabled:opacity-50">
                          {busy === `resend-${i.id}` ? "Envoi..." : "Renvoyer"}
                        </button>
                      )}
                      <button onClick={() => send(i, "test")} disabled={isBusy} className="mac-btn mac-btn-def disabled:opacity-50">
                        {busy === `test-${i.id}` ? "Envoi..." : "M'envoyer un test"}
                      </button>
                      <button onClick={() => save(i)} disabled={isBusy} className="mac-btn mac-btn-def disabled:opacity-50">
                        {busy === `save-${i.id}` ? "Enregistrement..." : "Enregistrer"}
                      </button>
                      {i.status === "draft" && (
                        <button onClick={() => setStatus(i, "no_send")} disabled={isBusy} className="mac-btn mac-btn-def disabled:opacity-50">
                          Rien à envoyer
                        </button>
                      )}
                      {i.status === "no_send" && (
                        <button onClick={() => setStatus(i, "draft")} disabled={isBusy} className="mac-btn mac-btn-def disabled:opacity-50">
                          Remettre à envoyer
                        </button>
                      )}
                      {i.status === "sending" && (
                        <button onClick={() => setStatus(i, "draft")} disabled={isBusy} className="mac-btn mac-btn-def disabled:opacity-50">
                          Remettre en brouillon
                        </button>
                      )}
                      {(i.status === "draft" || i.status === "no_send") && (
                        <button onClick={() => remove(i)} disabled={isBusy} className="rounded-md px-2 py-1 text-xs font-bold text-[var(--fg2)] hover:bg-[color-mix(in_srgb,var(--red)_14%,transparent)] hover:text-[var(--red)] disabled:opacity-50">
                          Retirer du CRM
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
