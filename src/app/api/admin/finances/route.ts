import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";
import { closerSummaries } from "@/lib/commissions";

// Chiffre d'affaires mois par mois (propriétaire seulement) :
// - encaissé : paiements reçus, au mois où ils ont été cochés (sinon échéance) ;
// - à venir / en retard : paiements non reçus, au mois de leur échéance ;
// - commissions : au mois de déblocage (ou de déblocage prévu) ;
// - net = encaissé + à venir - commissions (le retard n'est pas compté).
// Sources : paiements des ventes (hors contrats refusés ou expirés) et
// paiements saisis à la main sur les élèves sans vente.

type Month = { month: string; cashed: number; upcoming: number; late: number; commissions: number; payouts: number };

const parisDay = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
const monthOf = (iso: string) => iso.slice(0, 7);

function addMonths(month: string, n: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 7);
}

export async function GET() {
  try {
    await requireOwner();
    const supabase = getAdminClient();
    const [{ data: sales }, { data: students }, closers] = await Promise.all([
      supabase.from("sales").select("contract_status, sale_payments(amount, due_date, paid, paid_at)"),
      supabase.from("students").select("payments").is("sale_id", null),
      closerSummaries(),
    ]);
    const today = parisDay();
    const months = new Map<string, Month>();
    const at = (month: string) => {
      if (!months.has(month)) months.set(month, { month, cashed: 0, upcoming: 0, late: 0, commissions: 0, payouts: 0 });
      return months.get(month)!;
    };

    const addPayment = (amount: number, due: string, paid: boolean, paidAt: string | null | undefined) => {
      if (!(amount > 0)) return;
      if (paid) at(monthOf(paidAt ?? due)).cashed += amount;
      else if (due < today) at(monthOf(due)).late += amount;
      else at(monthOf(due)).upcoming += amount;
    };
    for (const s of sales ?? []) {
      if (s.contract_status === "declined" || s.contract_status === "voided") continue;
      for (const p of s.sale_payments) addPayment(Number(p.amount), p.due_date, p.paid, p.paid_at);
    }
    for (const st of students ?? []) {
      for (const p of (st.payments ?? []) as { amount: number | null; date: string; paid: boolean; paid_at?: string | null }[]) {
        addPayment(Number(p.amount ?? 0), p.date, p.paid, p.paid_at);
      }
    }
    for (const c of closers) {
      for (const e of c.entries) {
        if (e.state === "cancelled") continue;
        const when = e.state === "ready" ? e.unlocked_on : e.unlocks_on;
        if (when) at(monthOf(when)).commissions += e.commission_amount;
      }
      for (const p of c.payouts) at(monthOf(p.paid_on)).payouts += p.amount;
    }

    // Fenêtre : du premier mois avec des données (au plus 12 mois en arrière)
    // jusqu'à 3 mois après le mois en cours, sans trou.
    const current = monthOf(today);
    const keys = [...months.keys()].sort();
    let start = keys[0] && keys[0] < current ? keys[0] : addMonths(current, -2);
    if (start < addMonths(current, -12)) start = addMonths(current, -12);
    let end = addMonths(current, 3);
    if (keys.length && keys[keys.length - 1] > end) end = keys[keys.length - 1];
    const series: Month[] = [];
    for (let m = start; m <= end; m = addMonths(m, 1)) {
      const v = at(m);
      series.push(Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typeof x === "number" ? Math.round(x * 100) / 100 : x])) as Month);
    }

    const sum = (k: keyof Omit<Month, "month">, from?: string, to?: string) =>
      [...months.values()].filter((m) => (!from || m.month >= from) && (!to || m.month <= to)).reduce((n, m) => n + m[k], 0);
    return NextResponse.json({
      today,
      months: series,
      totals: {
        cashedThisMonth: sum("cashed", current, current),
        cashedAll: sum("cashed"),
        upcoming3: sum("upcoming", current, addMonths(current, 2)),
        late: sum("late"),
        commissionsDue: closers.reduce((n, c) => n + Math.max(c.due, 0), 0),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    return NextResponse.json({ error: message === "Accès non autorisé" ? "Non autorisé" : message }, { status: message === "Accès non autorisé" ? 401 : 500 });
  }
}
