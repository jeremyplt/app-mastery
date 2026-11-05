// Règles pures des justificatifs de domicile : qui doit en fournir un, et contrôle
// du fichier reçu. Aucune dépendance, pour pouvoir les tester seules.

const clean = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .trim();

const EU_NAMES = new Set(
  "france fr belgique belgium belgie be luxembourg lu allemagne germany deutschland de espagne spain espana es italie italy italia it portugal pt pays bas netherlands nederland hollande nl irlande ireland ie autriche austria at suede sweden se danemark denmark dk finlande finland fi pologne poland pl grece greece gr roumanie romania ro bulgarie bulgaria bg hongrie hungary hu tchequie czechia republique tcheque czech republic cz slovaquie slovakia sk slovenie slovenia si croatie croatia hr estonie estonia ee lettonie latvia lv lituanie lithuania lt malte malta mt chypre cyprus cy"
    .split(" ")
    .concat(["pays bas", "republique tcheque", "czech republic"]),
);

const NON_EU_NAMES = new Set([
  "canada", "quebec", "suisse", "switzerland", "royaume uni", "uk", "united kingdom", "angleterre", "england", "ecosse", "scotland", "pays de galles", "wales", "etats unis", "etats unis d amerique", "usa", "us", "united states", "united states of america", "amerique", "maroc", "morocco", "algerie", "algeria", "tunisie", "tunisia", "senegal", "cote d ivoire", "ivory coast", "cameroun", "cameroon", "madagascar", "maurice", "ile maurice", "mauritius", "emirats", "emirats arabes unis", "united arab emirates", "uae", "eau", "dubai", "abu dhabi", "arabie saoudite", "saudi arabia", "qatar", "liban", "lebanon", "israel", "turquie", "turkey", "norvege", "norway", "islande", "iceland", "japon", "japan", "thailande", "thailand", "vietnam", "indonesie", "indonesia", "bali", "australie", "australia", "nouvelle zelande", "new zealand", "bresil", "brazil", "mexique", "mexico", "colombie", "colombia", "argentine", "argentina", "chine", "china", "inde", "india", "singapour", "singapore", "hong kong", "mali", "gabon", "togo", "benin", "burkina faso", "congo", "rdc", "guinee", "niger", "tchad", "rwanda", "afrique du sud", "south africa", "nigeria", "ghana", "kenya", "egypte", "egypt", "andorre", "andorra",
]);

// Le pays est saisi à la main dans le contrat. Un nom non reconnu (faute de
// frappe, territoire d'outre-mer, Monaco...) n'est jamais considéré hors UE par
// défaut : Jeremy est prévenu plutôt que d'envoyer un mail à côté de la plaque.
export function countryZone(raw: string | null | undefined): "eu" | "non_eu" | "unknown" {
  const c = clean(raw ?? "");
  if (!c) return "unknown";
  if (EU_NAMES.has(c)) return "eu";
  if (NON_EU_NAMES.has(c)) return "non_eu";
  return "unknown";
}

// À la signature : "send" pour un particulier hors UE, "skip" pour une société ou
// un client de l'UE, "check" quand on ne peut pas trancher.
export function proofDecision(billing: Record<string, string | undefined> | null | undefined): "send" | "skip" | "check" {
  const statut = clean(billing?.["Statut"] ?? "");
  if (statut === "societe") return "skip";
  const zone = countryZone(billing?.["Pays"]);
  if (zone === "eu") return "skip";
  if (zone === "non_eu" && statut === "particulier") return "send";
  return "check";
}

// Le fichier reçu est-il bien du type annoncé ? On regarde ses premiers octets.
export function matchesType(head: Uint8Array, type: string): boolean {
  const ascii = (from: number, to: number) => String.fromCharCode(...head.subarray(from, to));
  if (type === "application/pdf") return ascii(0, 5) === "%PDF-";
  if (type === "image/jpeg") return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  if (type === "image/png") return head[0] === 0x89 && ascii(1, 4) === "PNG";
  if (type === "image/webp") return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  if (type === "image/heic" || type === "image/heif") return ascii(4, 8) === "ftyp";
  return false;
}

// Avis de l'IA sur un justificatif. L'IA ne fait que lire le document : le
// verdict et le calcul des 3 mois sont faits ici, par du code. Cet avis est
// indicatif pour Jeremy : il ne valide rien et n'envoie rien.

export type ProofExtract = {
  readable: boolean;
  document_kind: "energie_eau" | "internet_telephone" | "releve_bancaire" | "bail" | "autre";
  accepted_type: boolean;
  looks_altered: boolean;
  suspicious_content: boolean;
  name_on_document: string | null;
  name_matches: boolean | null;
  address_on_document: string | null;
  address_matches: boolean | null;
  document_date: string | null;
  lease_end_date: string | null;
  note: string;
};

export type CheckStatus = "ok" | "ko" | "unknown";
export type ProofCheck = { status: CheckStatus; value: string | null };
export type ProofReview = {
  verdict: "valid" | "invalid" | "check";
  checks: { name: ProofCheck; address: ProofCheck; document: ProofCheck; recent: ProofCheck };
  note: string;
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const KIND_LABEL: Record<ProofExtract["document_kind"], string> = {
  energie_eau: "Facture d'énergie ou d'eau",
  internet_telephone: "Facture d'internet ou de téléphone",
  releve_bancaire: "Relevé bancaire",
  bail: "Bail",
  autre: "Autre document",
};

function isRealDate(iso: string): boolean {
  if (!ISO.test(iso)) return false;
  const d = new Date(`${iso}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const last = new Date(Date.UTC(y, m - 1 + months + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m - 1 + months, Math.min(d, last), 12)).toISOString().slice(0, 10);
}

const frenchDate = (iso: string) => iso.split("-").reverse().join("/");

function recentCheck(x: ProofExtract, today: string): ProofCheck {
  if (x.document_kind === "bail") {
    if (!x.lease_end_date || !isRealDate(x.lease_end_date)) return { status: "unknown", value: "Date de fin du bail introuvable" };
    return { status: x.lease_end_date >= today ? "ok" : "ko", value: `Bail jusqu'au ${frenchDate(x.lease_end_date)}` };
  }
  if (!x.document_date || !isRealDate(x.document_date)) return { status: "unknown", value: "Date du document introuvable" };
  const label = `Daté du ${frenchDate(x.document_date)}`;
  if (x.document_date > today) return { status: "ko", value: `${label}, dans le futur` };
  return { status: addMonths(x.document_date, 3) >= today ? "ok" : "ko", value: label };
}

export function proofVerdict(x: ProofExtract, today: string, expectedAddressKnown: boolean): ProofReview {
  const three = (v: boolean | null): CheckStatus => (v === null ? "unknown" : v ? "ok" : "ko");
  if (!x.readable) {
    const unknown: ProofCheck = { status: "unknown", value: null };
    return { verdict: "check", checks: { name: unknown, address: unknown, document: { status: "unknown", value: "Document illisible" }, recent: unknown }, note: x.note };
  }
  const docOk = x.accepted_type && !x.looks_altered && !x.suspicious_content;
  const docValue = x.suspicious_content ? "Contient un texte suspect" : x.looks_altered ? "Semble modifié" : x.accepted_type ? KIND_LABEL[x.document_kind] : `${KIND_LABEL[x.document_kind]}, type non accepté`;
  const checks = {
    name: { status: three(x.name_matches), value: x.name_on_document },
    address: { status: expectedAddressKnown ? three(x.address_matches) : ("unknown" as CheckStatus), value: x.address_on_document ?? (expectedAddressKnown ? null : "Adresse du contrat inconnue") },
    document: { status: (docOk ? "ok" : "ko") as CheckStatus, value: docValue },
    recent: recentCheck(x, today),
  };
  const all = Object.values(checks).map((c) => c.status);
  const verdict = all.includes("ko") ? "invalid" : all.includes("unknown") ? "check" : "valid";
  return { verdict, checks, note: x.note };
}

// La réponse de l'IA n'est pas digne de confiance : tout est contrôlé.
export function parseExtract(o: unknown): ProofExtract {
  const r = (o ?? {}) as Record<string, unknown>;
  const bool = (k: string) => {
    if (typeof r[k] !== "boolean") throw new Error(`Réponse de l'IA invalide : ${k}`);
    return r[k] as boolean;
  };
  const boolOrNull = (k: string) => (r[k] === null || r[k] === undefined ? null : bool(k));
  const text = (k: string, max = 300) => (typeof r[k] === "string" && (r[k] as string).trim() ? (r[k] as string).trim().slice(0, max) : null);
  const kinds = ["energie_eau", "internet_telephone", "releve_bancaire", "bail", "autre"];
  if (!kinds.includes(String(r.document_kind))) throw new Error("Réponse de l'IA invalide : document_kind");
  return {
    readable: bool("readable"),
    document_kind: r.document_kind as ProofExtract["document_kind"],
    accepted_type: bool("accepted_type"),
    looks_altered: bool("looks_altered"),
    suspicious_content: bool("suspicious_content"),
    name_on_document: text("name_on_document"),
    name_matches: boolOrNull("name_matches"),
    address_on_document: text("address_on_document"),
    address_matches: boolOrNull("address_matches"),
    document_date: text("document_date", 10),
    lease_end_date: text("lease_end_date", 10),
    note: (text("note", 400) ?? "").replace(/—/g, ","),
  };
}
