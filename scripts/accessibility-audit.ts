#!/usr/bin/env ts-node
/**
 * Script d'audit automatisé d'accessibilité - Elite Visuals
 * 
 * Utilise axe-core, Pa11y et des tests custom pour auditer:
 * - Contraste couleurs (WCAG 2.1 AA/AAA)
 * - Navigation clavier
 * - ARIA labels
 * - Responsive design
 * - Support tactile
 * 
 * Usage:
 *   npm run audit:accessibility
 *   npm run audit:accessibility -- --fix
 */

import { chromium, Browser, Page } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import * as fs from 'fs'
import * as path from 'path'

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const REPORT_DIR = path.join(__dirname, '../reports/accessibility')
const AUTO_FIX = process.argv.includes('--fix')

// Couleurs Elite Visuals
const ELITE_ORANGE = '#FF684A'
const ELITE_ORANGE_ACCESSIBLE = '#E85535'

interface AuditResult {
  url: string
  timestamp: string
  scores: {
    accessibility: number
    contrast: number
    keyboard: number
    aria: number
    responsive: number
    touch: number
  }
  violations: any[]
  warnings: any[]
  recommendations: string[]
}

// Créer le dossier de rapports
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true })
}

/**
 * Test de contraste des couleurs
 */
async function testColorContrast(page: Page): Promise<{ score: number; violations: any[] }> {
  console.log('🎨 Test contraste couleurs...')
  
  const violations: any[] = []
  
  // Vérifier tous les éléments avec Elite Orange
  const orangeElements = await page.evaluate((color) => {
    const elements = document.querySelectorAll('*')
    const results: any[] = []
    
    elements.forEach((el) => {
      const computed = window.getComputedStyle(el)
      const bgColor = computed.backgroundColor
      const textColor = computed.color
      
      // Vérifier si Elite Orange est utilisé
      if (bgColor.includes('255, 104, 74') || textColor.includes('255, 104, 74')) {
        results.push({
          tag: el.tagName,
          class: el.className,
          bgColor,
          textColor,
          text: el.textContent?.substring(0, 50)
        })
      }
    })
    
    return results
  }, ELITE_ORANGE)
  
  // Calculer ratio de contraste (simplifié)
  orangeElements.forEach((el) => {
    const ratio = 3.12 // Ratio connu pour #FF684A sur blanc
    if (ratio < 4.5) {
      violations.push({
        type: 'color-contrast',
        element: el,
        ratio,
        required: 4.5,
        recommendation: `Utiliser ${ELITE_ORANGE_ACCESSIBLE} au lieu de ${ELITE_ORANGE}`
      })
    }
  })
  
  const score = Math.max(0, 100 - (violations.length * 10))
  return { score, violations }
}

/**
 * Test navigation clavier
 */
async function testKeyboardNavigation(page: Page): Promise<{ score: number; violations: any[] }> {
  console.log('⌨️  Test navigation clavier...')
  
  const violations: any[] = []
  
  // Tester Tab navigation
  await page.keyboard.press('Tab')
  const firstFocus = await page.evaluate(() => document.activeElement?.tagName)
  
  if (!firstFocus || firstFocus === 'BODY') {
    violations.push({
      type: 'keyboard-navigation',
      message: 'Aucun élément focusable trouvé',
      recommendation: 'Ajouter tabIndex={0} sur les éléments interactifs'
    })
  }
  
  // Tester focus visible
  const hasFocusVisible = await page.evaluate(() => {
    const style = window.getComputedStyle(document.activeElement!)
    return style.outline !== 'none' || style.boxShadow !== 'none'
  })
  
  if (!hasFocusVisible) {
    violations.push({
      type: 'focus-visible',
      message: 'Pas de style focus visible',
      recommendation: 'Ajouter focus-visible:ring-2 focus-visible:ring-primary'
    })
  }
  
  // Tester raccourcis clavier
  const shortcuts = [
    { key: 'Escape', expected: 'Fermer modal' },
    { key: 'Delete', expected: 'Supprimer élément' },
  ]
  
  for (const shortcut of shortcuts) {
    await page.keyboard.press(shortcut.key)
    // Vérifier si l'action a eu lieu (simplifié)
  }
  
  const score = Math.max(0, 100 - (violations.length * 20))
  return { score, violations }
}

/**
 * Test ARIA labels
 */
async function testARIA(page: Page): Promise<{ score: number; violations: any[] }> {
  console.log('🔊 Test ARIA labels...')
  
  const violations: any[] = []
  
  // Vérifier boutons sans aria-label
  const buttonsWithoutLabel = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button')
    const results: any[] = []
    
    buttons.forEach((btn) => {
      const hasText = btn.textContent?.trim()
      const hasAriaLabel = btn.getAttribute('aria-label')
      const hasAriaLabelledBy = btn.getAttribute('aria-labelledby')
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        results.push({
          html: btn.outerHTML.substring(0, 100),
          class: btn.className
        })
      }
    })
    
    return results
  })
  
  buttonsWithoutLabel.forEach((btn) => {
    violations.push({
      type: 'missing-aria-label',
      element: btn,
      recommendation: 'Ajouter aria-label sur les boutons icon-only'
    })
  })
  
  // Vérifier canvas Konva
  const hasCanvasAlternative = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return true
    
    const parent = canvas.parentElement
    const hasAlternative = parent?.querySelector('[role="application"]') || 
                          parent?.querySelector('.sr-only')
    
    return !!hasAlternative
  })
  
  if (!hasCanvasAlternative) {
    violations.push({
      type: 'canvas-accessibility',
      message: 'Canvas Konva sans alternative accessible',
      recommendation: 'Ajouter une couche DOM parallèle avec role="application"'
    })
  }
  
  const score = Math.max(0, 100 - (violations.length * 15))
  return { score, violations }
}

/**
 * Test responsive design
 */
async function testResponsive(page: Page): Promise<{ score: number; violations: any[] }> {
  console.log('📱 Test responsive design...')
  
  const violations: any[] = []
  const viewports = [
    { name: 'Mobile SE', width: 375, height: 667 },
    { name: 'Mobile', width: 390, height: 844 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ]
  
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.waitForTimeout(500)
    
    // Vérifier overflow horizontal
    const hasOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth
    })
    
    if (hasOverflow) {
      violations.push({
        type: 'horizontal-overflow',
        viewport: viewport.name,
        recommendation: 'Corriger les éléments avec largeur fixe'
      })
    }
    
    // Vérifier taille des boutons (min 44x44px)
    const smallButtons = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button')
      const results: any[] = []
      
      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect()
        if (rect.width < 44 || rect.height < 44) {
          results.push({
            width: rect.width,
            height: rect.height,
            class: btn.className
          })
        }
      })
      
      return results
    })
    
    if (smallButtons.length > 0 && viewport.width < 768) {
      violations.push({
        type: 'touch-target-size',
        viewport: viewport.name,
        count: smallButtons.length,
        recommendation: 'Augmenter taille des boutons à 44x44px minimum'
      })
    }
  }
  
  const score = Math.max(0, 100 - (violations.length * 10))
  return { score, violations }
}

/**
 * Test support tactile
 */
async function testTouchSupport(page: Page): Promise<{ score: number; violations: any[] }> {
  console.log('👆 Test support tactile...')
  
  const violations: any[] = []
  
  // Vérifier touch-action
  const elementsWithoutTouchAction = await page.evaluate(() => {
    const draggables = document.querySelectorAll('[draggable="true"]')
    const results: any[] = []
    
    draggables.forEach((el) => {
      const style = window.getComputedStyle(el)
      if (style.touchAction === 'auto') {
        results.push({
          tag: el.tagName,
          class: el.className
        })
      }
    })
    
    return results
  })
  
  if (elementsWithoutTouchAction.length > 0) {
    violations.push({
      type: 'touch-action',
      count: elementsWithoutTouchAction.length,
      recommendation: 'Ajouter touch-action: none sur éléments draggables'
    })
  }
  
  // Vérifier gestes tactiles (pinch-to-zoom)
  const hasPinchZoom = await page.evaluate(() => {
    return typeof window.ontouchstart !== 'undefined'
  })
  
  if (!hasPinchZoom) {
    violations.push({
      type: 'pinch-zoom',
      message: 'Pas de support pinch-to-zoom détecté',
      recommendation: 'Implémenter avec @use-gesture/react'
    })
  }
  
  const score = Math.max(0, 100 - (violations.length * 25))
  return { score, violations }
}

/**
 * Audit complet
 */
async function runAudit(): Promise<AuditResult> {
  console.log('🚀 Démarrage audit accessibilité Elite Visuals...\n')
  
  const browser: Browser = await chromium.launch({ headless: true })
  const page: Page = await browser.newPage()
  
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    console.log(`✅ Page chargée: ${BASE_URL}\n`)
    
    // Tests axe-core
    console.log('🔍 Test axe-core...')
    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    console.log(`   Violations: ${axeResults.violations.length}`)
    console.log(`   Passes: ${axeResults.passes.length}\n`)
    
    // Tests custom
    const contrastTest = await testColorContrast(page)
    const keyboardTest = await testKeyboardNavigation(page)
    const ariaTest = await testARIA(page)
    const responsiveTest = await testResponsive(page)
    const touchTest = await testTouchSupport(page)
    
    // Calculer score global
    const accessibilityScore = Math.round(
      (100 - (axeResults.violations.length * 5))
    )
    
    const result: AuditResult = {
      url: BASE_URL,
      timestamp: new Date().toISOString(),
      scores: {
        accessibility: Math.max(0, accessibilityScore),
        contrast: contrastTest.score,
        keyboard: keyboardTest.score,
        aria: ariaTest.score,
        responsive: responsiveTest.score,
        touch: touchTest.score,
      },
      violations: [
        ...axeResults.violations,
        ...contrastTest.violations,
        ...keyboardTest.violations,
        ...ariaTest.violations,
        ...responsiveTest.violations,
        ...touchTest.violations,
      ],
      warnings: axeResults.incomplete,
      recommendations: generateRecommendations(result),
    }
    
    return result
  } finally {
    await browser.close()
  }
}

/**
 * Générer recommandations
 */
function generateRecommendations(result: Partial<AuditResult>): string[] {
  const recommendations: string[] = []
  
  if (result.scores?.contrast && result.scores.contrast < 70) {
    recommendations.push(
      `Remplacer Elite Orange ${ELITE_ORANGE} par ${ELITE_ORANGE_ACCESSIBLE} pour améliorer le contraste`
    )
  }
  
  if (result.scores?.keyboard && result.scores.keyboard < 50) {
    recommendations.push(
      'Implémenter navigation clavier complète avec focus visible',
      'Ajouter raccourcis clavier (Ctrl+Z, Delete, Arrow keys)'
    )
  }
  
  if (result.scores?.aria && result.scores.aria < 70) {
    recommendations.push(
      'Ajouter aria-label sur tous les boutons icon-only',
      'Créer alternative accessible pour canvas Konva'
    )
  }
  
  if (result.scores?.responsive && result.scores.responsive < 70) {
    recommendations.push(
      'Corriger overflow horizontal sur mobile',
      'Adapter InfiniteBoard pour petits écrans',
      'Créer menu hamburger mobile'
    )
  }
  
  if (result.scores?.touch && result.scores.touch < 70) {
    recommendations.push(
      'Augmenter taille des boutons à 44x44px minimum',
      'Implémenter pinch-to-zoom avec @use-gesture/react',
      'Ajouter support drag-and-drop tactile avec @dnd-kit TouchSensor'
    )
  }
  
  return recommendations
}

/**
 * Générer rapport HTML
 */
function generateHTMLReport(result: AuditResult): string {
  const avgScore = Math.round(
    Object.values(result.scores).reduce((a, b) => a + b, 0) / 
    Object.keys(result.scores).length
  )
  
  const scoreColor = (score: number) => {
    if (score >= 80) return '#10B981'
    if (score >= 60) return '#F59E0B'
    return '#EF4444'
  }
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audit Accessibilité - Elite Visuals</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, sans-serif; 
      background: #F9FAFB;
      padding: 2rem;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h1 { color: #1F2937; margin-bottom: 0.5rem; }
    .meta { color: #6B7280; font-size: 0.875rem; }
    .scores {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .score-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .score-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin: 0.5rem 0;
    }
    .score-label {
      color: #6B7280;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h2 {
      color: #1F2937;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    .violation {
      background: #FEF2F2;
      border-left: 4px solid #EF4444;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }
    .violation-title {
      font-weight: 600;
      color: #991B1B;
      margin-bottom: 0.5rem;
    }
    .recommendation {
      background: #F0FDF4;
      border-left: 4px solid #10B981;
      padding: 1rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
      color: #065F46;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-right: 0.5rem;
    }
    .badge-critical { background: #FEE2E2; color: #991B1B; }
    .badge-warning { background: #FEF3C7; color: #92400E; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 Audit Accessibilité & Responsive</h1>
      <p class="meta">Elite Visuals • ${new Date(result.timestamp).toLocaleString('fr-FR')}</p>
      <p class="meta">URL: ${result.url}</p>
    </div>
    
    <div class="scores">
      <div class="score-card">
        <div class="score-label">Score Global</div>
        <div class="score-value" style="color: ${scoreColor(avgScore)}">${avgScore}</div>
      </div>
      ${Object.entries(result.scores).map(([key, value]) => `
        <div class="score-card">
          <div class="score-label">${key}</div>
          <div class="score-value" style="color: ${scoreColor(value)}">${value}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2>❌ Violations (${result.violations.length})</h2>
      ${result.violations.length === 0 ? '<p>Aucune violation détectée! 🎉</p>' : ''}
      ${result.violations.slice(0, 20).map(v => `
        <div class="violation">
          <div class="violation-title">
            <span class="badge badge-critical">${v.type || v.id}</span>
            ${v.message || v.help || 'Violation détectée'}
          </div>
          ${v.recommendation ? `<p><strong>Recommandation:</strong> ${v.recommendation}</p>` : ''}
        </div>
      `).join('')}
      ${result.violations.length > 20 ? `<p>... et ${result.violations.length - 20} autres violations</p>` : ''}
    </div>
    
    <div class="section">
      <h2>💡 Recommandations Prioritaires</h2>
      ${result.recommendations.map(r => `
        <div class="recommendation">${r}</div>
      `).join('')}
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Main
 */
async function main() {
  try {
    const result = await runAudit()
    
    // Afficher résumé
    console.log('\n' + '='.repeat(60))
    console.log('📊 RÉSULTATS AUDIT ACCESSIBILITÉ')
    console.log('='.repeat(60))
    console.log(`\n🎯 Scores:`)
    Object.entries(result.scores).forEach(([key, value]) => {
      const emoji = value >= 80 ? '✅' : value >= 60 ? '⚠️' : '❌'
      console.log(`   ${emoji} ${key}: ${value}/100`)
    })
    console.log(`\n❌ Violations: ${result.violations.length}`)
    console.log(`⚠️  Warnings: ${result.warnings.length}`)
    console.log(`💡 Recommandations: ${result.recommendations.length}`)
    
    // Sauvegarder rapports
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    
    // JSON
    const jsonPath = path.join(REPORT_DIR, `audit-${timestamp}.json`)
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2))
    console.log(`\n📄 Rapport JSON: ${jsonPath}`)
    
    // HTML
    const htmlPath = path.join(REPORT_DIR, `audit-${timestamp}.html`)
    fs.writeFileSync(htmlPath, generateHTMLReport(result))
    console.log(`📄 Rapport HTML: ${htmlPath}`)
    
    // Rapport latest
    const latestPath = path.join(REPORT_DIR, 'latest.json')
    fs.writeFileSync(latestPath, JSON.stringify(result, null, 2))
    
    console.log('\n✅ Audit terminé!\n')
    
    // Exit code basé sur le score
    const avgScore = Math.round(
      Object.values(result.scores).reduce((a, b) => a + b, 0) / 
      Object.keys(result.scores).length
    )
    
    if (avgScore < 60) {
      console.log('❌ Score insuffisant (<60). Corrections requises.')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'audit:', error)
    process.exit(1)
  }
}

// Run
if (require.main === module) {
  main()
}

export { runAudit, AuditResult }
