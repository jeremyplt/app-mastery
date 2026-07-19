import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import {
  getActiveProvider,
  setActiveProvider,
  isValidProvider,
} from "@/lib/payment-provider";

export async function GET() {
  try {
    await requireOwner();
    const active = await getActiveProvider();
    return NextResponse.json({ active });
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireOwner();
    const { provider } = await req.json();

    if (!provider || !isValidProvider(provider)) {
      return NextResponse.json(
        { error: "Provider invalide. Valeurs acceptées : stripe, lemonsqueezy, gumroad" },
        { status: 400 }
      );
    }

    await setActiveProvider(provider);
    return NextResponse.json({ active: provider });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "Accès non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
