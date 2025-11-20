import { test, expect } from '@playwright/test'

test.describe('Board Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the infinite board', async ({ page }) => {
    await expect(page.locator('[data-testid="infinite-board"]')).toBeVisible()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('should add a new card to the board', async ({ page }) => {
    // Click add button
    await page.click('button:has-text("Ajouter")')
    
    // Fill in card details
    await page.fill('input[name="title"]', 'Test Card')
    await page.fill('input[name="url"]', 'https://example.com/image.jpg')
    await page.selectOption('select[name="type"]', 'image')
    
    // Submit
    await page.click('button:has-text("Créer")')
    
    // Verify card appears
    await expect(page.locator('text=Test Card')).toBeVisible()
  })

  test('should drag and drop a card', async ({ page }) => {
    // Wait for board to load
    await page.waitForSelector('[data-testid="board-card"]')
    
    const card = page.locator('[data-testid="board-card"]').first()
    const initialPosition = await card.boundingBox()
    
    // Drag card
    await card.dragTo(page.locator('canvas'), {
      targetPosition: { x: 500, y: 500 },
    })
    
    // Verify position changed
    const newPosition = await card.boundingBox()
    expect(newPosition?.x).not.toBe(initialPosition?.x)
    expect(newPosition?.y).not.toBe(initialPosition?.y)
  })

  test('should zoom in and out', async ({ page }) => {
    const canvas = page.locator('canvas')
    
    // Zoom in
    await canvas.click({ position: { x: 400, y: 400 } })
    await page.keyboard.press('Control++')
    
    // Zoom out
    await page.keyboard.press('Control+-')
    
    // Verify zoom controls work
    await expect(canvas).toBeVisible()
  })

  test('should delete a card', async ({ page }) => {
    await page.waitForSelector('[data-testid="board-card"]')
    
    const card = page.locator('[data-testid="board-card"]').first()
    await card.hover()
    
    // Click delete button
    await card.locator('button[aria-label="Delete"]').click()
    
    // Confirm deletion
    await page.click('button:has-text("Confirmer")')
    
    // Verify card is removed
    await expect(card).not.toBeVisible()
  })

  test('should open Magic Prompt modal', async ({ page }) => {
    await page.click('button:has-text("Magic")')
    
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('text=Génération IA')).toBeVisible()
  })

  test('should generate content with AI', async ({ page }) => {
    // Open Magic Prompt
    await page.click('button:has-text("Magic")')
    
    // Enter prompt
    await page.fill('textarea[name="prompt"]', 'Create a sunset landscape')
    
    // Select generation type
    await page.selectOption('select[name="type"]', 'image')
    
    // Generate
    await page.click('button:has-text("Générer")')
    
    // Wait for generation (with timeout)
    await page.waitForSelector('text=Génération en cours', { timeout: 5000 })
    
    // Verify result appears on board
    await expect(page.locator('[data-testid="board-card"]')).toBeVisible({
      timeout: 30000,
    })
  })

  test('should toggle between board and kanban views', async ({ page }) => {
    // Initially on board view
    await expect(page.locator('[data-testid="infinite-board"]')).toBeVisible()
    
    // Switch to kanban
    await page.click('button[aria-label="Toggle Kanban"]')
    
    await expect(page.locator('[data-testid="kanban-sidebar"]')).toBeVisible()
    
    // Switch back to board
    await page.click('button[aria-label="Toggle Board"]')
    
    await expect(page.locator('[data-testid="infinite-board"]')).toBeVisible()
  })

  test('should search for cards', async ({ page }) => {
    await page.fill('input[placeholder="Rechercher..."]', 'test')
    
    // Verify search results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
  })

  test('should handle file upload', async ({ page }) => {
    // Click upload button
    await page.click('button:has-text("Upload")')
    
    // Upload file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('./public/logo.svg')
    
    // Verify file appears on board
    await expect(page.locator('[data-testid="board-card"]')).toBeVisible()
  })
})
