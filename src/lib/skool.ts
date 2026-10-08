import { addContactToBrevoList, SKOOL_MEMBERS_LIST_ID } from "@/lib/brevo";

// Invite un email sur le Skool via le webhook natif de Skool (plugin
// "Zapier" de la communauté, qui accepte un POST ?email=), puis l'ajoute à la
// liste Brevo "Skool Members". Skool envoie lui-même l'email d'invitation.
export async function inviteToSkool(email: string): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.SKOOL_WEBHOOK_URL;
  if (!url) return { ok: false, error: "SKOOL_WEBHOOK_URL manquante" };
  try {
    const res = await fetch(`${url}?email=${encodeURIComponent(email)}`, { method: "POST" });
    console.log(`Skool invite sent for ${email}: ${res.status}`);
    if (!res.ok) return { ok: false, error: `Skool a répondu ${res.status}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
  await addContactToBrevoList(email, SKOOL_MEMBERS_LIST_ID);
  return { ok: true };
}
