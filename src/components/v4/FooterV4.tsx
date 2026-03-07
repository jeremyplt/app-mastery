export default function FooterV4() {
  return (
    <footer className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} App Mastery. Tous droits réservés.
        </div>
        <div className="flex gap-6 text-xs text-gray-600">
          <a href="#" className="hover:text-gray-400 transition-colors">
            Mentions légales
          </a>
          <a href="#" className="hover:text-gray-400 transition-colors">
            CGV
          </a>
          <a href="#" className="hover:text-gray-400 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
