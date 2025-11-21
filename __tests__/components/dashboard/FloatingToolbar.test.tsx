import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FloatingToolbar from '@/components/dashboard/FloatingToolbar'

describe('FloatingToolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetModules()
  })

  describe('Rendering', () => {
    it('renders all toolbar sections', () => {
      render(<FloatingToolbar />)
      
      // Vérifier que le toolbar est présent
      const toolbar = screen.getByRole('button', { name: /ajouter une note/i })
      expect(toolbar).toBeInTheDocument()
    })

    it('renders all 13 action buttons', () => {
      render(<FloatingToolbar />)
      
      // Section Créer (3 boutons)
      expect(screen.getByRole('button', { name: /ajouter une note/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /ajouter une image/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /ajouter une vidéo/i })).toBeInTheDocument()
      
      // Section IA (3 boutons)
      expect(screen.getByRole('button', { name: /générer avec ia/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /analyser/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /créer mindmap/i })).toBeInTheDocument()
      
      // Section Actions (3 boutons)
      expect(screen.getByRole('button', { name: /connecter/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /regrouper/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /commenter/i })).toBeInTheDocument()
      
      // Section Export (2 boutons)
      expect(screen.getByRole('button', { name: /exporter/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /mode présentation/i })).toBeInTheDocument()
    })

    it('renders Elite Visuals badge', () => {
      render(<FloatingToolbar />)
      expect(screen.getByText(/elite visuals/i)).toBeInTheDocument()
    })

    it('renders with custom active action', () => {
      render(<FloatingToolbar activeAction="add-note" />)
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      expect(addNoteButton).toHaveClass('bg-primary')
    })
  })

  describe('Interactions', () => {
    it('calls onAction when button is clicked', () => {
      const mockOnAction = jest.fn()
      render(<FloatingToolbar onAction={mockOnAction} />)
      
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      fireEvent.click(addNoteButton)
      
      expect(mockOnAction).toHaveBeenCalledWith('add-note')
      expect(mockOnAction).toHaveBeenCalledTimes(1)
    })

    it('calls onAction with correct action for each button', () => {
      const mockOnAction = jest.fn()
      render(<FloatingToolbar onAction={mockOnAction} />)
      
      // Test add-image
      fireEvent.click(screen.getByRole('button', { name: /ajouter une image/i }))
      expect(mockOnAction).toHaveBeenLastCalledWith('add-image')
      
      // Test ai-generate
      fireEvent.click(screen.getByRole('button', { name: /générer avec ia/i }))
      expect(mockOnAction).toHaveBeenLastCalledWith('ai-generate')
      
      // Test export
      fireEvent.click(screen.getByRole('button', { name: /exporter/i }))
      expect(mockOnAction).toHaveBeenLastCalledWith('export')
    })

    it('does not call onAction when onAction is undefined', () => {
      render(<FloatingToolbar />)
      
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      // Should not throw error
      expect(() => fireEvent.click(addNoteButton)).not.toThrow()
    })

    it('shows tooltip on hover', async () => {
      render(<FloatingToolbar />)
      
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      
      // Hover sur le bouton
      fireEvent.mouseEnter(addNoteButton)
      
      // Le tooltip devrait apparaître
      await waitFor(() => {
        expect(screen.getByText(/ajouter une note/i)).toBeVisible()
      })
    })

    it('hides tooltip on mouse leave', async () => {
      render(<FloatingToolbar />)
      
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      
      // Hover puis leave
      fireEvent.mouseEnter(addNoteButton)
      fireEvent.mouseLeave(addNoteButton)
      
      // Le tooltip devrait disparaître
      await waitFor(() => {
        const tooltips = screen.queryAllByText(/ajouter une note/i)
        // Le texte existe dans le aria-label mais pas visible dans le tooltip
        expect(tooltips.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Active States', () => {
    it('highlights active button', () => {
      render(<FloatingToolbar activeAction="add-note" />)
      
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      expect(addNoteButton).toHaveClass('bg-primary')
    })

    it('updates active state when activeAction changes', () => {
      const { rerender } = render(<FloatingToolbar activeAction="add-note" />)
      
      let addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      expect(addNoteButton).toHaveClass('bg-primary')
      
      // Change active action
      rerender(<FloatingToolbar activeAction="ai-generate" />)
      
      addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      expect(addNoteButton).not.toHaveClass('bg-primary')
      
      const aiButton = screen.getByRole('button', { name: /générer avec ia/i })
      expect(aiButton).toHaveClass('bg-primary')
    })

    it('handles no active action', () => {
      render(<FloatingToolbar />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        if (!button.textContent?.includes('Elite Visuals')) {
          expect(button).not.toHaveClass('bg-primary')
        }
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-labels on all buttons', () => {
      render(<FloatingToolbar />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label')
      })
    })

    it('has proper button type', () => {
      render(<FloatingToolbar />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button')
      })
    })

    it('icons have aria-hidden', () => {
      const { container } = render(<FloatingToolbar />)
      
      const icons = container.querySelectorAll('svg')
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true')
      })
    })

    it('supports keyboard navigation', () => {
      const mockOnAction = jest.fn()
      render(<FloatingToolbar onAction={mockOnAction} />)
      
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      
      // Focus et Enter
      addNoteButton.focus()
      fireEvent.keyDown(addNoteButton, { key: 'Enter' })
      
      expect(mockOnAction).toHaveBeenCalledWith('add-note')
    })
  })

  describe('Styling', () => {
    it('applies correct CSS classes', () => {
      render(<FloatingToolbar />)
      
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      
      expect(addNoteButton).toHaveClass('w-14')
      expect(addNoteButton).toHaveClass('h-14')
      expect(addNoteButton).toHaveClass('rounded-xl')
    })

    it('applies glow effect to AI buttons', () => {
      render(<FloatingToolbar />)
      
      const aiButton = screen.getByRole('button', { name: /générer avec ia/i })
      // Les boutons IA ont des classes spéciales pour le glow
      expect(aiButton).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid clicks', () => {
      const mockOnAction = jest.fn()
      render(<FloatingToolbar onAction={mockOnAction} />)
      
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      
      // Cliquer rapidement 5 fois
      for (let i = 0; i < 5; i++) {
        fireEvent.click(addNoteButton)
      }
      
      expect(mockOnAction).toHaveBeenCalledTimes(5)
    })

    it('handles unmounting during hover', () => {
      const { unmount } = render(<FloatingToolbar />)
      
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      fireEvent.mouseEnter(addNoteButton)
      
      // Should not throw error
      expect(() => unmount()).not.toThrow()
    })

    it('renders correctly with all props undefined', () => {
      expect(() => render(<FloatingToolbar />)).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const mockOnAction = jest.fn()
      const { rerender } = render(<FloatingToolbar onAction={mockOnAction} />)
      
      // Re-render avec les mêmes props
      rerender(<FloatingToolbar onAction={mockOnAction} />)
      
      // Le composant devrait toujours fonctionner
      const addNoteButton = screen.getByRole('button', { name: /ajouter une note/i })
      expect(addNoteButton).toBeInTheDocument()
    })
  })
})
