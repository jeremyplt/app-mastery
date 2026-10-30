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
          Dernière mise à jour : 30 octobre 2026
        </p>

        <Section title="Principe">
          <p>
            Le prix de la prestation de conseil et d&apos;audit App Mastery
            (3 000 €) est ferme et non remboursable. Il existe deux exceptions :
            le droit de rétractation et la garantie commerciale « 10 000 € de
            chiffre d&apos;affaires en 6 mois ».
          </p>
          <p>
            L&apos;abandon de la prestation, l&apos;inactivité ou la
            non-utilisation des sessions et des ressources ne donnent droit à
            aucun remboursement.
          </p>
        </Section>

        <Section title="Droit de rétractation (14 jours)">
          <p>
            Si vous êtes un particulier et que vous signez le contrat à
            distance, vous disposez en principe de{" "}
            <strong>14 jours</strong> pour vous rétracter à compter de la
            signature.
          </p>
          <p>
            Comme la prestation commence tout de suite à votre demande, vous
            payez le prix des services déjà fournis jusqu&apos;à votre
            rétractation. Le droit de rétractation prend fin pour les contenus
            numériques auxquels vous avez déjà accédé.
          </p>
          <p>
            Si vous signez pour les besoins de votre activité professionnelle,
            le droit de rétractation ne s&apos;applique pas.
          </p>
          <p>
            Pour vous rétracter, envoyez un email à{" "}
            <strong>contact@jeremypitault.com</strong>.
          </p>
        </Section>

        <Section title="Garantie « 10 000 € de chiffre d'affaires en 6 mois »">
          <p>
            Si votre application n&apos;a pas réalisé au moins{" "}
            <strong>10 000 € de chiffre d&apos;affaires brut</strong> dans les 6
            mois suivant le début de la prestation, et que vous avez respecté
            toutes les conditions prévues au contrat :
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              La prestation est prolongée gratuitement de{" "}
              <strong>3 mois</strong>.
            </li>
            <li>
              Si l&apos;objectif n&apos;est toujours pas atteint à la fin de
              cette prolongation, <strong>le montant payé vous est
              remboursé</strong>, sous 60 jours.
            </li>
          </ol>
          <p>
            La demande se fait par email à{" "}
            <strong>contact@jeremypitault.com</strong>, avec toutes les preuves
            demandées, dans les 7 jours qui suivent la fin des 6 mois.
          </p>
          <p>
            Les conditions complètes, les exclusions et la liste des preuves à
            fournir sont dans la Partie II de votre contrat, qui fait seule foi.
          </p>
        </Section>

        <Section title="Important">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Pour les détails complets, consultez nos{" "}
              <a
                href="/cgv"
                className="text-[var(--accent2)] underline"
              >
                Conditions Générales de Vente
              </a>{" "}
              (articles 5 à 7) et votre contrat.
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
