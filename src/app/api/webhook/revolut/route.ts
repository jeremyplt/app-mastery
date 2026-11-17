import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@/lib/revolut/signature";
import { handleEvent } from "@/lib/revolut/webhook";
import { realWebhookDeps } from "@/lib/revolut/store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Webhook Revolut Business (API v2, événements TransactionCreated et
// TransactionStateChanged) : un virement d'élève arrivé sur le compte Main EUR
// coche son échéance dans la minute, sans attendre le job de factures. Au
// moindre doute, rien n'est coché et Jeremy reçoit une alerte. Chaque
// transaction est gardée dans revolut_transactions. Signature HMAC vérifiée
// avec REVOLUT_WEBHOOK_SECRET (le signing secret donné par Revolut).
export async function POST(req: NextRequest) {
  const secret = process.env.REVOLUT_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("Webhook Revolut : REVOLUT_WEBHOOK_SECRET manquante");
    // 500 : Revolut réessaiera, le temps de poser la variable.
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 500 });
  }
  const raw = await req.text();
  const check = verifySignature({
    secret,
    timestamp: req.headers.get("revolut-request-timestamp"),
    signatures: req.headers.get("revolut-signature"),
    rawBody: raw,
  });
  if (!check.ok) {
    console.warn(`Webhook Revolut refusé : ${check.reason}`);
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  try {
    const { result } = await handleEvent(payload, realWebhookDeps());
    console.log(`Webhook Revolut ${(payload as { event?: string }).event ?? "?"} : ${result}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook Revolut :", err);
    // 500 : Revolut renvoie l'événement (3 fois, toutes les 10 minutes).
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
