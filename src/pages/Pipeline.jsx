import { useState } from 'react'
import { useProspects } from '../hooks/useProspects'
import { applyStatusChange } from '../lib/db/actions'
import { PROSPECT_STATUSES, PROSPECT_STATUS_LABELS, PROSPECT_STATUS_COLORS } from '../utils/constants'
import { formatDate, initials } from '../utils/format'

const COLOR_VARS = {
  accent: 'var(--color-accent)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  rdv: 'var(--color-rdv)',
  danger: 'var(--color-danger)',
  neutral: 'var(--color-neutral)',
}

export default function Pipeline({ onOpenProspect }) {
  const { prospects, reload } = useProspects({})

  const [draggedId, setDraggedId] = useState(null)
  const [dragOverStatus, setDragOverStatus] = useState(null)
  const [moving, setMoving] = useState(false)

  async function handleDrop(status) {
    const prospect = prospects.find((p) => p.id === draggedId)
    setDraggedId(null)
    setDragOverStatus(null)
    if (!prospect || prospect.statut === status || moving) return

    setMoving(true)
    try {
      await applyStatusChange({
        prospectId: prospect.id,
        statutAvant: prospect.statut,
        statutApres: status,
        type: 'appel',
        resultat: PROSPECT_STATUS_LABELS[status],
      })
      reload()
    } finally {
      setMoving(false)
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Pipeline</h1>
          <p>Glissez une carte vers une autre colonne pour changer son statut (interaction journalisée automatiquement).</p>
        </div>
      </div>

      <div className="kanban-board">
        {PROSPECT_STATUSES.map((status) => {
          const items = prospects.filter((p) => p.statut === status)
          const color = COLOR_VARS[PROSPECT_STATUS_COLORS[status]]
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
                  <span className="badge-dot" style={{ color, display: 'inline-block' }} />
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
                    onClick={() => onOpenProspect(p.id)}
                  >
                    <div className="kanban-card-title">{p.nom}</div>
                    <div className="kanban-card-company">
                      {p.ville}
                      {p.departement ? ` (${p.departement})` : ''}
                    </div>
                    <div className="kanban-card-footer">
                      <span className="list-row-avatar" style={{ width: 26, height: 26, fontSize: 11 }}>
                        {initials(p.nom)}
                      </span>
                      <span className="kanban-card-date">{formatDate(p.date_prochaine_action)}</span>
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
