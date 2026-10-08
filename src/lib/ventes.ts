import { getAdminClient, withRetry } from "@/lib/supabase";
import { parisDay, parisHour } from "@/lib/call-reminders";
import { sendBuiltEmail } from "@/lib/emails/send";
import { adminAlert, contractReminder, formatDueDate, formatMoney, paymentReminder, amountTag, type BankDetails } from "@/lib/emails/ventes";
import { contractsConfigured, contractStatus } from "@/lib/docuseal";
import { inviteToSkool } from "@/lib/skool";
import { sendMetaEvent } from "@/lib/meta-capi";

// Ventes déclarées dans l'admin (/admin/ventes) : contrat DocuSeal,
// échéancier payé par virement, invitation Skool.
//
// Règles :
// - Le client est "confirmé" quand le contrat est signé ET que le 1er
//   paiement est coché comme reçu (preuve de paiement). À ce moment : invitation
//   Skool, événement Purchase envoyé à Meta, alerte à Jeremy.
// - Contrat envoyé mais pas signé : relance du client à J+1 puis J+3.
// - Chaque échéance non payée reçoit un rappel par email aux jours choisis
//   (par défaut J-3, J-1, le jour J, puis J+3 et J+7 en retard), à partir de
//   9 h, heure de Paris. Les rappels de retard (décalage négatif) annoncent la
//   coupure de l'accès et ne partent que si le contrat est signé : il faut
//   donc cocher « Payé » dès qu'un virement arrive. Une échéance due le jour
//   même de la vente (l'acompte) n'a pas de rappel avant l'échéance.

export type ContractStatus = "none" | "sent" | "delivered" | "completed" | "declined" | "voided";

export type SalePayment = {
  id: string;
  sale_id: string;
  position: number;
  amount: number;
  due_date: string;
  paid: boolean;
  paid_at: string | null;
  reminders_sent: Record<string, string>;
};

export type Sale = {
  id: string;
  created_at: string;
  created_by: string | null;
  email: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  offer: string;
  total_amount: number;
  currency: string;
  installments: number;
  start_date: string | null;
  company: Record<string, string>;
  reminder_offsets: number[];
  notes: string | null;
  contract_status: ContractStatus;
  contract_submission_id: string | null;
  contract_sent_at: string | null;
  contract_signed_at: string | null;
  skool_invited_at: string | null;
  contract_link: string | null;
  contract_reminders: Record<string, string>;
  meta_purchase_sent_at: string | null;
  origin: string | null;
  utm: Record<string, string>;
  alerts_sent: Record<string, string>;
  archived: boolean;
  sale_payments: SalePayment[];
};

export const SALE_SELECT = "*, sale_payments(*)";

export const EMPTY_BANK: BankDetails = { holder: "", address: "", iban: "", bic: "", intermediaryBic: "", bank: "" };

export async function getBankDetails(): Promise<BankDetails> {
  const { data } = await getAdminClient().from("site_settings").select("value").eq("key", "bank_details").maybeSingle();
  return { ...EMPTY_BANK, ...(data?.value ?? {}) };
}

export async function setBankDetails(bank: BankDetails): Promise<void> {
  const { error } = await getAdminClient()
    .from("site_settings")
    .upsert({ key: "bank_details", value: bank, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

export function bankReady(bank: BankDetails): boolean {
  return Boolean(bank.holder.trim() && bank.iban.trim());
}

export async function getSale(id: string): Promise<Sale> {
  const sale = await withRetry(() => getAdminClient().from("sales").select(SALE_SELECT).eq("id", id).single());
  return normalize(sale as Sale);
}

// Les montants numeric arrivent en chaîne depuis PostgREST.
export function normalize(sale: Sale): Sale {
  return {
    ...sale,
    total_amount: Number(sale.total_amount),
    sale_payments: [...(sale.sale_payments ?? [])]
      .map((p) => ({ ...p, amount: Number(p.amount) }))
      .sort((a, b) => a.position - b.position),
  };
}

export const ADMIN_ALERT_EMAIL = "jeremypltpro@gmail.com";

const ORIGIN_LABELS: Record<string, string> = {
  vsl: "Conférence (VSL)",
  "plan-action": "Plan d'action",
  guide: "Lead magnet",
  candidature: "Candidature",
};

export function originLabel(origin: string | null): string {
  return origin ? (ORIGIN_LABELS[origin] ?? origin) : "Inconnue";
}

function fullName(sale: Pick<Sale, "first_name" | "last_name">): string {
  return [sale.first_name, sale.last_name].filter(Boolean).join(" ");
}

async function alertJeremy(subject: string, lines: string[], tag?: string) {
  const r = await sendBuiltEmail({ email: ADMIN_ALERT_EMAIL, name: "Jeremy" }, adminAlert(subject, lines, tag));
  if (!r.ok) console.error(`Alerte vente "${subject}" non envoyée : ${r.error}`);
}

// Retient qu'une alerte est partie, pour ne pas l'envoyer deux fois.
async function markAlert(sale: Sale, key: string) {
  sale.alerts_sent = { ...sale.alerts_sent, [key]: new Date().toISOString() };
  await getAdminClient().from("sales").update({ alerts_sent: sale.alerts_sent }).eq("id", sale.id);
}

// Origine d'une vente : le premier funnel CRM où le client s'est inscrit,
// sinon une candidature, plus les UTM de sa candidature s'il y en a une.
// Marque aussi le lead comme client dans le CRM (les séquences s'arrêtent).
export async function linkLead(email: string): Promise<{ origin: string | null; utm: Record<string, string> }> {
  const supabase = getAdminClient();
  const [{ data: leads }, { data: cands }] = await Promise.all([
    supabase.from("crm_leads").select("id, source, created_at").eq("email", email).order("created_at", { ascending: true }),
    supabase
      .from("candidatures")
      .select("utm_source, utm_medium, utm_campaign, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);
  if (leads?.length) {
    await supabase
      .from("crm_leads")
      .update({ client: true, client_at: new Date().toISOString() })
      .in("id", leads.map((l) => l.id));
  }
  const cand = cands?.[0];
  const utm = Object.fromEntries(
    Object.entries({ source: cand?.utm_source, medium: cand?.utm_medium, campaign: cand?.utm_campaign }).filter(
      (e): e is [string, string] => Boolean(e[1]),
    ),
  );
  return { origin: leads?.[0]?.source ?? (cand ? "candidature" : null), utm };
}

// Vente supprimée : le lead redevient prospect s'il n'a plus aucune vente.
export async function unlinkLead(email: string) {
  const supabase = getAdminClient();
  const { count } = await supabase.from("sales").select("id", { count: "exact", head: true }).eq("email", email);
  if (!count) await supabase.from("crm_leads").update({ client: false, client_at: null }).eq("email", email);
}

export function isConfirmed(sale: Sale): boolean {
  const first = sale.sale_payments.find((p) => p.position === 1);
  return sale.contract_status === "completed" && Boolean(first?.paid);
}

export function readyForSkool(sale: Sale): boolean {
  return isConfirmed(sale) && !sale.skool_invited_at;
}

// Client confirmé (contrat signé + 1er paiement reçu) : invitation Skool,
// Purchase Meta et alerte, chacun une seule fois. Ne fait rien sinon.
export async function onConfirmed(sale: Sale): Promise<{ invited: boolean; error?: string }> {
  if (!isConfirmed(sale)) return { invited: false };
  let result: { invited: boolean; error?: string } = { invited: false };
  if (!sale.skool_invited_at) result = await inviteSkoolNow(sale);

  // En local, on n'envoie pas de vraie vente à Meta (sauf avec un code de test
  // de l'Events Manager) : les tests ne doivent pas fausser les pubs.
  const metaLive = process.env.NODE_ENV === "production" || Boolean(process.env.META_TEST_EVENT_CODE);
  if (!sale.meta_purchase_sent_at && !metaLive) {
    console.log(`Meta Purchase ignoré en dev pour ${sale.email} (${sale.total_amount} ${sale.currency})`);
  }
  if (!sale.meta_purchase_sent_at && metaLive) {
    await sendMetaEvent({
      eventName: "Purchase",
      eventId: `sale-${sale.id}`,
      actionSource: "phone_call",
      userData: {
        email: sale.email,
        phone: sale.phone ?? undefined,
        firstName: sale.first_name,
        lastName: sale.last_name ?? undefined,
      },
      customData: { value: sale.total_amount, currency: sale.currency, content_name: sale.offer },
    });
    sale.meta_purchase_sent_at = new Date().toISOString();
    await getAdminClient().from("sales").update({ meta_purchase_sent_at: sale.meta_purchase_sent_at }).eq("id", sale.id);
  }

  if (!sale.alerts_sent.client) {
    await alertJeremy(`🎉 ${fullName(sale)} est client (${formatMoney(sale.total_amount, sale.currency)})`, [
      `Montant : ${amountTag(formatMoney(sale.total_amount, sale.currency))} en ${sale.installments} fois.`,
      `<b>${fullName(sale)}</b> a signé son contrat et son 1er paiement est reçu.`,
      sale.skool_invited_at || result.invited
        ? "L'invitation Skool est partie."
        : `⚠️ L'invitation Skool n'a pas pu partir${result.error ? ` (${result.error})` : ""}. Relance-la depuis la page ventes.`,
      `Origine : ${originLabel(sale.origin)}. ${sale.meta_purchase_sent_at ? "Vente envoyée à Meta." : "Vente pas envoyée à Meta (test en local)."}`,
    ]);
    await markAlert(sale, "client");
  }
  return result;
}

export async function inviteSkoolNow(sale: Sale): Promise<{ invited: boolean; error?: string }> {
  const r = await inviteToSkool(sale.email);
  if (!r.ok) return { invited: false, error: r.error };
  sale.skool_invited_at = new Date().toISOString();
  await getAdminClient().from("sales").update({ skool_invited_at: sale.skool_invited_at }).eq("id", sale.id);
  return { invited: true };
}

// Relance du contrat à envoyer maintenant (1 = J+1, 3 = J+3), ou null.
export function contractReminderDue(sale: Sale, now = new Date()): 1 | 3 | null {
  if (sale.archived || !sale.contract_link || !sale.contract_sent_at) return null;
  if (sale.contract_status !== "sent" && sale.contract_status !== "delivered") return null;
  if (parisHour(now) < 9 || parisHour(now) >= 21) return null;
  const days = (now.getTime() - new Date(sale.contract_sent_at).getTime()) / 86_400_000;
  if (days >= 3 && !sale.contract_reminders["3"]) return 3;
  if (days >= 1 && days < 3 && !sale.contract_reminders["1"]) return 1;
  return null;
}

function daysUntil(today: string, due: string): number {
  return Math.round((Date.parse(`${due}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

// Rappel à envoyer maintenant pour une échéance : le plus proche de
// l'échéance parmi ceux déjà atteints, s'il n'est pas encore parti. Les
// rappels plus anciens ratés (vente déclarée tard, cron en panne) sont sautés.
export function reminderDue(sale: Sale, payment: SalePayment, now = new Date()): number | null {
  if (payment.paid || sale.archived) return null;
  if (sale.contract_status === "declined" || sale.contract_status === "voided") return null;
  const today = parisDay(now);
  const left = daysUntil(today, payment.due_date);
  if (left < -30) return null;
  // Avant l'échéance : pas de rappel pour un paiement dû le jour de la vente.
  // Après : seulement si le contrat est signé (on ne menace pas de couper un
  // accès qui n'a jamais été ouvert).
  const offsets = sale.reminder_offsets.filter((o) =>
    o < 0 ? sale.contract_status === "completed" : payment.due_date > parisDay(new Date(sale.created_at)),
  );
  // Une fois l'échéance passée, seuls les rappels de retard comptent.
  const reached = offsets.filter((o) => o >= left && (o < 0 || left >= 0)).sort((a, b) => a - b);
  if (reached.length === 0) return null;
  const offset = reached[0];
  if (payment.reminders_sent[String(offset)]) return null;
  // Déjà relancé pour un rappel plus proche de l'échéance : rien à faire.
  if (Object.keys(payment.reminders_sent).some((k) => Number(k) < offset)) return null;
  if (parisHour(now) < 9 || parisHour(now) >= 21) return null;
  return offset;
}

export function buildReminder(sale: Sale, payment: SalePayment, offset: number, bank: BankDetails) {
  return paymentReminder({
    firstName: sale.first_name,
    lastName: sale.last_name,
    amount: payment.amount,
    currency: sale.currency,
    dueDate: payment.due_date,
    position: payment.position,
    installments: sale.installments,
    offset,
    bank,
  });
}

export function contractPending(sale: Sale): boolean {
  return (
    Boolean(sale.contract_submission_id) &&
    contractsConfigured() &&
    !["completed", "declined", "voided"].includes(sale.contract_status)
  );
}

// Applique un nouveau statut de contrat : enregistrement, alertes à Jeremy,
// et client confirmé si le 1er paiement est déjà coché. Appelée par le
// webhook DocuSeal, l'ouverture de la page ventes et le cron.
export async function applyContractStatus(sale: Sale, next: ContractStatus, completedAt?: string): Promise<boolean> {
  if (next === sale.contract_status) return false;
  const update: Partial<Sale> = { contract_status: next };
  if (next === "completed") update.contract_signed_at = completedAt ?? new Date().toISOString();
  await getAdminClient().from("sales").update(update).eq("id", sale.id);
  Object.assign(sale, update);

  const first = sale.sale_payments.find((p) => p.position === 1);
  if (next === "completed" && !first?.paid && !sale.alerts_sent.signed) {
    await alertJeremy(`✍️ ${fullName(sale)} a signé son contrat`, [
      `<b>${fullName(sale)}</b> vient de signer son contrat (${amountTag(formatMoney(sale.total_amount, sale.currency))} en ${sale.installments} fois).`,
      first
        ? `Dès que le virement de ${amountTag(formatMoney(first.amount, sale.currency))} arrive, coche « Reçu » : l'invitation Skool partira toute seule.`
        : "",
    ]);
    await markAlert(sale, "signed");
  }
  if ((next === "declined" || next === "voided") && !sale.alerts_sent[next]) {
    await alertJeremy(`❌ Contrat ${next === "declined" ? "refusé" : "expiré"} : ${fullName(sale)}`, [
      `Le contrat de <b>${fullName(sale)}</b> (${sale.email}) a été ${next === "declined" ? "refusé" : "laissé expirer"}.`,
      "Les rappels de paiement sont coupés pour cette vente.",
    ]);
    await markAlert(sale, next);
  }
  if (next === "completed") await onConfirmed(sale);
  return true;
}

// Va lire le statut chez DocuSeal et l'applique. Retourne le nouveau statut
// s'il a changé.
export async function syncContract(sale: Sale): Promise<ContractStatus | null> {
  const { status, completedAt } = await contractStatus(sale.contract_submission_id!);
  return (await applyContractStatus(sale, status, completedAt)) ? status : null;
}

// Un passage du cron : met à jour les contrats DocuSeal, invite sur le
// Skool quand c'est prêt, envoie les rappels d'échéance dus.
export async function runVentes(now = new Date()) {
  const supabase = getAdminClient();
  const rows = await withRetry(() => supabase.from("sales").select(SALE_SELECT).eq("archived", false));
  const sales = ((rows ?? []) as Sale[]).map(normalize);
  const bank = await getBankDetails();

  const contracts: Record<string, string> = {};
  const skool: Record<string, string> = {};
  const reminders: Record<string, string> = {};
  const errors: Record<string, string> = {};

  for (const sale of sales) {
    // 1. Contrat : suivre le statut de la demande de signature.
    if (contractPending(sale)) {
      try {
        const next = await syncContract(sale);
        if (next) contracts[sale.email] = next;
      } catch (err) {
        errors[`${sale.email} contrat`] = err instanceof Error ? err.message : String(err);
      }
    }

    // 2. Client confirmé : Skool, Meta, alerte.
    if (isConfirmed(sale) && (!sale.skool_invited_at || !sale.meta_purchase_sent_at || !sale.alerts_sent.client)) {
      const r = await onConfirmed(sale);
      if (r.invited) skool[sale.email] = "invité";
      else if (r.error) errors[`${sale.email} skool`] = r.error;
    }

    // 2 bis. Relance du contrat pas encore signé.
    const step = contractReminderDue(sale, now);
    if (step) {
      const built = contractReminder(sale.first_name, sale.contract_link!, step);
      const r = await sendBuiltEmail({ email: sale.email, name: sale.first_name }, built);
      if (r.ok) {
        sale.contract_reminders = { ...sale.contract_reminders, [String(step)]: now.toISOString() };
        await supabase.from("sales").update({ contract_reminders: sale.contract_reminders }).eq("id", sale.id);
        reminders[`${sale.email} contrat`] = built.tag;
      } else {
        errors[`${sale.email} relance contrat`] = r.error ?? "envoi impossible";
      }
    }

    // 3. Rappels d'échéance.
    for (const payment of sale.sale_payments) {
      const offset = reminderDue(sale, payment, now);
      if (offset === null) continue;
      if (!bankReady(bank)) {
        errors[`${sale.email} rappel`] = "Coordonnées bancaires manquantes (/admin/ventes)";
        continue;
      }
      const built = buildReminder(sale, payment, offset, bank);
      const r = await sendBuiltEmail({ email: sale.email, name: sale.first_name }, built);
      if (!r.ok) {
        errors[`${sale.email} rappel ${payment.position}`] = r.error ?? "envoi impossible";
        continue;
      }
      await supabase
        .from("sale_payments")
        .update({ reminders_sent: { ...payment.reminders_sent, [String(offset)]: now.toISOString() } })
        .eq("id", payment.id);
      reminders[`${sale.email} ${payment.position}/${sale.installments}`] = built.tag;
    }
  }

  const digest = await sendDailyDigest(sales, now).catch((err) => {
    errors.digest = err instanceof Error ? err.message : String(err);
    return false;
  });

  return { active: sales.length, contracts, skool, reminders, digest, errors };
}

// Point du jour envoyé à Jeremy à 9 h (heure de Paris) s'il y a quelque chose
// à vérifier : virements attendus aujourd'hui ou en retard, contrats envoyés
// depuis plus de 2 jours et toujours pas signés. Une fois par jour au plus.
async function sendDailyDigest(sales: Sale[], now: Date): Promise<boolean> {
  if (parisHour(now) < 9) return false;
  const today = parisDay(now);
  const supabase = getAdminClient();
  const { data: state } = await supabase.from("site_settings").select("value").eq("key", "ventes_digest").maybeSingle();
  if (state?.value?.day === today) return false;

  const due: string[] = [];
  const late: string[] = [];
  const unsigned: string[] = [];
  for (const sale of sales) {
    if (sale.contract_status === "declined" || sale.contract_status === "voided") continue;
    for (const p of sale.sale_payments) {
      if (p.paid || p.due_date > today) continue;
      const line = `${fullName(sale)} : ${amountTag(formatMoney(p.amount, sale.currency), p.due_date < today)} (échéance ${p.position}/${sale.installments}, ${formatDueDate(p.due_date)})`;
      (p.due_date === today ? due : late).push(line);
    }
    if (
      (sale.contract_status === "sent" || sale.contract_status === "delivered") &&
      sale.contract_sent_at &&
      now.getTime() - new Date(sale.contract_sent_at).getTime() > 2 * 86_400_000
    ) {
      unsigned.push(`${fullName(sale)} (${sale.email}), envoyé le ${formatDueDate(sale.contract_sent_at.slice(0, 10))}`);
    }
  }

  await supabase.from("site_settings").upsert({ key: "ventes_digest", value: { day: today }, updated_at: now.toISOString() });
  if (!due.length && !late.length && !unsigned.length) return false;

  const list = (items: string[]) => items.map((i) => `• ${i}`).join("<br>");
  const lines: string[] = [];
  if (due.length) lines.push(`<b>💶 Virements attendus aujourd'hui</b><br>${list(due)}`);
  if (late.length) lines.push(`<b>⏰ Virements en retard</b> (vérifie ton compte et coche « Payé » si c'est arrivé : sinon le client reçoit une relance à J+3 et J+7 qui annonce la coupure de son accès)<br>${list(late)}`);
  if (unsigned.length) lines.push(`<b>✍️ Contrats pas encore signés</b><br>${list(unsigned)}`);
  const count = due.length + late.length;
  await alertJeremy(
    count ? `💶 ${count} virement${count > 1 ? "s" : ""} à vérifier aujourd'hui` : "✍️ Des contrats attendent une signature",
    lines,
    "vente-admin-jour",
  );
  return true;
}
