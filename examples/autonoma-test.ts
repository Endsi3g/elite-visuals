/**
 * Exemple d'utilisation de l'intégration Autonoma
 * 
 * Autonoma permet d'exécuter des tests automatisés sur votre application
 * déployée pour vérifier le bon fonctionnement après chaque déploiement.
 */

import { triggerTestRun, getTestRunStatus } from '../lib/autonoma';

async function runAutonomaTests() {
  try {
    console.log('🧪 Démarrage des tests Autonoma...');

    // 1. Déclencher un test
    const testRun = await triggerTestRun('your-test-id', {
      environment_application_version_id: 'v1.0.0',
      runtime_metadata: {
        deployment: 'production',
        timestamp: new Date().toISOString(),
      },
      source: 'api',
    });

    console.log('✅ Test démarré:', testRun.id);

    // 2. Attendre et vérifier le statut
    let status = await getTestRunStatus(testRun.id);
    
    while (status.status === 'running') {
      console.log('⏳ Test en cours...');
      await new Promise(resolve => setTimeout(resolve, 5000)); // Attendre 5 secondes
      status = await getTestRunStatus(testRun.id);
    }

    // 3. Afficher le résultat
    if (status.status === 'passed') {
      console.log('✅ Tests réussis !');
    } else {
      console.error('❌ Tests échoués:', status);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des tests:', error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  runAutonomaTests();
}

export { runAutonomaTests };
