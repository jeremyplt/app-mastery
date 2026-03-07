"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { label: "Programme", href: "#programme" },
  { label: "Temoignages", href: "#temoignages" },
  { label: "Prix", href: "#prix" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function toggleTheme() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
  }

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-200 bg-[var(--bg)]/80 backdrop-blur-md ${
        scrolled ? "border-b border-[var(--border)]" : ""
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <a href="#" className="text-lg font-bold text-[var(--fg)]">
          App Mastery
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors"
            aria-label="Changer de theme"
          >
            {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <a href="#prix" className="btn-primary !py-2 !px-4 !text-sm">
            Rejoindre
          </a>
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors"
            aria-label="Changer de theme"
          >
            {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden mx-4 mb-4 p-4 flex flex-col gap-2 bg-[var(--card)] border border-[var(--border)] rounded-xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors py-2 px-3"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#prix"
              onClick={() => setMobileOpen(false)}
              className="btn-primary !py-2.5 !text-sm text-center mt-2"
            >
              Rejoindre
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
