import { NextResponse } from "next/server";
import { runSequenceA } from "@/lib/sequence-a";
import { runSequenceC } from "@/lib/sequence-c";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Séquences A (après l'optin conférence) et C (après le Plan d'Action).
// Appelée toutes les 15 minutes par Supabase (pg_cron + pg_net, job "sequence-a") et une fois par jour par le
// cron Vercel des rappels d'appel. Idempotente : au plus un email par lead
// et par passage. Voir src/lib/sequence-a.ts.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const a = await runSequenceA();
    const c = await runSequenceC();
    return NextResponse.json({ ok: true, a, c });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
