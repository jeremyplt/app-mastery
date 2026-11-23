import { createHash } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { odooClient } from "@/lib/facturation/adapters";
import { gmailBranche, mailsAvecPieces, requeteFactures, telechargerPiece } from "./gmail";
import { lirePiece } from "./lecture";
import { odooDocuments } from "./odoo-documents";
import { DEBUT, MCC_RESTAURANT, MOIS, classer, nomDepot, rapprocher, sansAccent, type Lu } from "./regles";
import { comptes, depensesRevolut, operations, recu } from "./revolut";

// Un passage de la comptabilité automatique de SDG STUDIO :
//  1. les dépenses de la banque (Revolut) ;
//  2. les pièces trouvées : reçus joints dans l'app Revolut, factures déjà déposées
//     dans Odoo Documents, pièces jointes des mails de facture (Gmail) ;
//  3. lecture de chaque nouvelle pièce par Claude, sans outils ;
//  4. rapprochement par le code (montant, fournisseur, date) ;
//  5. dépôt dans Odoo Documents › Comptabilité › année › Factures fournisseurs › mois,
//     là où SKG prend les pièces. Seule une pièce rattachée à une vraie dépense est
//     déposée ; rien n'est jamais supprimé ni remplacé dans Odoo.

const SOCIETE = "sdg";
const BUCKET = "compta";
const ESSAIS_MAX = 3;
const PETITE_IMAGE = 15_000; // logos et signatures des mails

export type Rapport = {
  depenses_nouvelles: number;
  pieces_nouvelles: { revolut: number; odoo: number; gmail: number };
  lues: number;
  rapprochees: number;
  a_valider: number;
  deposees: { depense: string; nom: string; dossier: string }[];
  manquantes: { date: string; marchand: string; montant: string }[];
  erreurs: string[];
  gmail: "branché" | "pas encore branché";
};

const sha1 = (b: Buffer) => createHash("sha1").update(b).digest("hex");

// « 2026 › Factures fournisseurs › Octobre » → « 2026-10 ».
function moisDuDossier(chemin: string | null): string | null {
  const m = chemin?.match(/^(\d{4}) › .* › ([^›]+)$/);
  if (!m) return null;
  const i = MOIS.findIndex((x) => sansAccent(x) === sansAccent(m[2]));
  return i < 0 ? null : `${m[1]}-${String(i + 1).padStart(2, "0")}`;
}

function check<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(`Supabase : ${r.error.message}`);
  return r.data;
}

export function db(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, { auth: { persistSession: false } });
}

type DocRow = { id: string; source: string; source_ref: string; sha1: string | null; nom_fichier: string | null; mime: string | null; stockage: string | null; mail_de: string | null; mail_objet: string | null; nature: string | null; fournisseur: string | null; date_doc: string | null; total: number | null; devise: string | null; odoo_document_id: number | null; odoo_dossier: string | null; statut: string; essais: number; depense_revolut: string | null; mail_date?: string | null };
type DepRow = { id: string; date: string; montant: number; devise: string; montant_facture: number | null; devise_facture: string | null; marchand: string; categorie: string; statut: string; document_id: string | null; expense_id: string | null; documents_refuses?: string[]; raw?: { merchant?: { category_code?: string } } | null };

export async function passage(opts: { ecrire: boolean; deposer?: boolean; lecturesMax?: number; log?: (m: string) => void }): Promise<Rapport> {
  const log = opts.log ?? (() => undefined);
  const base = db();
  const rapport: Rapport = { depenses_nouvelles: 0, pieces_nouvelles: { revolut: 0, odoo: 0, gmail: 0 }, lues: 0, rapprochees: 0, a_valider: 0, deposees: [], manquantes: [], erreurs: [], gmail: gmailBranche() ? "branché" : "pas encore branché" };
  const { kw } = odooClient();
  const odoo = odooDocuments(kw);

  // 1. Dépenses ─────────────────────────────────────────────────────────────
  const nos = await comptes();
  const ops = await operations(DEBUT);
  const classees = ops.map((t) => classer(t, nos)).filter((d): d is NonNullable<typeof d> => d !== null);
  const connues = new Set((check(await base.from("compta_depenses").select("id").eq("societe", SOCIETE)) as { id: string }[]).map((r) => r.id));
  const nouvelles = classees.filter((d) => !connues.has(d.id));
  const rawParId = new Map(ops.map((t) => [t.id, t]));
  if (nouvelles.length && opts.ecrire) check(await base.from("compta_depenses").insert(nouvelles.map((d) => ({ ...d, societe: SOCIETE, raw: rawParId.get(d.id) }))));
  rapport.depenses_nouvelles = nouvelles.length;
  // Un paiement annulé après coup n'a plus besoin de pièce.
  const annulees = ops.filter((t) => connues.has(t.id) && ["reverted", "declined", "failed"].includes(t.state)).map((t) => t.id);
  if (annulees.length && opts.ecrire) check(await base.from("compta_depenses").update({ statut: "sans_justificatif", note: "Paiement annulé par la banque.", updated_at: new Date().toISOString() }).in("id", annulees).eq("statut", "manquant"));
  log(`${classees.length} dépenses, dont ${nouvelles.length} nouvelles`);

  const docsConnus = check(await base.from("compta_documents").select("source, source_ref, sha1, odoo_document_id").eq("societe", SOCIETE)) as Pick<DocRow, "source" | "source_ref" | "sha1" | "odoo_document_id">[];
  const refs = new Set(docsConnus.map((d) => `${d.source}:${d.source_ref}`));
  const empreintes = new Set(docsConnus.map((d) => d.sha1).filter(Boolean));
  const odooConnus = new Set(docsConnus.map((d) => d.odoo_document_id).filter(Boolean));

  async function nouvellePiece(p: { source: "revolut" | "odoo" | "gmail"; ref: string; contenu?: Buffer; empreinte?: string | null; nom: string; mime: string; extra?: Record<string, unknown> }) {
    const empreinte = p.empreinte ?? (p.contenu ? sha1(p.contenu) : null);
    const doublon = !!empreinte && empreintes.has(empreinte);
    let stockage: string | null = null;
    if (p.contenu && !doublon && opts.ecrire) {
      stockage = `${SOCIETE}/${p.source}/${p.ref.replace(/[^a-zA-Z0-9_-]+/g, "_")}`;
      const up = await base.storage.from(BUCKET).upload(stockage, p.contenu, { contentType: p.mime, upsert: true });
      if (up.error) throw new Error(`Stockage : ${up.error.message}`);
    }
    if (opts.ecrire) {
      check(await base.from("compta_documents").insert({ societe: SOCIETE, source: p.source, source_ref: p.ref, sha1: empreinte, nom_fichier: p.nom, mime: p.mime, taille: p.contenu?.length ?? null, stockage, statut: doublon ? "doublon" : "a_lire", ...p.extra }));
    }
    refs.add(`${p.source}:${p.ref}`);
    if (empreinte) empreintes.add(empreinte);
    if (!doublon) rapport.pieces_nouvelles[p.source] += 1;
  }

  // 2a. Reçus joints dans l'app Revolut (photo d'un ticket, reçu de frais).
  const expenses = await depensesRevolut();
  const parTransaction = new Map(expenses.filter((e) => e.transaction_id).map((e) => [e.transaction_id as string, e]));
  for (const d of classees) {
    const e = parTransaction.get(d.id);
    if (!e) continue;
    if (opts.ecrire && !connues.has(d.id)) await base.from("compta_depenses").update({ expense_id: e.id }).eq("id", d.id);
    for (const r of e.receipt_ids) {
      const ref = `${e.id}:${r}`;
      if (refs.has(`revolut:${ref}`)) continue;
      try {
        const { contenu, mime } = await recu(e.id, r);
        await nouvellePiece({ source: "revolut", ref, contenu, nom: `recu-revolut-${d.date}.${mime === "application/pdf" ? "pdf" : "jpg"}`, mime, extra: { depense_revolut: d.id } });
      } catch (err) {
        rapport.erreurs.push(`Reçu Revolut ${ref} : ${(err as Error).message}`);
      }
    }
  }

  // 2b. Ce qui est déjà dans Odoo Documents (déposé à la main par Jeremy ou par ce job).
  const deposes = await odoo.deposes();
  const sommes = await odoo.empreintes(deposes.map((d) => (d.attachment_id ? d.attachment_id[0] : 0)).filter(Boolean));
  const odooParEmpreinte = new Map<string, (typeof deposes)[number]>();
  for (const d of deposes) {
    const s = d.attachment_id ? sommes.get(d.attachment_id[0]) : undefined;
    if (s) odooParEmpreinte.set(s, d);
    if (odooConnus.has(d.id) || refs.has(`odoo:${d.id}`)) continue;
    await nouvellePiece({ source: "odoo", ref: String(d.id), empreinte: s ?? null, nom: d.name, mime: d.mimetype || "application/pdf", extra: { odoo_document_id: d.id, odoo_dossier: d.chemin, depose_le: d.create_date } });
  }

  // 2c. Pièces jointes des mails de facture.
  if (gmailBranche()) {
    try {
      const derniere = check(await base.from("compta_documents").select("mail_date").eq("societe", SOCIETE).eq("source", "gmail").order("mail_date", { ascending: false }).limit(1)) as { mail_date: string }[];
      const depuis = derniere[0] ? new Date(Date.parse(derniere[0].mail_date) - 7 * 86_400_000).toISOString().slice(0, 10) : "2026-07-01";
      for await (const m of mailsAvecPieces(requeteFactures(depuis))) {
        for (const p of m.pieces) {
          const ref = `${m.id}:${p.partId}`;
          if (refs.has(`gmail:${ref}`) || (p.mimeType.startsWith("image/") && p.size < PETITE_IMAGE)) continue;
          try {
            const { contenu, mime, nom } = await telechargerPiece(m.id, p.partId);
            await nouvellePiece({ source: "gmail", ref, contenu, nom, mime, extra: { mail_de: m.from.slice(0, 200), mail_objet: m.subject.slice(0, 300), mail_date: new Date(m.date).toISOString() } });
          } catch (err) {
            rapport.erreurs.push(`Pièce Gmail ${ref} : ${(err as Error).message}`);
          }
        }
      }
    } catch (err) {
      rapport.erreurs.push(`Gmail : ${(err as Error).message}`);
    }
  }
  log(`pièces nouvelles : ${JSON.stringify(rapport.pieces_nouvelles)}`);
  if (!opts.ecrire) return rapport;

  // 3. Lecture des nouvelles pièces ───────────────────────────────────────────
  const aLire = check(await base.from("compta_documents").select("*").eq("societe", SOCIETE).eq("statut", "a_lire").lt("essais", ESSAIS_MAX).order("created_at").limit(opts.lecturesMax ?? 40)) as DocRow[];
  const contenuDe = async (d: DocRow): Promise<Buffer> => {
    if (d.stockage) {
      const { data, error } = await base.storage.from(BUCKET).download(d.stockage);
      if (error || !data) throw new Error("Fichier introuvable dans le stockage");
      return Buffer.from(await data.arrayBuffer());
    }
    if (d.source === "odoo" && d.odoo_document_id) {
      const [doc] = await kw<{ attachment_id: [number, string] | false }[]>("documents.document", "read", [[d.odoo_document_id], ["attachment_id"]]);
      if (!doc?.attachment_id) throw new Error("Document Odoo sans fichier");
      return odoo.contenu(doc.attachment_id[0]);
    }
    throw new Error("Pièce sans contenu");
  };
  const file = [...aLire];
  await Promise.all(
    Array.from({ length: 3 }, async () => {
      for (let d = file.shift(); d; d = file.shift()) {
        try {
          const l = await lirePiece(await contenuDe(d), d.mime ?? "application/pdf", { nomFichier: d.nom_fichier, mailDe: d.mail_de, mailObjet: d.mail_objet });
          // Une pièce que Jeremy a lui-même rangée dans Odoo reste candidate même si ce
          // n'est pas une facture (bon de commande) ; le rapprochement exige alors un accord exact.
          const utile = !l.contenu_suspect && l.total != null && (l.nature !== "autre" || d.source === "odoo");
          check(await base.from("compta_documents").update({ nature: l.nature, fournisseur: l.fournisseur, date_doc: l.date, total: l.total, devise: l.devise, numero: l.numero, destinataire: l.destinataire, lecture: l, lu_le: new Date().toISOString(), statut: utile ? "lu" : "pas_un_justificatif", erreur: null, updated_at: new Date().toISOString() }).eq("id", d.id));
          rapport.lues += 1;
          log(`lu : ${d.nom_fichier} → ${l.nature} ${l.fournisseur ?? "?"} ${l.total ?? "?"} ${l.devise ?? ""} ${l.date ?? ""}`);
        } catch (err) {
          const essais = d.essais + 1;
          await base.from("compta_documents").update({ essais, erreur: (err as Error).message.slice(0, 300), statut: essais >= ESSAIS_MAX ? "erreur" : "a_lire", updated_at: new Date().toISOString() }).eq("id", d.id);
          rapport.erreurs.push(`Lecture de ${d.nom_fichier} : ${(err as Error).message}`);
        }
      }
    }),
  );

  // 4. Rapprochement ──────────────────────────────────────────────────────────
  const ouvertes = check(await base.from("compta_depenses").select("id, date, montant, devise, montant_facture, devise_facture, marchand, categorie, statut, document_id, expense_id, documents_refuses, raw").eq("societe", SOCIETE).eq("statut", "manquant").in("categorie", ["fournisseur", "frais_bancaires"])) as DepRow[];
  const pris = new Set((check(await base.from("compta_depenses").select("document_id").eq("societe", SOCIETE).not("document_id", "is", null)) as { document_id: string }[]).map((r) => r.document_id));
  const libres = (check(await base.from("compta_documents").select("*").eq("societe", SOCIETE).eq("statut", "lu")) as DocRow[]).filter((d) => !pris.has(d.id));
  // Une pièce rangée par Jeremy dans un mois déjà fait appartient à ce mois-là.
  const moisDebut = DEBUT.slice(0, 7);
  const lus: Lu[] = libres.filter((d) => { const m = moisDuDossier(d.odoo_dossier); return !(d.source === "odoo" && m && m < moisDebut); }).map((d) => ({ id: d.id, nature: (d.nature as Lu["nature"]) ?? "autre", fournisseur: d.fournisseur, date_doc: d.date_doc, total: d.total == null ? null : Number(d.total), devise: d.devise, mail_de: d.mail_de, nom_fichier: d.nom_fichier, depense_imposee: d.depense_revolut, deposee_par_jeremy: d.source === "odoo", mois_dossier: moisDuDossier(d.odoo_dossier), mail_date: d.mail_date ? String(d.mail_date).slice(0, 10) : null }));
  const propositions = rapprocher(
    ouvertes.map((d) => ({ ...d, montant: Number(d.montant), montant_facture: d.montant_facture == null ? null : Number(d.montant_facture), restaurant: MCC_RESTAURANT.has(d.raw?.merchant?.category_code ?? ""), refuses: d.documents_refuses ?? [] })),
    lus,
  );
  const docParId = new Map(libres.map((d) => [d.id, d]));
  const depParId = new Map(ouvertes.map((d) => [d.id, d]));
  for (const p of propositions) {
    const doc = docParId.get(p.documentId)!;
    const methode = doc.depense_revolut ? "recu_revolut" : doc.source === "odoo" ? "odoo_existant" : "auto";
    if (!p.sur) {
      check(await base.from("compta_depenses").update({ statut: "a_valider", document_id: doc.id, rapprochement: methode, note: p.raison, updated_at: new Date().toISOString() }).eq("id", p.depenseId));
      rapport.a_valider += 1;
      continue;
    }
    check(await base.from("compta_depenses").update({ statut: "justifie", document_id: doc.id, rapprochement: methode, note: p.raison, updated_at: new Date().toISOString() }).eq("id", p.depenseId));
    check(await base.from("compta_documents").update({ statut: "rapproche", updated_at: new Date().toISOString() }).eq("id", doc.id));
    rapport.rapprochees += 1;
    log(`rapproché : ${depParId.get(p.depenseId)?.marchand} ${depParId.get(p.depenseId)?.montant} ← ${doc.nom_fichier} (${p.raison})`);
  }

  // 5. Dépôt dans Odoo des pièces justifiées qui n'y sont pas encore ───────────
  const aDeposer = check(await base.from("compta_depenses").select("id, date, montant, devise, marchand, document_id, compta_documents!compta_depenses_document_id_fkey(id, sha1, stockage, mime, nom_fichier, odoo_document_id)").eq("societe", SOCIETE).eq("statut", "justifie").not("document_id", "is", null)) as unknown as (DepRow & { compta_documents: Pick<DocRow, "id" | "sha1" | "stockage" | "mime" | "nom_fichier" | "odoo_document_id"> | null })[];
  for (const d of opts.deposer === false ? [] : aDeposer) {
    const doc = d.compta_documents;
    if (!doc || doc.odoo_document_id) continue;
    try {
      const deja = doc.sha1 ? odooParEmpreinte.get(doc.sha1) : undefined;
      if (deja) {
        check(await base.from("compta_documents").update({ odoo_document_id: deja.id, odoo_dossier: deja.chemin, statut: "rapproche", updated_at: new Date().toISOString() }).eq("id", doc.id));
        continue;
      }
      if (!doc.stockage) throw new Error("pièce sans fichier");
      const { data, error } = await base.storage.from(BUCKET).download(doc.stockage);
      if (error || !data) throw new Error("fichier introuvable dans le stockage");
      const contenu = Buffer.from(await data.arrayBuffer());
      const mime = doc.mime ?? "application/pdf";
      const dossier = await odoo.dossierDuMois(d.date);
      const nom = nomDepot({ ...d, montant: Number(d.montant) }, mime, doc.nom_fichier);
      const id = await odoo.deposer(dossier.id, nom, mime, contenu);
      check(await base.from("compta_documents").update({ odoo_document_id: id, odoo_dossier: dossier.chemin, depose_le: new Date().toISOString(), statut: "rapproche", updated_at: new Date().toISOString() }).eq("id", doc.id));
      rapport.deposees.push({ depense: d.id, nom, dossier: dossier.chemin });
      log(`déposé : ${nom} → ${dossier.chemin}`);
    } catch (err) {
      rapport.erreurs.push(`Dépôt ${d.marchand} ${d.date} : ${(err as Error).message}`);
    }
  }

  // Ce qui manque encore (au moins 2 jours après le paiement : le mail peut tarder).
  const limite = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
  const manquantes = check(await base.from("compta_depenses").select("date, marchand, montant, devise").eq("societe", SOCIETE).eq("statut", "manquant").lte("date", limite).order("date", { ascending: false })) as { date: string; marchand: string; montant: number; devise: string }[];
  rapport.manquantes = manquantes.map((m) => ({ date: m.date, marchand: m.marchand, montant: `${Number(m.montant).toFixed(2).replace(".", ",")} ${m.devise}` }));
  return rapport;
}
