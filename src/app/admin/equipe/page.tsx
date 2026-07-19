"use client";

import { useEffect, useState } from "react";

type AdminUser = {
  id: string;
  email: string;
  role: "owner" | "member";
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
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Une erreur est survenue");
      } else {
        setUsers((u) => [...u, d.user]);
        setInviteEmail("");
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
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Vérification...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Équipe</h1>
        <p className="mt-2 text-gray-400">
          Les membres invités ont accès aux candidatures et au CRM (contacts,
          suivi, cases à cocher). Seul le propriétaire gère l&apos;équipe, les
          cours et les paiements.
        </p>

        <form onSubmit={invite} className="mt-8 flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@exemple.com"
            className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={inviting || !inviteEmail.trim()}
            className="rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
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

        <div className="mt-8 divide-y divide-gray-800 rounded-xl border border-gray-800">
          {loading ? (
            <div className="px-5 py-8 text-center text-gray-400">
              Chargement...
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <div className="font-semibold">{u.email}</div>
                  <div className="text-gray-400">
                    {u.role === "owner"
                      ? "Propriétaire"
                      : `Membre, invité le ${formatDate(u.created_at)}`}
                  </div>
                </div>
                {u.role !== "owner" && (
                  <button
                    onClick={() => remove(u)}
                    className="rounded-lg border border-red-800 px-4 py-2 font-semibold text-red-400 hover:bg-red-950/50"
                  >
                    Retirer
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
