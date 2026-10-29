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
   dans l'ordre les deux fichiers de `supabase/migrations/` :
   - `20261029090000_init_schema.sql` — tables `prospects` et
     `interactions`, colonne `user_id` sur chacune, Row Level Security
     (chaque utilisateur ne voit et ne modifie que ses propres lignes).
   - `20261029090100_seed_demo.sql` *(facultatif)* — 10 serruriers fictifs
     + historique, rattachés à ton compte. **Remplace `TON_EMAIL_ICI` par
     l'email de ton compte avant de l'exécuter** (voir étape 3).

   Alternative CLI (si tu préfères) : installe la [Supabase CLI](https://supabase.com/docs/guides/cli),
   puis `supabase link --project-ref qbqgkalupatoszpkreon` et
   `supabase db push` depuis la racine du projet — ça applique les mêmes
   fichiers de `supabase/migrations/`.
3. Dans *Authentication > Users*, crée manuellement ton utilisateur
   (email + mot de passe). Il n'y a pas d'inscription publique dans l'app.
   C'est cet email qu'il faut mettre dans le script de seed à l'étape 2.
4. Copie `.env.example` en `.env.local` et renseigne, depuis
   *Project Settings > API* :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` (clé publique "publishable", anciennement
     "anon" — jamais la clé secrète `service_role`)
5. Relance `npm run dev`. L'écran de connexion apparaît ; connecte-toi avec
   le compte créé à l'étape 3.

Les migrations sont idempotentes (peuvent être relancées sans dupliquer les
tables/politiques). Row Level Security est active sur les deux tables avec
une politique `auth.uid() = user_id` : un utilisateur authentifié ne peut
lire, créer, modifier ou supprimer que ses propres prospects/interactions —
y compris si une autre personne utilise un jour le même projet Supabase.
Les écritures (import CSV compris) passent par `src/lib/db/supabaseRepo.js`,
qui tague automatiquement `user_id` avec l'utilisateur connecté ; la base
rejette toute tentative d'écrire pour quelqu'un d'autre.

### Tester que la connexion fonctionne

1. `npm run dev`, ouvre `http://localhost:5173` — l'écran de connexion doit
   apparaître (pas le mode démo) : ça confirme que `.env.local` est bien lu.
2. Connecte-toi avec le compte créé à l'étape 3 ci-dessus.
3. Si tu as exécuté le script de seed, tes 10 serruriers de démo doivent
   apparaître dans **Prospects**. Modifie-en un, ou passe une carte d'une
   colonne à l'autre dans **Pipeline** : rafraîchis la page, le changement
   doit persister (preuve que ça écrit bien dans Supabase, pas en local).
4. Ouvre la même URL depuis ton téléphone (même réseau, ou une fois déployée
   en ligne) et connecte-toi avec le même compte : tu dois voir exactement
   les mêmes prospects, à jour en temps réel après rafraîchissement.
5. Dans Supabase, *Table Editor > prospects*, vérifie que chaque ligne a
   bien un `user_id` renseigné (égal à ton UID dans *Authentication > Users*).

### Déploiement en ligne (Authentication > URL Configuration)

Quand tu déploies l'app (Vercel, Netlify, etc.), pense à configurer dans
Supabase *Authentication > URL Configuration* :
- **Site URL** : l'URL de prod (ex. `https://app.okto-agency.fr`).
- **Redirect URLs** : ajoute l'URL de prod (et `http://localhost:5173` pour
  continuer à développer en local) à la liste des URLs autorisées.

Cette app n'utilise que l'email/mot de passe (pas de lien magique ni
OAuth), donc ces réglages ne sont pas bloquants pour la connexion
elle-même, mais Supabase s'en sert pour toute fonctionnalité future basée
sur un lien (réinitialisation de mot de passe, confirmation d'email) — à
régler avant d'en activer une.

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
- Partage en équipe si Okto Agency grandit : la RLS actuelle isole déjà
  chaque utilisateur (il faudrait un modèle d'organisation/équipe pour
  partager des prospects entre plusieurs comptes).
- Graphiques natifs (courbes d'évolution dans le temps) si les listes à
  barres du tableau de bord deviennent limitantes.
