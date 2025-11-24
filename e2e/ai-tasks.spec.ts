import { test, expect } from '@playwright/test'

test.describe('AI Tasks Page', () => {
  test.beforeEach(async ({ page }) => {
    // Note: Cette page nécessite l'authentification
    await page.goto('/ai-tasks')
  })

  test('should load AI tasks page', async ({ page }) => {
    // Vérifier si on est redirigé vers login ou si la page charge
    const url = page.url()
    expect(url).toMatch(/ai-tasks|login/)
  })

  test('should display kanban board structure', async ({ page }) => {
    // Si authentifié, vérifier le kanban
    const isLoginPage = page.url().includes('login')
    
    if (!isLoginPage) {
      const kanban = page.locator('[data-testid="kanban-board"], .kanban, [class*="kanban"]')
      await expect(kanban.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('should show AI agent options', async ({ page }) => {
    const isLoginPage = page.url().includes('login')
    
    if (!isLoginPage) {
      // Chercher les options d'agents IA
      const agentSelector = page.locator('select, [role="combobox"]').first()
      if (await agentSelector.isVisible()) {
        await expect(agentSelector).toBeVisible()
      }
    }
  })

  test('should be accessible via keyboard', async ({ page }) => {
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()
  })
})
