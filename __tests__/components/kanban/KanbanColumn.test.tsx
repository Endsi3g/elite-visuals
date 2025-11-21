import { render, screen, fireEvent } from '@testing-library/react'
import KanbanColumn from '@/components/kanban/KanbanColumn'

describe('KanbanColumn', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'todo' as const,
      assignedTo: 'openai' as const,
      createdAt: new Date(),
      aiGenerated: true,
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'todo' as const,
      assignedTo: 'claude' as const,
      createdAt: new Date(),
    },
  ]

  it('renders column with correct title', () => {
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        tasks={mockTasks}
        onUpdateStatus={() => {}}
      />
    )
    
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('renders all tasks', () => {
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        tasks={mockTasks}
        onUpdateStatus={() => {}}
      />
    )
    
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('displays task descriptions', () => {
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        tasks={mockTasks}
        onUpdateStatus={() => {}}
      />
    )
    
    expect(screen.getByText('Description 1')).toBeInTheDocument()
    expect(screen.getByText('Description 2')).toBeInTheDocument()
  })

  it('displays agent names', () => {
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        tasks={mockTasks}
        onUpdateStatus={() => {}}
      />
    )
    
    expect(screen.getByText('OPENAI')).toBeInTheDocument()
    expect(screen.getByText('CLAUDE')).toBeInTheDocument()
  })

  it('calls onUpdateStatus when task is clicked', () => {
    const onUpdateStatus = jest.fn()
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        tasks={mockTasks}
        onUpdateStatus={onUpdateStatus}
      />
    )
    
    const task = screen.getByText('Task 1')
    fireEvent.click(task)
    
    expect(onUpdateStatus).toHaveBeenCalledWith('1', 'in-progress')
  })

  it('shows AI badge for AI-generated tasks', () => {
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        tasks={mockTasks}
        onUpdateStatus={() => {}}
      />
    )
    
    const aiBadges = screen.getAllByText('IA')
    expect(aiBadges).toHaveLength(1)
  })

  it('shows empty state when no tasks', () => {
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        tasks={[]}
        onUpdateStatus={() => {}}
      />
    )
    
    expect(screen.getByText('Aucune tâche')).toBeInTheDocument()
  })
})
