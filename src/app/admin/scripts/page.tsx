import { redirect } from "next/navigation";
import { getAdminRole } from "@/lib/admin";
import { SCRIPTS } from "./scripts-data";
import { SCRIPT_SKOOL_CHIFFRES } from "./skool-chiffres";
import { SCRIPT_SKOOL_USAGE } from "./skool-usage";
import ScriptsView from "./ScriptsView";

export const metadata = { title: "Scripts vidéo" };
export const dynamic = "force-dynamic";

// Composant serveur : on vérifie le rôle avant d'envoyer le moindre script au
// navigateur (les pages client classiques embarquent leurs données dans le JS).
export default async function ScriptsPage() {
  let role: Awaited<ReturnType<typeof getAdminRole>> = null;
  try {
    role = await getAdminRole();
  } catch {
    role = null;
  }
  if (!role) redirect("/membres");
  if (role !== "owner") redirect("/admin/crm");

  // Les leçons Skool restent hors de SCRIPTS : l'email de sortie d'une vidéo
  // YouTube (src/lib/video-email) cherche son script dans SCRIPTS.
  return <ScriptsView scripts={[SCRIPT_SKOOL_USAGE, SCRIPT_SKOOL_CHIFFRES, ...SCRIPTS]} />;
}
