-- Yacine CRM — données de démonstration
-- À exécuter APRÈS schema.sql, dans le même SQL Editor.
-- 10 serruriers fictifs en Île-de-France + quelques interactions d'historique.
-- Sans danger à relancer : supprime puis recrée les lignes de démo (uuid préfixé 'dec0de00').

delete from interactions where prospect_id in (
  select id from prospects where id::text like 'dec0de00%'
);
delete from prospects where id::text like 'dec0de00%';

insert into prospects (
  id, nom, metier, adresse, code_postal, ville, departement, site_web, fiche_google_url,
  contact_nom, contact_fonction, telephone_fixe, telephone_mobile, email, linkedin_url,
  disponibilite, nb_avis_google, note_google, taille_estimee, priorite, tags, source,
  statut, date_premier_contact, date_dernier_contact, nb_tentatives,
  prochaine_action, date_prochaine_action, motif_refus, date_rdv, type_rdv, notes
) values
  ('dec0de00-0000-0000-0000-000000000001', 'Serrurerie Dupont', 'serrurier', '12 rue de la Paix', '75015', 'Paris', '75', 'serrurerie-dupont.fr', 'https://maps.google.com/?q=Serrurerie+Dupont+Paris',
   'Marc Dupont', 'Gérant', '0145220011', '0612345601', 'contact@serrurerie-dupont.fr', null,
   '24h24', 48, 4.6, 'petite_equipe', 'haute', '{urgence,reactif}', 'Google Maps',
   'a_rappeler', current_date - 9, current_date - 2, 2,
   'Rappeler pour présenter l''offre', current_date, null, null, null, 'Premier échange positif, demande à être rappelé cette semaine.'),

  ('dec0de00-0000-0000-0000-000000000002', 'SOS Clés 93', 'serrurier', '5 avenue Jean Jaurès', '93200', 'Saint-Denis', '93', null, 'https://maps.google.com/?q=SOS+Cles+93',
   'Nadia Benali', 'Associée', '0148201122', '0623456702', 'nadia@sosclefs93.fr', 'linkedin.com/in/nadia-benali',
   'horaires', 12, 4.1, 'solo', 'moyenne', '{}', 'Pages Jaunes',
   'a_contacter', null, null, 0,
   'Premier appel', current_date, null, null, null, null),

  ('dec0de00-0000-0000-0000-000000000003', 'Dépann''Serrure IDF', 'serrurier', '8 rue des Lilas', '94000', 'Créteil', '94', 'depann-serrure-idf.com', 'https://maps.google.com/?q=Depann+Serrure+IDF',
   'Karim Zidi', 'Gérant', '0149331144', '0634567803', 'karim@depann-serrure-idf.com', null,
   '24h24', 86, 4.8, 'reseau', 'haute', '{reseau,multi-agences}', 'Recommandation',
   'rdv_planifie', current_date - 14, current_date - 1, 3,
   'Confirmer le RDV visio', current_date + 2, null, (current_date + 2 + time '14:00')::timestamptz, 'visio', 'RDV visio pris pour présenter l''automatisation des leads entrants.'),

  ('dec0de00-0000-0000-0000-000000000004', 'Clé Express Paris', 'serrurier', '21 boulevard Voltaire', '75011', 'Paris', '75', null, 'https://maps.google.com/?q=Cle+Express+Paris',
   'Julien Petit', 'Gérant', null, '0645678904', 'julien.petit@cleexpress-paris.fr', null,
   'horaires', 23, 3.9, 'solo', 'basse', '{}', 'Google Maps',
   'pas_de_reponse', current_date - 5, current_date - 5, 1,
   'Rappeler à un autre horaire', current_date + 1, null, null, null, 'Tombé sur messagerie, réessayer en fin de matinée.'),

  ('dec0de00-0000-0000-0000-000000000005', 'Serrurerie du Centre', 'serrurier', '3 place de la Mairie', '77000', 'Melun', '77', 'serrurerie-du-centre77.fr', null,
   'Sophie Lambert', 'Gérante', '0164112255', '0656789005', 'contact@serrurerie-centre77.fr', null,
   'horaires', 34, 4.3, 'petite_equipe', 'moyenne', '{reactif}', 'LinkedIn',
   'interesse', current_date - 7, current_date - 3, 2,
   'Envoyer la proposition', current_date + 1, null, null, null, 'Veut voir un exemple concret avant de s''engager.'),

  ('dec0de00-0000-0000-0000-000000000006', 'Ouverture Express', 'serrurier', '17 rue de Versailles', '78000', 'Versailles', '78', null, 'https://maps.google.com/?q=Ouverture+Express+Versailles',
   'Thomas Garnier', 'Gérant', '0139221166', '0667890106', null, null,
   '24h24', 9, 3.7, 'solo', 'basse', '{}', 'Appel à froid',
   'refuse', current_date - 20, current_date - 18, 2,
   null, null, 'deja_equipe', null, null, 'Travaille déjà avec une agence web locale.'),

  ('dec0de00-0000-0000-0000-000000000007', 'Serrurerie Lefèvre', 'serrurier', '9 rue du Marché', '91000', 'Évry-Courcouronnes', '91', 'serrurerie-lefevre.fr', 'https://maps.google.com/?q=Serrurerie+Lefevre+Evry',
   'Isabelle Lefèvre', 'Gérante', '0160443377', '0678901207', 'isabelle@serrurerie-lefevre.fr', 'linkedin.com/in/isabelle-lefevre',
   'horaires', 61, 4.5, 'petite_equipe', 'haute', '{reactif,qualite}', 'Google Maps',
   'rdv_effectue', current_date - 15, current_date - 4, 4,
   'Relancer après le RDV', current_date + 3, null, (current_date - 4 + time '10:30')::timestamptz, 'sur_place', 'RDV effectué sur place, très intéressée, doit valider en interne.'),

  ('dec0de00-0000-0000-0000-000000000008', 'Multi-Services Métal', 'serrurier', '44 avenue de la République', '92100', 'Boulogne-Billancourt', '92', 'multiservicesmetal.fr', null,
   'Yannick Roche', 'Associé', '0146771188', '0689012308', 'yannick@multiservicesmetal.fr', null,
   'horaires', 5, 3.2, 'solo', 'basse', '{}', 'Pages Jaunes',
   'ne_plus_contacter', current_date - 30, current_date - 28, 1,
   null, null, 'autre', null, null, 'A demandé explicitement à ne plus être contacté.'),

  ('dec0de00-0000-0000-0000-000000000009', 'Urgence Serrure 94', 'serrurier', '2 rue Pasteur', '94700', 'Maisons-Alfort', '94', null, 'https://maps.google.com/?q=Urgence+Serrure+94',
   'Fatou Diallo', 'Gérante', '0143990099', '0690123409', 'contact@urgenceserrure94.fr', null,
   '24h24', 29, 4.4, 'petite_equipe', 'moyenne', '{urgence}', 'Recommandation',
   'proposition_envoyee', current_date - 11, current_date - 6, 3,
   'Relancer sur la proposition', current_date - 1, null, null, null, 'Devis envoyé par email, en attente de retour.'),

  ('dec0de00-0000-0000-0000-000000000010', 'Serrurerie Moderne', 'serrurier', '30 rue de Paris', '95000', 'Cergy', '95', 'serrurerie-moderne95.fr', 'https://maps.google.com/?q=Serrurerie+Moderne+Cergy',
   'Antoine Mercier', 'Gérant', '0134330055', '0601234510', 'antoine@serrurerie-moderne95.fr', null,
   '24h24', 77, 4.7, 'reseau', 'haute', '{reseau,reactif}', 'Google Maps',
   'gagne', current_date - 25, current_date - 10, 5,
   null, null, null, null, null, 'Client signé — automatisation de la prise de RDV en place.');

insert into interactions (prospect_id, date_heure, type, resultat, statut_avant, statut_apres, note) values
  ('dec0de00-0000-0000-0000-000000000001', now() - interval '9 days', 'appel', 'Intéressé, demande à être rappelé', 'a_contacter', 'interesse', 'Bon contact, dispo pour en discuter.'),
  ('dec0de00-0000-0000-0000-000000000001', now() - interval '2 days', 'appel', 'Pas disponible, rappeler', 'interesse', 'a_rappeler', 'Au milieu d''une intervention, a demandé de rappeler.'),

  ('dec0de00-0000-0000-0000-000000000003', now() - interval '14 days', 'appel', 'Intéressé', 'a_contacter', 'interesse', 'Très ouvert à l''automatisation des demandes entrantes.'),
  ('dec0de00-0000-0000-0000-000000000003', now() - interval '1 days', 'appel', 'RDV visio planifié', 'interesse', 'rdv_planifie', 'RDV fixé dans 2 jours à 14h en visio.'),

  ('dec0de00-0000-0000-0000-000000000004', now() - interval '5 days', 'appel', 'Pas de réponse', 'a_contacter', 'pas_de_reponse', 'Messagerie, réessayer plus tard.'),

  ('dec0de00-0000-0000-0000-000000000005', now() - interval '7 days', 'appel', 'Intéressé', 'a_contacter', 'interesse', 'Veut un exemple concret avant de s''engager.'),
  ('dec0de00-0000-0000-0000-000000000005', now() - interval '3 days', 'email', 'Envoi d''un exemple de dashboard', null, null, 'Envoyé un exemple de tableau de suivi de leads.'),

  ('dec0de00-0000-0000-0000-000000000006', now() - interval '20 days', 'appel', 'Pas intéressé dans l''immédiat', 'a_contacter', 'a_rappeler', null),
  ('dec0de00-0000-0000-0000-000000000006', now() - interval '18 days', 'appel', 'Refusé : déjà équipé', 'a_rappeler', 'refuse', 'Travaille déjà avec une agence locale.'),

  ('dec0de00-0000-0000-0000-000000000007', now() - interval '15 days', 'appel', 'Intéressé', 'a_contacter', 'interesse', null),
  ('dec0de00-0000-0000-0000-000000000007', now() - interval '4 days', 'rdv', 'RDV effectué sur place', 'rdv_planifie', 'rdv_effectue', 'Très bon échange, doit valider en interne avant de signer.'),

  ('dec0de00-0000-0000-0000-000000000008', now() - interval '28 days', 'appel', 'Demande explicite de ne plus être contacté', 'a_rappeler', 'ne_plus_contacter', 'Opposition RGPD — ne plus jamais recontacter.'),

  ('dec0de00-0000-0000-0000-000000000009', now() - interval '6 days', 'email', 'Devis envoyé', 'interesse', 'proposition_envoyee', 'Proposition envoyée par email suite à l''appel.'),

  ('dec0de00-0000-0000-0000-000000000010', now() - interval '10 days', 'rdv', 'Signature', 'proposition_envoyee', 'gagne', 'Contrat signé, mise en place de l''automatisation en cours.');
