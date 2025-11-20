"use client"

import { useState, useEffect } from "react"
import { Plus, Bot, User, CheckCircle2, Circle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import KanbanColumn from "./KanbanColumn"
import { useTasks } from "@/lib/supabase/hooks"
import type { Task } from "@/lib/supabase/types"

interface KanbanSidebarV2Props {
  boardId: string | null
}

export default function KanbanSidebarV2({ boardId }: KanbanSidebarV2Props) {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(boardId)
  const [localTasks, setLocalTasks] = useState<Task[]>([])

  // Synchroniser les tâches Supabase avec l'état local
  useEffect(() => {
    if (tasks) {
      setLocalTasks(tasks)
    }
  }, [tasks])

  const addNewTask = async () => {
    if (!boardId) return

    try {
      await createTask({
        board_id: boardId,
        title: "Nouvelle tâche",
        description: "Description...",
        status: "backlog",
        assigned_to: "human",
        assigned_user_id: null,
        ai_generated: false,
        completed_at: null,
        priority: "medium",
        due_date: null,
      })
    } catch (err) {
      console.error("Erreur lors de la création de la tâche:", err)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      await updateTask(taskId, { status: newStatus })
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la tâche:", err)
    }
  }

  // Filtrer les tâches par statut
  const backlogTasks = localTasks.filter((t) => t.status === "backlog")
  const inProgressTasks = localTasks.filter((t) => t.status === "in-progress")
  const reviewTasks = localTasks.filter((t) => t.status === "review")
  const doneTasks = localTasks.filter((t) => t.status === "done")

  if (!boardId) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-4">
        <p className="text-gray-500 text-center">
          Sélectionnez un board pour voir les tâches
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-4">
        <p className="text-red-500 text-center">
          Erreur: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Kanban IA</h2>
          <Button
            onClick={addNewTask}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Tâche
          </Button>
        </div>
        
        {/* Stats */}
        <div className="flex gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1 text-gray-600">
            <Circle className="h-3 w-3" />
            <span>{backlogTasks.length} Backlog</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Clock className="h-3 w-3" />
            <span>{inProgressTasks.length} En cours</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600">
            <CheckCircle2 className="h-3 w-3" />
            <span>{reviewTasks.length} Review</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            <span>{doneTasks.length} Terminé</span>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <KanbanColumn
          title="Backlog"
          tasks={backlogTasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || "",
            status: "todo",
            assignedTo: t.assigned_to || "human",
            createdAt: new Date(t.created_at),
            aiGenerated: t.ai_generated || false,
          }))}
          status="todo"
          onUpdateStatus={(id, status) => {
            const newStatus = status === "todo" ? "backlog" : 
                            status === "in-progress" ? "in-progress" : 
                            status === "done" ? "done" : "backlog"
            updateTaskStatus(id, newStatus)
          }}
        />
        <KanbanColumn
          title="En cours"
          tasks={inProgressTasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || "",
            status: "in-progress",
            assignedTo: t.assigned_to || "human",
            createdAt: new Date(t.created_at),
            aiGenerated: t.ai_generated || false,
          }))}
          status="in-progress"
          onUpdateStatus={(id, status) => {
            const newStatus = status === "todo" ? "backlog" : 
                            status === "in-progress" ? "in-progress" : 
                            status === "done" ? "done" : "in-progress"
            updateTaskStatus(id, newStatus)
          }}
        />
        <KanbanColumn
          title="Review"
          tasks={reviewTasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || "",
            status: "in-progress",
            assignedTo: t.assigned_to || "human",
            createdAt: new Date(t.created_at),
            aiGenerated: t.ai_generated || false,
          }))}
          status="in-progress"
          onUpdateStatus={(id, status) => {
            const newStatus = status === "todo" ? "backlog" : 
                            status === "in-progress" ? "review" : 
                            status === "done" ? "done" : "review"
            updateTaskStatus(id, newStatus)
          }}
        />
        <KanbanColumn
          title="Terminé"
          tasks={doneTasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || "",
            status: "done",
            assignedTo: t.assigned_to || "human",
            createdAt: new Date(t.created_at),
            aiGenerated: t.ai_generated || false,
          }))}
          status="done"
          onUpdateStatus={(id, status) => {
            const newStatus = status === "todo" ? "backlog" : 
                            status === "in-progress" ? "in-progress" : 
                            status === "done" ? "done" : "done"
            updateTaskStatus(id, newStatus)
          }}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Bot className="h-4 w-4 text-primary" />
          <span>Agents IA actifs: Ollama, Claude, Luma</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Total: {localTasks.length} tâches
        </div>
      </div>
    </div>
  )
}
