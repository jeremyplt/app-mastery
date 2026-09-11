import { NextResponse } from "next/server";
import { runSequenceA } from "@/lib/sequence-a";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Séquence A (après l'optin conférence). Appelée toutes les 15 minutes par
// Supabase (pg_cron + pg_net, job "sequence-a") et une fois par jour par le
// cron Vercel des rappels d'appel. Idempotente : au plus un email par lead
// et par passage. Voir src/lib/sequence-a.ts.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const result = await runSequenceA();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
