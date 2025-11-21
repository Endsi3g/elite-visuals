#!/usr/bin/env ts-node
/**
 * 🤖 Agent d'Audit et de Nettoyage du Projet Elite Visuals
 * 
 * Fonctionnalités:
 * 1. Analyse complète de la structure du projet
 * 2. Détection des fichiers Markdown redondants/inutiles
 * 3. Validation des connexions entre composants
 * 4. Génération de documentation consolidée
 * 5. Nettoyage automatique avec backup
 * 6. Commit et push sur GitHub
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Configuration
const ROOT_DIR = process.cwd();
const BACKUP_DIR = path.join(ROOT_DIR, '.backup-md-files');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const OUTPUT_FILE = path.join(ROOT_DIR, 'PROJECT_AUDIT_REPORT.md');

interface FileAnalysis {
  path: string;
  size: number;
  lines: number;
  content: string;
  category: 'essential' | 'redundant' | 'outdated' | 'duplicate';
  reason: string;
}

interface ComponentAnalysis {
  name: string;
  path: string;
  imports: string[];
  exports: string[];
  usedBy: string[];
  issues: string[];
}

interface ProjectAudit {
  timestamp: string;
  markdownFiles: FileAnalysis[];
  components: ComponentAnalysis[];
  connections: Map<string, string[]>;
  recommendations: string[];
  filesToDelete: string[];
  filesToKeep: string[];
}

class ProjectAuditAgent {
  private audit: ProjectAudit;
  
  constructor() {
    this.audit = {
      timestamp: new Date().toISOString(),
      markdownFiles: [],
      components: [],
      connections: new Map(),
      recommendations: [],
      filesToDelete: [],
      filesToKeep: []
    };
  }

  /**
   * Point d'entrée principal
   */
  async run() {
    console.log('🤖 Agent d\'Audit Elite Visuals - Démarrage...\n');
    
    try {
      // Étape 1: Analyser les fichiers Markdown
      console.log('📄 Étape 1/6: Analyse des fichiers Markdown...');
      await this.analyzeMarkdownFiles();
      
      // Étape 2: Analyser les composants
      console.log('🔍 Étape 2/6: Analyse des composants et connexions...');
      await this.analyzeComponents();
      
      // Étape 3: Valider les connexions
      console.log('🔗 Étape 3/6: Validation des connexions entre composants...');
      await this.validateConnections();
      
      // Étape 4: Générer les recommandations
      console.log('💡 Étape 4/6: Génération des recommandations...');
      await this.generateRecommendations();
      
      // Étape 5: Générer le rapport
      console.log('📊 Étape 5/6: Génération du rapport d\'audit...');
      await this.generateReport();
      
      // Étape 6: Nettoyage (si confirmé)
      console.log('🧹 Étape 6/6: Nettoyage des fichiers redondants...');
      await this.cleanupRedundantFiles();
      
      console.log('\n✅ Audit terminé avec succès!');
      console.log(`📊 Rapport généré: ${OUTPUT_FILE}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'audit:', error);
      process.exit(1);
    }
  }

  /**
   * Analyse tous les fichiers Markdown du projet
   */
  private async analyzeMarkdownFiles() {
    const mdFiles = this.findMarkdownFiles(ROOT_DIR);
    
    for (const filePath of mdFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').length;
      const size = fs.statSync(filePath).size;
      
      const analysis: FileAnalysis = {
        path: filePath.replace(ROOT_DIR, ''),
        size,
        lines,
        content: content.substring(0, 500), // Premier 500 chars
        category: this.categorizeMarkdownFile(filePath, content),
        reason: this.getCategorizationReason(filePath, content)
      };
      
      this.audit.markdownFiles.push(analysis);
      
      if (analysis.category === 'redundant' || analysis.category === 'outdated') {
        this.audit.filesToDelete.push(analysis.path);
      } else {
        this.audit.filesToKeep.push(analysis.path);
      }
    }
    
    console.log(`   ✓ ${mdFiles.length} fichiers Markdown analysés`);
    console.log(`   ✓ ${this.audit.filesToDelete.length} fichiers à supprimer`);
    console.log(`   ✓ ${this.audit.filesToKeep.length} fichiers à conserver`);
  }

  /**
   * Trouve tous les fichiers Markdown
   */
  private findMarkdownFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      // Ignorer node_modules, .next, .git
      if (file === 'node_modules' || file === '.next' || file === '.git') {
        continue;
      }
      
      if (stat.isDirectory()) {
        this.findMarkdownFiles(filePath, fileList);
      } else if (file.endsWith('.md')) {
        fileList.push(filePath);
      }
    }
    
    return fileList;
  }

  /**
   * Catégorise un fichier Markdown
   */
  private categorizeMarkdownFile(filePath: string, content: string): FileAnalysis['category'] {
    const fileName = path.basename(filePath);
    const lowerContent = content.toLowerCase();
    
    // Fichiers essentiels
    const essentialFiles = [
      'README.md',
      'CONTRIBUTING.md',
      'LICENSE',
      'SECURITY.md',
      'CHANGELOG.md'
    ];
    
    if (essentialFiles.includes(fileName)) {
      return 'essential';
    }
    
    // Fichiers dans docs/ sont généralement à garder
    if (filePath.includes('/docs/') || filePath.includes('\\docs\\')) {
      return 'essential';
    }
    
    // Détection de redondance
    const redundantKeywords = [
      'fix', 'fixes', 'applied', 'completed', 'summary',
      'deploy', 'vercel', 'build', 'setup', 'guide'
    ];
    
    const hasRedundantKeyword = redundantKeywords.some(kw => 
      fileName.toLowerCase().includes(kw)
    );
    
    // Détection de duplication
    const duplicatePatterns = [
      /QUICK.*START/i,
      /DEPLOY/i,
      /SETUP/i,
      /GUIDE/i,
      /IMPLEMENTATION/i
    ];
    
    const isDuplicate = duplicatePatterns.some(pattern => 
      pattern.test(fileName)
    );
    
    // Détection de contenu obsolète
    const outdatedKeywords = [
      'todo', 'wip', 'draft', 'temp', 'old', 'backup'
    ];
    
    const isOutdated = outdatedKeywords.some(kw => 
      fileName.toLowerCase().includes(kw) || lowerContent.includes(kw)
    );
    
    if (isOutdated) return 'outdated';
    if (isDuplicate && hasRedundantKeyword) return 'duplicate';
    if (hasRedundantKeyword) return 'redundant';
    
    return 'essential';
  }

  /**
   * Explique pourquoi un fichier est catégorisé ainsi
   */
  private getCategorizationReason(filePath: string, content: string): string {
    const fileName = path.basename(filePath);
    const category = this.categorizeMarkdownFile(filePath, content);
    
    switch (category) {
      case 'essential':
        if (fileName === 'README.md') return 'Documentation principale du projet';
        if (filePath.includes('/docs/')) return 'Documentation structurée';
        return 'Fichier essentiel pour le projet';
        
      case 'redundant':
        return 'Contient des informations redondantes ou temporaires (fixes, summaries)';
        
      case 'outdated':
        return 'Contenu obsolète ou marqué comme temporaire';
        
      case 'duplicate':
        return 'Duplication d\'informations déjà présentes ailleurs';
        
      default:
        return 'Non catégorisé';
    }
  }

  /**
   * Analyse les composants et leurs imports
   */
  private async analyzeComponents() {
    const componentFiles = this.findComponentFiles(ROOT_DIR);
    
    for (const filePath of componentFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(ROOT_DIR, '');
      
      const component: ComponentAnalysis = {
        name: path.basename(filePath, path.extname(filePath)),
        path: relativePath,
        imports: this.extractImports(content),
        exports: this.extractExports(content),
        usedBy: [],
        issues: []
      };
      
      this.audit.components.push(component);
    }
    
    console.log(`   ✓ ${componentFiles.length} composants analysés`);
  }

  /**
   * Trouve tous les fichiers de composants
   */
  private findComponentFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (file === 'node_modules' || file === '.next' || file === '.git') {
        continue;
      }
      
      if (stat.isDirectory()) {
        this.findComponentFiles(filePath, fileList);
      } else if (file.match(/\.(tsx?|jsx?)$/)) {
        fileList.push(filePath);
      }
    }
    
    return fileList;
  }

  /**
   * Extrait les imports d'un fichier
   */
  private extractImports(content: string): string[] {
    const imports: string[] = [];
    const importRegex = /import\s+(?:{[^}]+}|[^'"]+)\s+from\s+['"]([^'"]+)['"]/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  /**
   * Extrait les exports d'un fichier
   */
  private extractExports(content: string): string[] {
    const exports: string[] = [];
    const exportRegex = /export\s+(?:default\s+)?(?:function|const|class|interface|type)\s+(\w+)/g;
    
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  }

  /**
   * Valide les connexions entre composants
   */
  private async validateConnections() {
    for (const component of this.audit.components) {
      // Trouver qui utilise ce composant
      for (const otherComponent of this.audit.components) {
        if (component.path === otherComponent.path) continue;
        
        const componentName = component.name;
        const isUsed = otherComponent.imports.some(imp => 
          imp.includes(componentName) || imp.includes(component.path)
        );
        
        if (isUsed) {
          component.usedBy.push(otherComponent.name);
        }
      }
      
      // Détecter les problèmes
      if (component.usedBy.length === 0 && !component.path.includes('/app/')) {
        component.issues.push('Composant potentiellement inutilisé');
      }
      
      if (component.imports.length === 0 && component.exports.length === 0) {
        component.issues.push('Aucun import ni export détecté');
      }
    }
    
    const unusedComponents = this.audit.components.filter(c => c.issues.length > 0);
    console.log(`   ✓ ${unusedComponents.length} composants avec des problèmes détectés`);
  }

  /**
   * Génère des recommandations
   */
  private async generateRecommendations() {
    // Recommandations sur les fichiers Markdown
    const redundantCount = this.audit.markdownFiles.filter(f => 
      f.category === 'redundant' || f.category === 'duplicate'
    ).length;
    
    if (redundantCount > 0) {
      this.audit.recommendations.push(
        `🗑️ Supprimer ${redundantCount} fichiers Markdown redondants pour simplifier la documentation`
      );
    }
    
    // Recommandations sur les composants
    const unusedComponents = this.audit.components.filter(c => 
      c.usedBy.length === 0 && !c.path.includes('/app/')
    );
    
    if (unusedComponents.length > 0) {
      this.audit.recommendations.push(
        `⚠️ Vérifier ${unusedComponents.length} composants potentiellement inutilisés`
      );
    }
    
    // Recommandations générales
    this.audit.recommendations.push(
      '📚 Consolider la documentation dans le dossier /docs',
      '🔗 Vérifier que tous les composants critiques sont bien connectés',
      '✅ Exécuter les tests après le nettoyage',
      '🚀 Mettre à jour le README.md avec la structure finale'
    );
    
    console.log(`   ✓ ${this.audit.recommendations.length} recommandations générées`);
  }

  /**
   * Génère le rapport d'audit
   */
  private async generateReport() {
    const report = `# 📊 Rapport d'Audit du Projet Elite Visuals

**Date:** ${new Date(this.audit.timestamp).toLocaleString('fr-FR')}  
**Généré par:** Agent d'Audit Automatisé

---

## 📄 Analyse des Fichiers Markdown

**Total:** ${this.audit.markdownFiles.length} fichiers  
**À conserver:** ${this.audit.filesToKeep.length} fichiers  
**À supprimer:** ${this.audit.filesToDelete.length} fichiers

### Fichiers à Conserver (${this.audit.filesToKeep.length})

${this.audit.filesToKeep.map(f => `- \`${f}\``).join('\n')}

### Fichiers à Supprimer (${this.audit.filesToDelete.length})

${this.audit.filesToDelete.map(f => {
  const analysis = this.audit.markdownFiles.find(a => a.path === f);
  return `- \`${f}\` - ${analysis?.reason || 'Redondant'}`;
}).join('\n')}

---

## 🔍 Analyse des Composants

**Total:** ${this.audit.components.length} composants analysés

### Composants avec Problèmes

${this.audit.components
  .filter(c => c.issues.length > 0)
  .map(c => `
#### ${c.name}
- **Chemin:** \`${c.path}\`
- **Problèmes:** ${c.issues.join(', ')}
- **Utilisé par:** ${c.usedBy.length > 0 ? c.usedBy.join(', ') : 'Aucun'}
`).join('\n') || 'Aucun problème détecté ✅'}

### Statistiques des Connexions

${this.generateConnectionStats()}

---

## 💡 Recommandations

${this.audit.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

---

## 🎯 Actions Suggérées

### Immédiat
1. ✅ Backup des fichiers à supprimer (dans \`.backup-md-files/\`)
2. 🗑️ Supprimer les ${this.audit.filesToDelete.length} fichiers redondants
3. 📝 Mettre à jour le README.md principal
4. 🧪 Exécuter les tests: \`npm run test:all\`

### Court terme
1. 🔗 Vérifier les composants inutilisés
2. 📚 Consolider la documentation dans /docs
3. 🚀 Commit et push sur GitHub

### Long terme
1. 📊 Mettre en place un système de documentation automatique
2. 🤖 Automatiser les audits réguliers
3. 📈 Améliorer la couverture de tests

---

**Rapport généré automatiquement - Elite Visuals © 2024**
`;

    fs.writeFileSync(OUTPUT_FILE, report, 'utf-8');
    console.log(`   ✓ Rapport généré: ${OUTPUT_FILE}`);
  }

  /**
   * Génère les statistiques de connexion
   */
  private generateConnectionStats(): string {
    const totalComponents = this.audit.components.length;
    const connectedComponents = this.audit.components.filter(c => c.usedBy.length > 0).length;
    const isolatedComponents = totalComponents - connectedComponents;
    
    return `
- **Composants connectés:** ${connectedComponents}/${totalComponents} (${Math.round(connectedComponents/totalComponents*100)}%)
- **Composants isolés:** ${isolatedComponents}
- **Moyenne d'imports par composant:** ${Math.round(
  this.audit.components.reduce((sum, c) => sum + c.imports.length, 0) / totalComponents
)}
`;
  }

  /**
   * Nettoie les fichiers redondants
   */
  private async cleanupRedundantFiles() {
    if (this.audit.filesToDelete.length === 0) {
      console.log('   ✓ Aucun fichier à supprimer');
      return;
    }
    
    // Créer le dossier de backup
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    
    console.log(`   📦 Backup de ${this.audit.filesToDelete.length} fichiers...`);
    
    for (const filePath of this.audit.filesToDelete) {
      const fullPath = path.join(ROOT_DIR, filePath);
      const backupPath = path.join(BACKUP_DIR, path.basename(filePath));
      
      try {
        // Backup
        fs.copyFileSync(fullPath, backupPath);
        
        // Supprimer
        fs.unlinkSync(fullPath);
        console.log(`   ✓ Supprimé: ${filePath}`);
      } catch (error) {
        console.error(`   ❌ Erreur avec ${filePath}:`, error);
      }
    }
    
    console.log(`   ✓ Backup créé dans: ${BACKUP_DIR}`);
  }

  /**
   * Commit et push sur GitHub
   */
  async commitAndPush() {
    console.log('\n🚀 Commit et push sur GitHub...');
    
    try {
      // Git add
      execSync('git add .', { cwd: ROOT_DIR, stdio: 'inherit' });
      
      // Git commit
      const commitMessage = `🤖 Audit automatique: Nettoyage de ${this.audit.filesToDelete.length} fichiers MD redondants`;
      execSync(`git commit -m "${commitMessage}"`, { cwd: ROOT_DIR, stdio: 'inherit' });
      
      // Git push
      execSync('git push origin main', { cwd: ROOT_DIR, stdio: 'inherit' });
      
      console.log('✅ Changements poussés sur GitHub avec succès!');
    } catch (error) {
      console.error('❌ Erreur lors du push:', error);
      console.log('💡 Vous pouvez faire le commit manuellement avec:');
      console.log('   git add .');
      console.log(`   git commit -m "Audit automatique: Nettoyage"`);
      console.log('   git push origin main');
    }
  }
}

// Exécution
if (require.main === module) {
  const agent = new ProjectAuditAgent();
  
  agent.run()
    .then(() => {
      console.log('\n🤔 Voulez-vous commit et push les changements sur GitHub? (y/n)');
      
      // En mode automatique, on commit directement
      const autoCommit = process.argv.includes('--auto-commit');
      
      if (autoCommit) {
        return agent.commitAndPush();
      } else {
        console.log('💡 Exécutez avec --auto-commit pour commit automatiquement');
      }
    })
    .catch(error => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}

export default ProjectAuditAgent;
