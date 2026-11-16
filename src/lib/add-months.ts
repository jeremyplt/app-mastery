// "2026-07-13" + 3 mois -> "2026-10-13" (fin de mois respectée).
// Fin de l'accompagnement = début + 3 mois ; bilan = début + 6 mois.
// Dans un fichier à part, sans Supabase, pour la préparation d'appel et ses
// tests.
export function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, last));
  return target.toISOString().slice(0, 10);
}
