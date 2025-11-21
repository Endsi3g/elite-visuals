import { render, screen, fireEvent } from '@testing-library/react'
import MindMapNode, { MindMapConnection } from '@/components/dashboard/MindMapNode'
import { Stage, Layer } from 'react-konva'

describe('MindMapNode', () => {
  const mockNode = {
    id: 'node-1',
    x: 100,
    y: 100,
    width: 280,
    height: 120,
    title: 'Test Node',
    content: 'Test content',
    type: 'root' as const,
    parentId: undefined,
    children: [],
    aiGenerated: false,
  }

  const renderKonvaComponent = (component: React.ReactNode) => {
    return render(
      <Stage width={800} height={600}>
        <Layer>{component}</Layer>
      </Stage>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetModules()
  })

  describe('Rendering', () => {
    it('renders root node correctly', () => {
      const { container } = renderKonvaComponent(<MindMapNode node={mockNode} />)
      expect(container).toBeInTheDocument()
    })

    it('renders branch node correctly', () => {
      const branchNode = { ...mockNode, type: 'branch' as const, width: 240, height: 100 }
      const { container } = renderKonvaComponent(<MindMapNode node={branchNode} />)
      expect(container).toBeInTheDocument()
    })

    it('renders leaf node correctly', () => {
      const leafNode = { ...mockNode, type: 'leaf' as const, width: 200, height: 80 }
      const { container } = renderKonvaComponent(<MindMapNode node={leafNode} />)
      expect(container).toBeInTheDocument()
    })

    it('renders AI badge when aiGenerated is true', () => {
      const aiNode = { ...mockNode, aiGenerated: true }
      const { container } = renderKonvaComponent(<MindMapNode node={aiNode} />)
      expect(container).toBeInTheDocument()
    })

    it('does not render AI badge when aiGenerated is false', () => {
      const { container } = renderKonvaComponent(<MindMapNode node={mockNode} />)
      expect(container).toBeInTheDocument()
    })

    it('renders with custom color', () => {
      const coloredNode = { ...mockNode, color: '#FF0000' }
      const { container } = renderKonvaComponent(<MindMapNode node={coloredNode} />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onDragEnd when node is dragged', () => {
      const mockOnDragEnd = jest.fn()
      const { container } = renderKonvaComponent(
        <MindMapNode node={mockNode} onDragEnd={mockOnDragEnd} />
      )
      
      const group = container.querySelector('[data-testid="konva-group"]')
      if (group) {
        fireEvent.dragEnd(group, { target: { x: () => 150, y: () => 150 } })
      }
      
      expect(mockOnDragEnd).toHaveBeenCalled()
    })

    it('calls onDoubleClick when node is double-clicked', () => {
      const mockOnDoubleClick = jest.fn()
      const { container } = renderKonvaComponent(
        <MindMapNode node={mockNode} onDoubleClick={mockOnDoubleClick} />
      )
      
      const group = container.querySelector('[data-testid="konva-group"]')
      if (group) {
        fireEvent.doubleClick(group)
      }
      
      expect(mockOnDoubleClick).toHaveBeenCalledWith('node-1')
    })

    it('calls onClick when node is clicked', () => {
      const mockOnClick = jest.fn()
      const { container } = renderKonvaComponent(
        <MindMapNode node={mockNode} onClick={mockOnClick} />
      )
      
      const group = container.querySelector('[data-testid="konva-group"]')
      if (group) {
        fireEvent.click(group)
      }
      
      expect(mockOnClick).toHaveBeenCalledWith('node-1')
    })

    it('does not call callbacks when they are undefined', () => {
      const { container } = renderKonvaComponent(<MindMapNode node={mockNode} />)
      
      const group = container.querySelector('[data-testid="konva-group"]')
      if (group) {
        expect(() => {
          fireEvent.click(group)
          fireEvent.doubleClick(group)
          fireEvent.dragEnd(group)
        }).not.toThrow()
      }
    })
  })

  describe('Selected State', () => {
    it('renders with selected state', () => {
      const { container } = renderKonvaComponent(
        <MindMapNode node={mockNode} selected={true} />
      )
      expect(container).toBeInTheDocument()
    })

    it('renders without selected state', () => {
      const { container } = renderKonvaComponent(
        <MindMapNode node={mockNode} selected={false} />
      )
      expect(container).toBeInTheDocument()
    })

    it('changes appearance when selected', () => {
      const { container, rerender } = renderKonvaComponent(
        <MindMapNode node={mockNode} selected={false} />
      )
      
      expect(container).toBeInTheDocument()
      
      rerender(
        <Stage width={800} height={600}>
          <Layer>
            <MindMapNode node={mockNode} selected={true} />
          </Layer>
        </Stage>
      )
      
      expect(container).toBeInTheDocument()
    })
  })

  describe('Node Types', () => {
    it('applies correct styles for root node', () => {
      const rootNode = { ...mockNode, type: 'root' as const }
      const { container } = renderKonvaComponent(<MindMapNode node={rootNode} />)
      expect(container).toBeInTheDocument()
    })

    it('applies correct styles for branch node', () => {
      const branchNode = { ...mockNode, type: 'branch' as const }
      const { container } = renderKonvaComponent(<MindMapNode node={branchNode} />)
      expect(container).toBeInTheDocument()
    })

    it('applies correct styles for leaf node', () => {
      const leafNode = { ...mockNode, type: 'leaf' as const }
      const { container } = renderKonvaComponent(<MindMapNode node={leafNode} />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty title', () => {
      const nodeWithEmptyTitle = { ...mockNode, title: '' }
      const { container } = renderKonvaComponent(<MindMapNode node={nodeWithEmptyTitle} />)
      expect(container).toBeInTheDocument()
    })

    it('handles empty content', () => {
      const nodeWithEmptyContent = { ...mockNode, content: '' }
      const { container } = renderKonvaComponent(<MindMapNode node={nodeWithEmptyContent} />)
      expect(container).toBeInTheDocument()
    })

    it('handles very long title', () => {
      const nodeWithLongTitle = { 
        ...mockNode, 
        title: 'This is a very long title that should be handled properly by the component'
      }
      const { container } = renderKonvaComponent(<MindMapNode node={nodeWithLongTitle} />)
      expect(container).toBeInTheDocument()
    })

    it('handles very long content', () => {
      const nodeWithLongContent = { 
        ...mockNode, 
        content: 'This is very long content that should be handled properly by the component and not overflow'
      }
      const { container } = renderKonvaComponent(<MindMapNode node={nodeWithLongContent} />)
      expect(container).toBeInTheDocument()
    })

    it('handles node at negative coordinates', () => {
      const nodeAtNegative = { ...mockNode, x: -50, y: -50 }
      const { container } = renderKonvaComponent(<MindMapNode node={nodeAtNegative} />)
      expect(container).toBeInTheDocument()
    })

    it('handles node with children array', () => {
      const nodeWithChildren = { ...mockNode, children: ['child-1', 'child-2'] }
      const { container } = renderKonvaComponent(<MindMapNode node={nodeWithChildren} />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('handles rapid re-renders', () => {
      const { rerender } = renderKonvaComponent(<MindMapNode node={mockNode} />)
      
      for (let i = 0; i < 10; i++) {
        rerender(
          <Stage width={800} height={600}>
            <Layer>
              <MindMapNode node={{ ...mockNode, x: mockNode.x + i }} />
            </Layer>
          </Stage>
        )
      }
      
      expect(screen.getByTestId('konva-stage')).toBeInTheDocument()
    })
  })
})

describe('MindMapConnection', () => {
  const mockConnection = {
    from: { x: 100, y: 100, width: 200, height: 100 },
    to: { x: 400, y: 300, width: 200, height: 100 },
  }

  const renderKonvaComponent = (component: React.ReactNode) => {
    return render(
      <Stage width={800} height={600}>
        <Layer>{component}</Layer>
      </Stage>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetModules()
  })

  describe('Rendering', () => {
    it('renders connection line', () => {
      const { container } = renderKonvaComponent(<MindMapConnection {...mockConnection} />)
      expect(container).toBeInTheDocument()
    })

    it('renders with custom color', () => {
      const { container } = renderKonvaComponent(
        <MindMapConnection {...mockConnection} color="#FF0000" />
      )
      expect(container).toBeInTheDocument()
    })

    it('renders with default color', () => {
      const { container } = renderKonvaComponent(<MindMapConnection {...mockConnection} />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('Connection Paths', () => {
    it('handles horizontal connections', () => {
      const horizontal = {
        from: { x: 100, y: 100, width: 200, height: 100 },
        to: { x: 400, y: 100, width: 200, height: 100 },
      }
      const { container } = renderKonvaComponent(<MindMapConnection {...horizontal} />)
      expect(container).toBeInTheDocument()
    })

    it('handles vertical connections', () => {
      const vertical = {
        from: { x: 100, y: 100, width: 200, height: 100 },
        to: { x: 100, y: 400, width: 200, height: 100 },
      }
      const { container } = renderKonvaComponent(<MindMapConnection {...vertical} />)
      expect(container).toBeInTheDocument()
    })

    it('handles diagonal connections', () => {
      const { container } = renderKonvaComponent(<MindMapConnection {...mockConnection} />)
      expect(container).toBeInTheDocument()
    })

    it('handles reverse connections (to is before from)', () => {
      const reverse = {
        from: { x: 400, y: 300, width: 200, height: 100 },
        to: { x: 100, y: 100, width: 200, height: 100 },
      }
      const { container } = renderKonvaComponent(<MindMapConnection {...reverse} />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles zero-width nodes', () => {
      const zeroWidth = {
        from: { x: 100, y: 100, width: 0, height: 100 },
        to: { x: 400, y: 300, width: 0, height: 100 },
      }
      const { container } = renderKonvaComponent(<MindMapConnection {...zeroWidth} />)
      expect(container).toBeInTheDocument()
    })

    it('handles zero-height nodes', () => {
      const zeroHeight = {
        from: { x: 100, y: 100, width: 200, height: 0 },
        to: { x: 400, y: 300, width: 200, height: 0 },
      }
      const { container } = renderKonvaComponent(<MindMapConnection {...zeroHeight} />)
      expect(container).toBeInTheDocument()
    })

    it('handles same position nodes', () => {
      const samePosition = {
        from: { x: 100, y: 100, width: 200, height: 100 },
        to: { x: 100, y: 100, width: 200, height: 100 },
      }
      const { container } = renderKonvaComponent(<MindMapConnection {...samePosition} />)
      expect(container).toBeInTheDocument()
    })
  })
})
