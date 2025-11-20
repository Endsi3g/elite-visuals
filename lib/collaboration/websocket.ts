import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface CollaborationUser {
  id: string
  name: string
  avatar?: string
  color: string
  cursor?: { x: number; y: number }
  isActive: boolean
}

export interface BoardUpdate {
  type: 'item_added' | 'item_updated' | 'item_deleted' | 'cursor_moved' | 'user_joined' | 'user_left'
  userId: string
  timestamp: number
  data: any
}

export class CollaborationService {
  private boardId: string
  private userId: string
  private channel: any
  private onUpdateCallback?: (update: BoardUpdate) => void
  private onUsersChangeCallback?: (users: CollaborationUser[]) => void

  constructor(boardId: string, userId: string) {
    this.boardId = boardId
    this.userId = userId
  }

  async connect() {
    this.channel = supabase.channel(`board:${this.boardId}`)

    // Subscribe to board updates
    this.channel
      .on('broadcast', { event: 'board_update' }, (payload: any) => {
        if (this.onUpdateCallback && payload.userId !== this.userId) {
          this.onUpdateCallback(payload)
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel.presenceState()
        const users = Object.values(state).flat() as CollaborationUser[]
        if (this.onUsersChangeCallback) {
          this.onUsersChangeCallback(users)
        }
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await this.channel.track({
            id: this.userId,
            name: `User ${this.userId.slice(0, 4)}`,
            color: this.generateUserColor(),
            isActive: true,
          })
        }
      })
  }

  async disconnect() {
    if (this.channel) {
      await this.channel.unsubscribe()
    }
  }

  broadcastUpdate(update: Omit<BoardUpdate, 'userId' | 'timestamp'>) {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'board_update',
        payload: {
          ...update,
          userId: this.userId,
          timestamp: Date.now(),
        },
      })
    }
  }

  updateCursor(x: number, y: number) {
    if (this.channel) {
      this.channel.track({
        id: this.userId,
        cursor: { x, y },
      })
    }
  }

  onUpdate(callback: (update: BoardUpdate) => void) {
    this.onUpdateCallback = callback
  }

  onUsersChange(callback: (users: CollaborationUser[]) => void) {
    this.onUsersChangeCallback = callback
  }

  private generateUserColor(): string {
    const colors = ['#FF684A', '#4A90FF', '#4AFF90', '#FF4A90', '#FFD84A', '#904AFF']
    return colors[Math.floor(Math.random() * colors.length)]
  }
}

export default CollaborationService
