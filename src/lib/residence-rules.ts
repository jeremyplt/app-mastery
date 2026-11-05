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
