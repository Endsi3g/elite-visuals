import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Provider } from '@supabase/supabase-js'

export const supabase = createClientComponentClient()

export interface SignUpData {
  email: string
  password: string
  fullName?: string
  avatarUrl?: string
}

export interface SignInData {
  email: string
  password: string
}

/**
 * Inscription avec email/password
 */
export async function signUp(data: SignUpData) {
  const { email, password, fullName, avatarUrl } = data

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        avatar_url: avatarUrl,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data: authData, error }
}

/**
 * Connexion avec email/password
 */
export async function signIn(data: SignInData) {
  const { email, password } = data

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data: authData, error }
}

/**
 * Connexion avec OAuth (Google, GitHub, etc.)
 */
export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  return { data, error }
}

/**
 * Connexion avec Magic Link
 */
export async function signInWithMagicLink(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

/**
 * Déconnexion
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Obtenir la session actuelle
 */
export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  return { session, error }
}

/**
 * Obtenir l'utilisateur actuel
 */
export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Mettre à jour l'utilisateur
 */
export async function updateUser(updates: {
  email?: string
  password?: string
  data?: any
}) {
  const { data, error } = await supabase.auth.updateUser(updates)
  return { data, error }
}

/**
 * Réinitialiser le mot de passe
 */
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  return { data, error }
}

/**
 * Mettre à jour le mot de passe
 */
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  return { data, error }
}

/**
 * Vérifier si l'utilisateur est authentifié
 */
export async function isAuthenticated(): Promise<boolean> {
  const { session } = await getSession()
  return !!session
}

/**
 * Écouter les changements d'authentification
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
}

/**
 * Rafraîchir la session
 */
export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession()
  return { data, error }
}
