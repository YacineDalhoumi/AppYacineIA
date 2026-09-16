import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import { useApp } from '../state/AppContext'
import {
  IconUsersClock,
  IconTrendUp,
  IconClockAlert,
  IconProspects,
  IconWallet,
  IconAlert,
  IconInbox,
  IconFileInvoice,
} from '../components/Icons'
import { formatCurrency, formatDate, initials } from '../utils/format'
import {
  conversionRate,
  getOverduePayments,
  getProspectsToRelance,
  sumPayments,
} from '../utils/selectors'
import { PROSPECT_STATUS_COLORS, PROSPECT_STATUS_LABELS } from '../utils/constants'

export default function Dashboard({ onNavigate }) {
  const { state, dispatch } = useApp()
  const { prospects, payments, settings } = state

  const enCours = prospects.filter((p) => p.statut !== 'converti' && p.statut !== 'perdu')
  const relances = getProspectsToRelance(prospects, settings.relanceThresholdDays).slice(0, 5)
  const overduePayments = getOverduePayments(payments).slice(0, 5)
  const encaisse = sumPayments(payments, 'paye')
  const enAttente = sumPayments(payments, 'en_attente')

  function markRelance(prospect) {
    dispatch({
      type: 'MARK_RELANCE',
      payload: { id: prospect.id, date: new Date().toISOString().slice(0, 10) },
    })
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Dashboard</h1>
          <p>Vue d&apos;ensemble de votre activité commerciale et financière.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Prospects en cours"
          value={enCours.length}
          icon={<IconUsersClock size={18} />}
          color="accent"
        />
        <StatCard
          label="Taux de conversion"
          value={`${conversionRate(prospects)}%`}
          icon={<IconTrendUp size={18} />}
          color="success"
        />
        <StatCard
          label="Relances en retard"
          value={getProspectsToRelance(prospects, settings.relanceThresholdDays).length}
          icon={<IconClockAlert size={18} />}
          color="warning"
        />
        <StatCard
          label="Total prospects"
          value={prospects.length}
          icon={<IconProspects size={18} />}
          color="neutral"
        />
        <StatCard
          label="CA encaissé"
          value={formatCurrency(encaisse, settings.currency)}
          icon={<IconWallet size={18} />}
          color="success"
        />
        <StatCard
          label="Montant en attente"
          value={formatCurrency(enAttente, settings.currency)}
          icon={<IconAlert size={18} />}
          color="warning"
        />
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-title-row">
            <h3>Relances à faire</h3>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onNavigate('tasks')}>
              Voir tout
            </button>
          </div>
          {relances.length === 0 ? (
            <EmptyState title="Aucune relance en retard" icon={<IconInbox size={20} />} />
          ) : (
            relances.map((p) => (
              <div className="list-row" key={p.id}>
                <div className="list-row-main">
                  <span className="list-row-avatar">{initials(p.nom)}</span>
                  <div>
                    <div className="list-row-title">{p.nom}</div>
                    <div className="list-row-sub">
                      {p.entreprise} · Contact le {formatDate(p.dateContact)}
                    </div>
                  </div>
                </div>
                <div className="list-row-meta">
                  <Badge label={PROSPECT_STATUS_LABELS[p.statut]} color={PROSPECT_STATUS_COLORS[p.statut]} />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => markRelance(p)}>
                    Relancé
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-title-row">
            <h3>Factures en retard</h3>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onNavigate('payments')}>
              Voir tout
            </button>
          </div>
          {overduePayments.length === 0 ? (
            <EmptyState title="Aucune facture en retard" icon={<IconFileInvoice size={20} />} />
          ) : (
            overduePayments.map((pay) => (
              <div className="list-row" key={pay.id}>
                <div className="list-row-main">
                  <span className="list-row-avatar">{initials(pay.client)}</span>
                  <div>
                    <div className="list-row-title">{pay.client}</div>
                    <div className="list-row-sub">Échéance {formatDate(pay.dateEcheance)}</div>
                  </div>
                </div>
                <div className="list-row-meta">
                  <Badge label="En retard" color="danger" />
                  <span className="table-cell-primary">{formatCurrency(pay.montant, settings.currency)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
