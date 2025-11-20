"use client"

import { Bot, User, Sparkles, Video } from "lucide-react"
import type { Task } from "./KanbanSidebar"

interface KanbanColumnProps {
  title: string
  tasks: Task[]
  status: Task["status"]
  onUpdateStatus: (taskId: string, newStatus: Task["status"]) => void
}

const agentIcons = {
  openai: Bot,
  claude: Sparkles,
  luma: Video,
  human: User,
}

const agentColors = {
  openai: "text-green-600 bg-green-50",
  claude: "text-purple-600 bg-purple-50",
  luma: "text-primary bg-orange-50",
  human: "text-blue-600 bg-blue-50",
}

export default function KanbanColumn({
  title,
  tasks,
  status,
  onUpdateStatus,
}: KanbanColumnProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 px-2">{title}</h3>
      <div className="space-y-2">
        {tasks.map((task) => {
          const Icon = agentIcons[task.assignedTo]
          const colorClass = agentColors[task.assignedTo]

          return (
            <div
              key={task.id}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => {
                // Cycle through statuses
                const statuses: Task["status"][] = ["todo", "in-progress", "done"]
                const currentIndex = statuses.indexOf(status)
                const nextStatus = statuses[(currentIndex + 1) % statuses.length]
                onUpdateStatus(task.id, nextStatus)
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 flex-1">
                  {task.title}
                </h4>
                <div className={`p-1.5 rounded ${colorClass}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {task.description}
              </p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {task.assignedTo === "human" ? "Humain" : task.assignedTo.toUpperCase()}
                </span>
                {task.aiGenerated && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                    IA
                  </span>
                )}
              </div>
            </div>
          )
        })}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Aucune tâche
          </div>
        )}
      </div>
    </div>
  )
}
