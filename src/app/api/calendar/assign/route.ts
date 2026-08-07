import { NextResponse } from "next/server";
import { assignCalendar } from "@/lib/calendar-routing";

// Appelé par les pages de réservation (client) au montage. Assigne un
// calendrier selon le split % configuré et incrémente le compteur.
// POST + no-store pour ne jamais être mis en cache (chaque visite compte).
export const dynamic = "force-dynamic";

export async function POST() {
  const result = await assignCalendar();
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
