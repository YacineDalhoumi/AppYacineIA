// Données de démonstration : préremplissent l'app au tout premier lancement
// (avant toute écriture dans le localStorage).

function isoDaysAgo(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function isoDaysFromNow(days) {
  return isoDaysAgo(-days)
}

export const demoProspects = [
  {
    id: 'p1',
    nom: 'Karim Belaïd',
    entreprise: 'Atlas BTP',
    secteur: 'BTP',
    canal: 'LinkedIn',
    statut: 'relance',
    dateContact: isoDaysAgo(9),
    notes: 'Intéressé par une refonte du site vitrine, à relancer sur le budget.',
  },
  {
    id: 'p2',
    nom: 'Sophie Lambert',
    entreprise: 'Hôtel Bellevue',
    secteur: 'Hôtellerie',
    canal: 'Email',
    statut: 'rdv_pris',
    dateContact: isoDaysAgo(2),
    notes: 'RDV visio prévu pour présenter la solution de réservation en ligne.',
  },
  {
    id: 'p3',
    nom: 'Dr. Amélie Rousseau',
    entreprise: 'Clinique Saint-Martin',
    secteur: 'Santé',
    canal: 'Téléphone',
    statut: 'converti',
    dateContact: isoDaysAgo(21),
    notes: 'Signature validée pour la plateforme de prise de rendez-vous en ligne.',
  },
  {
    id: 'p4',
    nom: 'Thomas Girard',
    entreprise: 'Girard Automobiles',
    secteur: 'Automobile',
    canal: 'LinkedIn',
    statut: 'a_contacter',
    dateContact: isoDaysAgo(0),
    notes: 'Contact identifié via recommandation, premier message à envoyer.',
  },
  {
    id: 'p5',
    nom: 'Nadia Cherif',
    entreprise: 'Cherif Immobilier',
    secteur: 'Immobilier',
    canal: 'Email',
    statut: 'contacte',
    dateContact: isoDaysAgo(5),
    notes: 'A ouvert le mail de présentation, en attente de retour.',
  },
  {
    id: 'p6',
    nom: 'Julien Moreau',
    entreprise: 'Moreau Construction',
    secteur: 'BTP',
    canal: 'Autre',
    statut: 'perdu',
    dateContact: isoDaysAgo(30),
    notes: 'A choisi un prestataire concurrent moins cher.',
  },
  {
    id: 'p7',
    nom: 'Élodie Faure',
    entreprise: 'Résidence Les Tilleuls',
    secteur: 'Immobilier',
    canal: 'Téléphone',
    statut: 'converti',
    dateContact: isoDaysAgo(14),
    notes: 'Contrat signé pour le suivi des dossiers locataires.',
  },
]

export const demoPayments = [
  {
    id: 'pay1',
    prospectId: 'p3',
    client: 'Clinique Saint-Martin',
    montant: 3200,
    statut: 'paye',
    dateFacture: isoDaysAgo(18),
    dateEcheance: isoDaysAgo(3),
    datePaiement: isoDaysAgo(5),
    moyenPaiement: 'Virement',
    reference: 'FAC-2026-014',
    notes: 'Solde du développement de la plateforme de RDV.',
  },
  {
    id: 'pay2',
    prospectId: 'p7',
    client: 'Résidence Les Tilleuls',
    montant: 1800,
    statut: 'en_attente',
    dateFacture: isoDaysAgo(6),
    dateEcheance: isoDaysFromNow(9),
    datePaiement: null,
    moyenPaiement: 'Virement',
    reference: 'FAC-2026-021',
    notes: 'Premier acompte du projet de suivi locataires.',
  },
  {
    id: 'pay3',
    prospectId: 'p7',
    client: 'Résidence Les Tilleuls',
    montant: 1800,
    statut: 'en_retard',
    dateFacture: isoDaysAgo(30),
    dateEcheance: isoDaysAgo(9),
    datePaiement: null,
    moyenPaiement: 'Chèque',
    reference: 'FAC-2026-009',
    notes: 'Relance à prévoir, aucune réponse à ce jour.',
  },
  {
    id: 'pay4',
    prospectId: 'p3',
    client: 'Clinique Saint-Martin',
    montant: 950,
    statut: 'paye',
    dateFacture: isoDaysAgo(40),
    dateEcheance: isoDaysAgo(26),
    datePaiement: isoDaysAgo(28),
    moyenPaiement: 'CB',
    reference: 'FAC-2026-002',
    notes: 'Acompte initial du projet.',
  },
  {
    id: 'pay5',
    prospectId: 'p3',
    client: 'Clinique Saint-Martin',
    montant: 1100,
    statut: 'en_attente',
    dateFacture: isoDaysAgo(1),
    dateEcheance: isoDaysFromNow(29),
    datePaiement: null,
    moyenPaiement: 'Virement',
    reference: 'FAC-2026-025',
    notes: 'Maintenance annuelle facturée.',
  },
]
