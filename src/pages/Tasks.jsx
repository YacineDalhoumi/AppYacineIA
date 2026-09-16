import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import { useApp } from '../state/AppContext'
import { IconCheck, IconInbox } from '../components/Icons'
import { formatDate, initials, daysBetween, todayIso } from '../utils/format'
import { getProspectsToRelance } from '../utils/selectors'
import { PROSPECT_STATUS_COLORS, PROSPECT_STATUS_LABELS } from '../utils/constants'

export default function Tasks() {
  const { state, dispatch } = useApp()
  const { prospects, settings } = state

  const relances = getProspectsToRelance(prospects, settings.relanceThresholdDays)

  function markRelance(prospect) {
    dispatch({
      type: 'MARK_RELANCE',
      payload: { id: prospect.id, date: todayIso() },
    })
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Tâches</h1>
          <p>
            Prospects à relancer (dernier contact il y a plus de {settings.relanceThresholdDays} jours).
          </p>
        </div>
      </div>

      <div className="card">
        {relances.length === 0 ? (
          <EmptyState
            title="Aucune relance à faire"
            message="Tous vos prospects actifs ont été contactés récemment."
            icon={<IconInbox size={20} />}
          />
        ) : (
          relances.map((p) => (
            <div className="list-row" key={p.id}>
              <div className="list-row-main">
                <span className="list-row-avatar">{initials(p.nom)}</span>
                <div>
                  <div className="list-row-title">{p.nom}</div>
                  <div className="list-row-sub">
                    {p.entreprise} · {p.secteur} · Dernier contact le {formatDate(p.dateContact)} (
                    {daysBetween(p.dateContact, todayIso())} j)
                  </div>
                </div>
              </div>
              <div className="list-row-meta">
                <Badge label={PROSPECT_STATUS_LABELS[p.statut]} color={PROSPECT_STATUS_COLORS[p.statut]} />
                <button type="button" className="btn btn-primary btn-sm" onClick={() => markRelance(p)}>
                  <IconCheck size={14} />
                  Marquer relancé
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
