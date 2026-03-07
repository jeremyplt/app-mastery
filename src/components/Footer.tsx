"use client";

const footerLinks = [
  { label: "Mentions legales", href: "#" },
  { label: "CGV", href: "#" },
  { label: "Confidentialite", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="text-sm font-semibold tracking-tight text-[var(--fg)]">App Secrets</div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-sm text-[var(--muted-fg)]">
          2026 App Secrets. Tous droits reserves.
        </p>
      </div>
    </footer>
  );
}
