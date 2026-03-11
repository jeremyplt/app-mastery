import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente - App Mastery",
  robots: "noindex, nofollow",
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Conditions Générales de Vente
        </h1>
        <p className="text-white/50 mb-12">
          Dernière mise à jour : 11 mars 2026
        </p>

        {/* ── Article 1 : Objet ── */}
        <Section title="Article 1 - Objet">
          <p>
            Les présentes Conditions Générales de Vente (ci-après « CGV »)
            régissent la vente de la formation en ligne « App Mastery » (ci-après
            « la Formation ») proposée par Shinobi LLC, représentée par Jeremy
            Pitault, ci-après « le Formateur ».
          </p>
          <p>
            La Formation est un programme de formation numérique accessible en
            ligne, dont l&apos;objectif est d&apos;enseigner la création, la
            publication et la monétisation d&apos;applications mobiles.
          </p>
          <p>
            Toute commande implique l&apos;acceptation sans réserve des
            présentes CGV par l&apos;acheteur (ci-après « le Client »).
          </p>
        </Section>

        {/* ── Article 2 : Contenu de la Formation ── */}
        <Section title="Article 2 - Contenu de la Formation">
          <p>La Formation comprend, selon l&apos;offre choisie :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Offre Essentiel (497€)</strong> : 5 modules principaux
              (55+ leçons vidéo), support par email, double garantie.
            </li>
            <li>
              <strong>Offre Complet (997€ ou 3x 347€)</strong> : tout de
              l&apos;offre Essentiel + Masterclass Marketing, Masterclass Claude
              Code, Masterclass Git/GitHub, lives Q&A 2x/mois, communauté
              privée à vie, Case Study, mises à jour à vie.
            </li>
            <li>
              <strong>Offre VIP (2 997€ ou 3x 1 097€)</strong> : tout de
              l&apos;offre Complet + accompagnement individuel 1-on-1 pendant 3
              mois via WhatsApp, aide à la validation d&apos;idée, stratégie
              marketing, audit complet de l&apos;app.
            </li>
          </ul>
          <p>
            Le contenu exact des modules, leçons et bonus est décrit sur la page
            de présentation de la Formation. Le Formateur se réserve le droit de
            mettre à jour le contenu pour l&apos;améliorer, sans en réduire la
            valeur globale.
          </p>
        </Section>

        {/* ── Article 3 : Prix et paiement ── */}
        <Section title="Article 3 - Prix et paiement">
          <p>
            Les prix sont indiqués en euros (€), toutes taxes comprises (TVA non
            applicable, article 293 B du CGI).
          </p>
          <p>Le paiement s&apos;effectue par carte bancaire via Stripe.</p>
          <p>
            Pour les offres en 3 mensualités, le Client autorise le prélèvement
            automatique de 3 paiements mensuels consécutifs. L&apos;abonnement
            s&apos;arrête automatiquement après le 3e paiement. Aucun paiement
            supplémentaire ne sera prélevé.
          </p>
          <p>
            L&apos;accès à la Formation est délivré immédiatement après
            confirmation du premier paiement.
          </p>
        </Section>

        {/* ── Article 4 : Accès à la Formation ── */}
        <Section title="Article 4 - Accès à la Formation">
          <p>
            L&apos;accès à la Formation est personnel et non transférable. Le
            Client s&apos;engage à ne pas partager, revendre, diffuser ou
            reproduire tout ou partie du contenu de la Formation.
          </p>
          <p>
            Tout partage non autorisé entraînera la suspension immédiate de
            l&apos;accès sans remboursement, et pourra donner lieu à des
            poursuites.
          </p>
          <p>
            L&apos;accès au contenu est garanti à vie, sous réserve de
            l&apos;existence de la plateforme d&apos;hébergement.
          </p>
        </Section>

        {/* ── Article 5 : Droit de rétractation - Garantie 30 jours ── */}
        <Section title="Article 5 - Droit de rétractation et Garantie « Satisfait ou Remboursé » (30 jours)">
          <p>
            Conformément aux articles L221-18 et suivants du Code de la
            consommation, le Client dispose d&apos;un délai de 14 jours à
            compter de la date d&apos;achat pour exercer son droit de
            rétractation.
          </p>
          <p>
            Au-delà de ce délai légal, le Formateur étend volontairement cette
            garantie à <strong>30 jours calendaires</strong> à compter de la
            date d&apos;achat (la « Garantie 30 jours »).
          </p>
          <p>Pour exercer cette garantie :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Le Client envoie un email à{" "}
              <strong>contact@jeremypitault.com</strong> dans les 30 jours suivant
              l&apos;achat.
            </li>
            <li>Aucune justification n&apos;est requise.</li>
            <li>
              Le remboursement intégral est effectué sous 14 jours ouvrés sur le
              moyen de paiement utilisé lors de l&apos;achat.
            </li>
            <li>
              L&apos;accès à la Formation est révoqué dès le traitement du
              remboursement.
            </li>
          </ul>
          <p>
            En cas de paiement en 3 mensualités, le remboursement porte sur
            l&apos;intégralité des sommes déjà prélevées, et les prélèvements
            restants sont annulés.
          </p>
        </Section>

        {/* ── Article 6 : Garantie 90 jours ── */}
        <Section title='Article 6 - Garantie « Premiers Revenus ou je te Coache » (90 jours)'>
          <p>
            Le Formateur propose une garantie de résultat de 90 jours
            calendaires à compter de la date d&apos;achat (la « Garantie 90
            jours »). Si le Client n&apos;a pas généré ses premiers revenus avec
            son application mobile dans ce délai, le Formateur s&apos;engage à
            fournir 3 sessions de coaching individuel gratuites pour aider le
            Client à débloquer sa monétisation.
          </p>

          <h4 className="text-lg font-semibold text-white mt-6 mb-3">
            6.1 - Conditions d&apos;éligibilité
          </h4>
          <p>
            Pour bénéficier de la Garantie 90 jours, le Client doit
            impérativement remplir <strong>toutes</strong> les conditions
            suivantes, prouvant qu&apos;il a appliqué la méthode enseignée de
            bonne foi :
          </p>

          <ol className="list-decimal pl-6 space-y-3 mt-3">
            <li>
              <strong>
                Avoir complété 100% des 5 modules essentiels de la Formation
              </strong>{" "}
              (modules 1 à 5), y compris le visionnage de toutes les leçons
              vidéo. La progression est vérifiable sur la plateforme de
              formation.
            </li>
            <li>
              <strong>
                Avoir une application publiée et accessible au public
              </strong>{" "}
              sur au moins un store (Apple App Store ou Google Play Store). Le
              Client doit fournir le lien public vers son app.
            </li>
            <li>
              <strong>
                Avoir implémenté un système de monétisation fonctionnel
              </strong>{" "}
              dans son application (abonnements, achats intégrés, ou autre
              modèle de revenus enseigné dans la Formation). L&apos;app doit
              permettre techniquement à un utilisateur de payer.
            </li>
            <li>
              <strong>
                Avoir appliqué les stratégies marketing enseignées dans le
                Module 5
              </strong>

              . Le Client doit démontrer avoir rempli{" "}
              <strong>au moins une</strong> des deux options suivantes :
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>
                  <strong>Option A - Marketing organique :</strong> avoir
                  publié au moins <strong>30 contenus organiques</strong>{" "}
                  (vidéos, posts, reels) sur au moins une plateforme (TikTok,
                  Instagram, YouTube) en lien avec son application,{" "}
                  <strong>ET</strong> avoir réalisé au moins{" "}
                  <strong>100 interactions</strong> (commentaires sous des
                  posts pertinents dans sa niche) pour se rendre visible
                  auprès de sa cible.
                </li>
                <li>
                  <strong>Option B - Marketing payant :</strong> avoir dépensé
                  au moins <strong>500€ en publicité</strong> (Meta Ads,
                  TikTok Ads, Apple Search Ads ou autre régie publicitaire)
                  pour promouvoir son application, avec captures d&apos;écran
                  du tableau de bord publicitaire comme preuve.
                </li>
              </ul>
              <p className="mt-2">
                Dans les deux cas, le Client doit également avoir optimisé sa
                fiche store (ASO) conformément aux enseignements du Module 4 :
                titre, sous-titre, mots-clés, captures d&apos;écran et
                description.
              </p>
            </li>
            <li>
              <strong>
                Avoir posé au moins 5 questions au support ou dans la communauté
              </strong>{" "}
              pendant la période de 90 jours, démontrant un engagement actif
              dans le suivi de la Formation. Le Client doit montrer
              qu&apos;il a cherché de l&apos;aide quand il était bloqué,
              plutôt que d&apos;abandonner en silence.
            </li>
            <li>
              <strong>
                Ne pas avoir attendu les derniers jours pour tout faire
              </strong>
              . La publication de l&apos;app et le début des efforts marketing
              doivent avoir eu lieu au plus tard au <strong>60e jour</strong>{" "}
              suivant l&apos;achat, laissant au minimum 30 jours d&apos;efforts
              marketing actifs avant la fin de la période de garantie.
            </li>
          </ol>

          <h4 className="text-lg font-semibold text-white mt-6 mb-3">
            6.2 - Preuves à fournir
          </h4>
          <p>
            Pour activer la Garantie 90 jours, le Client doit envoyer un email à{" "}
            <strong>contact@jeremypitault.com</strong> avant l&apos;expiration du
            délai de 90 jours, contenant :
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              Le lien public de son application sur l&apos;App Store et/ou
              Google Play.
            </li>
            <li>
              Des captures d&apos;écran prouvant que la monétisation est en
              place (page d&apos;abonnement, achats intégrés configurés, etc.).
            </li>
            <li>
              <strong>Si Option A (organique) :</strong> captures d&apos;écran
              de ses 30 contenus publiés + captures d&apos;écran d&apos;au
              moins 100 commentaires/interactions réalisés sous des posts
              pertinents.
            </li>
            <li>
              <strong>Si Option B (payant) :</strong> captures d&apos;écran du
              tableau de bord publicitaire montrant au moins 500€ de dépenses.
            </li>
            <li>
              Une capture d&apos;écran de sa fiche store optimisée (titre,
              sous-titre, captures, description).
            </li>
            <li>
              Des preuves d&apos;interaction avec le support ou la communauté
              (au moins 5 échanges).
            </li>
            <li>
              Les dates de publication de l&apos;app et de début des efforts
              marketing, démontrant le respect du délai de 60 jours.
            </li>
          </ul>

          <h4 className="text-lg font-semibold text-white mt-6 mb-3">
            6.3 - Ce que comprend le coaching garanti
          </h4>
          <p>
            Si toutes les conditions sont remplies et que le Client n&apos;a pas
            encore généré de revenus, le Formateur s&apos;engage à fournir :
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              3 sessions de coaching individuel (audio ou vidéo) d&apos;une
              durée de 30 à 60 minutes chacune.
            </li>
            <li>
              Un diagnostic personnalisé des blocages (technique, marketing,
              positionnement).
            </li>
            <li>
              Un plan d&apos;action concret pour générer les premiers revenus.
            </li>
          </ul>
          <p>
            Les sessions sont à planifier dans les 30 jours suivant
            l&apos;activation de la garantie. Au-delà de ce délai, la garantie
            est considérée comme remplie.
          </p>

          <h4 className="text-lg font-semibold text-white mt-6 mb-3">
            6.4 - Exclusions
          </h4>
          <p>La Garantie 90 jours ne s&apos;applique pas si :</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              Le Client n&apos;a pas complété l&apos;intégralité des 5 modules
              essentiels.
            </li>
            <li>
              L&apos;application n&apos;a pas été publiée sur un store public.
            </li>
            <li>
              Aucun système de monétisation n&apos;est implémenté dans
              l&apos;app.
            </li>
            <li>
              Les efforts marketing minimaux n&apos;ont pas été réalisés
              (ni 30 contenus + 100 interactions, ni 500€ de publicité).
            </li>
            <li>
              L&apos;app a été publiée après le 60e jour suivant l&apos;achat.
            </li>
            <li>
              Le Client n&apos;a jamais sollicité le support ou la communauté
              pendant la période.
            </li>
            <li>
              Le Client a déjà exercé la Garantie 30 jours (les deux garanties
              ne sont pas cumulables : le Client choisit l&apos;une ou
              l&apos;autre).
            </li>
            <li>
              L&apos;application publiée n&apos;a aucun rapport avec le contenu
              enseigné dans la Formation.
            </li>
            <li>
              Le Client a partagé ou revendu son accès à la Formation (violation
              de l&apos;Article 4).
            </li>
          </ul>
        </Section>

        {/* ── Article 7 : Obligation de moyens ── */}
        <Section title="Article 7 - Obligation de moyens">
          <p>
            La Formation constitue une obligation de moyens et non de résultat.
            Le Formateur s&apos;engage à fournir un contenu pédagogique de
            qualité et un accompagnement selon l&apos;offre choisie. Les
            résultats dépendent de l&apos;implication, du travail et de la
            situation individuelle de chaque Client.
          </p>
          <p>
            Les exemples de revenus ou de résultats mentionnés sur la page de
            présentation sont des exemples réels mais ne constituent en aucun cas
            une promesse de résultats identiques.
          </p>
        </Section>

        {/* ── Article 8 : Propriété intellectuelle ── */}
        <Section title="Article 8 - Propriété intellectuelle">
          <p>
            L&apos;ensemble du contenu de la Formation (vidéos, textes,
            supports, code source fourni, ressources) est protégé par le droit
            d&apos;auteur et reste la propriété exclusive du Formateur.
          </p>
          <p>
            Le Client bénéficie d&apos;un droit d&apos;utilisation personnel et
            non cessible. Toute reproduction, diffusion ou exploitation
            commerciale du contenu de la Formation est strictement interdite.
          </p>
        </Section>

        {/* ── Article 9 : Données personnelles ── */}
        <Section title="Article 9 - Données personnelles">
          <p>
            Les données personnelles collectées lors de l&apos;achat (nom,
            email, données de paiement) sont traitées conformément au RGPD.
            Elles sont utilisées uniquement pour la gestion de la commande,
            l&apos;accès à la Formation et la communication liée au service.
          </p>
          <p>
            Le Client peut exercer ses droits d&apos;accès, de rectification et
            de suppression en envoyant un email à{" "}
            <strong>contact@jeremypitault.com</strong>.
          </p>
        </Section>

        {/* ── Article 10 : Responsabilité ── */}
        <Section title="Article 10 - Responsabilité">
          <p>
            Le Formateur ne saurait être tenu responsable de tout dommage
            indirect résultant de l&apos;utilisation de la Formation, notamment
            les pertes de revenus, de données ou d&apos;opportunités
            commerciales.
          </p>
          <p>
            Le Formateur ne garantit pas la disponibilité ininterrompue de la
            plateforme et ne saurait être tenu responsable des interruptions
            temporaires liées à la maintenance ou à des problèmes techniques
            indépendants de sa volonté.
          </p>
        </Section>

        {/* ── Article 11 : Droit applicable ── */}
        <Section title="Article 11 - Droit applicable et litiges">
          <p>
            Les présentes CGV sont soumises au droit français. En cas de litige,
            les parties s&apos;engagent à rechercher une solution amiable avant
            toute action judiciaire. À défaut, les tribunaux compétents seront
            ceux du ressort du domicile du Formateur.
          </p>
          <p>
            Conformément à l&apos;article L612-1 du Code de la consommation, le
            Client peut recourir gratuitement à un médiateur de la consommation
            en cas de litige non résolu.
          </p>
        </Section>

        {/* ── Article 12 : Contact ── */}
        <Section title="Article 12 - Contact">
          <p>
            Pour toute question relative aux présentes CGV ou à la Formation :
          </p>
          <p className="mt-2">
            <strong>Email</strong> : contact@jeremypitault.com
          </p>
        </Section>

        {/* Footer */}
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
