-- Suivi des élèves (/admin/eleves), qui remplace le Google Sheet « Suivi élèves ».
-- Appliquée le 2026-10-09 via les migrations Supabase "students" et "students_sale_unique".
-- Import initial : 8 élèves du sheet (payé = cellule verte dans le sheet).

create table public.students (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sale_id uuid references public.sales(id) on delete set null,
  name text not null,
  email text,
  phone text,
  app text,
  start_date date,
  payment_label text,
  -- Paiements saisis à la main (élèves sans vente déclarée) :
  -- [{ "date": "2026-07-13", "amount": 1000, "paid": true }]
  payments jsonb not null default '[]'::jsonb,
  kickoff boolean not null default false,
  app_published boolean not null default false,
  first_sale boolean not null default false,
  bilan_done boolean not null default false,
  ten_k boolean not null default false,
  guarantee boolean not null default false,
  notes text,
  archived boolean not null default false,
  constraint students_sale_id_key unique (sale_id)
);
alter table public.students enable row level security;

-- 2026-10-09, migration "closers_commissions_student_links" : rôle closer,
-- commissions sur les ventes, versements, liens et dernier échange des élèves.
alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users add constraint admin_users_role_check check (role in ('owner','member','closer'));
alter table public.admin_users add column if not exists name text;
alter table public.sales
  add column closer_email text,
  add column commission_rate numeric(5,2) not null default 20,
  add column commission_amount numeric(10,2);
create table public.closer_payouts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  closer_email text not null,
  amount numeric(10,2) not null check (amount > 0),
  paid_on date not null default current_date,
  note text
);
alter table public.students
  add column links jsonb not null default '[]'::jsonb,
  add column last_contact_at timestamptz;

-- 2026-10-09, migration "commissions_manual_and_cancel" : registre des commissions.
alter table public.sales
  add column commission_cancelled_at timestamptz,
  add column commission_cancel_reason text;
create table public.manual_commissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  closer_email text not null,
  label text not null,
  amount numeric(10,2) not null check (amount > 0),
  student_id uuid references public.students(id) on delete set null,
  note text,
  cancelled_at timestamptz,
  cancel_reason text
);
