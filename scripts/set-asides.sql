-- Mises de côté sur les sous-comptes Revolut EUR « TVA » et « Closers ».
-- NON APPLIQUÉE (phase 1, simulation). À appliquer en migration Supabase
-- « set_asides » avant de déployer le code qui l'utilise.
--
-- Une ligne par mensualité encaissée et par type : la TVA de sa facture (telle
-- que facturée) vers TVA, la part du closer (commission / nombre de
-- mensualités) vers Closers. Créée par le job de factures quand la facture
-- d'une mensualité payée existe, ou par le webhook Revolut si elle existait
-- déjà. Montant toujours en euros, jamais nul.
--
-- Statuts :
--   a_faire : à virer (mode auto) ; simule : mode simulation, ne sera jamais
--   viré ; vire : virement Revolut terminé et vérifié ; annule : à ne pas
--   virer (posé à la main, avec un motif).

create table public.set_asides (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  kind text not null check (kind in ('tva','closer')),
  target_account text not null check (target_account in ('tva','closers')),
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'EUR' check (currency = 'EUR'),
  -- La mensualité : « <id élève>:<position> ». Avec kind, la clé d'unicité :
  -- jamais deux mises de côté pour la même mensualité et le même type.
  installment_key text not null,
  student_id uuid references public.students(id) on delete set null,
  student_name text not null,
  schedule_position integer not null check (schedule_position >= 1),
  schedule_count integer not null check (schedule_count >= schedule_position),
  -- Facture de la mensualité (Odoo) et ligne du job qui l'a faite.
  invoice_number text,
  odoo_invoice_id integer,
  invoice_key text,
  -- Virement de l'élève, quand le webhook l'a rattaché à cette mensualité.
  revolut_transaction_id text,
  source text not null check (source in ('factures','webhook')),
  status text not null default 'a_faire' check (status in ('a_faire','simule','vire','annule')),
  -- Référence du virement : « TVA Kevin M 2/3 », « Closer Kevin M 2/3 ».
  reference text not null check (char_length(reference) between 1 and 34 and reference ~ '^[A-Za-z0-9 /.-]+$'),
  -- Détail du calcul : TVA de la facture, commission, nombre de mensualités...
  detail jsonb not null default '{}'::jsonb,
  simulated_at timestamptz,
  -- Virement : réservé avant l'appel, puis l'identifiant et l'état donnés par
  -- Revolut. request_id envoyé à Revolut = id de la ligne.
  transfer_started_at timestamptz,
  revolut_transfer_id text,
  revolut_transfer_state text,
  transferred_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  last_error text,
  -- Point du jour de 9 h : ligne déjà présentée à Jeremy.
  reported_at timestamptz,
  unique (installment_key, kind),
  constraint set_asides_target_matches_kind check ((kind = 'tva' and target_account = 'tva') or (kind = 'closer' and target_account = 'closers')),
  constraint set_asides_vire_has_transfer check (status <> 'vire' or (revolut_transfer_id is not null and transferred_at is not null))
);
alter table public.set_asides enable row level security;
-- Une facture ne finance qu'une mise de côté de chaque type.
create unique index set_asides_invoice_kind_idx on public.set_asides (invoice_number, kind) where invoice_number is not null;
create index set_asides_status_idx on public.set_asides (status, created_at);
create index set_asides_unreported_idx on public.set_asides (created_at) where reported_at is null;

-- Interrupteur, rangé comme invoices_auto_send : off (rien), simulation (lignes
-- « simule » et section dans le point du jour, rien ne bouge), auto (lignes
-- « a_faire », virées par scripts/revolut/mises-de-cote.ts sur le serveur
-- Harness). since : seules les factures du job faites à partir de cette date
-- sont rattrapées si une mise de côté a manqué (le passé se règle à la main
-- avec scripts/revolut/bilan-mises-de-cote.ts). halted : arrêt total posé par
-- le script de virement au moindre écart, à lever à la main.
insert into public.site_settings (key, value, updated_at)
values ('set_asides_mode', jsonb_build_object('mode', 'simulation', 'since', now()), now())
on conflict (key) do nothing;
