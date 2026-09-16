import { useEffect, useState } from 'react'
import { useApp } from '../state/AppContext'

export default function Settings() {
  const { state, dispatch } = useApp()
  const { settings } = state

  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(settings)
  }, [settings])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        userName: form.userName || 'Yacine',
        relanceThresholdDays: Number(form.relanceThresholdDays) || 7,
        currency: form.currency || '€',
      },
    })
    setSaved(true)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Paramètres</h1>
          <p>Personnalisez le comportement de l&apos;application.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit} className="settings-section">
          <div className="form-field">
            <label>Nom de l&apos;utilisateur</label>
            <input value={form.userName} onChange={(e) => updateField('userName', e.target.value)} />
          </div>

          <div className="form-field">
            <label>Seuil de jours avant relance</label>
            <input
              type="number"
              min="1"
              value={form.relanceThresholdDays}
              onChange={(e) => updateField('relanceThresholdDays', e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Devise</label>
            <input value={form.currency} onChange={(e) => updateField('currency', e.target.value)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
            {saved && <span style={{ color: 'var(--color-success)', fontSize: 13 }}>Paramètres enregistrés.</span>}
          </div>
        </form>
      </div>
    </div>
  )
}
