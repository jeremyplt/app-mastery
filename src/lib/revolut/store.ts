import type { SupabaseClient } from "@supabase/supabase-js";
import { getAdminClient } from "@/lib/supabase";
import { loadStudents, markInstallmentPaid } from "@/lib/facturation/crm";
import { sendBuiltEmail } from "@/lib/emails/send";
import { adminAlert } from "@/lib/emails/ventes";
import { esc } from "@/lib/emails/layout";
import { ADMIN_ALERT_EMAIL } from "@/lib/ventes";
import { fetchTransaction } from "./client";
import { incomingLeg } from "./rapprochement";
import type { RevolutTransaction } from "./types";
import type { RevolutStore, StoredTransaction, WebhookDeps } from "./webhook";

// Branchements réels du webhook Revolut : table revolut_transactions, élèves du
// CRM, API Revolut en lecture, alerte par email à l'adresse des alertes ventes.

const TABLE = "revolut_transactions";
// Une réservation plus vieille que ça vient d'un traitement mort en route.
const STALE_CLAIM_MS = 5 * 60 * 1000;

function check<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(`Supabase : ${r.error.message}`);
  return r.data;
}

export function transactionRow(tx: RevolutTransaction) {
  const leg = incomingLeg(tx) ?? tx.legs?.[0] ?? null;
  return {
    id: tx.id,
    type: tx.type,
    state: tx.state,
    request_id: tx.request_id ?? null,
    amount: leg ? Number(leg.amount) : null,
    currency: leg?.currency ?? null,
    account_id: leg?.account_id ?? null,
    description: leg?.description ?? null,
    reference: tx.reference ?? null,
    tx_created_at: tx.created_at ?? null,
    tx_updated_at: tx.updated_at ?? null,
    completed_at: tx.completed_at ?? null,
    raw: tx,
  };
}

export function supabaseStore(db: SupabaseClient): RevolutStore {
  const now = () => new Date().toISOString();
  return {
    async get(id) {
      const row = check(await db.from(TABLE).select("id, state, match_status, student_id, schedule_position, alerts").eq("id", id).maybeSingle());
      return row ? ({ ...row, alerts: row.alerts ?? {} } as StoredTransaction) : null;
    },
    async save(tx, event) {
      // Seules ces colonnes sont écrites : le rapprochement déjà fait reste.
      check(await db.from(TABLE).upsert({ ...transactionRow(tx), last_event: event, updated_at: now() }, { onConflict: "id" }));
    },
    async touch(id, event) {
      check(await db.from(TABLE).update({ last_event: event, updated_at: now() }).eq("id", id));
    },
    async claim(id) {
      const stale = new Date(Date.now() - STALE_CLAIM_MS).toISOString();
      const rows = check(
        await db
          .from(TABLE)
          .update({ match_status: "processing", processed_at: now() })
          .eq("id", id)
          .or(`match_status.is.null,and(match_status.eq.processing,processed_at.lt."${stale}")`)
          .select("id"),
      );
      return (rows ?? []).length > 0;
    },
    async release(id) {
      check(await db.from(TABLE).update({ match_status: null }).eq("id", id).eq("match_status", "processing"));
    },
    async finish(id, outcome) {
      check(await db.from(TABLE).update({ ...outcome, processed_at: now(), updated_at: now() }).eq("id", id));
    },
    async noteAlerts(id, alerts) {
      check(await db.from(TABLE).update({ alerts, updated_at: now() }).eq("id", id));
    },
  };
}

export function realWebhookDeps(): WebhookDeps {
  const db = getAdminClient();
  return {
    store: supabaseStore(db),
    fetchTransaction,
    loadStudents: () => loadStudents(db),
    markPaid: (studentId, position, date) => markInstallmentPaid(db, studentId, position, date),
    async alert(a) {
      // Le texte vient en partie du payeur (référence, nom) : échappé.
      const cta = a.studentId
        ? { label: "Ouvrir la fiche élève", href: `https://www.jeremypitault.com/admin/eleves/${a.studentId}` }
        : { label: "Ouvrir les élèves", href: "https://www.jeremypitault.com/admin/eleves" };
      const r = await sendBuiltEmail({ email: ADMIN_ALERT_EMAIL, name: "Jeremy" }, adminAlert(a.title, a.lines.map(esc), "revolut-alerte", cta));
      // Échec : erreur, donc 500, et Revolut renvoie l'événement plus tard.
      if (!r.ok) throw new Error(`Alerte non envoyée : ${r.error}`);
    },
    now: () => new Date(),
  };
}
