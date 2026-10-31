import { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente - App Mastery",
  robots: "noindex, nofollow",
};

export default function CGVPage() {
  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: "radial-gradient(50% 30% at 50% -4%, var(--accent-glow), transparent 60%)" }}
      />
      <div className="mx-auto max-w-3xl px-6">
        <nav className="mac-nav mt-5">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight text-[var(--fg)]">
            <span
              className="grid place-items-center w-7 h-7 rounded-lg text-[12px] font-extrabold tracking-tight text-[var(--accent)] border-[0.5px] border-white/10"
              style={{ background: "linear-gradient(150deg, #2b2b2e, #000)" }}
            >
              AM
            </span>
            App Mastery
          </Link>
          <ThemeToggle />
        </nav>
        <div className="py-14 sm:py-16">
        <h1 className="text-[32px] font-bold tracking-[-0.03em] mb-2">
          Conditions Générales de Vente
        </h1>
        <p className="text-[var(--fg3)] mb-12">
          Dernière mise à jour : 30 octobre 2026
        </p>

        {/* ── Article 1 : Objet ── */}
        <Section title="Article 1 - Objet et champ d'application">
          <p>
            Les présentes Conditions Générales de Vente (ci-après « CGV »)
            régissent la vente de la prestation de conseil et d&apos;audit
            « App Mastery » (Incubateur App Mastery, ci-après « la
            Prestation ») par SDG STUDIO SARL-S, société à responsabilité
            limitée simplifiée de droit luxembourgeois, RCS Luxembourg B310735,
            siège social 44 Rue de l&apos;Industrie, L-8069 Strassen,
            Luxembourg, représentée par Jeremy Pitault, gérant (ci-après « le
            Prestataire »).
          </p>
          <p>
            Chaque vente fait l&apos;objet d&apos;un contrat signé entre le
            Prestataire et l&apos;acheteur (ci-après « le Client »). En cas de
            contradiction entre les présentes CGV et ce contrat, le contrat
            prévaut.
          </p>
        </Section>

        {/* ── Article 2 : Nature de la Prestation ── */}
        <Section title="Article 2 - Nature de la Prestation">
          <p>
            La Prestation est une mission de conseil et d&apos;audit
            personnalisés portant sur le projet d&apos;application mobile du
            Client.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Si le Client a déjà une application</strong> : le
              Prestataire en réalise l&apos;audit (fiche store, parcours
              d&apos;inscription, paywall, monétisation, acquisition) et lui
              remet des recommandations et un plan d&apos;action pour
              l&apos;améliorer et la développer.
            </li>
            <li>
              <strong>Si le Client n&apos;a pas encore d&apos;application</strong>{" "}
              : le Prestataire le conseille sur la création de son projet (étude
              de marché, choix et validation de l&apos;idée, analyse de la
              concurrence, positionnement, direction à prendre, modèle de
              monétisation, stratégie de lancement), lui remet un plan
              d&apos;action, puis audite l&apos;application au fil de sa
              construction et de sa publication.
            </li>
          </ul>
          <p>
            Les ressources en ligne mises à la disposition du Client (vidéos,
            modèles, documents de référence et communauté) sont un support
            accessoire de cette prestation de conseil. Elles n&apos;en
            constituent pas l&apos;objet principal.
          </p>
          <p>
            Le Client reste seul maître d&apos;œuvre et seul responsable de son
            projet, de son application et de ses décisions.
          </p>
        </Section>

        {/* ── Article 3 : Contenu ── */}
        <Section title="Article 3 - Contenu de la Prestation">
          <p>La Prestation comprend, pendant sa durée :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Un audit personnalisé de l&apos;application du Client ou, s&apos;il
              n&apos;a pas encore d&apos;application, une étude de son marché et
              de son projet ;
            </li>
            <li>
              Un plan d&apos;action personnalisé, mis à jour au fil de
              l&apos;avancement du projet ;
            </li>
            <li>
              Des sessions de conseil individuelles (appel visio ou audio, vidéo,
              message vocal ou réponse écrite), dont au minimum un appel de
              démarrage et un appel de clôture ;
            </li>
            <li>
              Un suivi de conseil individuel par messagerie (WhatsApp ou canal
              équivalent), six jours sur sept ;
            </li>
            <li>
              Des recommandations personnalisées sur la création, le
              développement, la publication, la monétisation et la promotion de
              l&apos;application du Client ;
            </li>
            <li>
              À titre accessoire, un accès aux ressources en ligne du
              Prestataire et à la communauté privée.
            </li>
          </ul>
          <p>
            Ne sont pas compris : le développement de l&apos;application à la
            place du Client, la création de ses contenus, la gestion de ses
            campagnes publicitaires, son budget publicitaire et ses frais
            d&apos;outils, ainsi que tout conseil juridique, comptable ou
            fiscal.
          </p>
        </Section>

        {/* ── Article 4 : Durée ── */}
        <Section title="Article 4 - Durée">
          <p>
            La Prestation dure trois (3) mois consécutifs à compter de la date
            de début indiquée dans le contrat. Cette durée ne peut être ni
            suspendue, ni reportée, ni prolongée pour un motif propre au Client.
          </p>
          <p>
            L&apos;accès aux ressources en ligne est consenti sans limitation de
            durée, tant que le Prestataire exploite la plateforme qui les
            héberge.
          </p>
        </Section>

        {/* ── Article 5 : Prix et paiement ── */}
        <Section title="Article 5 - Prix et paiement">
          <p>
            Le prix de la Prestation est de <strong>3 000 €</strong> toutes
            taxes comprises. La TVA éventuellement due, selon le statut
            (particulier ou entreprise) et le pays du Client, est incluse dans
            ce montant et appliquée conformément à la réglementation
            luxembourgeoise.
          </p>
          <p>
            Le prix est payable par virement bancaire, au choix du Client : en
            une fois à la signature, en deux échéances (1 000 € puis 2 000 €) ou
            en trois échéances de 1 000 €, selon l&apos;échéancier prévu au
            contrat. Le paiement en plusieurs fois n&apos;entraîne aucun
            surcoût.
          </p>
          <p>
            Le prix est ferme et non remboursable, sous les seules réserves du
            droit de rétractation (article 6) et de la garantie commerciale
            (article 7). L&apos;abandon de la Prestation par le Client ne donne
            droit à aucun remboursement.
          </p>
        </Section>

        {/* ── Article 6 : Droit de rétractation ── */}
        <Section title="Article 6 - Droit de rétractation">
          <p>
            Le Client consommateur qui conclut le contrat à distance dispose en
            principe d&apos;un délai de rétractation de quatorze (14) jours à
            compter de sa signature.
          </p>
          <p>
            En signant le contrat, le Client demande que la Prestation commence
            immédiatement. Il reconnaît que son droit de rétractation prend fin
            pour les contenus numériques auxquels il a accédé, et que, s&apos;il
            se rétracte, il devra payer le prix des services déjà fournis
            jusqu&apos;à sa rétractation.
          </p>
          <p>
            Le Client qui contracte pour les besoins de son activité
            professionnelle ne bénéficie pas du droit de rétractation.
          </p>
        </Section>

        {/* ── Article 7 : Garantie commerciale ── */}
        <Section title="Article 7 - Garantie commerciale « 10 000 € de chiffre d'affaires en 6 mois »">
          <p>
            Si l&apos;application du Client n&apos;a pas réalisé au moins
            10 000 € de chiffre d&apos;affaires brut dans les six (6) mois
            suivant le début de la Prestation, et sous réserve du respect de
            toutes les conditions prévues au contrat, le Prestataire prolonge
            gratuitement la Prestation de trois (3) mois. Si l&apos;objectif
            n&apos;est toujours pas atteint à l&apos;issue de cette
            prolongation, le Prestataire rembourse le montant payé par le
            Client.
          </p>
          <p>
            Les conditions, exclusions, preuves à fournir et délais de demande
            sont définis dans la Partie II du contrat, qui fait seule foi.
          </p>
        </Section>

        {/* ── Article 8 : Obligation de moyens ── */}
        <Section title="Article 8 - Obligation de moyens">
          <p>
            Le Prestataire est tenu à une obligation de moyens et non de
            résultat. Il ne garantit aucun niveau de revenus, de
            téléchargements ou de rentabilité, en dehors de la garantie
            commerciale de l&apos;article 7.
          </p>
          <p>
            Les résultats présentés dans la communication du Prestataire
            (études de cas, témoignages, revenus d&apos;applications) sont réels
            mais ne constituent pas une promesse de résultats identiques.
          </p>
        </Section>

        {/* ── Article 9 : Propriété intellectuelle ── */}
        <Section title="Article 9 - Propriété intellectuelle">
          <p>
            Les ressources, documents, méthodes et enregistrements fournis dans
            le cadre de la Prestation restent la propriété exclusive du
            Prestataire. Le Client bénéficie d&apos;un droit d&apos;utilisation
            personnel et non cessible. Tout partage, revente ou diffusion est
            interdit.
          </p>
          <p>
            L&apos;application du Client, son code, sa marque et ses contenus
            restent sa propriété exclusive.
          </p>
        </Section>

        {/* ── Article 10 : Données personnelles ── */}
        <Section title="Article 10 - Données personnelles">
          <p>
            Les données personnelles du Client (identité, coordonnées,
            échanges, enregistrements d&apos;appels) sont traitées
            conformément au RGPD, pour l&apos;exécution du contrat, la
            facturation et la relation client.
          </p>
          <p>
            Le Client peut exercer ses droits d&apos;accès, de rectification,
            d&apos;effacement, d&apos;opposition et de portabilité en écrivant à{" "}
            <strong>contact@jeremypitault.com</strong>.
          </p>
        </Section>

        {/* ── Article 11 : Responsabilité ── */}
        <Section title="Article 11 - Responsabilité">
          <p>
            La responsabilité du Prestataire est limitée au montant payé par le
            Client. Le Prestataire n&apos;est pas responsable des décisions
            prises par le Client, du refus ou du retrait de son application par
            les stores, des pertes de revenus ou préjudices indirects, ni des
            dépenses engagées par le Client (publicité, outils, matériel).
          </p>
        </Section>

        {/* ── Article 12 : Droit applicable ── */}
        <Section title="Article 12 - Droit applicable et litiges">
          <p>
            Les présentes CGV sont soumises au droit luxembourgeois. En cas de
            litige, les parties recherchent d&apos;abord une solution amiable.
            À défaut, les juridictions du Grand-Duché de Luxembourg sont
            compétentes, sous réserve des règles protectrices du consommateur
            applicables dans le pays de résidence du Client.
          </p>
        </Section>

        {/* ── Article 13 : Contact ── */}
        <Section title="Article 13 - Contact">
          <p>Pour toute question relative aux présentes CGV ou à la Prestation :</p>
          <p className="mt-2">
            <strong>Email</strong> : contact@jeremypitault.com
          </p>
        </Section>

        {/* Footer */}
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
