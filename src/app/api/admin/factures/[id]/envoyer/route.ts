import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { sendInvoice, type SendMode } from "@/lib/invoices";

// Envoie la facture depuis contact@jeremypitault.com. Seul un clic dans le CRM
// déclenche cet envoi.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireOwner();
    const { id } = await params;
    const { mode } = (await req.json()) as { mode?: SendMode };
    if (mode !== "send" && mode !== "resend" && mode !== "test") {
      return NextResponse.json({ error: "Mode d'envoi inconnu" }, { status: 400 });
    }
    const invoice = await sendInvoice(id, mode);
    return NextResponse.json({ invoice });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    if (message === "Facture introuvable") return NextResponse.json({ error: message }, { status: 404 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
