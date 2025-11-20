import { render, screen, fireEvent } from '@testing-library/react'
import { BoardCard } from '@/components/board/BoardCard'

describe('BoardCard', () => {
  const mockCard = {
    id: '1',
    type: 'image' as const,
    url: 'https://example.com/image.jpg',
    x: 100,
    y: 100,
    width: 200,
    height: 150,
    title: 'Test Image',
  }

  it('renders card with correct title', () => {
    render(<BoardCard card={mockCard} onUpdate={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Test Image')).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn()
    render(<BoardCard card={mockCard} onUpdate={() => {}} onDelete={onDelete} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('displays image for image type cards', () => {
    render(<BoardCard card={mockCard} onUpdate={() => {}} onDelete={() => {}} />)
    const image = screen.getByAltText('Test Image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockCard.url)
  })

  it('applies hover effect on mouse enter', () => {
    const { container } = render(
      <BoardCard card={mockCard} onUpdate={() => {}} onDelete={() => {}} />
    )
    
    const card = container.firstChild as HTMLElement
    fireEvent.mouseEnter(card)
    
    expect(card).toHaveClass('hover:border-orange-500')
  })

  it('handles video type cards', () => {
    const videoCard = { ...mockCard, type: 'video' as const }
    render(<BoardCard card={videoCard} onUpdate={() => {}} onDelete={() => {}} />)
    
    const video = screen.getByTestId('video-player')
    expect(video).toBeInTheDocument()
  })

  it('handles audio type cards', () => {
    const audioCard = { ...mockCard, type: 'audio' as const }
    render(<BoardCard card={audioCard} onUpdate={() => {}} onDelete={() => {}} />)
    
    const audio = screen.getByTestId('audio-player')
    expect(audio).toBeInTheDocument()
  })

  it('updates position when dragged', () => {
    const onUpdate = jest.fn()
    render(<BoardCard card={mockCard} onUpdate={onUpdate} onDelete={() => {}} />)
    
    // Simulate drag
    const card = screen.getByTestId('board-card')
    fireEvent.dragStart(card)
    fireEvent.dragEnd(card, { clientX: 300, clientY: 300 })
    
    expect(onUpdate).toHaveBeenCalled()
  })
})
