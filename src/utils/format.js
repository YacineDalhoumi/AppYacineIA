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

export function formatDateTime(isoDateTime) {
  if (!isoDateTime) return '—'
  const date = new Date(isoDateTime)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(isoDateTime) {
  if (!isoDateTime) return '—'
  const date = new Date(isoDateTime)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function nowIso() {
  return new Date().toISOString()
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

export function isToday(isoDate, referenceIso = todayIso()) {
  if (!isoDate) return false
  return isoDate.slice(0, 10) === referenceIso
}

// Semaine en cours (lundi -> dimanche), au format { fromIso, toIso }.
export function getWeekRange(referenceIso = todayIso()) {
  const date = new Date(`${referenceIso}T00:00:00`)
  const day = date.getDay() // 0 = dimanche .. 6 = samedi
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diffToMonday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { fromIso: monday.toISOString().slice(0, 10), toIso: sunday.toISOString().slice(0, 10) }
}

// Pour un <input type="datetime-local">, qui attend/retourne un format local
// sans fuseau ("YYYY-MM-DDTHH:mm"), à convertir vers/depuis un ISO complet.
export function toDatetimeLocal(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocal(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
