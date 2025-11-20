# 🧪 Intégration Autonoma - Elite Visuals

## Vue d'Ensemble

Autonoma est intégré pour exécuter des tests automatisés sur votre application déployée. Cela permet de vérifier le bon fonctionnement après chaque déploiement.

## 📋 Configuration

### 1. Variables d'Environnement

Ajoutez ces variables à votre `.env.local` et sur Vercel :

```env
AUTONOMA_CLIENT_ID=your_autonoma_client_id
AUTONOMA_CLIENT_SECRET=your_autonoma_client_secret
```

### 2. Obtenir les Credentials

1. Créez un compte sur [Autonoma.app](https://autonoma.app)
2. Allez dans Settings > API Keys
3. Créez une nouvelle clé API
4. Copiez le Client ID et Client Secret

### 3. Configurer sur Vercel

```bash
# Via CLI
vercel env add AUTONOMA_CLIENT_ID production
vercel env add AUTONOMA_CLIENT_SECRET production

# Ou via l'interface Vercel
# Settings > Environment Variables
```

## 🚀 Utilisation

### API TypeScript

Le fichier `lib/autonoma.ts` fournit deux fonctions principales :

#### 1. Déclencher un Test

```typescript
import { triggerTestRun } from '@/lib/autonoma';

const result = await triggerTestRun('test-id-123', {
  environment_application_version_id: 'v1.0.0',
  runtime_metadata: {
    deployment: 'production',
    timestamp: new Date().toISOString(),
  },
  source: 'api',
});

console.log('Test démarré:', result.id);
```

#### 2. Vérifier le Statut

```typescript
import { getTestRunStatus } from '@/lib/autonoma';

const status = await getTestRunStatus('run-id-456');

if (status.status === 'passed') {
  console.log('✅ Tests réussis !');
} else if (status.status === 'failed') {
  console.error('❌ Tests échoués');
}
```

### Script NPM

Un script est disponible pour exécuter les tests :

```bash
npm run test:autonoma
```

### Exemple Complet

Voir `examples/autonoma-test.ts` pour un exemple complet avec :
- Déclenchement du test
- Polling du statut
- Gestion des erreurs
- Affichage des résultats

## 🔄 Intégration CI/CD

### Option 1 : GitHub Actions

Ajoutez un step dans `.github/workflows/deploy.yml` :

```yaml
- name: Run Autonoma Tests
  run: npm run test:autonoma
  env:
    AUTONOMA_CLIENT_ID: ${{ secrets.AUTONOMA_CLIENT_ID }}
    AUTONOMA_CLIENT_SECRET: ${{ secrets.AUTONOMA_CLIENT_SECRET }}
```

### Option 2 : Vercel Deploy Hook

Créez un webhook Autonoma qui se déclenche après chaque déploiement Vercel :

1. Vercel > Settings > Git > Deploy Hooks
2. Créez un hook "Post-Deploy"
3. Configurez Autonoma pour appeler ce hook

### Option 3 : Script Post-Deploy

```bash
# deploy-and-test.sh
#!/bin/bash

echo "🚀 Déploiement..."
vercel --prod

echo "🧪 Exécution des tests..."
npm run test:autonoma

if [ $? -eq 0 ]; then
  echo "✅ Déploiement et tests réussis !"
else
  echo "❌ Tests échoués, rollback recommandé"
  exit 1
fi
```

## 📊 Types de Tests Recommandés

### 1. Tests de Smoke

Vérifier que l'application se charge :
- Page d'accueil accessible
- Assets chargés
- Pas d'erreurs JavaScript

### 2. Tests Fonctionnels

Vérifier les fonctionnalités principales :
- Board Konva s'affiche
- Drag & drop fonctionne
- Kanban interactif
- Upload de fichiers

### 3. Tests d'Intégration

Vérifier les intégrations externes :
- Supabase connecté
- Images chargées
- API Anthropic répond
- Luma AI accessible

### 4. Tests de Performance

Vérifier les performances :
- Temps de chargement < 3s
- First Contentful Paint < 1.5s
- Time to Interactive < 5s

## 🐛 Dépannage

### Erreur : "API error: 401"

Vérifiez que vos credentials sont corrects :

```bash
# Tester localement
AUTONOMA_CLIENT_ID=your_id AUTONOMA_CLIENT_SECRET=your_secret npm run test:autonoma
```

### Erreur : "Test timeout"

Le test prend trop de temps. Augmentez le timeout :

```typescript
// Dans autonoma-test.ts
await new Promise(resolve => setTimeout(resolve, 10000)); // 10 secondes
```

### Erreur : "Module not found: node-fetch"

`node-fetch` est déjà installé. Si l'erreur persiste :

```bash
npm install node-fetch@2
```

## 📚 Ressources

- [Documentation Autonoma](https://autonoma.app/docs)
- [API Reference](https://autonoma.app/docs/api)
- [Exemples de Tests](https://autonoma.app/examples)

## 🔐 Sécurité

- ❌ Ne jamais commit les credentials dans le code
- ✅ Utiliser les variables d'environnement
- ✅ Utiliser les secrets Vercel pour la production
- ✅ Restreindre les permissions API au minimum nécessaire

## 💡 Bonnes Pratiques

1. **Exécuter les tests après chaque déploiement**
2. **Configurer des alertes en cas d'échec**
3. **Garder les tests rapides (< 2 minutes)**
4. **Tester les parcours utilisateurs critiques**
5. **Documenter les tests dans Autonoma**

---

**Besoin d'aide ?** Consultez la [documentation Autonoma](https://autonoma.app/docs) ou contactez le support.
