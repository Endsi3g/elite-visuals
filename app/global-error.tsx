'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Properly log errors instead of empty objects
    console.error('Global Application Error:')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    if (error.digest) {
      console.error('Digest:', error.digest)
    }
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
          <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Une erreur critique est survenue
            </h1>
            
            <p className="text-gray-600 mb-6">
              {error.message || "L'application a rencontré une erreur inattendue."}
            </p>
            
            <button
              onClick={reset}
              className="w-full px-4 py-2 bg-[#E85535] text-white border-none rounded-md cursor-pointer text-base font-medium hover:bg-[#d64a2e] transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
