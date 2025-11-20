// Export everything from the new modular structure
export * from './types'
export * from './client'
export * from './hooks'

// Re-export for backward compatibility
export { supabase } from './client'
