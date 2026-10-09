"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

// Questionnaire de démarrage d'un nouvel élève. Le lien (envoyé par email)
// contient son jeton unique : pas besoin de compte.

type Question = {
  id: string;
  label: string;
  type: "choice" | "text" | "long";
  choices?: string[];
  required?: boolean;
  placeholder?: string;
};

const CHOICE_BASE =
  "w-full text-left rounded-[12px] border-[0.5px] px-4 py-3 text-[15px] font-semibold transition-[background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99]";
function choiceCls(selected: boolean) {
  return selected
    ? `${CHOICE_BASE} border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--fg)]`
    : `${CHOICE_BASE} border-[var(--field-brd)] bg-[var(--field)] text-[var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_7%,transparent)]`;
}

export default function QuestionnairePage() {
  const { token } = useParams<{ token: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [firstName, setFirstName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [state, setState] = useState<"loading" | "form" | "done" | "invalid">("loading");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/questionnaire?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return setState("invalid");
        setQuestions(d.questions);
        setFirstName(d.firstName);
        setAnswers(d.answers ?? {});
        setState(d.answered ? "done" : "form");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const missing = questions.find((q) => q.required && !answers[q.id]?.trim());
    if (missing) {
      setError(`Réponds à : « ${missing.label} »`);
      document.getElementById(`q-${missing.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSending(true);
    setError(null);
    const d = await fetch("/api/questionnaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, answers }),
    })
      .then((r) => r.json())
      .catch(() => ({ error: "Problème de connexion, réessaie" }));
    setSending(false);
    if (d.error) return setError(d.error);
    setState("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-[15px] font-bold tracking-tight">App Mastery</span>
          <ThemeToggle />
        </div>

        {state === "loading" && <p className="text-[15px] font-semibold text-[var(--fg2)]">Chargement...</p>}

        {state === "invalid" && (
          <div className="mac-group p-6">
            <h1 className="text-[24px] font-bold tracking-tight">Lien invalide</h1>
            <p className="mt-2 text-[16px] font-medium text-[var(--fg2)]">
              Ce lien ne fonctionne pas. Réponds à l&apos;email que tu as reçu, et je t&apos;en renvoie un.
            </p>
          </div>
        )}

        {state === "done" && (
          <div className="mac-group p-6 text-center">
            <p className="text-[44px]" aria-hidden>
              🎉
            </p>
            <h1 className="mt-2 text-[26px] font-bold tracking-tight">Merci {firstName} !</h1>
            <p className="mt-3 text-[16px] font-medium leading-relaxed text-[var(--fg2)]">
              J&apos;ai bien reçu tes réponses. Je les lis avant notre appel de démarrage, pour qu&apos;on aille droit à l&apos;essentiel.
            </p>
            <button onClick={() => setState("form")} className="mt-5 text-[14px] font-bold text-[var(--accent2)] hover:underline">
              Modifier mes réponses
            </button>
          </div>
        )}

        {state === "form" && (
          <form onSubmit={submit} noValidate>
            <h1 className="text-[30px] font-bold leading-tight tracking-tight">
              Bienvenue {firstName} 👋
            </h1>
            <p className="mt-3 text-[16px] font-medium leading-relaxed text-[var(--fg2)]">
              Quelques questions pour bien démarrer ton accompagnement. Ça prend cinq minutes, et ça me permet de préparer notre premier appel.
            </p>

            <div className="mt-8 space-y-4">
              {questions.map((q, i) => (
                <div key={q.id} id={`q-${q.id}`} className="mac-group p-5">
                  <p className="text-[16px] font-bold">
                    {i + 1}. {q.label}
                    {!q.required && <span className="ml-1 text-[13px] font-semibold text-[var(--fg3)]">(facultatif)</span>}
                  </p>
                  <div className="mt-3">
                    {q.type === "choice" && (
                      <div className="grid gap-2">
                        {q.choices?.map((c) => (
                          <button key={c} type="button" className={choiceCls(answers[q.id] === c)} onClick={() => setAnswers({ ...answers, [q.id]: c })}>
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                    {q.type === "text" && (
                      <input
                        className="mac-field"
                        placeholder={q.placeholder}
                        value={answers[q.id] ?? ""}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      />
                    )}
                    {q.type === "long" && (
                      <textarea
                        className="mac-field min-h-[110px]"
                        placeholder={q.placeholder}
                        value={answers[q.id] ?? ""}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {error && <p className="mt-5 text-[15px] font-bold text-[var(--red)]">{error}</p>}
            <button type="submit" disabled={sending} className="mac-btn mac-btn-primary mac-btn-lg mt-6 w-full disabled:opacity-60">
              {sending ? "Envoi..." : "Envoyer mes réponses"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
