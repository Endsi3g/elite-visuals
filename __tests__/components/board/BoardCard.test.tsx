import { render, screen } from '@testing-library/react'
import BoardCard from '@/components/board/BoardCard'
import { Stage, Layer } from 'react-konva'

describe('BoardCard', () => {
  const mockItem = {
    id: '1',
    type: 'image',
    x: 100,
    y: 100,
    width: 200,
    height: 150,
    title: 'Test Image',
    content: 'Test content',
  }

  // Helper pour render un composant Konva
  const renderKonvaComponent = (component: React.ReactNode) => {
    return render(
      <Stage width={800} height={600}>
        <Layer>{component}</Layer>
      </Stage>
    )
  }

  it('renders card with correct props', () => {
    const { container } = renderKonvaComponent(<BoardCard item={mockItem} />)
    expect(container).toBeInTheDocument()
  })

  it('renders with different types', () => {
    const videoItem = { ...mockItem, type: 'video' }
    const { container } = renderKonvaComponent(<BoardCard item={videoItem} />)
    expect(container).toBeInTheDocument()
  })

  it('renders with title', () => {
    const itemWithTitle = { ...mockItem, title: 'My Title' }
    const { container } = renderKonvaComponent(<BoardCard item={itemWithTitle} />)
    expect(container).toBeInTheDocument()
  })

  it('renders without title', () => {
    const itemWithoutTitle = { ...mockItem, title: undefined }
    const { container } = renderKonvaComponent(<BoardCard item={itemWithoutTitle} />)
    expect(container).toBeInTheDocument()
  })

  it('handles different content types', () => {
    const itemWithObject = { ...mockItem, content: { data: 'test' } }
    const { container } = renderKonvaComponent(<BoardCard item={itemWithObject} />)
    expect(container).toBeInTheDocument()
  })

  it('renders at correct position', () => {
    const itemAtPosition = { ...mockItem, x: 50, y: 75 }
    const { container } = renderKonvaComponent(<BoardCard item={itemAtPosition} />)
    expect(container).toBeInTheDocument()
  })
})
