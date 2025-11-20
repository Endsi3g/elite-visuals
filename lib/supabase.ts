/**
 * @deprecated This file is kept for backward compatibility.
 * Please use imports from 'lib/supabase' instead:
 * 
 * import { supabase, boards, boardItems, tasks, auth } from '@/lib/supabase'
 * 
 * Or use the React hooks:
 * import { useAuth, useBoard, useBoardItems, useTasks } from '@/lib/supabase'
 */

// Re-export everything from the new modular structure
export * from './supabase/types'
export * from './supabase/client'
export * from './supabase/hooks'

// Import for backward compatibility functions
import { supabase, boards as boardsClient, boardItems as itemsClient, tasks as tasksClient, storage as storageClient, realtime } from './supabase/client'

// Export main client
export { supabase }

// Types pour la base de données (backward compatibility)
export type {
  Board,
  BoardItem,
  Task,
  Comment,
  Profile,
  BoardCollaborator,
  AIGeneration,
} from './supabase/types'

// Fonctions utilitaires (backward compatibility)
export async function createBoard(title: string, userId: string) {
  return boardsClient.create(title)
}

export async function getBoardItems(boardId: string) {
  return itemsClient.getByBoardId(boardId)
}

export async function createBoardItem(item: any) {
  return itemsClient.create(item)
}

export async function updateBoardItem(id: string, updates: any) {
  return itemsClient.update(id, updates)
}

export async function getTasks(boardId: string) {
  return tasksClient.getByBoardId(boardId)
}

export async function createTask(task: any) {
  return tasksClient.create(task)
}

export async function updateTask(id: string, updates: any) {
  return tasksClient.update(id, updates)
}

// Collaboration temps réel (backward compatibility)
export function subscribeToBoard(boardId: string, callback: (payload: any) => void) {
  return realtime.subscribeToBoardItems(boardId, callback)
}

export function subscribeToTasks(boardId: string, callback: (payload: any) => void) {
  return realtime.subscribeToTasks(boardId, callback)
}

// Upload de fichiers (backward compatibility)
export async function uploadFile(file: File, path: string) {
  const result = await storageClient.uploadFile(file, path)
  return result.publicUrl
}
