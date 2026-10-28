import { useEffect, useState } from 'react'
import Modal from './Modal'
import ProspectFormFields from './ProspectFormFields'
import { todayIso } from '../utils/format'

const emptyForm = {
  nom: '',
  metier: 'serrurier',
  adresse: '',
  code_postal: '',
  ville: '',
  departement: '',
  site_web: '',
  fiche_google_url: '',
  contact_nom: '',
  contact_fonction: '',
  telephone_fixe: '',
  telephone_mobile: '',
  email: '',
  linkedin_url: '',
  priorite: 'moyenne',
  source: '',
  statut: 'a_contacter',
  date_prochaine_action: todayIso(),
  nb_tentatives: 0,
  tags: [],
}

// Ajout manuel rapide (champs essentiels). Le reste des informations
// (qualification, RDV, notes...) se complète ensuite depuis la fiche prospect.
export default function ProspectCreateModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm)
      setError('')
    }
  }, [isOpen])

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nom.trim()) {
      setError("Le nom de l'entreprise est obligatoire.")
      return
    }
    setSubmitting(true)
    try {
      await onCreate(form)
      onClose()
    } catch (err) {
      setError(err.message || 'Erreur lors de la création.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouveau prospect">
      <form onSubmit={handleSubmit}>
        <ProspectFormFields form={form} onChange={handleChange} sections={['entreprise', 'contact']} />
        {error && <div className="form-error">{error}</div>}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Création...' : 'Créer le prospect'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
