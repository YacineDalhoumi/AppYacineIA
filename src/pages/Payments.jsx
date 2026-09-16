import { useEffect, useMemo, useState } from 'react'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import PaymentModal from '../components/PaymentModal'
import { useApp } from '../state/AppContext'
import { IconSearch, IconPlus, IconEdit, IconTrash, IconWallet } from '../components/Icons'
import { computeEffectiveStatus, formatCurrency, formatDate } from '../utils/format'
import { PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUSES } from '../utils/constants'

export default function Payments({ invoicePrefill, onPrefillConsumed }) {
  const { state, dispatch } = useApp()
  const { payments, prospects, settings } = state

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [prefill, setPrefill] = useState(null)

  useEffect(() => {
    if (invoicePrefill) {
      setEditing(null)
      setPrefill(invoicePrefill)
      setModalOpen(true)
      onPrefillConsumed()
    }
  }, [invoicePrefill, onPrefillConsumed])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return payments.filter((pay) => {
      const matchesQuery = !query || pay.client.toLowerCase().includes(query)
      const effective = computeEffectiveStatus(pay)
      const matchesStatus = statusFilter === 'all' || effective === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [payments, search, statusFilter])

  const totalFacture = payments.reduce((sum, p) => sum + Number(p.montant || 0), 0)
  const totalEncaisse = payments
    .filter((p) => computeEffectiveStatus(p) === 'paye')
    .reduce((sum, p) => sum + Number(p.montant || 0), 0)
  const totalAttente = payments
    .filter((p) => computeEffectiveStatus(p) === 'en_attente')
    .reduce((sum, p) => sum + Number(p.montant || 0), 0)
  const totalRetard = payments
    .filter((p) => computeEffectiveStatus(p) === 'en_retard')
    .reduce((sum, p) => sum + Number(p.montant || 0), 0)

  function openCreate() {
    setEditing(null)
    setPrefill(null)
    setModalOpen(true)
  }

  function openEdit(payment) {
    setEditing(payment)
    setPrefill(null)
    setModalOpen(true)
  }

  function handleSave(data) {
    if (data.id) {
      dispatch({ type: 'UPDATE_PAYMENT', payload: data })
    } else {
      dispatch({ type: 'ADD_PAYMENT', payload: data })
    }
    setModalOpen(false)
  }

  function handleDelete(e, id) {
    e.stopPropagation()
    if (window.confirm('Supprimer ce paiement ?')) {
      dispatch({ type: 'DELETE_PAYMENT', payload: { id } })
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Paiements</h1>
          <p>{payments.length} factures enregistrées.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          <IconPlus size={16} />
          Nouveau paiement
        </button>
      </div>

      <div className="card">
        <div className="summary-strip">
          <div className="summary-item">
            <span className="summary-item-label">Total facturé</span>
            <span className="summary-item-value">{formatCurrency(totalFacture, settings.currency)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item-label">Total encaissé</span>
            <span className="summary-item-value" style={{ color: 'var(--color-success)' }}>
              {formatCurrency(totalEncaisse, settings.currency)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-item-label">Total en attente</span>
            <span className="summary-item-value" style={{ color: 'var(--color-warning)' }}>
              {formatCurrency(totalAttente, settings.currency)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-item-label">Total en retard</span>
            <span className="summary-item-value" style={{ color: 'var(--color-danger)' }}>
              {formatCurrency(totalRetard, settings.currency)}
            </span>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <IconSearch size={16} />
          <input
            placeholder="Rechercher par client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="select-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {PAYMENT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <EmptyState
            title="Aucun paiement trouvé"
            message="Ajustez votre recherche ou vos filtres."
            icon={<IconWallet size={20} />}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date facture</th>
                <th>Date échéance</th>
                <th>Date paiement</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((pay) => {
                const effective = computeEffectiveStatus(pay)
                return (
                  <tr key={pay.id} className="clickable-row" onClick={() => openEdit(pay)}>
                    <td className="table-cell-primary">{pay.client}</td>
                    <td>{formatCurrency(pay.montant, settings.currency)}</td>
                    <td>
                      <Badge label={PAYMENT_STATUS_LABELS[effective]} color={PAYMENT_STATUS_COLORS[effective]} />
                    </td>
                    <td className="table-cell-muted">{formatDate(pay.dateFacture)}</td>
                    <td className="table-cell-muted">{formatDate(pay.dateEcheance)}</td>
                    <td className="table-cell-muted">{formatDate(pay.datePaiement)}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn-icon"
                          title="Modifier"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEdit(pay)
                          }}
                        >
                          <IconEdit size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Supprimer"
                          onClick={(e) => handleDelete(e, pay.id)}
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        payment={editing}
        prospects={prospects}
        prefill={prefill}
      />
    </div>
  )
}
