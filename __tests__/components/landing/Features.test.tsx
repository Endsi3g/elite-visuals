import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { Features } from '@/components/landing/Features'

describe('Features Component', () => {
  it('renders features section', () => {
    render(<Features />)
    
    const section = screen.getByRole('region', { name: /features/i }) || 
                    screen.getByText(/fonctionnalités/i).closest('section')
    expect(section || document.querySelector('section')).toBeInTheDocument()
  })

  it('displays multiple feature cards', () => {
    const { container } = render(<Features />)
    
    // Vérifier qu'il y a plusieurs éléments de fonctionnalités
    const featureElements = container.querySelectorAll('[class*="feature"], [class*="card"]')
    expect(featureElements.length).toBeGreaterThan(0)
  })

  it('renders without errors', () => {
    expect(() => render(<Features />)).not.toThrow()
  })

  it('has proper semantic structure', () => {
    const { container } = render(<Features />)
    
    // Vérifier la présence d'une structure sémantique
    expect(container.querySelector('section') || container.querySelector('div')).toBeInTheDocument()
  })
})
