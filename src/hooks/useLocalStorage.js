import { useEffect, useState } from 'react'

// Persiste un state React dans le localStorage sous une clé donnée.
// `initialValue` peut être une valeur ou une fonction (calculée une seule fois).
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) return JSON.parse(stored)
    } catch (error) {
      console.warn(`Impossible de lire "${key}" dans le localStorage`, error)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Impossible d'écrire "${key}" dans le localStorage`, error)
    }
  }, [key, value])

  return [value, setValue]
}
