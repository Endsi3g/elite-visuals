import { test, expect } from '@playwright/test'

test.describe('Collaboration Features', () => {
  test('should show active users', async ({ page }) => {
    await page.goto('/')
    
    // Wait for collaboration to initialize
    await page.waitForSelector('[data-testid="active-users"]')
    
    // Verify user avatars are visible
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible()
  })

  test('should display real-time cursors', async ({ browser }) => {
    // Create two browser contexts (simulate two users)
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()
    
    const page1 = await context1.newPage()
    const page2 = await context2.newPage()
    
    await page1.goto('/')
    await page2.goto('/')
    
    // Move cursor on page1
    await page1.mouse.move(500, 500)
    
    // Verify cursor appears on page2
    await expect(page2.locator('[data-testid="remote-cursor"]')).toBeVisible({
      timeout: 5000,
    })
    
    await context1.close()
    await context2.close()
  })

  test('should sync card movements in real-time', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()
    
    const page1 = await context1.newPage()
    const page2 = await context2.newPage()
    
    await page1.goto('/')
    await page2.goto('/')
    
    // Add card on page1
    await page1.click('button:has-text("Ajouter")')
    await page1.fill('input[name="title"]', 'Synced Card')
    await page1.click('button:has-text("Créer")')
    
    // Verify card appears on page2
    await expect(page2.locator('text=Synced Card')).toBeVisible({
      timeout: 5000,
    })
    
    await context1.close()
    await context2.close()
  })

  test('should show user presence status', async ({ page }) => {
    await page.goto('/')
    
    await page.waitForSelector('[data-testid="presence-indicator"]')
    
    // Verify presence indicators
    const presenceIndicators = page.locator('[data-testid="presence-indicator"]')
    await expect(presenceIndicators).toHaveCount(1) // Current user
  })

  test('should handle comments on cards', async ({ page }) => {
    await page.goto('/')
    
    // Click on a card
    await page.click('[data-testid="board-card"]')
    
    // Add comment
    await page.click('button:has-text("Commenter")')
    await page.fill('textarea[name="comment"]', 'Great work!')
    await page.click('button:has-text("Envoyer")')
    
    // Verify comment appears
    await expect(page.locator('text=Great work!')).toBeVisible()
  })

  test('should show modification history', async ({ page }) => {
    await page.goto('/')
    
    // Open history panel
    await page.click('button[aria-label="History"]')
    
    // Verify history entries
    await expect(page.locator('[data-testid="history-entry"]')).toBeVisible()
  })

  test('should handle undo/redo', async ({ page }) => {
    await page.goto('/')
    
    // Add a card
    await page.click('button:has-text("Ajouter")')
    await page.fill('input[name="title"]', 'Undo Test')
    await page.click('button:has-text("Créer")')
    
    await expect(page.locator('text=Undo Test')).toBeVisible()
    
    // Undo
    await page.keyboard.press('Control+Z')
    
    await expect(page.locator('text=Undo Test')).not.toBeVisible()
    
    // Redo
    await page.keyboard.press('Control+Y')
    
    await expect(page.locator('text=Undo Test')).toBeVisible()
  })

  test('should notify on user join/leave', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()
    
    const page1 = await context1.newPage()
    await page1.goto('/')
    
    // User 2 joins
    const page2 = await context2.newPage()
    await page2.goto('/')
    
    // Verify notification on page1
    await expect(page1.locator('text=User joined')).toBeVisible({
      timeout: 5000,
    })
    
    // User 2 leaves
    await context2.close()
    
    // Verify notification on page1
    await expect(page1.locator('text=User left')).toBeVisible({
      timeout: 5000,
    })
    
    await context1.close()
  })
})
