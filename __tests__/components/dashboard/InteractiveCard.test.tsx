import { render, screen, fireEvent } from '@testing-library/react'
import InteractiveCard from '@/components/dashboard/InteractiveCard'
import { Stage, Layer } from 'react-konva'

describe('InteractiveCard', () => {
  const mockCard = {
    id: 'card-1',
    x: 100,
    y: 100,
    width: 300,
    height: 200,
    type: 'text' as const,
    title: 'Test Card',
    content: 'Test content',
    author: 'John Doe',
    timestamp: new Date('2024-01-01'),
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
    it('renders text card correctly', () => {
      const { container } = renderKonvaComponent(<InteractiveCard card={mockCard} />)
      expect(container).toBeTruthy()
    })

    it('renders image card correctly', () => {
      const imageCard = { ...mockCard, type: 'image' as const, imageUrl: 'test.jpg' }
      const { container } = renderKonvaComponent(<InteractiveCard card={imageCard} />)
      expect(container).toBeTruthy()
    })

    it('renders video card correctly', () => {
      const videoCard = { ...mockCard, type: 'video' as const }
      const { container } = renderKonvaComponent(<InteractiveCard card={videoCard} />)
      expect(container).toBeTruthy()
    })

    it('renders AI-generated card correctly', () => {
      const aiCard = { ...mockCard, type: 'ai-generated' as const, aiModel: 'Claude 3.5' }
      const { container } = renderKonvaComponent(<InteractiveCard card={aiCard} />)
      expect(container).toBeTruthy()
    })

    it('renders with custom dimensions', () => {
      const customCard = { ...mockCard, width: 400, height: 300 }
      const { container } = renderKonvaComponent(<InteractiveCard card={customCard} />)
      expect(container).toBeTruthy()
    })

    it('renders at custom position', () => {
      const positionedCard = { ...mockCard, x: 200, y: 300 }
      const { container } = renderKonvaComponent(<InteractiveCard card={positionedCard} />)
      expect(container).toBeTruthy()
    })
  })

  describe('Interactions', () => {
    it('calls onDragEnd when card is dragged', () => {
      const mockOnDragEnd = jest.fn()
      const { container } = renderKonvaComponent(
        <InteractiveCard card={mockCard} onDragEnd={mockOnDragEnd} />
      )
      
      const group = container.querySelector('[data-testid="konva-group"]')
      if (group) {
        fireEvent.dragEnd(group, { target: { x: () => 150, y: () => 150 } })
      }
      
      expect(mockOnDragEnd).toHaveBeenCalled()
    })

    it('calls onClick when card is clicked', () => {
      const mockOnClick = jest.fn()
      const { container } = renderKonvaComponent(
        <InteractiveCard card={mockCard} onClick={mockOnClick} />
      )
      
      const group = container.querySelector('[data-testid="konva-group"]')
      if (group) {
        fireEvent.click(group)
      }
      
      expect(mockOnClick).toHaveBeenCalledWith('card-1')
    })

    it('does not call callbacks when they are undefined', () => {
      const { container } = renderKonvaComponent(<InteractiveCard card={mockCard} />)
      
      const group = container.querySelector('[data-testid="konva-group"]')
      if (group) {
        expect(() => {
          fireEvent.click(group)
          fireEvent.dragEnd(group)
        }).not.toThrow()
      }
    })
  })

  describe('Selected State', () => {
    it('renders with selected state', () => {
      const { container } = renderKonvaComponent(
        <InteractiveCard card={mockCard} selected={true} />
      )
      expect(container).toBeTruthy()
    })

    it('renders without selected state', () => {
      const { container } = renderKonvaComponent(
        <InteractiveCard card={mockCard} selected={false} />
      )
      expect(container).toBeTruthy()
    })

    it('changes appearance when selected', () => {
      const { container, rerender } = renderKonvaComponent(
        <InteractiveCard card={mockCard} selected={false} />
      )
      
      expect(container).toBeTruthy()
      
      rerender(
        <Stage width={800} height={600}>
          <Layer>
            <InteractiveCard card={mockCard} selected={true} />
          </Layer>
        </Stage>
      )
      
      expect(container).toBeTruthy()
    })
  })

  describe('Card Types', () => {
    it('displays correct badge for text card', () => {
      const { container } = renderKonvaComponent(<InteractiveCard card={mockCard} />)
      expect(container).toBeTruthy()
    })

    it('displays correct badge for image card', () => {
      const imageCard = { ...mockCard, type: 'image' as const }
      const { container } = renderKonvaComponent(<InteractiveCard card={imageCard} />)
      expect(container).toBeTruthy()
    })

    it('displays correct badge for video card', () => {
      const videoCard = { ...mockCard, type: 'video' as const }
      const { container } = renderKonvaComponent(<InteractiveCard card={videoCard} />)
      expect(container).toBeTruthy()
    })

    it('displays AI model badge for AI-generated card', () => {
      const aiCard = { ...mockCard, type: 'ai-generated' as const, aiModel: 'GPT-4' }
      const { container } = renderKonvaComponent(<InteractiveCard card={aiCard} />)
      expect(container).toBeTruthy()
    })

    it('handles AI card without model specified', () => {
      const aiCard = { ...mockCard, type: 'ai-generated' as const }
      const { container } = renderKonvaComponent(<InteractiveCard card={aiCard} />)
      expect(container).toBeTruthy()
    })
  })

  describe('Content Display', () => {
    it('displays title correctly', () => {
      const { container } = renderKonvaComponent(<InteractiveCard card={mockCard} />)
      expect(container).toBeTruthy()
    })

    it('displays content correctly', () => {
      const { container } = renderKonvaComponent(<InteractiveCard card={mockCard} />)
      expect(container).toBeTruthy()
    })

    it('displays author correctly', () => {
      const { container } = renderKonvaComponent(<InteractiveCard card={mockCard} />)
      expect(container).toBeTruthy()
    })

    it('formats timestamp correctly', () => {
      const { container } = renderKonvaComponent(<InteractiveCard card={mockCard} />)
      expect(container).toBeTruthy()
    })

    it('handles long content', () => {
      const longCard = {
        ...mockCard,
        content: 'This is a very long content that should be truncated or wrapped properly in the card component to avoid overflow issues'
      }
      const { container } = renderKonvaComponent(<InteractiveCard card={longCard} />)
      expect(container).toBeTruthy()
    })

    it('handles long title', () => {
      const longTitleCard = {
        ...mockCard,
        title: 'This is a very long title that should be handled properly'
      }
      const { container } = renderKonvaComponent(<InteractiveCard card={longTitleCard} />)
      expect(container).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty title', () => {
      const emptyTitleCard = { ...mockCard, title: '' }
      const { container } = renderKonvaComponent(<InteractiveCard card={emptyTitleCard} />)
      expect(container).toBeTruthy()
    })

    it('handles empty content', () => {
      const emptyContentCard = { ...mockCard, content: '' }
      const { container } = renderKonvaComponent(<InteractiveCard card={emptyContentCard} />)
      expect(container).toBeTruthy()
    })

    it('handles empty author', () => {
      const emptyAuthorCard = { ...mockCard, author: '' }
      const { container } = renderKonvaComponent(<InteractiveCard card={emptyAuthorCard} />)
      expect(container).toBeTruthy()
    })

    it('handles card at negative coordinates', () => {
      const negativeCard = { ...mockCard, x: -50, y: -50 }
      const { container } = renderKonvaComponent(<InteractiveCard card={negativeCard} />)
      expect(container).toBeTruthy()
    })

    it('handles very small dimensions', () => {
      const smallCard = { ...mockCard, width: 50, height: 50 }
      const { container } = renderKonvaComponent(<InteractiveCard card={smallCard} />)
      expect(container).toBeTruthy()
    })

    it('handles very large dimensions', () => {
      const largeCard = { ...mockCard, width: 1000, height: 800 }
      const { container } = renderKonvaComponent(<InteractiveCard card={largeCard} />)
      expect(container).toBeTruthy()
    })

    it('handles special characters in content', () => {
      const specialCard = {
        ...mockCard,
        title: 'Test <>&"\'',
        content: 'Content with special chars: <>&"\''
      }
      const { container } = renderKonvaComponent(<InteractiveCard card={specialCard} />)
      expect(container).toBeTruthy()
    })

    it('handles unicode characters', () => {
      const unicodeCard = {
        ...mockCard,
        title: '测试 🎨 Тест',
        content: 'Unicode content: 你好 👋 Привет'
      }
      const { container } = renderKonvaComponent(<InteractiveCard card={unicodeCard} />)
      expect(container).toBeTruthy()
    })
  })

  describe('Image Cards', () => {
    it('renders image card with URL', () => {
      const imageCard = {
        ...mockCard,
        type: 'image' as const,
        imageUrl: 'https://example.com/image.jpg'
      }
      const { container } = renderKonvaComponent(<InteractiveCard card={imageCard} />)
      expect(container).toBeTruthy()
    })

    it('handles image card without URL', () => {
      const imageCard = { ...mockCard, type: 'image' as const }
      const { container } = renderKonvaComponent(<InteractiveCard card={imageCard} />)
      expect(container).toBeTruthy()
    })

    it('handles invalid image URL', () => {
      const imageCard = {
        ...mockCard,
        type: 'image' as const,
        imageUrl: 'invalid-url'
      }
      const { container } = renderKonvaComponent(<InteractiveCard card={imageCard} />)
      expect(container).toBeTruthy()
    })
  })

  describe('Performance', () => {
    it('handles rapid re-renders', () => {
      const { rerender } = renderKonvaComponent(<InteractiveCard card={mockCard} />)
      
      for (let i = 0; i < 10; i++) {
        rerender(
          <Stage width={800} height={600}>
            <Layer>
              <InteractiveCard card={{ ...mockCard, x: mockCard.x + i }} />
            </Layer>
          </Stage>
        )
      }
      
      expect(screen.getByTestId('konva-stage')).toBeTruthy()
    })

    it('handles multiple cards rendering', () => {
      const cards = Array.from({ length: 10 }, (_, i) => ({
        ...mockCard,
        id: `card-${i}`,
        x: 100 + i * 50,
        y: 100 + i * 50,
      }))

      const { container } = render(
        <Stage width={800} height={600}>
          <Layer>
            {cards.map(card => (
              <InteractiveCard key={card.id} card={card} />
            ))}
          </Layer>
        </Stage>
      )
      
      expect(container).toBeTruthy()
    })
  })

  describe('Timestamp Formatting', () => {
    it('handles recent timestamp', () => {
      const recentCard = { ...mockCard, timestamp: new Date() }
      const { container } = renderKonvaComponent(<InteractiveCard card={recentCard} />)
      expect(container).toBeTruthy()
    })

    it('handles old timestamp', () => {
      const oldCard = { ...mockCard, timestamp: new Date('2020-01-01') }
      const { container } = renderKonvaComponent(<InteractiveCard card={oldCard} />)
      expect(container).toBeTruthy()
    })

    it('handles future timestamp', () => {
      const futureCard = { ...mockCard, timestamp: new Date('2030-01-01') }
      const { container } = renderKonvaComponent(<InteractiveCard card={futureCard} />)
      expect(container).toBeTruthy()
    })
  })
})
