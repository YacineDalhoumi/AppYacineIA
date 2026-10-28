import {
  METIERS,
  METIER_LABELS,
  DISPONIBILITES,
  DISPONIBILITE_LABELS,
  TAILLES_ESTIMEES,
  TAILLE_LABELS,
  PRIORITES,
  PRIORITE_LABELS,
  SOURCES_SUGGESTIONS,
  DEPARTEMENTS_IDF_SUGGESTIONS,
  TYPES_RDV,
  TYPE_RDV_LABELS,
  MOTIFS_REFUS,
  MOTIF_REFUS_LABELS,
} from '../utils/constants'
import { toDatetimeLocal, fromDatetimeLocal } from '../utils/format'

// Rendu des champs du formulaire prospect, groupés par section. `sections`
// permet de n'afficher qu'un sous-ensemble (ex. ajout rapide en modale).
// Composant contrôlé : `form` + `onChange(field, value)`.
export default function ProspectFormFields({ form, onChange, sections = ['entreprise', 'contact', 'qualification', 'suivi'] }) {
  const show = (s) => sections.includes(s)

  return (
    <>
      {show('entreprise') && (
        <fieldset className="form-section">
          <legend>Entreprise</legend>
          <div className="form-grid">
            <div className="form-field span-2">
              <label>
                Nom de l'entreprise <span className="required">*</span>
              </label>
              <input value={form.nom || ''} onChange={(e) => onChange('nom', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Métier</label>
              <select value={form.metier || 'serrurier'} onChange={(e) => onChange('metier', e.target.value)}>
                {METIERS.map((m) => (
                  <option key={m} value={m}>
                    {METIER_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Source</label>
              <input
                list="sources-suggestions"
                value={form.source || ''}
                onChange={(e) => onChange('source', e.target.value)}
                placeholder="Google Maps, recommandation..."
              />
              <datalist id="sources-suggestions">
                {SOURCES_SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div className="form-field span-2">
              <label>Adresse</label>
              <input value={form.adresse || ''} onChange={(e) => onChange('adresse', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Code postal</label>
              <input value={form.code_postal || ''} onChange={(e) => onChange('code_postal', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Ville</label>
              <input value={form.ville || ''} onChange={(e) => onChange('ville', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Département</label>
              <input
                list="departements-suggestions"
                value={form.departement || ''}
                onChange={(e) => onChange('departement', e.target.value)}
                placeholder="75, 92..."
              />
              <datalist id="departements-suggestions">
                {DEPARTEMENTS_IDF_SUGGESTIONS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>
            <div className="form-field">
              <label>Site web</label>
              <input value={form.site_web || ''} onChange={(e) => onChange('site_web', e.target.value)} />
            </div>
            <div className="form-field span-2">
              <label>Fiche Google</label>
              <input
                value={form.fiche_google_url || ''}
                onChange={(e) => onChange('fiche_google_url', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        </fieldset>
      )}

      {show('contact') && (
        <fieldset className="form-section">
          <legend>Contact</legend>
          <div className="form-grid">
            <div className="form-field">
              <label>Nom du contact</label>
              <input value={form.contact_nom || ''} onChange={(e) => onChange('contact_nom', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Fonction</label>
              <input value={form.contact_fonction || ''} onChange={(e) => onChange('contact_fonction', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Téléphone fixe</label>
              <input value={form.telephone_fixe || ''} onChange={(e) => onChange('telephone_fixe', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Téléphone mobile</label>
              <input value={form.telephone_mobile || ''} onChange={(e) => onChange('telephone_mobile', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input type="email" value={form.email || ''} onChange={(e) => onChange('email', e.target.value)} />
            </div>
            <div className="form-field">
              <label>LinkedIn</label>
              <input value={form.linkedin_url || ''} onChange={(e) => onChange('linkedin_url', e.target.value)} />
            </div>
          </div>
        </fieldset>
      )}

      {show('qualification') && (
        <fieldset className="form-section">
          <legend>Qualification</legend>
          <div className="form-grid">
            <div className="form-field">
              <label>Disponibilité</label>
              <select value={form.disponibilite || 'horaires'} onChange={(e) => onChange('disponibilite', e.target.value)}>
                {DISPONIBILITES.map((d) => (
                  <option key={d} value={d}>
                    {DISPONIBILITE_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Priorité</label>
              <select value={form.priorite || 'moyenne'} onChange={(e) => onChange('priorite', e.target.value)}>
                {PRIORITES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITE_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Nb avis Google</label>
              <input
                type="number"
                min="0"
                value={form.nb_avis_google ?? 0}
                onChange={(e) => onChange('nb_avis_google', Number(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Note Google</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.note_google ?? ''}
                onChange={(e) => onChange('note_google', e.target.value === '' ? null : Number(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Taille estimée</label>
              <select value={form.taille_estimee || ''} onChange={(e) => onChange('taille_estimee', e.target.value || null)}>
                <option value="">—</option>
                {TAILLES_ESTIMEES.map((t) => (
                  <option key={t} value={t}>
                    {TAILLE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Tags (séparés par une virgule)</label>
              <input
                value={(form.tags || []).join(', ')}
                onChange={(e) =>
                  onChange(
                    'tags',
                    e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                  )
                }
              />
            </div>
          </div>
        </fieldset>
      )}

      {show('suivi') && (
        <fieldset className="form-section">
          <legend>Suivi</legend>
          <div className="form-grid">
            <div className="form-field span-2">
              <label>Prochaine action</label>
              <input value={form.prochaine_action || ''} onChange={(e) => onChange('prochaine_action', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Date de prochaine action</label>
              <input
                type="date"
                value={form.date_prochaine_action || ''}
                onChange={(e) => onChange('date_prochaine_action', e.target.value || null)}
              />
            </div>
            <div className="form-field">
              <label>Nb tentatives</label>
              <input
                type="number"
                min="0"
                value={form.nb_tentatives ?? 0}
                onChange={(e) => onChange('nb_tentatives', Number(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Date premier contact</label>
              <input
                type="date"
                value={form.date_premier_contact || ''}
                onChange={(e) => onChange('date_premier_contact', e.target.value || null)}
              />
            </div>
            <div className="form-field">
              <label>Date dernier contact</label>
              <input
                type="date"
                value={form.date_dernier_contact || ''}
                onChange={(e) => onChange('date_dernier_contact', e.target.value || null)}
              />
            </div>
            <div className="form-field">
              <label>Date et heure RDV</label>
              <input
                type="datetime-local"
                value={toDatetimeLocal(form.date_rdv)}
                onChange={(e) => onChange('date_rdv', fromDatetimeLocal(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Type de RDV</label>
              <select value={form.type_rdv || ''} onChange={(e) => onChange('type_rdv', e.target.value || null)}>
                <option value="">—</option>
                {TYPES_RDV.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_RDV_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field span-2">
              <label>Motif de refus</label>
              <select value={form.motif_refus || ''} onChange={(e) => onChange('motif_refus', e.target.value || null)}>
                <option value="">—</option>
                {MOTIFS_REFUS.map((m) => (
                  <option key={m} value={m}>
                    {MOTIF_REFUS_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field span-2">
              <label>Notes générales</label>
              <textarea value={form.notes || ''} onChange={(e) => onChange('notes', e.target.value)} />
            </div>
          </div>
        </fieldset>
      )}
    </>
  )
}
