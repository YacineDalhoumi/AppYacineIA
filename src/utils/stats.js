import { daysBetween, todayIso } from './format'

function withinLastDays(dateIso, days, referenceIso) {
  if (!dateIso) return false
  const diff = daysBetween(dateIso.slice(0, 10), referenceIso)
  return diff >= 0 && diff < days
}

export function countCallsInLastDays(interactions, days, referenceIso = todayIso()) {
  return interactions.filter((i) => i.type === 'appel' && withinLastDays(i.date_heure, days, referenceIso)).length
}

// Appels aboutis (quelqu'un a décroché) / total appels, sur la période.
// Un appel est considéré "aboutis" dès lors que son résultat n'est pas
// "pas de réponse" — cohérent avec les boutons de la Session d'appels.
export function tauxJoignabilite(interactions, days, referenceIso = todayIso()) {
  const calls = interactions.filter((i) => i.type === 'appel' && withinLastDays(i.date_heure, days, referenceIso))
  if (calls.length === 0) return 0
  const reached = calls.filter((i) => i.statut_apres && i.statut_apres !== 'pas_de_reponse').length
  return Math.round((reached / calls.length) * 100)
}

export function countRdvObtenus(interactions, days, referenceIso = todayIso()) {
  return interactions.filter((i) => i.statut_apres === 'rdv_planifie' && withinLastDays(i.date_heure, days, referenceIso))
    .length
}

export function conversionFunnel(interactions, prospects) {
  const totalAppels = interactions.filter((i) => i.type === 'appel').length
  const totalRdv = interactions.filter((i) => i.statut_apres === 'rdv_planifie').length
  const totalClients = prospects.filter((p) => p.statut === 'gagne').length
  return {
    totalAppels,
    totalRdv,
    totalClients,
    appelToRdv: totalAppels ? Math.round((totalRdv / totalAppels) * 100) : 0,
    rdvToClient: totalRdv ? Math.round((totalClients / totalRdv) * 100) : 0,
  }
}

export function repartitionParStatut(prospects) {
  const counts = {}
  prospects.forEach((p) => {
    counts[p.statut] = (counts[p.statut] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

export function repartitionParDepartement(prospects) {
  const counts = {}
  prospects.forEach((p) => {
    const key = p.departement || '—'
    counts[key] = (counts[key] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

export function topMotifsRefus(prospects) {
  const counts = {}
  prospects
    .filter((p) => p.statut === 'refuse' && p.motif_refus)
    .forEach((p) => {
      counts[p.motif_refus] = (counts[p.motif_refus] || 0) + 1
    })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}
