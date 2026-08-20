export default function FooterV3() {
  return (
    <footer className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[var(--fg3)]">
          &copy; {new Date().getFullYear()} App Mastery. Tous droits reserves.
        </div>
        <div className="flex gap-6 text-xs text-[var(--fg3)]">
          <a href="#" className="hover:text-[var(--fg2)] transition-colors">Mentions legales</a>
          <a href="#" className="hover:text-[var(--fg2)] transition-colors">CGV</a>
          <a href="#" className="hover:text-[var(--fg2)] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
