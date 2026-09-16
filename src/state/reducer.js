// Reducer pur : (état, action) -> nouvel état.
// Regroupe toute la logique de mutation des prospects / paiements / paramètres.

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_PROSPECT': {
      const prospect = { ...action.payload, id: makeId('p') }
      return { ...state, prospects: [prospect, ...state.prospects] }
    }

    case 'UPDATE_PROSPECT': {
      return {
        ...state,
        prospects: state.prospects.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      }
    }

    case 'DELETE_PROSPECT': {
      return {
        ...state,
        prospects: state.prospects.filter((p) => p.id !== action.payload.id),
      }
    }

    case 'MARK_RELANCE': {
      return {
        ...state,
        prospects: state.prospects.map((p) =>
          p.id === action.payload.id
            ? { ...p, statut: 'relance', dateContact: action.payload.date }
            : p
        ),
      }
    }

    case 'MOVE_PROSPECT_STATUS': {
      return {
        ...state,
        prospects: state.prospects.map((p) =>
          p.id === action.payload.id ? { ...p, statut: action.payload.statut } : p
        ),
      }
    }

    case 'ADD_PAYMENT': {
      const payment = { ...action.payload, id: makeId('pay') }
      return { ...state, payments: [payment, ...state.payments] }
    }

    case 'UPDATE_PAYMENT': {
      return {
        ...state,
        payments: state.payments.map((pay) =>
          pay.id === action.payload.id ? { ...pay, ...action.payload } : pay
        ),
      }
    }

    case 'DELETE_PAYMENT': {
      return {
        ...state,
        payments: state.payments.filter((pay) => pay.id !== action.payload.id),
      }
    }

    case 'UPDATE_SETTINGS': {
      return { ...state, settings: { ...state.settings, ...action.payload } }
    }

    default:
      return state
  }
}
