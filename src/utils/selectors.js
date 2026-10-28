import { STATUTS_EXCLUS_RELANCE } from './constants'
import { todayIso, isOverdue, isToday } from './format'

const PRIORITY_RANK = { haute: 0, moyenne: 1, basse: 2 }

// File d'appel de la Session d'appels : prospects "à contacter" ou "à rappeler"
// dont la prochaine action est due (aujourd'hui ou en retard), triés par
// priorité puis par ancienneté. Exclut toujours les statuts terminaux.
export function getCallQueue(prospects, referenceIso = todayIso()) {
  return prospects
    .filter((p) => p.statut === 'a_contacter' || p.statut === 'a_rappeler')
    .filter((p) => !p.date_prochaine_action || p.date_prochaine_action <= referenceIso)
    .sort((a, b) => {
      const prioDiff = (PRIORITY_RANK[a.priorite] ?? 1) - (PRIORITY_RANK[b.priorite] ?? 1)
      if (prioDiff !== 0) return prioDiff
      const aDate = a.date_prochaine_action || referenceIso
      const bDate = b.date_prochaine_action || referenceIso
      return aDate < bDate ? -1 : aDate > bDate ? 1 : 0
    })
}

export function getOverdueProspects(prospects, referenceIso = todayIso()) {
  return prospects.filter(
    (p) =>
      !STATUTS_EXCLUS_RELANCE.includes(p.statut) &&
      p.date_prochaine_action &&
      isOverdue(p.date_prochaine_action, referenceIso)
  )
}

export function getTodayRappels(prospects, referenceIso = todayIso()) {
  return prospects.filter(
    (p) => !STATUTS_EXCLUS_RELANCE.includes(p.statut) && isToday(p.date_prochaine_action, referenceIso)
  )
}

export function getRdvInRange(prospects, fromIso, toIso) {
  return prospects
    .filter((p) => p.date_rdv && p.date_rdv.slice(0, 10) >= fromIso && p.date_rdv.slice(0, 10) <= toIso)
    .sort((a, b) => (a.date_rdv < b.date_rdv ? -1 : 1))
}
