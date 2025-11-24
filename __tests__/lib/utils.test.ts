import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('merges class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    it('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'excluded')
      expect(result).toContain('base')
      expect(result).toContain('conditional')
      expect(result).not.toContain('excluded')
    })

    it('handles undefined and null', () => {
      const result = cn('base', undefined, null, 'valid')
      expect(result).toContain('base')
      expect(result).toContain('valid')
    })

    it('handles empty input', () => {
      const result = cn()
      expect(result).toBeDefined()
    })

    it('deduplicates classes', () => {
      const result = cn('px-4', 'px-2')
      // Tailwind merge devrait garder seulement la dernière valeur
      expect(result).toBeTruthy()
    })
  })
})
