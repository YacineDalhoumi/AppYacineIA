import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import { useProspects } from '../hooks/useProspects'
import { useSettings } from '../hooks/useSettings'
import { getTodayRappels, getRdvInRange, getOverdueProspects } from '../utils/selectors'
import { formatDate, formatDateTime, todayIso, getWeekRange, initials } from '../utils/format'
import { IconInbox, IconCalendar, IconClockAlert } from '../components/Icons'
import { PROSPECT_STATUS_LABELS, PROSPECT_STATUS_COLORS } from '../utils/constants'

function ProspectRow({ p, meta, onOpen }) {
  return (
    <div className="list-row">
      <div className="list-row-main">
        <span className="list-row-avatar">{initials(p.nom)}</span>
        <div>
          <div className="list-row-title">{p.nom}</div>
          <div className="list-row-sub">{meta}</div>
        </div>
      </div>
      <div className="list-row-meta">
        <Badge label={PROSPECT_STATUS_LABELS[p.statut]} color={PROSPECT_STATUS_COLORS[p.statut]} />
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onOpen(p.id)}>
          Voir
        </button>
      </div>
    </div>
  )
}

export default function Today({ onOpenProspect }) {
  const { prospects } = useProspects({})
  const { settings } = useSettings()
  const today = todayIso()
  const { fromIso, toIso } = getWeekRange(today)

  const rappels = getTodayRappels(prospects, today)
  const rdvToday = getRdvInRange(prospects, today, today)
  const rdvWeek = getRdvInRange(prospects, fromIso, toIso)
  const overdue = getOverdueProspects(prospects, today, settings.relanceThresholdDays)

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>À faire aujourd'hui</h1>
          <p>Rappels du jour, rendez-vous à venir et prospects en retard.</p>
        </div>
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-title-row">
            <h3>Rappels du jour</h3>
          </div>
          {rappels.length === 0 ? (
            <EmptyState title="Aucun rappel aujourd'hui" icon={<IconInbox size={20} />} />
          ) : (
            rappels.map((p) => (
              <ProspectRow key={p.id} p={p} meta={p.prochaine_action || 'Rappel prévu'} onOpen={onOpenProspect} />
            ))
          )}
        </div>

        <div className="card">
          <div className="card-title-row">
            <h3>Prospects en retard</h3>
          </div>
          {overdue.length === 0 ? (
            <EmptyState title="Rien en retard" icon={<IconClockAlert size={20} />} />
          ) : (
            overdue.map((p) => (
              <ProspectRow
                key={p.id}
                p={p}
                meta={`Prévu le ${formatDate(p.date_prochaine_action)}`}
                onOpen={onOpenProspect}
              />
            ))
          )}
        </div>

        <div className="card">
          <div className="card-title-row">
            <h3>RDV aujourd'hui</h3>
          </div>
          {rdvToday.length === 0 ? (
            <EmptyState title="Aucun RDV aujourd'hui" icon={<IconCalendar size={20} />} />
          ) : (
            rdvToday.map((p) => <ProspectRow key={p.id} p={p} meta={formatDateTime(p.date_rdv)} onOpen={onOpenProspect} />)
          )}
        </div>

        <div className="card">
          <div className="card-title-row">
            <h3>RDV cette semaine</h3>
          </div>
          {rdvWeek.length === 0 ? (
            <EmptyState title="Aucun RDV cette semaine" icon={<IconCalendar size={20} />} />
          ) : (
            rdvWeek.map((p) => <ProspectRow key={p.id} p={p} meta={formatDateTime(p.date_rdv)} onOpen={onOpenProspect} />)
          )}
        </div>
      </div>
    </div>
  )
}
