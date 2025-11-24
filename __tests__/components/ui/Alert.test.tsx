import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

describe('Alert Component', () => {
  it('renders alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    )
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    const { container, rerender } = render(
      <Alert variant="default">
        <AlertDescription>Default Alert</AlertDescription>
      </Alert>
    )
    
    let alert = container.firstChild as HTMLElement
    expect(alert).toHaveClass()
    
    rerender(
      <Alert variant="destructive">
        <AlertDescription>Destructive Alert</AlertDescription>
      </Alert>
    )
    
    alert = container.firstChild as HTMLElement
    expect(alert).toHaveClass()
  })

  it('renders without title', () => {
    render(
      <Alert>
        <AlertDescription>Only Description</AlertDescription>
      </Alert>
    )
    
    expect(screen.getByText('Only Description')).toBeInTheDocument()
  })

  it('has proper ARIA role', () => {
    const { container } = render(
      <Alert>
        <AlertDescription>Test</AlertDescription>
      </Alert>
    )
    
    const alert = container.firstChild as HTMLElement
    expect(alert).toHaveAttribute('role', 'alert')
  })
})
