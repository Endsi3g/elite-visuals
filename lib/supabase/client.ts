// @ts-nocheck
// Database types need to be regenerated from Supabase schema
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if Supabase is properly configured
const isSupabaseConfigured = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('votre-projet') &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('votre-cle')

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase Configuration Warning')
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.warn('Supabase is not configured properly.')
  console.warn('Please update your .env.local file with valid Supabase credentials.')
  console.warn('Get your credentials from: https://app.supabase.com/project/_/settings/api')
  console.warn('See SUPABASE_SETUP_GUIDE.md for detailed instructions.')
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

// Export configuration status
export { isSupabaseConfigured }

// Client Supabase typé
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// =============================================
// AUTHENTICATION
// =============================================

export const auth = {
  /**
   * Inscription avec email et mot de passe
   */
  signUp: async (email: string, password: string, metadata?: { full_name?: string }) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase n\'est pas configuré. Veuillez configurer NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans votre fichier .env.local'
      )
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    
    if (error) {
      // Provide more helpful error messages
      if (error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter à Supabase. Vérifiez votre configuration dans .env.local')
      }
      throw error
    }
    return data
  },

  /**
   * Connexion avec email et mot de passe
   */
  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase n\'est pas configuré. Veuillez configurer NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans votre fichier .env.local'
      )
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter à Supabase. Vérifiez votre configuration dans .env.local')
      }
      throw error
    }
    return data
  },

  /**
   * Connexion avec OAuth (Google, GitHub, etc.)
   */
  signInWithOAuth: async (provider: 'google' | 'github' | 'gitlab' | 'bitbucket') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  },

  /**
   * Déconnexion
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /**
   * Récupérer l'utilisateur actuel
   */
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  /**
   * Récupérer la session actuelle
   */
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  /**
   * Réinitialiser le mot de passe
   */
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw error
    return data
  },

  /**
   * Mettre à jour le mot de passe
   */
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return data
  },

  /**
   * Écouter les changements d'authentification
   */
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// =============================================
// PROFILES
// =============================================

export const profiles = {
  /**
   * Récupérer un profil par ID
   */
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Récupérer le profil de l'utilisateur actuel
   */
  getCurrent: async () => {
    const user = await auth.getUser()
    if (!user) throw new Error('No authenticated user')
    return profiles.getById(user.id)
  },

  /**
   * Mettre à jour un profil
   */
  update: async (id: string, updates: { full_name?: string; avatar_url?: string }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Rechercher des profils par email
   */
  searchByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', `%${email}%`)
      .limit(10)
    
    if (error) throw error
    return data
  },
}

// =============================================
// BOARDS
// =============================================

export const boards = {
  /**
   * Créer un nouveau board
   */
  create: async (title: string, description?: string) => {
    const user = await auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data, error} = await supabase
      .from('boards')
      // @ts-expect-error - Database types need regeneration from Supabase
      .insert([{ title, description, owner_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer un board par ID
   */
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('boards')
      .select(`
        *,
        owner:profiles!boards_owner_id_fkey(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer tous les boards de l'utilisateur
   */
  getMyBoards: async () => {
    const user = await auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Récupérer les boards publics
   */
  getPublicBoards: async (limit = 20) => {
    const { data, error } = await supabase
      .from('boards')
      .select(`
        *,
        owner:profiles!boards_owner_id_fkey(*)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  /**
   * Mettre à jour un board
   */
  update: async (id: string, updates: { title?: string; description?: string; is_public?: boolean; thumbnail_url?: string }) => {
    const { data, error } = await supabase
      .from('boards')
      // @ts-expect-error - Database types need regeneration from Supabase
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprimer un board
   */
  delete: async (id: string) => {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  /**
   * Ajouter un collaborateur
   */
  addCollaborator: async (boardId: string, userId: string, role: 'editor' | 'viewer' = 'viewer') => {
    // @ts-expect-error - Database types need regeneration from Supabase
    const { data, error } = await supabase
      .from('board_collaborators')
      .insert([{ board_id: boardId, user_id: userId, role }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer les collaborateurs d'un board
   */
  getCollaborators: async (boardId: string) => {
    const { data, error } = await supabase
      .from('board_collaborators')
      .select(`
        *,
        user:profiles!board_collaborators_user_id_fkey(*)
      `)
      .eq('board_id', boardId)

    if (error) throw error
    return data
  },

  /**
   * Supprimer un collaborateur
   */
  removeCollaborator: async (boardId: string, userId: string) => {
    const { error } = await supabase
      .from('board_collaborators')
      .delete()
      .eq('board_id', boardId)
      .eq('user_id', userId)

    if (error) throw error
  },
}

// =============================================
// BOARD ITEMS
// =============================================

export const boardItems = {
  /**
   * Créer un nouvel item
   */
  create: async (item: {
    board_id: string
    type: 'text' | 'image' | 'video' | 'audio' | 'pdf' | 'url' | 'ai-generated'
    x?: number
    y?: number
    width?: number
    height?: number
    content: any
    title?: string
    metadata?: any
  }) => {
    const { data, error } = await supabase
      .from('board_items')
      // @ts-expect-error - Database types need regeneration from Supabase
      .insert([item])
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer tous les items d'un board
   */
  getByBoardId: async (boardId: string) => {
    const { data, error } = await supabase
      .from('board_items')
      .select('*')
      .eq('board_id', boardId)
      .order('z_index', { ascending: true })

    if (error) throw error
    return data
  },

  /**
   * Mettre à jour un item
   */
  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('board_items')
      // @ts-expect-error - Database types need regeneration from Supabase
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprimer un item
   */
  delete: async (id: string) => {
    const { error } = await supabase
      .from('board_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  /**
   * Mettre à jour la position de plusieurs items
   */
  updatePositions: async (items: Array<{ id: string; x: number; y: number; z_index?: number }>) => {
    const updates = items.map(item => 
      // @ts-expect-error - Database types need regeneration from Supabase
      supabase
        .from('board_items')
        .update({ x: item.x, y: item.y, z_index: item.z_index })
        .eq('id', item.id)
    )

    const results = await Promise.all(updates)
    const errors = results.filter((r: any) => r.error)
    
    if (errors.length > 0) throw errors[0].error
    return results.map((r: any) => r.data)
  },
}

// =============================================
// TASKS
// =============================================

export const tasks = {
  /**
   * Créer une nouvelle tâche
   */
  create: async (task: {
    board_id: string
    title: string
    description?: string
    status?: 'backlog' | 'in-progress' | 'review' | 'done'
    assigned_to?: 'openai' | 'claude' | 'luma' | 'human'
    assigned_user_id?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    due_date?: string
  }) => {
    // @ts-expect-error - Database types need regeneration from Supabase
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer les tâches d'un board
   */
  getByBoardId: async (boardId: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assigned_user_id_fkey(*)
      `)
      .eq('board_id', boardId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Mettre à jour une tâche
   */
  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprimer une tâche
   */
  delete: async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  /**
   * Marquer une tâche comme complétée
   */
  complete: async (id: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        status: 'done',
        completed_at: new Date().toISOString()
      } as any)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

// =============================================
// COMMENTS
// =============================================

export const comments = {
  /**
   * Créer un commentaire
   */
  create: async (comment: {
    board_id: string
    item_id?: string
    content: string
    x?: number
    y?: number
  }) => {
    const user = await auth.getUser()
    if (!user) throw new Error('No authenticated user')

    // @ts-expect-error - Database types need regeneration from Supabase
    const { data, error } = await supabase
      .from('comments')
      .insert([{ ...comment, user_id: user.id }])
      .select(`
        *,
        user:profiles!comments_user_id_fkey(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer les commentaires d'un board
   */
  getByBoardId: async (boardId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles!comments_user_id_fkey(*)
      `)
      .eq('board_id', boardId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  /**
   * Récupérer les commentaires d'un item
   */
  getByItemId: async (itemId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles!comments_user_id_fkey(*)
      `)
      .eq('item_id', itemId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  /**
   * Mettre à jour un commentaire
   */
  update: async (id: string, content: string) => {
    // @ts-expect-error - Database types need regeneration from Supabase
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprimer un commentaire
   */
  delete: async (id: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// =============================================
// AI GENERATIONS
// =============================================

export const aiGenerations = {
  /**
   * Créer une génération IA
   */
  create: async (generation: {
    board_id: string
    ai_provider: 'openai' | 'claude' | 'luma' | 'ollama'
    prompt: string
  }) => {
    const user = await auth.getUser()
    if (!user) throw new Error('No authenticated user')

    // @ts-expect-error - Database types need regeneration from Supabase
    const { data, error } = await supabase
      .from('ai_generations')
      .insert([{ ...generation, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Mettre à jour une génération IA
   */
  update: async (id: string, updates: {
    result?: any
    status?: 'pending' | 'processing' | 'completed' | 'failed'
    error_message?: string
    completed_at?: string
  }) => {
    // @ts-expect-error - Database types need regeneration from Supabase
    const { data, error } = await supabase
      .from('ai_generations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer l'historique des générations d'un board
   */
  getByBoardId: async (boardId: string) => {
    const { data, error } = await supabase
      .from('ai_generations')
      .select('*')
      .eq('board_id', boardId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
}

// =============================================
// STORAGE
// =============================================

export const storage = {
  /**
   * Upload un fichier
   */
  uploadFile: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(path)

    return {
      path: data.path,
      publicUrl: urlData.publicUrl,
    }
  },

  /**
   * Supprimer un fichier
   */
  deleteFile: async (path: string) => {
    const { error } = await supabase.storage
      .from('media')
      .remove([path])

    if (error) throw error
  },

  /**
   * Récupérer l'URL publique d'un fichier
   */
  getPublicUrl: (path: string) => {
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(path)

    return data.publicUrl
  },

  /**
   * Lister les fichiers d'un dossier
   */
  listFiles: async (folder: string) => {
    const { data, error } = await supabase.storage
      .from('media')
      .list(folder)

    if (error) throw error
    return data
  },
}

// =============================================
// REALTIME
// =============================================

export const realtime = {
  /**
   * S'abonner aux changements d'un board
   */
  subscribeToBoardItems: (boardId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`board:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'board_items',
          filter: `board_id=eq.${boardId}`,
        },
        callback
      )
      .subscribe()
  },

  /**
   * S'abonner aux changements des tâches
   */
  subscribeToTasks: (boardId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`tasks:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `board_id=eq.${boardId}`,
        },
        callback
      )
      .subscribe()
  },

  /**
   * S'abonner aux commentaires
   */
  subscribeToComments: (boardId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`comments:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `board_id=eq.${boardId}`,
        },
        callback
      )
      .subscribe()
  },

  /**
   * Se désabonner d'un channel
   */
  unsubscribe: (channel: any) => {
    return supabase.removeChannel(channel)
  },
}

// Export par défaut
export default {
  supabase,
  auth,
  profiles,
  boards,
  boardItems,
  tasks,
  comments,
  aiGenerations,
  storage,
  realtime,
}
