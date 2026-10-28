import { useState } from 'react'
import Modal from './Modal'
import { db } from '../lib/db'
import { parseProspectsCsv } from '../utils/csv'
import { normalizePhone } from '../utils/phone'

// Import CSV avec détection de doublon sur le téléphone (fixe ou mobile,
// numéros normalisés). Les doublons sont listés mais jamais recréés.
export default function ImportCsvModal({ isOpen, onClose, onImported }) {
  const [fileName, setFileName] = useState('')
  const [parsing, setParsing] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  function reset() {
    setFileName('')
    setReport(null)
    setError('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setError('')
    setReport(null)
    setParsing(true)
    try {
      const text = await file.text()
      const { records, errors } = parseProspectsCsv(text)

      const phones = records.flatMap((r) => [normalizePhone(r.telephone_mobile), normalizePhone(r.telephone_fixe)])
      const existing = await db.findProspectsByPhones(phones)
      const existingPhones = new Set(
        existing.flatMap((p) => [normalizePhone(p.telephone_mobile), normalizePhone(p.telephone_fixe)]).filter(Boolean)
      )

      const toCreate = []
      const duplicates = []
      const seenInFile = new Set()

      for (const record of records) {
        const mobile = normalizePhone(record.telephone_mobile)
        const fixe = normalizePhone(record.telephone_fixe)
        const isDuplicate =
          (mobile && existingPhones.has(mobile)) ||
          (fixe && existingPhones.has(fixe)) ||
          (mobile && seenInFile.has(mobile)) ||
          (fixe && seenInFile.has(fixe))

        if (isDuplicate) {
          duplicates.push(record.nom)
        } else {
          toCreate.push(record)
          if (mobile) seenInFile.add(mobile)
          if (fixe) seenInFile.add(fixe)
        }
      }

      for (const record of toCreate) {
        // eslint-disable-next-line no-await-in-loop
        await db.createProspect(record)
      }

      setReport({ created: toCreate.length, duplicates, errors })
      if (toCreate.length > 0) onImported()
    } catch (err) {
      setError(err.message || "Erreur lors de l'import.")
    } finally {
      setParsing(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importer des prospects (CSV)">
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14 }}>
        Fichier CSV avec en-têtes (séparateur , ou ;). Colonne obligatoire : <code>nom</code>. Les doublons sont
        détectés sur le téléphone (fixe ou mobile) et ne sont jamais recréés.
      </p>

      <div className="form-field">
        <label>Fichier CSV</label>
        <input type="file" accept=".csv,text/csv" onChange={handleFile} disabled={parsing} />
      </div>

      {fileName && !parsing && <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{fileName}</div>}
      {parsing && <div style={{ fontSize: 13 }}>Import en cours...</div>}
      {error && <div className="form-error">{error}</div>}

      {report && (
        <div className="card" style={{ marginTop: 14, boxShadow: 'none' }}>
          <div style={{ fontSize: 13.5, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{report.created} prospect(s) créé(s)</span>
            {report.duplicates.length > 0 && (
              <span style={{ color: 'var(--color-warning)' }}>
                {report.duplicates.length} doublon(s) ignoré(s) : {report.duplicates.join(', ')}
              </span>
            )}
            {report.errors.length > 0 && (
              <span style={{ color: 'var(--color-danger)' }}>{report.errors.length} ligne(s) en erreur :</span>
            )}
            {report.errors.map((e) => (
              <span key={e} style={{ color: 'var(--color-danger)', fontSize: 12 }}>
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
          Fermer
        </button>
      </div>
    </Modal>
  )
}
