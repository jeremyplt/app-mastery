"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { supabase } from "@/lib/supabase";

// Comptabilité automatique de SDG STUDIO : chaque dépense de la banque et la
// pièce que le job du serveur a retrouvée pour elle. Jeremy ne fait ici que ce
// que le job ne peut pas faire seul : confirmer une pièce douteuse, ajouter la
// photo d'un ticket, ou dire qu'il n'y a pas de pièce. Propriétaire seulement.

type Statut = "manquant" | "a_valider" | "justifie" | "sans_justificatif";
type Piece = {
  id: string;
  source: string;
  nom: string | null;
  fournisseur: string | null;
  total: number | null;
  devise: string | null;
  date: string | null;
  odooId: number | null;
  odooDossier: string | null;
  url: string | null;
};
type Depense = {
  id: string;
  date: string;
  montant: number;
  devise: string;
  marchand: string;
  libelle: string | null;
  categorie: string;
  statut: Statut;
  note: string | null;
  rapprochement: string | null;
  piece: Piece | null;
};

const ODOO = "https://pitault-media.odoo.com";
const MAX_BYTES = 15 * 1024 * 1024;
const TYPES = ["application/pdf", "image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];
const ACCEPT = TYPES.join(",");
const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DELAI_JOURS = 2; // le mail d'une facture peut arriver un ou deux jours après le paiement

const CHIP: Record<Statut, { label: string; cls: string }> = {
  justifie: { label: "Justifiée", cls: "bg-[color-mix(in_srgb,var(--green)_15%,transparent)] text-[var(--green)]" },
  a_valider: { label: "À valider", cls: "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent2)]" },
  manquant: { label: "Manquante", cls: "bg-[color-mix(in_srgb,var(--orange)_16%,transparent)] text-[var(--orange)]" },
  sans_justificatif: { label: "Sans pièce", cls: "bg-[var(--field)] text-[var(--fg2)]" },
};

function money(n: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function shortDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${iso.slice(0, 10)}T12:00:00Z`));
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return `${MOIS[Number(m) - 1]} ${y}`;
}

function odooLink(id: number) {
  return `${ODOO}/web#id=${id}&model=documents.document&view_type=form`;
}

function fileType(f: File) {
  if (f.type) return f.type;
  if (/\.hei[cf]$/i.test(f.name)) return "image/heic";
  return "";
}

// « Déposée dans Odoo › Novembre », ou ce qui reste à faire pour la pièce.
function where(d: Depense) {
  const p = d.piece;
  if (!p) return null;
  if (p.odooId) {
    const dossier = p.odooDossier?.split(" › ").slice(-1)[0];
    return dossier ? `Dans Odoo › ${dossier}` : "Dans Odoo";
  }
  if (d.statut === "justifie") return "Sera déposée dans Odoo au prochain passage";
  return null;
}

function PieceLink({ p }: { p: Piece }) {
  const href = p.url ?? (p.odooId ? odooLink(p.odooId) : null);
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="font-bold text-[var(--accent2)] underline">
      Voir
    </a>
  );
}

export default function ComptaPage() {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [noPiece, setNoPiece] = useState<string | null>(null);
  const [raison, setRaison] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadFor = useRef<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/compta");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Erreur de chargement");
    setDepenses(data.depenses);
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

  const decide = (d: Depense, action: "valider" | "refuser" | "sans_piece" | "remettre", motif?: string) =>
    run(`${action}-${d.id}`, async () => {
      const res = await fetch(`/api/admin/compta/${d.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, raison: motif }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Modification impossible");
      setNoPiece(null);
      setRaison("");
      await load();
      setNotice(
        action === "valider"
          ? `Pièce de ${d.marchand} validée. Le serveur la déposera dans Odoo au prochain passage.`
          : action === "refuser"
            ? `Pièce refusée pour ${d.marchand}. Elle ne sera plus proposée.`
            : action === "sans_piece"
              ? `${d.marchand} est classée sans pièce.`
              : `${d.marchand} est de nouveau à justifier.`,
      );
    });

  function pickFile(d: Depense) {
    uploadFor.current = d.id;
    if (fileInput.current) {
      fileInput.current.value = "";
      fileInput.current.click();
    }
  }

  async function onFile(f: File | null) {
    const id = uploadFor.current;
    const d = depenses.find((x) => x.id === id);
    if (!f || !d) return;
    const type = fileType(f);
    if (!TYPES.includes(type)) return setError("Envoie un PDF ou une photo (JPG, PNG, HEIC ou WebP).");
    if (f.size > MAX_BYTES) return setError("Ce fichier dépasse 15 Mo. Essaie une photo moins lourde ou un PDF.");
    await run(`piece-${d.id}`, async () => {
      const start = await fetch(`/api/admin/compta/${d.id}/piece`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, size: f.size }) }).then((r) => r.json());
      if (start.error) throw new Error(start.error);
      const up = await supabase.storage.from("compta").uploadToSignedUrl(start.path, start.uploadToken, f, { contentType: type });
      if (up.error) throw new Error("L'envoi a échoué. Vérifie ta connexion et réessaie.");
      const done = await fetch(`/api/admin/compta/${d.id}/piece`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: start.path, type, name: f.name }) }).then((r) => r.json());
      if (done.error) throw new Error(done.error);
      await load();
      setNotice(`Pièce ajoutée pour ${d.marchand}. Le serveur la déposera dans Odoo au prochain passage.`);
    });
  }

  const limite = useMemo(() => new Date(Date.now() - DELAI_JOURS * 86_400_000).toISOString().slice(0, 10), []);
  const aValider = depenses.filter((d) => d.statut === "a_valider");
  const manquantes = depenses.filter((d) => d.statut === "manquant" && d.date <= limite);

  const mois = useMemo(() => {
    const groups = new Map<string, Depense[]>();
    for (const d of depenses) {
      const k = d.date.slice(0, 7);
      groups.set(k, [...(groups.get(k) ?? []), d]);
    }
    return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [depenses]);

  const total = depenses.filter((d) => d.statut !== "sans_justificatif").length;
  const justifiees = depenses.filter((d) => d.statut === "justifie").length;
  const isBusy = busy !== null;

  // Appelée comme une fonction, pas comme un composant : sinon le champ « Pourquoi ? »
  // serait recréé à chaque frappe et perdrait le curseur.
  function actions(d: Depense, place: "todo" | "mois") {
    const formKey = `${place}-${d.id}`;
    if (d.statut === "a_valider") {
      return (
        <div className="mt-2 flex flex-wrap gap-2">
          <button onClick={() => decide(d, "valider")} disabled={isBusy} className="mac-btn mac-btn-primary disabled:opacity-50">
            {busy === `valider-${d.id}` ? "Validation..." : "Oui, c'est la bonne pièce"}
          </button>
          <button onClick={() => decide(d, "refuser")} disabled={isBusy} className="mac-btn mac-btn-def disabled:opacity-50">
            {busy === `refuser-${d.id}` ? "Refus..." : "Non"}
          </button>
          <button onClick={() => pickFile(d)} disabled={isBusy} className="mac-btn mac-btn-def disabled:opacity-50">
            {busy === `piece-${d.id}` ? "Envoi..." : "Ajouter une autre pièce"}
          </button>
        </div>
      );
    }
    if (d.statut === "manquant") {
      return (
        <div className="mt-2">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => pickFile(d)} disabled={isBusy} className="mac-btn mac-btn-primary disabled:opacity-50">
              {busy === `piece-${d.id}` ? "Envoi..." : "Ajouter la pièce"}
            </button>
            <button
              onClick={() => {
                setNoPiece(noPiece === formKey ? null : formKey);
                setRaison("");
              }}
              disabled={isBusy}
              aria-expanded={noPiece === formKey}
              className="mac-btn mac-btn-def disabled:opacity-50"
            >
              Pas de pièce à fournir
            </button>
          </div>
          {noPiece === formKey && (
            <div className="mt-2 flex flex-wrap items-end gap-2">
              <label className="min-w-[220px] flex-1">
                <span className="mb-1 block text-xs font-bold text-[var(--fg2)]">Pourquoi ? (facultatif)</span>
                <input className="mac-field" placeholder="Dépense perso" value={raison} maxLength={300} onChange={(e) => setRaison(e.target.value)} />
              </label>
              <button onClick={() => decide(d, "sans_piece", raison)} disabled={isBusy} className="mac-btn mac-btn-def disabled:opacity-50">
                {busy === `sans_piece-${d.id}` ? "Enregistrement..." : "Confirmer"}
              </button>
            </div>
          )}
        </div>
      );
    }
    if (d.statut === "sans_justificatif" && (d.categorie === "fournisseur" || d.categorie === "frais_bancaires")) {
      return (
        <button onClick={() => decide(d, "remettre")} disabled={isBusy} className="mt-1 rounded-md px-0 py-1 text-[13px] font-bold text-[var(--accent2)] underline disabled:opacity-50">
          Remettre à justifier
        </button>
      );
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-4xl px-5 py-6 sm:py-8">
        <AdminNav current="compta" isOwner />

        <header>
          <h1 className="text-[28px] font-bold tracking-tight">Compta</h1>
          <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">
            Le serveur cherche tous les jours à 7 h et à 19 h la facture de chaque dépense Revolut dans Gmail, dans les reçus de l&apos;app Revolut et dans Odoo, puis la dépose dans Odoo › Comptabilité › Factures fournisseurs, là où SKG la prend.
          </p>
          {!loading && total > 0 && (
            <p className="mt-2 text-[15px] font-bold">
              {justifiees} dépenses justifiées sur {total} depuis l&apos;ouverture du compte.
            </p>
          )}
        </header>

        <input ref={fileInput} type="file" accept={ACCEPT} className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />

        <div aria-live="polite">
          {notice && <p className="mt-4 text-sm font-semibold text-[var(--green)]">{notice}</p>}
          {error && (
            <p role="alert" className="mt-4 text-sm font-semibold text-[var(--red)]">
              {error}
            </p>
          )}
        </div>

        {loading && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">Chargement...</p>}

        {!loading && (
          <section className="mac-group mt-5 px-4 py-3" aria-label="À faire">
            <h2 className="text-[16px] font-bold">À faire ({aValider.length + manquantes.length})</h2>
            {aValider.length + manquantes.length === 0 ? (
              <p className="mt-1 text-[14px] font-medium text-[var(--fg2)]">Rien à faire : toutes les dépenses de plus de {DELAI_JOURS} jours ont leur pièce.</p>
            ) : (
              <ul className="mt-1 divide-y divide-[var(--sep)]">
                {aValider.map((d) => (
                  <li key={d.id} className="py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="text-[15px] font-bold">
                        {d.marchand} · {money(d.montant, d.devise)}
                      </p>
                      <p className="text-[13px] font-semibold text-[var(--fg2)]">{shortDate(d.date)}</p>
                    </div>
                    {d.piece && (
                      <p className="mt-1 text-[14px] font-medium">
                        Pièce proposée : <span className="font-bold">{d.piece.nom ?? "document"}</span>
                        {d.piece.fournisseur || d.piece.total != null ? (
                          <span className="text-[var(--fg2)]">
                            {" "}
                            ({[d.piece.fournisseur, d.piece.total != null && d.piece.devise ? money(d.piece.total, d.piece.devise) : null, d.piece.date ? shortDate(d.piece.date) : null].filter(Boolean).join(", ")})
                          </span>
                        ) : null}{" "}
                        <PieceLink p={d.piece} />
                      </p>
                    )}
                    {d.note && <p className="text-[13px] font-medium text-[var(--fg2)]">Pourquoi : {d.note}</p>}
                    {actions(d, "todo")}
                  </li>
                ))}
                {manquantes.map((d) => (
                  <li key={d.id} className="py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="text-[15px] font-bold">
                        {d.marchand} · {money(d.montant, d.devise)}
                      </p>
                      <p className="text-[13px] font-semibold text-[var(--fg2)]">{shortDate(d.date)}</p>
                    </div>
                    <p className="text-[13px] font-medium text-[var(--fg2)]">Aucune facture trouvée. Une photo du ticket suffit.</p>
                    {actions(d, "todo")}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {!loading &&
          mois.map(([key, list]) => {
            const aJustifier = list.filter((d) => d.statut !== "sans_justificatif");
            const ok = aJustifier.filter((d) => d.statut === "justifie").length;
            return (
              <section key={key} className="mt-6" aria-label={monthLabel(key)}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 px-1">
                  <h2 className="text-[18px] font-bold">{monthLabel(key)}</h2>
                  <p className={`text-[14px] font-bold ${ok === aJustifier.length ? "text-[var(--green)]" : "text-[var(--fg2)]"}`}>
                    {ok} sur {aJustifier.length} justifiées
                  </p>
                </div>
                <ul className="mac-group mt-2 divide-y divide-[var(--sep)] overflow-hidden">
                  {list.map((d) => {
                    const lieu = where(d);
                    return (
                      <li key={d.id} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-bold">{d.marchand}</p>
                            <p className="text-[13px] font-medium text-[var(--fg2)]">
                              {shortDate(d.date)}
                              {d.piece && (d.piece.url || d.piece.odooId) ? (
                                <>
                                  {" · "}
                                  <PieceLink p={d.piece} />
                                </>
                              ) : null}
                              {lieu ? ` · ${lieu}` : ""}
                            </p>
                            {d.statut === "sans_justificatif" && d.note && <p className="text-[13px] font-medium text-[var(--fg2)]">{d.note}</p>}
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <span className="text-[15px] font-bold tabular-nums">{money(d.montant, d.devise)}</span>
                            <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${CHIP[d.statut].cls}`}>{CHIP[d.statut].label}</span>
                          </div>
                        </div>
                        {(d.statut === "manquant" || d.statut === "sans_justificatif") && actions(d, "mois")}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

        {!loading && !error && depenses.length === 0 && <p className="mt-6 text-sm font-semibold text-[var(--fg2)]">Aucune dépense pour l&apos;instant : le serveur n&apos;est pas encore passé.</p>}
      </div>
    </div>
  );
}
