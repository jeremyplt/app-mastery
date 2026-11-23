import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient, withRetry } from "@/lib/supabase";

// Comptabilité automatique : chaque dépense bancaire de SDG STUDIO et la pièce
// retrouvée pour elle par le job du serveur. Propriétaire seulement.

const BUCKET = "compta";
const SOCIETE = "sdg";

type DocRow = {
  id: string;
  source: string;
  nom_fichier: string | null;
  stockage: string | null;
  odoo_document_id: number | null;
  odoo_dossier: string | null;
  fournisseur: string | null;
  total: number | string | null;
  devise: string | null;
  date_doc: string | null;
};
type Row = {
  id: string;
  date: string;
  montant: number | string;
  devise: string;
  marchand: string | null;
  libelle: string | null;
  categorie: string;
  statut: "manquant" | "a_valider" | "justifie" | "sans_justificatif";
  note: string | null;
  rapprochement: string | null;
  compta_documents: DocRow | DocRow[] | null;
};

export async function GET() {
  try {
    await requireOwner();
    const db = getAdminClient();
    const rows = (await withRetry(() =>
      db
        .from("compta_depenses")
        .select("id, date, montant, devise, marchand, libelle, categorie, statut, note, rapprochement, compta_documents!compta_depenses_document_id_fkey(id, source, nom_fichier, stockage, odoo_document_id, odoo_dossier, fournisseur, total, devise, date_doc)")
        .eq("societe", SOCIETE)
        .order("date", { ascending: false })
        .limit(2000),
    )) as unknown as Row[];

    const docs = rows.map((r) => (Array.isArray(r.compta_documents) ? r.compta_documents[0] : r.compta_documents) ?? null);

    // Liens temporaires vers les pièces : le stockage reste privé.
    const paths = [...new Set(docs.map((d) => d?.stockage).filter((p): p is string => Boolean(p)))];
    const urls = new Map<string, string>();
    if (paths.length) {
      const { data } = await db.storage.from(BUCKET).createSignedUrls(paths, 60 * 60);
      for (const s of data ?? []) if (s.path && s.signedUrl) urls.set(s.path, s.signedUrl);
    }

    return NextResponse.json({
      depenses: rows.map((r, i) => {
        const d = docs[i];
        return {
          id: r.id,
          date: r.date,
          montant: Number(r.montant),
          devise: r.devise,
          marchand: r.marchand ?? r.libelle ?? "Dépense",
          libelle: r.libelle,
          categorie: r.categorie,
          statut: r.statut,
          note: r.note,
          rapprochement: r.rapprochement,
          piece: d
            ? {
                id: d.id,
                source: d.source,
                nom: d.nom_fichier,
                fournisseur: d.fournisseur,
                total: d.total == null ? null : Number(d.total),
                devise: d.devise,
                date: d.date_doc,
                odooId: d.odoo_document_id,
                odooDossier: d.odoo_dossier,
                url: d.stockage ? urls.get(d.stockage) ?? null : null,
              }
            : null,
        };
      }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
