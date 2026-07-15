-- Table CRM pour les leads VSL et Plan d'action
-- Appliquée le 2026-07-14 via migration Supabase "create_crm_leads"

create table if not exists crm_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  source text not null check (source in ('vsl', 'plan-action')),
  first_name text,
  phone text,
  contacted boolean not null default false,
  contacted_at timestamptz,
  replied boolean not null default false,
  replied_at timestamptz,
  call_booked boolean not null default false,
  call_booked_at timestamptz,
  call_booked_auto boolean not null default false,
  disqualified boolean not null default false,
  -- Injoignable : faux numéro ou pas disponible sur WhatsApp
  unreachable boolean not null default false,
  notes text,
  -- Pré-qualification opt-in VSL (migration "crm_leads_vsl_qualification",
  -- appliquée le 2026-07-15). qualified null = opt-in avant la mise en place
  -- des questions, ou questions abandonnées.
  age text,
  profession text,
  objectif text,
  -- Question d'engagement "prêt à investir sur toi" (migration
  -- "crm_leads_vsl_invest", appliquée le 2026-07-15)
  invest text,
  qualified boolean,
  unique (email, source)
);

create index if not exists crm_leads_source_idx on crm_leads (source, created_at desc);
create index if not exists crm_leads_email_idx on crm_leads (email);

-- RLS activée sans policy : accès uniquement via la service role key (API admin)
alter table crm_leads enable row level security;
