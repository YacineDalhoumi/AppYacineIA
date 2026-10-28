import { useMemo, useState } from 'react'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import { useProspects } from '../hooks/useProspects'
import { applyStatusChange } from '../lib/db/actions'
import { getCallQueue } from '../utils/selectors'
import { formatDate, todayIso } from '../utils/format'
import { telHref } from '../utils/phone'
import { IconPhone, IconCheck } from '../components/Icons'
import {
  PROSPECT_STATUS_LABELS,
  PROSPECT_STATUS_COLORS,
  PRIORITE_LABELS,
  PRIORITE_COLORS,
  METIER_LABELS,
  MOTIFS_REFUS,
  MOTIF_REFUS_LABELS,
  TYPES_RDV,
  TYPE_RDV_LABELS,
} from '../utils/constants'

function tomorrowIso() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export default function CallSession({ onOpenProspect }) {
  const { prospects, reload } = useProspects({})
  const [handledIds, setHandledIds] = useState(() => new Set())
  const [note, setNote] = useState('')
  const [actionMode, setActionMode] = useState(null) // null | 'rappeler' | 'rdv' | 'refuse'
  const [rappelDate, setRappelDate] = useState(tomorrowIso())
  const [rdvDate, setRdvDate] = useState(todayIso())
  const [rdvTime, setRdvTime] = useState('14:00')
  const [rdvType, setRdvType] = useState('telephone')
  const [motif, setMotif] = useState(MOTIFS_REFUS[0])
  const [submitting, setSubmitting] = useState(false)

  const queue = useMemo(() => {
    const base = getCallQueue(prospects)
    return base.filter((p) => !handledIds.has(p.id))
  }, [prospects, handledIds])

  const current = queue[0] || null

  function resetActionState() {
    setActionMode(null)
    setNote('')
    setRappelDate(tomorrowIso())
    setRdvDate(todayIso())
    setRdvTime('14:00')
    setRdvType('telephone')
    setMotif(MOTIFS_REFUS[0])
  }

  async function handleOutcome(statutApres, { resultat, extraPatch = {} } = {}) {
    if (!current || submitting) return
    setSubmitting(true)
    try {
      await applyStatusChange({
        prospectId: current.id,
        statutAvant: current.statut,
        statutApres,
        type: 'appel',
        resultat,
        note: note || null,
        extraPatch: {
          nb_tentatives: (current.nb_tentatives || 0) + 1,
          date_dernier_contact: todayIso(),
          date_premier_contact: current.date_premier_contact || todayIso(),
          ...extraPatch,
        },
      })
      setHandledIds((prev) => new Set(prev).add(current.id))
      reload()
      resetActionState()
    } finally {
      setSubmitting(false)
    }
  }

  function handlePasDeReponse() {
    handleOutcome('pas_de_reponse', {
      resultat: 'Pas de réponse / messagerie',
      extraPatch: { date_prochaine_action: tomorrowIso() },
    })
  }

  function handleInteresse() {
    handleOutcome('interesse', { resultat: 'Intéressé' })
  }

  function handleNePlusContacter() {
    if (!window.confirm(`Confirmer : ${current.nom} ne doit plus jamais être recontacté (opposition RGPD) ?`)) return
    handleOutcome('ne_plus_contacter', { resultat: 'Ne plus contacter (opposition RGPD)' })
  }

  function confirmRappeler() {
    handleOutcome('a_rappeler', {
      resultat: 'À rappeler',
      extraPatch: { date_prochaine_action: rappelDate, prochaine_action: 'Rappeler' },
    })
  }

  function confirmRdv() {
    const dateRdv = new Date(`${rdvDate}T${rdvTime}`)
    handleOutcome('rdv_planifie', {
      resultat: `RDV pris (${TYPE_RDV_LABELS[rdvType]})`,
      extraPatch: {
        date_rdv: dateRdv.toISOString(),
        type_rdv: rdvType,
        date_prochaine_action: rdvDate,
        prochaine_action: 'Préparer / confirmer le RDV',
      },
    })
  }

  function confirmRefuse() {
    handleOutcome('refuse', {
      resultat: `Refusé : ${MOTIF_REFUS_LABELS[motif]}`,
      extraPatch: { motif_refus: motif, date_prochaine_action: null, prochaine_action: null },
    })
  }

  if (!current) {
    return (
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-text">
            <h1>Session d'appels</h1>
            <p>Aucun appel à faire pour le moment.</p>
          </div>
        </div>
        <EmptyState
          title="File d'appel vide"
          message="Tous les prospects à contacter ou à rappeler aujourd'hui ont été traités."
          icon={<IconCheck size={20} />}
        />
      </div>
    )
  }

  const callHref = telHref(current.telephone_mobile) || telHref(current.telephone_fixe)

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Session d'appels</h1>
          <p>
            {queue.length} prospect{queue.length > 1 ? 's' : ''} à traiter
          </p>
        </div>
      </div>

      <div className="call-card">
        <div className="call-card-top">
          <div>
            <div className="call-card-name">{current.nom}</div>
            <div className="call-card-sub">
              {METIER_LABELS[current.metier] || current.metier}
              {current.ville ? ` · ${current.ville}` : ''}
              {current.departement ? ` (${current.departement})` : ''}
            </div>
          </div>
          <Badge label={PRIORITE_LABELS[current.priorite]} color={PRIORITE_COLORS[current.priorite]} />
        </div>

        <div className="call-card-meta">
          <Badge label={PROSPECT_STATUS_LABELS[current.statut]} color={PROSPECT_STATUS_COLORS[current.statut]} />
          <span>{current.nb_tentatives || 0} tentative(s)</span>
          <span>Dernier contact : {formatDate(current.date_dernier_contact)}</span>
        </div>

        {current.notes && <div className="call-card-notes">{current.notes}</div>}

        {callHref ? (
          <a className="btn btn-primary call-btn" href={callHref}>
            <IconPhone size={18} />
            Appeler {current.telephone_mobile || current.telephone_fixe}
          </a>
        ) : (
          <div className="form-error">Aucun numéro de téléphone renseigné.</div>
        )}

        <button type="button" className="call-card-link" onClick={() => onOpenProspect(current.id)}>
          Voir la fiche complète
        </button>

        <div className="form-field">
          <label>Note rapide</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contexte de l'appel..." />
        </div>

        {actionMode === null && (
          <div className="call-actions-grid">
            <button type="button" className="btn btn-secondary" disabled={submitting} onClick={handlePasDeReponse}>
              Pas de réponse
            </button>
            <button type="button" className="btn btn-secondary" disabled={submitting} onClick={() => setActionMode('rappeler')}>
              À rappeler
            </button>
            <button type="button" className="btn btn-primary" disabled={submitting} onClick={handleInteresse}>
              Intéressé
            </button>
            <button type="button" className="btn btn-primary" disabled={submitting} onClick={() => setActionMode('rdv')}>
              RDV pris
            </button>
            <button type="button" className="btn btn-danger" disabled={submitting} onClick={() => setActionMode('refuse')}>
              Refusé
            </button>
            <button type="button" className="btn btn-danger" disabled={submitting} onClick={handleNePlusContacter}>
              Ne plus contacter
            </button>
          </div>
        )}

        {actionMode === 'rappeler' && (
          <div className="call-inline-form">
            <div className="form-field">
              <label>Rappeler le</label>
              <input type="date" value={rappelDate} onChange={(e) => setRappelDate(e.target.value)} />
            </div>
            <div className="call-inline-form-actions">
              <button type="button" className="btn btn-secondary" onClick={resetActionState}>
                Annuler
              </button>
              <button type="button" className="btn btn-primary" disabled={submitting} onClick={confirmRappeler}>
                Valider
              </button>
            </div>
          </div>
        )}

        {actionMode === 'rdv' && (
          <div className="call-inline-form">
            <div className="form-grid">
              <div className="form-field">
                <label>Date</label>
                <input type="date" value={rdvDate} onChange={(e) => setRdvDate(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Heure</label>
                <input type="time" value={rdvTime} onChange={(e) => setRdvTime(e.target.value)} />
              </div>
              <div className="form-field span-2">
                <label>Type de RDV</label>
                <select value={rdvType} onChange={(e) => setRdvType(e.target.value)}>
                  {TYPES_RDV.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_RDV_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="call-inline-form-actions">
              <button type="button" className="btn btn-secondary" onClick={resetActionState}>
                Annuler
              </button>
              <button type="button" className="btn btn-primary" disabled={submitting} onClick={confirmRdv}>
                Valider
              </button>
            </div>
          </div>
        )}

        {actionMode === 'refuse' && (
          <div className="call-inline-form">
            <div className="form-field">
              <label>
                Motif <span className="required">*</span>
              </label>
              <select value={motif} onChange={(e) => setMotif(e.target.value)}>
                {MOTIFS_REFUS.map((m) => (
                  <option key={m} value={m}>
                    {MOTIF_REFUS_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
            <div className="call-inline-form-actions">
              <button type="button" className="btn btn-secondary" onClick={resetActionState}>
                Annuler
              </button>
              <button type="button" className="btn btn-danger" disabled={submitting} onClick={confirmRefuse}>
                Valider le refus
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
