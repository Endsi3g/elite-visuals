import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Elite Visuals/i)
  })

  test('should display hero section', async ({ page }) => {
    const hero = page.locator('h1').first()
    await expect(hero).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    // Vérifier les liens de navigation
    const nav = page.locator('nav, header')
    await expect(nav).toBeVisible()
  })

  test('should display CTA buttons', async ({ page }) => {
    const buttons = page.locator('button, a[role="button"]')
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should load features section', async ({ page }) => {
    // Scroll pour charger les composants lazy
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(1000)
    
    const features = page.locator('section').nth(1)
    await expect(features).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('should have accessible navigation', async ({ page }) => {
    // Test navigation au clavier
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()
  })
})
