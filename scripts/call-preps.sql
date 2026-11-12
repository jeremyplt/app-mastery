-- Préparation d'appel (/admin/eleves/[id] et /admin/calendrier), 12 nov. 2026.
-- PAS ENCORE APPLIQUÉE. À appliquer une fois (migration Supabase "call_preps")
-- avant de mettre la fonctionnalité en production.
--
-- Une ligne par appel avec un élève : la fiche que Claude prépare à partir de
-- la fiche élève, de WhatsApp et de la base de conseils validée. Le CRM crée la
-- demande (bouton « Préparer l'appel »), le job Harness « App Mastery · appels »
-- la traite (scripts/appels/run.sh) et pré-génère le matin les appels du jour.
-- Rien n'est jamais envoyé à l'élève.

create table public.call_preps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- URI de l'événement Calendly, "fiche:<student_id>:<kickoff|cloture>" pour un
  -- créneau noté sur la fiche, ou "manuel:<student_id>" sans rendez-vous.
  event_key text not null unique,
  student_id uuid not null references public.students(id) on delete cascade,
  starts_at timestamptz not null,
  title text,
  -- demande -> en_cours -> fait (ou erreur). Régénérer repasse en demande en
  -- gardant l'ancienne fiche affichée en attendant la nouvelle.
  statut text not null default 'demande' check (statut in ('demande', 'en_cours', 'fait', 'erreur')),
  -- { ou_il_en_est, recemment, inquietudes, sujet_probable, points[3], cloture[{ texte, jalon }] }
  fiche jsonb,
  -- Index des actions de clôture cochées par Jeremy.
  checked jsonb not null default '[]'::jsonb,
  error text,
  -- true : demandée par le job du matin (appel du jour), false : bouton du CRM.
  auto boolean not null default false,
  requested_at timestamptz not null default now(),
  generated_at timestamptz
);
create index call_preps_student_idx on public.call_preps (student_id, starts_at desc);
create index call_preps_statut_idx on public.call_preps (statut) where statut in ('demande', 'en_cours');
-- Lu et écrit seulement côté serveur (clé service) : aucune politique publique.
alter table public.call_preps enable row level security;
