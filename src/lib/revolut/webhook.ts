import type { Student } from "@/lib/facturation/match";
import { decide, incomingLeg, luxDate, money, type Decision } from "./rapprochement";
import type { RevolutTransaction } from "./types";

// Traitement d'un événement du webhook Revolut, branchements injectés (testés
// avec des faux). Revolut ne garantit ni l'ordre ni l'unicité des envois :
// - chaque transaction est enregistrée, et son état n'est jamais ramené en arrière ;
// - une transaction n'est rapprochée qu'une fois (réservation atomique en base) ;
// - une erreur libère la réservation et répond 500 : Revolut renvoie l'événement.

export type MatchStatus = "processing" | "paid" | "alert" | "ignored";

export type StoredTransaction = {
  id: string;
  state: string;
  match_status: MatchStatus | null;
  student_id: string | null;
  schedule_position: number | null;
  alerts: Record<string, string>;
};

export type Outcome = { match_status: Exclude<MatchStatus, "processing">; match_reason: string; student_id: string | null; schedule_position: number | null; alerts: Record<string, string> };

export interface RevolutStore {
  get(id: string): Promise<StoredTransaction | null>;
  // Enregistre la transaction (insertion ou mise à jour, sans toucher au rapprochement).
  save(tx: RevolutTransaction, event: string): Promise<void>;
  // Événement en retard : on note seulement qu'il est passé.
  touch(id: string, event: string): Promise<void>;
  // Réserve la transaction pour la rapprocher. Faux si c'est déjà fait ou en cours.
  claim(id: string): Promise<boolean>;
  release(id: string): Promise<void>;
  finish(id: string, outcome: Outcome): Promise<void>;
  noteAlerts(id: string, alerts: Record<string, string>): Promise<void>;
}

export type Alert = { title: string; lines: string[]; studentId: string | null };

export type WebhookDeps = {
  store: RevolutStore;
  fetchTransaction(id: string): Promise<RevolutTransaction>;
  loadStudents(): Promise<Student[]>;
  // Le même chemin que le job de factures (lib/facturation/crm.ts).
  markPaid(studentId: string, position: number, date: string): Promise<boolean>;
  // Mises de côté TVA et closer, si la facture de l'échéance existe déjà
  // (sinon le job de factures les fera en la créant). Jamais bloquant.
  setAside?(studentId: string, position: number, transactionId: string): Promise<string | null>;
  alert(a: Alert): Promise<void>;
  now(): Date;
};

const RANK: Record<string, number> = { created: 0, pending: 1, completed: 2, declined: 3, failed: 3, reverted: 3 };
const rank = (state: string | null | undefined) => RANK[state ?? ""] ?? 0;
const ENDED = new Set(["declined", "failed", "reverted"]);

function facts(tx: RevolutTransaction): string[] {
  const leg = incomingLeg(tx) ?? tx.legs?.[0];
  const date = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${luxDate(tx.completed_at ?? tx.created_at)}T12:00:00Z`));
  return [
    `Montant : ${leg ? money(Number(leg.amount), leg.currency) : "?"}`,
    `Payeur : ${leg?.description || "inconnu"}`,
    `Référence : ${tx.reference?.trim() || "aucune"}`,
    `Reçu le ${date} sur Revolut.`,
  ];
}

function alertFor(decision: Extract<Decision, { action: "alert" }>, tx: RevolutTransaction): Alert {
  const leg = incomingLeg(tx) ?? tx.legs?.[0];
  const amount = leg ? money(Number(leg.amount), leg.currency) : "";
  const who = decision.student?.name;
  const title =
    decision.kind === "premiere" ? `💶 ${who} : 1re échéance reçue, à cocher`
    : decision.kind === "devise" ? `💵 Paiement d'élève ${leg?.currency === "EUR" ? "hors du compte Main EUR" : `en ${leg?.currency ?? "devise"}`} : à cocher à la main`
    : `⚠️ Virement à vérifier : ${amount}${who ? `, ${who}` : ""}`;
  return { title, lines: [decision.reason, ...facts(tx), "Rien n'a été coché automatiquement."], studentId: decision.student?.id ?? null };
}

export async function handleEvent(payload: unknown, deps: WebhookDeps): Promise<{ result: string }> {
  const p = (payload ?? {}) as { event?: unknown; data?: Record<string, unknown> };
  const event = typeof p.event === "string" ? p.event : "";
  if (event !== "TransactionCreated" && event !== "TransactionStateChanged") return { result: `événement ignoré : ${event || "inconnu"}` };
  const id = typeof p.data?.id === "string" ? p.data.id : null;
  if (!id) return { result: "événement sans identifiant de transaction" };

  // TransactionStateChanged ne donne pas le montant : on relit la transaction.
  let tx: RevolutTransaction = event === "TransactionCreated" && Array.isArray(p.data?.legs) ? (p.data as unknown as RevolutTransaction) : await deps.fetchTransaction(id);
  const announced = typeof p.data?.new_state === "string" ? p.data.new_state : null;
  if (announced && rank(announced) > rank(tx.state)) tx = { ...tx, state: announced };

  const before = await deps.store.get(id);
  const late = before !== null && rank(before.state) > rank(tx.state);
  if (late) await deps.store.touch(id, event);
  else await deps.store.save(tx, event);
  const state = late ? before.state : tx.state;

  // Virement annulé après coup : on ne décoche jamais tout seul, on prévient.
  if (ENDED.has(state)) {
    const seen = before?.match_status === "paid" || before?.match_status === "alert";
    if (before && seen && !before.alerts.annule) {
      const pos = before.schedule_position;
      const what = before.match_status === "paid" ? `Ce virement avait coché l'échéance ${pos ?? "?"} comme reçue : décoche-la à la main.` : "Ce virement t'avait été signalé : si tu as coché l'échéance entre-temps, décoche-la.";
      await deps.alert({ title: `↩️ Virement annulé par Revolut${pos ? ` : échéance ${pos} à revoir` : ""}`, lines: [`Revolut indique « ${state} ».`, what, ...facts(tx)], studentId: before.student_id });
      await deps.store.noteAlerts(id, { ...before.alerts, annule: deps.now().toISOString() });
      return { result: "annulé après coup : Jeremy prévenu" };
    }
    return { result: `état ${state}` };
  }
  if (state !== "completed") return { result: `en attente (${state})` };

  if (!(await deps.store.claim(id))) return { result: "déjà traitée" };
  try {
    // Événement en retard sur une transaction terminée : on relit la version terminée.
    if (tx.state !== "completed") tx = await deps.fetchTransaction(id);
    const decision = decide(tx, await deps.loadStudents());
    const alerts = { ...(before?.alerts ?? {}) };
    let outcome: Outcome;
    if (decision.action === "ignore") {
      outcome = { match_status: "ignored", match_reason: decision.reason, student_id: null, schedule_position: null, alerts };
    } else if (decision.action === "alert") {
      await deps.alert(alertFor(decision, tx));
      alerts[decision.kind] = deps.now().toISOString();
      outcome = { match_status: "alert", match_reason: decision.reason, student_id: decision.student?.id ?? null, schedule_position: decision.position, alerts };
    } else {
      const changed = await deps.markPaid(decision.student.id, decision.position, decision.date);
      // Pas changé : cochée entre-temps (par Jeremy ou le job). Elle est payée, rien à signaler.
      outcome = { match_status: "paid", match_reason: changed ? `Cochée : ${decision.reason}` : `Déjà cochée entre-temps : ${decision.reason}`, student_id: decision.student.id, schedule_position: decision.position, alerts };
      // Une mise de côté ratée ne doit pas faire renvoyer l'événement : le job rattrape.
      const aside = deps.setAside
        ? await deps.setAside(decision.student.id, decision.position, tx.id).catch((err) => {
            console.error("Webhook Revolut : mise de côté non enregistrée", err);
            return null;
          })
        : null;
      if (aside) outcome.match_reason += ` · mise de côté ${aside}`;
    }
    await deps.store.finish(id, outcome);
    return { result: `${outcome.match_status} : ${outcome.match_reason}` };
  } catch (err) {
    await deps.store.release(id).catch(() => undefined);
    throw err;
  }
}
