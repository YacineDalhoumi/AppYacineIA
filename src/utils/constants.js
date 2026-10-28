// Pipeline de prospection, dans l'ordre d'avancement.
// "ne_plus_contacter" = opposition RGPD : exclu de toutes les listes d'appel.
export const PROSPECT_STATUSES = [
  'a_contacter',
  'pas_de_reponse',
  'a_rappeler',
  'interesse',
  'rdv_planifie',
  'rdv_effectue',
  'proposition_envoyee',
  'gagne',
  'refuse',
  'ne_plus_contacter',
]

export const PROSPECT_STATUS_LABELS = {
  a_contacter: 'À contacter',
  pas_de_reponse: 'Pas de réponse',
  a_rappeler: 'À rappeler',
  interesse: 'Intéressé',
  rdv_planifie: 'RDV planifié',
  rdv_effectue: 'RDV effectué',
  proposition_envoyee: 'Proposition envoyée',
  gagne: 'Gagné (client)',
  refuse: 'Refusé',
  ne_plus_contacter: 'Ne plus contacter',
}

// Couleurs (tokens du design system) associées à chaque statut
export const PROSPECT_STATUS_COLORS = {
  a_contacter: 'neutral',
  pas_de_reponse: 'neutral',
  a_rappeler: 'warning',
  interesse: 'accent',
  rdv_planifie: 'rdv',
  rdv_effectue: 'rdv',
  proposition_envoyee: 'accent',
  gagne: 'success',
  refuse: 'danger',
  ne_plus_contacter: 'danger',
}

// Statuts qui ne doivent plus jamais apparaître dans une file d'appel
export const STATUTS_EXCLUS_RELANCE = ['gagne', 'refuse', 'ne_plus_contacter']

export const METIERS = ['serrurier', 'plombier', 'vitrier', 'electricien', 'multi_metiers', 'autre']

export const METIER_LABELS = {
  serrurier: 'Serrurier',
  plombier: 'Plombier',
  vitrier: 'Vitrier',
  electricien: 'Électricien',
  multi_metiers: 'Multi-métiers',
  autre: 'Autre',
}

export const SOURCES_SUGGESTIONS = [
  'Google Maps',
  'Pages Jaunes',
  'LinkedIn',
  'Recommandation',
  'Appel à froid',
  'Site web',
]

export const DISPONIBILITES = ['24h24', 'horaires']

export const DISPONIBILITE_LABELS = {
  '24h24': '24h/24',
  horaires: 'Horaires',
}

export const TAILLES_ESTIMEES = ['solo', 'petite_equipe', 'reseau']

export const TAILLE_LABELS = {
  solo: 'Solo',
  petite_equipe: 'Petite équipe',
  reseau: 'Réseau / multi-agences',
}

export const PRIORITES = ['haute', 'moyenne', 'basse']

export const PRIORITE_LABELS = {
  haute: 'Haute',
  moyenne: 'Moyenne',
  basse: 'Basse',
}

export const PRIORITE_COLORS = {
  haute: 'danger',
  moyenne: 'warning',
  basse: 'neutral',
}

export const TYPES_RDV = ['telephone', 'visio', 'sur_place']

export const TYPE_RDV_LABELS = {
  telephone: 'Téléphone',
  visio: 'Visio',
  sur_place: 'Sur place',
}

export const MOTIFS_REFUS = ['pas_le_temps', 'pas_interesse', 'deja_equipe', 'trop_cher', 'autre']

export const MOTIF_REFUS_LABELS = {
  pas_le_temps: 'Pas le temps',
  pas_interesse: 'Pas intéressé',
  deja_equipe: 'Déjà équipé',
  trop_cher: 'Trop cher',
  autre: 'Autre',
}

export const TYPES_INTERACTION = ['appel', 'email', 'sms', 'linkedin', 'rdv']

export const TYPE_INTERACTION_LABELS = {
  appel: 'Appel',
  email: 'Email',
  sms: 'SMS',
  linkedin: 'LinkedIn',
  rdv: 'RDV',
}

// Départements historiquement ciblés (Île-de-France) — suggestions dans les
// formulaires, la liste réelle de filtres se construit depuis les données.
export const DEPARTEMENTS_IDF_SUGGESTIONS = ['75', '77', '78', '91', '92', '93', '94', '95']

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'dashboard' },
  { key: 'today', label: 'À faire', icon: 'tasks' },
  { key: 'callSession', label: "Session d'appels", icon: 'phone' },
  { key: 'prospects', label: 'Prospects', icon: 'prospects' },
  { key: 'pipeline', label: 'Pipeline', icon: 'pipeline' },
  { key: 'settings', label: 'Paramètres', icon: 'settings' },
]

export const MOCK_STORAGE_KEY = 'yacine-crm-mock-v1'
export const UI_STORAGE_KEY = 'yacine-crm-ui-v1'
