import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { appReducer } from './reducer'
import { demoProspects, demoPayments } from '../utils/demoData'
import { STORAGE_KEY } from '../utils/constants'

const AppContext = createContext(null)

const initialState = () => ({
  prospects: demoProspects,
  payments: demoPayments,
  settings: {
    userName: 'Yacine',
    relanceThresholdDays: 7,
    currency: '€',
  },
})

export function AppProvider({ children }) {
  const [state, setState] = useLocalStorage(STORAGE_KEY, initialState)

  const dispatch = useCallback(
    (action) => setState((prev) => appReducer(prev, action)),
    [setState]
  )

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp doit être utilisé à l\'intérieur de <AppProvider>')
  return ctx
}
