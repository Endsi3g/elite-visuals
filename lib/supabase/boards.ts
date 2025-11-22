import { supabase } from './client'

export interface Board {
  id: string
  name: string
  description?: string
  ownerId: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  thumbnail?: string
  settings?: BoardSettings
  collaborators?: string[]
}

export interface BoardSettings {
  backgroundColor?: string
  gridSize?: number
  snapToGrid?: boolean
  showGrid?: boolean
  zoom?: number
  pan?: { x: number; y: number }
}

export interface BoardElement {
  id: string
  boardId: string
  type: 'card' | 'note' | 'image' | 'video' | 'link' | 'shape' | 'text'
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation?: number
  zIndex?: number
  content: any
  style?: any
  createdBy: string
  createdAt: string
  updatedAt: string
  locked?: boolean
  lockedBy?: string
}

class BoardService {
  /**
   * Créer un nouveau board
   */
  async createBoard(
    name: string,
    ownerId: string,
    options: Partial<Board> = {}
  ): Promise<Board> {
    try {
      const board: Partial<Board> = {
        name,
        ownerId,
        description: options.description || '',
        isPublic: options.isPublic || false,
        settings: options.settings || {
          backgroundColor: '#ffffff',
          gridSize: 20,
          snapToGrid: false,
          showGrid: true,
          zoom: 1,
          pan: { x: 0, y: 0 },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('boards')
        .insert([board])
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Erreur création board:', error)
      throw new Error('Échec de la création du board')
    }
  }

  /**
   * Obtenir un board par ID
   */
  async getBoard(boardId: string): Promise<Board | null> {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Erreur récupération board:', error)
      return null
    }
  }

  /**
   * Obtenir tous les boards d'un utilisateur
   */
  async getUserBoards(userId: string): Promise<Board[]> {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .or(`ownerId.eq.${userId},collaborators.cs.{${userId}}`)
        .order('updatedAt', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erreur récupération boards:', error)
      return []
    }
  }

  /**
   * Mettre à jour un board
   */
  async updateBoard(
    boardId: string,
    updates: Partial<Board>
  ): Promise<Board> {
    try {
      const { data, error } = await supabase
        .from('boards')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', boardId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Erreur mise à jour board:', error)
      throw new Error('Échec de la mise à jour du board')
    }
  }

  /**
   * Supprimer un board
   */
  async deleteBoard(boardId: string): Promise<void> {
    try {
      // Supprimer d'abord tous les éléments du board
      await this.deleteAllElements(boardId)

      // Puis supprimer le board
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Erreur suppression board:', error)
      throw new Error('Échec de la suppression du board')
    }
  }

  /**
   * Ajouter un collaborateur
   */
  async addCollaborator(boardId: string, userId: string): Promise<void> {
    try {
      const board = await this.getBoard(boardId)
      if (!board) {
        throw new Error('Board non trouvé')
      }

      const collaborators = board.collaborators || []
      if (!collaborators.includes(userId)) {
        collaborators.push(userId)
        await this.updateBoard(boardId, { collaborators })
      }
    } catch (error) {
      console.error('Erreur ajout collaborateur:', error)
      throw new Error('Échec de l\'ajout du collaborateur')
    }
  }

  /**
   * Retirer un collaborateur
   */
  async removeCollaborator(boardId: string, userId: string): Promise<void> {
    try {
      const board = await this.getBoard(boardId)
      if (!board) {
        throw new Error('Board non trouvé')
      }

      const collaborators = (board.collaborators || []).filter((id) => id !== userId)
      await this.updateBoard(boardId, { collaborators })
    } catch (error) {
      console.error('Erreur retrait collaborateur:', error)
      throw new Error('Échec du retrait du collaborateur')
    }
  }

  /**
   * Ajouter un élément au board
   */
  async addElement(element: Omit<BoardElement, 'id' | 'createdAt' | 'updatedAt'>): Promise<BoardElement> {
    try {
      const newElement = {
        ...element,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('board_elements')
        .insert([newElement])
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Erreur ajout élément:', error)
      throw new Error('Échec de l\'ajout de l\'élément')
    }
  }

  /**
   * Obtenir tous les éléments d'un board
   */
  async getBoardElements(boardId: string): Promise<BoardElement[]> {
    try {
      const { data, error } = await supabase
        .from('board_elements')
        .select('*')
        .eq('boardId', boardId)
        .order('zIndex', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erreur récupération éléments:', error)
      return []
    }
  }

  /**
   * Mettre à jour un élément
   */
  async updateElement(
    elementId: string,
    updates: Partial<BoardElement>
  ): Promise<BoardElement> {
    try {
      const { data, error } = await supabase
        .from('board_elements')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', elementId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Erreur mise à jour élément:', error)
      throw new Error('Échec de la mise à jour de l\'élément')
    }
  }

  /**
   * Supprimer un élément
   */
  async deleteElement(elementId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('board_elements')
        .delete()
        .eq('id', elementId)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Erreur suppression élément:', error)
      throw new Error('Échec de la suppression de l\'élément')
    }
  }

  /**
   * Supprimer tous les éléments d'un board
   */
  async deleteAllElements(boardId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('board_elements')
        .delete()
        .eq('boardId', boardId)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Erreur suppression éléments:', error)
      throw new Error('Échec de la suppression des éléments')
    }
  }

  /**
   * Dupliquer un board
   */
  async duplicateBoard(boardId: string, userId: string, newName?: string): Promise<Board> {
    try {
      // Récupérer le board original
      const originalBoard = await this.getBoard(boardId)
      if (!originalBoard) {
        throw new Error('Board non trouvé')
      }

      // Créer le nouveau board
      const newBoard = await this.createBoard(
        newName || `${originalBoard.name} (copie)`,
        userId,
        {
          description: originalBoard.description,
          isPublic: false,
          settings: originalBoard.settings,
        }
      )

      // Récupérer et dupliquer tous les éléments
      const elements = await this.getBoardElements(boardId)
      for (const element of elements) {
        await this.addElement({
          boardId: newBoard.id,
          type: element.type,
          position: element.position,
          size: element.size,
          rotation: element.rotation,
          zIndex: element.zIndex,
          content: element.content,
          style: element.style,
          createdBy: userId,
        })
      }

      return newBoard
    } catch (error) {
      console.error('Erreur duplication board:', error)
      throw new Error('Échec de la duplication du board')
    }
  }

  /**
   * Rechercher des boards
   */
  async searchBoards(query: string, userId: string): Promise<Board[]> {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .or(`ownerId.eq.${userId},collaborators.cs.{${userId}}`)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('updatedAt', { ascending: false })
        .limit(20)

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erreur recherche boards:', error)
      return []
    }
  }
}

// Instance singleton
export const boardService = new BoardService()
