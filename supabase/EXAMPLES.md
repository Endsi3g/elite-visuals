# 📚 Exemples d'utilisation avancée

## 🎨 Composant Board complet avec collaboration temps réel

```typescript
'use client'

import { useState } from 'react'
import { useBoardItems, useComments, useTasks, useAuth } from '@/lib/supabase'

export function CollaborativeBoard({ boardId }: { boardId: string }) {
  const { user } = useAuth()
  const { items, createItem, updateItem, deleteItem } = useBoardItems(boardId)
  const { comments, createComment } = useComments(boardId)
  const { tasks, createTask, updateTask } = useTasks(boardId)

  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Ajouter une image depuis un upload
  const handleImageUpload = async (file: File) => {
    const path = `${user?.id}/${boardId}/${Date.now()}-${file.name}`
    const { publicUrl } = await storage.uploadFile(file, path)

    await createItem({
      board_id: boardId,
      type: 'image',
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      content: { url: publicUrl, filename: file.name }
    })
  }

  // Ajouter un texte
  const handleAddText = async (text: string) => {
    await createItem({
      board_id: boardId,
      type: 'text',
      x: 50,
      y: 50,
      width: 200,
      height: 100,
      content: { text, fontSize: 16, color: '#000000' }
    })
  }

  // Déplacer un item (drag & drop)
  const handleItemMove = async (itemId: string, x: number, y: number) => {
    await updateItem(itemId, { x, y })
  }

  // Ajouter un commentaire sur un item
  const handleAddComment = async (itemId: string, content: string) => {
    await createComment({
      board_id: boardId,
      item_id: itemId,
      content
    })
  }

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Canvas */}
      <div className="absolute inset-0">
        {items.map(item => (
          <DraggableItem
            key={item.id}
            item={item}
            onMove={(x, y) => handleItemMove(item.id, x, y)}
            onSelect={() => setSelectedItem(item.id)}
            selected={selectedItem === item.id}
          />
        ))}
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow">
        <button onClick={() => handleAddText('New Text')}>
          Add Text
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
        />
      </div>

      {/* Comments sidebar */}
      {selectedItem && (
        <CommentsSidebar
          itemId={selectedItem}
          comments={comments.filter(c => c.item_id === selectedItem)}
          onAddComment={(content) => handleAddComment(selectedItem, content)}
        />
      )}

      {/* Tasks panel */}
      <TasksPanel
        tasks={tasks}
        onCreateTask={createTask}
        onUpdateTask={updateTask}
      />
    </div>
  )
}
```

## 🤖 Génération IA avec historique

```typescript
import { aiGenerations, boardItems } from '@/lib/supabase'

export async function generateImageWithLuma(
  boardId: string,
  prompt: string
) {
  // 1. Créer l'entrée de génération
  const generation = await aiGenerations.create({
    board_id: boardId,
    ai_provider: 'luma',
    prompt
  })

  try {
    // 2. Mettre à jour le statut
    await aiGenerations.update(generation.id, {
      status: 'processing'
    })

    // 3. Appeler l'API Luma
    const response = await fetch('/api/luma/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    })
    const result = await response.json()

    // 4. Créer l'item sur le board
    const item = await boardItems.create({
      board_id: boardId,
      type: 'ai-generated',
      x: 100,
      y: 100,
      width: 512,
      height: 512,
      content: {
        url: result.imageUrl,
        prompt,
        provider: 'luma'
      },
      metadata: {
        generation_id: generation.id,
        model: result.model,
        seed: result.seed
      }
    })

    // 5. Marquer comme complété
    await aiGenerations.update(generation.id, {
      status: 'completed',
      result: {
        item_id: item.id,
        image_url: result.imageUrl
      },
      completed_at: new Date().toISOString()
    })

    return item
  } catch (error) {
    // En cas d'erreur
    await aiGenerations.update(generation.id, {
      status: 'failed',
      error_message: error.message
    })
    throw error
  }
}

// Hook pour afficher l'historique
export function useAIHistory(boardId: string) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await aiGenerations.getByBoardId(boardId)
      setHistory(data)
    }
    fetchHistory()
  }, [boardId])

  return history
}
```

## 🔐 Système de permissions avancé

```typescript
import { boards, supabase } from '@/lib/supabase'

// Vérifier si un utilisateur peut effectuer une action
export async function checkBoardPermission(
  boardId: string,
  userId: string,
  action: 'read' | 'write' | 'delete'
): Promise<boolean> {
  // 1. Récupérer le board
  const board = await boards.getById(boardId)

  // 2. Propriétaire = tous les droits
  if (board.owner_id === userId) return true

  // 3. Board public = lecture seule
  if (board.is_public && action === 'read') return true

  // 4. Vérifier les collaborateurs
  const { data: collaborator } = await supabase
    .from('board_collaborators')
    .select('role')
    .eq('board_id', boardId)
    .eq('user_id', userId)
    .single()

  if (!collaborator) return false

  // 5. Vérifier selon le rôle
  switch (action) {
    case 'read':
      return ['owner', 'editor', 'viewer'].includes(collaborator.role)
    case 'write':
      return ['owner', 'editor'].includes(collaborator.role)
    case 'delete':
      return collaborator.role === 'owner'
    default:
      return false
  }
}

// Composant avec vérification de permissions
export function ProtectedBoardAction({
  boardId,
  action,
  children
}: {
  boardId: string
  action: 'read' | 'write' | 'delete'
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [canPerform, setCanPerform] = useState(false)

  useEffect(() => {
    if (user) {
      checkBoardPermission(boardId, user.id, action)
        .then(setCanPerform)
    }
  }, [boardId, user, action])

  if (!canPerform) return null
  return <>{children}</>
}
```

## 📊 Dashboard avec statistiques

```typescript
import { supabase } from '@/lib/supabase'

export async function getBoardStats(boardId: string) {
  // Nombre d'items par type
  const { data: itemsByType } = await supabase
    .from('board_items')
    .select('type')
    .eq('board_id', boardId)

  const typeCount = itemsByType?.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Tâches par statut
  const { data: tasksByStatus } = await supabase
    .from('tasks')
    .select('status')
    .eq('board_id', boardId)

  const statusCount = tasksByStatus?.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Nombre de collaborateurs
  const { count: collaboratorsCount } = await supabase
    .from('board_collaborators')
    .select('*', { count: 'exact', head: true })
    .eq('board_id', boardId)

  // Activité récente (dernières 24h)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { count: recentItems } = await supabase
    .from('board_items')
    .select('*', { count: 'exact', head: true })
    .eq('board_id', boardId)
    .gte('created_at', yesterday)

  const { count: recentComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('board_id', boardId)
    .gte('created_at', yesterday)

  return {
    itemsByType: typeCount,
    tasksByStatus: statusCount,
    collaboratorsCount,
    recentActivity: {
      items: recentItems,
      comments: recentComments
    }
  }
}

// Composant Dashboard
export function BoardDashboard({ boardId }: { boardId: string }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getBoardStats(boardId).then(setStats)
  }, [boardId])

  if (!stats) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard title="Items" data={stats.itemsByType} />
      <StatCard title="Tasks" data={stats.tasksByStatus} />
      <StatCard 
        title="Collaborators" 
        value={stats.collaboratorsCount} 
      />
      <StatCard 
        title="Recent Activity" 
        value={`${stats.recentActivity.items} items, ${stats.recentActivity.comments} comments`}
      />
    </div>
  )
}
```

## 🔄 Synchronisation offline avec cache

```typescript
import { useEffect, useState } from 'react'
import { boardItems, supabase } from '@/lib/supabase'

// Cache local avec IndexedDB
class BoardCache {
  private db: IDBDatabase | null = null

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BoardCache', 1)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        db.createObjectStore('items', { keyPath: 'id' })
      }
    })
  }

  async saveItems(boardId: string, items: any[]) {
    if (!this.db) await this.init()
    const tx = this.db!.transaction('items', 'readwrite')
    const store = tx.objectStore('items')
    
    items.forEach(item => {
      store.put({ ...item, boardId })
    })
    
    return tx.complete
  }

  async getItems(boardId: string) {
    if (!this.db) await this.init()
    const tx = this.db!.transaction('items', 'readonly')
    const store = tx.objectStore('items')
    const items = await store.getAll()
    
    return items.filter(item => item.boardId === boardId)
  }
}

const cache = new BoardCache()

// Hook avec cache offline
export function useBoardItemsWithCache(boardId: string) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const loadItems = async () => {
      if (online) {
        // Mode online : récupérer depuis Supabase
        try {
          const data = await boardItems.getByBoardId(boardId)
          setItems(data)
          await cache.saveItems(boardId, data)
        } catch (error) {
          console.error('Failed to fetch items:', error)
          // Fallback sur le cache
          const cachedItems = await cache.getItems(boardId)
          setItems(cachedItems)
        }
      } else {
        // Mode offline : utiliser le cache
        const cachedItems = await cache.getItems(boardId)
        setItems(cachedItems)
      }
      setLoading(false)
    }

    loadItems()
  }, [boardId, online])

  // S'abonner aux changements en temps réel (uniquement online)
  useEffect(() => {
    if (!online || !boardId) return

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
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems(prev => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            setItems(prev =>
              prev.map(item =>
                item.id === payload.new.id ? payload.new : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setItems(prev => prev.filter(item => item.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boardId, online])

  return { items, loading, online }
}
```

## 🔍 Recherche avancée

```typescript
import { supabase } from '@/lib/supabase'

// Recherche full-text sur les boards
export async function searchBoards(query: string) {
  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      owner:profiles!boards_owner_id_fkey(*)
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(20)

  if (error) throw error
  return data
}

// Recherche dans les items d'un board
export async function searchBoardItems(boardId: string, query: string) {
  const { data, error } = await supabase
    .from('board_items')
    .select('*')
    .eq('board_id', boardId)
    .or(`title.ilike.%${query}%,content->>text.ilike.%${query}%`)

  if (error) throw error
  return data
}

// Composant de recherche
export function BoardSearch({ boardId }: { boardId: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async (q: string) => {
    setQuery(q)
    if (q.length < 2) {
      setResults([])
      return
    }

    const items = await searchBoardItems(boardId, q)
    setResults(items)
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      <div>
        {results.map(item => (
          <SearchResult key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
```

## 📱 Export et partage

```typescript
import { boards, boardItems } from '@/lib/supabase'

// Exporter un board en JSON
export async function exportBoard(boardId: string) {
  const board = await boards.getById(boardId)
  const items = await boardItems.getByBoardId(boardId)
  const collaborators = await boards.getCollaborators(boardId)

  const exportData = {
    board,
    items,
    collaborators,
    exportedAt: new Date().toISOString()
  }

  // Télécharger en tant que fichier
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `board-${boardId}-${Date.now()}.json`
  a.click()
}

// Importer un board depuis JSON
export async function importBoard(file: File) {
  const text = await file.text()
  const data = JSON.parse(text)

  // Créer le nouveau board
  const newBoard = await boards.create(
    `${data.board.title} (imported)`,
    data.board.description
  )

  // Importer les items
  for (const item of data.items) {
    await boardItems.create({
      ...item,
      board_id: newBoard.id,
      id: undefined // Laisser Supabase générer un nouvel ID
    })
  }

  return newBoard
}
```

Ces exemples montrent des cas d'usage avancés pour tirer le maximum de Supabase dans votre application Elite Visuals !
