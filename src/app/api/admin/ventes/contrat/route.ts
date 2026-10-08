import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";
import { sendContract } from "@/lib/docuseal";
import { getSale } from "@/lib/ventes";

export const maxDuration = 60;

// Envoie le contrat DocuSeal du client (modèle 1x, 2x ou 3x selon l'échéancier).
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();
    if (typeof id !== "string") return NextResponse.json({ error: "id manquant" }, { status: 400 });

    const sale = await getSale(id);
    if (sale.contract_status === "completed") {
      return NextResponse.json({ error: "Le contrat est déjà signé" }, { status: 400 });
    }
    if (!sale.phone) {
      return NextResponse.json({ error: "Le téléphone est obligatoire dans le contrat" }, { status: 400 });
    }

    const contract = await sendContract({
      installments: sale.installments,
      email: sale.email,
      fullName: [sale.first_name, sale.last_name].filter(Boolean).join(" "),
      phone: sale.phone,
      startDate: sale.start_date,
      company: sale.company,
    });

    await getAdminClient()
      .from("sales")
      .update({
        contract_submission_id: contract.id,
        contract_link: contract.link,
        contract_reminders: {},
        contract_status: "sent",
        contract_sent_at: new Date().toISOString(),
        contract_signed_at: null,
      })
      .eq("id", id);

    return NextResponse.json({ sale: await getSale(id) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
