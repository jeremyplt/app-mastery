import { NextRequest, NextResponse } from "next/server";
import { getAdminRole } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";
import { attribute, type ContactRow, type RevenueRow } from "@/lib/crm-attribution";

// Leads, RDV, élèves et euros par campagne (utm_campaign du premier contact),
// lus dans le CRM. Les élèves et les euros sont réservés au propriétaire,
// comme le chiffre d'affaires.

const ALLOWED_DAYS = [0, 7, 30, 90, 365];
const PAGE = 1000;

type Payment = { amount: number | string | null; paid: boolean };

async function allLeads(): Promise<ContactRow[]> {
  const supabase = getAdminClient();
  const rows: ContactRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("crm_leads")
      .select("email, created_at, utm_source, utm_medium, utm_campaign, call_booked")
      .order("created_at", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

const sum = (payments: Payment[], paidOnly: boolean) =>
  payments.reduce((n, p) => n + (!paidOnly || p.paid ? Number(p.amount ?? 0) || 0 : 0), 0);

export async function GET(req: NextRequest) {
  try {
    const role = await getAdminRole();
    if (!role) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const days = Number(req.nextUrl.searchParams.get("days") || 0);
    if (!ALLOWED_DAYS.includes(days)) {
      return NextResponse.json({ error: "Période invalide" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const [leads, cands, sales, students] = await Promise.all([
      allLeads(),
      supabase.from("candidatures").select("email, created_at, utm_source, utm_medium, utm_campaign"),
      supabase.from("sales").select("email, created_at, contract_status, total_amount, sale_payments(amount, paid)"),
      supabase.from("students").select("email, created_at, payments").is("sale_id", null),
    ]);
    for (const r of [cands, sales, students]) if (r.error) throw new Error(r.error.message);

    // Mêmes règles que le chiffre d'affaires : contrats refusés ou annulés
    // exclus, élèves sans vente comptés avec leurs paiements saisis à la main.
    const revenue: RevenueRow[] = [];
    for (const s of sales.data ?? []) {
      if (s.contract_status === "declined" || s.contract_status === "voided") continue;
      revenue.push({ email: s.email ?? "", created_at: s.created_at, signed: Number(s.total_amount) || 0, cashed: sum(s.sale_payments ?? [], true) });
    }
    for (const st of students.data ?? []) {
      const payments = (st.payments ?? []) as Payment[];
      revenue.push({ email: st.email ?? "", created_at: st.created_at, signed: sum(payments, false), cashed: sum(payments, true) });
    }

    const contacts: ContactRow[] = [...leads, ...((cands.data ?? []).filter((c) => c.email) as ContactRow[])];
    const since = days > 0 ? new Date(Date.now() - days * 86_400_000).toISOString() : null;
    let rows = attribute(contacts, revenue, since);

    if (role !== "owner") {
      rows = rows.map((r) => ({ ...r, students: 0, signed: 0, cashed: 0 })).sort((a, b) => b.leads - a.leads);
    }
    return NextResponse.json({ rows, days, money: role === "owner" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
