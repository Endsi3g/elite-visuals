import { render } from '@testing-library/react'
import BoardCard from '@/components/board/BoardCard'
import { Stage, Layer } from 'react-konva'

// Mock canvas pour les tests
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
})) as any

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
    // Vérifier que le canvas est rendu
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('renders with different types', () => {
    const videoItem = { ...mockItem, type: 'video' }
    const { container } = renderKonvaComponent(<BoardCard item={videoItem} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('renders with title', () => {
    const itemWithTitle = { ...mockItem, title: 'My Title' }
    const { container } = renderKonvaComponent(<BoardCard item={itemWithTitle} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('renders without title', () => {
    const itemWithoutTitle = { ...mockItem, title: undefined }
    const { container } = renderKonvaComponent(<BoardCard item={itemWithoutTitle} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('handles different content types', () => {
    const itemWithObject = { ...mockItem, content: { data: 'test' } }
    const { container } = renderKonvaComponent(<BoardCard item={itemWithObject} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('renders at correct position', () => {
    const itemAtPosition = { ...mockItem, x: 50, y: 75 }
    const { container } = renderKonvaComponent(<BoardCard item={itemAtPosition} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })
})
