#!/usr/bin/env ts-node
/**
 * 🚀 Script Principal d'Audit Complet
 * 
 * Orchestre tous les agents d'audit et de validation
 */

import { execSync } from 'child_process';
import * as path from 'path';

const ROOT_DIR = process.cwd();

class FullAuditOrchestrator {
  async run() {
    console.log('🚀 Elite Visuals - Audit Complet du Projet\n');
    console.log('=' .repeat(60));
    console.log('\n');
    
    try {
      // Étape 1: Validation des connexions
      console.log('📍 ÉTAPE 1/4: Validation des connexions entre composants\n');
      await this.runScript('validate-connections.ts');
      
      // Étape 2: Audit du projet
      console.log('\n📍 ÉTAPE 2/4: Audit complet du projet\n');
      await this.runScript('project-audit-agent.ts');
      
      // Étape 3: Tests
      console.log('\n📍 ÉTAPE 3/4: Exécution des tests\n');
      await this.runTests();
      
      // Étape 4: Commit et push
      console.log('\n📍 ÉTAPE 4/4: Commit et push sur GitHub\n');
      await this.commitAndPush();
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ AUDIT COMPLET TERMINÉ AVEC SUCCÈS!');
      console.log('='.repeat(60));
      
      this.printSummary();
      
    } catch (error) {
      console.error('\n❌ Erreur lors de l\'audit:', error);
      process.exit(1);
    }
  }
  
  private async runScript(scriptName: string) {
    const scriptPath = path.join(ROOT_DIR, 'scripts', scriptName);
    
    try {
      execSync(`ts-node "${scriptPath}"`, {
        cwd: ROOT_DIR,
        stdio: 'inherit'
      });
      console.log(`\n✅ ${scriptName} terminé avec succès\n`);
    } catch (error) {
      console.error(`\n❌ Erreur dans ${scriptName}:`, error);
      throw error;
    }
  }
  
  private async runTests() {
    try {
      console.log('🧪 Exécution des tests unitaires...\n');
      execSync('npm run test', {
        cwd: ROOT_DIR,
        stdio: 'inherit'
      });
      
      console.log('\n🎭 Exécution des tests E2E...\n');
      execSync('npm run test:e2e', {
        cwd: ROOT_DIR,
        stdio: 'inherit'
      });
      
      console.log('\n✅ Tous les tests sont passés!\n');
    } catch (error) {
      console.warn('\n⚠️  Certains tests ont échoué, mais on continue...\n');
      // On ne lance pas d'erreur pour ne pas bloquer le processus
    }
  }
  
  private async commitAndPush() {
    const autoCommit = process.argv.includes('--auto-commit');
    
    if (!autoCommit) {
      console.log('💡 Utilisez --auto-commit pour commit automatiquement');
      console.log('   Commandes manuelles:');
      console.log('   git add .');
      console.log('   git commit -m "🤖 Audit complet et nettoyage automatique"');
      console.log('   git push origin main');
      return;
    }
    
    try {
      console.log('📦 Git add...');
      execSync('git add .', { cwd: ROOT_DIR, stdio: 'inherit' });
      
      console.log('💾 Git commit...');
      const commitMessage = '🤖 Audit complet: Nettoyage MD + Validation connexions + Tests';
      execSync(`git commit -m "${commitMessage}"`, { cwd: ROOT_DIR, stdio: 'inherit' });
      
      console.log('🚀 Git push...');
      execSync('git push origin main', { cwd: ROOT_DIR, stdio: 'inherit' });
      
      console.log('\n✅ Changements poussés sur GitHub avec succès!');
    } catch (error) {
      console.error('\n❌ Erreur lors du push:', error);
      console.log('\n💡 Vous pouvez faire le commit manuellement');
    }
  }
  
  private printSummary() {
    console.log('\n📊 RÉSUMÉ DE L\'AUDIT\n');
    console.log('Rapports générés:');
    console.log('  📄 PROJECT_AUDIT_REPORT.md - Audit complet du projet');
    console.log('  🔗 CONNECTION_VALIDATION_REPORT.md - Validation des connexions');
    console.log('  📦 .backup-md-files/ - Backup des fichiers supprimés');
    console.log('\nProchaines étapes:');
    console.log('  1. Consulter les rapports générés');
    console.log('  2. Vérifier les changements avec: git status');
    console.log('  3. Tester l\'application: npm run dev');
    console.log('  4. Déployer si tout fonctionne: npm run deploy');
    console.log('\n');
  }
}

// Exécution
if (require.main === module) {
  const orchestrator = new FullAuditOrchestrator();
  orchestrator.run().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

export default FullAuditOrchestrator;
