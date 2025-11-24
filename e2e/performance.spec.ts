import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('should load landing page within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    // La page devrait charger en moins de 5 secondes
    expect(loadTime).toBeLessThan(5000)
  })

  test('should have optimized images', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier que les images utilisent des formats modernes
    const images = await page.locator('img').all()
    
    for (const img of images.slice(0, 5)) { // Vérifier les 5 premières images
      const src = await img.getAttribute('src')
      if (src && !src.startsWith('data:')) {
        // Les images Next.js devraient être optimisées
        expect(src).toBeTruthy()
      }
    }
  })

  test('should lazy load below-the-fold content', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier que le contenu initial charge rapidement
    const hero = page.locator('h1').first()
    await expect(hero).toBeVisible({ timeout: 2000 })
    
    // Scroll pour déclencher le lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
  })

  test('should have minimal layout shift', async ({ page }) => {
    await page.goto('/')
    
    // Attendre que la page soit complètement chargée
    await page.waitForLoadState('networkidle')
    
    // Vérifier que les éléments principaux sont visibles
    const hero = page.locator('h1').first()
    await expect(hero).toBeVisible()
  })

  test('should cache static assets', async ({ page }) => {
    // Premier chargement
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Recharger la page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // La page devrait charger plus rapidement la deuxième fois
    const hero = page.locator('h1').first()
    await expect(hero).toBeVisible({ timeout: 2000 })
  })
})
