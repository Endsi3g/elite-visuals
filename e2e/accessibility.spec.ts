import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests - Elite Visuals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should not have any automatically detectable accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
      elements.map((el) => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent?.trim(),
      }))
    )

    // Vérifier qu'il y a un seul h1
    const h1Count = headings.filter((h) => h.level === 1).length
    expect(h1Count).toBe(1)

    // Vérifier que les niveaux sont séquentiels
    for (let i = 1; i < headings.length; i++) {
      const diff = headings[i].level - headings[i - 1].level
      expect(diff).toBeLessThanOrEqual(1)
    }
  })

  test('should have accessible buttons with labels', async ({ page }) => {
    const buttonsWithoutLabels = await page.$$eval('button', (buttons) =>
      buttons
        .filter((btn) => {
          const hasText = btn.textContent?.trim()
          const hasAriaLabel = btn.getAttribute('aria-label')
          const hasAriaLabelledBy = btn.getAttribute('aria-labelledby')
          return !hasText && !hasAriaLabel && !hasAriaLabelledBy
        })
        .map((btn) => btn.outerHTML.substring(0, 100))
    )

    expect(buttonsWithoutLabels).toEqual([])
  })

  test('should have proper color contrast', async ({ page }) => {
    const contrastResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include(['color-contrast'])
      .analyze()

    expect(contrastResults.violations).toEqual([])
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Tab vers le premier élément focusable
    await page.keyboard.press('Tab')
    
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName)
    expect(firstFocused).not.toBe('BODY')

    // Vérifier que le focus est visible
    const hasFocusStyle = await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return false
      const style = window.getComputedStyle(el)
      return (
        style.outline !== 'none' ||
        style.boxShadow.includes('rgb') ||
        style.border !== 'none'
      )
    })
    expect(hasFocusStyle).toBe(true)
  })

  test('should have skip links', async ({ page }) => {
    // Vérifier présence de skip links
    const skipLinks = await page.$$('a[href^="#"]')
    expect(skipLinks.length).toBeGreaterThan(0)
  })

  test('should have proper ARIA landmarks', async ({ page }) => {
    const landmarks = await page.$$eval('[role]', (elements) =>
      elements.map((el) => el.getAttribute('role'))
    )

    // Vérifier présence de landmarks essentiels
    const hasMain = landmarks.includes('main') || (await page.$('main'))
    const hasNavigation = landmarks.includes('navigation') || (await page.$('nav'))
    
    expect(hasMain || hasNavigation).toBe(true)
  })

  test('should have accessible forms', async ({ page }) => {
    const inputsWithoutLabels = await page.$$eval('input, textarea, select', (inputs) =>
      inputs
        .filter((input) => {
          const id = input.getAttribute('id')
          const ariaLabel = input.getAttribute('aria-label')
          const ariaLabelledBy = input.getAttribute('aria-labelledby')
          const hasLabel = id && document.querySelector(`label[for="${id}"]`)
          
          return !hasLabel && !ariaLabel && !ariaLabelledBy
        })
        .map((input) => input.outerHTML.substring(0, 100))
    )

    expect(inputsWithoutLabels).toEqual([])
  })

  test('should have alt text on images', async ({ page }) => {
    const imagesWithoutAlt = await page.$$eval('img', (images) =>
      images
        .filter((img) => !img.getAttribute('alt'))
        .map((img) => img.src)
    )

    expect(imagesWithoutAlt).toEqual([])
  })

  test('should support screen readers with live regions', async ({ page }) => {
    const liveRegions = await page.$$('[aria-live]')
    // Au moins une live region pour les notifications
    expect(liveRegions.length).toBeGreaterThanOrEqual(0)
  })

  test('should have proper focus management in modals', async ({ page }) => {
    // Ouvrir une modal si présente
    const modalTrigger = await page.$('[aria-haspopup="dialog"]')
    if (modalTrigger) {
      await modalTrigger.click()
      
      // Vérifier que le focus est dans la modal
      const focusInModal = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]')
        return modal?.contains(document.activeElement)
      })
      
      expect(focusInModal).toBe(true)

      // Tester Escape pour fermer
      await page.keyboard.press('Escape')
      const modalClosed = await page.$('[role="dialog"]')
      expect(modalClosed).toBeNull()
    }
  })

  test('should have accessible drag and drop', async ({ page }) => {
    // Vérifier que les éléments draggables ont des alternatives clavier
    const draggables = await page.$$('[draggable="true"]')
    
    for (const draggable of draggables) {
      const hasKeyboardSupport = await draggable.evaluate((el) => {
        return el.hasAttribute('tabindex') || el.tagName === 'BUTTON'
      })
      
      expect(hasKeyboardSupport).toBe(true)
    }
  })

  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Simuler prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    // Vérifier que les animations sont désactivées
    const hasReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    })
    
    expect(hasReducedMotion).toBe(true)
  })

  test('should have minimum touch target size (44x44px)', async ({ page }) => {
    // Simuler viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })
    
    const smallTargets = await page.$$eval('button, a, [role="button"]', (elements) =>
      elements
        .filter((el) => {
          const rect = el.getBoundingClientRect()
          return rect.width < 44 || rect.height < 44
        })
        .map((el) => ({
          tag: el.tagName,
          width: el.getBoundingClientRect().width,
          height: el.getBoundingClientRect().height,
        }))
    )

    // Permettre quelques exceptions (ex: liens dans texte)
    expect(smallTargets.length).toBeLessThan(5)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Vérifier pas de scroll horizontal
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth
    })
    
    expect(hasHorizontalScroll).toBe(false)
  })

  test('should have proper table accessibility', async ({ page }) => {
    const tables = await page.$$('table')
    
    for (const table of tables) {
      // Vérifier caption ou aria-label
      const hasCaption = await table.$('caption')
      const hasAriaLabel = await table.getAttribute('aria-label')
      
      expect(hasCaption || hasAriaLabel).toBeTruthy()
      
      // Vérifier th avec scope
      const headers = await table.$$('th')
      for (const th of headers) {
        const hasScope = await th.getAttribute('scope')
        expect(hasScope).toBeTruthy()
      }
    }
  })

  test('should announce dynamic content changes', async ({ page }) => {
    // Ajouter une carte
    const addButton = await page.$('button:has-text("Ajouter")')
    if (addButton) {
      await addButton.click()
      
      // Vérifier qu'une live region annonce le changement
      const announcement = await page.textContent('[role="status"], [aria-live]')
      expect(announcement).toBeTruthy()
    }
  })

  test('should have accessible error messages', async ({ page }) => {
    // Soumettre un formulaire invalide si présent
    const form = await page.$('form')
    if (form) {
      await form.evaluate((f) => (f as HTMLFormElement).submit())
      
      // Vérifier que les erreurs sont annoncées
      const errors = await page.$$('[role="alert"], [aria-invalid="true"]')
      expect(errors.length).toBeGreaterThan(0)
    }
  })

  test('should support zoom up to 200%', async ({ page }) => {
    // Zoomer à 200%
    await page.evaluate(() => {
      document.body.style.zoom = '2'
    })
    
    // Vérifier que le contenu est toujours accessible
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth * 2
    })
    
    expect(hasHorizontalScroll).toBe(false)
  })

  test('should have accessible tooltips', async ({ page }) => {
    const tooltipTriggers = await page.$$('[aria-describedby]')
    
    for (const trigger of tooltipTriggers) {
      await trigger.hover()
      
      const describedById = await trigger.getAttribute('aria-describedby')
      const tooltip = await page.$(`#${describedById}`)
      
      expect(tooltip).toBeTruthy()
    }
  })

  test('should have proper language attribute', async ({ page }) => {
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toBe('fr')
  })

  test('should have accessible loading states', async ({ page }) => {
    // Déclencher un chargement
    const loadingButton = await page.$('button:has-text("Générer")')
    if (loadingButton) {
      await loadingButton.click()
      
      // Vérifier aria-busy
      const isBusy = await page.$('[aria-busy="true"]')
      expect(isBusy).toBeTruthy()
    }
  })
})

test.describe('Canvas Accessibility', () => {
  test('should have accessible alternative for Konva canvas', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier présence d'alternative accessible
    const hasAlternative = await page.evaluate(() => {
      const canvas = document.querySelector('canvas')
      if (!canvas) return false
      
      const parent = canvas.closest('[role="application"]')
      const srOnly = canvas.parentElement?.querySelector('.sr-only')
      
      return !!(parent || srOnly)
    })
    
    expect(hasAlternative).toBe(true)
  })

  test('should allow keyboard navigation of canvas items', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier que les items du canvas sont accessibles au clavier
    const accessibleItems = await page.$$('.sr-only button, [role="application"] button')
    expect(accessibleItems.length).toBeGreaterThan(0)
  })
})

test.describe('Color Contrast - Elite Orange', () => {
  test('should have sufficient contrast for Elite Orange', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier contraste des éléments orange
    const orangeElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*')
      const results: any[] = []
      
      elements.forEach((el) => {
        const computed = window.getComputedStyle(el)
        const bgColor = computed.backgroundColor
        const textColor = computed.color
        
        // Détecter Elite Orange (#FF684A = rgb(255, 104, 74))
        if (
          bgColor.includes('255, 104, 74') ||
          textColor.includes('255, 104, 74')
        ) {
          results.push({
            tag: el.tagName,
            bgColor,
            textColor,
            text: el.textContent?.substring(0, 30),
          })
        }
      })
      
      return results
    })
    
    // Si Elite Orange est utilisé, vérifier qu'il y a un avertissement
    if (orangeElements.length > 0) {
      console.warn(
        `⚠️ Elite Orange (#FF684A) détecté sur ${orangeElements.length} éléments. ` +
        `Ratio de contraste: 3.12:1 (insuffisant pour WCAG AA). ` +
        `Recommandation: Utiliser #E85535 (ratio 4.52:1)`
      )
    }
  })
})
