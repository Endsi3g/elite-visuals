import { test, expect } from '@playwright/test'

test.describe('InfiniteBoard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the board successfully', async ({ page }) => {
    await expect(page.locator('.infinite-board')).toBeVisible()
    await expect(page.locator('text=Elite Visuals')).toBeVisible()
  })

  test('should add a text card', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /Plus/ }).first()
    await addButton.click()
    
    // Wait for the new card to appear
    await page.waitForTimeout(500)
    
    // Check if items count increased
    const infoBar = page.locator('text=/Items:/')
    await expect(infoBar).toContainText('Items: 1')
  })

  test('should zoom in and out', async ({ page }) => {
    const stage = page.locator('canvas').first()
    
    // Get initial zoom level
    const initialZoom = await page.locator('text=/Zoom:/')
    await expect(initialZoom).toContainText('100%')
    
    // Simulate zoom with wheel event
    await stage.hover()
    await page.mouse.wheel(0, -100) // Zoom in
    
    await page.waitForTimeout(300)
    
    // Zoom level should have changed
    const newZoom = await page.locator('text=/Zoom:/')
    await expect(newZoom).not.toContainText('100%')
  })

  test('should open export menu', async ({ page }) => {
    const exportButton = page.locator('button').filter({ has: page.locator('svg.lucide-download') }).first()
    await exportButton.click()
    
    await expect(page.locator('text=Exporter le Board')).toBeVisible()
    await expect(page.locator('text=Markdown')).toBeVisible()
    await expect(page.locator('text=PDF')).toBeVisible()
  })

  test('should display smart cluster component', async ({ page }) => {
    await expect(page.locator('text=Smart Clustering')).toBeVisible()
  })

  test('should generate AI content', async ({ page }) => {
    const aiButton = page.locator('button').filter({ has: page.locator('svg.lucide-wand-2') }).first()
    await aiButton.click()
    
    await page.waitForTimeout(500)
    
    // Check if AI item was added
    const infoBar = page.locator('text=/Items:/')
    await expect(infoBar).toContainText('Items: 1')
  })

  test('should handle file drag and drop', async ({ page }) => {
    // Create a test file
    const buffer = Buffer.from('test file content')
    
    // Simulate file drop
    const dropZone = page.locator('.infinite-board')
    
    await dropZone.dispatchEvent('drop', {
      dataTransfer: {
        files: [
          new File([buffer], 'test.txt', { type: 'text/plain' })
        ]
      }
    })
    
    await page.waitForTimeout(1000)
  })
})

test.describe('Showroom Mode E2E Tests', () => {
  test('should load showroom page', async ({ page }) => {
    await page.goto('/showroom/demo')
    
    await expect(page.locator('text=Elite Visuals')).toBeVisible()
    await expect(page.locator('text=Lecture seule')).toBeVisible()
    await expect(page.locator('text=Showroom Mode')).toBeVisible()
  })

  test('should display watermark in showroom', async ({ page }) => {
    await page.goto('/showroom/demo')
    
    const watermark = page.locator('text=Elite Visuals').last()
    await expect(watermark).toBeVisible()
  })

  test('should not allow editing in showroom mode', async ({ page }) => {
    await page.goto('/showroom/demo')
    
    // Verify no edit buttons are present
    await expect(page.locator('button').filter({ hasText: /Plus/ })).not.toBeVisible()
    await expect(page.locator('button').filter({ hasText: /Upload/ })).not.toBeVisible()
  })
})

test.describe('Collaboration E2E Tests', () => {
  test('should initialize collaboration service', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check if board is ready for collaboration
    await expect(page.locator('.infinite-board')).toBeVisible()
  })
})
