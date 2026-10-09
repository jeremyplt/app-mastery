"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

// Registre des commissions des closers. Une commission devient « prête à
// payer » seulement quand TOUS les paiements de l'élève sont reçus. Le
// propriétaire voit tous les closers, ajoute des commissions à la main, les
// annule (trace gardée) ou les supprime, et enregistre ses versements. Un
// closer ne voit que lui, en lecture.

type Entry = {
  kind: "sale" | "manual";
  id: string;
  created_at: string;
  label: string;
  total_amount: number | null;
  commission_rate: number | null;
  commission_amount: number;
  paid_count: number;
  payment_count: number;
  state: "ready" | "pending" | "cancelled";
  contract_cancelled: boolean;
  cancelled_at: string | null;
  cancel_reason: string | null;
  note: string | null;
  student_id: string | null;
  unlocked_on: string | null;
  unlocks_on: string | null;
};
type Payout = { id: string; amount: number; paid_on: string; note: string | null };
type Closer = {
  email: string;
  name: string | null;
  entries: Entry[];
  payouts: Payout[];
  totalSold: number;
  earned: number;
  pending: number;
  paid: number;
  due: number;
};
// Élève tel que renvoyé par /api/admin/eleves : paiements saisis à la main,
// ou ceux de sa vente s'il en a une.
type StudentPay = { date: string; amount: number | null; paid: boolean };
type StudentOption = {
  id: string;
  name: string;
  app: string | null;
  payment_label: string | null;
  payments: StudentPay[];
  sales: { sale_payments: { position: number; amount: number; due_date: string; paid: boolean }[] } | null;
};

function studentPayments(s: StudentOption): StudentPay[] {
  if (s.sales) {
    return [...s.sales.sale_payments]
      .sort((a, b) => a.position - b.position)
      .map((p) => ({ date: p.due_date, amount: Number(p.amount), paid: p.paid }));
  }
  return [...s.payments].sort((a, b) => a.date.localeCompare(b.date));
}

function money(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n);
}

function frDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso.length === 10 ? `${iso}T12:00:00` : iso));
}

function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

// Même calcul que src/lib/commissions.ts : taux x HT, HT = TTC / 1,17.
function htOf(ttc: number) {
  return Math.round((ttc / 1.17) * 100) / 100;
}
function commissionFor(ttc: number, rate: number) {
  return Math.round(htOf(ttc) * rate) / 100;
}

// Détail du calcul, affiché pour que le montant soit transparent.
// Ex. « 3 000 € TTC − TVA luxembourgeoise 17 % = 2 564,10 € HT × 20 % = 512,82 € »
function CalcDetail({ ttc, rate }: { ttc: number; rate: number }) {
  return (
    <p className="text-[12.5px] font-semibold text-[var(--fg2)]">
      {money(ttc)} TTC − TVA luxembourgeoise 17 % (÷ 1,17) = <b className="text-[var(--fg)]">{money(htOf(ttc))} HT</b> × {rate} % ={" "}
      <b className="text-[var(--accent2)]">{money(commissionFor(ttc, rate))}</b>
    </p>
  );
}

function stateBadge(e: Entry): { label: string; cls: string } {
  if (e.state === "cancelled") return { label: "Annulée", cls: "bg-[var(--field)] text-[var(--fg2)]" };
  if (e.state === "ready") return { label: "Prête à payer", cls: "bg-[color-mix(in_srgb,var(--green)_15%,transparent)] text-[var(--green)]" };
  return {
    label: `En attente (${e.paid_count}/${e.payment_count} paiements reçus)`,
    cls: "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]",
  };
}

function Tile({ label, value, tone }: { label: string; value: string; tone?: "green" | "orange" | "accent" }) {
  const color = tone === "green" ? "text-[var(--green)]" : tone === "orange" ? "text-[var(--orange)]" : tone === "accent" ? "text-[var(--accent2)]" : "text-[var(--fg)]";
  return (
    <div className="rounded-xl bg-[var(--field)] px-4 py-3">
      <p className="text-xs font-bold text-[var(--fg2)]">{label}</p>
      <p className={`mt-1 text-[20px] font-bold tracking-tight ${color}`}>{value}</p>
    </div>
  );
}

const EMPTY_ENTRY = { label: "", student_id: "", mode: "amount" as "amount" | "rate", amount: "", ttc: "3000", rate: "20", note: "" };

export default function CommissionsPage() {
  const [role, setRole] = useState<string | null>(null);
  const [closers, setClosers] = useState<Closer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payoutFor, setPayoutFor] = useState<string | null>(null);
  const [payout, setPayout] = useState({ amount: "", paid_on: today(), note: "" });
  const [entryFor, setEntryFor] = useState<string | null>(null);
  const [entry, setEntry] = useState(EMPTY_ENTRY);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [showCancelled, setShowCancelled] = useState<Record<string, boolean>>({});

  function fetchData(): Promise<{ role?: string; closers?: Closer[]; error?: string }> {
    return fetch("/api/admin/commissions")
      .then((r) => r.json())
      .catch(() => ({ error: "réseau" }));
  }

  function apply(d: { role?: string; closers?: Closer[]; error?: string }) {
    if (d.closers) {
      setClosers(d.closers);
      setRole(d.role ?? null);
    } else setError(d.error ?? "Erreur");
    setLoading(false);
  }

  async function reload() {
    apply(await fetchData());
  }

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        if (d.role === "owner" || d.role === "closer") fetchData().then(apply);
        else if (d.admin) window.location.href = "/admin/crm";
        else window.location.href = "/membres";
      })
      .catch(() => {
        window.location.href = "/membres";
      });
  }, []);

  async function send(url: string, method: string, body?: unknown) {
    const d = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then((r) => r.json());
    if (d.error) {
      setError(d.error);
      return false;
    }
    setError(null);
    await reload();
    return true;
  }

  async function savePayout(e: React.FormEvent, closer: Closer) {
    e.preventDefault();
    const ok = await send("/api/admin/commissions", "POST", {
      closer_email: closer.email,
      amount: Number(payout.amount.replace(",", ".")),
      paid_on: payout.paid_on,
      note: payout.note,
    });
    if (ok) setPayoutFor(null);
  }

  async function deletePayout(p: Payout) {
    if (!confirm(`Supprimer le versement de ${money(p.amount)} du ${frDate(p.paid_on)} ?`)) return;
    await send(`/api/admin/commissions?id=${p.id}`, "DELETE");
  }

  function openEntryForm(closer: Closer) {
    setEntry(EMPTY_ENTRY);
    setEntryFor(closer.email);
    if (students.length === 0) {
      fetch("/api/admin/eleves")
        .then((r) => r.json())
        .then((d) => setStudents(d.students ?? []))
        .catch(() => {});
    }
  }

  // Élève choisi : son échéancier remplit le montant TTC, la commission se
  // calcule en % de la vente.
  function pickStudent(id: string) {
    const st = students.find((x) => x.id === id);
    const total = st ? studentPayments(st).reduce((n, p) => n + (p.amount ?? 0), 0) : 0;
    setEntry((e) => ({ ...e, student_id: id, ...(st && total > 0 ? { mode: "rate" as const, ttc: String(total) } : {}) }));
  }

  const picked = students.find((s) => s.id === entry.student_id) ?? null;
  const pickedPayments = picked ? studentPayments(picked) : [];
  const lastPayment = pickedPayments[pickedPayments.length - 1] ?? null;

  const entryAmount =
    entry.mode === "rate"
      ? commissionFor(Number(entry.ttc.replace(",", ".")) || 0, Number(entry.rate.replace(",", ".")) || 0)
      : Number(entry.amount.replace(",", ".")) || 0;

  async function saveEntry(e: React.FormEvent, closer: Closer) {
    e.preventDefault();
    const ok = await send("/api/admin/commissions/entries", "POST", {
      closer_email: closer.email,
      label: entry.label || students.find((s) => s.id === entry.student_id)?.name || "",
      student_id: entry.student_id || null,
      amount: entryAmount,
      note: entry.note,
    });
    if (ok) setEntryFor(null);
  }

  async function cancelEntry(e: Entry) {
    const reason = prompt(`Annuler la commission de ${money(e.commission_amount)} (${e.label}) ? Elle restera visible, barrée.\n\nMotif (facultatif) :`, "");
    if (reason === null) return;
    await send("/api/admin/commissions/entries", "PATCH", { kind: e.kind, id: e.id, action: "cancel", reason });
  }

  async function restoreEntry(e: Entry) {
    await send("/api/admin/commissions/entries", "PATCH", { kind: e.kind, id: e.id, action: "restore" });
  }

  async function deleteEntry(e: Entry) {
    const message =
      e.kind === "sale"
        ? `Supprimer définitivement la commission de ${e.label} ?\n\nLe closer sera retiré de la vente (la vente, le contrat et l'élève restent). Aucune trace ne sera gardée : pour garder une trace, utilise plutôt « Annuler ».`
        : `Supprimer définitivement la commission « ${e.label} » ?\n\nAucune trace ne sera gardée : pour garder une trace, utilise plutôt « Annuler ».`;
    if (!confirm(message)) return;
    await send(`/api/admin/commissions/entries?kind=${e.kind}&id=${e.id}`, "DELETE");
  }

  if (!role && loading) return null;
  const isOwner = role === "owner";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:py-8">
        <AdminNav current="commissions" isOwner={isOwner} />

        <header>
          <h1 className="text-[28px] font-bold tracking-tight">{isOwner ? "Commissions des closers" : "Mes commissions"}</h1>
          <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">
            Commission = taux × montant HT. Le HT se calcule toujours en retirant la TVA luxembourgeoise de 17 % : TTC ÷ 1,17 (ex. 3 000 € TTC = 2 564,10 € HT, à 20 % = 512,82 €). Elle devient « prête à payer » seulement quand le dernier paiement de l&apos;élève est reçu.
          </p>
        </header>

        {error && <p className="mt-3 text-sm font-semibold text-[var(--red)]">Erreur : {error}</p>}
        {!loading && closers.length === 0 && (
          <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">
            {isOwner ? "Aucun closer pour l'instant. Ajoute-en un depuis la page Équipe (⚙️), avec le rôle « Closer »." : "Aucune vente pour l'instant."}
          </p>
        )}

        <div className="mt-6 space-y-6">
          {closers.map((c) => {
            const active = c.entries.filter((e) => e.state !== "cancelled");
            const cancelled = c.entries.filter((e) => e.state === "cancelled");
            const shown = showCancelled[c.email] ? c.entries : active;
            return (
              <section key={c.email} className="mac-group p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-[18px] font-bold">{c.name ?? c.email}</h2>
                    {c.name && <p className="text-[13px] font-medium text-[var(--fg2)]">{c.email}</p>}
                  </div>
                  {isOwner && (
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => openEntryForm(c)} className="mac-btn mac-btn-def mac-btn-sm">
                        + Ajouter une commission
                      </button>
                      {c.due > 0 && (
                        <button
                          onClick={() => {
                            setPayout({ amount: String(c.due), paid_on: today(), note: "" });
                            setPayoutFor(c.email);
                          }}
                          className="mac-btn mac-btn-primary mac-btn-sm"
                        >
                          Enregistrer un versement
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                  <Tile label="Commissions" value={String(active.length)} />
                  <Tile label="Total vendu (TTC)" value={money(c.totalSold)} />
                  <Tile label="En attente des élèves" value={money(c.pending)} tone="orange" />
                  <Tile label="Déjà payé" value={money(c.paid)} tone="green" />
                  {c.due >= 0 ? <Tile label="Reste à payer" value={money(c.due)} tone="accent" /> : <Tile label="Avance versée" value={money(-c.due)} tone="orange" />}
                </div>

                {isOwner && entryFor === c.email && (
                  <form onSubmit={(e) => saveEntry(e, c)} className="mt-4 space-y-3 rounded-xl bg-[var(--field)] p-4">
                    <p className="text-[15px] font-bold">Nouvelle commission pour {c.name ?? c.email}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label>
                        <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Élève (facultatif)</span>
                        <select className="mac-field" value={entry.student_id} onChange={(e) => pickStudent(e.target.value)}>
                          <option value="">Aucun : prête à payer tout de suite</option>
                          {students.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                              {s.app ? ` (${s.app})` : ""}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Libellé</span>
                        <input
                          className="mac-field"
                          required={!entry.student_id}
                          placeholder={entry.student_id ? "Par défaut : le nom de l'élève" : "Ex. prime de septembre"}
                          value={entry.label}
                          onChange={(e) => setEntry({ ...entry, label: e.target.value })}
                        />
                      </label>
                    </div>
                    {picked && (
                      <div className="rounded-xl bg-[var(--group)] p-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-[14px] font-bold">Paiements de {picked.name}</p>
                          {picked.payment_label && <p className="text-[13px] font-semibold text-[var(--fg2)]">Formule : {picked.payment_label}</p>}
                        </div>
                        {pickedPayments.length === 0 ? (
                          <p className="mt-2 text-[13px] font-semibold text-[var(--orange)]">
                            Aucun paiement enregistré sur sa fiche : ajoute-les sur la fiche de l&apos;élève, sinon la commission ne pourra pas se débloquer.
                          </p>
                        ) : (
                          <>
                            <ul className="mt-2 divide-y divide-[var(--sep)]">
                              {pickedPayments.map((p, i) => {
                                const late = !p.paid && p.date < today();
                                return (
                                  <li key={i} className="flex items-center justify-between gap-3 py-1.5 text-[13.5px]">
                                    <span className="font-semibold">
                                      {i + 1}. {frDate(p.date)}
                                    </span>
                                    <span className="font-bold">{p.amount ? money(p.amount) : "montant non précisé"}</span>
                                    <span
                                      className={`w-24 text-right text-xs font-bold ${p.paid ? "text-[var(--green)]" : late ? "text-[var(--red)]" : "text-[var(--fg2)]"}`}
                                    >
                                      {p.paid ? "✓ Payé" : late ? "En retard" : "À venir"}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                            <p className="mt-2 text-[13px] font-semibold text-[var(--fg2)]">
                              Total {money(pickedPayments.reduce((n, p) => n + (p.amount ?? 0), 0))} TTC, soit{" "}
                              {money(Math.round((pickedPayments.reduce((n, p) => n + (p.amount ?? 0), 0) / 1.17) * 100) / 100)} HT.
                            </p>
                            <p className="mt-1 text-[13.5px] font-bold">
                              {pickedPayments.every((p) => p.paid)
                                ? "🔓 Tous les paiements sont reçus : la commission sera prête à payer tout de suite."
                                : `🔒 Débloquée quand le dernier virement (${lastPayment?.amount ? money(lastPayment.amount) + ", " : ""}prévu le ${lastPayment ? frDate(lastPayment.date) : "-"}) sera marqué payé.`}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                    <div className="mac-seg">
                      <button type="button" className={entry.mode === "amount" ? "on" : ""} onClick={() => setEntry({ ...entry, mode: "amount" })}>
                        Montant fixe
                      </button>
                      <button type="button" className={entry.mode === "rate" ? "on" : ""} onClick={() => setEntry({ ...entry, mode: "rate" })}>
                        % d&apos;une vente
                      </button>
                    </div>
                    {entry.mode === "amount" ? (
                      <label className="block">
                        <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Montant de la commission (€)</span>
                        <input className="mac-field !w-44" required inputMode="decimal" value={entry.amount} onChange={(e) => setEntry({ ...entry, amount: e.target.value })} />
                      </label>
                    ) : (
                      <div className="flex flex-wrap items-end gap-3">
                        <label>
                          <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Montant de la vente (€ TTC)</span>
                          <input className="mac-field !w-40" inputMode="decimal" value={entry.ttc} onChange={(e) => setEntry({ ...entry, ttc: e.target.value })} />
                        </label>
                        <label>
                          <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Taux (% du HT)</span>
                          <input className="mac-field !w-28" inputMode="decimal" value={entry.rate} onChange={(e) => setEntry({ ...entry, rate: e.target.value })} />
                        </label>
                        <p className="pb-3 text-sm font-semibold">
                          → <b className="text-[var(--accent2)]">{money(entryAmount)}</b>
                        </p>
                        <div className="w-full">
                          <CalcDetail ttc={Number(entry.ttc.replace(",", ".")) || 0} rate={Number(entry.rate.replace(",", ".")) || 0} />
                        </div>
                      </div>
                    )}
                    <input className="mac-field" placeholder="Note (facultatif)" value={entry.note} onChange={(e) => setEntry({ ...entry, note: e.target.value })} />
                    <div className="flex gap-2">
                      <button type="submit" disabled={!(entryAmount > 0)} className="mac-btn mac-btn-primary mac-btn-sm disabled:opacity-50">
                        Ajouter {entryAmount > 0 ? money(entryAmount) : ""}
                      </button>
                      <button type="button" onClick={() => setEntryFor(null)} className="mac-btn mac-btn-def mac-btn-sm">
                        Annuler
                      </button>
                    </div>
                  </form>
                )}

                {isOwner && payoutFor === c.email && (
                  <form onSubmit={(e) => savePayout(e, c)} className="mt-4 flex flex-wrap items-end gap-3 rounded-xl bg-[var(--field)] p-4">
                    <label>
                      <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Montant versé (€)</span>
                      <input className="mac-field !w-36" required inputMode="decimal" value={payout.amount} onChange={(e) => setPayout({ ...payout, amount: e.target.value })} />
                    </label>
                    <label>
                      <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Date</span>
                      <input className="mac-field !w-44" type="date" value={payout.paid_on} onChange={(e) => setPayout({ ...payout, paid_on: e.target.value })} />
                    </label>
                    <label className="min-w-[200px] flex-1">
                      <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Note (facultatif)</span>
                      <input className="mac-field" placeholder="Virement, période..." value={payout.note} onChange={(e) => setPayout({ ...payout, note: e.target.value })} />
                    </label>
                    <button type="submit" className="mac-btn mac-btn-primary mac-btn-sm">
                      Enregistrer
                    </button>
                    <button type="button" onClick={() => setPayoutFor(null)} className="mac-btn mac-btn-def mac-btn-sm">
                      Annuler
                    </button>
                  </form>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                  <h3 className="text-[14px] font-bold text-[var(--fg2)]">Commissions</h3>
                  {cancelled.length > 0 && (
                    <button
                      onClick={() => setShowCancelled((m) => ({ ...m, [c.email]: !m[c.email] }))}
                      className="text-xs font-bold text-[var(--accent2)] hover:underline"
                    >
                      {showCancelled[c.email] ? "Masquer les annulées" : `Voir les annulées (${cancelled.length})`}
                    </button>
                  )}
                </div>
                {shown.length === 0 ? (
                  <p className="mt-2 text-sm font-semibold text-[var(--fg3)]">Aucune commission.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-[var(--sep)]">
                    {shown.map((e) => {
                      const badge = stateBadge(e);
                      const off = e.state === "cancelled";
                      return (
                        <li key={`${e.kind}-${e.id}`} className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 py-3 ${off ? "opacity-70" : ""}`}>
                          <div className="min-w-[200px] flex-1">
                            <p className={`text-[15px] font-bold ${off ? "line-through" : ""}`}>{e.label}</p>
                            <p className="text-[12.5px] font-medium text-[var(--fg2)]">
                              {e.kind === "sale" ? `Vente du ${frDate(e.created_at)} · ${money(e.total_amount ?? 0)} TTC` : `Ajoutée à la main le ${frDate(e.created_at)}`}
                              {e.note && e.kind === "manual" ? ` · ${e.note}` : ""}
                            </p>
                            {!off && e.state === "ready" && e.unlocked_on && (
                              <p className="text-[12.5px] font-semibold text-[var(--green)]">🔓 Débloquée le {frDate(e.unlocked_on)}</p>
                            )}
                            {!off && e.state === "pending" && (
                              <p className="text-[12.5px] font-semibold text-[var(--orange)]">
                                🔒 Se débloque à réception du dernier virement{e.unlocks_on ? `, prévu le ${frDate(e.unlocks_on)}` : ""}
                              </p>
                            )}
                            {off && (
                              <p className="text-[12.5px] font-semibold text-[var(--fg2)]">
                                Annulée{e.cancelled_at ? ` le ${frDate(e.cancelled_at)}` : ""}
                                {e.cancel_reason ? ` · ${e.cancel_reason}` : ""}
                              </p>
                            )}
                          </div>
                          <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${badge.cls}`}>{badge.label}</span>
                          <p className={`w-32 text-right text-[15px] font-bold ${off ? "text-[var(--fg3)] line-through" : ""}`}>
                            {money(e.commission_amount)}
                            {e.commission_rate !== null && e.total_amount !== null && (
                              <span className="block text-[11.5px] font-semibold text-[var(--fg3)] no-underline">
                                {e.commission_rate} % de {money(htOf(e.total_amount))} HT
                              </span>
                            )}
                          </p>
                          {isOwner && (
                            <div className="flex w-full justify-end gap-1 sm:w-auto">
                              {off ? (
                                !e.contract_cancelled && (
                                  <button onClick={() => restoreEntry(e)} className="rounded-md px-2 py-1 text-xs font-bold text-[var(--accent2)] hover:bg-[var(--field)]">
                                    Réactiver
                                  </button>
                                )
                              ) : (
                                <button onClick={() => cancelEntry(e)} className="rounded-md px-2 py-1 text-xs font-bold text-[var(--fg2)] hover:bg-[var(--field)] hover:text-[var(--fg)]">
                                  Annuler
                                </button>
                              )}
                              <button onClick={() => deleteEntry(e)} className="rounded-md px-2 py-1 text-xs font-bold text-[var(--fg3)] hover:bg-[color-mix(in_srgb,var(--red)_12%,transparent)] hover:text-[var(--red)]">
                                Supprimer
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <h3 className="mt-6 text-[14px] font-bold text-[var(--fg2)]">Versements</h3>
                {c.payouts.length === 0 ? (
                  <p className="mt-2 text-sm font-semibold text-[var(--fg3)]">Aucun versement pour l&apos;instant.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-[var(--sep)]">
                    {c.payouts.map((p) => (
                      <li key={p.id} className="flex items-center gap-4 py-2.5">
                        <div className="flex-1">
                          <p className="text-[15px] font-bold text-[var(--green)]">{money(p.amount)}</p>
                          <p className="text-[12.5px] font-medium text-[var(--fg2)]">
                            Versé le {frDate(p.paid_on)}
                            {p.note ? ` · ${p.note}` : ""}
                          </p>
                        </div>
                        {isOwner && (
                          <button onClick={() => deletePayout(p)} className="text-xs font-bold text-[var(--fg3)] hover:text-[var(--red)]">
                            Supprimer
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
