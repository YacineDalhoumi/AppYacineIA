import { useEffect, useState } from 'react'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import ProspectFormFields from '../components/ProspectFormFields'
import { useProspect } from '../hooks/useProspects'
import { useInteractions } from '../hooks/useInteractions'
import { applyStatusChange } from '../lib/db/actions'
import {
  IconArrowLeft,
  IconPhone,
  IconTrash,
  IconInbox,
} from '../components/Icons'
import { formatDateTime, todayIso } from '../utils/format'
import { telHref } from '../utils/phone'
import {
  PROSPECT_STATUSES,
  PROSPECT_STATUS_LABELS,
  PROSPECT_STATUS_COLORS,
  PRIORITE_LABELS,
  PRIORITE_COLORS,
  METIER_LABELS,
  TYPES_INTERACTION,
  TYPE_INTERACTION_LABELS,
} from '../utils/constants'

export default function ProspectDetail({ prospectId, onBack, onDeleted }) {
  const { prospect, loading, save, remove, reload } = useProspect(prospectId)
  const { interactions, addInteraction, reload: reloadInteractions } = useInteractions(prospectId)

  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)
  const [interactionForm, setInteractionForm] = useState({ type: 'appel', resultat: '', note: '' })
  const [addingInteraction, setAddingInteraction] = useState(false)

  useEffect(() => {
    if (prospect) setForm(prospect)
  }, [prospect])

  if (loading || !form) {
    return (
      <div className="page-content">
        <EmptyState title="Chargement..." />
      </div>
    )
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await save(form)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(newStatut) {
    if (newStatut === form.statut) return
    setChangingStatus(true)
    try {
      await applyStatusChange({
        prospectId,
        statutAvant: form.statut,
        statutApres: newStatut,
        type: 'appel',
        resultat: PROSPECT_STATUS_LABELS[newStatut],
      })
      reload()
      reloadInteractions()
    } finally {
      setChangingStatus(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer définitivement ${prospect.nom} et son historique ?`)) return
    await remove()
    onDeleted()
  }

  async function handleAddInteraction(e) {
    e.preventDefault()
    setAddingInteraction(true)
    try {
      await addInteraction({
        type: interactionForm.type,
        resultat: interactionForm.resultat || null,
        note: interactionForm.note || null,
        statut_avant: null,
        statut_apres: null,
      })
      await save({ date_dernier_contact: todayIso() })
      setInteractionForm({ type: 'appel', resultat: '', note: '' })
    } finally {
      setAddingInteraction(false)
    }
  }

  const callHref = telHref(prospect.telephone_mobile) || telHref(prospect.telephone_fixe)

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 8 }}>
            <IconArrowLeft size={16} />
            Retour
          </button>
          <h1>{prospect.nom}</h1>
          <p>
            {METIER_LABELS[prospect.metier] || prospect.metier}
            {prospect.ville ? ` · ${prospect.ville}` : ''}
            {prospect.departement ? ` (${prospect.departement})` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge label={PROSPECT_STATUS_LABELS[prospect.statut]} color={PROSPECT_STATUS_COLORS[prospect.statut]} />
          <Badge label={PRIORITE_LABELS[prospect.priorite]} color={PRIORITE_COLORS[prospect.priorite]} />
          {callHref && (
            <a className="btn btn-primary btn-sm" href={callHref}>
              <IconPhone size={14} />
              Appeler
            </a>
          )}
          <button type="button" className="btn-icon" title="Supprimer" onClick={handleDelete}>
            <IconTrash size={16} />
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title-row">
          <h3>Statut</h3>
        </div>
        <select
          className="select-input"
          value={prospect.statut}
          disabled={changingStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          {PROSPECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {PROSPECT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-title-row">
            <h3>Informations</h3>
          </div>
          <form onSubmit={handleSave}>
            <ProspectFormFields form={form} onChange={updateField} />
            <div className="modal-footer" style={{ marginTop: 18 }}>
              {saved && <span style={{ color: 'var(--color-success)', fontSize: 13, marginRight: 'auto' }}>Enregistré.</span>}
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-title-row">
            <h3>Historique</h3>
          </div>

          <form onSubmit={handleAddInteraction} style={{ marginBottom: 18 }}>
            <div className="form-grid">
              <div className="form-field">
                <label>Type</label>
                <select
                  value={interactionForm.type}
                  onChange={(e) => setInteractionForm((p) => ({ ...p, type: e.target.value }))}
                >
                  {TYPES_INTERACTION.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_INTERACTION_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Résultat</label>
                <input
                  value={interactionForm.resultat}
                  onChange={(e) => setInteractionForm((p) => ({ ...p, resultat: e.target.value }))}
                />
              </div>
              <div className="form-field span-2">
                <label>Note</label>
                <textarea
                  value={interactionForm.note}
                  onChange={(e) => setInteractionForm((p) => ({ ...p, note: e.target.value }))}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-secondary btn-sm" disabled={addingInteraction} style={{ marginTop: 10 }}>
              Ajouter à l'historique
            </button>
          </form>

          {interactions.length === 0 ? (
            <EmptyState title="Aucune interaction enregistrée" icon={<IconInbox size={20} />} />
          ) : (
            <div className="timeline">
              {interactions.map((i) => (
                <div className="timeline-item" key={i.id}>
                  <div className="timeline-dot" />
                  <div className="timeline-body">
                    <div className="timeline-header">
                      <span className="table-cell-primary">{TYPE_INTERACTION_LABELS[i.type] || i.type}</span>
                      <span className="timeline-date">{formatDateTime(i.date_heure)}</span>
                    </div>
                    {i.resultat && <div className="timeline-result">{i.resultat}</div>}
                    {i.statut_apres && (
                      <div className="timeline-status">
                        <Badge label={PROSPECT_STATUS_LABELS[i.statut_apres] || i.statut_apres} color={PROSPECT_STATUS_COLORS[i.statut_apres]} />
                      </div>
                    )}
                    {i.note && <div className="timeline-note">{i.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
