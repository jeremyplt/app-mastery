export interface Guide {
  slug: string;
  title: string;
  highlight: string;
  subtitle: string;
  bullets: string[];
  ctaText: string;
  merciTitle: string;
  merciHighlight: string;
  merciDescription: string;
  downloadLabel: string;
  downloadUrl: string; // path to file in /public/downloads/ or external URL
  isExternalLink?: boolean; // if true, opens in new tab instead of download
  brevoListId?: number;
  // Image de couverture affichée nette sur la page d'optin (sinon aperçu générique flouté).
  previewImage?: string;
  // Lead magnet en rapport direct avec les apps mobiles : ses leads sont
  // suivis dans le CRM (onglet "Lead magnets", source "guide").
  crm?: boolean;
  // Libellé court affiché dans le CRM.
  shortLabel?: string;
}

export const guides: Record<string, Guide> = {
  "27-regles": {
    slug: "27-regles",
    title: "Récupère la checklist des",
    highlight: "27 règles des apps qui rapportent",
    subtitle:
      "Ce que j'ai retenu en analysant 300 applications : onboarding, paywall et boucle de récompense. Une case à cocher par règle, à garder ouverte pendant que tu construis ton app.",
    bullets: [
      "Les 8 règles d'onboarding qui donnent envie de payer",
      "Les 6 règles du paywall pour vendre sans que l'utilisateur réfléchisse",
      "Les 13 règles de la boucle de récompense pour qu'il revienne tous les jours",
    ],
    ctaText: "Recevoir la checklist PDF",
    merciTitle: "Ta checklist est",
    merciHighlight: "en route.",
    merciDescription:
      "Télécharge la checklist et passe ton app au crible, règle par règle.",
    downloadLabel: "Télécharger la checklist",
    downloadUrl: "/downloads/27-regles-apps-rentables-k3r7p9.pdf",
    brevoListId: 23,
    previewImage: "/proof/27-regles-preview.jpg",
    crm: true,
    shortLabel: "Checklist 27 règles",
  },
  "piscine-epitech": {
    slug: "piscine-epitech",
    title: "Récupère la",
    highlight: "Piscine d'Epitech",
    subtitle:
      "5 semaines d'immersion intensive en langage C et environnement UNIX. 90 heures de travail par semaine. Apprentissage par l'échec.",
    bullets: [
      "Tous les exercices de la Piscine (1ère année)",
      "Langage C + environnement UNIX",
      "Développe ton autonomie et ta résilience",
    ],
    ctaText: "Recevoir le fichier .zip",
    merciTitle: "Ton fichier est",
    merciHighlight: "prêt.",
    merciDescription:
      "Télécharge la Piscine d'Epitech et commence à coder.",
    downloadLabel: "Télécharger le .zip",
    downloadUrl: "/downloads/piscine-epitech-q3w8f5.zip",
    brevoListId: 23,
  },
  "prompt-50-saas": {
    slug: "prompt-50-saas",
    title: "Récupère les prompts +",
    highlight: "50 Idées SaaS Clé en Main",
    subtitle:
      "Les prompts que j'utilise pour identifier des concepts de SaaS et 50 idées prêtes à mettre en oeuvre.",
    bullets: [
      "1 prompt pour identifier des concepts de SaaS selon tes intérêts",
      "1 prompt pour analyser le marché sur 2-3 concepts sélectionnés",
      "50 idées de SaaS avec potentiel vérifiable",
    ],
    ctaText: "Recevoir le PDF",
    merciTitle: "Ton PDF est",
    merciHighlight: "prêt.",
    merciDescription:
      "Télécharge les prompts et les 50 idées de SaaS.",
    downloadLabel: "Télécharger le PDF",
    downloadUrl: "/downloads/prompt-50-saas-h6j9t2.pdf",
    brevoListId: 23,
  },
  "workflow-make": {
    slug: "workflow-make",
    title: "Récupère le workflow",
    highlight: "Création de contenu",
    subtitle:
      "Le workflow que j'ai créé pour générer du contenu vidéo au format vertical automatiquement.",
    bullets: [
      "Génère un script à partir d'une idée",
      "Crée des images et ajoute une voix off automatiquement",
      "Fait le montage et ajoute des sous-titres",
    ],
    ctaText: "Recevoir le Workflow",
    merciTitle: "Ton workflow est",
    merciHighlight: "prêt.",
    merciDescription:
      "Accède au workflow Make et commence à générer du contenu.",
    downloadLabel: "Accéder au Workflow",
    downloadUrl: "https://eu1.make.com/public/shared-scenario/adL8j2sR80t/japanese-learning-shorts-generator",
    isExternalLink: true,
    brevoListId: 23,
  },
  monetisation: {
    slug: "monetisation",
    title: "Le guide de",
    highlight: "Monétisation par Type d'App",
    subtitle:
      "Découvre quelle stratégie de monétisation choisir en fonction du type d'app que tu veux créer.",
    bullets: [
      "Les modèles de monétisation les plus rentables",
      "Quel modèle choisir selon ton type d'app",
      "Les erreurs à éviter pour maximiser tes revenus",
    ],
    ctaText: "Recevoir le Guide",
    merciTitle: "Ton guide est",
    merciHighlight: "prêt.",
    merciDescription:
      "Télécharge le guide de monétisation et choisis le bon modèle pour ton app.",
    downloadLabel: "Télécharger le Guide",
    downloadUrl: "/downloads/monetisation-x7k2m9.pdf",
    brevoListId: 23,
    crm: true,
    shortLabel: "Guide monétisation",
  },
  metabase: {
    slug: "metabase",
    title: "Récupère le pack pour installer",
    highlight: "Metabase sur ton VPS",
    subtitle:
      "Le tutoriel pas à pas + le prompt IA pour héberger ton propre dashboard analytics Metabase sur un VPS Hostinger, sans être développeur.",
    bullets: [
      "Le tutoriel complet pour préparer ton VPS Hostinger (KVM 2)",
      "Le prompt IA qui installe et sécurise Metabase pour toi",
      "Ton dashboard analytics auto-hébergé, accessible en HTTPS",
    ],
    ctaText: "Recevoir le pack .zip",
    merciTitle: "Ton pack est",
    merciHighlight: "prêt.",
    merciDescription:
      "Télécharge le tutoriel + le prompt IA pour installer Metabase.",
    downloadLabel: "Télécharger le .zip",
    downloadUrl: "/downloads/metabase-hostinger-m9k4p2.zip",
    brevoListId: 23,
  },
  openclaw: {
    slug: "openclaw",
    title: "Le guide complet pour installer",
    highlight: "OpenClaw comme un PRO",
    subtitle:
      "Installe OpenClaw sur un VPS en quelques minutes et configure un workflow de dev digne de la Silicon Valley.",
    bullets: [
      "Toutes les commandes utilisées dans la vidéo",
      "Un prompt pour donner du contexte à OpenClaw sur tes projets",
      "Des CRON Jobs qui tournent même quand tu dors",
    ],
    ctaText: "Recevoir le Guide",
    merciTitle: "Ton guide est",
    merciHighlight: "prêt.",
    merciDescription:
      "Télécharge le guide et installe OpenClaw en quelques minutes.",
    downloadLabel: "Télécharger le Guide",
    downloadUrl: "/downloads/openclaw-guide-p4v1n8.pdf",
    brevoListId: 23,
  },
};

export function getGuide(slug: string): Guide | undefined {
  return guides[slug];
}

export function getAllGuideSlugs(): string[] {
  return Object.keys(guides);
}

// Lead magnets suivis dans le CRM (source "guide"), avec leur libellé court.
export const CRM_GUIDE_SLUGS: string[] = Object.values(guides)
  .filter((g) => g.crm)
  .map((g) => g.slug);

export const CRM_GUIDE_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(guides)
    .filter((g) => g.crm)
    .map((g) => [g.slug, g.shortLabel ?? g.highlight]),
);
