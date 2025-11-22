import { supabase } from './client'

export interface Embedding {
  id: string
  boardId: string
  content: string
  embedding: number[]
  metadata?: any
  createdAt: string
  updatedAt: string
}

export interface SearchResult {
  id: string
  boardId: string
  content: string
  similarity: number
  metadata?: any
}

export class EmbeddingsService {
  private apiKey: string | null = null

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null
  }

  /**
   * Créer un embedding pour du texte avec OpenAI
   */
  async createEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('Clé API OpenAI non configurée')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: text,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur création embedding')
      }

      const data = await response.json()
      return data.data[0].embedding
    } catch (error) {
      console.error('Erreur embedding:', error)
      throw error
    }
  }

  /**
   * Sauvegarder un embedding dans Supabase
   */
  async saveEmbedding(
    boardId: string,
    content: string,
    metadata?: any
  ): Promise<Embedding> {
    try {
      // Créer l'embedding
      const embedding = await this.createEmbedding(content)

      // Sauvegarder dans la base de données
      const { data, error } = await supabase
        .from('ai_embeddings')
        .insert({
          board_id: boardId,
          content,
          embedding,
          metadata,
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        boardId: data.board_id,
        content: data.content,
        embedding: data.embedding,
        metadata: data.metadata,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Erreur sauvegarde embedding:', error)
      throw error
    }
  }

  /**
   * Recherche sémantique
   */
  async semanticSearch(
    query: string,
    options: {
      threshold?: number
      limit?: number
      boardId?: string
    } = {}
  ): Promise<SearchResult[]> {
    const { threshold = 0.7, limit = 10, boardId } = options

    try {
      // Créer l'embedding de la requête
      const queryEmbedding = await this.createEmbedding(query)

      // Appeler la fonction PostgreSQL
      const { data, error } = await supabase.rpc('search_embeddings', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
      })

      if (error) throw error

      // Filtrer par boardId si spécifié
      let results = data || []
      if (boardId) {
        results = results.filter((r: any) => r.board_id === boardId)
      }

      return results.map((r: any) => ({
        id: r.id,
        boardId: r.board_id,
        content: r.content,
        similarity: r.similarity,
        metadata: r.metadata,
      }))
    } catch (error) {
      console.error('Erreur recherche sémantique:', error)
      throw error
    }
  }

  /**
   * Recherche hybride (sémantique + full-text)
   */
  async hybridSearch(
    query: string,
    options: {
      threshold?: number
      limit?: number
      boardId?: string
    } = {}
  ): Promise<SearchResult[]> {
    const { threshold = 0.7, limit = 10, boardId } = options

    try {
      // Recherche sémantique
      const semanticResults = await this.semanticSearch(query, {
        threshold,
        limit: Math.ceil(limit / 2),
        boardId,
      })

      // Recherche full-text
      let fullTextQuery = supabase
        .from('ai_embeddings')
        .select('*')
        .textSearch('content', query, {
          type: 'websearch',
          config: 'english',
        })
        .limit(Math.ceil(limit / 2))

      if (boardId) {
        fullTextQuery = fullTextQuery.eq('board_id', boardId)
      }

      const { data: fullTextResults, error } = await fullTextQuery

      if (error) throw error

      // Combiner et dédupliquer les résultats
      const combinedResults = new Map<string, SearchResult>()

      semanticResults.forEach((r) => {
        combinedResults.set(r.id, r)
      })

      fullTextResults?.forEach((r: any) => {
        if (!combinedResults.has(r.id)) {
          combinedResults.set(r.id, {
            id: r.id,
            boardId: r.board_id,
            content: r.content,
            similarity: 0.5, // Score par défaut pour full-text
            metadata: r.metadata,
          })
        }
      })

      // Trier par similarité
      return Array.from(combinedResults.values())
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
    } catch (error) {
      console.error('Erreur recherche hybride:', error)
      throw error
    }
  }

  /**
   * Mettre à jour un embedding
   */
  async updateEmbedding(
    id: string,
    content: string,
    metadata?: any
  ): Promise<Embedding> {
    try {
      // Créer le nouvel embedding
      const embedding = await this.createEmbedding(content)

      // Mettre à jour dans la base de données
      const { data, error } = await supabase
        .from('ai_embeddings')
        .update({
          content,
          embedding,
          metadata,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        boardId: data.board_id,
        content: data.content,
        embedding: data.embedding,
        metadata: data.metadata,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Erreur mise à jour embedding:', error)
      throw error
    }
  }

  /**
   * Supprimer un embedding
   */
  async deleteEmbedding(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('ai_embeddings').delete().eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erreur suppression embedding:', error)
      throw error
    }
  }

  /**
   * Obtenir tous les embeddings d'un board
   */
  async getBoardEmbeddings(boardId: string): Promise<Embedding[]> {
    try {
      const { data, error } = await supabase
        .from('ai_embeddings')
        .select('*')
        .eq('board_id', boardId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map((r: any) => ({
        id: r.id,
        boardId: r.board_id,
        content: r.content,
        embedding: r.embedding,
        metadata: r.metadata,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }))
    } catch (error) {
      console.error('Erreur récupération embeddings:', error)
      throw error
    }
  }

  /**
   * Trouver des embeddings similaires
   */
  async findSimilar(
    embeddingId: string,
    options: {
      threshold?: number
      limit?: number
    } = {}
  ): Promise<SearchResult[]> {
    const { threshold = 0.7, limit = 10 } = options

    try {
      // Récupérer l'embedding source
      const { data: sourceData, error: sourceError } = await supabase
        .from('ai_embeddings')
        .select('embedding, board_id')
        .eq('id', embeddingId)
        .single()

      if (sourceError) throw sourceError

      // Rechercher des embeddings similaires
      const { data, error } = await supabase.rpc('search_embeddings', {
        query_embedding: sourceData.embedding,
        match_threshold: threshold,
        match_count: limit + 1, // +1 pour exclure l'embedding source
      })

      if (error) throw error

      // Filtrer l'embedding source
      return (data || [])
        .filter((r: any) => r.id !== embeddingId)
        .slice(0, limit)
        .map((r: any) => ({
          id: r.id,
          boardId: r.board_id,
          content: r.content,
          similarity: r.similarity,
          metadata: r.metadata,
        }))
    } catch (error) {
      console.error('Erreur recherche similaires:', error)
      throw error
    }
  }

  /**
   * Calculer la similarité entre deux textes
   */
  async calculateSimilarity(text1: string, text2: string): Promise<number> {
    try {
      const [embedding1, embedding2] = await Promise.all([
        this.createEmbedding(text1),
        this.createEmbedding(text2),
      ])

      // Calculer la similarité cosinus
      return this.cosineSimilarity(embedding1, embedding2)
    } catch (error) {
      console.error('Erreur calcul similarité:', error)
      throw error
    }
  }

  /**
   * Calculer la similarité cosinus entre deux vecteurs
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Les vecteurs doivent avoir la même longueur')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}

// Instance singleton
export const embeddingsService = new EmbeddingsService()
