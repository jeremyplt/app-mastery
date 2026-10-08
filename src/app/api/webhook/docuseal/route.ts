import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { SALE_SELECT, normalize, syncContract, type Sale } from "@/lib/ventes";

// Webhook DocuSeal (Settings → Webhooks) : contrat ouvert, signé, refusé ou
// expiré. On ne fait pas confiance au contenu reçu : on relit le statut chez
// DocuSeal avant de l'appliquer. Un faux appel ne peut donc que déclencher une
// relecture. Si DOCUSEAL_WEBHOOK_SECRET est défini, l'en-tête
// X-Docuseal-Secret doit le contenir (à régler dans DocuSeal).
export async function POST(req: NextRequest) {
  const secret = process.env.DOCUSEAL_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-docuseal-secret") !== secret) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const type: string = body?.event_type ?? "";
  const data = body?.data ?? {};
  // form.* : data = signataire (submission_id) ; submission.* : data = soumission.
  const submissionId = data.submission_id ?? data.submission?.id ?? (type.startsWith("submission.") ? data.id : null);
  if (!submissionId) return NextResponse.json({ ok: true, ignored: type || "inconnu" });

  const { data: row } = await getAdminClient()
    .from("sales")
    .select(SALE_SELECT)
    .eq("contract_submission_id", String(submissionId))
    .maybeSingle();
  if (!row) return NextResponse.json({ ok: true, ignored: "vente inconnue" });

  try {
    const next = await syncContract(normalize(row as Sale));
    console.log(`DocuSeal ${type} pour la soumission ${submissionId} : ${next ?? "inchangé"}`);
    return NextResponse.json({ ok: true, status: next });
  } catch (err) {
    console.error("Webhook DocuSeal :", err);
    // 500 : DocuSeal réessaiera plus tard.
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
