import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { AITaskCreator } from '@/components/ai/AITaskCreator'

// Mock du contexte AI
jest.mock('@/contexts/AITaskContext', () => ({
  useAITasks: () => ({
    addTask: jest.fn(),
    tasks: [],
  }),
}))

describe('AITaskCreator Component', () => {
  const mockProps = {
    boardId: 'test-board-123',
    onCreateTask: jest.fn(),
  }

  it('renders task creator form', () => {
    render(<AITaskCreator {...mockProps} />)
    
    // Vérifier la présence d'éléments de formulaire
    const form = screen.getByRole('form') || document.querySelector('form')
    expect(form || document.querySelector('input, textarea, select')).toBeInTheDocument()
  })

  it('has input for task description', () => {
    render(<AITaskCreator {...mockProps} />)
    
    const input = screen.getByRole('textbox') || 
                  screen.getByPlaceholderText(/description/i) ||
                  document.querySelector('input[type="text"], textarea')
    expect(input).toBeInTheDocument()
  })

  it('has agent selection dropdown', () => {
    render(<AITaskCreator {...mockProps} />)
    
    const select = screen.getByRole('combobox') || 
                   screen.getByLabelText(/agent/i) ||
                   document.querySelector('select')
    expect(select).toBeTruthy()
  })

  it('has submit button', () => {
    render(<AITaskCreator {...mockProps} />)
    
    const button = screen.getByRole('button', { name: /create|add|submit/i }) ||
                   screen.getAllByRole('button')[0]
    expect(button).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    expect(() => render(<AITaskCreator {...mockProps} />)).not.toThrow()
  })
})
