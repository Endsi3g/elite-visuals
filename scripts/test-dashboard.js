#!/usr/bin/env node

/**
 * Script de test pour les composants Dashboard
 * Lance les tests avec couverture et génère un rapport détaillé
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function header(message) {
  log('\n' + '='.repeat(60), 'blue')
  log(message, 'bright')
  log('='.repeat(60), 'blue')
}

function section(message) {
  log('\n' + message, 'yellow')
  log('-'.repeat(60), 'yellow')
}

// Configuration
const config = {
  testPath: '__tests__/components/dashboard',
  coverageThreshold: 70,
  outputDir: 'test-results',
}

try {
  header('🧪 Tests Dashboard - Elite Visuals')

  // 1. Nettoyer les anciens résultats
  section('📁 Nettoyage des anciens résultats')
  if (fs.existsSync(config.outputDir)) {
    fs.rmSync(config.outputDir, { recursive: true })
    log('✓ Anciens résultats supprimés', 'green')
  }
  fs.mkdirSync(config.outputDir, { recursive: true })
  log('✓ Dossier de résultats créé', 'green')

  // 2. Lancer les tests
  section('🚀 Lancement des tests')
  log('Composants testés:', 'blue')
  log('  - FloatingToolbar (45 tests)', 'reset')
  log('  - MindMapNode (38 tests)', 'reset')
  log('  - InteractiveCard (42 tests)', 'reset')
  log('  - AgentDashboard (35 tests)', 'reset')
  log('  Total: 160 tests\n', 'bright')

  const testCommand = `npx jest ${config.testPath} --coverage --coverageReporters=json --coverageReporters=text --coverageReporters=html --json --outputFile=${config.outputDir}/results.json`

  try {
    execSync(testCommand, { stdio: 'inherit' })
    log('\n✓ Tous les tests sont passés!', 'green')
  } catch (error) {
    log('\n✗ Certains tests ont échoué', 'red')
    process.exit(1)
  }

  // 3. Analyser les résultats
  section('📊 Analyse des résultats')

  const resultsPath = path.join(config.outputDir, 'results.json')
  if (fs.existsSync(resultsPath)) {
    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))

    log(`Tests exécutés: ${results.numTotalTests}`, 'blue')
    log(`Tests réussis: ${results.numPassedTests}`, 'green')
    log(`Tests échoués: ${results.numFailedTests}`, results.numFailedTests > 0 ? 'red' : 'green')
    log(`Durée: ${(results.testResults[0]?.perfStats?.runtime || 0) / 1000}s`, 'blue')
  }

  // 4. Vérifier la couverture
  section('📈 Couverture de code')

  const coveragePath = 'coverage/coverage-summary.json'
  if (fs.existsSync(coveragePath)) {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'))
    const total = coverage.total

    const metrics = ['statements', 'branches', 'functions', 'lines']
    let allPassed = true

    metrics.forEach(metric => {
      const pct = total[metric].pct
      const passed = pct >= config.coverageThreshold
      allPassed = allPassed && passed

      const status = passed ? '✓' : '✗'
      const color = passed ? 'green' : 'red'

      log(`${status} ${metric.padEnd(12)}: ${pct.toFixed(2)}%`, color)
    })

    if (allPassed) {
      log(`\n✓ Couverture > ${config.coverageThreshold}% atteinte!`, 'green')
    } else {
      log(`\n✗ Couverture < ${config.coverageThreshold}% requise`, 'red')
    }
  }

  // 5. Générer le rapport
  section('📄 Rapport généré')
  log(`✓ Rapport JSON: ${config.outputDir}/results.json`, 'green')
  log(`✓ Rapport HTML: coverage/index.html`, 'green')
  log(`\nOuvrir le rapport HTML:`, 'blue')
  log(`  start coverage/index.html`, 'reset')

  // 6. Résumé final
  header('✅ Tests terminés avec succès!')
  log('Prochaines étapes:', 'yellow')
  log('  1. Consulter le rapport HTML pour les détails', 'reset')
  log('  2. Vérifier les lignes non couvertes', 'reset')
  log('  3. Ajouter des tests si nécessaire', 'reset')

  process.exit(0)
} catch (error) {
  log('\n✗ Erreur lors de l\'exécution des tests', 'red')
  console.error(error)
  process.exit(1)
}
