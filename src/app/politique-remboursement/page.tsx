import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Remboursement - App Mastery",
  robots: "noindex, nofollow",
};

export default function PolitiqueRemboursementPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Politique de Remboursement
        </h1>
        <p className="text-white/50 mb-12">
          Dernière mise à jour : 12 mars 2026
        </p>

        <Section title="Double garantie App Mastery">
          <p>
            Chez App Mastery, nous croyons en la qualité de notre formation.
            C&apos;est pourquoi nous proposons une <strong>double garantie</strong> à
            tous nos clients.
          </p>
        </Section>

        <Section title="Garantie 1 : Satisfait ou remboursé (30 jours)">
          <p>
            Vous disposez de <strong>30 jours calendaires</strong> à compter de
            la date d&apos;achat pour demander un remboursement intégral, sans
            condition et sans justification.
          </p>
          <p>Ce délai inclut et dépasse le droit de rétractation légal de 14 jours.</p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">
            Comment demander un remboursement ?
          </h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Envoyez un email à{" "}
              <strong>contact@jeremypitault.com</strong> dans les 30 jours
              suivant votre achat.
            </li>
            <li>Aucune justification n&apos;est requise.</li>
            <li>
              Le remboursement intégral est effectué sous 14 jours ouvrés sur
              le moyen de paiement utilisé lors de l&apos;achat.
            </li>
            <li>
              Votre accès à la formation est révoqué dès le traitement du
              remboursement.
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">
            En cas de paiement en 3 mensualités
          </h3>
          <p>
            Le remboursement porte sur l&apos;intégralité des sommes déjà
            prélevées, et les prélèvements restants sont annulés.
          </p>
        </Section>

        <Section title="Garantie 2 : Premiers revenus ou coaching offert (90 jours)">
          <p>
            Si vous n&apos;avez pas généré vos premiers revenus avec votre
            application mobile dans les 90 jours suivant votre achat, nous vous
            offrons <strong>3 sessions de coaching individuel gratuites</strong>{" "}
            pour vous aider à débloquer votre monétisation.
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">
            Conditions d&apos;éligibilité
          </h3>
          <p>
            Pour bénéficier de cette garantie, vous devez avoir :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Complété 100% des 5 modules essentiels de la formation.
            </li>
            <li>
              Publié votre application sur l&apos;App Store ou Google Play.
            </li>
            <li>
              Implémenté un système de monétisation fonctionnel dans votre app.
            </li>
            <li>
              Appliqué les stratégies marketing enseignées : soit 30 contenus
              organiques + 100 interactions, soit 500€ de publicité payante.
            </li>
            <li>
              Posé au moins 5 questions au support ou dans la communauté.
            </li>
            <li>
              Publié votre app et commencé le marketing avant le 60e jour.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">
            Ce que comprend le coaching
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              3 sessions individuelles de 30 à 60 minutes (audio ou vidéo).
            </li>
            <li>Diagnostic personnalisé de vos blocages.</li>
            <li>
              Plan d&apos;action concret pour générer vos premiers revenus.
            </li>
          </ul>
        </Section>

        <Section title="Important">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Les deux garanties ne sont <strong>pas cumulables</strong>. Vous
              choisissez l&apos;une ou l&apos;autre.
            </li>
            <li>
              Pour les détails complets, consultez nos{" "}
              <a
                href="/cgv"
                className="text-sky-400 hover:text-sky-300 underline"
              >
                Conditions Générales de Vente
              </a>{" "}
              (Articles 5 et 6).
            </li>
            <li>
              Pour toute question, contactez-nous à{" "}
              <strong>contact@jeremypitault.com</strong>.
            </li>
          </ul>
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
