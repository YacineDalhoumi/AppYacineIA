import StatCard from '../components/StatCard'
import { useProspects } from '../hooks/useProspects'
import { useAllInteractions } from '../hooks/useInteractions'
import {
  IconPhone,
  IconTrendUp,
  IconCalendar,
  IconUsersClock,
  IconProspects,
  IconAlert,
} from '../components/Icons'
import {
  countCallsInLastDays,
  tauxJoignabilite,
  countRdvObtenus,
  conversionFunnel,
  repartitionParStatut,
  repartitionParDepartement,
  topMotifsRefus,
} from '../utils/stats'
import {
  PROSPECT_STATUS_LABELS,
  MOTIF_REFUS_LABELS,
} from '../utils/constants'

function BarList({ data, labelFor, emptyLabel }) {
  if (data.length === 0) {
    return <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{emptyLabel}</div>
  }
  const max = Math.max(...data.map(([, count]) => count), 1)
  return (
    <div className="bar-list">
      {data.map(([key, count]) => (
        <div className="bar-row" key={key}>
          <span className="bar-row-label">{labelFor(key)}</span>
          <span className="bar-row-track">
            <span className="bar-row-fill" style={{ width: `${(count / max) * 100}%` }} />
          </span>
          <span className="bar-row-value">{count}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { prospects } = useProspects({})
  const { interactions } = useAllInteractions()

  const callsToday = countCallsInLastDays(interactions, 1)
  const callsWeek = countCallsInLastDays(interactions, 7)
  const callsMonth = countCallsInLastDays(interactions, 30)
  const joignabilite = tauxJoignabilite(interactions, 30)
  const rdvObtenus = countRdvObtenus(interactions, 30)
  const funnel = conversionFunnel(interactions, prospects)
  const parStatut = repartitionParStatut(prospects)
  const parDept = repartitionParDepartement(prospects)
  const motifsRefus = topMotifsRefus(prospects)

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Tableau de bord</h1>
          <p>Activité de prospection — Okto Agency</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Appels aujourd'hui" value={callsToday} icon={<IconPhone size={18} />} color="accent" />
        <StatCard label="Appels cette semaine" value={callsWeek} icon={<IconPhone size={18} />} color="accent" />
        <StatCard label="Appels ce mois" value={callsMonth} icon={<IconPhone size={18} />} color="accent" />
        <StatCard label="Taux de joignabilité (30j)" value={`${joignabilite}%`} icon={<IconTrendUp size={18} />} color="success" />
        <StatCard label="RDV obtenus (30j)" value={rdvObtenus} icon={<IconCalendar size={18} />} color="rdv" />
        <StatCard label="Total prospects" value={prospects.length} icon={<IconProspects size={18} />} color="neutral" />
      </div>

      <div className="card">
        <div className="card-title-row">
          <h3>Conversion appel → RDV → client</h3>
        </div>
        <div className="funnel">
          <div className="funnel-step">
            <div className="funnel-step-value">{funnel.totalAppels}</div>
            <div className="funnel-step-label">Appels</div>
          </div>
          <span className="funnel-arrow">→ {funnel.appelToRdv}% →</span>
          <div className="funnel-step">
            <div className="funnel-step-value">{funnel.totalRdv}</div>
            <div className="funnel-step-label">RDV</div>
          </div>
          <span className="funnel-arrow">→ {funnel.rdvToClient}% →</span>
          <div className="funnel-step">
            <div className="funnel-step-value">{funnel.totalClients}</div>
            <div className="funnel-step-label">Clients</div>
          </div>
        </div>
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-title-row">
            <h3>Répartition par statut</h3>
          </div>
          <BarList data={parStatut} labelFor={(k) => PROSPECT_STATUS_LABELS[k] || k} emptyLabel="Aucun prospect." />
        </div>

        <div className="card">
          <div className="card-title-row">
            <h3>Répartition par département</h3>
          </div>
          <BarList data={parDept} labelFor={(k) => k} emptyLabel="Aucun prospect." />
        </div>

        <div className="card">
          <div className="card-title-row">
            <h3>Top motifs de refus</h3>
          </div>
          <BarList
            data={motifsRefus}
            labelFor={(k) => MOTIF_REFUS_LABELS[k] || k}
            emptyLabel="Aucun refus enregistré."
          />
        </div>

        <div className="card">
          <div className="card-title-row">
            <h3>Prospects en cours</h3>
          </div>
          <StatCard
            label="Hors gagnés / refusés / ne plus contacter"
            value={prospects.filter((p) => !['gagne', 'refuse', 'ne_plus_contacter'].includes(p.statut)).length}
            icon={<IconUsersClock size={18} />}
            color="warning"
          />
          <div style={{ marginTop: 16 }}>
            <div className="card-title-row">
              <h3>Appels sans réponse (30j)</h3>
            </div>
            <StatCard
              label="Sur le total d'appels de la période"
              value={interactions.filter((i) => i.type === 'appel' && i.statut_apres === 'pas_de_reponse').length}
              icon={<IconAlert size={18} />}
              color="danger"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
