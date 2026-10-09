import { NextRequest, NextResponse } from "next/server";
import { getAdminRole } from "@/lib/admin";
import { getSessionEmail } from "@/lib/auth";
import { getAdminClient, withRetry } from "@/lib/supabase";
import { contractsConfigured, hasTemplate } from "@/lib/docuseal";
import { createStudentFromSale } from "@/lib/students";
import { DEFAULT_COMMISSION_RATE, commissionFor } from "@/lib/commissions";
import { SALE_SELECT, contractPending, getBankDetails, getSale, linkLead, normalize, onConfirmed, syncContract, unlinkLead, type Sale } from "@/lib/ventes";

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : "Erreur";
  if (message === "Accès non autorisé") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ error: message }, { status: 500 });
}

async function requireRole() {
  const role = await getAdminRole();
  if (!role) throw new Error("Accès non autorisé");
  return role;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET() {
  try {
    const role = await requireRole();
    // Un closer ne voit que ses propres ventes.
    const me = (await getSessionEmail())?.trim().toLowerCase() ?? "";
    const rows = await withRetry(() => {
      const q = getAdminClient().from("sales").select(SALE_SELECT).order("created_at", { ascending: false }).limit(500);
      return role === "closer" ? q.eq("closer_email", me) : q;
    });
    const sales = ((rows ?? []) as Sale[]).map(normalize);
    // Contrats en attente : on relit leur statut chez DocuSeal à l'ouverture de
    // la page, pour afficher une signature tout de suite (le webhook ne peut
    // pas joindre un serveur local, et le cron ne passe que toutes les 15 min).
    await Promise.all(
      sales.filter((s) => !s.archived && contractPending(s)).map((s) => syncContract(s).catch(() => null)),
    );
    const bank = await getBankDetails();
    const { data: closers } = await getAdminClient().from("admin_users").select("email, name").eq("role", "closer").order("email");
    return NextResponse.json({
      me: { email: await getSessionEmail(), role },
      closers: closers ?? [],
      sales,
      bank,
      contracts: contractsConfigured(),
      contractTemplates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(hasTemplate),
      isOwner: role === "owner",
    });
  } catch (err) {
    return fail(err);
  }
}

type PaymentInput = { amount: number; due_date: string };

// Déclarer une vente : client + échéancier.
export async function POST(req: NextRequest) {
  try {
    const role = await requireRole();
    const b = await req.json();

    // Vendu par : un closer touche une commission. Un closer connecté ne peut
    // déclarer que ses propres ventes.
    const me = (await getSessionEmail())?.trim().toLowerCase() ?? null;
    let closerEmail: string | null = role === "closer" ? me : String(b.closer_email ?? "").trim().toLowerCase() || null;
    if (closerEmail) {
      const { data: c } = await getAdminClient().from("admin_users").select("email").eq("email", closerEmail).eq("role", "closer").maybeSingle();
      if (!c) closerEmail = null;
    }
    const commissionRate = Number(b.commission_rate) >= 0 && Number(b.commission_rate) <= 100 ? Number(b.commission_rate) : DEFAULT_COMMISSION_RATE;

    const email = String(b.email ?? "").trim().toLowerCase();
    const firstName = String(b.first_name ?? "").trim();
    const payments: PaymentInput[] = Array.isArray(b.payments) ? b.payments : [];
    if (!email.includes("@")) return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    if (!firstName) return NextResponse.json({ error: "Prénom manquant" }, { status: 400 });
    if (payments.length < 1 || payments.length > 12) {
      return NextResponse.json({ error: "Entre 1 et 12 paiements" }, { status: 400 });
    }
    if (payments.some((p) => !(Number(p.amount) > 0) || !ISO_DATE.test(p.due_date))) {
      return NextResponse.json({ error: "Chaque paiement doit avoir un montant et une date" }, { status: 400 });
    }
    const offsets: number[] = Array.isArray(b.reminder_offsets)
      ? [...new Set<number>(b.reminder_offsets.map(Number).filter((n: number) => Number.isInteger(n) && n >= -30 && n <= 30))]
      : [3, 1, 0, -3, -7];

    const supabase = getAdminClient();
    const { origin, utm } = await linkLead(email);
    const { data: sale, error } = await supabase
      .from("sales")
      .insert({
        origin,
        utm,
        created_by: await getSessionEmail(),
        email,
        first_name: firstName,
        last_name: String(b.last_name ?? "").trim() || null,
        phone: String(b.phone ?? "").trim() || null,
        offer: String(b.offer ?? "").trim() || undefined,
        total_amount: payments.reduce((s, p) => s + Number(p.amount), 0),
        closer_email: closerEmail,
        commission_rate: commissionRate,
        commission_amount: closerEmail ? commissionFor(payments.reduce((s, p) => s + Number(p.amount), 0), commissionRate) : null,
        installments: payments.length,
        start_date: ISO_DATE.test(b.start_date ?? "") ? b.start_date : null,
        company: typeof b.company === "object" && b.company ? b.company : {},
        reminder_offsets: offsets,
        notes: String(b.notes ?? "").trim() || null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const { error: payErr } = await supabase.from("sale_payments").insert(
      payments.map((p, i) => ({ sale_id: sale.id, position: i + 1, amount: Number(p.amount), due_date: p.due_date })),
    );
    if (payErr) {
      await supabase.from("sales").delete().eq("id", sale.id);
      throw new Error(payErr.message);
    }

    const created = await getSale(sale.id);
    await createStudentFromSale(created);
    return NextResponse.json({ sale: created });
  } catch (err) {
    return fail(err);
  }
}

// Modifier une vente ou une échéance. Cocher un paiement peut déclencher
// l'invitation Skool (si le contrat est déjà signé).
export async function PATCH(req: NextRequest) {
  try {
    await requireRole();
    const b = await req.json();
    const supabase = getAdminClient();

    if (typeof b.payment_id === "string") {
      const update: Record<string, unknown> = {};
      if (typeof b.paid === "boolean") {
        update.paid = b.paid;
        update.paid_at = b.paid ? new Date().toISOString() : null;
      }
      if (Number(b.amount) > 0) update.amount = Number(b.amount);
      if (ISO_DATE.test(b.due_date ?? "")) {
        update.due_date = b.due_date;
        update.reminders_sent = {};
      }
      const { data, error } = await supabase.from("sale_payments").update(update).eq("id", b.payment_id).select("sale_id").single();
      if (error) throw new Error(error.message);
      if (update.amount !== undefined) {
        const { data: all } = await supabase.from("sale_payments").select("amount").eq("sale_id", data.sale_id);
        const total = (all ?? []).reduce((s, p) => s + Number(p.amount), 0);
        const { data: cur } = await supabase.from("sales").select("closer_email, commission_rate").eq("id", data.sale_id).single();
        await supabase
          .from("sales")
          .update({ total_amount: total, commission_amount: cur?.closer_email ? commissionFor(total, Number(cur.commission_rate)) : null })
          .eq("id", data.sale_id);
      }
      const sale = await getSale(data.sale_id);
      const skool = await onConfirmed(sale);
      return NextResponse.json({ sale: skool.invited ? await getSale(sale.id) : sale, skoolError: skool.error });
    }

    if (typeof b.id !== "string") return NextResponse.json({ error: "id manquant" }, { status: 400 });
    const update: Record<string, unknown> = {};
    if (typeof b.notes === "string") update.notes = b.notes.trim() || null;
    if (typeof b.archived === "boolean") update.archived = b.archived;
    // Closer et taux de commission : modifiables par le propriétaire seulement.
    if ((b.closer_email !== undefined || b.commission_rate !== undefined) && (await getAdminRole()) === "owner") {
      const { data: cur } = await supabase.from("sales").select("total_amount, closer_email, commission_rate").eq("id", b.id).single();
      const closer = b.closer_email !== undefined ? String(b.closer_email ?? "").trim().toLowerCase() || null : cur?.closer_email ?? null;
      const rate = b.commission_rate !== undefined && Number(b.commission_rate) >= 0 && Number(b.commission_rate) <= 100 ? Number(b.commission_rate) : Number(cur?.commission_rate ?? DEFAULT_COMMISSION_RATE);
      update.closer_email = closer;
      update.commission_rate = rate;
      update.commission_amount = closer ? commissionFor(Number(cur?.total_amount ?? 0), rate) : null;
    }
    if (Array.isArray(b.reminder_offsets)) {
      update.reminder_offsets = [...new Set<number>(b.reminder_offsets.map(Number).filter((n: number) => Number.isInteger(n) && n >= -30 && n <= 30))];
    }
    // Contrat géré à la main (envoyé hors du CRM) : on coche "signé".
    if (typeof b.contract_signed === "boolean") {
      update.contract_status = b.contract_signed ? "completed" : "none";
      update.contract_signed_at = b.contract_signed ? new Date().toISOString() : null;
    }
    if (Object.keys(update).length === 0) return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });

    const { error } = await supabase.from("sales").update(update).eq("id", b.id);
    if (error) throw new Error(error.message);
    const sale = await getSale(b.id);
    const skool = await onConfirmed(sale);
    return NextResponse.json({ sale: skool.invited ? await getSale(sale.id) : sale, skoolError: skool.error });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const role = await requireRole();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });
    if (role === "closer") {
      const me = (await getSessionEmail())?.trim().toLowerCase();
      const { data: own } = await getAdminClient().from("sales").select("id").eq("id", id).eq("closer_email", me ?? "").maybeSingle();
      if (!own) throw new Error("Accès non autorisé");
    }
    // L'élève créé par cette vente part avec elle (vente de test, erreur de saisie).
    await getAdminClient().from("students").delete().eq("sale_id", id);
    const { data: deleted, error } = await getAdminClient().from("sales").delete().eq("id", id).select("email").single();
    if (error) throw new Error(error.message);
    await unlinkLead(deleted.email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
