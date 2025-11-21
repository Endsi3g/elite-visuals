/**
 * Enhanced error logging utility
 * Prevents empty error objects from being logged
 */

export function logError(error: unknown, context?: string) {
  const prefix = context ? `[${context}]` : '[Error]'
  
  if (error instanceof Error) {
    console.error(`${prefix} ${error.name}:`, error.message)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
  } else if (typeof error === 'string') {
    console.error(`${prefix}`, error)
  } else if (error && typeof error === 'object') {
    // Handle error objects with message property
    const errorObj = error as Record<string, unknown>
    if (errorObj.message) {
      console.error(`${prefix}`, errorObj.message)
    } else {
      console.error(`${prefix}`, JSON.stringify(error, null, 2))
    }
  } else {
    console.error(`${prefix} Unknown error:`, error)
  }
}

export function setupGlobalErrorHandlers() {
  if (typeof window === 'undefined') return

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault()
    logError(event.reason, 'Unhandled Promise Rejection')
  })

  // Handle global errors
  window.addEventListener('error', (event) => {
    event.preventDefault()
    logError(event.error || event.message, 'Global Error')
  })

  // Override console.error to prevent empty objects
  const originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    const filteredArgs = args.filter(arg => {
      // Filter out empty objects
      if (arg && typeof arg === 'object' && Object.keys(arg).length === 0) {
        return false
      }
      return true
    })
    
    if (filteredArgs.length > 0) {
      originalConsoleError.apply(console, filteredArgs)
    }
  }
}
