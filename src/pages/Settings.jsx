import { useEffect, useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useAuth } from '../state/AuthContext'

export default function Settings() {
  const { settings, updateSettings } = useSettings()
  const { isDemoMode, userEmail, logout } = useAuth()

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
    updateSettings({
      userName: form.userName || 'Yacine',
      relanceThresholdDays: Number(form.relanceThresholdDays) || 7,
    })
    setSaved(true)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Paramètres</h1>
          <p>Personnalisez le comportement de l'application.</p>
        </div>
      </div>

      {isDemoMode && (
        <div className="auth-banner" style={{ maxWidth: 480 }}>
          Mode démo local : les données ne sont pas connectées à Supabase et ne sont pas partagées entre appareils.
          Configure VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY pour activer la vraie base.
        </div>
      )}

      <div className="card" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit} className="settings-section">
          <div className="form-field">
            <label>Nom affiché</label>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
            {saved && <span style={{ color: 'var(--color-success)', fontSize: 13 }}>Paramètres enregistrés.</span>}
          </div>
        </form>
      </div>

      {!isDemoMode && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="card-title-row">
            <h3>Compte</h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14 }}>Connecté en tant que {userEmail}</p>
          <button type="button" className="btn btn-secondary" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}
