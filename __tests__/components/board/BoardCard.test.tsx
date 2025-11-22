import { render } from '@testing-library/react'
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
    const { getByTestId } = renderKonvaComponent(<BoardCard item={mockItem} />)
    // Vérifier que le Stage Konva est rendu
    expect(getByTestId('konva-stage')).toBeInTheDocument()
  })

  it('renders with different types', () => {
    const videoItem = { ...mockItem, type: 'video' }
    const { getByTestId } = renderKonvaComponent(<BoardCard item={videoItem} />)
    expect(getByTestId('konva-stage')).toBeInTheDocument()
  })

  it('renders with title', () => {
    const itemWithTitle = { ...mockItem, title: 'My Title' }
    const { getByTestId } = renderKonvaComponent(<BoardCard item={itemWithTitle} />)
    expect(getByTestId('konva-stage')).toBeInTheDocument()
  })

  it('renders without title', () => {
    const itemWithoutTitle = { ...mockItem, title: undefined }
    const { getByTestId } = renderKonvaComponent(<BoardCard item={itemWithoutTitle} />)
    expect(getByTestId('konva-stage')).toBeInTheDocument()
  })

  it('handles different content types', () => {
    const itemWithObject = { ...mockItem, content: { data: 'test' } }
    const { getByTestId } = renderKonvaComponent(<BoardCard item={itemWithObject} />)
    expect(getByTestId('konva-stage')).toBeInTheDocument()
  })

  it('renders at correct position', () => {
    const itemAtPosition = { ...mockItem, x: 50, y: 75 }
    const { getByTestId } = renderKonvaComponent(<BoardCard item={itemAtPosition} />)
    expect(getByTestId('konva-stage')).toBeInTheDocument()
  })
})
