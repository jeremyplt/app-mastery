-- Ressentis d'appels (/admin/ressentis et carte « Ressenti » des appels), 12 nov. 2026.
-- Appliquée le 12/11/2026 (migration Supabase "call_journal").
--
-- Une ligne par appel avec un élève : avant l'appel, ce que Jeremy craint et
-- ce qu'il prévoit ; après, ce qui s'est vraiment passé. Avec le temps, l'écart
-- entre la prévision et la réalité se voit dans le bilan. Tout est facultatif :
-- l'avant se remplit d'abord, l'après plus tard. Propriétaire seulement.

create table public.call_journal (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Même clé que call_preps.event_key (URI Calendly, "fiche:...", "manuel:...")
  -- pour un appel de la carte ; vide pour un ressenti ajouté à la main.
  event_key text unique,
  student_id uuid references public.students(id) on delete set null,
  call_at timestamptz not null,
  label text,
  -- Avant l'appel
  apprehension smallint check (apprehension between 0 and 10),
  inquietude text,
  prevision smallint check (prevision between 1 and 5),
  avant_at timestamptz,
  -- Après l'appel
  deroulement smallint check (deroulement between 1 and 5),
  duree_min smallint check (duree_min between 1 and 600),
  parole text check (parole in ('moi', 'equilibre', 'eleve')),
  crainte text check (crainte in ('oui', 'en_partie', 'non')),
  pourquoi text,
  apres_at timestamptz
);
create index call_journal_student_idx on public.call_journal (student_id, call_at desc);
create index call_journal_call_at_idx on public.call_journal (call_at desc);
-- Lu et écrit seulement côté serveur (clé service) : aucune politique publique.
alter table public.call_journal enable row level security;
