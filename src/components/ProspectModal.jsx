import { useEffect, useState } from 'react'
import Modal from './Modal'
import {
  CANALS,
  PROSPECT_STATUSES,
  PROSPECT_STATUS_LABELS,
  SECTORS,
} from '../utils/constants'
import { todayIso } from '../utils/format'

const emptyForm = {
  nom: '',
  entreprise: '',
  secteur: SECTORS[0],
  canal: CANALS[0],
  statut: 'a_contacter',
  dateContact: todayIso(),
  notes: '',
}

export default function ProspectModal({ isOpen, onClose, onSave, prospect }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setForm(prospect ? { ...emptyForm, ...prospect } : emptyForm)
      setError('')
    }
  }, [isOpen, prospect])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nom.trim() || !form.entreprise.trim()) {
      setError('Le nom et l\'entreprise sont obligatoires.')
      return
    }
    onSave({ ...form, id: prospect?.id })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={prospect ? 'Modifier le prospect' : 'Nouveau prospect'}>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>
              Nom <span className="required">*</span>
            </label>
            <input
              value={form.nom}
              onChange={(e) => updateField('nom', e.target.value)}
              placeholder="Prénom et nom"
            />
          </div>
          <div className="form-field">
            <label>
              Entreprise <span className="required">*</span>
            </label>
            <input
              value={form.entreprise}
              onChange={(e) => updateField('entreprise', e.target.value)}
              placeholder="Nom de l'entreprise"
            />
          </div>
          <div className="form-field">
            <label>Secteur</label>
            <select value={form.secteur} onChange={(e) => updateField('secteur', e.target.value)}>
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Canal</label>
            <select value={form.canal} onChange={(e) => updateField('canal', e.target.value)}>
              {CANALS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Statut</label>
            <select value={form.statut} onChange={(e) => updateField('statut', e.target.value)}>
              {PROSPECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {PROSPECT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Dernier contact</label>
            <input
              type="date"
              value={form.dateContact}
              onChange={(e) => updateField('dateContact', e.target.value)}
            />
          </div>
          <div className="form-field span-2">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Contexte, besoins, prochaine étape..."
            />
          </div>
        </div>

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
