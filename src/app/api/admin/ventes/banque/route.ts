import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { setBankDetails } from "@/lib/ventes";

// Coordonnées bancaires affichées dans les rappels d'échéance. Owner seulement.
export async function PUT(req: NextRequest) {
  try {
    await requireOwner();
    const b = await req.json();
    const bank = {
      holder: String(b.holder ?? "").trim(),
      iban: String(b.iban ?? "").replace(/\s+/g, "").toUpperCase(),
      bic: String(b.bic ?? "").replace(/\s+/g, "").toUpperCase(),
      intermediaryBic: String(b.intermediaryBic ?? "").replace(/\s+/g, "").toUpperCase(),
      address: String(b.address ?? "").trim(),
      bank: String(b.bank ?? "").trim(),
    };
    if (bank.iban && !/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(bank.iban)) {
      return NextResponse.json({ error: "IBAN invalide" }, { status: 400 });
    }
    await setBankDetails(bank);
    return NextResponse.json({ bank });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
