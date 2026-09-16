import { computeEffectiveStatus, daysBetween, todayIso } from './format'

// Un prospect "actif" (ni converti, ni perdu) dont le dernier contact
// remonte à plus de `thresholdDays` jours doit être relancé.
export function needsRelance(prospect, thresholdDays, referenceIso = todayIso()) {
  if (prospect.statut === 'converti' || prospect.statut === 'perdu') return false
  return daysBetween(prospect.dateContact, referenceIso) >= thresholdDays
}

export function getProspectsToRelance(prospects, thresholdDays) {
  return prospects
    .filter((p) => needsRelance(p, thresholdDays))
    .sort((a, b) => new Date(a.dateContact) - new Date(b.dateContact))
}

export function getOverduePayments(payments) {
  return payments.filter((pay) => computeEffectiveStatus(pay) === 'en_retard')
}

export function sumPayments(payments, statut) {
  return payments
    .filter((pay) => computeEffectiveStatus(pay) === statut)
    .reduce((total, pay) => total + Number(pay.montant || 0), 0)
}

export function conversionRate(prospects) {
  if (prospects.length === 0) return 0
  const converted = prospects.filter((p) => p.statut === 'converti').length
  return Math.round((converted / prospects.length) * 100)
}
