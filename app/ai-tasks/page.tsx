"use client"

import { useState } from 'react'
import { AITaskProvider, useAITasks } from '@/contexts/AITaskContext'
import { AIKanbanBoard } from '@/components/ai/AIKanbanBoard'
import { AITaskCreator } from '@/components/ai/AITaskCreator'
import { Button } from '@/components/ui/button'
import { RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function AITasksContent() {
  const {
    tasks,
    isLoading,
    createTask,
    executeTask,
    deleteTask,
    downloadResult,
    refreshTasks,
  } = useAITasks()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshTasks()
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Tâches IA</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez vos tâches AI avec un Kanban intelligent
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Actualiser
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Creator */}
          <div className="lg:col-span-1">
            <AITaskCreator boardId="default" onCreateTask={createTask} />
          </div>

          {/* Kanban Board */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <AIKanbanBoard
                boardId="default"
                tasks={tasks}
                onExecuteTask={executeTask}
                onDeleteTask={deleteTask}
                onDownloadResult={downloadResult}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AITasksPage() {
  // TODO: Récupérer l'ID utilisateur depuis l'authentification
  const userId = 'user-123'
  const boardId = 'default'

  return (
    <AITaskProvider boardId={boardId} userId={userId}>
      <AITasksContent />
    </AITaskProvider>
  )
}
