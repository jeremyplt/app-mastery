import { NextResponse } from "next/server";
import { getAdminRole } from "@/lib/admin";
import { createSessionToken, getSessionEmail, SESSION_COOKIE } from "@/lib/auth";

// Appelée par chaque page admin. Renouvelle le cookie de session au passage,
// pour qu'un membre de l'équipe ne soit jamais déconnecté.
export async function GET() {
  try {
    const role = await getAdminRole();
    const response = NextResponse.json({ admin: role !== null, role });
    const email = role ? await getSessionEmail() : null;
    if (email) response.cookies.set("session", await createSessionToken(email), SESSION_COOKIE);
    return response;
  } catch {
    return NextResponse.json({ admin: false, role: null });
  }
}
