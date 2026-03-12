import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - App Mastery",
  robots: "noindex, nofollow",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Politique de Confidentialité
        </h1>
        <p className="text-white/50 mb-12">
          Dernière mise à jour : 12 mars 2026
        </p>

        <Section title="1 - Responsable du traitement">
          <p>
            Le responsable du traitement des données personnelles est Shinobi
            LLC, représentée par Jeremy Pitault.
          </p>
          <p>
            Email de contact : <strong>contact@jeremypitault.com</strong>
          </p>
        </Section>

        <Section title="2 - Données collectées">
          <p>
            Nous collectons les données suivantes dans le cadre de
            l&apos;utilisation de notre site et de la vente de la formation App
            Mastery :
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Données d&apos;identification</strong> : nom, prénom,
              adresse email.
            </li>
            <li>
              <strong>Données de paiement</strong> : les informations de
              paiement sont traitées directement par notre prestataire de
              paiement (Lemon Squeezy). Nous ne stockons aucune donnée bancaire.
            </li>
            <li>
              <strong>Données de navigation</strong> : adresse IP, type de
              navigateur, pages visitées, durée de visite (via PostHog).
            </li>
            <li>
              <strong>Données de communication</strong> : emails échangés avec
              le support, messages WhatsApp dans le cadre de
              l&apos;accompagnement VIP.
            </li>
          </ul>
        </Section>

        <Section title="3 - Finalités du traitement">
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              La gestion de votre commande et l&apos;accès à la formation.
            </li>
            <li>
              L&apos;envoi d&apos;emails transactionnels (confirmation de
              commande, accès à la formation).
            </li>
            <li>
              L&apos;envoi d&apos;emails marketing (uniquement si vous avez
              donné votre consentement via le formulaire d&apos;inscription).
            </li>
            <li>
              L&apos;amélioration de notre site et de notre offre (analytics).
            </li>
            <li>Le support client et l&apos;accompagnement.</li>
          </ul>
        </Section>

        <Section title="4 - Base légale du traitement">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Exécution du contrat</strong> : traitement nécessaire à la
              fourniture de la formation achetée.
            </li>
            <li>
              <strong>Consentement</strong> : pour l&apos;envoi
              d&apos;emails marketing et le dépôt de cookies analytics.
            </li>
            <li>
              <strong>Intérêt légitime</strong> : pour l&apos;amélioration de
              nos services et la prévention de la fraude.
            </li>
          </ul>
        </Section>

        <Section title="5 - Destinataires des données">
          <p>
            Vos données peuvent être transmises aux prestataires suivants,
            strictement dans le cadre des finalités décrites ci-dessus :
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Lemon Squeezy</strong> : traitement des paiements.
            </li>
            <li>
              <strong>Brevo</strong> : envoi d&apos;emails transactionnels et
              marketing.
            </li>
            <li>
              <strong>Skool</strong> : accès à la communauté et à la formation.
            </li>
            <li>
              <strong>PostHog</strong> : analytics de navigation.
            </li>
            <li>
              <strong>Vercel</strong> : hébergement du site.
            </li>
            <li>
              <strong>Supabase</strong> : stockage des données.
            </li>
          </ul>
          <p>
            Nous ne vendons ni ne louons vos données personnelles à des tiers.
          </p>
        </Section>

        <Section title="6 - Durée de conservation">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Données clients</strong> : conservées pendant la durée de
              la relation commerciale, puis 3 ans après le dernier achat.
            </li>
            <li>
              <strong>Données de facturation</strong> : conservées 10 ans
              conformément aux obligations légales.
            </li>
            <li>
              <strong>Données de navigation</strong> : conservées 13 mois
              maximum.
            </li>
            <li>
              <strong>Données de prospects</strong> : conservées 3 ans après le
              dernier contact.
            </li>
          </ul>
        </Section>

        <Section title="7 - Vos droits">
          <p>
            Conformément au RGPD, vous disposez des droits suivants sur vos
            données personnelles :
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Droit d&apos;accès</strong> : obtenir une copie de vos
              données.
            </li>
            <li>
              <strong>Droit de rectification</strong> : corriger des données
              inexactes.
            </li>
            <li>
              <strong>Droit de suppression</strong> : demander l&apos;effacement
              de vos données.
            </li>
            <li>
              <strong>Droit d&apos;opposition</strong> : vous opposer au
              traitement de vos données à des fins marketing.
            </li>
            <li>
              <strong>Droit à la portabilité</strong> : recevoir vos données
              dans un format structuré.
            </li>
            <li>
              <strong>Droit de retirer votre consentement</strong> : à tout
              moment, sans que cela n&apos;affecte la légalité du traitement
              antérieur.
            </li>
          </ul>
          <p>
            Pour exercer vos droits, envoyez un email à{" "}
            <strong>contact@jeremypitault.com</strong>. Nous répondrons dans un
            délai de 30 jours.
          </p>
          <p>
            En cas de réclamation, vous pouvez contacter la CNIL
            (www.cnil.fr).
          </p>
        </Section>

        <Section title="8 - Cookies">
          <p>Notre site utilise les cookies suivants :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Cookies essentiels</strong> : nécessaires au
              fonctionnement du site (session de connexion).
            </li>
            <li>
              <strong>Cookies analytics</strong> : PostHog, pour mesurer
              l&apos;audience et améliorer le site. Ces cookies sont déposés
              uniquement avec votre consentement.
            </li>
          </ul>
          <p>
            Vous pouvez désactiver les cookies dans les paramètres de votre
            navigateur à tout moment.
          </p>
        </Section>

        <Section title="9 - Sécurité">
          <p>
            Nous mettons en place des mesures techniques et organisationnelles
            appropriées pour protéger vos données personnelles contre tout accès
            non autorisé, perte ou altération. Les paiements sont sécurisés par
            notre prestataire Lemon Squeezy (certification PCI DSS).
          </p>
        </Section>

        <Section title="10 - Modifications">
          <p>
            Nous nous réservons le droit de modifier cette politique de
            confidentialité à tout moment. La date de dernière mise à jour sera
            modifiée en conséquence. Nous vous informerons de tout changement
            significatif par email.
          </p>
        </Section>

        <div className="mt-16 pt-8 border-t border-white/10">
          <a
            href="/formation"
            className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
          >
            &larr; Retour à la page de la Formation
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="space-y-3 text-lg/7 text-gray-300">{children}</div>
    </section>
  );
}
