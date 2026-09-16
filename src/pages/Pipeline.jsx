import { useState } from 'react'
import { useApp } from '../state/AppContext'
import { PROSPECT_STATUSES, PROSPECT_STATUS_LABELS } from '../utils/constants'
import { formatDate, initials } from '../utils/format'

const DOT_COLORS = {
  a_contacter: 'var(--color-neutral)',
  contacte: 'var(--color-accent)',
  relance: 'var(--color-warning)',
  rdv_pris: 'var(--color-rdv)',
  converti: 'var(--color-success)',
  perdu: 'var(--color-danger)',
}

export default function Pipeline() {
  const { state, dispatch } = useApp()
  const { prospects } = state

  const [draggedId, setDraggedId] = useState(null)
  const [dragOverStatus, setDragOverStatus] = useState(null)

  function handleDrop(status) {
    if (draggedId) {
      dispatch({ type: 'MOVE_PROSPECT_STATUS', payload: { id: draggedId, statut: status } })
    }
    setDraggedId(null)
    setDragOverStatus(null)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Pipeline</h1>
          <p>Glissez une carte vers une autre colonne pour changer son statut.</p>
        </div>
      </div>

      <div className="kanban-board">
        {PROSPECT_STATUSES.map((status) => {
          const items = prospects.filter((p) => p.statut === status)
          return (
            <div
              key={status}
              className={`kanban-column${dragOverStatus === status ? ' is-drag-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverStatus(status)
              }}
              onDragLeave={() => setDragOverStatus((prev) => (prev === status ? null : prev))}
              onDrop={(e) => {
                e.preventDefault()
                handleDrop(status)
              }}
            >
              <div className="kanban-column-header">
                <span className="kanban-column-title">
                  <span
                    className="badge-dot"
                    style={{ color: DOT_COLORS[status], display: 'inline-block' }}
                  />
                  {PROSPECT_STATUS_LABELS[status]}
                </span>
                <span className="kanban-column-count">{items.length}</span>
              </div>
              <div className="kanban-column-body">
                {items.map((p) => (
                  <div
                    key={p.id}
                    className={`kanban-card${draggedId === p.id ? ' is-dragging' : ''}`}
                    draggable
                    onDragStart={() => setDraggedId(p.id)}
                    onDragEnd={() => {
                      setDraggedId(null)
                      setDragOverStatus(null)
                    }}
                  >
                    <div className="kanban-card-title">{p.nom}</div>
                    <div className="kanban-card-company">{p.entreprise}</div>
                    <div className="kanban-card-footer">
                      <span className="list-row-avatar" style={{ width: 26, height: 26, fontSize: 11 }}>
                        {initials(p.nom)}
                      </span>
                      <span className="kanban-card-date">{formatDate(p.dateContact)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
