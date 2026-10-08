"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type ContractStatus = "none" | "sent" | "delivered" | "completed" | "declined" | "voided";

type Payment = {
  id: string;
  position: number;
  amount: number;
  due_date: string;
  paid: boolean;
  paid_at: string | null;
  reminders_sent: Record<string, string>;
};

type Sale = {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  offer: string;
  total_amount: number;
  currency: string;
  installments: number;
  start_date: string | null;
  reminder_offsets: number[];
  notes: string | null;
  contract_status: ContractStatus;
  contract_sent_at: string | null;
  contract_signed_at: string | null;
  skool_invited_at: string | null;
  contract_reminders: Record<string, string>;
  meta_purchase_sent_at: string | null;
  origin: string | null;
  utm: Record<string, string>;
  archived: boolean;
  sale_payments: Payment[];
};

const ORIGIN_LABELS: Record<string, string> = {
  vsl: "Conférence (VSL)",
  "plan-action": "Plan d'action",
  guide: "Lead magnet",
  candidature: "Candidature",
};

function originLabel(origin: string | null) {
  return origin ? (ORIGIN_LABELS[origin] ?? origin) : "Origine inconnue";
}

type Bank = { holder: string; address: string; iban: string; bic: string; intermediaryBic: string; bank: string };

// Rappels proposés, en jours avant l'échéance (négatif = après, en retard).
const REMINDER_CHOICES: [number, string][] = [
  [7, "J-7"],
  [3, "J-3"],
  [1, "J-1"],
  [0, "Jour J"],
  [-3, "J+3 retard"],
  [-7, "J+7 dernier rappel"],
];
const DEFAULT_OFFSETS = [3, 1, 0, -3, -7];

function offsetLabel(o: number) {
  return o === 0 ? "jour J" : o > 0 ? `J-${o}` : `J+${-o}`;
}
const DEFAULT_OFFER = "Pack Incubateur App Mastery";

const CONTRACT_LABELS: Record<ContractStatus, { label: string; tone: Tone }> = {
  none: { label: "Pas envoyé", tone: "gray" },
  sent: { label: "Envoyé", tone: "blue" },
  delivered: { label: "Ouvert par le client", tone: "blue" },
  completed: { label: "Signé", tone: "green" },
  declined: { label: "Refusé", tone: "red" },
  voided: { label: "Annulé", tone: "red" },
};

type Tone = "red" | "orange" | "green" | "blue" | "gray";

const TONE_CLASSES: Record<Tone, string> = {
  red: "bg-[color-mix(in_srgb,var(--red)_14%,transparent)] text-[var(--red)]",
  orange: "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]",
  green: "bg-[color-mix(in_srgb,var(--green)_15%,transparent)] text-[var(--green)]",
  blue: "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent2)]",
  gray: "bg-[var(--field)] text-[var(--fg2)]",
};

function Chip({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}

function Toggle({ on, label, onChange, disabled }: { on: boolean; label: string; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 transition-colors disabled:opacity-50 ${
        on
          ? "bg-[color-mix(in_srgb,var(--green)_18%,transparent)] text-[var(--green)] ring-[color-mix(in_srgb,var(--green)_45%,transparent)]"
          : "bg-transparent text-[var(--fg2)] ring-[var(--sep)] hover:text-[var(--fg)] hover:ring-[var(--field-brd)]"
      }`}
    >
      {on ? `✓ ${label}` : label}
    </button>
  );
}

function money(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

function shortDate(iso: string) {
  const d = iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(d);
}

function today(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

// "2026-10-31" + 1 mois -> "2026-11-30" (fin de mois respectée)
function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, last));
  return target.toISOString().slice(0, 10);
}

// Échéancier régulier : montants égaux (le reste des centimes sur le 1er),
// un paiement par mois à partir de la date du 1er.
function buildSchedule(total: number, count: number, first: string): { amount: string; due_date: string }[] {
  if (!(total > 0) || count < 1) return [];
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  return Array.from({ length: count }, (_, i) => ({
    amount: String((i === 0 ? base + (cents - base * count) : base) / 100),
    due_date: addMonths(first, i),
  }));
}

function paymentState(p: Payment): { label: string; tone: Tone } {
  if (p.paid) return { label: "Payé", tone: "green" };
  const t = today();
  if (p.due_date < t) return { label: "En retard", tone: "red" };
  if (p.due_date === t) return { label: "Aujourd'hui", tone: "orange" };
  return { label: "À venir", tone: "gray" };
}

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  offer: DEFAULT_OFFER,
  total: "",
  count: 3,
  first_due: "",
  start_date: "",
  notes: "",
  company: { name: "", legalForm: "", registration: "", address: "", signerRole: "" },
  offsets: DEFAULT_OFFSETS,
  sendContract: true,
};

export default function VentesPage() {
  const [authorized, setAuthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [bank, setBank] = useState<Bank>({ holder: "", address: "", iban: "", bic: "", intermediaryBic: "", bank: "" });
  const [contracts, setContracts] = useState(false);
  const [contractTemplates, setContractTemplates] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [schedule, setSchedule] = useState<{ amount: string; due_date: string }[]>([]);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [bankOpen, setBankOpen] = useState(false);
  const [bankDraft, setBankDraft] = useState<Bank>(bank);

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
    load();
    // Arrivée depuis le CRM : /admin/ventes?email=...&prenom=...&tel=...
    const q = new URLSearchParams(window.location.search);
    if (q.get("email")) {
      setForm((f) => ({
        ...f,
        email: q.get("email") ?? "",
        first_name: q.get("prenom") ?? "",
        phone: q.get("tel") ?? "",
        first_due: today(),
      }));
      setFormOpen(true);
    }
  }, [authorized]);

  // Échéancier recalculé quand le montant, le nombre ou la 1re date change.
  useEffect(() => {
    setSchedule(buildSchedule(Number(form.total.replace(",", ".")), form.count, form.first_due || today()));
  }, [form.total, form.count, form.first_due]);

  async function load() {
    try {
      const d = await fetch("/api/admin/ventes").then((r) => r.json());
      if (d.error) throw new Error(d.error);
      setSales(d.sales);
      setBank(d.bank);
      setContracts(d.contracts);
      setContractTemplates(d.contractTemplates ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de charger les ventes");
    }
    setLoading(false);
  }

  function replaceSale(sale: Sale) {
    setSales((list) => list.map((s) => (s.id === sale.id ? sale : s)));
  }

  async function call(key: string, url: string, init: RequestInit, success?: string) {
    setBusy(key);
    setFlash(null);
    try {
      const d = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } }).then((r) => r.json());
      if (d.error) throw new Error(d.error);
      if (d.sale) replaceSale(d.sale);
      if (d.skoolError) setFlash(`Invitation Skool impossible : ${d.skoolError}`);
      else if (success) setFlash(success);
      return d;
    } catch (e) {
      setFlash(`Erreur : ${e instanceof Error ? e.message : "inconnue"}`);
      return null;
    } finally {
      setBusy(null);
    }
  }

  const patchSale = (id: string, fields: Record<string, unknown>, success?: string) =>
    call(`sale-${id}`, "/api/admin/ventes", { method: "PATCH", body: JSON.stringify({ id, ...fields }) }, success);

  const patchPayment = (p: Payment, fields: Record<string, unknown>) =>
    call(`pay-${p.id}`, "/api/admin/ventes", { method: "PATCH", body: JSON.stringify({ payment_id: p.id, ...fields }) });

  async function sendContractFor(sale: Sale) {
    if (sale.contract_status !== "none" && !confirm(`Renvoyer un nouveau contrat à ${sale.email} ?`)) return;
    await call(`contract-${sale.id}`, "/api/admin/ventes/contrat", { method: "POST", body: JSON.stringify({ id: sale.id }) }, `Contrat envoyé à ${sale.email}`);
  }

  async function inviteSkool(sale: Sale) {
    if (!confirm(`Envoyer l'invitation Skool à ${sale.email} maintenant ?`)) return;
    await call(`skool-${sale.id}`, "/api/admin/ventes/skool", { method: "POST", body: JSON.stringify({ id: sale.id }) }, `Invitation Skool envoyée à ${sale.email}`);
  }

  async function deleteSale(sale: Sale) {
    if (!confirm(`Supprimer la vente de ${sale.first_name} (${sale.email}) ? Les rappels s'arrêtent.`)) return;
    const d = await call(`sale-${sale.id}`, `/api/admin/ventes?id=${sale.id}`, { method: "DELETE" });
    if (d) setSales((list) => list.filter((s) => s.id !== sale.id));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/ventes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          offer: form.offer,
          start_date: form.start_date || null,
          notes: form.notes,
          company: Object.fromEntries(Object.entries(form.company).filter(([, v]) => v.trim())),
          reminder_offsets: form.offsets,
          payments: schedule.map((p) => ({ amount: Number(p.amount.replace(",", ".")), due_date: p.due_date })),
        }),
      }).then((r) => r.json());
      if (res.error) throw new Error(res.error);
      setSales((list) => [res.sale, ...list]);
      setForm(EMPTY_FORM);
      setFormOpen(false);
      setFlash(`Vente de ${res.sale.first_name} enregistrée.`);
      if (form.sendContract && contracts && contractTemplates.includes(res.sale.installments)) {
        await call(`contract-${res.sale.id}`, "/api/admin/ventes/contrat", { method: "POST", body: JSON.stringify({ id: res.sale.id }) }, `Vente enregistrée et contrat envoyé à ${res.sale.email}.`);
      }
    } catch (err) {
      setFlash(`Erreur : ${err instanceof Error ? err.message : "inconnue"}`);
    }
    setSaving(false);
  }

  async function saveBank() {
    const d = await call("bank", "/api/admin/ventes/banque", { method: "PUT", body: JSON.stringify(bankDraft) }, "Coordonnées bancaires enregistrées.");
    if (d?.bank) {
      setBank(d.bank);
      setBankOpen(false);
    }
  }

  const visible = useMemo(() => sales.filter((s) => s.archived === showArchived), [sales, showArchived]);

  const totals = useMemo(() => {
    const t = today();
    let cashed = 0;
    let upcoming = 0;
    let late = 0;
    for (const s of sales) {
      if (s.archived) continue;
      for (const p of s.sale_payments) {
        if (p.paid) cashed += p.amount;
        else if (p.due_date < t) late += p.amount;
        else upcoming += p.amount;
      }
    }
    return { cashed, upcoming, late };
  }, [sales]);

  // Montant vendu par origine (ventes non archivées), du plus gros au plus petit.
  const byOrigin = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of sales) {
      if (s.archived) continue;
      const k = originLabel(s.origin);
      m.set(k, (m.get(k) ?? 0) + s.total_amount);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [sales]);

  if (!authorized) return null;

  const scheduleTotal = schedule.reduce((s, p) => s + (Number(p.amount.replace(",", ".")) || 0), 0);
  const bankMissing = !bank.holder || !bank.iban;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:py-8">
        <AdminNav current="ventes" isOwner={isOwner} />

        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">Ventes</h1>
            <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">
              Déclare une vente, envoie le contrat. L&apos;invitation Skool part toute seule quand le contrat est signé et le 1er paiement reçu. Les rappels de paiement partent tout seuls.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={() => {
                  setBankDraft(bank);
                  setBankOpen((o) => !o);
                }}
                className="mac-btn mac-btn-def mac-btn-sm"
              >
                Coordonnées bancaires
              </button>
            )}
            <button
              onClick={() => {
                setForm((f) => ({ ...f, first_due: f.first_due || today() }));
                setFormOpen((o) => !o);
              }}
              className="mac-btn mac-btn-primary mac-btn-sm"
            >
              + Déclarer une vente
            </button>
          </div>
        </header>

        {flash && <p className="mt-3 text-sm font-semibold text-[var(--accent2)]">{flash}</p>}
        {error && <p className="mt-3 text-sm font-semibold text-[var(--red)]">{error}</p>}

        {!loading && !contracts && (
          <p className="mt-4 rounded-xl bg-[color-mix(in_srgb,var(--orange)_14%,transparent)] px-4 py-3 text-sm font-semibold text-[var(--orange)]">
            DocuSeal n&apos;est pas encore branché : envoie le contrat à la main puis coche « Contrat signé ».
          </p>
        )}
        {!loading && bankMissing && (
          <p className="mt-3 rounded-xl bg-[color-mix(in_srgb,var(--red)_12%,transparent)] px-4 py-3 text-sm font-semibold text-[var(--red)]">
            Coordonnées bancaires manquantes : aucun rappel de paiement ne partira tant que l&apos;IBAN n&apos;est pas renseigné.
          </p>
        )}

        {bankOpen && (
          <div className="mac-group mt-5 p-4">
            <p className="text-sm font-semibold text-[var(--fg)]">Ces informations apparaissent dans chaque rappel de paiement.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input className="mac-field" placeholder="Titulaire du compte" value={bankDraft.holder} onChange={(e) => setBankDraft({ ...bankDraft, holder: e.target.value })} />
              <input className="mac-field" placeholder="Banque (facultatif)" value={bankDraft.bank} onChange={(e) => setBankDraft({ ...bankDraft, bank: e.target.value })} />
              <input className="mac-field font-mono" placeholder="IBAN" value={bankDraft.iban} onChange={(e) => setBankDraft({ ...bankDraft, iban: e.target.value })} />
              <input className="mac-field font-mono" placeholder="BIC" value={bankDraft.bic} onChange={(e) => setBankDraft({ ...bankDraft, bic: e.target.value })} />
              <input className="mac-field" placeholder="Adresse du bénéficiaire (facultatif)" value={bankDraft.address} onChange={(e) => setBankDraft({ ...bankDraft, address: e.target.value })} />
              <input className="mac-field font-mono" placeholder="BIC intermédiaire, hors EEE (facultatif)" value={bankDraft.intermediaryBic} onChange={(e) => setBankDraft({ ...bankDraft, intermediaryBic: e.target.value })} />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={saveBank} disabled={busy === "bank"} className="mac-btn mac-btn-primary mac-btn-sm disabled:opacity-50">
                Enregistrer
              </button>
              <button onClick={() => setBankOpen(false)} className="mac-btn mac-btn-def mac-btn-sm">
                Annuler
              </button>
            </div>
          </div>
        )}

        {formOpen && (
          <form onSubmit={submit} className="mac-group mt-5 p-4 sm:p-5">
            <h2 className="text-lg font-bold">Nouvelle vente</h2>

            <p className="mac-grouplabel mt-4">Client</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="mac-field" required placeholder="Prénom" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              <input className="mac-field" placeholder="Nom" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              <input className="mac-field" required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="mac-field" required placeholder="Téléphone (obligatoire dans le contrat)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <button type="button" onClick={() => setCompanyOpen((o) => !o)} className="mt-3 text-sm font-bold text-[var(--accent2)]">
              {companyOpen ? "− Masquer la société" : "+ Le client signe au nom d'une société"}
            </button>
            {companyOpen && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input className="mac-field" placeholder="Nom de la société" value={form.company.name} onChange={(e) => setForm({ ...form, company: { ...form.company, name: e.target.value } })} />
                <input className="mac-field" placeholder="Forme juridique (SAS, SARL...)" value={form.company.legalForm} onChange={(e) => setForm({ ...form, company: { ...form.company, legalForm: e.target.value } })} />
                <input className="mac-field" placeholder="Numéro d'immatriculation (SIREN...)" value={form.company.registration} onChange={(e) => setForm({ ...form, company: { ...form.company, registration: e.target.value } })} />
                <input className="mac-field" placeholder="Adresse du siège" value={form.company.address} onChange={(e) => setForm({ ...form, company: { ...form.company, address: e.target.value } })} />
                <input className="mac-field" placeholder="Qualité du signataire (Président...)" value={form.company.signerRole} onChange={(e) => setForm({ ...form, company: { ...form.company, signerRole: e.target.value } })} />
              </div>
            )}

            <p className="mac-grouplabel mt-5">Paiement</p>
            <div className="grid gap-3 sm:grid-cols-4">
              <label className="sm:col-span-1">
                <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Montant total (€)</span>
                <input className="mac-field" required inputMode="decimal" placeholder="3000" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
              </label>
              <label>
                <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Nombre de paiements</span>
                <select className="mac-field" value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n === 1 ? "1 fois" : `${n} fois`}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">1er paiement le</span>
                <input className="mac-field" type="date" required value={form.first_due} onChange={(e) => setForm({ ...form, first_due: e.target.value })} />
              </label>
              <label>
                <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Début de l&apos;accompagnement</span>
                <input className="mac-field" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </label>
            </div>
            {contracts && !contractTemplates.includes(form.count) && (
              <p className="mt-2 text-sm font-semibold text-[var(--orange)]">
                Pas de modèle de contrat en {form.count} fois (modèles {contractTemplates.map((n) => `${n}x`).join(", ")}) : il faudra l&apos;envoyer à la main.
              </p>
            )}

            {schedule.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-xl border border-[var(--sep)]">
                {schedule.map((p, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-3 border-b border-[var(--sep)] px-3 py-2 last:border-b-0">
                    <span className="w-24 text-sm font-bold">Paiement {i + 1}</span>
                    <input
                      className="mac-field !w-36 !py-2"
                      inputMode="decimal"
                      value={p.amount}
                      aria-label={`Montant du paiement ${i + 1}`}
                      onChange={(e) => setSchedule((s) => s.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)))}
                    />
                    <input
                      className="mac-field !w-44 !py-2"
                      type="date"
                      value={p.due_date}
                      aria-label={`Date du paiement ${i + 1}`}
                      onChange={(e) => setSchedule((s) => s.map((x, j) => (j === i ? { ...x, due_date: e.target.value } : x)))}
                    />
                    {i === 0 && <span className="text-sm font-semibold text-[var(--fg2)]">Preuve de paiement à cocher à réception</span>}
                  </div>
                ))}
                <div className="bg-[var(--field)] px-3 py-2 text-sm font-bold">Total : {money(scheduleTotal)}</div>
              </div>
            )}

            <p className="mac-grouplabel mt-5">Rappels de paiement par email (avec l&apos;IBAN)</p>
            <div className="flex flex-wrap gap-2">
              {REMINDER_CHOICES.map(([o, label]) => (
                <Toggle
                  key={o}
                  on={form.offsets.includes(o)}
                  label={label}
                  onChange={(v) => setForm({ ...form, offsets: v ? [...form.offsets, o] : form.offsets.filter((x) => x !== o) })}
                />
              ))}
            </div>

            <p className="mac-grouplabel mt-5">Notes</p>
            <textarea className="mac-field" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Offre négociée, contexte..." />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="submit" disabled={saving || schedule.length === 0} className="mac-btn mac-btn-primary mac-btn-sm disabled:opacity-50">
                {saving ? "Enregistrement..." : form.sendContract && contracts && contractTemplates.includes(form.count) ? "Enregistrer et envoyer le contrat" : "Enregistrer la vente"}
              </button>
              {contracts && contractTemplates.includes(form.count) && (
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={form.sendContract} onChange={(e) => setForm({ ...form, sendContract: e.target.checked })} />
                  Envoyer le contrat tout de suite
                </label>
              )}
              <button type="button" onClick={() => setFormOpen(false)} className="mac-btn mac-btn-def mac-btn-sm">
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Chiffres */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            ["Encaissé", totals.cashed, "text-[var(--green)]"],
            ["À venir", totals.upcoming, "text-[var(--fg)]"],
            ["En retard", totals.late, totals.late > 0 ? "text-[var(--red)]" : "text-[var(--fg)]"],
          ].map(([label, value, cls]) => (
            <div key={label as string} className="mac-group px-4 py-3">
              <p className="text-xs font-bold text-[var(--fg2)]">{label as string}</p>
              <p className={`mt-1 text-2xl font-bold tracking-tight ${cls}`}>{money(value as number)}</p>
            </div>
          ))}
        </div>

        {byOrigin.length > 0 && (
          <p className="mt-3 text-sm font-semibold text-[var(--fg2)]">
            Vendu par origine :{" "}
            {byOrigin.map(([k, v], i) => (
              <span key={k}>
                {i > 0 && " · "}
                <span className="font-bold text-[var(--fg)]">{k}</span> {money(v)}
              </span>
            ))}
          </p>
        )}

        <div className="mt-6 flex items-center gap-2">
          <div className="mac-seg">
            <button className={!showArchived ? "on" : ""} onClick={() => setShowArchived(false)}>
              En cours ({sales.filter((s) => !s.archived).length})
            </button>
            <button className={showArchived ? "on" : ""} onClick={() => setShowArchived(true)}>
              Archivées ({sales.filter((s) => s.archived).length})
            </button>
          </div>
        </div>

        {loading && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">Chargement...</p>}
        {!loading && visible.length === 0 && (
          <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">
            {showArchived ? "Aucune vente archivée." : "Aucune vente pour l'instant. Clique sur « Déclarer une vente »."}
          </p>
        )}

        <div className="mt-4 space-y-4">
          {visible.map((sale) => {
            const contract = CONTRACT_LABELS[sale.contract_status];
            const first = sale.sale_payments.find((p) => p.position === 1);
            const signed = sale.contract_status === "completed";
            const canSend = contracts && contractTemplates.includes(sale.installments);
            return (
              <div key={sale.id} className="mac-group">
                {/* Client */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--sep)] px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[16px] font-bold">
                      {sale.first_name} {sale.last_name}{" "}
                      <span className="ml-1 text-[var(--accent2)]">{money(sale.total_amount, sale.currency)}</span>
                      <span className="ml-2 text-sm font-semibold text-[var(--fg2)]">
                        en {sale.installments} fois · {sale.offer}
                      </span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <Chip tone="blue">{originLabel(sale.origin)}</Chip>
                      {sale.utm.campaign && <Chip tone="gray">{sale.utm.source ? `${sale.utm.source} · ` : ""}{sale.utm.campaign}</Chip>}
                      {sale.meta_purchase_sent_at && <Chip tone="green">Envoyé à Meta</Chip>}
                    </div>
                    <p className="mt-1 text-[13px] font-medium text-[var(--fg2)]">
                      {sale.email}
                      {sale.phone ? ` · ${sale.phone}` : ""} · vendu le {shortDate(sale.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => patchSale(sale.id, { archived: !sale.archived })}
                      className="rounded-md px-2 py-1 text-xs font-bold text-[var(--fg2)] hover:bg-[var(--field)] hover:text-[var(--fg)]"
                    >
                      {sale.archived ? "Désarchiver" : "Archiver"}
                    </button>
                    <button
                      onClick={() => deleteSale(sale)}
                      className="rounded-md px-2 py-1 text-xs font-bold text-[var(--fg2)] hover:bg-[color-mix(in_srgb,var(--red)_14%,transparent)] hover:text-[var(--red)]"
                    >
                      Suppr.
                    </button>
                  </div>
                </div>

                {/* Les 3 étapes */}
                <div className="grid gap-px bg-[var(--sep)] sm:grid-cols-3">
                  <div className="bg-[var(--group)] px-4 py-3">
                    <p className="text-xs font-bold text-[var(--fg2)]">1. Contrat</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <Chip tone={contract.tone}>{contract.label}</Chip>
                      {sale.contract_signed_at && <span className="text-xs font-semibold text-[var(--fg2)]">le {shortDate(sale.contract_signed_at)}</span>}
                      {!sale.contract_signed_at && Object.keys(sale.contract_reminders).length > 0 && (
                        <span className="text-xs font-semibold text-[var(--fg2)]">
                          Relancé : {Object.keys(sale.contract_reminders).map((k) => `J+${k}`).join(", ")}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {canSend && !signed && (
                        <button
                          onClick={() => sendContractFor(sale)}
                          disabled={busy === `contract-${sale.id}`}
                          className="mac-btn mac-btn-primary mac-btn-sm !px-3 !py-1.5 disabled:opacity-50"
                        >
                          {busy === `contract-${sale.id}` ? "Envoi..." : sale.contract_status === "none" ? "Envoyer le contrat" : "Renvoyer"}
                        </button>
                      )}
                      <Toggle on={signed} label="Contrat signé" disabled={busy === `sale-${sale.id}`} onChange={(v) => patchSale(sale.id, { contract_signed: v })} />
                    </div>
                  </div>

                  <div className="bg-[var(--group)] px-4 py-3">
                    <p className="text-xs font-bold text-[var(--fg2)]">2. Preuve du 1er paiement</p>
                    {first && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <Toggle on={first.paid} label={`Reçu (${money(first.amount, sale.currency)})`} disabled={busy === `pay-${first.id}`} onChange={(v) => patchPayment(first, { paid: v })} />
                        {first.paid_at && <span className="text-xs font-semibold text-[var(--fg2)]">le {shortDate(first.paid_at)}</span>}
                      </div>
                    )}
                  </div>

                  <div className="bg-[var(--group)] px-4 py-3">
                    <p className="text-xs font-bold text-[var(--fg2)]">3. Skool</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {sale.skool_invited_at ? (
                        <Chip tone="green">Invité le {shortDate(sale.skool_invited_at)}</Chip>
                      ) : (
                        <Chip tone="gray">{signed && first?.paid ? "Envoi en cours" : "En attente du contrat et du paiement"}</Chip>
                      )}
                      <button
                        onClick={() => inviteSkool(sale)}
                        disabled={busy === `skool-${sale.id}`}
                        className="rounded-md px-2 py-1 text-xs font-bold text-[var(--accent2)] hover:bg-[var(--field)] disabled:opacity-50"
                      >
                        {sale.skool_invited_at ? "Renvoyer" : "Inviter maintenant"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Échéancier */}
                <div className="border-t border-[var(--sep)]">
                  {sale.sale_payments.map((p) => {
                    const state = paymentState(p);
                    const sent = Object.keys(p.reminders_sent)
                      .map(Number)
                      .sort((a, b) => b - a);
                    return (
                      <div key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--sep)] px-4 py-2.5 last:border-b-0">
                        <span className="w-24 text-sm font-bold">
                          {p.position}/{sale.installments}
                        </span>
                        <span className="w-24 text-sm font-bold">{money(p.amount, sale.currency)}</span>
                        <input
                          type="date"
                          defaultValue={p.due_date}
                          aria-label={`Date de l'échéance ${p.position}`}
                          disabled={p.paid}
                          onBlur={(e) => e.target.value && e.target.value !== p.due_date && patchPayment(p, { due_date: e.target.value })}
                          className="rounded-md border border-[var(--sep)] bg-[var(--field)] px-2 py-1 text-sm font-semibold disabled:opacity-60"
                        />
                        <Chip tone={state.tone}>{state.label}</Chip>
                        {sent.length > 0 && (
                          <span className="text-xs font-semibold text-[var(--fg2)]">
                            Rappel envoyé : {sent.map(offsetLabel).join(", ")}
                          </span>
                        )}
                        <span className="flex-1" />
                        <a
                          href={`/api/admin/ventes/apercu?payment=${p.id}&offset=${sale.reminder_offsets[0] ?? 3}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[var(--accent2)] hover:underline"
                        >
                          Voir le rappel
                        </a>
                        <a
                          href={`/api/admin/ventes/apercu?payment=${p.id}&offset=-7`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[var(--red)] hover:underline"
                        >
                          Voir la relance
                        </a>
                        <Toggle on={p.paid} label="Payé" disabled={busy === `pay-${p.id}`} onChange={(v) => patchPayment(p, { paid: v })} />
                      </div>
                    );
                  })}
                </div>

                {/* Rappels + notes */}
                <div className="flex flex-wrap items-center gap-2 border-t border-[var(--sep)] bg-[var(--field)] px-4 py-2.5">
                  <span className="text-xs font-bold text-[var(--fg2)]">Rappels :</span>
                  {REMINDER_CHOICES.map(([o, label]) => (
                    <Toggle
                      key={o}
                      on={sale.reminder_offsets.includes(o)}
                      label={label}
                      disabled={busy === `sale-${sale.id}`}
                      onChange={(v) =>
                        patchSale(sale.id, {
                          reminder_offsets: v ? [...sale.reminder_offsets, o] : sale.reminder_offsets.filter((x) => x !== o),
                        })
                      }
                    />
                  ))}
                  {sale.notes && <span className="ml-2 text-sm font-medium text-[var(--fg)]">· {sale.notes}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
