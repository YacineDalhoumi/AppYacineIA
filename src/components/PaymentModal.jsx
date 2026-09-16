import { useEffect, useState } from 'react'
import Modal from './Modal'
import { PAYMENT_METHODS, PAYMENT_STATUSES, PAYMENT_STATUS_LABELS } from '../utils/constants'
import { isOverdue, todayIso } from '../utils/format'

function buildEmptyForm(prefill) {
  return {
    prospectId: prefill?.prospectId || '',
    client: prefill?.client || '',
    montant: prefill?.montant ?? '',
    statut: 'en_attente',
    dateFacture: todayIso(),
    dateEcheance: todayIso(),
    datePaiement: '',
    moyenPaiement: PAYMENT_METHODS[0],
    reference: '',
    notes: '',
  }
}

export default function PaymentModal({ isOpen, onClose, onSave, payment, prospects, prefill }) {
  const [form, setForm] = useState(buildEmptyForm())
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setForm(payment ? { ...buildEmptyForm(), ...payment } : buildEmptyForm(prefill))
      setError('')
    }
  }, [isOpen, payment, prefill])

  const convertedProspects = prospects.filter((p) => p.statut === 'converti')

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleProspectChange(id) {
    const linked = prospects.find((p) => p.id === id)
    setForm((prev) => ({
      ...prev,
      prospectId: id,
      client: linked ? linked.entreprise : prev.client,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.client.trim() || !form.montant) {
      setError('Le client et le montant sont obligatoires.')
      return
    }

    let statut = form.statut
    if (statut !== 'paye' && statut !== 'annule' && isOverdue(form.dateEcheance) && !form.datePaiement) {
      statut = 'en_retard'
    }

    onSave({
      ...form,
      id: payment?.id,
      montant: Number(form.montant),
      datePaiement: form.datePaiement || null,
      prospectId: form.prospectId || null,
      statut,
    })
  }

  const willBeOverdue =
    form.statut !== 'paye' &&
    form.statut !== 'annule' &&
    isOverdue(form.dateEcheance) &&
    !form.datePaiement

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={payment ? 'Modifier le paiement' : 'Nouveau paiement'}>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field span-2">
            <label>Prospect converti lié</label>
            <select value={form.prospectId} onChange={(e) => handleProspectChange(e.target.value)}>
              <option value="">Aucun / client libre</option>
              {convertedProspects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.entreprise} — {p.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>
              Client <span className="required">*</span>
            </label>
            <input value={form.client} onChange={(e) => updateField('client', e.target.value)} />
          </div>
          <div className="form-field">
            <label>
              Montant <span className="required">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.montant}
              onChange={(e) => updateField('montant', e.target.value)}
              placeholder="0,00"
            />
          </div>
          <div className="form-field">
            <label>Statut</label>
            <select value={form.statut} onChange={(e) => updateField('statut', e.target.value)}>
              {PAYMENT_STATUSES.filter((s) => s !== 'en_retard').map((s) => (
                <option key={s} value={s}>
                  {PAYMENT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Moyen de paiement</label>
            <select value={form.moyenPaiement} onChange={(e) => updateField('moyenPaiement', e.target.value)}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Date facture</label>
            <input
              type="date"
              value={form.dateFacture}
              onChange={(e) => updateField('dateFacture', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Date échéance</label>
            <input
              type="date"
              value={form.dateEcheance}
              onChange={(e) => updateField('dateEcheance', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Date paiement</label>
            <input
              type="date"
              value={form.datePaiement || ''}
              onChange={(e) => updateField('datePaiement', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Référence</label>
            <input
              value={form.reference}
              onChange={(e) => updateField('reference', e.target.value)}
              placeholder="FAC-2026-000"
            />
          </div>
          <div className="form-field span-2">
            <label>Notes</label>
            <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} />
          </div>
        </div>

        {willBeOverdue && (
          <div className="form-error" style={{ color: 'var(--color-warning)' }}>
            Échéance dépassée sans paiement enregistré : ce paiement sera marqué « En retard ».
          </div>
        )}
        {error && <div className="form-error">{error}</div>}

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  )
}
