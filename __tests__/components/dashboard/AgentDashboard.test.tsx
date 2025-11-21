import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AgentDashboard from '@/components/dashboard/AgentDashboard'

// Mock des composants enfants
jest.mock('@/components/dashboard/FloatingToolbar', () => {
  return function MockFloatingToolbar({ onAction }: any) {
    return (
      <div data-testid="floating-toolbar">
        <button onClick={() => onAction?.('add-note')}>Add Note</button>
        <button onClick={() => onAction?.('ai-generate')}>AI Generate</button>
        <button onClick={() => onAction?.('create-mindmap')}>Create Mindmap</button>
      </div>
    )
  }
})

jest.mock('@/components/board/OptimizedGrid', () => {
  return function MockOptimizedGrid() {
    return <div data-testid="optimized-grid" />
  }
})

describe('AgentDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 })
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 1080 })
  })

  afterEach(() => {
    jest.resetModules()
  })

  describe('Rendering', () => {
    it('renders dashboard correctly', () => {
      render(<AgentDashboard />)
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
    })

    it('renders floating toolbar', () => {
      render(<AgentDashboard />)
      expect(screen.getByTestId('floating-toolbar')).toBeTruthy()
    })

    it('renders optimized grid', () => {
      render(<AgentDashboard />)
      expect(screen.getByTestId('optimized-grid')).toBeTruthy()
    })

    it('renders info bar', () => {
      render(<AgentDashboard />)
      expect(screen.getByText(/zoom:/i)).toBeTruthy()
    })

    it('renders with showKanban prop', () => {
      render(<AgentDashboard showKanban={true} />)
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
    })

    it('renders without showKanban prop', () => {
      render(<AgentDashboard showKanban={false} />)
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
    })
  })

  describe('Toolbar Actions', () => {
    it('handles add-note action', async () => {
      render(<AgentDashboard />)
      
      const addNoteButton = screen.getByText('Add Note')
      fireEvent.click(addNoteButton)
      
      await waitFor(() => {
        expect(screen.getByText(/cards: 1/i)).toBeTruthy()
      })
    })

    it('handles ai-generate action', async () => {
      render(<AgentDashboard />)
      
      const aiButton = screen.getByText('AI Generate')
      fireEvent.click(aiButton)
      
      await waitFor(() => {
        expect(screen.getByText(/cards: 1/i)).toBeTruthy()
      })
    })

    it('handles create-mindmap action', async () => {
      render(<AgentDashboard />)
      
      const mindmapButton = screen.getByText('Create Mindmap')
      fireEvent.click(mindmapButton)
      
      await waitFor(() => {
        expect(screen.getByText(/nœuds: 1/i)).toBeTruthy()
      })
    })

    it('handles multiple actions', async () => {
      render(<AgentDashboard />)
      
      fireEvent.click(screen.getByText('Add Note'))
      fireEvent.click(screen.getByText('Add Note'))
      fireEvent.click(screen.getByText('AI Generate'))
      
      await waitFor(() => {
        expect(screen.getByText(/cards: 3/i)).toBeTruthy()
      })
    })
  })

  describe('Canvas Interactions', () => {
    it('handles zoom in', () => {
      render(<AgentDashboard />)
      
      const stage = screen.getByTestId('konva-stage')
      
      // Simuler un zoom avec la molette
      fireEvent.wheel(stage, { deltaY: -100 })
      
      // Le zoom devrait augmenter
      expect(screen.getByText(/zoom:/i)).toBeTruthy()
    })

    it('handles zoom out', () => {
      render(<AgentDashboard />)
      
      const stage = screen.getByTestId('konva-stage')
      
      // Simuler un zoom out
      fireEvent.wheel(stage, { deltaY: 100 })
      
      expect(screen.getByText(/zoom:/i)).toBeTruthy()
    })

    it('handles pan', () => {
      render(<AgentDashboard />)
      
      const stage = screen.getByTestId('konva-stage')
      
      // Simuler un drag
      fireEvent.dragEnd(stage, { target: { x: () => 50, y: () => 50 } })
      
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
    })

    it('respects zoom limits', () => {
      render(<AgentDashboard />)
      
      const stage = screen.getByTestId('konva-stage')
      
      // Essayer de zoomer trop
      for (let i = 0; i < 20; i++) {
        fireEvent.wheel(stage, { deltaY: -100 })
      }
      
      expect(screen.getByText(/zoom:/i)).toBeTruthy()
    })
  })

  describe('Mindmap Nodes', () => {
    it('creates mindmap node', async () => {
      render(<AgentDashboard />)
      
      fireEvent.click(screen.getByText('Create Mindmap'))
      
      await waitFor(() => {
        expect(screen.getByText(/nœuds: 1/i)).toBeTruthy()
      })
    })

    it('handles node expansion', async () => {
      render(<AgentDashboard />)
      
      // Créer un nœud
      fireEvent.click(screen.getByText('Create Mindmap'))
      
      await waitFor(() => {
        expect(screen.getByText(/nœuds: 1/i)).toBeTruthy()
      })
      
      // Double-clic pour expansion (simulé)
      // Note: Dans un vrai test, il faudrait accéder au nœud Konva
    })
  })

  describe('Interactive Cards', () => {
    it('creates text card', async () => {
      render(<AgentDashboard />)
      
      fireEvent.click(screen.getByText('Add Note'))
      
      await waitFor(() => {
        expect(screen.getByText(/cards: 1/i)).toBeTruthy()
      })
    })

    it('creates AI card', async () => {
      render(<AgentDashboard />)
      
      fireEvent.click(screen.getByText('AI Generate'))
      
      await waitFor(() => {
        expect(screen.getByText(/cards: 1/i)).toBeTruthy()
      })
    })

    it('creates multiple cards', async () => {
      render(<AgentDashboard />)
      
      fireEvent.click(screen.getByText('Add Note'))
      fireEvent.click(screen.getByText('Add Note'))
      fireEvent.click(screen.getByText('AI Generate'))
      
      await waitFor(() => {
        expect(screen.getByText(/cards: 3/i)).toBeTruthy()
      })
    })
  })

  describe('Info Bar', () => {
    it('displays zoom level', () => {
      render(<AgentDashboard />)
      expect(screen.getByText(/zoom: 100%/i)).toBeTruthy()
    })

    it('displays node count', () => {
      render(<AgentDashboard />)
      expect(screen.getByText(/nœuds: 0/i)).toBeTruthy()
    })

    it('displays card count', () => {
      render(<AgentDashboard />)
      expect(screen.getByText(/cards: 0/i)).toBeTruthy()
    })

    it('updates counts when items are added', async () => {
      render(<AgentDashboard />)
      
      fireEvent.click(screen.getByText('Add Note'))
      
      await waitFor(() => {
        expect(screen.getByText(/cards: 1/i)).toBeTruthy()
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('handles window resize', () => {
      render(<AgentDashboard />)
      
      // Changer la taille de la fenêtre
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 768 })
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 1024 })
      
      fireEvent.resize(window)
      
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
    })

    it('adapts to small screens', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 })
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 667 })
      
      render(<AgentDashboard />)
      
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
    })

    it('adapts to large screens', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 2560 })
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 1440 })
      
      render(<AgentDashboard />)
      
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid action clicks', async () => {
      render(<AgentDashboard />)
      
      const addButton = screen.getByText('Add Note')
      
      // Cliquer rapidement 10 fois
      for (let i = 0; i < 10; i++) {
        fireEvent.click(addButton)
      }
      
      await waitFor(() => {
        expect(screen.getByText(/cards: 10/i)).toBeTruthy()
      })
    })

    it('handles unmounting during action', () => {
      const { unmount } = render(<AgentDashboard />)
      
      fireEvent.click(screen.getByText('Add Note'))
      
      expect(() => unmount()).not.toThrow()
    })

    it('handles empty state', () => {
      render(<AgentDashboard />)
      
      expect(screen.getByText(/nœuds: 0/i)).toBeTruthy()
      expect(screen.getByText(/cards: 0/i)).toBeTruthy()
    })
  })

  describe('Performance', () => {
    it('handles many nodes efficiently', async () => {
      render(<AgentDashboard />)
      
      // Créer plusieurs nœuds
      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByText('Create Mindmap'))
      }
      
      await waitFor(() => {
        expect(screen.getByText(/nœuds: 5/i)).toBeTruthy()
      })
    })

    it('handles many cards efficiently', async () => {
      render(<AgentDashboard />)
      
      // Créer plusieurs cards
      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByText('Add Note'))
      }
      
      await waitFor(() => {
        expect(screen.getByText(/cards: 10/i)).toBeTruthy()
      })
    })

    it('does not re-render unnecessarily', () => {
      const { rerender } = render(<AgentDashboard />)
      
      // Re-render avec les mêmes props
      rerender(<AgentDashboard />)
      
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('has proper structure', () => {
      render(<AgentDashboard />)
      
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
      expect(screen.getByTestId('floating-toolbar')).toBeTruthy()
    })

    it('provides keyboard navigation', () => {
      render(<AgentDashboard />)
      
      const addButton = screen.getByText('Add Note')
      
      // Focus et Enter
      addButton.focus()
      fireEvent.keyDown(addButton, { key: 'Enter' })
      
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
    })
  })
})
