"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      // Test 1: Vérifier les variables d'environnement
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      console.log('Supabase URL:', supabaseUrl)
      console.log('Supabase Key length:', supabaseKey?.length)

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Variables d\'environnement manquantes')
      }

      // Test 2: Tester la connexion avec une requête simple
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      setStatus('success')
      setMessage('Connexion Supabase réussie!')
      setDetails({
        url: supabaseUrl,
        keyLength: supabaseKey.length,
        session: data.session ? 'Active' : 'Aucune session',
        timestamp: new Date().toISOString()
      })

    } catch (error: any) {
      console.error('Erreur de connexion Supabase:', error)
      setStatus('error')
      setMessage(error.message || 'Erreur inconnue')
      setDetails({
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack?.split('\n').slice(0, 3).join('\n')
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Test Connexion Supabase
          </h1>
          <p className="text-gray-600">
            Diagnostic de la configuration Supabase
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
              {status === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
              Statut de la Connexion
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Test en cours...'}
              {status === 'success' && 'Connexion établie avec succès'}
              {status === 'error' && 'Échec de la connexion'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'loading' && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {status === 'success' && (
              <Alert variant="success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Succès</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {details && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-900">Détails:</h3>
                <pre className="text-xs text-gray-700 overflow-auto">
                  {JSON.stringify(details, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variables d'Environnement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                <span className="text-gray-600 font-mono">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Non défini'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span className="text-gray-600 font-mono">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                    ? `✅ Défini (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length} caractères)`
                    : '❌ Non défini'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <button
            onClick={testSupabaseConnection}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retester la Connexion
          </button>
        </div>
      </div>
    </div>
  )
}
