-- Table des candidatures (formulaire de qualification /candidature)
-- À appliquer sur le projet Supabase "App Mastery" (wvmjmsefnslpdgglyweu)
-- une fois le projet réactivé.

create table if not exists public.candidatures (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  first_name   text not null,
  email        text not null,
  phone        text,

  q1_stage     text not null,   -- idee | dev | publiee-peu | publiee-users
  q2_goal      text not null,   -- business | passion | fun
  q3_revenue   text not null,   -- moins-500 | 500-2000 | 2000-5000 | 5000-plus
  q4_status    text not null,   -- salarie | freelance | etudiant | entre-deux
  q5_attentes  text not null,   -- champ libre
  q6_hours     text not null,   -- moins-2h | 2-5h | 5-10h | 10h-plus
  budget_ready text,            -- oui | non | null (rattrapage budget)

  score        int  not null default 0,
  qualified    boolean not null default false,

  utm_source   text,
  utm_medium   text,
  utm_campaign text
);

create index if not exists candidatures_created_at_idx on public.candidatures (created_at desc);
create index if not exists candidatures_qualified_idx  on public.candidatures (qualified);

-- Accès réservé au service role (l'app passe par getAdminClient).
alter table public.candidatures enable row level security;
