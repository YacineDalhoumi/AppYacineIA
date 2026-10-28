# Yacine CRM — suivi de prospection (Okto Agency)

Mini-CRM de prospection par cold call pour Okto Agency. Pipeline de
qualification à 10 statuts, session d'appels mobile-first, tableau de bord
d'activité, import/export CSV. React 18 + Vite, Supabase (Postgres + Auth).

## Lancer le projet en local

```bash
npm install
npm run dev
```

L'app est servie sur `http://localhost:5173`.

### Mode démo (sans Supabase)

Si `.env.local` n'existe pas ou est incomplet, l'app démarre automatiquement
en **mode démo local** : données en mémoire (10 serruriers fictifs),
persistées en `localStorage` pour la durée des tests, pas d'écran de
connexion. Pratique pour explorer l'interface avant de configurer Supabase —
mais rien n'est partagé entre appareils ni réellement protégé.

### Connecter Supabase (recommandé)

1. Crée un projet gratuit sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL du projet (*SQL Editor > New query*), colle et exécute
   `supabase/schema.sql`, puis `supabase/seed.sql` (10 serruriers fictifs +
   historique, facultatif mais pratique pour tester tout de suite).
3. Dans *Authentication > Users*, crée manuellement ton utilisateur
   (email + mot de passe). Il n'y a pas d'inscription publique dans l'app.
4. Copie `.env.example` en `.env.local` et renseigne, depuis
   *Project Settings > API* :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` (clé publique "anon", pas la clé `service_role`)
5. Relance `npm run dev`. L'écran de connexion apparaît ; connecte-toi avec
   le compte créé à l'étape 3.

`supabase/schema.sql` est idempotent (peut être relancé sans dupliquer les
tables) et active Row Level Security : seules les requêtes authentifiées
peuvent lire/écrire `prospects` et `interactions`.

## Import CSV

Depuis **Prospects > Importer**, choisis un fichier `.csv` avec une ligne
d'en-têtes. Séparateur `,` ou `;` auto-détecté. Encodage UTF-8 recommandé.

Seule la colonne **`nom`** est obligatoire ; les autres sont optionnelles
(valeur par défaut appliquée si absente ou invalide) :

| Colonne | Valeurs attendues |
|---|---|
| `nom` | texte (obligatoire) |
| `metier` | `serrurier`, `plombier`, `vitrier`, `electricien`, `multi_metiers`, `autre` |
| `adresse`, `code_postal`, `ville`, `departement` | texte libre |
| `site_web`, `fiche_google_url` | URL |
| `contact_nom`, `contact_fonction` | texte libre |
| `telephone_fixe`, `telephone_mobile` | texte (tout format, normalisé à l'import) |
| `email`, `linkedin_url` | texte libre |
| `disponibilite` | `24h24` ou `horaires` |
| `nb_avis_google` | nombre entier |
| `note_google` | nombre (ex. `4.5`) |
| `taille_estimee` | `solo`, `petite_equipe`, `reseau` |
| `priorite` | `haute`, `moyenne`, `basse` |
| `tags` | tags séparés par `\|` (ex. `urgence\|reactif`) |
| `source` | texte libre (ex. `Google Maps`) |
| `statut` | un des 10 statuts du pipeline (ex. `a_contacter`), sinon `a_contacter` par défaut |
| `notes` | texte libre |

**Détection des doublons :** un prospect du fichier est ignoré (et listé
dans le rapport) si son téléphone fixe ou mobile (normalisé : espaces,
points, tirets retirés, `+33` converti en `0`) correspond déjà à un
prospect existant — ou à un autre prospect du même fichier. Le rapport
d'import indique le nombre de prospects créés, les doublons ignorés et les
lignes en erreur (ex. `nom` manquant).

**Export** : le bouton **Exporter** de la page Prospects télécharge un CSV
avec les mêmes colonnes, pour la liste actuellement filtrée.

## Pipeline de prospection

```
À contacter → Pas de réponse / messagerie → À rappeler → Intéressé
→ RDV planifié → RDV effectué → Proposition envoyée → Gagné (client)
                                                      ↘ Refusé
                                                      ↘ Ne plus contacter
```

`Ne plus contacter` (opposition RGPD) est exclu de toutes les files d'appel
(Session d'appels, À faire aujourd'hui) — le prospect reste visible dans
Prospects/Pipeline pour traçabilité mais n'est plus jamais proposé à la
relance.

Chaque changement de statut (glisser-déposer dans Pipeline, boutons de la
Session d'appels, sélecteur de statut dans la fiche prospect) crée
automatiquement une ligne dans l'historique des interactions.

## Améliorations possibles

- Notifications/rappels (navigateur ou mobile) pour les relances du jour.
- Envoi d'emails directement depuis la fiche prospect (proposition, suivi).
- Automatisations n8n : webhook à chaque changement de statut (ex. "Gagné"
  → création auto d'un projet, notification Slack...).
- Enrichissement automatique des prospects (API Google Places pour avis/
  note, SIRENE pour les données d'entreprise).
- Rôles/multi-utilisateurs si l'équipe grandit (RLS actuelle = un seul
  utilisateur authentifié a accès à tout).
- Graphiques natifs (courbes d'évolution dans le temps) si les listes à
  barres du tableau de bord deviennent limitantes.
