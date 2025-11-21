#!/usr/bin/env ts-node
/**
 * 🔗 Validateur de Connexions entre Composants
 * 
 * Vérifie que tous les composants sont correctement connectés
 * et détecte les imports cassés ou manquants
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = process.cwd();

interface ValidationResult {
  component: string;
  path: string;
  status: 'valid' | 'warning' | 'error';
  issues: string[];
  imports: ImportValidation[];
}

interface ImportValidation {
  importPath: string;
  resolved: boolean;
  actualPath?: string;
}

class ConnectionValidator {
  private results: ValidationResult[] = [];
  
  async validate() {
    console.log('🔗 Validation des connexions entre composants...\n');
    
    const componentFiles = this.findFiles(ROOT_DIR, /\.(tsx?|jsx?)$/);
    
    for (const filePath of componentFiles) {
      const result = await this.validateFile(filePath);
      this.results.push(result);
    }
    
    this.printReport();
  }
  
  private async validateFile(filePath: string): Promise<ValidationResult> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = filePath.replace(ROOT_DIR, '');
    
    const result: ValidationResult = {
      component: path.basename(filePath),
      path: relativePath,
      status: 'valid',
      issues: [],
      imports: []
    };
    
    // Extraire et valider les imports
    const importRegex = /import\s+(?:{[^}]+}|[^'"]+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Ignorer les imports de node_modules
      if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
        continue;
      }
      
      const validation = this.validateImport(filePath, importPath);
      result.imports.push(validation);
      
      if (!validation.resolved) {
        result.issues.push(`Import cassé: ${importPath}`);
        result.status = 'error';
      }
    }
    
    // Vérifier les exports
    if (!content.includes('export')) {
      result.issues.push('Aucun export détecté');
      if (result.status === 'valid') result.status = 'warning';
    }
    
    // Vérifier l'utilisation de 'use client' pour les composants Konva
    if (content.includes('Konva') && !content.includes('"use client"')) {
      result.issues.push('Composant Konva sans "use client"');
      if (result.status === 'valid') result.status = 'warning';
    }
    
    return result;
  }
  
  private validateImport(fromFile: string, importPath: string): ImportValidation {
    const validation: ImportValidation = {
      importPath,
      resolved: false
    };
    
    // Résoudre le chemin d'import
    let resolvedPath = importPath;
    
    // Gérer les alias @/
    if (importPath.startsWith('@/')) {
      resolvedPath = importPath.replace('@/', '');
    }
    
    // Résoudre le chemin relatif
    const dir = path.dirname(fromFile);
    const fullPath = path.resolve(dir, resolvedPath);
    
    // Essayer différentes extensions
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
    
    for (const ext of extensions) {
      const testPath = fullPath + ext;
      if (fs.existsSync(testPath)) {
        validation.resolved = true;
        validation.actualPath = testPath.replace(ROOT_DIR, '');
        break;
      }
      
      // Essayer avec index
      const indexPath = path.join(fullPath, `index${ext}`);
      if (fs.existsSync(indexPath)) {
        validation.resolved = true;
        validation.actualPath = indexPath.replace(ROOT_DIR, '');
        break;
      }
    }
    
    return validation;
  }
  
  private findFiles(dir: string, pattern: RegExp, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (file === 'node_modules' || file === '.next' || file === '.git') {
        continue;
      }
      
      if (stat.isDirectory()) {
        this.findFiles(filePath, pattern, fileList);
      } else if (pattern.test(file)) {
        fileList.push(filePath);
      }
    }
    
    return fileList;
  }
  
  private printReport() {
    const errors = this.results.filter(r => r.status === 'error');
    const warnings = this.results.filter(r => r.status === 'warning');
    const valid = this.results.filter(r => r.status === 'valid');
    
    console.log('\n📊 Résultats de la Validation\n');
    console.log(`✅ Valides: ${valid.length}`);
    console.log(`⚠️  Avertissements: ${warnings.length}`);
    console.log(`❌ Erreurs: ${errors.length}`);
    console.log(`📁 Total: ${this.results.length} fichiers\n`);
    
    if (errors.length > 0) {
      console.log('❌ ERREURS:\n');
      errors.forEach(r => {
        console.log(`  ${r.path}`);
        r.issues.forEach(issue => console.log(`    - ${issue}`));
        console.log('');
      });
    }
    
    if (warnings.length > 0) {
      console.log('⚠️  AVERTISSEMENTS:\n');
      warnings.forEach(r => {
        console.log(`  ${r.path}`);
        r.issues.forEach(issue => console.log(`    - ${issue}`));
        console.log('');
      });
    }
    
    // Sauvegarder le rapport
    const reportPath = path.join(ROOT_DIR, 'CONNECTION_VALIDATION_REPORT.md');
    const report = this.generateMarkdownReport();
    fs.writeFileSync(reportPath, report, 'utf-8');
    
    console.log(`\n📄 Rapport détaillé: ${reportPath}`);
    
    if (errors.length > 0) {
      process.exit(1);
    }
  }
  
  private generateMarkdownReport(): string {
    const errors = this.results.filter(r => r.status === 'error');
    const warnings = this.results.filter(r => r.status === 'warning');
    
    return `# 🔗 Rapport de Validation des Connexions

**Date:** ${new Date().toLocaleString('fr-FR')}

## Résumé

- ✅ **Valides:** ${this.results.filter(r => r.status === 'valid').length}
- ⚠️ **Avertissements:** ${warnings.length}
- ❌ **Erreurs:** ${errors.length}
- 📁 **Total:** ${this.results.length} fichiers

---

## ❌ Erreurs (${errors.length})

${errors.length > 0 ? errors.map(r => `
### ${r.component}
**Chemin:** \`${r.path}\`

**Problèmes:**
${r.issues.map(issue => `- ${issue}`).join('\n')}

**Imports:**
${r.imports.map(imp => `- \`${imp.importPath}\` ${imp.resolved ? '✅' : '❌'}`).join('\n')}
`).join('\n---\n') : 'Aucune erreur détectée ✅'}

---

## ⚠️ Avertissements (${warnings.length})

${warnings.length > 0 ? warnings.map(r => `
### ${r.component}
**Chemin:** \`${r.path}\`

**Problèmes:**
${r.issues.map(issue => `- ${issue}`).join('\n')}
`).join('\n---\n') : 'Aucun avertissement ✅'}

---

**Généré automatiquement - Elite Visuals © 2024**
`;
  }
}

// Exécution
if (require.main === module) {
  const validator = new ConnectionValidator();
  validator.validate().catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
}

export default ConnectionValidator;
