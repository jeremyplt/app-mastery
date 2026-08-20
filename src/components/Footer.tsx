export default function Footer() {
  return (
    <footer className="py-10 pb-24 lg:pb-10 px-4 sm:px-6 lg:px-8 border-t-[0.5px] border-[var(--sep)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-[13px] font-medium text-[var(--fg3)]">
          &copy; {new Date().getFullYear()} App Mastery. Tous droits réservés.
        </div>
        <div className="flex flex-wrap gap-6 text-[13px] font-medium text-[var(--fg3)]">
          <a href="/mentions-legales" className="hover:text-[var(--fg)] transition-colors">
            Mentions légales
          </a>
          <a href="/cgv" className="hover:text-[var(--fg)] transition-colors">
            CGV
          </a>
          <a href="/politique-confidentialite" className="hover:text-[var(--fg)] transition-colors">
            Confidentialité
          </a>
          <a href="/politique-remboursement" className="hover:text-[var(--fg)] transition-colors">
            Remboursement
          </a>
          <a href="/contact" className="hover:text-[var(--fg)] transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
