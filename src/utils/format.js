export function formatCurrency(amount, currency = '€') {
  const value = Number(amount) || 0
  const formatted = value.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return currency === '€' ? `${formatted} €` : `${formatted} ${currency}`
}

export function formatDate(isoDate) {
  if (!isoDate) return '—'
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function daysBetween(fromIso, toIso) {
  const from = new Date(fromIso)
  const to = new Date(toIso)
  const ms = to.getTime() - from.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export function isOverdue(dueIso, referenceIso = todayIso()) {
  if (!dueIso) return false
  return daysBetween(referenceIso, dueIso) < 0
}

// Statut "réel" d'un paiement : si l'échéance est dépassée et qu'il n'a
// été ni payé ni annulé, il est considéré en retard quel que soit le
// statut enregistré (couvre les paiements créés avant que l'échéance passe).
export function computeEffectiveStatus(payment, referenceIso = todayIso()) {
  if (payment.statut === 'paye' || payment.statut === 'annule') return payment.statut
  if (isOverdue(payment.dateEcheance, referenceIso) && !payment.datePaiement) return 'en_retard'
  return payment.statut
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
