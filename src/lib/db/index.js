import { isSupabaseConfigured } from '../supabaseClient'
import { supabaseRepo } from './supabaseRepo'
import { mockRepo } from './mockRepo'

// Même interface des deux côtés (listProspects, getProspect, createProspect,
// updateProspect, deleteProspect, listInteractions, createInteraction,
// findProspectsByPhones) — voir supabaseRepo.js / mockRepo.js.
export const db = isSupabaseConfigured ? supabaseRepo : mockRepo
