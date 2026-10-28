import { db } from './index'

// Met à jour le statut d'un prospect (+ champs additionnels éventuels) et
// journalise automatiquement l'interaction correspondante. Utilisé par le
// Pipeline (drag & drop) et la Session d'appels (boutons de résultat).
export async function applyStatusChange({
  prospectId,
  statutAvant,
  statutApres,
  type = 'appel',
  resultat,
  note,
  extraPatch = {},
}) {
  const updated = await db.updateProspect(prospectId, { statut: statutApres, ...extraPatch })
  await db.createInteraction({
    prospect_id: prospectId,
    type,
    resultat,
    statut_avant: statutAvant,
    statut_apres: statutApres,
    note: note || null,
  })
  return updated
}
