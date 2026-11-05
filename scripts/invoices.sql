-- Factures à envoyer depuis le CRM (/admin/factures).
-- Appliquée le 2026-11-05 via la migration Supabase "invoices".
-- Le PDF vient d'Odoo, qui reste la comptabilité officielle. Ici on garde le
-- brouillon du mail et le suivi de l'envoi. Bucket privé : lecture par lien signé.

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  number text not null unique,
  odoo_id integer unique,
  client_name text not null,
  client_email text,
  student_id uuid references public.students(id) on delete set null,
  invoice_date date not null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'EUR',
  -- paid : le virement est déjà reçu. due : la facture reste à régler (avec l'IBAN).
  kind text not null default 'paid' check (kind in ('paid','due')),
  pdf_path text not null,
  email_subject text not null default '',
  email_body text not null default '',
  -- no_send : facture classée, rien à envoyer (Skool, Upwork, Google...).
  status text not null default 'draft' check (status in ('draft','sending','sent','no_send')),
  sent_at timestamptz,
  sent_to text,
  brevo_message_id text
);
alter table public.invoices enable row level security;
create index invoices_status_date_idx on public.invoices (status, invoice_date desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invoices', 'invoices', false, 5242880, array['application/pdf'])
on conflict (id) do nothing;

-- 2026-11-05, migration "invoice_automation" : job de facturation sur Harness Maxxing.
-- invoice_automation : une ligne par facture, clé unique, état de chaque étape.
-- invoice_bank_lines : un virement ne peut appartenir qu'à une seule facture.
-- Voir la migration Supabase pour les colonnes. Ajoute aussi students.odoo_partner_id
-- et le réglage site_settings "invoices_auto_send" (désactivé par défaut).

-- 2026-11-05, migration "residence_proofs_and_drive" : table residence_proofs, bucket
-- privé residence-proofs, students.proof_token et proof_requested_at, invoices.drive_file_id.
