import { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Politique de Remboursement - App Mastery",
  robots: "noindex, nofollow",
};

export default function PolitiqueRemboursementPage() {
  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none" style={{ background: "radial-gradient(50% 30% at 50% -4%, var(--accent-glow), transparent 60%)" }} />
      <div className="mx-auto max-w-3xl px-6">
        <nav className="mac-nav mt-5">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight text-[var(--fg)]">
            <span className="grid place-items-center w-7 h-7 rounded-lg text-[12px] font-extrabold tracking-tight text-[var(--accent)] border-[0.5px] border-white/10" style={{ background: "linear-gradient(150deg, #2b2b2e, #000)" }}>AM</span>
            App Mastery
          </Link>
          <ThemeToggle />
        </nav>
        <div className="pt-14 pb-16 sm:pt-16">
        <h1 className="text-[32px] font-bold tracking-[-0.03em] mb-2">
          Politique de Remboursement
        </h1>
        <p className="text-[var(--fg3)] mb-12">
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

          <h3 className="text-[17px] font-semibold text-[var(--fg)] mt-6 mb-3">
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

          <h3 className="text-[17px] font-semibold text-[var(--fg)] mt-6 mb-3">
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

          <h3 className="text-[17px] font-semibold text-[var(--fg)] mt-6 mb-3">
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

          <h3 className="text-[17px] font-semibold text-[var(--fg)] mt-6 mb-3">
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
                className="text-[var(--accent2)] underline"
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

        <div className="mt-16 pt-8 border-t-[0.5px] border-[var(--sep)]">
          <a
            href="/"
            className="text-[var(--accent2)] hover:underline font-medium"
          >
            &larr; Retour à l'accueil
          </a>
        </div>
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
      <h2 className="text-[20px] font-bold tracking-[-0.02em] text-[var(--fg)] mb-4">{title}</h2>
      <div className="space-y-3 text-[17px]/7 text-[var(--fg2)]">{children}</div>
    </section>
  );
}
