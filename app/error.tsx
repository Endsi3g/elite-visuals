'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console with proper formatting
    if (error) {
      console.error('Application Error:', {
        message: error.message || 'Unknown error',
        stack: error.stack,
        digest: error.digest,
        error: error,
      })
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Une erreur est survenue
        </h1>
        
        <p className="text-gray-600 mb-6">
          {error.message || "Quelque chose s'est mal passé. Veuillez réessayer."}
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Réessayer
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </div>
        
        {error.digest && (
          <p className="mt-4 text-xs text-gray-500">
            Code d'erreur: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
