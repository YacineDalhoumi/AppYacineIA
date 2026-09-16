import { useMemo, useState } from 'react'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import ProspectModal from '../components/ProspectModal'
import { useApp } from '../state/AppContext'
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconFileInvoice,
  IconProspects,
} from '../components/Icons'
import { formatDate } from '../utils/format'
import { PROSPECT_STATUS_COLORS, PROSPECT_STATUS_LABELS, PROSPECT_STATUSES } from '../utils/constants'

export default function Prospects({ onCreateInvoice }) {
  const { state, dispatch } = useApp()
  const { prospects } = state

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return prospects.filter((p) => {
      const matchesQuery =
        !query || p.nom.toLowerCase().includes(query) || p.entreprise.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || p.statut === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [prospects, search, statusFilter])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(prospect) {
    setEditing(prospect)
    setModalOpen(true)
  }

  function handleSave(data) {
    if (data.id) {
      dispatch({ type: 'UPDATE_PROSPECT', payload: data })
    } else {
      dispatch({ type: 'ADD_PROSPECT', payload: data })
    }
    setModalOpen(false)
  }

  function handleDelete(e, id) {
    e.stopPropagation()
    if (window.confirm('Supprimer ce prospect ?')) {
      dispatch({ type: 'DELETE_PROSPECT', payload: { id } })
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Prospects</h1>
          <p>{prospects.length} prospects au total.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          <IconPlus size={16} />
          Nouveau prospect
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <IconSearch size={16} />
          <input
            placeholder="Rechercher par nom ou entreprise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="select-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {PROSPECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {PROSPECT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <EmptyState
            title="Aucun prospect trouvé"
            message="Ajustez votre recherche ou vos filtres."
            icon={<IconProspects size={20} />}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Entreprise</th>
                <th>Secteur</th>
                <th>Canal</th>
                <th>Statut</th>
                <th>Dernier contact</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="clickable-row" onClick={() => openEdit(p)}>
                  <td className="table-cell-primary">{p.nom}</td>
                  <td>{p.entreprise}</td>
                  <td className="table-cell-muted">{p.secteur}</td>
                  <td className="table-cell-muted">{p.canal}</td>
                  <td>
                    <Badge label={PROSPECT_STATUS_LABELS[p.statut]} color={PROSPECT_STATUS_COLORS[p.statut]} />
                  </td>
                  <td className="table-cell-muted">{formatDate(p.dateContact)}</td>
                  <td>
                    <div className="table-actions">
                      {p.statut === 'converti' && (
                        <button
                          type="button"
                          className="btn-icon"
                          title="Créer une facture"
                          onClick={(e) => {
                            e.stopPropagation()
                            onCreateInvoice(p)
                          }}
                        >
                          <IconFileInvoice size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-icon"
                        title="Modifier"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEdit(p)
                        }}
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon"
                        title="Supprimer"
                        onClick={(e) => handleDelete(e, p.id)}
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ProspectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        prospect={editing}
      />
    </div>
  )
}
