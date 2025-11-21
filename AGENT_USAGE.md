# 🤖 Guide d'Utilisation de l'Agent d'Audit Elite Visuals

## 🚀 Démarrage Rapide

### Commande Simple (Recommandée)

```bash
npm run audit:full
```

Cette commande va automatiquement:
1. ✅ Analyser tous les fichiers Markdown
2. 🔗 Valider les connexions entre composants  
3. 🧪 Exécuter les tests
4. 📊 Générer des rapports détaillés
5. ⏸️ S'arrêter avant le commit (pour review)

### Avec Commit Automatique

```bash
npm run audit:full:commit
```

⚠️ **Attention**: Cette commande commit et push automatiquement sur GitHub!

## 📋 Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm run audit:full` | Audit complet sans commit |
| `npm run audit:full:commit` | Audit complet avec commit/push auto |
| `npm run audit:project` | Analyse des fichiers MD uniquement |
| `npm run audit:connections` | Validation des connexions uniquement |

## 📊 Rapports Générés

Après l'exécution, consultez:

### 1. PROJECT_AUDIT_REPORT.md
- Liste des fichiers Markdown analysés
- Fichiers à conserver vs supprimer
- Analyse des composants
- Recommandations

### 2. CONNECTION_VALIDATION_REPORT.md
- Validation des imports
- Imports cassés détectés
- Composants inutilisés
- Statistiques de connexion

### 3. .backup-md-files/
- Backup automatique des fichiers supprimés
- Restauration facile si nécessaire

## 🎯 Workflow Recommandé

### Étape 1: Premier Audit
```bash
npm run audit:full
```

### Étape 2: Review des Rapports
```bash
# Lire le rapport d'audit
cat PROJECT_AUDIT_REPORT.md

# Lire le rapport de validation
cat CONNECTION_VALIDATION_REPORT.md

# Vérifier les backups
ls .backup-md-files/
```

### Étape 3: Vérifier les Changements
```bash
git status
git diff
```

### Étape 4: Commit (si tout est OK)
```bash
git add .
git commit -m "🤖 Audit complet: Nettoyage et validation"
git push origin main
```

Ou utilisez:
```bash
npm run audit:full:commit
```

## 🔍 Ce que l'Agent Fait

### Analyse des Fichiers Markdown

L'agent catégorise automatiquement:

- ✅ **Essentiels**: README.md, CONTRIBUTING.md, LICENSE, etc.
- 🗑️ **Redondants**: Fichiers de fixes temporaires, summaries multiples
- ⏰ **Obsolètes**: Fichiers TODO, WIP, temp, backup
- 📋 **Dupliqués**: Guides répétés (QUICK_START, DEPLOYMENT, etc.)

### Validation des Connexions

L'agent vérifie:

- 🔗 Tous les imports entre composants
- ⚠️ Imports cassés ou manquants
- 🔍 Composants potentiellement inutilisés
- 📊 Statistiques de connexion

### Tests Automatiques

L'agent exécute:

- 🧪 Tests unitaires (Jest)
- 🎭 Tests E2E (Playwright)
- ✅ Validation post-nettoyage

## 💡 Exemples d'Utilisation

### Audit Hebdomadaire
```bash
# Chaque lundi matin
npm run audit:full
```

### Avant un Déploiement
```bash
# Vérifier que tout est OK
npm run audit:full
npm run test:all
npm run build
```

### Après des Modifications Majeures
```bash
# Valider les connexions
npm run audit:connections

# Si OK, audit complet
npm run audit:full:commit
```

## 🛠️ Dépannage

### Problème: "ts-node not found"

**Solution:**
```bash
npm install
```

### Problème: "Cannot find module"

**Solution:**
```bash
npm install
npm run audit:full
```

### Problème: Tests échouent

**Solution:**
```bash
# Exécuter les tests manuellement
npm run test
npm run test:e2e

# Corriger les erreurs
# Puis relancer l'audit
npm run audit:full
```

### Problème: Git push échoue

**Solution:**
```bash
# Vérifier le statut
git status

# Commit manuellement
git add .
git commit -m "🤖 Audit automatique"
git push origin main
```

### Restaurer des Fichiers Supprimés

```bash
# Les fichiers sont dans .backup-md-files/
cp .backup-md-files/FILENAME.md ./
```

## 📈 Métriques Suivies

L'agent génère automatiquement:

- 📊 Nombre de fichiers analysés
- 🗑️ Fichiers supprimés vs conservés  
- 🔗 Taux de connexion des composants
- ⚠️ Problèmes détectés
- ✅ Taux de réussite des tests

## 🎓 Bonnes Pratiques

### 1. Exécuter Régulièrement
```bash
# Recommandé: une fois par semaine
npm run audit:full
```

### 2. Toujours Review Avant Commit
Ne jamais utiliser `--auto-commit` sans avoir vérifié les rapports.

### 3. Garder les Backups
Les backups sont dans `.backup-md-files/` - ne pas supprimer ce dossier.

### 4. Tester Après Nettoyage
```bash
npm run test:all
npm run dev
```

### 5. Documenter les Changements
Mettre à jour le CHANGELOG.md après chaque audit majeur.

## 🔮 Fonctionnalités Avancées

### Personnaliser les Critères

Éditez `scripts/project-audit-agent.ts`:

```typescript
// Ajouter des fichiers à toujours garder
const essentialFiles = [
  'README.md',
  'YOUR_FILE.md'
];

// Modifier les mots-clés de détection
const redundantKeywords = [
  'fix', 'temp', 'your_keyword'
];
```

### Intégration CI/CD

Ajoutez dans `.github/workflows/audit.yml`:

```yaml
name: Weekly Audit
on:
  schedule:
    - cron: '0 0 * * 0'
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run audit:full
```

## 📚 Documentation Complète

Pour plus de détails, consultez:
- [`docs/AGENT_AUDIT.md`](./docs/AGENT_AUDIT.md) - Documentation complète
- [`PROJECT_AUDIT_REPORT.md`](./PROJECT_AUDIT_REPORT.md) - Dernier rapport
- [`CONNECTION_VALIDATION_REPORT.md`](./CONNECTION_VALIDATION_REPORT.md) - Validation

## 💬 Support

En cas de problème:

1. Consultez les rapports générés
2. Vérifiez les logs dans la console
3. Ouvrez une issue sur GitHub
4. Contactez l'équipe Elite Visuals

## 🎉 Résultat Attendu

Après l'exécution de l'agent:

- ✅ Documentation consolidée et à jour
- ✅ Aucun fichier Markdown redondant
- ✅ Tous les composants correctement connectés
- ✅ Tests passent avec succès
- ✅ Projet prêt pour le déploiement

---

**Créé avec ❤️ par Elite Visuals - Automatisation Intelligente**
