import { createClient } from '@supabase/supabase-js'

// Client Supabase unique, réutilisé dans toute l'app (voir src/lib/db/supabaseRepo.js
// et src/state/AuthContext.jsx) — jamais recréé ailleurs.
// Variables Vite (préfixe VITE_ obligatoire pour être exposées au client) :
// VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY, définies dans .env.local
// (non versionné). La clé "publishable" (ex-"anon public") est faite pour
// être exposée côté client — ne jamais y mettre la clé service_role.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Tant que .env.local n'est pas renseigné, l'app tourne en mode démo local
// (src/lib/db/mockRepo.js) au lieu de planter : pratique pour explorer
// l'interface avant d'avoir branché Supabase.
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null
