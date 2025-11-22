import { useEffect, useState, useCallback } from 'react'
import { realtimeService, BoardUser, BoardElement } from '@/lib/supabase/realtime'

interface UseRealtimeOptions {
  boardId: string
  userId: string
  userName: string
  onCursorMove?: (data: { userId: string; x: number; y: number }) => void
  onElementChange?: (data: any) => void
  onElementLock?: (data: any) => void
  onUserJoin?: (data: any) => void
  onUserLeave?: (data: any) => void
}

export function useRealtime({
  boardId,
  userId,
  userName,
  onCursorMove,
  onElementChange,
  onElementLock,
  onUserJoin,
  onUserLeave,
}: UseRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState<BoardUser[]>([])
  const [cursors, setCursors] = useState<Map<string, { x: number; y: number }>>(new Map())

  // Connexion au board
  useEffect(() => {
    let mounted = true

    const connect = async () => {
      try {
        await realtimeService.joinBoard(boardId, userId, userName)
        
        if (mounted) {
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Erreur de connexion realtime:', error)
      }
    }

    connect()

    return () => {
      mounted = false
      realtimeService.leaveBoard()
      setIsConnected(false)
    }
  }, [boardId, userId, userName])

  // Écouter les événements
  useEffect(() => {
    if (!isConnected) return

    // Curseurs
    const handleCursorMove = (data: { userId: string; x: number; y: number }) => {
      if (data.userId !== userId) {
        setCursors((prev) => new Map(prev).set(data.userId, { x: data.x, y: data.y }))
        onCursorMove?.(data)
      }
    }

    // Utilisateurs
    const handleUsersUpdate = () => {
      const users = realtimeService.getConnectedUsers()
      setConnectedUsers(users)
    }

    const handleUserJoin = (data: any) => {
      handleUsersUpdate()
      onUserJoin?.(data)
    }

    const handleUserLeave = (data: any) => {
      setCursors((prev) => {
        const newCursors = new Map(prev)
        newCursors.delete(data.userId)
        return newCursors
      })
      handleUsersUpdate()
      onUserLeave?.(data)
    }

    // Éléments
    const handleElementChange = (data: any) => {
      onElementChange?.(data)
    }

    const handleElementLock = (data: any) => {
      onElementLock?.(data)
    }

    // Enregistrer les listeners
    realtimeService.on('cursor_move', handleCursorMove)
    realtimeService.on('users_update', handleUsersUpdate)
    realtimeService.on('user_join', handleUserJoin)
    realtimeService.on('user_leave', handleUserLeave)
    realtimeService.on('element_change', handleElementChange)
    realtimeService.on('element_lock', handleElementLock)

    // Charger les utilisateurs initiaux
    handleUsersUpdate()

    return () => {
      realtimeService.off('cursor_move', handleCursorMove)
      realtimeService.off('users_update', handleUsersUpdate)
      realtimeService.off('user_join', handleUserJoin)
      realtimeService.off('user_leave', handleUserLeave)
      realtimeService.off('element_change', handleElementChange)
      realtimeService.off('element_lock', handleElementLock)
    }
  }, [isConnected, userId, onCursorMove, onElementChange, onElementLock, onUserJoin, onUserLeave])

  // Fonctions d'envoi
  const sendCursor = useCallback((x: number, y: number) => {
    realtimeService.sendCursor(x, y)
  }, [])

  const addElement = useCallback((element: BoardElement) => {
    realtimeService.addElement(element)
  }, [])

  const updateElement = useCallback((elementId: string, updates: Partial<BoardElement>) => {
    realtimeService.updateElement(elementId, updates)
  }, [])

  const deleteElement = useCallback((elementId: string) => {
    realtimeService.deleteElement(elementId)
  }, [])

  const lockElement = useCallback((elementId: string) => {
    realtimeService.lockElement(elementId)
  }, [])

  const unlockElement = useCallback((elementId: string) => {
    realtimeService.unlockElement(elementId)
  }, [])

  return {
    isConnected,
    connectedUsers,
    cursors,
    sendCursor,
    addElement,
    updateElement,
    deleteElement,
    lockElement,
    unlockElement,
  }
}
