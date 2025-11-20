import { useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, auth, boards, boardItems, tasks, comments } from './client'
import type { Board, BoardItem, Task, Comment, Profile } from './types'

// =============================================
// AUTHENTICATION HOOKS
// =============================================

/**
 * Hook pour gérer l'authentification
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer la session initiale
    auth.getSession().then((session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    session,
    loading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    signInWithOAuth: auth.signInWithOAuth,
  }
}

/**
 * Hook pour récupérer le profil de l'utilisateur actuel
 */
export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  return { profile, loading, error }
}

// =============================================
// BOARDS HOOKS
// =============================================

/**
 * Hook pour récupérer un board par ID
 */
export function useBoard(boardId: string | null) {
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!boardId) {
      setBoard(null)
      setLoading(false)
      return
    }

    const fetchBoard = async () => {
      try {
        const data = await boards.getById(boardId)
        setBoard(data as Board)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchBoard()
  }, [boardId])

  const updateBoard = useCallback(async (updates: Partial<Board>) => {
    if (!boardId) return
    try {
      // Convertir null en undefined pour la compatibilité de types
      const cleanUpdates = {
        ...updates,
        description: updates.description === null ? undefined : updates.description,
        thumbnail_url: updates.thumbnail_url === null ? undefined : updates.thumbnail_url,
      }
      const updated = await boards.update(boardId, cleanUpdates)
      setBoard(updated)
      return updated
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [boardId])

  const deleteBoard = useCallback(async () => {
    if (!boardId) return
    try {
      await boards.delete(boardId)
      setBoard(null)
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [boardId])

  return { board, loading, error, updateBoard, deleteBoard }
}

/**
 * Hook pour récupérer les boards de l'utilisateur
 */
export function useMyBoards() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setBoards(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  return { boards, loading, error, refetch: fetchBoards }
}

// =============================================
// BOARD ITEMS HOOKS
// =============================================

/**
 * Hook pour récupérer les items d'un board avec temps réel
 */
export function useBoardItems(boardId: string | null) {
  const [items, setItems] = useState<BoardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!boardId) {
      setItems([])
      setLoading(false)
      return
    }

    const fetchItems = async () => {
      try {
        const data = await boardItems.getByBoardId(boardId)
        setItems(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()

    // S'abonner aux changements en temps réel
    const channel = supabase
      .channel(`board:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'board_items',
          filter: `board_id=eq.${boardId}`,
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev: BoardItem[]) => [...prev, payload.new as BoardItem])
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev: BoardItem[]) =>
              prev.map((item: BoardItem) =>
                item.id === payload.new.id ? (payload.new as BoardItem) : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setItems((prev: BoardItem[]) => prev.filter((item: BoardItem) => item.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boardId])

  const createItem = useCallback(async (item: Omit<BoardItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Convertir null en undefined pour title
      const cleanItem = {
        ...item,
        title: item.title === null ? undefined : item.title,
      }
      const newItem = await boardItems.create(cleanItem)
      return newItem
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const updateItem = useCallback(async (id: string, updates: Partial<BoardItem>) => {
    try {
      const updated = await boardItems.update(id, updates)
      return updated
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    try {
      await boardItems.delete(id)
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  return { items, loading, error, createItem, updateItem, deleteItem }
}

// =============================================
// TASKS HOOKS
// =============================================

/**
 * Hook pour récupérer les tâches d'un board avec temps réel
 */
export function useTasks(boardId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!boardId) {
      setTasks([])
      setLoading(false)
      return
    }

    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('board_id', boardId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setTasks(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()

    // S'abonner aux changements en temps réel
    const channel = supabase
      .channel(`tasks:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `board_id=eq.${boardId}`,
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev: Task[]) => [payload.new as Task, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev: Task[]) =>
              prev.map((task: Task) =>
                task.id === payload.new.id ? (payload.new as Task) : task
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boardId])

  const createTask = useCallback(async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  return { tasks, loading, error, createTask, updateTask, deleteTask }
}

// =============================================
// COMMENTS HOOKS
// =============================================

/**
 * Hook pour récupérer les commentaires d'un board avec temps réel
 */
export function useComments(boardId: string | null) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!boardId) {
      setComments([])
      setLoading(false)
      return
    }

    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select(`
            *,
            user:profiles!comments_user_id_fkey(*)
          `)
          .eq('board_id', boardId)
          .order('created_at', { ascending: true })

        if (error) throw error
        setComments(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()

    // S'abonner aux changements en temps réel
    const channel = supabase
      .channel(`comments:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `board_id=eq.${boardId}`,
        },
        async (payload: any) => {
          if (payload.eventType === 'INSERT') {
            // Récupérer le commentaire avec les infos utilisateur
            const { data } = await supabase
              .from('comments')
              .select(`
                *,
                user:profiles!comments_user_id_fkey(*)
              `)
              .eq('id', payload.new.id)
              .single()

            if (data) {
              setComments((prev: Comment[]) => [...prev, data as Comment])
            }
          } else if (payload.eventType === 'UPDATE') {
            setComments((prev: Comment[]) =>
              prev.map((comment: Comment) =>
                comment.id === payload.new.id ? (payload.new as Comment) : comment
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setComments((prev: Comment[]) => prev.filter((comment: Comment) => comment.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boardId])

  const createComment = useCallback(async (comment: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { user } = await auth.getSession()
      if (!user) throw new Error('No authenticated user')

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
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const updateComment = useCallback(async (id: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const deleteComment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  return { comments, loading, error, createComment, updateComment, deleteComment }
}

// =============================================
// STORAGE HOOKS
// =============================================

/**
 * Hook pour uploader des fichiers
 */
export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = useCallback(async (file: File, path: string) => {
    try {
      setUploading(true)
      setProgress(0)
      setError(null)

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

      setProgress(100)
      return {
        path: data.path,
        publicUrl: urlData.publicUrl,
      }
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setUploading(false)
    }
  }, [])

  return { uploadFile, uploading, progress, error }
}

// =============================================
// UTILITY HOOKS
// =============================================

/**
 * Hook pour vérifier si l'utilisateur est propriétaire d'un board
 */
export function useIsBoardOwner(boardId: string | null) {
  const { user } = useAuth()
  const { board } = useBoard(boardId)

  return board?.owner_id === user?.id
}

/**
 * Hook pour vérifier si l'utilisateur peut éditer un board
 */
export function useCanEditBoard(boardId: string | null) {
  const { user } = useAuth()
  const { board } = useBoard(boardId)
  const [canEdit, setCanEdit] = useState(false)

  useEffect(() => {
    if (!user || !boardId) {
      setCanEdit(false)
      return
    }

    const checkPermission = async () => {
      // Vérifier si propriétaire
      if (board?.owner_id === user.id) {
        setCanEdit(true)
        return
      }

      // Vérifier si collaborateur avec rôle editor
      const { data } = await supabase
        .from('board_collaborators')
        .select('role')
        .eq('board_id', boardId)
        .eq('user_id', user.id)
        .single()

      setCanEdit(data?.role === 'editor' || data?.role === 'owner')
    }

    checkPermission()
  }, [user, boardId, board])

  return canEdit
}
