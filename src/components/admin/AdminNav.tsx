"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export type AdminSection =
  | "crm"
  | "candidatures"
  | "calendrier"
  | "emails"
  | "content-creation"
  | "equipe";

type Item = { id: AdminSection; label: string; href: string; ownerOnly?: boolean };

const ITEMS: Item[] = [
  { id: "crm", label: "CRM", href: "/admin/crm" },
  { id: "candidatures", label: "Candidatures", href: "/admin/candidatures" },
  { id: "calendrier", label: "Calendrier", href: "/admin/calendrier" },
  { id: "emails", label: "Emails", href: "/admin/crm/emails" },
  { id: "content-creation", label: "Contenus", href: "/admin/content-creation", ownerOnly: true },
  { id: "equipe", label: "Équipe", href: "/admin/equipe", ownerOnly: true },
];

// Barre de navigation commune aux pages admin : la marque à gauche, les
// sections au centre, le thème à droite. Les actions propres à une page
// restent dans l'en-tête de cette page, pas ici.
export default function AdminNav({ current, isOwner }: { current: AdminSection; isOwner: boolean }) {
  return (
    <nav className="mac-nav mb-8" aria-label="Administration">
      <Link href="/admin/crm" className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight text-[var(--fg)]">
        <span
          className="grid place-items-center w-7 h-7 rounded-lg text-[12px] font-extrabold tracking-tight text-[var(--accent)] border-[0.5px] border-white/10"
          style={{ background: "linear-gradient(150deg, #2b2b2e, #000)" }}
        >
          AM
        </span>
        <span className="hidden sm:inline">Admin</span>
      </Link>

      <div className="mac-seg overflow-x-auto max-w-full">
        {ITEMS.filter((it) => !it.ownerOnly || isOwner).map((it) => (
          <Link
            key={it.id}
            href={it.href}
            className={`whitespace-nowrap ${it.id === current ? "on" : ""}`}
            aria-current={it.id === current ? "page" : undefined}
          >
            {it.label}
          </Link>
        ))}
      </div>

      <ThemeToggle />
    </nav>
  );
}
