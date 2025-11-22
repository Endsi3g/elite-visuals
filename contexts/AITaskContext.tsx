"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { AITask, aiTaskService } from '@/lib/ai/tasks'
import { boardService } from '@/lib/supabase/boards'
import { toast } from 'sonner'

interface AITaskContextType {
  tasks: AITask[]
  isLoading: boolean
  createTask: (task: {
    description: string
    agent: string
    model?: string
    maxTokens?: number
  }) => Promise<void>
  executeTask: (taskId: string) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  downloadResult: (task: AITask) => void
  refreshTasks: () => Promise<void>
}

const AITaskContext = createContext<AITaskContextType | undefined>(undefined)

interface AITaskProviderProps {
  children: React.ReactNode
  boardId: string
  userId: string
}

export function AITaskProvider({ children, boardId, userId }: AITaskProviderProps) {
  const [tasks, setTasks] = useState<AITask[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les tâches depuis Supabase
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Récupérer les éléments de type 'ai-task' du board
      const elements = await boardService.getBoardElements(boardId)
      const aiTasks = elements
        .filter((el) => el.type === 'ai-task')
        .map((el) => el.content as AITask)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setTasks(aiTasks)
    } catch (error) {
      console.error('Erreur chargement tâches:', error)
      toast.error('Impossible de charger les tâches')
    } finally {
      setIsLoading(false)
    }
  }, [boardId])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // Créer une nouvelle tâche
  const createTask = async (taskData: {
    description: string
    agent: string
    model?: string
    maxTokens?: number
  }) => {
    try {
      const newTask: AITask = {
        id: crypto.randomUUID(),
        boardId,
        description: taskData.description,
        agent: taskData.agent as any,
        model: taskData.model,
        maxTokens: taskData.maxTokens,
        status: 'todo',
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Sauvegarder dans Supabase
      await boardService.addElement({
        boardId,
        type: 'ai-task',
        position: { x: 0, y: 0 },
        size: { width: 300, height: 200 },
        content: newTask,
        createdBy: userId,
      })

      setTasks((prev) => [newTask, ...prev])
      toast.success('Tâche créée avec succès')
    } catch (error) {
      console.error('Erreur création tâche:', error)
      toast.error('Impossible de créer la tâche')
      throw error
    }
  }

  // Exécuter une tâche
  const executeTask = async (taskId: string) => {
    try {
      // Mettre à jour le statut à "in-progress"
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: 'in-progress' as const }
            : task
        )
      )

      const task = tasks.find((t) => t.id === taskId)
      if (!task) {
        throw new Error('Tâche non trouvée')
      }

      // Exécuter la tâche avec le service AI
      const result = await aiTaskService.executeTask(task)

      // Mettre à jour avec le résultat
      const updatedTask: AITask = {
        ...task,
        status: 'done',
        result,
        executedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      )

      // Sauvegarder dans Supabase
      const elements = await boardService.getBoardElements(boardId)
      const element = elements.find((el) => el.content.id === taskId)
      if (element) {
        await boardService.updateElement(element.id, {
          content: updatedTask,
        })
      }

      toast.success('Tâche exécutée avec succès')
    } catch (error: any) {
      console.error('Erreur exécution tâche:', error)

      // Mettre à jour avec l'erreur
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: 'failed' as const,
                error: error.message || 'Erreur inconnue',
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      )

      toast.error(`Erreur: ${error.message}`)
      throw error
    }
  }

  // Supprimer une tâche
  const deleteTask = async (taskId: string) => {
    try {
      // Supprimer de Supabase
      const elements = await boardService.getBoardElements(boardId)
      const element = elements.find((el) => el.content.id === taskId)
      if (element) {
        await boardService.deleteElement(element.id)
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      toast.success('Tâche supprimée')
    } catch (error) {
      console.error('Erreur suppression tâche:', error)
      toast.error('Impossible de supprimer la tâche')
      throw error
    }
  }

  // Télécharger le résultat
  const downloadResult = (task: AITask) => {
    if (!task.result) {
      toast.error('Aucun résultat à télécharger')
      return
    }

    try {
      const agent = aiTaskService.getAgent(task.agent)
      const isImage = agent?.capabilities.includes('image-generation')

      if (isImage) {
        // Télécharger l'image
        const link = document.createElement('a')
        link.href = task.result
        link.download = `${task.id}.png`
        link.click()
      } else {
        // Télécharger le texte en markdown
        const blob = new Blob([task.result], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${task.id}.md`
        link.click()
        URL.revokeObjectURL(url)
      }

      toast.success('Résultat téléchargé')
    } catch (error) {
      console.error('Erreur téléchargement:', error)
      toast.error('Impossible de télécharger le résultat')
    }
  }

  // Rafraîchir les tâches
  const refreshTasks = async () => {
    await loadTasks()
  }

  return (
    <AITaskContext.Provider
      value={{
        tasks,
        isLoading,
        createTask,
        executeTask,
        deleteTask,
        downloadResult,
        refreshTasks,
      }}
    >
      {children}
    </AITaskContext.Provider>
  )
}

export function useAITasks() {
  const context = useContext(AITaskContext)
  if (context === undefined) {
    throw new Error('useAITasks must be used within AITaskProvider')
  }
  return context
}
