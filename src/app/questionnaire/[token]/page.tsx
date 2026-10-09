"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { ACCESS_ANSWER_ID, ACCESS_EMAIL, ACCESS_TODO, type Question } from "@/lib/questionnaire-questions";

// Questionnaire de démarrage d'un nouvel élève (« Kick-start App Mastery »).
// Le lien envoyé par email contient son jeton unique : pas besoin de compte.

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
  const [name, setName] = useState("");
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
        setName(d.name);
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
            <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent2)]">Kick-start App Mastery</p>
            <h1 className="mt-2 text-[30px] font-bold leading-tight tracking-tight">Bienvenue {firstName} 👋</h1>
            <p className="mt-3 text-[16px] font-medium leading-relaxed text-[var(--fg2)]">
              Quelques questions sur ton application pour bien démarrer l&apos;accompagnement. Je lis tes réponses avant notre appel de démarrage.
            </p>
            {/* En-tête du document : Nom et App, puis les questions numérotées */}
            <div id="q-app" className="mac-group mt-6 grid gap-4 p-5 sm:grid-cols-2">
              <div>
                <p className="text-[13px] font-bold text-[var(--fg2)]">Nom</p>
                <p className="mt-2 text-[17px] font-bold">{name}</p>
              </div>
              <label className="block">
                <span className="text-[13px] font-bold text-[var(--fg2)]">App</span>
                <input
                  className="mac-field mt-1 !py-2.5"
                  placeholder="Nom de ton application"
                  value={answers.app ?? ""}
                  onChange={(e) => setAnswers({ ...answers, app: e.target.value })}
                />
              </label>
            </div>

            <div className="mt-8 space-y-4">
              {questions
                .filter((q) => q.id !== "app")
                .map((q, i) => (
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
                    {q.type === "fields" && (
                      <div className="grid gap-2">
                        {q.fields?.map((f) => (
                          <label key={f.id} className="flex items-center gap-3">
                            <span className="w-24 shrink-0 text-[14px] font-bold text-[var(--fg2)]">{f.label}</span>
                            <input
                              className="mac-field !py-2.5"
                              inputMode={f.url ? "url" : undefined}
                              placeholder={f.placeholder ?? (f.url ? "Lien" : "")}
                              value={answers[`${q.id}.${f.id}`] ?? ""}
                              onChange={(e) => setAnswers({ ...answers, [`${q.id}.${f.id}`]: e.target.value })}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {(q.type === "long" || q.type === "list") && (
                      <textarea
                        className={`mac-field ${q.type === "list" ? "min-h-[96px]" : "min-h-[130px]"}`}
                        placeholder={q.placeholder}
                        value={answers[q.id] ?? ""}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* À faire : accès en lecture seule */}
            <div className="mac-group mt-4 border-[var(--accent)] p-5">
              <p className="text-[16px] font-bold">À faire : envoie-moi un accès en lecture seule</p>
              <p className="mt-1 text-[14.5px] font-medium text-[var(--fg2)]">
                À l&apos;adresse <b className="text-[var(--fg)]">{ACCESS_EMAIL}</b>, en « read-only » :
              </p>
              <ul className="mt-2 space-y-1">
                {ACCESS_TODO.map((t) => (
                  <li key={t} className="text-[14.5px] font-semibold">
                    • {t}
                  </li>
                ))}
              </ul>
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-[12px] bg-[var(--field)] px-4 py-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-[var(--accent)]"
                  checked={answers[ACCESS_ANSWER_ID] === "Oui"}
                  onChange={(e) => setAnswers({ ...answers, [ACCESS_ANSWER_ID]: e.target.checked ? "Oui" : "" })}
                />
                <span className="text-[15px] font-bold">J&apos;ai envoyé les accès</span>
              </label>
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
