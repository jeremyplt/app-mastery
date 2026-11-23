import { createHash, randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { matchesType } from "@/lib/residence-rules";
import { getAdminClient } from "@/lib/supabase";

// Pièce ajoutée à la main par Jeremy (PDF ou photo du ticket). Le fichier va
// directement du navigateur au stockage (il peut dépasser la limite d'une requête
// Vercel), puis cette route le contrôle et l'attache à la dépense. Le job du
// serveur le dépose ensuite dans Odoo.

const BUCKET = "compta";
const MAX_BYTES = 15 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/webp": "webp",
};
const ID_RE = /^[0-9a-f-]{36}$/i;
const PATH_RE = /^sdg\/manuel\/([0-9a-f-]{36})$/;

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

async function depenseOuverte(id: string) {
  if (!ID_RE.test(id)) return null;
  const { data, error } = await getAdminClient().from("compta_depenses").select("id, statut, document_id, documents_refuses").eq("id", id).eq("societe", "sdg").maybeSingle();
  if (error) throw new Error(error.message);
  return data && (data.statut === "manquant" || data.statut === "a_valider") ? data : null;
}

// Étape 1 : autorise l'envoi d'un fichier et renvoie un lien temporaire.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireOwner();
    const { id } = await params;
    const b = await req.json().catch(() => ({}));
    const type = String(b.type ?? "");
    const size = Number(b.size ?? 0);
    if (!TYPES[type]) return NextResponse.json({ error: "Envoie un PDF ou une photo (JPG, PNG, HEIC ou WebP)." }, { status: 400 });
    if (!(size > 0) || size > MAX_BYTES) return NextResponse.json({ error: "Le fichier doit faire moins de 15 Mo." }, { status: 400 });
    if (!(await depenseOuverte(id))) return NextResponse.json({ error: "Cette dépense est déjà justifiée, recharge la page" }, { status: 409 });
    const path = `sdg/manuel/${randomUUID()}`;
    const { data, error } = await getAdminClient().storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) throw new Error("Envoi impossible pour le moment, réessaie.");
    return NextResponse.json({ path, uploadToken: data.token });
  } catch (err) {
    return fail(err);
  }
}

// Étape 2 : le fichier est arrivé. On contrôle son contenu réel, puis on l'attache.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireOwner();
    const { id } = await params;
    const b = await req.json().catch(() => ({}));
    const path = String(b.path ?? "");
    const type = String(b.type ?? "");
    const ref = path.match(PATH_RE)?.[1];
    if (!ref || !TYPES[type]) return NextResponse.json({ error: "Envoi invalide" }, { status: 400 });

    const db = getAdminClient();
    const storage = db.storage.from(BUCKET);
    const d = await depenseOuverte(id);
    if (!d) {
      await storage.remove([path]);
      return NextResponse.json({ error: "Cette dépense est déjà justifiée, recharge la page" }, { status: 409 });
    }
    const { data: blob, error } = await storage.download(path);
    if (error || !blob) return NextResponse.json({ error: "Le fichier n'est pas arrivé, réessaie." }, { status: 400 });
    const contenu = Buffer.from(await blob.arrayBuffer());
    if (contenu.length > MAX_BYTES || !matchesType(new Uint8Array(contenu.subarray(0, 16)), type)) {
      await storage.remove([path]);
      return NextResponse.json({ error: "Ce fichier n'est pas un PDF ou une image lisible." }, { status: 400 });
    }

    const nom = String(b.name ?? "piece").replace(/[^\p{L}\p{N} ._-]/gu, "_").slice(0, 120) || "piece";
    const { data: doc, error: insertError } = await db
      .from("compta_documents")
      .insert({ societe: "sdg", source: "manuel", source_ref: ref, sha1: createHash("sha1").update(contenu).digest("hex"), nom_fichier: nom, mime: type, taille: contenu.length, stockage: path, statut: "rapproche" })
      .select("id")
      .single();
    if (insertError || !doc) {
      await storage.remove([path]);
      throw new Error(insertError?.message ?? "Enregistrement impossible");
    }

    const refuses = (d.documents_refuses ?? []) as string[];
    const { data: updated, error: upError } = await db
      .from("compta_depenses")
      .update({
        statut: "justifie",
        document_id: doc.id,
        rapprochement: "manuel",
        note: "Pièce ajoutée par Jeremy.",
        documents_refuses: d.document_id ? [...new Set([...refuses, d.document_id])] : refuses,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .in("statut", ["manquant", "a_valider"])
      .select("id")
      .maybeSingle();
    if (upError || !updated) {
      await db.from("compta_documents").delete().eq("id", doc.id);
      await storage.remove([path]);
      if (upError) throw new Error(upError.message);
      return NextResponse.json({ error: "La dépense vient de changer, recharge la page" }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
