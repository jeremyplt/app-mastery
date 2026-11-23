import { MOIS, sansAccent } from "./regles";

// L'espace « Documents » d'Odoo où SKG prend les pièces : Comptabilité › 2026 ›
// Factures fournisseurs › Novembre. Les dossiers sont retrouvés par leur nom (sans
// tenir compte des accents : Jeremy a créé « Aout ») et créés s'ils manquent.
// Rien n'est jamais supprimé ni remplacé ici.

export type Kw = <T>(model: string, method: string, args: unknown[], kwargs?: Record<string, unknown>) => Promise<T>;

type Dossier = { id: number; name: string; folder_id: [number, string] | false };
export type DocOdoo = { id: number; name: string; folder_id: [number, string] | false; attachment_id: [number, string] | false; mimetype: string | false; create_date: string; file_size?: number };

const RACINE = "Comptabilité";
const FOURNISSEURS = "Factures fournisseurs";

export function odooDocuments(kw: Kw) {
  let dossiers: Dossier[] | null = null;
  const charger = async () => (dossiers ??= await kw<Dossier[]>("documents.document", "search_read", [[["type", "=", "folder"]]], { fields: ["name", "folder_id"] }));
  const enfant = (parent: number | false, nom: string) => (dossiers ?? []).find((d) => (d.folder_id ? d.folder_id[0] : false) === parent && sansAccent(d.name) === sansAccent(nom));

  async function trouverOuCreer(parent: number | false, nom: string, creer: boolean): Promise<number | null> {
    await charger();
    const ok = enfant(parent, nom);
    if (ok) return ok.id;
    if (!creer) return null;
    const id = await kw<number>("documents.document", "create", [{ name: nom, type: "folder", folder_id: parent }]);
    dossiers!.push({ id, name: nom, folder_id: parent ? [parent, ""] : false });
    return id;
  }

  async function dossierFournisseurs(annee: string, creer: boolean): Promise<number | null> {
    const racine = await trouverOuCreer(false, RACINE, false);
    if (!racine) throw new Error(`Dossier « ${RACINE} » introuvable dans Odoo Documents`);
    const an = await trouverOuCreer(racine, annee, creer);
    return an ? trouverOuCreer(an, FOURNISSEURS, creer) : null;
  }

  return {
    // Dossier du mois d'une date AAAA-MM-JJ, créé au besoin.
    async dossierDuMois(date: string): Promise<{ id: number; chemin: string }> {
      const [annee, mois] = date.split("-");
      const fournisseurs = await dossierFournisseurs(annee, true);
      const nom = MOIS[Number(mois) - 1];
      const id = await trouverOuCreer(fournisseurs!, nom, true);
      // Le nom réel du dossier (« Aout », créé à la main sans accent).
      const reel = (dossiers ?? []).find((d) => d.id === id)?.name ?? nom;
      return { id: id!, chemin: `${RACINE} › ${annee} › ${FOURNISSEURS} › ${reel}` };
    },

    // Tous les fichiers déjà déposés dans « Factures fournisseurs » (toutes années, tous mois).
    async deposes(): Promise<(DocOdoo & { chemin: string })[]> {
      await charger();
      const racine = enfant(false, RACINE);
      if (!racine) return [];
      const annees = (dossiers ?? []).filter((d) => d.folder_id && d.folder_id[0] === racine.id);
      const cibles = new Map<number, string>();
      for (const an of annees) {
        const f = enfant(an.id, FOURNISSEURS);
        if (!f) continue;
        cibles.set(f.id, `${an.name} › ${FOURNISSEURS}`);
        for (const m of (dossiers ?? []).filter((d) => d.folder_id && d.folder_id[0] === f.id)) cibles.set(m.id, `${an.name} › ${FOURNISSEURS} › ${m.name}`);
      }
      if (!cibles.size) return [];
      const docs = await kw<DocOdoo[]>("documents.document", "search_read", [[["type", "=", "binary"], ["folder_id", "in", [...cibles.keys()]]]], { fields: ["name", "folder_id", "attachment_id", "mimetype", "create_date", "file_size"] });
      return docs.map((d) => ({ ...d, chemin: d.folder_id ? cibles.get(d.folder_id[0]) ?? "" : "" }));
    },

    // Empreintes SHA-1 des pièces jointes (Odoo les calcule déjà) : évite de déposer deux fois le même fichier.
    async empreintes(attachmentIds: number[]): Promise<Map<number, string>> {
      if (!attachmentIds.length) return new Map();
      const rows = await kw<{ id: number; checksum: string | false }[]>("ir.attachment", "read", [attachmentIds, ["checksum"]]);
      return new Map(rows.filter((r) => r.checksum).map((r) => [r.id, r.checksum as string]));
    },

    async contenu(attachmentId: number): Promise<Buffer> {
      const [row] = await kw<{ datas: string | false }[]>("ir.attachment", "read", [[attachmentId], ["datas"]]);
      if (!row?.datas) throw new Error(`Pièce jointe Odoo ${attachmentId} vide`);
      return Buffer.from(row.datas, "base64");
    },

    async deposer(dossierId: number, nom: string, mime: string, contenu: Buffer): Promise<number> {
      const attachment = await kw<number>("ir.attachment", "create", [{ name: nom, datas: contenu.toString("base64"), mimetype: mime }]);
      return kw<number>("documents.document", "create", [{ name: nom, folder_id: dossierId, attachment_id: attachment }]);
    },
  };
}
