'use client'

import { useEffect } from 'react'
import { setupGlobalErrorHandlers } from '@/lib/error-logger'

export function ErrorBoundaryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Setup global error handlers on mount
    setupGlobalErrorHandlers()
  }, [])

  return <>{children}</>
}
