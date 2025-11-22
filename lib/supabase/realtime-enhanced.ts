import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { supabase } from './client'

export type TableChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

export interface SubscriptionOptions {
  event?: TableChangeEvent
  schema?: string
  table: string
  filter?: string
}

export class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map()
  private listeners: Map<string, Set<Function>> = new Map()

  /**
   * S'abonner aux changements d'une table
   */
  subscribeToTable(
    options: SubscriptionOptions,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeChannel {
    const { event = '*', schema = 'public', table, filter } = options
    const channelName = `${table}${filter ? `:${filter}` : ''}:${event}`

    // Retourner le channel existant si déjà abonné
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    // Créer un nouveau channel
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
          filter,
        },
        (payload) => {
          callback(payload)
          this.emit(channelName, payload)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to ${channelName}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Error subscribing to ${channelName}`)
        }
      })

    this.channels.set(channelName, channel)
    return channel
  }

  /**
   * S'abonner aux changements d'un board spécifique
   */
  subscribeToBoardChanges(
    boardId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ) {
    return this.subscribeToTable(
      {
        table: 'board_items',
        filter: `board_id=eq.${boardId}`,
      },
      callback
    )
  }

  /**
   * S'abonner aux éléments d'un board
   */
  subscribeToBoardElements(
    boardId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ) {
    return this.subscribeToTable(
      {
        table: 'board_elements',
        filter: `boardId=eq.${boardId}`,
      },
      callback
    )
  }

  /**
   * S'abonner aux commentaires
   */
  subscribeToComments(
    boardId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ) {
    return this.subscribeToTable(
      {
        table: 'comments',
        filter: `board_id=eq.${boardId}`,
      },
      callback
    )
  }

  /**
   * S'abonner aux tâches
   */
  subscribeToTasks(
    boardId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ) {
    return this.subscribeToTable(
      {
        table: 'tasks',
        filter: `board_id=eq.${boardId}`,
      },
      callback
    )
  }

  /**
   * S'abonner aux collaborateurs
   */
  subscribeToCollaborators(
    boardId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ) {
    return this.subscribeToTable(
      {
        table: 'board_collaborators',
        filter: `board_id=eq.${boardId}`,
      },
      callback
    )
  }

  /**
   * S'abonner aux générations IA
   */
  subscribeToAIGenerations(
    boardId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ) {
    return this.subscribeToTable(
      {
        table: 'ai_generations',
        filter: `board_id=eq.${boardId}`,
      },
      callback
    )
  }

  /**
   * Créer un channel de présence
   */
  createPresenceChannel(
    channelName: string,
    userId: string,
    userData: any
  ): RealtimeChannel {
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: userId,
        },
      },
    })

    // Track presence
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      this.emit(`${channelName}:presence:sync`, state)
    })

    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      this.emit(`${channelName}:presence:join`, { key, newPresences })
    })

    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      this.emit(`${channelName}:presence:leave`, { key, leftPresences })
    })

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track(userData)
      }
    })

    this.channels.set(channelName, channel)
    return channel
  }

  /**
   * Créer un channel de broadcast
   */
  createBroadcastChannel(channelName: string): RealtimeChannel {
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: true },
      },
    })

    channel.subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  /**
   * Envoyer un message broadcast
   */
  async broadcast(channelName: string, event: string, payload: any) {
    const channel = this.channels.get(channelName)
    if (!channel) {
      throw new Error(`Channel ${channelName} not found`)
    }

    await channel.send({
      type: 'broadcast',
      event,
      payload,
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
   * Se désabonner d'un channel
   */
  async unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      await supabase.removeChannel(channel)
      this.channels.delete(channelName)
      console.log(`🔌 Unsubscribed from ${channelName}`)
    }
  }

  /**
   * Se désabonner de tous les channels
   */
  async unsubscribeAll() {
    for (const [name, channel] of this.channels) {
      await supabase.removeChannel(channel)
      console.log(`🔌 Unsubscribed from ${name}`)
    }
    this.channels.clear()
    this.listeners.clear()
  }

  /**
   * Obtenir un channel
   */
  getChannel(channelName: string): RealtimeChannel | undefined {
    return this.channels.get(channelName)
  }

  /**
   * Obtenir tous les channels actifs
   */
  getActiveChannels(): string[] {
    return Array.from(this.channels.keys())
  }

  /**
   * Vérifier si un channel est actif
   */
  isChannelActive(channelName: string): boolean {
    return this.channels.has(channelName)
  }
}

// Instance singleton
export const realtimeManager = new RealtimeManager()
