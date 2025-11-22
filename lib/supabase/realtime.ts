import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from './client'

export interface BoardUser {
  id: string
  name: string
  email: string
  avatar?: string
  color: string
  cursor?: { x: number; y: number }
  lastSeen: number
}

export interface BoardElement {
  id: string
  type: 'card' | 'note' | 'image' | 'video' | 'link'
  position: { x: number; y: number }
  size: { width: number; height: number }
  content: any
  createdBy: string
  createdAt: number
  updatedAt: number
  locked?: boolean
  lockedBy?: string
}

export interface RealtimeMessage {
  type: 'cursor' | 'element_add' | 'element_update' | 'element_delete' | 'user_join' | 'user_leave'
  userId: string
  data: any
  timestamp: number
}

class RealtimeService {
  private channel: RealtimeChannel | null = null
  private boardId: string | null = null
  private userId: string | null = null
  private listeners: Map<string, Set<Function>> = new Map()

  /**
   * Se connecter à un board en temps réel
   */
  async joinBoard(boardId: string, userId: string, userName: string) {
    if (this.channel) {
      await this.leaveBoard()
    }

    this.boardId = boardId
    this.userId = userId

    // Créer le channel Supabase
    this.channel = supabase.channel(`board:${boardId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: userId },
      },
    })

    // Écouter les présences (utilisateurs connectés)
    this.channel
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel?.presenceState()
        this.emit('users_update', state)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        this.emit('user_join', { userId: key, data: newPresences })
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        this.emit('user_leave', { userId: key, data: leftPresences })
      })

    // Écouter les broadcasts (messages en temps réel)
    this.channel.on('broadcast', { event: 'cursor' }, ({ payload }) => {
      this.emit('cursor_move', payload)
    })

    this.channel.on('broadcast', { event: 'element' }, ({ payload }) => {
      this.emit('element_change', payload)
    })

    this.channel.on('broadcast', { event: 'lock' }, ({ payload }) => {
      this.emit('element_lock', payload)
    })

    // S'abonner et envoyer la présence
    await this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await this.channel?.track({
          userId,
          userName,
          onlineAt: new Date().toISOString(),
        })
        this.emit('connected', { boardId, userId })
      }
    })

    return this.channel
  }

  /**
   * Quitter le board
   */
  async leaveBoard() {
    if (this.channel) {
      await this.channel.unsubscribe()
      this.channel = null
    }
    this.boardId = null
    this.userId = null
    this.listeners.clear()
  }

  /**
   * Envoyer la position du curseur
   */
  sendCursor(x: number, y: number) {
    if (!this.channel || !this.userId) return

    this.channel.send({
      type: 'broadcast',
      event: 'cursor',
      payload: {
        userId: this.userId,
        x,
        y,
        timestamp: Date.now(),
      },
    })
  }

  /**
   * Ajouter un élément au board
   */
  addElement(element: BoardElement) {
    if (!this.channel) return

    this.channel.send({
      type: 'broadcast',
      event: 'element',
      payload: {
        action: 'add',
        element,
        userId: this.userId,
        timestamp: Date.now(),
      },
    })
  }

  /**
   * Mettre à jour un élément
   */
  updateElement(elementId: string, updates: Partial<BoardElement>) {
    if (!this.channel) return

    this.channel.send({
      type: 'broadcast',
      event: 'element',
      payload: {
        action: 'update',
        elementId,
        updates,
        userId: this.userId,
        timestamp: Date.now(),
      },
    })
  }

  /**
   * Supprimer un élément
   */
  deleteElement(elementId: string) {
    if (!this.channel) return

    this.channel.send({
      type: 'broadcast',
      event: 'element',
      payload: {
        action: 'delete',
        elementId,
        userId: this.userId,
        timestamp: Date.now(),
      },
    })
  }

  /**
   * Verrouiller un élément
   */
  lockElement(elementId: string) {
    if (!this.channel) return

    this.channel.send({
      type: 'broadcast',
      event: 'lock',
      payload: {
        action: 'lock',
        elementId,
        userId: this.userId,
        timestamp: Date.now(),
      },
    })
  }

  /**
   * Déverrouiller un élément
   */
  unlockElement(elementId: string) {
    if (!this.channel) return

    this.channel.send({
      type: 'broadcast',
      event: 'lock',
      payload: {
        action: 'unlock',
        elementId,
        userId: this.userId,
        timestamp: Date.now(),
      },
    })
  }

  /**
   * Écouter un événement
   */
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  /**
   * Arrêter d'écouter un événement
   */
  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  /**
   * Émettre un événement
   */
  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }

  /**
   * Obtenir les utilisateurs connectés
   */
  getConnectedUsers(): BoardUser[] {
    if (!this.channel) return []

    const state = this.channel.presenceState()
    const users: BoardUser[] = []

    Object.entries(state).forEach(([userId, presences]: [string, any[]]) => {
      const presence = presences[0]
      users.push({
        id: userId,
        name: presence.userName || 'Anonymous',
        email: presence.email || '',
        color: this.getUserColor(userId),
        lastSeen: Date.now(),
      })
    })

    return users
  }

  /**
   * Générer une couleur unique pour un utilisateur
   */
  private getUserColor(userId: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
      '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
    ]
    
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }
}

// Instance singleton
export const realtimeService = new RealtimeService()
