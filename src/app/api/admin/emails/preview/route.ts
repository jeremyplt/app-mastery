import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { buildSequenceAEmail, type SequenceAStep } from "@/lib/emails/sequence-a";
import { buildSequenceBEmail } from "@/lib/emails/sequence-b";
import {
  BREVO_TEMPLATE_IDS,
  appelDecouverte,
  candidatureProspect,
  magicLink,
  metabase,
  planAction,
  vslAccess,
  type BuiltEmail,
} from "@/lib/emails/transactional";

export const dynamic = "force-dynamic";

// Aperçu d'un email tel qu'il partirait aujourd'hui, avec des données
// d'exemple. Les emails construits dans le code sont rendus directement ;
// les modèles Brevo (guides, bienvenue) sont lus via l'API Brevo.
const SAMPLE_FIRST_NAME = "Thomas";

function sampleCall() {
  const start = new Date(Date.now() + 26 * 60 * 60 * 1000);
  start.setUTCMinutes(30, 0, 0);
  return {
    firstName: SAMPLE_FIRST_NAME,
    host: "Nolan" as const,
    startTime: start,
    rescheduleUrl: "https://calendly.com/masteryapp-jeremy/30min",
    joinUrl: "https://calendly.com/",
  };
}

function buildFromCode(tag: string): BuiltEmail | null {
  // Séquence A : seq-a-1-v1, seq-a-1-v2, seq-a-1-v3, seq-a-2 à seq-a-8.
  const seqA = /^seq-a-(\d)(?:-v(\d))?$/.exec(tag);
  if (seqA) {
    const step = Number(seqA[1]) as SequenceAStep;
    const variant = seqA[2] ? Number(seqA[2]) : 1;
    const watchSeconds = variant === 1 ? 0 : variant === 2 ? 400 : 1110;
    return buildSequenceAEmail(step, { firstName: SAMPLE_FIRST_NAME, email: "thomas@exemple.fr", watchSeconds });
  }
  switch (tag) {
    case "seq-b-1-confirm":
      return buildSequenceBEmail("confirm", sampleCall());
    case "seq-b-2-veille":
      return buildSequenceBEmail("veille", sampleCall());
    case "seq-b-3-jourj":
      return buildSequenceBEmail("jourj", sampleCall());
    case "vsl-conference":
      return vslAccess(SAMPLE_FIRST_NAME);
    case "plan-action":
      return planAction(SAMPLE_FIRST_NAME);
    case "appel-decouverte":
      return appelDecouverte(SAMPLE_FIRST_NAME);
    case "metabase":
      return metabase(SAMPLE_FIRST_NAME);
    case "candidature-qualifie":
      return candidatureProspect(SAMPLE_FIRST_NAME, "thomas@exemple.fr", true);
    case "candidature-non-qualifie":
      return candidatureProspect(SAMPLE_FIRST_NAME, "thomas@exemple.fr", false);
    case "magic-link":
      return magicLink("https://www.jeremypitault.com/api/auth/verify?token=exemple");
    default:
      return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  const tag = req.nextUrl.searchParams.get("tag") || "";

  const built = buildFromCode(tag);
  if (built) {
    return NextResponse.json({ subject: built.subject, body: built.html, source: "code", sample: SAMPLE_FIRST_NAME });
  }

  const templateId = BREVO_TEMPLATE_IDS[tag];
  if (templateId) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "BREVO_API_KEY manquante" }, { status: 500 });
    const res = await fetch(`https://api.brevo.com/v3/smtp/templates/${templateId}`, {
      headers: { "api-key": apiKey, Accept: "application/json" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Modèle Brevo ${templateId} introuvable` }, { status: 404 });
    }
    const t = (await res.json()) as { subject?: string; htmlContent?: string; name?: string };
    return NextResponse.json({
      subject: t.subject ?? t.name ?? "",
      body: t.htmlContent ?? "",
      source: "brevo",
      templateId,
    });
  }

  return NextResponse.json({ error: "Pas d'aperçu pour cet email" }, { status: 404 });
}
