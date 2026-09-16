// Statuts possibles pour un prospect, dans l'ordre du pipeline commercial
export const PROSPECT_STATUSES = [
  'a_contacter',
  'contacte',
  'relance',
  'rdv_pris',
  'converti',
  'perdu',
]

export const PROSPECT_STATUS_LABELS = {
  a_contacter: 'À contacter',
  contacte: 'Contacté',
  relance: 'Relancé',
  rdv_pris: 'RDV pris',
  converti: 'Converti',
  perdu: 'Perdu',
}

// Couleurs (var CSS) associées à chaque statut de prospect
export const PROSPECT_STATUS_COLORS = {
  a_contacter: 'neutral',
  contacte: 'accent',
  relance: 'warning',
  rdv_pris: 'rdv',
  converti: 'success',
  perdu: 'danger',
}

export const CANALS = ['LinkedIn', 'Email', 'Téléphone', 'Autre']

export const PAYMENT_STATUSES = ['en_attente', 'paye', 'en_retard', 'annule']

export const PAYMENT_STATUS_LABELS = {
  en_attente: 'En attente',
  paye: 'Payé',
  en_retard: 'En retard',
  annule: 'Annulé',
}

export const PAYMENT_STATUS_COLORS = {
  en_attente: 'warning',
  paye: 'success',
  en_retard: 'danger',
  annule: 'neutral',
}

export const PAYMENT_METHODS = ['Virement', 'CB', 'Chèque', 'Espèces']

export const SECTORS = ['BTP', 'Hôtellerie', 'Santé', 'Automobile', 'Immobilier', 'Autre']

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'tasks', label: 'Tâches', icon: 'tasks' },
  { key: 'prospects', label: 'Prospects', icon: 'prospects' },
  { key: 'pipeline', label: 'Pipeline', icon: 'pipeline' },
  { key: 'payments', label: 'Paiements', icon: 'payments' },
  { key: 'settings', label: 'Paramètres', icon: 'settings' },
]

export const STORAGE_KEY = 'yacine-app-state-v1'
