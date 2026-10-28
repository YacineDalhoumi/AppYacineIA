import { useMemo, useState } from 'react'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import ProspectCreateModal from '../components/ProspectCreateModal'
import ImportCsvModal from '../components/ImportCsvModal'
import { useProspects } from '../hooks/useProspects'
import { IconSearch, IconPlus, IconTrash, IconProspects, IconDownload, IconUpload } from '../components/Icons'
import { formatDate } from '../utils/format'
import { exportProspectsCsv } from '../utils/csv'
import {
  PROSPECT_STATUSES,
  PROSPECT_STATUS_LABELS,
  PROSPECT_STATUS_COLORS,
  PRIORITES,
  PRIORITE_LABELS,
  PRIORITE_COLORS,
  METIERS,
  METIER_LABELS,
} from '../utils/constants'

const SORT_OPTIONS = [
  { value: 'date_prochaine_action', label: 'Prochaine action' },
  { value: 'date_dernier_contact', label: 'Dernier contact' },
  { value: 'nb_avis_google', label: "Nb d'avis Google" },
]

export default function Prospects({ onOpenProspect }) {
  const { prospects, loading, createProspect, deleteProspect, reload } = useProspects({})

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departementFilter, setDepartementFilter] = useState('all')
  const [villeFilter, setVilleFilter] = useState('all')
  const [metierFilter, setMetierFilter] = useState('all')
  const [prioriteFilter, setPrioriteFilter] = useState('all')
  const [dispo24Only, setDispo24Only] = useState(false)
  const [sortBy, setSortBy] = useState('date_prochaine_action')
  const [sortDir, setSortDir] = useState('asc')
  const [modalOpen, setModalOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  const departements = useMemo(
    () => [...new Set(prospects.map((p) => p.departement).filter(Boolean))].sort(),
    [prospects]
  )
  const villes = useMemo(() => [...new Set(prospects.map((p) => p.ville).filter(Boolean))].sort(), [prospects])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    let rows = prospects.filter((p) => {
      const matchesQuery =
        !query ||
        p.nom?.toLowerCase().includes(query) ||
        p.ville?.toLowerCase().includes(query) ||
        p.contact_nom?.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || p.statut === statusFilter
      const matchesDept = departementFilter === 'all' || p.departement === departementFilter
      const matchesVille = villeFilter === 'all' || p.ville === villeFilter
      const matchesMetier = metierFilter === 'all' || p.metier === metierFilter
      const matchesPriorite = prioriteFilter === 'all' || p.priorite === prioriteFilter
      const matchesDispo = !dispo24Only || p.disponibilite === '24h24'
      return (
        matchesQuery && matchesStatus && matchesDept && matchesVille && matchesMetier && matchesPriorite && matchesDispo
      )
    })

    rows = [...rows].sort((a, b) => {
      const av = a[sortBy]
      const bv = b[sortBy]
      const factor = sortDir === 'desc' ? -1 : 1
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (av < bv) return -1 * factor
      if (av > bv) return 1 * factor
      return 0
    })

    return rows
  }, [prospects, search, statusFilter, departementFilter, villeFilter, metierFilter, prioriteFilter, dispo24Only, sortBy, sortDir])

  async function handleCreate(data) {
    await createProspect(data)
  }

  async function handleDelete(e, id) {
    e.stopPropagation()
    if (window.confirm('Supprimer ce prospect et son historique ?')) {
      await deleteProspect(id)
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Prospects</h1>
          <p>{prospects.length} prospects au total.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setImportOpen(true)}>
            <IconUpload size={16} />
            Importer
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => exportProspectsCsv(filtered)}
            disabled={filtered.length === 0}
          >
            <IconDownload size={16} />
            Exporter
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <IconPlus size={16} />
            Nouveau prospect
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <IconSearch size={16} />
          <input
            placeholder="Rechercher par nom, ville, contact..."
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
        <select className="select-input" value={metierFilter} onChange={(e) => setMetierFilter(e.target.value)}>
          <option value="all">Tous les métiers</option>
          {METIERS.map((m) => (
            <option key={m} value={m}>
              {METIER_LABELS[m]}
            </option>
          ))}
        </select>
        <select className="select-input" value={departementFilter} onChange={(e) => setDepartementFilter(e.target.value)}>
          <option value="all">Tous départements</option>
          {departements.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select className="select-input" value={villeFilter} onChange={(e) => setVilleFilter(e.target.value)}>
          <option value="all">Toutes villes</option>
          {villes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select className="select-input" value={prioriteFilter} onChange={(e) => setPrioriteFilter(e.target.value)}>
          <option value="all">Toute priorité</option>
          {PRIORITES.map((p) => (
            <option key={p} value={p}>
              {PRIORITE_LABELS[p]}
            </option>
          ))}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>
          <input type="checkbox" checked={dispo24Only} onChange={(e) => setDispo24Only(e.target.checked)} />
          24h/24
        </label>
        <select
          className="select-input"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          title="Trier par"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Trier : {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-icon"
          title={sortDir === 'asc' ? 'Croissant' : 'Décroissant'}
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
        >
          {sortDir === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="table-wrap">
        {loading ? (
          <EmptyState title="Chargement..." />
        ) : filtered.length === 0 ? (
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
                <th>Métier</th>
                <th>Ville</th>
                <th>Statut</th>
                <th>Priorité</th>
                <th>Avis Google</th>
                <th>Prochaine action</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="clickable-row" onClick={() => onOpenProspect(p.id)}>
                  <td className="table-cell-primary">{p.nom}</td>
                  <td className="table-cell-muted">{METIER_LABELS[p.metier] || p.metier}</td>
                  <td className="table-cell-muted">
                    {p.ville}
                    {p.departement ? ` (${p.departement})` : ''}
                  </td>
                  <td>
                    <Badge label={PROSPECT_STATUS_LABELS[p.statut]} color={PROSPECT_STATUS_COLORS[p.statut]} />
                  </td>
                  <td>
                    <Badge label={PRIORITE_LABELS[p.priorite]} color={PRIORITE_COLORS[p.priorite]} />
                  </td>
                  <td className="table-cell-muted">
                    {p.nb_avis_google ?? 0}
                    {p.note_google ? ` (${p.note_google}★)` : ''}
                  </td>
                  <td className="table-cell-muted">{formatDate(p.date_prochaine_action)}</td>
                  <td>
                    <div className="table-actions">
                      <button type="button" className="btn-icon" title="Supprimer" onClick={(e) => handleDelete(e, p.id)}>
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

      <ProspectCreateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      <ImportCsvModal isOpen={importOpen} onClose={() => setImportOpen(false)} onImported={reload} />
    </div>
  )
}
