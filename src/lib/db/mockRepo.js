// Mode démo local : utilisé tant que VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY
// ne sont pas renseignées (voir src/lib/supabaseClient.js). Même interface que
// supabaseRepo.js, données persistées en localStorage pour la durée du test.
import { demoProspects, demoInteractions } from '../../utils/demoData'
import { makeId } from '../../utils/id'
import { normalizePhone } from '../../utils/phone'
import { MOCK_STORAGE_KEY } from '../../utils/constants'

function load() {
  try {
    const raw = window.localStorage.getItem(MOCK_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (error) {
    console.warn('Impossible de lire le mode démo local', error)
  }
  return { prospects: demoProspects, interactions: demoInteractions }
}

let state = load()

function persist() {
  try {
    window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn("Impossible d'écrire le mode démo local", error)
  }
}

function matchesSearch(p, query) {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    p.nom?.toLowerCase().includes(q) ||
    p.ville?.toLowerCase().includes(q) ||
    p.contact_nom?.toLowerCase().includes(q)
  )
}

function compareValues(a, b, dir) {
  const factor = dir === 'desc' ? -1 : 1
  if (a == null && b == null) return 0
  if (a == null) return 1 // nulls last regardless of direction
  if (b == null) return -1
  if (a < b) return -1 * factor
  if (a > b) return 1 * factor
  return 0
}

export const mockRepo = {
  async listProspects(params = {}) {
    const {
      search,
      statut,
      departement,
      ville,
      metier,
      priorite,
      dispo24Only,
      excludeStatuses,
      sortBy,
      sortDir = 'asc',
    } = params

    let rows = state.prospects.filter((p) => matchesSearch(p, search))
    if (statut && statut !== 'all') rows = rows.filter((p) => p.statut === statut)
    if (departement && departement !== 'all') rows = rows.filter((p) => p.departement === departement)
    if (ville && ville !== 'all') rows = rows.filter((p) => p.ville === ville)
    if (metier && metier !== 'all') rows = rows.filter((p) => p.metier === metier)
    if (priorite && priorite !== 'all') rows = rows.filter((p) => p.priorite === priorite)
    if (dispo24Only) rows = rows.filter((p) => p.disponibilite === '24h24')
    if (excludeStatuses?.length) rows = rows.filter((p) => !excludeStatuses.includes(p.statut))

    if (sortBy) {
      rows = [...rows].sort((a, b) => compareValues(a[sortBy], b[sortBy], sortDir))
    }
    return rows
  },

  async getProspect(id) {
    return state.prospects.find((p) => p.id === id) || null
  },

  async createProspect(data) {
    const now = new Date().toISOString()
    const prospect = {
      nb_tentatives: 0,
      tags: [],
      ...data,
      telephone_fixe: normalizePhone(data.telephone_fixe) || null,
      telephone_mobile: normalizePhone(data.telephone_mobile) || null,
      id: makeId('p'),
      created_at: now,
      updated_at: now,
    }
    state = { ...state, prospects: [prospect, ...state.prospects] }
    persist()
    return prospect
  },

  async updateProspect(id, patch) {
    const normalizedPatch = { ...patch }
    if ('telephone_fixe' in normalizedPatch) normalizedPatch.telephone_fixe = normalizePhone(normalizedPatch.telephone_fixe) || null
    if ('telephone_mobile' in normalizedPatch) normalizedPatch.telephone_mobile = normalizePhone(normalizedPatch.telephone_mobile) || null
    let updated = null
    state = {
      ...state,
      prospects: state.prospects.map((p) => {
        if (p.id !== id) return p
        updated = { ...p, ...normalizedPatch, updated_at: new Date().toISOString() }
        return updated
      }),
    }
    persist()
    return updated
  },

  async deleteProspect(id) {
    state = {
      ...state,
      prospects: state.prospects.filter((p) => p.id !== id),
      interactions: state.interactions.filter((i) => i.prospect_id !== id),
    }
    persist()
  },

  async listInteractions(params = {}) {
    const { prospectId, since } = params
    let rows = state.interactions
    if (prospectId) rows = rows.filter((i) => i.prospect_id === prospectId)
    if (since) rows = rows.filter((i) => i.date_heure >= since)
    return [...rows].sort((a, b) => (a.date_heure < b.date_heure ? 1 : -1))
  },

  async createInteraction(data) {
    const interaction = {
      date_heure: new Date().toISOString(),
      ...data,
      id: makeId('int'),
    }
    state = { ...state, interactions: [interaction, ...state.interactions] }
    persist()
    return interaction
  },

  async findProspectsByPhones(phones) {
    const set = new Set(phones.map(normalizePhone).filter(Boolean))
    if (set.size === 0) return []
    return state.prospects.filter(
      (p) => set.has(normalizePhone(p.telephone_mobile)) || set.has(normalizePhone(p.telephone_fixe))
    )
  },
}
