import { PROSPECT_STATUSES } from './constants'

// Colonnes attendues pour l'import, et utilisées pour l'export — voir la
// documentation du format dans le README (import/export CSV).
export const PROSPECT_CSV_HEADERS = [
  'nom',
  'metier',
  'adresse',
  'code_postal',
  'ville',
  'departement',
  'site_web',
  'fiche_google_url',
  'contact_nom',
  'contact_fonction',
  'telephone_fixe',
  'telephone_mobile',
  'email',
  'linkedin_url',
  'disponibilite',
  'nb_avis_google',
  'note_google',
  'taille_estimee',
  'priorite',
  'tags',
  'source',
  'statut',
  'notes',
]

function detectDelimiter(firstLine) {
  const commaCount = (firstLine.match(/,/g) || []).length
  const semiCount = (firstLine.match(/;/g) || []).length
  return semiCount > commaCount ? ';' : ','
}

// Parseur CSV minimal (sans dépendance) : gère guillemets, champs contenant
// le délimiteur ou des retours à la ligne, et "" comme guillemet échappé.
// Détecte automatiquement , ou ; comme délimiteur.
export function parseCsv(text) {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const firstLineEnd = normalized.indexOf('\n')
  const firstLine = firstLineEnd === -1 ? normalized : normalized.slice(0, firstLineEnd)
  const delimiter = detectDelimiter(firstLine)

  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < normalized.length; i++) {
    const c = normalized[i]
    if (inQuotes) {
      if (c === '"') {
        if (normalized[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === delimiter) {
      row.push(field)
      field = ''
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += c
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}

function csvEscape(value) {
  if (value == null) return ''
  const str = Array.isArray(value) ? value.join('|') : String(value)
  if (/["\n,;]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

// Génère et déclenche le téléchargement d'un CSV (BOM UTF-8 pour Excel).
export function exportProspectsCsv(prospects, filename = 'prospects.csv') {
  const lines = [PROSPECT_CSV_HEADERS.join(',')]
  prospects.forEach((p) => {
    lines.push(PROSPECT_CSV_HEADERS.map((col) => csvEscape(p[col])).join(','))
  })
  const blob = new Blob([`﻿${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Transforme le texte CSV brut en objets prospect prêts pour db.createProspect,
// plus la liste des lignes ignorées (nom manquant). Les champs libres non
// reconnus (statut/priorité/taille/disponibilité invalides) retombent sur
// une valeur par défaut plutôt que de faire échouer tout l'import.
export function parseProspectsCsv(text) {
  const rows = parseCsv(text)
  if (rows.length === 0) return { records: [], errors: ['Fichier vide.'] }

  const header = rows[0].map((h) => h.trim().toLowerCase())
  const dataRows = rows.slice(1)
  const records = []
  const errors = []

  dataRows.forEach((row, idx) => {
    const lineNo = idx + 2
    const cell = {}
    header.forEach((col, i) => {
      cell[col] = (row[i] ?? '').trim()
    })

    if (!cell.nom) {
      errors.push(`Ligne ${lineNo} : colonne "nom" manquante ou vide, ligne ignorée.`)
      return
    }

    records.push({
      nom: cell.nom,
      metier: cell.metier || 'serrurier',
      adresse: cell.adresse || null,
      code_postal: cell.code_postal || null,
      ville: cell.ville || null,
      departement: cell.departement || null,
      site_web: cell.site_web || null,
      fiche_google_url: cell.fiche_google_url || null,
      contact_nom: cell.contact_nom || null,
      contact_fonction: cell.contact_fonction || null,
      telephone_fixe: cell.telephone_fixe || null,
      telephone_mobile: cell.telephone_mobile || null,
      email: cell.email || null,
      linkedin_url: cell.linkedin_url || null,
      disponibilite: cell.disponibilite === '24h24' ? '24h24' : 'horaires',
      nb_avis_google: cell.nb_avis_google ? Number(cell.nb_avis_google) || 0 : 0,
      note_google: cell.note_google ? Number(cell.note_google) : null,
      taille_estimee: ['solo', 'petite_equipe', 'reseau'].includes(cell.taille_estimee) ? cell.taille_estimee : null,
      priorite: ['haute', 'moyenne', 'basse'].includes(cell.priorite) ? cell.priorite : 'moyenne',
      tags: cell.tags ? cell.tags.split('|').map((t) => t.trim()).filter(Boolean) : [],
      source: cell.source || null,
      statut: PROSPECT_STATUSES.includes(cell.statut) ? cell.statut : 'a_contacter',
      notes: cell.notes || null,
      nb_tentatives: 0,
    })
  })

  return { records, errors }
}
