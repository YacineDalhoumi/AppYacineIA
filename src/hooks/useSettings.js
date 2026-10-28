import { useEffect, useState } from 'react'
import { UI_STORAGE_KEY } from '../utils/constants'

// Préférences d'interface (pas des données métier) : nom affiché et seuil
// de relance par défaut. Stockées en localStorage, indépendamment de
// Supabase/du mode démo.
const DEFAULT_SETTINGS = { userName: 'Yacine', relanceThresholdDays: 7 }

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = window.localStorage.getItem(UI_STORAGE_KEY)
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
    } catch (error) {
      console.warn('Impossible de lire les préférences locales', error)
    }
    return DEFAULT_SETTINGS
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.warn("Impossible d'écrire les préférences locales", error)
    }
  }, [settings])

  function updateSettings(patch) {
    setSettings((prev) => ({ ...prev, ...patch }))
  }

  return { settings, updateSettings }
}
