import { useCallback, useEffect, useState } from 'react'
import { db } from '../lib/db'

// Charge et filtre les prospects via la couche d'accès aux données (Supabase
// ou mode démo local, voir src/lib/db). `params` est un objet stable
// (recréé seulement quand les filtres changent) passé tel quel à db.listProspects.
export function useProspects(params) {
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  const paramsKey = JSON.stringify(params || {})

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    db.listProspects(params)
      .then((rows) => {
        if (!cancelled) setProspects(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, reloadToken])

  const reload = useCallback(() => setReloadToken((t) => t + 1), [])

  const createProspect = useCallback(
    async (data) => {
      const created = await db.createProspect(data)
      reload()
      return created
    },
    [reload]
  )

  const updateProspect = useCallback(
    async (id, patch) => {
      const updated = await db.updateProspect(id, patch)
      reload()
      return updated
    },
    [reload]
  )

  const deleteProspect = useCallback(
    async (id) => {
      await db.deleteProspect(id)
      reload()
    },
    [reload]
  )

  return { prospects, loading, error, reload, createProspect, updateProspect, deleteProspect }
}

export async function fetchProspect(id) {
  return db.getProspect(id)
}

// Charge un prospect unique (fiche prospect) avec update/delete dédiés.
export function useProspect(id) {
  const [prospect, setProspect] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return undefined
    }
    let cancelled = false
    setLoading(true)
    db.getProspect(id)
      .then((row) => {
        if (!cancelled) setProspect(row)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, reloadToken])

  const reload = useCallback(() => setReloadToken((t) => t + 1), [])

  const save = useCallback(
    async (patch) => {
      const updated = await db.updateProspect(id, patch)
      setProspect(updated)
      return updated
    },
    [id]
  )

  const remove = useCallback(async () => {
    await db.deleteProspect(id)
  }, [id])

  return { prospect, loading, error, reload, save, remove }
}
