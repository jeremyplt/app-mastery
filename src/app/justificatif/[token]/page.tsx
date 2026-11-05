"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/lib/supabase";

// Page personnelle où un élève hors UE dépose son justificatif de domicile. Le
// lien envoyé par email contient son jeton unique : pas besoin de compte.

type Status = "loading" | "invalid" | "none" | "pending" | "accepted" | "rejected";

const MAX_BYTES = 10 * 1024 * 1024;
const OK_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];

export default function JustificatifPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [firstName, setFirstName] = useState("");
  const [rejectReason, setRejectReason] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/justificatif?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return setStatus("invalid");
        setFirstName(d.firstName);
        setRejectReason(d.rejectReason);
        setStatus(d.status);
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  function pick(f: File | null) {
    setError(null);
    if (f && f.size > MAX_BYTES) {
      setFile(null);
      if (input.current) input.current.value = "";
      return setError("Ce fichier dépasse 10 Mo. Essaie une photo moins lourde ou un PDF.");
    }
    if (f && f.type && !OK_TYPES.includes(f.type)) {
      setFile(null);
      if (input.current) input.current.value = "";
      return setError("Envoie un PDF ou une photo (JPG, PNG ou HEIC).");
    }
    setFile(f);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Choisis d'abord ton document.");
    setSending(true);
    setError(null);
    try {
      const type = file.type || (/\.hei[cf]$/i.test(file.name) ? "image/heic" : "");
      const start = await fetch("/api/justificatif", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, type, size: file.size }) }).then((r) => r.json());
      if (start.error) return setError(start.error);
      const up = await supabase.storage.from("residence-proofs").uploadToSignedUrl(start.path, start.uploadToken, file, { contentType: type });
      if (up.error) return setError("L'envoi a échoué. Vérifie ta connexion et réessaie.");
      const done = await fetch("/api/justificatif", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, path: start.path, type, name: file.name }) }).then((r) => r.json());
      if (done.error) return setError(done.error);
      setFile(null);
      setStatus("pending");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Problème de connexion, réessaie.");
    } finally {
      setSending(false);
    }
  }

  const canUpload = status === "none" || status === "rejected";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-[15px] font-bold tracking-tight">App Mastery</span>
          <ThemeToggle />
        </div>

        {status === "loading" && <p className="text-sm font-semibold text-[var(--fg2)]">Chargement...</p>}

        {status === "invalid" && (
          <div className="mac-group p-6">
            <h1 className="text-[22px] font-bold tracking-tight">Ce lien ne fonctionne pas</h1>
            <p className="mt-2 text-[15px] font-medium text-[var(--fg2)]">Reprends le lien de mon email, ou réponds-y et je t&apos;en renvoie un.</p>
          </div>
        )}

        {status === "pending" && (
          <div className="mac-group p-6" role="status">
            <h1 className="text-[22px] font-bold tracking-tight">C&apos;est bien reçu, merci {firstName} !</h1>
            <p className="mt-2 text-[15px] font-medium text-[var(--fg2)]">Je le vérifie de mon côté. Tu n&apos;as rien d&apos;autre à faire, et je te recontacte seulement s&apos;il me faut un autre document.</p>
          </div>
        )}

        {status === "accepted" && (
          <div className="mac-group p-6" role="status">
            <h1 className="text-[22px] font-bold tracking-tight">Ton justificatif est validé</h1>
            <p className="mt-2 text-[15px] font-medium text-[var(--fg2)]">Merci {firstName}, il n&apos;y a plus rien à faire.</p>
          </div>
        )}

        {canUpload && (
          <>
            <h1 className="text-[28px] font-bold tracking-tight">{firstName}, dépose ton justificatif de domicile</h1>
            <p className="mt-3 text-[15px] font-medium leading-relaxed text-[var(--fg2)]">
              Comme tu habites hors de l&apos;Union européenne, je ne te facture pas la TVA luxembourgeoise. En échange, je dois pouvoir prouver où tu résides en cas de contrôle.
            </p>

            {status === "rejected" && (
              <div role="alert" className="mt-4 rounded-[12px] bg-[color-mix(in_srgb,var(--orange)_14%,transparent)] px-4 py-3 text-[14px] font-semibold">
                Il me faut un autre document{rejectReason ? ` : ${rejectReason}` : "."}
              </div>
            )}

            <div className="mac-group mt-5 p-5">
              <p className="text-[15px] font-bold">Ce qu&apos;il me faut</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] font-medium">
                <li>Une facture d&apos;électricité, d&apos;eau ou d&apos;internet, un relevé bancaire ou ton bail</li>
                <li>Un document de moins de 3 mois (pour un bail : encore en cours)</li>
                <li>À ton nom, avec l&apos;adresse indiquée dans ton contrat</li>
              </ul>
            </div>

            <form onSubmit={submit} className="mac-group mt-4 p-5">
              <label className="block">
                <span className="mb-2 block text-[15px] font-bold">Ton document (PDF ou photo, 10 Mo maximum)</span>
                <input ref={input} className="mac-field" type="file" accept="application/pdf,image/*" onChange={(e) => pick(e.target.files?.[0] ?? null)} />
              </label>
              {error && (
                <p role="alert" className="mt-3 text-sm font-semibold text-[var(--red)]">
                  {error}
                </p>
              )}
              <button type="submit" disabled={sending || !file} className="mac-btn mac-btn-primary mt-4 w-full disabled:opacity-50">
                {sending ? "Envoi en cours..." : "Envoyer mon justificatif"}
              </button>
              <p className="mt-3 text-[13px] font-medium text-[var(--fg2)]">Ton document reste privé. Il sert uniquement à justifier ta facture en cas de contrôle.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
