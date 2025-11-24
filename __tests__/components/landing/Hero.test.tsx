import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { Hero } from '@/components/landing/Hero'

describe('Hero Component', () => {
  it('renders hero section with main heading', () => {
    render(<Hero />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('displays CTA buttons', () => {
    render(<Hero />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('has accessible structure', () => {
    const { container } = render(<Hero />)
    
    // Vérifier la structure sémantique
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    expect(() => render(<Hero />)).not.toThrow()
  })
})
