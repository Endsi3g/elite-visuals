"use client"

import { useState } from "react"
import { Plus, Bot, User, CheckCircle2, Circle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import KanbanColumn from "./KanbanColumn"

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  assignedTo: "openai" | "claude" | "human" | "luma"
  createdAt: Date
  aiGenerated?: boolean
}

export default function KanbanSidebar() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Générer script publicitaire",
      description: "Créer un script de 30 secondes pour la campagne",
      status: "in-progress",
      assignedTo: "openai",
      createdAt: new Date(),
      aiGenerated: true,
    },
    {
      id: "2",
      title: "Créer moodboard vidéo",
      description: "Générer une vidéo moodboard avec Luma AI",
      status: "todo",
      assignedTo: "luma",
      createdAt: new Date(),
      aiGenerated: true,
    },
    {
      id: "3",
      title: "Révision client",
      description: "Valider les concepts avec le client",
      status: "todo",
      assignedTo: "human",
      createdAt: new Date(),
    },
  ])

  const addNewTask = () => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: "Nouvelle tâche",
      description: "Description...",
      status: "todo",
      assignedTo: "human",
      createdAt: new Date(),
    }
    setTasks([...tasks, newTask])
  }

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress")
  const doneTasks = tasks.filter((t) => t.status === "done")

  return (
    <aside 
      className="h-full flex flex-col bg-white"
      aria-label="Panneau Kanban"
    >
      {/* Header */}
      <header className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Kanban IA</h2>
          <Button
            onClick={addNewTask}
            size="sm"
            className="bg-primary hover:bg-primary/90 min-w-[44px] min-h-[44px] touch-manipulation"
            aria-label="Ajouter une nouvelle tâche"
          >
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
            <span className="hidden sm:inline">Tâche</span>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <Circle className="h-3 w-3" />
            <span>{todoTasks.length} À faire</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Clock className="h-3 w-3" />
            <span>{inProgressTasks.length} En cours</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            <span>{doneTasks.length} Terminé</span>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4" role="main">
        <KanbanColumn
          title="À faire"
          tasks={todoTasks}
          status="todo"
          onUpdateStatus={updateTaskStatus}
        />
        <KanbanColumn
          title="En cours"
          tasks={inProgressTasks}
          status="in-progress"
          onUpdateStatus={updateTaskStatus}
        />
        <KanbanColumn
          title="Terminé"
          tasks={doneTasks}
          status="done"
          onUpdateStatus={updateTaskStatus}
        />
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Bot className="h-4 w-4 text-primary" />
          <span>Agents IA actifs: OpenAI, Claude, Luma</span>
        </div>
      </footer>
    </aside>
  )
}
