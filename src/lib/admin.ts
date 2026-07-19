import { getSessionEmail } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase";

export const ADMIN_EMAIL = "jeremypltpro@gmail.com";

export type AdminRole = "owner" | "member";

// Vérifie si un email fait partie de l'équipe admin (table admin_users).
export async function getRoleForEmail(
  email: string | null
): Promise<AdminRole | null> {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  // L'owner historique garde toujours son accès, même si la table est vide.
  if (normalized === ADMIN_EMAIL) return "owner";

  try {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from("admin_users")
      .select("role")
      .eq("email", normalized)
      .maybeSingle();
    if (data?.role === "owner" || data?.role === "member") return data.role;
    return null;
  } catch {
    return null;
  }
}

export async function getAdminRole(): Promise<AdminRole | null> {
  const email = await getSessionEmail();
  return getRoleForEmail(email);
}

export async function isAdmin(): Promise<boolean> {
  return (await getAdminRole()) !== null;
}

export async function requireAdmin(): Promise<void> {
  const role = await getAdminRole();
  if (!role) throw new Error("Accès non autorisé");
}

export async function requireOwner(): Promise<void> {
  const role = await getAdminRole();
  if (role !== "owner") throw new Error("Accès non autorisé");
}
