// Envoi des contrats "Pack Incubateur App Mastery" via l'API DocuSeal.
//
// Trois modèles (paiement 1x, 2x, 3x), créés depuis les DOCX du Drive avec des
// balises {{...}}. Un seul signataire, le rôle "Client". Le site pré-remplit
// le nom, l'email, le téléphone, la date de début et les infos société.
// DocuSeal envoie lui-même l'email de signature au client.

const ROLE = "Client";

// Identifiants des modèles, différents entre le mode test et la production.
function templateId(installments: number): number | null {
  const raw = process.env[`DOCUSEAL_TEMPLATE_${installments}X`];
  return raw ? Number(raw) : null;
}

export type ContractCompany = {
  name?: string;
  legalForm?: string;
  registration?: string;
  address?: string;
  signerRole?: string;
};

export type ContractInput = {
  installments: number;
  email: string;
  fullName: string;
  phone: string;
  startDate?: string | null; // "2026-10-09"
  company?: ContractCompany;
};

export function contractsConfigured(): boolean {
  return Boolean(process.env.DOCUSEAL_API_KEY);
}

export function hasTemplate(installments: number): boolean {
  return templateId(installments) !== null;
}

async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const key = process.env.DOCUSEAL_API_KEY;
  if (!key) throw new Error("DocuSeal n'est pas configuré (DOCUSEAL_API_KEY manquante)");
  const base = process.env.DOCUSEAL_API_URL || "https://api.docuseal.com";
  const res = await fetch(`${base}${path}`, {
    method: init.method ?? "GET",
    headers: { "X-Auth-Token": key, "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await res.text();
  if (!res.ok) {
    let message = text;
    try {
      message = JSON.parse(text).error || text;
    } catch {
      // texte brut
    }
    throw new Error(`DocuSeal ${init.method ?? "GET"} ${path} : ${message}`);
  }
  return (text ? JSON.parse(text) : {}) as T;
}

function frDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// Crée la demande de signature et l'envoie au client. Retourne l'identifiant
// de la soumission DocuSeal et le lien de signature (pour les relances).
export async function sendContract(input: ContractInput): Promise<{ id: string; link: string }> {
  const id = templateId(input.installments);
  if (!id) throw new Error(`Pas de modèle de contrat pour un paiement en ${input.installments} fois`);

  const c = input.company ?? {};
  const values: Record<string, string> = {
    "Nom et prénom": input.fullName,
    Email: input.email,
    Téléphone: input.phone,
  };
  if (input.startDate) values["Date de début"] = frDate(input.startDate);
  if (c.name) values["Dénomination sociale"] = c.name;
  if (c.legalForm) values["Forme juridique"] = c.legalForm;
  if (c.registration) values["Immatriculation"] = c.registration;
  if (c.address) values["Adresse du siège"] = c.address;
  if (c.signerRole) values["Qualité du signataire"] = c.signerRole;

  const submitters = await api<{ submission_id: number; slug: string }[]>("/submissions", {
    method: "POST",
    body: {
      template_id: id,
      send_email: true,
      message: {
        subject: "App Mastery : ton contrat à signer",
        body:
          "Salut {{submitter.name}},\n\nVoici ton contrat d'accompagnement App Mastery. Tu peux le lire et le signer en ligne ici :\n\n{{submitter.link}}\n\nÀ très vite,\nJeremy",
      },
      submitters: [{ role: ROLE, email: input.email, name: input.fullName, values }],
    },
  });
  const app = (process.env.DOCUSEAL_API_URL || "https://api.docuseal.com").replace("://api.", "://");
  return { id: String(submitters[0].submission_id), link: `${app}/s/${submitters[0].slug}` };
}

export type ContractStatus = "sent" | "delivered" | "completed" | "declined" | "voided";

type Submission = {
  status: "pending" | "completed" | "declined" | "expired";
  completed_at?: string | null;
  submitters: { status: "awaiting" | "sent" | "opened" | "completed" | "declined" }[];
};

export async function contractStatus(submissionId: string): Promise<{ status: ContractStatus; completedAt?: string }> {
  const s = await api<Submission>(`/submissions/${submissionId}`);
  if (s.status === "completed") return { status: "completed", completedAt: s.completed_at ?? undefined };
  if (s.status === "declined") return { status: "declined" };
  if (s.status === "expired") return { status: "voided" };
  return { status: s.submitters.some((x) => x.status === "opened") ? "delivered" : "sent" };
}
