"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: "owner" | "member" | "closer";
  invited_by: string | null;
  created_at: string;
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function EquipeAdmin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "closer">("member");
  const [inviting, setInviting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        // Page réservée au propriétaire : les membres sont renvoyés vers le CRM.
        if (d.role === "owner") setAuthorized(true);
        else if (d.admin) window.location.href = "/admin/crm";
        else window.location.href = "/membres";
      })
      .catch(() => {
        window.location.href = "/membres";
      });
  }, []);

  async function loadUsers() {
    try {
      const r = await fetch("/api/admin/users");
      const d = await r.json();
      if (d.users) setUsers(d.users);
      else setError(d.error || "Impossible de charger l'équipe");
    } catch {
      setError("Impossible de charger l'équipe");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authorized) loadUsers();
  }, [authorized]);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim() || inviting) return;
    setInviting(true);
    setError(null);
    setNotice(null);
    try {
      const r = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), name: inviteName.trim(), role: inviteRole }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Une erreur est survenue");
      } else {
        setUsers((u) => [...u, d.user]);
        setInviteEmail("");
        setInviteName("");
        setNotice(
          d.emailSent
            ? `Invitation envoyée à ${d.user.email}`
            : `${d.user.email} ajouté, mais l'email d'invitation n'a pas pu être envoyé. Il peut se connecter via /membres.`
        );
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setInviting(false);
    }
  }

  async function updateUser(user: AdminUser, fields: { role?: AdminUser["role"]; name?: string }) {
    setError(null);
    const r = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, ...fields }),
    });
    const d = await r.json();
    if (!r.ok) setError(d.error || "Une erreur est survenue");
    else setUsers((u) => u.map((x) => (x.id === user.id ? d.user : x)));
  }

  async function remove(user: AdminUser) {
    if (!confirm(`Retirer l'accès admin de ${user.email} ?`)) return;
    setError(null);
    setNotice(null);
    try {
      const r = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
      const d = await r.json();
      if (!r.ok) setError(d.error || "Une erreur est survenue");
      else {
        setUsers((u) => u.filter((x) => x.id !== user.id));
        setNotice(`Accès retiré pour ${user.email}`);
      }
    } catch {
      setError("Une erreur est survenue");
    }
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center">
        Vérification...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:py-8">
        <AdminNav current="equipe" isOwner />
        <h1 className="text-[28px] font-bold tracking-tight">Équipe</h1>
        <p className="mt-2 text-[var(--fg2)]">
          Les membres ont accès au CRM, aux candidatures, aux ventes et aux élèves.
          Un closer a les mêmes accès, déclare ses ventes et voit ses commissions
          (20 % du HT par défaut). Seul le propriétaire gère l&apos;équipe et
          les versements de commission.
        </p>

        <form onSubmit={invite} className="mt-8 flex flex-wrap gap-3">
          <input
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            placeholder="Prénom"
            className="w-40 rounded-lg border border-[var(--sep)] bg-[var(--group)] px-4 py-2.5 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none"
          />
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@exemple.com"
            className="min-w-[220px] flex-1 rounded-lg border border-[var(--sep)] bg-[var(--group)] px-4 py-2.5 text-[var(--fg)] placeholder-gray-500 focus:border-[var(--accent)] focus:outline-none"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as "member" | "closer")}
            className="rounded-lg border border-[var(--sep)] bg-[var(--group)] px-3 py-2.5 font-semibold text-[var(--fg)]"
            aria-label="Rôle"
          >
            <option value="member">Membre</option>
            <option value="closer">Closer</option>
          </select>
          <button
            type="submit"
            disabled={inviting || !inviteEmail.trim()}
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 font-semibold text-[var(--fg)] hover:bg-[var(--accent)] disabled:opacity-50"
          >
            {inviting ? "Envoi..." : "Inviter"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-red-300">
            {error}
          </div>
        )}
        {notice && (
          <div className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-emerald-300">
            {notice}
          </div>
        )}

        <div className="mt-8 divide-y divide-[var(--sep)] rounded-xl border border-[var(--sep)]">
          {loading ? (
            <div className="px-5 py-8 text-center text-[var(--fg2)]">
              Chargement...
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  {/* Prénom modifiable directement : c'est lui qui s'affiche
                      dans les ventes, les commissions, etc. */}
                  <input
                    key={u.name ?? ""}
                    defaultValue={u.name ?? ""}
                    placeholder="Ajouter un prénom"
                    aria-label={`Prénom de ${u.email}`}
                    onBlur={(e) => e.target.value.trim() !== (u.name ?? "") && updateUser(u, { name: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                    className="w-full max-w-[260px] rounded-lg border border-transparent bg-transparent px-2 py-1 -ml-2 text-[16px] font-bold text-[var(--fg)] placeholder:font-semibold placeholder:text-[var(--accent2)] hover:border-[var(--sep)] focus:border-[var(--accent)] focus:outline-none"
                  />
                  <div className="text-[14px] font-medium text-[var(--fg2)]">{u.email}</div>
                  <div className="text-[var(--fg2)]">
                    {u.role === "owner"
                      ? "Propriétaire"
                      : `${u.role === "closer" ? "Closer" : "Membre"}, invité le ${formatDate(u.created_at)}`}
                  </div>
                </div>
                {u.role !== "owner" && (
                  <div className="flex items-center gap-2">
                    <select
                      value={u.role}
                      onChange={(e) => updateUser(u, { role: e.target.value as AdminUser["role"] })}
                      className="rounded-lg border border-[var(--sep)] bg-[var(--group)] px-3 py-2 font-semibold text-[var(--fg)]"
                      aria-label={`Rôle de ${u.email}`}
                    >
                      <option value="member">Membre</option>
                      <option value="closer">Closer</option>
                    </select>
                  <button
                    onClick={() => remove(u)}
                    className="rounded-lg border border-red-800 px-4 py-2 font-semibold text-[var(--red)] hover:bg-red-950/50"
                  >
                    Retirer
                  </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
