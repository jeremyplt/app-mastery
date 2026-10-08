import { NextResponse } from "next/server";
import { runVentes } from "@/lib/ventes";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Ventes : statut des contrats DocuSeal, invitation Skool, rappels
// d'échéance. Appelée toutes les 15 minutes par Supabase (pg_cron + pg_net,
// job "ventes"). Idempotente. Voir src/lib/ventes.ts.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, ...(await runVentes()) });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
