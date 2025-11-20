// Types générés pour la base de données Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      boards: {
        Row: {
          id: string
          title: string
          owner_id: string
          created_at: string
          updated_at: string
          is_public: boolean
          thumbnail_url: string | null
          description: string | null
        }
        Insert: {
          id?: string
          title: string
          owner_id: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
          thumbnail_url?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          title?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
          thumbnail_url?: string | null
          description?: string | null
        }
      }
      board_items: {
        Row: {
          id: string
          board_id: string
          type: 'text' | 'image' | 'video' | 'audio' | 'pdf' | 'url' | 'ai-generated'
          x: number
          y: number
          width: number
          height: number
          content: Json
          title: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
          z_index: number
        }
        Insert: {
          id?: string
          board_id: string
          type: 'text' | 'image' | 'video' | 'audio' | 'pdf' | 'url' | 'ai-generated'
          x?: number
          y?: number
          width?: number
          height?: number
          content?: Json
          title?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          z_index?: number
        }
        Update: {
          id?: string
          board_id?: string
          type?: 'text' | 'image' | 'video' | 'audio' | 'pdf' | 'url' | 'ai-generated'
          x?: number
          y?: number
          width?: number
          height?: number
          content?: Json
          title?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          z_index?: number
        }
      }
      tasks: {
        Row: {
          id: string
          board_id: string
          title: string
          description: string | null
          status: 'backlog' | 'in-progress' | 'review' | 'done'
          assigned_to: 'openai' | 'claude' | 'luma' | 'human' | null
          assigned_user_id: string | null
          ai_generated: boolean
          created_at: string
          updated_at: string
          completed_at: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          due_date: string | null
        }
        Insert: {
          id?: string
          board_id: string
          title: string
          description?: string | null
          status?: 'backlog' | 'in-progress' | 'review' | 'done'
          assigned_to?: 'openai' | 'claude' | 'luma' | 'human' | null
          assigned_user_id?: string | null
          ai_generated?: boolean
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
        }
        Update: {
          id?: string
          board_id?: string
          title?: string
          description?: string | null
          status?: 'backlog' | 'in-progress' | 'review' | 'done'
          assigned_to?: 'openai' | 'claude' | 'luma' | 'human' | null
          assigned_user_id?: string | null
          ai_generated?: boolean
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          board_id: string
          item_id: string | null
          user_id: string
          content: string
          x: number | null
          y: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          board_id: string
          item_id?: string | null
          user_id: string
          content: string
          x?: number | null
          y?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          board_id?: string
          item_id?: string | null
          user_id?: string
          content?: string
          x?: number | null
          y?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      board_collaborators: {
        Row: {
          id: string
          board_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          board_id: string
          user_id: string
          role?: 'owner' | 'editor' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          board_id?: string
          user_id?: string
          role?: 'owner' | 'editor' | 'viewer'
          created_at?: string
        }
      }
      ai_generations: {
        Row: {
          id: string
          board_id: string
          user_id: string
          ai_provider: 'openai' | 'claude' | 'luma' | 'ollama'
          prompt: string
          result: Json | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          error_message: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          board_id: string
          user_id: string
          ai_provider: 'openai' | 'claude' | 'luma' | 'ollama'
          prompt: string
          result?: Json | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          board_id?: string
          user_id?: string
          ai_provider?: 'openai' | 'claude' | 'luma' | 'ollama'
          prompt?: string
          result?: Json | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Types d'application simplifiés
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Board = Database['public']['Tables']['boards']['Row']
export type BoardItem = Database['public']['Tables']['board_items']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type BoardCollaborator = Database['public']['Tables']['board_collaborators']['Row']
export type AIGeneration = Database['public']['Tables']['ai_generations']['Row']

// Types pour les inserts
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type BoardInsert = Database['public']['Tables']['boards']['Insert']
export type BoardItemInsert = Database['public']['Tables']['board_items']['Insert']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type BoardCollaboratorInsert = Database['public']['Tables']['board_collaborators']['Insert']
export type AIGenerationInsert = Database['public']['Tables']['ai_generations']['Insert']

// Types pour les updates
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type BoardUpdate = Database['public']['Tables']['boards']['Update']
export type BoardItemUpdate = Database['public']['Tables']['board_items']['Update']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']
export type BoardCollaboratorUpdate = Database['public']['Tables']['board_collaborators']['Update']
export type AIGenerationUpdate = Database['public']['Tables']['ai_generations']['Update']

// Types étendus avec relations
export type BoardWithOwner = Board & {
  owner: Profile
}

export type BoardItemWithBoard = BoardItem & {
  board: Board
}

export type TaskWithAssignee = Task & {
  assignee?: Profile
}

export type CommentWithUser = Comment & {
  user: Profile
}

export type BoardWithCollaborators = Board & {
  owner: Profile
  collaborators: (BoardCollaborator & { user: Profile })[]
}
