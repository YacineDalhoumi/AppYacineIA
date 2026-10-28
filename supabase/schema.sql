-- Yacine CRM — schéma de base (prospects + interactions)
-- À coller dans Supabase : Project > SQL Editor > New query > Run.
-- Idempotent : peut être relancé sans dupliquer les objets.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Table prospects
-- ---------------------------------------------------------------------

create table if not exists prospects (
  id uuid primary key default gen_random_uuid(),

  -- Entreprise
  nom text not null,
  metier text not null default 'serrurier',
  adresse text,
  code_postal text,
  ville text,
  departement text,
  site_web text,
  fiche_google_url text,

  -- Contact
  contact_nom text,
  contact_fonction text,
  telephone_fixe text,
  telephone_mobile text,
  email text,
  linkedin_url text,

  -- Qualification
  disponibilite text not null default 'horaires'
    check (disponibilite in ('24h24', 'horaires')),
  nb_avis_google integer not null default 0,
  note_google numeric(2, 1),
  taille_estimee text
    check (taille_estimee is null or taille_estimee in ('solo', 'petite_equipe', 'reseau')),
  priorite text not null default 'moyenne'
    check (priorite in ('haute', 'moyenne', 'basse')),
  tags text[] not null default '{}',
  source text,

  -- Suivi / pipeline
  statut text not null default 'a_contacter' check (statut in (
    'a_contacter',
    'pas_de_reponse',
    'a_rappeler',
    'interesse',
    'rdv_planifie',
    'rdv_effectue',
    'proposition_envoyee',
    'gagne',
    'refuse',
    'ne_plus_contacter'
  )),
  date_premier_contact date,
  date_dernier_contact date,
  nb_tentatives integer not null default 0,
  prochaine_action text,
  date_prochaine_action date,
  motif_refus text
    check (motif_refus is null or motif_refus in ('pas_le_temps', 'pas_interesse', 'deja_equipe', 'trop_cher', 'autre')),
  date_rdv timestamptz,
  type_rdv text
    check (type_rdv is null or type_rdv in ('telephone', 'visio', 'sur_place')),
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_prospects_statut on prospects (statut);
create index if not exists idx_prospects_departement on prospects (departement);
create index if not exists idx_prospects_date_prochaine_action on prospects (date_prochaine_action);
create index if not exists idx_prospects_priorite on prospects (priorite);

-- ---------------------------------------------------------------------
-- Table interactions (historique lié à un prospect)
-- ---------------------------------------------------------------------

create table if not exists interactions (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references prospects (id) on delete cascade,
  date_heure timestamptz not null default now(),
  type text not null check (type in ('appel', 'email', 'sms', 'linkedin', 'rdv')),
  resultat text,
  statut_avant text,
  statut_apres text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_interactions_prospect_id on interactions (prospect_id);
create index if not exists idx_interactions_date_heure on interactions (date_heure);

-- ---------------------------------------------------------------------
-- updated_at automatique sur prospects
-- ---------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_prospects_updated_at on prospects;
create trigger trg_prospects_updated_at
  before update on prospects
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security — réservé aux utilisateurs authentifiés
-- (usage mono-utilisateur pour l'instant, pas de notion de propriétaire)
-- ---------------------------------------------------------------------

alter table prospects enable row level security;
alter table interactions enable row level security;

drop policy if exists "authenticated manage prospects" on prospects;
create policy "authenticated manage prospects"
  on prospects
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated manage interactions" on interactions;
create policy "authenticated manage interactions"
  on interactions
  for all
  to authenticated
  using (true)
  with check (true);
