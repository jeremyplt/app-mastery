-- Email de sortie de vidéo (16 nov. 2026).
-- Appliquée le 16/11/2026 (migration Supabase "video_emails").
--
-- Une ligne par vidéo longue de la chaîne @jeremyptlt. La tâche Harness
-- « App Mastery · sorties vidéo » (scripts/video-email/run.sh, toutes les
-- 15 min) repère chaque nouvelle vidéo, écrit l'email pour les leads sans RDV
-- et le crée en BROUILLON dans Brevo avec sa liste. Rien n'est envoyé : Jeremy
-- relit et envoie depuis Brevo.

create table public.video_emails (
  video_id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  published_at timestamptz not null,
  -- ignoree (vidéo d'avant la mise en service, ou trop ancienne)
  -- a_faire -> en_cours -> brouillon (ou erreur, repris 3 fois au plus)
  statut text not null check (statut in ('ignoree', 'a_faire', 'en_cours', 'brouillon', 'erreur')),
  -- prerédigé (email écrit à l'avance, ex. vidéo B) ou claude
  source text,
  tag text,
  subject text,
  brevo_list_id integer,
  brevo_campaign_id integer,
  -- Contacts ajoutés à la liste, et leads du CRM absents de Brevo.
  recipients integer,
  missing integer,
  attempts integer not null default 0,
  error text
);
create index video_emails_statut_idx on public.video_emails (statut) where statut in ('a_faire', 'en_cours', 'erreur');
-- Lu et écrit seulement côté serveur (clé service) : aucune politique publique.
alter table public.video_emails enable row level security;
