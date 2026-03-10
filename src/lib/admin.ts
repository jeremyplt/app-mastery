import { getSessionEmail } from "@/lib/auth";

const ADMIN_EMAIL = "jeremypltpro@gmail.com";

export async function isAdmin(): Promise<boolean> {
  const email = await getSessionEmail();
  return email === ADMIN_EMAIL;
}

export async function requireAdmin(): Promise<void> {
  const admin = await isAdmin();
  if (!admin) throw new Error("Accès non autorisé");
}
