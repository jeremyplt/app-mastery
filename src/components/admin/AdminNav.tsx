"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GraduationCap, Megaphone, Users, Wallet, type LucideIcon } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export type AdminSection =
  | "crm"
  | "ventes"
  | "factures"
  | "eleves"
  | "whatsapp"
  | "questions"
  | "videos-skool"
  | "commissions"
  | "chiffre-affaires"
  | "candidatures"
  | "calendrier"
  | "ressentis"
  | "emails"
  | "youtube"
  | "content-creation"
  | "scripts"
  | "equipe";

// ownerOnly : propriétaire seulement ; closerToo : aussi visible des closers.
type Item = { id: AdminSection; label: string; href: string; ownerOnly?: boolean; closerToo?: boolean };
type Group = { label: string; icon: LucideIcon; items: Item[] };

// Les pages regroupées par thème : un groupe d'une seule page est un lien
// direct, sinon un menu déroulant.
const GROUPS: Group[] = [
  {
    label: "Prospects",
    icon: Users,
    items: [
      { id: "crm", label: "CRM", href: "/admin/crm" },
      { id: "candidatures", label: "Candidatures", href: "/admin/candidatures" },
      { id: "calendrier", label: "Calendrier", href: "/admin/calendrier" },
      { id: "ressentis", label: "Ressentis d'appels", href: "/admin/ressentis", ownerOnly: true },
    ],
  },
  {
    label: "Ventes",
    icon: Wallet,
    items: [
      { id: "ventes", label: "Ventes", href: "/admin/ventes" },
      { id: "factures", label: "Factures", href: "/admin/factures", ownerOnly: true },
      { id: "commissions", label: "Commissions", href: "/admin/commissions", ownerOnly: true, closerToo: true },
      { id: "chiffre-affaires", label: "Chiffre d'affaires", href: "/admin/chiffre-affaires", ownerOnly: true },
    ],
  },
  {
    label: "Élèves",
    icon: GraduationCap,
    items: [
      { id: "eleves", label: "Élèves", href: "/admin/eleves", ownerOnly: true },
      { id: "whatsapp", label: "WhatsApp", href: "/admin/whatsapp", ownerOnly: true },
      { id: "questions", label: "Questions des élèves", href: "/admin/questions", ownerOnly: true },
      { id: "videos-skool", label: "Vidéos Skool à tourner", href: "/admin/videos-skool", ownerOnly: true },
    ],
  },
  {
    label: "Marketing",
    icon: Megaphone,
    items: [
      { id: "emails", label: "Emails", href: "/admin/crm/emails" },
      { id: "youtube", label: "YouTube", href: "/admin/youtube" },
      { id: "content-creation", label: "Contenus", href: "/admin/content-creation", ownerOnly: true },
      { id: "scripts", label: "Scripts vidéo", href: "/admin/scripts", ownerOnly: true },
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

  const currentLabel =
    current === "equipe" ? "Équipe" : GROUPS.flatMap((g) => g.items).find((it) => it.id === current)?.label ?? "Admin";

  const rightButtons = (
    <div className="flex shrink-0 items-center gap-2">
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
  );

  const brand = (
    <Link href="/admin/crm" className="flex min-w-0 items-center gap-2.5 font-bold text-[15px] tracking-tight text-[var(--fg)]">
      <span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-extrabold tracking-tight text-[var(--accent)] border-[0.5px] border-white/10"
        style={{ background: "linear-gradient(150deg, #2b2b2e, #000)" }}
      >
        AM
      </span>
      <span className="hidden lg:inline">Admin</span>
      <span className="truncate md:hidden">{currentLabel}</span>
    </Link>
  );

  return (
    <>
      <nav className="mac-nav admin-topnav relative z-40 mb-6 md:mb-8" aria-label="Administration">
        {brand}
        {/* .mac-seg impose son display : le masquage se fait sur l'enveloppe. */}
        <div className="hidden md:block">
          <div className="mac-seg">
            {groups.map((g) => (
              <GroupMenu key={g.label} group={g} current={current} />
            ))}
          </div>
        </div>
        {rightButtons}
      </nav>
      <MobileTabBar groups={groups} current={current} />
    </>
  );
}

// Téléphone : barre d'onglets fixée en bas, comme une app. Un onglet à une
// seule page y mène directement, sinon il ouvre une feuille avec ses pages.
function MobileTabBar({ groups, current }: { groups: Group[]; current: AdminSection }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const sheetGroup = groups.find((g) => g.label === openGroup);

  useEffect(() => {
    if (!openGroup) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenGroup(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openGroup]);

  return (
    <div className="md:hidden">
      {sheetGroup && (
        <>
          <button
            type="button"
            aria-label="Fermer"
            className="admin-sheet-backdrop fixed inset-0 z-[60] bg-black/30"
            onClick={() => setOpenGroup(null)}
          />
          <div
            role="menu"
            aria-label={sheetGroup.label}
            className="admin-sheet fixed inset-x-3 z-[61] overflow-hidden rounded-2xl border-[0.5px] border-[var(--field-brd)] bg-[var(--group)] p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
          >
            <p className="px-3 pb-1 pt-2 text-[12px] font-semibold text-[var(--fg3)]">{sheetGroup.label}</p>
            {sheetGroup.items.map((it) => (
              <Link
                key={it.id}
                href={it.href}
                role="menuitem"
                onClick={() => setOpenGroup(null)}
                aria-current={it.id === current ? "page" : undefined}
                className={`flex items-center justify-between rounded-xl px-3 py-3.5 text-[16px] font-semibold transition-colors active:bg-[var(--field)] ${
                  it.id === current ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent2)]" : "text-[var(--fg)]"
                }`}
              >
                {it.label}
                <span className="text-[var(--fg3)]" aria-hidden>
                  ›
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      <nav aria-label="Rubriques" className="admin-tabbar fixed inset-x-0 bottom-0 z-[62] grid border-t-[0.5px] border-[var(--glass-brd)]" style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}>
        {groups.map((g) => {
          const Icon = g.icon;
          const active = g.items.some((it) => it.id === current);
          const isOpen = openGroup === g.label;
          const cls = `flex flex-col items-center gap-0.5 pt-2 pb-1 text-[10.5px] font-semibold transition-colors ${
            active || isOpen ? "text-[var(--accent)]" : "text-[var(--fg3)]"
          }`;
          const content = (
            <>
              <Icon size={23} strokeWidth={active ? 2.3 : 1.9} aria-hidden />
              {g.label}
            </>
          );
          if (g.items.length === 1) {
            return (
              <Link key={g.label} href={g.items[0].href} className={cls} aria-current={active ? "page" : undefined}>
                {content}
              </Link>
            );
          }
          return (
            <button
              key={g.label}
              type="button"
              className={cls}
              aria-expanded={isOpen}
              aria-haspopup="menu"
              onClick={() => setOpenGroup(isOpen ? null : g.label)}
            >
              {content}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
