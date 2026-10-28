import { useCallback, useEffect, useState } from 'react'
import { db } from '../lib/db'

// Historique des interactions d'un prospect, trié du plus récent au plus ancien.
export function useInteractions(prospectId) {
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!prospectId) {
      setInteractions([])
      setLoading(false)
      return undefined
    }
    let cancelled = false
    setLoading(true)
    db.listInteractions({ prospectId })
      .then((rows) => {
        if (!cancelled) setInteractions(rows)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [prospectId, reloadToken])

  const reload = useCallback(() => setReloadToken((t) => t + 1), [])

  const addInteraction = useCallback(
    async (data) => {
      const created = await db.createInteraction({ prospect_id: prospectId, ...data })
      reload()
      return created
    },
    [prospectId, reload]
  )

  return { interactions, loading, reload, addInteraction }
}

// Toutes les interactions, tous prospects confondus — pour les KPIs du
// tableau de bord (nb d'appels, taux de joignabilité, conversion...).
export function useAllInteractions() {
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    db.listInteractions({})
      .then((rows) => {
        if (!cancelled) setInteractions(rows)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { interactions, loading }
}
