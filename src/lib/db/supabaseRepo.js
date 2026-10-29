import { supabase } from '../supabaseClient'
import { normalizePhone } from '../../utils/phone'

function unwrap({ data, error }) {
  if (error) throw error
  return data
}

// Lecture locale de la session (pas d'appel réseau, contrairement à
// auth.getUser()) pour tagger user_id sur chaque ligne créée — la RLS
// (auth.uid() = user_id) rejette de toute façon toute autre valeur.
async function currentUserId() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  const userId = data.session?.user?.id
  if (!userId) throw new Error('Utilisateur non authentifié.')
  return userId
}

export const supabaseRepo = {
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

    let query = supabase.from('prospects').select('*')

    if (search) {
      const q = search.replace(/[,%()]/g, ' ').trim()
      if (q) query = query.or(`nom.ilike.%${q}%,ville.ilike.%${q}%,contact_nom.ilike.%${q}%`)
    }
    if (statut && statut !== 'all') query = query.eq('statut', statut)
    if (departement && departement !== 'all') query = query.eq('departement', departement)
    if (ville && ville !== 'all') query = query.eq('ville', ville)
    if (metier && metier !== 'all') query = query.eq('metier', metier)
    if (priorite && priorite !== 'all') query = query.eq('priorite', priorite)
    if (dispo24Only) query = query.eq('disponibilite', '24h24')
    if (excludeStatuses?.length) query = query.not('statut', 'in', `(${excludeStatuses.join(',')})`)
    if (sortBy) query = query.order(sortBy, { ascending: sortDir !== 'desc', nullsFirst: false })

    return unwrap(await query)
  },

  async getProspect(id) {
    const { data, error } = await supabase.from('prospects').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },

  async createProspect(data) {
    const { user_id: _ignored, ...rest } = data
    const payload = {
      ...rest,
      user_id: await currentUserId(),
      telephone_fixe: normalizePhone(data.telephone_fixe) || null,
      telephone_mobile: normalizePhone(data.telephone_mobile) || null,
    }
    const result = await supabase.from('prospects').insert(payload).select().single()
    return unwrap(result)
  },

  async updateProspect(id, patch) {
    const { user_id: _ignored, ...payload } = patch
    if ('telephone_fixe' in payload) payload.telephone_fixe = normalizePhone(payload.telephone_fixe) || null
    if ('telephone_mobile' in payload) payload.telephone_mobile = normalizePhone(payload.telephone_mobile) || null
    const result = await supabase.from('prospects').update(payload).eq('id', id).select().single()
    return unwrap(result)
  },

  async deleteProspect(id) {
    const { error } = await supabase.from('prospects').delete().eq('id', id)
    if (error) throw error
  },

  async listInteractions(params = {}) {
    const { prospectId, since } = params
    let query = supabase.from('interactions').select('*').order('date_heure', { ascending: false })
    if (prospectId) query = query.eq('prospect_id', prospectId)
    if (since) query = query.gte('date_heure', since)
    return unwrap(await query)
  },

  async createInteraction(data) {
    const { user_id: _ignored, ...rest } = data
    const payload = { ...rest, user_id: await currentUserId() }
    const result = await supabase.from('interactions').insert(payload).select().single()
    return unwrap(result)
  },

  async findProspectsByPhones(phones) {
    const normalized = [...new Set(phones.map(normalizePhone).filter(Boolean))]
    if (normalized.length === 0) return []
    const list = normalized.join(',')
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .or(`telephone_mobile.in.(${list}),telephone_fixe.in.(${list})`)
    if (error) throw error
    return data
  },
}
