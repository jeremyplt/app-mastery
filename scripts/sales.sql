-- Ventes déclarées dans /admin/ventes + échéancier.
-- Appliquée le 2026-10-06 via migration Supabase "sales_and_payments".
-- Cron : job pg_cron "ventes" toutes les 15 min -> /api/cron/ventes (Bearer CRON_SECRET).

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by text,
  email text not null,
  first_name text not null,
  last_name text,
  phone text,
  offer text not null default 'Pack Incubateur App Mastery',
  total_amount numeric(10,2) not null,
  currency text not null default 'EUR',
  installments int not null check (installments between 1 and 12),
  start_date date,
  company jsonb not null default '{}'::jsonb,
  reminder_offsets int[] not null default '{3,1,0}',
  notes text,
  contract_status text not null default 'none'
    check (contract_status in ('none','sent','delivered','completed','declined','voided')),
  contract_submission_id text, -- DocuSeal (renommée le 2026-10-07, migration "sales_contract_docuseal")
  contract_sent_at timestamptz,
  contract_signed_at timestamptz,
  skool_invited_at timestamptz,
  archived boolean not null default false
);
create index sales_email_idx on public.sales (email);
alter table public.sales enable row level security;

create table public.sale_payments (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  position int not null,
  amount numeric(10,2) not null,
  due_date date not null,
  paid boolean not null default false,
  paid_at timestamptz,
  reminders_sent jsonb not null default '{}'::jsonb,
  unique (sale_id, position)
);
create index sale_payments_due_idx on public.sale_payments (due_date) where paid = false;
alter table public.sale_payments enable row level security;

insert into public.site_settings (key, value, updated_at)
values ('bank_details', '{"holder":"","iban":"","bic":"","bank":""}'::jsonb, now())
on conflict (key) do nothing;

-- 2026-10-07, migration "sales_alerts_meta_origin" : relances contrat, Purchase Meta,
-- origine de la vente, alertes à Jeremy, lead marqué client dans le CRM.
alter table public.sales
  add column contract_link text,
  add column contract_reminders jsonb not null default '{}'::jsonb,
  add column meta_purchase_sent_at timestamptz,
  add column origin text,
  add column utm jsonb not null default '{}'::jsonb,
  add column alerts_sent jsonb not null default '{}'::jsonb;
alter table public.crm_leads
  add column client boolean not null default false,
  add column client_at timestamptz;
