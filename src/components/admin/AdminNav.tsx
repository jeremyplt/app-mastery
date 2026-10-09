"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export type AdminSection =
  | "crm"
  | "ventes"
  | "eleves"
  | "commissions"
  | "candidatures"
  | "calendrier"
  | "emails"
  | "youtube"
  | "content-creation"
  | "equipe";

// ownerOnly : propriétaire seulement ; closerToo : aussi visible des closers.
type Item = { id: AdminSection; label: string; href: string; ownerOnly?: boolean; closerToo?: boolean };
type Group = { label: string; items: Item[] };

// Les pages regroupées par thème : un groupe d'une seule page est un lien
// direct, sinon un menu déroulant.
const GROUPS: Group[] = [
  {
    label: "Prospects",
    items: [
      { id: "crm", label: "CRM", href: "/admin/crm" },
      { id: "candidatures", label: "Candidatures", href: "/admin/candidatures" },
      { id: "calendrier", label: "Calendrier", href: "/admin/calendrier" },
    ],
  },
  {
    label: "Ventes",
    items: [
      { id: "ventes", label: "Ventes", href: "/admin/ventes" },
      { id: "commissions", label: "Commissions", href: "/admin/commissions", ownerOnly: true, closerToo: true },
    ],
  },
  { label: "Élèves", items: [{ id: "eleves", label: "Élèves", href: "/admin/eleves" }] },
  {
    label: "Marketing",
    items: [
      { id: "emails", label: "Emails", href: "/admin/crm/emails" },
      { id: "youtube", label: "YouTube", href: "/admin/youtube" },
      { id: "content-creation", label: "Contenus", href: "/admin/content-creation", ownerOnly: true },
    ],
  },
];

function GroupMenu({ group, current }: { group: Group; current: AdminSection }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = group.items.some((it) => it.id === current);

  // Fermeture au clic à côté ou avec Échap.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (group.items.length === 1) {
    const it = group.items[0];
    return (
      <Link href={it.href} className={`whitespace-nowrap ${active ? "on" : ""}`} aria-current={active ? "page" : undefined}>
        {it.label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative !p-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1 whitespace-nowrap rounded-[7px] px-[13px] py-[5px] transition-colors ${
          active ? "bg-[var(--group)] text-[var(--fg)] shadow-[0_0.5px_1.5px_rgba(0,0,0,0.18),0_0_0_0.5px_var(--field-brd)]" : "text-[var(--fg2)] hover:text-[var(--fg)]"
        }`}
      >
        {group.label}
        <span className={`text-[10px] transition-transform duration-150 ${open ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[180px] overflow-hidden rounded-xl border-[0.5px] border-[var(--field-brd)] bg-[var(--group)] p-1 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
        >
          {group.items.map((it) => (
            <Link
              key={it.id}
              href={it.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              aria-current={it.id === current ? "page" : undefined}
              className={`block rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-colors ${
                it.id === current ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent2)]" : "text-[var(--fg)] hover:bg-[var(--field)]"
              }`}
            >
              {it.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Barre de navigation commune aux pages admin : la marque à gauche, les
// groupes au centre, l'équipe et le thème à droite. Les actions propres à une
// page restent dans l'en-tête de cette page, pas ici.
export default function AdminNav({ current, isOwner }: { current: AdminSection; isOwner: boolean }) {
  // Les pages ne transmettent que isOwner : on récupère le rôle pour savoir
  // s'il faut montrer « Commissions » à un closer.
  const [isCloser, setIsCloser] = useState(false);
  useEffect(() => {
    if (isOwner) return;
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => setIsCloser(d.role === "closer"))
      .catch(() => {});
  }, [isOwner]);

  const visible = (it: Item) => !it.ownerOnly || isOwner || (it.closerToo && isCloser);
  const groups = GROUPS.map((g) => ({ ...g, items: g.items.filter(visible) })).filter((g) => g.items.length > 0);

  return (
    <nav className="mac-nav relative z-40 mb-8" aria-label="Administration">
      <Link href="/admin/crm" className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight text-[var(--fg)]">
        <span
          className="grid place-items-center w-7 h-7 rounded-lg text-[12px] font-extrabold tracking-tight text-[var(--accent)] border-[0.5px] border-white/10"
          style={{ background: "linear-gradient(150deg, #2b2b2e, #000)" }}
        >
          AM
        </span>
        <span className="hidden sm:inline">Admin</span>
      </Link>

      <div className="mac-seg">
        {groups.map((g) => (
          <GroupMenu key={g.label} group={g} current={current} />
        ))}
      </div>

      <div className="flex items-center gap-2">
        {isOwner && (
          <Link
            href="/admin/equipe"
            title="Équipe"
            aria-label="Équipe"
            aria-current={current === "equipe" ? "page" : undefined}
            className={`grid h-9 w-9 place-items-center rounded-[10px] border-[0.5px] border-[var(--field-brd)] text-[16px] transition-colors ${
              current === "equipe" ? "bg-[var(--group)] text-[var(--fg)]" : "bg-[var(--field)] text-[var(--fg2)] hover:text-[var(--fg)]"
            }`}
          >
            ⚙️
          </Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
