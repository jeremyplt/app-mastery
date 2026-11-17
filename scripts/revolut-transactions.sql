-- Transactions Revolut Business vues par le webhook /api/webhook/revolut.
-- Appliquée le 2026-11-17 en migration Supabase
-- « revolut_transactions » (avant la création du webhook chez Revolut).
-- Une ligne par transaction (identifiant Revolut), mise à jour à chaque
-- événement : sert au cochage automatique des échéances et à la comptabilité.
-- Montant, devise et compte : la jambe reçue (ou la première), le reste dans raw.

create table public.revolut_transactions (
  id text primary key,
  first_seen_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_event text,
  type text not null,
  state text not null,
  request_id text,
  amount numeric(14,2),
  currency text,
  account_id text,
  description text,
  reference text,
  tx_created_at timestamptz,
  tx_updated_at timestamptz,
  completed_at timestamptz,
  raw jsonb not null,
  -- Rapprochement : processing (en cours), paid (échéance cochée), alert
  -- (Jeremy prévenu, rien coché), ignored (pas un paiement d'élève). Vide :
  -- pas encore traité (transaction en attente).
  match_status text check (match_status in ('processing','paid','alert','ignored')),
  match_reason text,
  -- Échéance rattachée : position dans l'échéancier de l'élève (1 = la 1re).
  student_id uuid references public.students(id) on delete set null,
  schedule_position integer,
  processed_at timestamptz,
  -- Alertes envoyées à Jeremy, par type : { "premiere": "2026-11-17T..." }.
  alerts jsonb not null default '{}'::jsonb
);
alter table public.revolut_transactions enable row level security;
create index revolut_transactions_completed_idx on public.revolut_transactions (completed_at desc);
create index revolut_transactions_student_idx on public.revolut_transactions (student_id) where student_id is not null;
