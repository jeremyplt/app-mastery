"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import {
  LINK_PRESETS,
  MILESTONES,
  TONE_CLASSES,
  lastContactLabel,
  avatarColor,
  bilanDate,
  endDate,
  frDate,
  initials,
  isLate,
  money,
  paymentsOf,
  relative,
  statusOf,
  today,
  type Student,
} from "../shared";

// Fiche élève : informations, parcours, paiements et notes. Les infos se
// modifient dans un formulaire avec un bouton Enregistrer ; les étapes et les
// paiements s'enregistrent au clic.

type Info = { name: string; email: string; phone: string; app: string; start_date: string; payment_label: string };

function infoOf(s: Student): Info {
  return {
    name: s.name,
    email: s.email ?? "",
    phone: s.phone ?? "",
    app: s.app ?? "",
    start_date: s.start_date ?? "",
    payment_label: s.payment_label ?? "",
  };
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mac-group p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-bold text-[var(--fg2)]">{label}</span>
      {children}
    </label>
  );
}

export default function StudentPage() {
  const { id } = useParams<{ id: string }>();
  const [authorized, setAuthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [info, setInfo] = useState<Info | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newPayment, setNewPayment] = useState<{ date: string; amount: string } | null>(null);
  const [newLink, setNewLink] = useState<{ label: string; url: string } | null>(null);

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
    fetch(`/api/admin/eleves?id=${id}`)
      .then((r) => r.json())
      .catch(() => ({ error: "réseau" }))
      .then((d: { student?: Student; error?: string }) => {
        if (!d.student) {
          setError(d.error ?? "Élève introuvable");
          return;
        }
        setStudent(d.student);
        setInfo(infoOf(d.student));
        setNotes(d.student.notes ?? "");
      });
  }, [authorized, id]);

  function flash(message: string) {
    setSaved(message);
    setTimeout(() => setSaved(null), 2500);
  }

  async function patch(fields: Partial<Student>, message?: string) {
    if (!student) return false;
    setStudent({ ...student, ...fields });
    const d = await fetch("/api/admin/eleves", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: student.id, ...fields }),
    }).then((r) => r.json());
    if (d.error) {
      setError(d.error);
      return false;
    }
    if (message) flash(message);
    return true;
  }

  async function saveInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!info) return;
    setSaving(true);
    await patch({ ...info, start_date: info.start_date || null }, "Informations enregistrées");
    setSaving(false);
  }

  // Paiement coché ou décoché : sur la vente si l'élève en a une (ça peut
  // déclencher Skool comme sur la page Ventes), sinon sur l'élève.
  async function togglePayment(index: number) {
    if (!student) return;
    const p = paymentsOf(student)[index];
    if (p.saleId && student.sales) {
      setStudent({
        ...student,
        sales: { ...student.sales, sale_payments: student.sales.sale_payments.map((sp) => (sp.id === p.saleId ? { ...sp, paid: !p.paid } : sp)) },
      });
      const d = await fetch("/api/admin/ventes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: p.saleId, paid: !p.paid }),
      }).then((r) => r.json());
      if (d.error) setError(d.error);
      else if (d.skoolError) setError(`Invitation Skool impossible : ${d.skoolError}`);
      return;
    }
    patch({
      payments: student.payments.map((x, i) => (i === index ? { ...x, paid: !x.paid, paid_at: x.paid ? null : new Date().toISOString() } : x)),
    });
  }

  async function addPayment() {
    if (!student || !newPayment?.date) return;
    const list = [...student.payments, { date: newPayment.date, amount: Number(newPayment.amount) || null, paid: false }].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    if (await patch({ payments: list }, "Paiement ajouté")) setNewPayment(null);
  }

  function removePayment(index: number) {
    if (!student || !confirm("Supprimer ce paiement ?")) return;
    patch({ payments: student.payments.filter((_, i) => i !== index) }, "Paiement supprimé");
  }

  // Dernier échange avec l'élève : noté au clic sur « Ouvrir WhatsApp » ou
  // avec le bouton « J'ai échangé aujourd'hui ».
  async function markContact() {
    if (!student) return;
    setStudent({ ...student, last_contact_at: new Date().toISOString() });
    await fetch("/api/admin/eleves", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: student.id, last_contact_at: "now" }),
    });
    flash("Échange noté");
  }

  async function addLink() {
    if (!student || !newLink) return;
    const url = /^https?:\/\//.test(newLink.url.trim()) ? newLink.url.trim() : `https://${newLink.url.trim()}`;
    if (await patch({ links: [...student.links, { label: newLink.label.trim() || "Lien", url }] }, "Lien ajouté")) setNewLink(null);
  }

  function removeLink(index: number) {
    if (!student || !confirm("Supprimer ce lien ?")) return;
    patch({ links: student.links.filter((_, i) => i !== index) }, "Lien supprimé");
  }

  async function remove() {
    if (!student || !confirm(`Supprimer définitivement la fiche de ${student.name} ?`)) return;
    await fetch(`/api/admin/eleves?id=${student.id}`, { method: "DELETE" });
    window.location.href = "/admin/eleves";
  }

  if (!authorized) return null;

  const s = student;
  const payments = s ? paymentsOf(s) : [];
  const total = payments.reduce((n, p) => n + (p.amount ?? 0), 0);
  const cashed = payments.filter((p) => p.paid).reduce((n, p) => n + (p.amount ?? 0), 0);
  const status = s ? statusOf(s) : null;
  const doneSteps = s ? MILESTONES.filter(([k]) => s[k]).length : 0;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-5xl px-5 py-6 sm:py-8">
        <AdminNav current="eleves" isOwner={isOwner} />

        <Link href="/admin/eleves" className="text-[14px] font-bold text-[var(--accent2)] hover:underline">
          ‹ Tous les élèves
        </Link>

        {error && <p className="mt-4 text-sm font-semibold text-[var(--red)]">Erreur : {error}</p>}
        {!s && !error && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">Chargement...</p>}

        {s && info && status && (
          <>
            {/* En-tête */}
            <header className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <span
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-[22px] font-bold text-white"
                  style={{ background: avatarColor(s.name) }}
                >
                  {initials(s.name)}
                </span>
                <div className="min-w-0">
                  <h1 className="truncate text-[28px] font-bold tracking-tight">{s.name}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-semibold text-[var(--fg2)]">{s.app || "App à définir"}</span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${TONE_CLASSES[status.tone]}`}>{status.label}</span>
                    {s.sale_id && (
                      <Link href="/admin/ventes" className={`rounded-md px-2 py-0.5 text-xs font-bold ${TONE_CLASSES.blue}`}>
                        Voir la vente ›
                      </Link>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13.5px] font-semibold text-[var(--fg2)]">
                    Dernier échange : <span className="text-[var(--fg)]">{lastContactLabel(s.last_contact_at)}</span>
                    <button onClick={markContact} className="ml-2 text-[var(--accent2)] hover:underline">
                      J&apos;ai échangé aujourd&apos;hui
                    </button>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {saved && <span className="text-sm font-bold text-[var(--green)]">✓ {saved}</span>}
                <button onClick={() => patch({ archived: !s.archived }, s.archived ? "Élève désarchivé" : "Élève archivé")} className="mac-btn mac-btn-def mac-btn-sm">
                  {s.archived ? "Désarchiver" : "Archiver"}
                </button>
              </div>
            </header>

            {/* Chiffres clés */}
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Début", s.start_date ? frDate(s.start_date) : "-", s.start_date ? relative(s.start_date) : ""],
                ["Fin de l'accompagnement", endDate(s) ? frDate(endDate(s)!) : "-", endDate(s) ? relative(endDate(s)!) : ""],
                ["Bilan (fin de garantie)", bilanDate(s) ? frDate(bilanDate(s)!) : "-", bilanDate(s) ? relative(bilanDate(s)!) : ""],
                ["Encaissé", total > 0 ? `${money(cashed)} / ${money(total)}` : `${payments.filter((p) => p.paid).length}/${payments.length} paiements`, s.payment_label ?? ""],
              ].map(([label, value, sub]) => (
                <div key={label} className="mac-group px-4 py-3">
                  <p className="text-xs font-bold text-[var(--fg2)]">{label}</p>
                  <p className="mt-1 text-[17px] font-bold tracking-tight">{value}</p>
                  {sub && <p className="text-[12.5px] font-medium text-[var(--fg3)]">{sub}</p>}
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="space-y-5">
                {/* Parcours */}
                <Card title="Parcours" action={<span className="text-sm font-bold text-[var(--fg2)]">{doneSteps}/{MILESTONES.length}</span>}>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--field-brd)]">
                    <div className="h-full rounded-full bg-[var(--green)] transition-[width] duration-300" style={{ width: `${(doneSteps / MILESTONES.length) * 100}%` }} />
                  </div>
                  <ul className="mt-4 space-y-1">
                    {MILESTONES.map(([k, label], i) => (
                      <li key={k}>
                        <button
                          type="button"
                          onClick={() => patch({ [k]: !s[k] }, s[k] ? `« ${label} » décoché` : `« ${label} » validé`)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[var(--field)]"
                          aria-pressed={s[k]}
                        >
                          <span
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-bold ${
                              s[k] ? "bg-[var(--green)] text-white" : "border border-[var(--field-brd)] text-[var(--fg3)]"
                            }`}
                          >
                            {s[k] ? "✓" : i + 1}
                          </span>
                          <span className={`text-[15px] font-semibold ${s[k] ? "text-[var(--fg)]" : "text-[var(--fg2)]"}`}>{label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Paiements */}
                <Card
                  title="Paiements"
                  action={
                    !s.sales && (
                      <button type="button" onClick={() => setNewPayment({ date: today(), amount: "" })} className="text-sm font-bold text-[var(--accent2)]">
                        + Ajouter
                      </button>
                    )
                  }
                >
                  {payments.length === 0 && !newPayment && <p className="text-sm font-semibold text-[var(--fg2)]">Aucun paiement enregistré.</p>}
                  <ul className="divide-y divide-[var(--sep)]">
                    {payments.map((p, i) => {
                      const late = isLate(p);
                      return (
                        <li key={i} className="flex items-center gap-3 py-2.5">
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-bold">{p.amount ? money(p.amount) : "Montant non précisé"}</p>
                            <p className={`text-[13px] font-medium ${late ? "text-[var(--red)]" : "text-[var(--fg2)]"}`}>
                              {frDate(p.date)} · {p.paid ? "payé" : late ? `en retard (${relative(p.date)})` : relative(p.date)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => togglePayment(i)}
                            className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 transition-colors ${
                              p.paid
                                ? "bg-[color-mix(in_srgb,var(--green)_18%,transparent)] text-[var(--green)] ring-[color-mix(in_srgb,var(--green)_45%,transparent)]"
                                : late
                                  ? "bg-[color-mix(in_srgb,var(--red)_12%,transparent)] text-[var(--red)] ring-[color-mix(in_srgb,var(--red)_40%,transparent)]"
                                  : "text-[var(--fg2)] ring-[var(--sep)] hover:text-[var(--fg)]"
                            }`}
                          >
                            {p.paid ? "✓ Payé" : "Marquer payé"}
                          </button>
                          {!s.sales && (
                            <button type="button" onClick={() => removePayment(i)} className="px-1 text-sm font-bold text-[var(--fg3)] hover:text-[var(--red)]" aria-label="Supprimer ce paiement">
                              ✕
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {newPayment && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-[var(--field)] p-3">
                      <input type="date" className="mac-field !w-44 !py-2" value={newPayment.date} onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })} />
                      <input
                        className="mac-field !w-32 !py-2"
                        inputMode="decimal"
                        placeholder="Montant (€)"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      />
                      <button type="button" onClick={addPayment} className="mac-btn mac-btn-primary mac-btn-sm">
                        Ajouter
                      </button>
                      <button type="button" onClick={() => setNewPayment(null)} className="mac-btn mac-btn-def mac-btn-sm">
                        Annuler
                      </button>
                    </div>
                  )}
                  {s.sales && (
                    <p className="mt-3 text-[13px] font-medium text-[var(--fg2)]">
                      Paiements de la vente : les rappels par email et l&apos;invitation Skool suivent ces cases.
                    </p>
                  )}
                </Card>
              </div>

              <div className="space-y-5">
                {/* Informations */}
                <Card title="Informations">
                  <form onSubmit={saveInfo} className="space-y-3">
                    <Field label="Nom et prénom">
                      <input className="mac-field" required value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Email">
                        <input className="mac-field" type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
                      </Field>
                      <Field label="Téléphone">
                        <input className="mac-field" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
                      </Field>
                      <Field label="App">
                        <input className="mac-field" placeholder="Nom de l'app" value={info.app} onChange={(e) => setInfo({ ...info, app: e.target.value })} />
                      </Field>
                      <Field label="Date de début">
                        <input className="mac-field" type="date" value={info.start_date} onChange={(e) => setInfo({ ...info, start_date: e.target.value })} />
                      </Field>
                    </div>
                    <Field label="Formule de paiement">
                      <input className="mac-field" placeholder="ex. 3x1000" value={info.payment_label} onChange={(e) => setInfo({ ...info, payment_label: e.target.value })} />
                    </Field>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button type="submit" disabled={saving} className="mac-btn mac-btn-primary mac-btn-sm disabled:opacity-50">
                        {saving ? "Enregistrement..." : "Enregistrer"}
                      </button>
                      {s.phone && (
                        <a
                          href={`https://wa.me/${s.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={markContact}
                          className="text-sm font-bold text-[var(--green)] hover:underline"
                        >
                          Ouvrir WhatsApp
                        </a>
                      )}
                      {s.email && (
                        <a href={`mailto:${s.email}`} className="text-sm font-bold text-[var(--accent2)] hover:underline">
                          Envoyer un email
                        </a>
                      )}
                    </div>
                  </form>
                </Card>

                {/* Liens et documents */}
                <Card
                  title="Liens et documents"
                  action={
                    !newLink && (
                      <button type="button" onClick={() => setNewLink({ label: LINK_PRESETS[0], url: "" })} className="text-sm font-bold text-[var(--accent2)]">
                        + Ajouter
                      </button>
                    )
                  }
                >
                  {s.links.length === 0 && !newLink && (
                    <p className="text-sm font-semibold text-[var(--fg2)]">Audit, réponses au questionnaire, dossier Drive... tout au même endroit.</p>
                  )}
                  <ul className="divide-y divide-[var(--sep)]">
                    {s.links.map((l, i) => (
                      <li key={i} className="flex items-center gap-3 py-2.5">
                        <a href={l.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 group">
                          <p className="text-[15px] font-bold text-[var(--fg)] group-hover:text-[var(--accent2)]">{l.label} ↗</p>
                          <p className="truncate text-[12.5px] font-medium text-[var(--fg3)]">{l.url}</p>
                        </a>
                        <button type="button" onClick={() => removeLink(i)} className="px-1 text-sm font-bold text-[var(--fg3)] hover:text-[var(--red)]" aria-label={`Supprimer le lien ${l.label}`}>
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  {newLink && (
                    <div className="mt-2 space-y-3 rounded-xl bg-[var(--field)] p-3">
                      <div className="flex flex-wrap gap-1.5">
                        {LINK_PRESETS.map((label) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setNewLink({ ...newLink, label })}
                            className={`rounded-md px-2 py-1 text-xs font-bold ring-1 ${
                              newLink.label === label ? `${TONE_CLASSES.blue} ring-[color-mix(in_srgb,var(--accent)_45%,transparent)]` : "text-[var(--fg2)] ring-[var(--sep)]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <input className="mac-field !py-2" placeholder="Nom du lien" value={newLink.label} onChange={(e) => setNewLink({ ...newLink, label: e.target.value })} />
                      <input className="mac-field !py-2" placeholder="https://..." value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} />
                      <div className="flex gap-2">
                        <button type="button" onClick={addLink} disabled={!newLink.url.trim()} className="mac-btn mac-btn-primary mac-btn-sm disabled:opacity-50">
                          Ajouter le lien
                        </button>
                        <button type="button" onClick={() => setNewLink(null)} className="mac-btn mac-btn-def mac-btn-sm">
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Notes */}
                <Card
                  title="Notes"
                  action={
                    notes !== (s.notes ?? "") && (
                      <button type="button" onClick={() => patch({ notes }, "Notes enregistrées")} className="mac-btn mac-btn-primary mac-btn-sm">
                        Enregistrer
                      </button>
                    )
                  }
                >
                  <textarea
                    className="mac-field min-h-[160px]"
                    placeholder="Avancement, points à revoir, prochaine étape..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Card>

                <button onClick={remove} className="text-sm font-bold text-[var(--fg3)] hover:text-[var(--red)]">
                  Supprimer cette fiche
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
