import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { adminAlert } from "@/lib/emails/ventes";
import { esc } from "@/lib/emails/layout";
import { sendBuiltEmail } from "@/lib/emails/send";
import { MAX_PROOFS_PER_STUDENT, MAX_PROOF_BYTES, PROOF_BUCKET, PROOF_TYPES, matchesType } from "@/lib/residence-proofs";
import { getAdminClient } from "@/lib/supabase";

// Dépôt du justificatif, côté élève : pas de compte, le jeton unique du lien sert
// de clé. Le fichier part directement dans le stockage privé (lien d'envoi
// temporaire), puis on vérifie ce qui a été reçu avant de l'enregistrer.

const UUID = /^[0-9a-f-]{36}$/i;
const ADMIN_URL = "https://www.jeremypitault.com/admin/factures";

async function findStudent(token: unknown) {
  if (typeof token !== "string" || !UUID.test(token)) return null;
  const { data } = await getAdminClient().from("students").select("id, name").eq("proof_token", token).maybeSingle();
  return data;
}

async function latestProof(studentId: string) {
  const { data } = await getAdminClient()
    .from("residence_proofs")
    .select("status, reject_reason, created_at, file_name")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

// Vrai si l'élève ne peut plus rien déposer : déjà validé, ou trop de dépôts.
async function closedReason(studentId: string): Promise<string | null> {
  const db = getAdminClient();
  const { data: rows } = await db.from("residence_proofs").select("status").eq("student_id", studentId);
  if ((rows ?? []).some((r) => r.status === "accepted")) return "Ton justificatif est déjà validé, il n'y a plus rien à faire.";
  if ((rows ?? []).length >= MAX_PROOFS_PER_STUDENT) return "Tu as déjà déposé plusieurs documents. Réponds à mon email si tu as besoin d'en envoyer un autre.";
  return null;
}

export async function GET(req: NextRequest) {
  const s = await findStudent(req.nextUrl.searchParams.get("token"));
  if (!s) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });
  const last = await latestProof(s.id);
  return NextResponse.json({
    firstName: s.name.split(" ")[0],
    status: last?.status ?? "none",
    rejectReason: last?.status === "rejected" ? last.reject_reason : null,
    fileName: last?.file_name ?? null,
  });
}

// Étape 1 : autorise l'envoi d'un fichier et renvoie un lien temporaire.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const s = await findStudent(b.token);
  if (!s) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });
  const type = String(b.type ?? "");
  const size = Number(b.size ?? 0);
  if (!PROOF_TYPES[type]) return NextResponse.json({ error: "Envoie un PDF ou une photo (JPG, PNG ou HEIC)." }, { status: 400 });
  if (!(size > 0) || size > MAX_PROOF_BYTES) return NextResponse.json({ error: "Le fichier doit faire moins de 10 Mo." }, { status: 400 });
  const closed = await closedReason(s.id);
  if (closed) return NextResponse.json({ error: closed }, { status: 409 });
  const path = `${s.id}/${randomUUID()}.${PROOF_TYPES[type]}`;
  const { data, error } = await getAdminClient().storage.from(PROOF_BUCKET).createSignedUploadUrl(path);
  if (error || !data) return NextResponse.json({ error: "Envoi impossible pour le moment, réessaie." }, { status: 500 });
  return NextResponse.json({ path, uploadToken: data.token });
}

// Étape 2 : le fichier est arrivé. On contrôle son contenu réel avant de le garder.
export async function PUT(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const s = await findStudent(b.token);
  if (!s) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });
  const path = String(b.path ?? "");
  const type = String(b.type ?? "");
  if (!path.startsWith(`${s.id}/`) || !PROOF_TYPES[type]) return NextResponse.json({ error: "Envoi invalide" }, { status: 400 });

  const db = getAdminClient();
  const storage = db.storage.from(PROOF_BUCKET);
  const { data: blob, error } = await storage.download(path);
  if (error || !blob) return NextResponse.json({ error: "Le fichier n'est pas arrivé, réessaie." }, { status: 400 });
  const head = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
  if (blob.size > MAX_PROOF_BYTES || !matchesType(head, type)) {
    await storage.remove([path]);
    return NextResponse.json({ error: "Ce fichier n'est pas un PDF ou une image lisible." }, { status: 400 });
  }
  const closed = await closedReason(s.id);
  if (closed) {
    await storage.remove([path]);
    return NextResponse.json({ error: closed }, { status: 409 });
  }

  const fileName = String(b.name ?? "justificatif").replace(/[^\p{L}\p{N} ._-]/gu, "_").slice(0, 120) || "justificatif";
  const { error: insertError } = await db.from("residence_proofs").insert({ student_id: s.id, file_path: path, file_name: fileName, mime_type: type, size_bytes: blob.size });
  if (insertError) return NextResponse.json({ error: "Enregistrement impossible, réessaie." }, { status: 500 });

  await sendBuiltEmail(
    { email: "jeremypltpro@gmail.com", name: "Jeremy" },
    adminAlert(`${s.name} a déposé son justificatif de domicile`, [`<strong>${esc(s.name)}</strong> vient de déposer son justificatif. Vérifie qu'il est récent, à son nom et à l'adresse du contrat, puis valide-le.`], "justificatif-depot", { label: "Voir le justificatif", href: ADMIN_URL }),
  ).catch((err) => console.error("Alerte justificatif :", err));
  return NextResponse.json({ ok: true });
}
