import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

// Palier de visionnage de la conférence, envoyé par la page /conference/live
// (60, 300, 600, 1110 secondes, puis la fin). Sert à la séquence A : version
// de l'email 1 et lien "reprendre là où tu t'es arrêté". On ne garde que le
// palier le plus haut. Best-effort : n'échoue jamais côté page.
export async function POST(req: NextRequest) {
  try {
    const { email, seconds } = await req.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const value = Math.floor(Number(seconds));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail) || !Number.isFinite(value) || value <= 0 || value > 24 * 3600) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data } = await supabase
      .from("crm_leads")
      .select("id, vsl_watch_seconds")
      .eq("email", normalizedEmail)
      .eq("source", "vsl")
      .maybeSingle();
    if (!data) return NextResponse.json({ ok: true, known: false });

    const current = (data as { vsl_watch_seconds: number | null }).vsl_watch_seconds ?? 0;
    if (value <= current) return NextResponse.json({ ok: true, seconds: current });

    await supabase
      .from("crm_leads")
      .update({ vsl_watch_seconds: value, vsl_watch_updated_at: new Date().toISOString() })
      .eq("id", (data as { id: string }).id);

    // Attribut Brevo, pour la segmentation des campagnes. Best-effort.
    const apiKey = process.env.BREVO_API_KEY;
    if (apiKey) {
      const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(normalizedEmail)}`, {
        method: "PUT",
        headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ attributes: { VSL_WATCH: value } }),
      });
      if (!res.ok) console.error("Brevo VSL_WATCH update error:", await res.text());
    }

    return NextResponse.json({ ok: true, seconds: value });
  } catch {
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
