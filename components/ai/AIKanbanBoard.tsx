"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Download, Trash2, RefreshCw } from 'lucide-react'
import { AITask, AI_AGENTS } from '@/lib/ai/tasks'
import { motion, AnimatePresence } from 'framer-motion'

interface AIKanbanBoardProps {
  boardId: string
  tasks: AITask[]
  onExecuteTask: (taskId: string) => Promise<void>
  onDeleteTask: (taskId: string) => void
  onDownloadResult: (task: AITask) => void
}

const columns = [
  { id: 'todo', title: 'À Faire', color: 'bg-blue-500' },
  { id: 'in-progress', title: 'En Cours', color: 'bg-yellow-500' },
  { id: 'done', title: 'Terminé', color: 'bg-green-500' },
  { id: 'failed', title: 'Échoué', color: 'bg-red-500' },
] as const

export function AIKanbanBoard({
  boardId,
  tasks,
  onExecuteTask,
  onDeleteTask,
  onDownloadResult,
}: AIKanbanBoardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getTasksByStatus = (status: AITask['status']) => {
    return tasks.filter((task) => task.status === status)
  }

  const getAgentInfo = (agentId: string) => {
    return AI_AGENTS.find((a) => a.id === agentId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id)

        return (
          <div key={column.id} className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="text-lg font-semibold">{column.title}</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                {columnTasks.length}
              </Badge>
            </div>

            {/* Tasks Container */}
            <Card className="p-4 space-y-3 min-h-[400px] bg-secondary/30">
              <AnimatePresence>
                {columnTasks.map((task) => {
                  const agent = getAgentInfo(task.agent)

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="p-4 space-y-3 hover:shadow-lg transition-shadow">
                        {/* Agent Badge */}
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {agent?.icon} {agent?.name}
                          </Badge>
                          {task.model && (
                            <span className="text-xs text-muted-foreground">
                              {task.model}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm line-clamp-3">{task.description}</p>

                        {/* Result Preview */}
                        {task.result && (
                          <div className="p-3 bg-muted rounded-md">
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.result}
                            </p>
                          </div>
                        )}

                        {/* Error Message */}
                        {task.error && (
                          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-md">
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {task.error}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {task.status === 'todo' && (
                            <Button
                              size="sm"
                              onClick={() => onExecuteTask(task.id)}
                              className="flex-1"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Exécuter
                            </Button>
                          )}

                          {task.status === 'in-progress' && (
                            <Button size="sm" disabled className="flex-1">
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              En cours...
                            </Button>
                          )}

                          {task.status === 'done' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDownloadResult(task)}
                              className="flex-1"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Télécharger
                            </Button>
                          )}

                          {task.status === 'failed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onExecuteTask(task.id)}
                              className="flex-1"
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Réessayer
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteTask(task.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                          {task.maxTokens && (
                            <span>{task.maxTokens} tokens max</span>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Empty State */}
              {columnTasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <p className="text-sm">Aucune tâche</p>
                </div>
              )}
            </Card>
          </div>
        )
      })}
    </div>
  )
}
