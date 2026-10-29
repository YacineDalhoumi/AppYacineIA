-- Yacine CRM — schéma initial (prospects + interactions), multi-utilisateur.
-- À coller dans Supabase : Project > SQL Editor > New query > Run.
-- (Alternative CLI : `supabase link --project-ref <ref>` puis `supabase db push`.)
-- Idempotent : peut être relancé sans dupliquer les objets.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Table prospects
-- ---------------------------------------------------------------------

create table if not exists prospects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

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

-- Si une version antérieure de la table existait déjà sans user_id
-- (ancien schéma mono-utilisateur) : ajoute la colonne sans bloquer.
-- Il faudra alors backfiller manuellement user_id sur les lignes existantes
-- avant de pouvoir activer la contrainte NOT NULL (voir note en bas de fichier).
alter table prospects add column if not exists user_id uuid references auth.users (id) on delete cascade;

create index if not exists idx_prospects_user_id on prospects (user_id);
create index if not exists idx_prospects_statut on prospects (statut);
create index if not exists idx_prospects_departement on prospects (departement);
create index if not exists idx_prospects_date_prochaine_action on prospects (date_prochaine_action);
create index if not exists idx_prospects_priorite on prospects (priorite);

-- ---------------------------------------------------------------------
-- Table interactions (historique lié à un prospect)
-- ---------------------------------------------------------------------

create table if not exists interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  prospect_id uuid not null references prospects (id) on delete cascade,
  date_heure timestamptz not null default now(),
  type text not null check (type in ('appel', 'email', 'sms', 'linkedin', 'rdv')),
  resultat text,
  statut_avant text,
  statut_apres text,
  note text,
  created_at timestamptz not null default now()
);

alter table interactions add column if not exists user_id uuid references auth.users (id) on delete cascade;

create index if not exists idx_interactions_user_id on interactions (user_id);
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
-- Row Level Security — chaque utilisateur ne voit/modifie que ses lignes
-- ---------------------------------------------------------------------

alter table prospects enable row level security;
alter table interactions enable row level security;

drop policy if exists "authenticated manage prospects" on prospects;
drop policy if exists "users manage own prospects" on prospects;
create policy "users manage own prospects"
  on prospects
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "authenticated manage interactions" on interactions;
drop policy if exists "users manage own interactions" on interactions;
create policy "users manage own interactions"
  on interactions
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- NOTE : passage à NOT NULL sur user_id
-- ---------------------------------------------------------------------
-- Sur un projet neuf (tables créées directement par ce script), user_id
-- est déjà NOT NULL ci-dessus. Si tu migres depuis l'ancien schéma
-- mono-utilisateur et que des lignes existent déjà sans user_id, ce script
-- les laisse nullable pour ne pas échouer. Une fois les lignes existantes
-- rattachées à un utilisateur (voir migration de seed pour l'exemple avec
-- auth.users), exécute :
--   alter table prospects alter column user_id set not null;
--   alter table interactions alter column user_id set not null;
