import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { PROOF_BUCKET, proofUrl, sendProofRequest } from "@/lib/residence-proofs";
import { getAdminClient, withRetry } from "@/lib/supabase";

// Justificatifs de domicile dans le CRM. Propriétaire seulement : documents personnels.

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET() {
  try {
    await requireOwner();
    const db = getAdminClient();
    const [rows, students] = await Promise.all([
      withRetry(() => db.from("residence_proofs").select("*").order("created_at", { ascending: false }).limit(200)),
      withRetry(() => db.from("students").select("id, name, email, proof_token, proof_requested_at, archived, sale:sales(email, billing)").order("name")),
    ]);
    const proofs = rows ?? [];
    const urls = new Map<string, string>();
    if (proofs.length) {
      const { data } = await db.storage.from(PROOF_BUCKET).createSignedUrls(proofs.map((p) => p.file_path), 60 * 60);
      for (const s of data ?? []) if (s.path && s.signedUrl) urls.set(s.path, s.signedUrl);
    }
    type Sale = { email?: string; billing?: Record<string, string> | null };
    const list = (students ?? [])
      .filter((s) => !s.archived)
      .map((s) => {
        const sale = (Array.isArray(s.sale) ? s.sale[0] : s.sale) as Sale | null;
        const b = sale?.billing ?? {};
        const address = [b["Adresse postale"], b["Code postal"], b["Ville"], b["Pays"]].filter(Boolean).join(", ");
        return { id: s.id, name: s.name, email: s.email ?? sale?.email ?? null, link: proofUrl(s.proof_token), requestedAt: s.proof_requested_at, address: address || null };
      });
    // Le nom reste affiché même si l'élève a été archivé entre-temps.
    const names = new Map((students ?? []).map((s) => [s.id, s.name]));
    return NextResponse.json({
      students: list,
      proofs: proofs.map((p) => ({
        id: p.id,
        studentId: p.student_id,
        studentName: names.get(p.student_id) ?? "Élève",
        createdAt: p.created_at,
        fileName: p.file_name,
        mimeType: p.mime_type,
        status: p.status,
        rejectReason: p.reject_reason,
        synced: Boolean(p.synced_at),
        syncError: p.sync_error,
        url: urls.get(p.file_path) ?? null,
      })),
    });
  } catch (err) {
    return fail(err);
  }
}

// Envoie à un élève le lien pour déposer son justificatif.
export async function POST(req: NextRequest) {
  try {
    await requireOwner();
    const { studentId } = await req.json();
    if (typeof studentId !== "string") return NextResponse.json({ error: "Élève manquant" }, { status: 400 });
    const r = await sendProofRequest(studentId);
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
