import { render, screen, fireEvent } from '@testing-library/react'
import { KanbanColumn } from '@/components/kanban/KanbanColumn'

describe('KanbanColumn', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'backlog' as const,
      assignedAgent: 'openai',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'backlog' as const,
      assignedAgent: 'claude',
      createdAt: new Date().toISOString(),
    },
  ]

  it('renders column with correct title', () => {
    render(
      <KanbanColumn
        title="Backlog"
        status="backlog"
        tasks={mockTasks}
        onTaskMove={() => {}}
        onTaskDelete={() => {}}
      />
    )
    
    expect(screen.getByText('Backlog')).toBeInTheDocument()
  })

  it('displays task count', () => {
    render(
      <KanbanColumn
        title="Backlog"
        status="backlog"
        tasks={mockTasks}
        onTaskMove={() => {}}
        onTaskDelete={() => {}}
      />
    )
    
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders all tasks', () => {
    render(
      <KanbanColumn
        title="Backlog"
        status="backlog"
        tasks={mockTasks}
        onTaskMove={() => {}}
        onTaskDelete={() => {}}
      />
    )
    
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('shows agent icons', () => {
    render(
      <KanbanColumn
        title="Backlog"
        status="backlog"
        tasks={mockTasks}
        onTaskMove={() => {}}
        onTaskDelete={() => {}}
      />
    )
    
    const openaiIcon = screen.getByTestId('agent-icon-openai')
    const claudeIcon = screen.getByTestId('agent-icon-claude')
    
    expect(openaiIcon).toBeInTheDocument()
    expect(claudeIcon).toBeInTheDocument()
  })

  it('calls onTaskDelete when delete button is clicked', () => {
    const onTaskDelete = jest.fn()
    render(
      <KanbanColumn
        title="Backlog"
        status="backlog"
        tasks={mockTasks}
        onTaskMove={() => {}}
        onTaskDelete={onTaskDelete}
      />
    )
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    fireEvent.click(deleteButtons[0])
    
    expect(onTaskDelete).toHaveBeenCalledWith('1')
  })

  it('handles drag and drop', () => {
    const onTaskMove = jest.fn()
    render(
      <KanbanColumn
        title="Backlog"
        status="backlog"
        tasks={mockTasks}
        onTaskMove={onTaskMove}
        onTaskDelete={() => {}}
      />
    )
    
    const task = screen.getByText('Task 1')
    fireEvent.dragStart(task)
    fireEvent.drop(task)
    
    expect(onTaskMove).toHaveBeenCalled()
  })

  it('shows empty state when no tasks', () => {
    render(
      <KanbanColumn
        title="Backlog"
        status="backlog"
        tasks={[]}
        onTaskMove={() => {}}
        onTaskDelete={() => {}}
      />
    )
    
    expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
  })
})
