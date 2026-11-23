import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { odooClient } from "@/lib/facturation/adapters";
import { lirePiece } from "./lecture";
import { odooDocuments } from "./odoo-documents";
import { db } from "./pipeline";
import { memeFournisseur, nomDepot } from "./regles";

// Une facture que Claude est allé chercher sur le site du fournisseur (Meta,
// Amazon, Hetzner…) avec le Chrome de Jeremy. On sait pour quelle dépense elle a
// été téléchargée, mais on la relit quand même : elle n'est rattachée que si le
// montant et le fournisseur collent (sauf --forcer), puis elle part tout de suite
// dans le dossier du mois d'Odoo, comme les autres.

const BUCKET = "compta";
const MAX_BYTES = 15 * 1024 * 1024;
const MIMES: Record<string, string> = { pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", heic: "image/heic" };
const SIGNATURES: Record<string, (b: Buffer) => boolean> = {
  "application/pdf": (b) => b.subarray(0, 5).toString("latin1") === "%PDF-",
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8,
  "image/png": (b) => b.subarray(1, 4).toString("latin1") === "PNG",
  "image/webp": (b) => b.subarray(8, 12).toString("latin1") === "WEBP",
  "image/heic": (b) => b.subarray(4, 8).toString("latin1") === "ftyp",
};

export type Jointure = { depense: string; fichier: string; lu: string; odoo: string };

export async function joindre(depenseId: string, chemin: string, opts: { forcer?: boolean } = {}): Promise<Jointure> {
  if (!/^[0-9a-f-]{36}$/i.test(depenseId)) throw new Error("Identifiant de dépense invalide");
  const base = db();
  const { data: d, error } = await base.from("compta_depenses").select("id, date, montant, devise, montant_facture, devise_facture, marchand, statut, document_id, documents_refuses").eq("id", depenseId).eq("societe", "sdg").maybeSingle();
  if (error) throw new Error(error.message);
  if (!d) throw new Error("Dépense introuvable");
  if (d.statut !== "manquant" && d.statut !== "a_valider") throw new Error(`Dépense déjà ${d.statut}`);

  const nomFichier = basename(chemin);
  const mime = MIMES[nomFichier.split(".").pop()?.toLowerCase() ?? ""];
  if (!mime) throw new Error("Seuls les PDF et les images sont acceptés");
  const contenu = await readFile(chemin);
  if (!contenu.length || contenu.length > MAX_BYTES || !SIGNATURES[mime](contenu)) throw new Error("Fichier vide, trop gros ou qui n'est pas ce qu'il prétend être");

  const sha1 = createHash("sha1").update(contenu).digest("hex");
  const { data: meme } = await base.from("compta_documents").select("id, statut").eq("sha1", sha1).eq("societe", "sdg").limit(1);
  if (meme?.length) throw new Error(`Ce fichier est déjà connu (statut ${meme[0].statut})`);

  // Relecture par Claude, sans outils, comme toutes les pièces.
  const l = await lirePiece(contenu, mime, { nomFichier });
  const lu = `${l.nature} ${l.fournisseur ?? "?"} ${l.total ?? "?"} ${l.devise ?? ""} ${l.date ?? ""}`.trim();
  const montants = [Number(d.montant), d.montant_facture == null ? null : Number(d.montant_facture)].filter((x): x is number => x != null);
  const bonMontant = l.total != null && montants.some((m) => Math.abs(m - Number(l.total)) < 0.01);
  const bonFournisseur = memeFournisseur(d.marchand, { fournisseur: l.fournisseur, mail_de: null, nom_fichier: nomFichier });
  if (l.contenu_suspect) throw new Error(`Pièce suspecte, rien n'est rattaché (${l.note})`);
  if (!opts.forcer && (!bonMontant || !bonFournisseur || l.nature === "autre")) {
    throw new Error(`Ne colle pas à la dépense ${d.marchand} ${d.montant} ${d.devise} : lu « ${lu} ». Ajoute --forcer si c'est bien elle.`);
  }

  // Stockage, fiche de la pièce, dépense justifiée.
  const ref = randomUUID();
  const stockage = `sdg/web/${ref}`;
  const up = await base.storage.from(BUCKET).upload(stockage, contenu, { contentType: mime });
  if (up.error) throw new Error(`Stockage : ${up.error.message}`);
  const { data: doc, error: e1 } = await base
    .from("compta_documents")
    .insert({ societe: "sdg", source: "manuel", source_ref: ref, sha1, nom_fichier: nomFichier, mime, taille: contenu.length, stockage, nature: l.nature, fournisseur: l.fournisseur, date_doc: l.date, total: l.total, devise: l.devise, numero: l.numero, destinataire: l.destinataire, lecture: l, lu_le: new Date().toISOString(), statut: "rapproche" })
    .select("id")
    .single();
  if (e1 || !doc) throw new Error(`Enregistrement : ${e1?.message}`);
  const refuses = (d.documents_refuses ?? []) as string[];
  const { data: maj, error: e2 } = await base
    .from("compta_depenses")
    .update({ statut: "justifie", document_id: doc.id, rapprochement: "manuel", note: "Facture téléchargée sur le site du fournisseur.", documents_refuses: d.document_id ? [...new Set([...refuses, d.document_id])] : refuses, updated_at: new Date().toISOString() })
    .eq("id", d.id)
    .in("statut", ["manquant", "a_valider"])
    .select("id")
    .maybeSingle();
  if (e2 || !maj) {
    await base.from("compta_documents").delete().eq("id", doc.id);
    await base.storage.from(BUCKET).remove([stockage]);
    throw new Error(e2?.message ?? "La dépense vient de changer");
  }

  // Dépôt immédiat dans Odoo (le passage suivant le ferait sinon).
  const odoo = odooDocuments(odooClient().kw);
  const dossier = await odoo.dossierDuMois(d.date);
  const nom = nomDepot({ date: d.date, marchand: d.marchand, montant: Number(d.montant), devise: d.devise }, mime, nomFichier);
  const id = await odoo.deposer(dossier.id, nom, mime, contenu);
  await base.from("compta_documents").update({ odoo_document_id: id, odoo_dossier: dossier.chemin, depose_le: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", doc.id);
  return { depense: `${d.date} ${d.marchand} ${d.montant} ${d.devise}`, fichier: nomFichier, lu, odoo: `${dossier.chemin} › ${nom}` };
}
