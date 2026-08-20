import { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Mentions Légales - App Mastery",
  robots: "noindex, nofollow",
};

export default function MentionsLegalesPage() {
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
          Mentions Légales
        </h1>
        <p className="text-[var(--fg3)] mb-12">
          Dernière mise à jour : 11 mars 2026
        </p>

        {/* ── Éditeur du site ── */}
        <Section title="1 - Éditeur du site">
          <p>Le site app-mastery.fr est édité par :</p>
          <ul className="list-none space-y-1 mt-2">
            <li>
              <strong>Raison sociale</strong> : Shinobi LLC
            </li>
            <li>
              <strong>Représentant légal</strong> : Jeremy Pitault
            </li>
            <li>
              <strong>Adresse</strong> : 1209 Mountain Road Pl NE, Ste H,
              Albuquerque, NM 87110, États-Unis
            </li>
            <li>
              <strong>Email</strong> : contact@jeremypitault.com
            </li>
          </ul>
        </Section>

        {/* ── Directeur de publication ── */}
        <Section title="2 - Directeur de la publication">
          <p>
            Le directeur de la publication est <strong>Jeremy Pitault</strong>.
          </p>
          <p>
            Contact : contact@jeremypitault.com
          </p>
        </Section>

        {/* ── Hébergement ── */}
        <Section title="3 - Hébergement">
          <p>Le site est hébergé par :</p>
          <ul className="list-none space-y-1 mt-2">
            <li>
              <strong>Vercel Inc.</strong>
            </li>
            <li>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
            <li>Site : vercel.com</li>
          </ul>
        </Section>

        {/* ── Propriété intellectuelle ── */}
        <Section title="4 - Propriété intellectuelle">
          <p>
            L&apos;ensemble du contenu du site app-mastery.fr (textes, images,
            vidéos, graphismes, logo, icônes, code source) est la propriété
            exclusive de Jeremy Pitault, sauf mention contraire.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication ou
            adaptation de tout ou partie du contenu du site, quel que soit le
            moyen ou le procédé utilisé, est interdite sans autorisation écrite
            préalable.
          </p>
        </Section>

        {/* ── Données personnelles ── */}
        <Section title="5 - Protection des données personnelles">
          <p>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD) et à la loi Informatique et Libertés, le site collecte des
            données personnelles uniquement dans le cadre de :
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              L&apos;inscription à la formation (nom, adresse email, données de
              paiement).
            </li>
            <li>
              L&apos;inscription à la liste d&apos;attente ou newsletter
              (adresse email).
            </li>
            <li>
              L&apos;analyse d&apos;audience du site (données anonymisées via
              PostHog).
            </li>
          </ul>
          <p>
            Les données de paiement sont traitées directement par{" "}
            <strong>Stripe</strong> (stripe.com) et ne sont jamais stockées sur
            nos serveurs.
          </p>
          <p>
            Vous disposez d&apos;un droit d&apos;accès, de rectification, de
            suppression et de portabilité de vos données. Pour exercer ces
            droits, contactez : <strong>contact@jeremypitault.com</strong>.
          </p>
          <p>
            Les données sont conservées pour la durée nécessaire à la fourniture
            du service, et au maximum 3 ans après le dernier contact.
          </p>
        </Section>

        {/* ── Cookies ── */}
        <Section title="6 - Cookies">
          <p>Le site utilise des cookies pour :</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Cookies essentiels</strong> : fonctionnement du site,
              authentification, gestion de session.
            </li>
            <li>
              <strong>Cookies analytiques</strong> : mesure d&apos;audience via
              PostHog (hébergé en Europe).
            </li>
          </ul>
          <p>
            Aucun cookie publicitaire ou de pistage tiers n&apos;est utilisé.
          </p>
        </Section>

        {/* ── Responsabilité ── */}
        <Section title="7 - Limitation de responsabilité">
          <p>
            L&apos;éditeur s&apos;efforce de fournir des informations exactes et
            à jour sur le site. Toutefois, il ne peut garantir
            l&apos;exactitude, la complétude ou l&apos;actualité des
            informations diffusées.
          </p>
          <p>
            L&apos;éditeur ne saurait être tenu responsable des dommages
            directs ou indirects résultant de l&apos;accès ou de
            l&apos;utilisation du site, y compris l&apos;inaccessibilité, les
            pertes de données, les détériorations ou les virus qui pourraient
            affecter l&apos;équipement informatique de l&apos;utilisateur.
          </p>
        </Section>

        {/* ── Liens hypertextes ── */}
        <Section title="8 - Liens hypertextes">
          <p>
            Le site peut contenir des liens vers des sites tiers.
            L&apos;éditeur n&apos;exerce aucun contrôle sur ces sites et
            décline toute responsabilité quant à leur contenu.
          </p>
        </Section>

        {/* ── Droit applicable ── */}
        <Section title="9 - Droit applicable">
          <p>
            Les présentes mentions légales sont soumises au droit français. En
            cas de litige, et après tentative de résolution amiable, les
            tribunaux français seront seuls compétents.
          </p>
        </Section>

        {/* ── Contact ── */}
        <Section title="10 - Contact">
          <p>
            Pour toute question concernant le site ou les présentes mentions
            légales :
          </p>
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
