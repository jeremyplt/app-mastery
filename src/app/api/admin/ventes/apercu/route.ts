import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";
import { EMPTY_BANK, buildReminder, getBankDetails, getSale } from "@/lib/ventes";

// Aperçu HTML d'un rappel d'échéance : /api/admin/ventes/apercu?payment=<id>&offset=3
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const paymentId = req.nextUrl.searchParams.get("payment");
    const offset = Number(req.nextUrl.searchParams.get("offset") ?? 3);
    if (!paymentId) return NextResponse.json({ error: "payment manquant" }, { status: 400 });

    const { data, error } = await getAdminClient().from("sale_payments").select("sale_id").eq("id", paymentId).single();
    if (error) throw new Error(error.message);
    const sale = await getSale(data.sale_id);
    const payment = sale.sale_payments.find((p) => p.id === paymentId)!;
    const bank = await getBankDetails();
    const built = buildReminder(sale, payment, offset, bank.iban ? bank : { ...EMPTY_BANK, holder: "(titulaire à renseigner)", iban: "FR7600000000000000000000000" });
    const html = built.html.replace(
      /<body[^>]*>/,
      (tag) => `${tag}<div style="font-family:sans-serif;padding:10px 20px;background:#f5f5f7;border-bottom:1px solid #ddd">Objet : <b>${built.subject}</b></div>`,
    );
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
