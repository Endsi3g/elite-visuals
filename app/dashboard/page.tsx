"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { PanelRightOpen, PanelRightClose } from "lucide-react"

// Lazy load des composants lourds
const InfiniteBoard = dynamic(() => import("@/components/board/InfiniteBoard"), {
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement du board...</p>
      </div>
    </div>
  ),
  ssr: false
})

const KanbanSidebar = dynamic(() => import("@/components/kanban/KanbanSidebar"), {
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false
})

export default function Dashboard() {
  const [showKanban, setShowKanban] = useState(true)

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />
      
      <div className="flex-1 flex relative overflow-hidden">
        {/* Main Board Area */}
        <div className="flex-1 relative">
          <InfiniteBoard />
          
          {/* Toggle Kanban Button */}
          <Button
            onClick={() => setShowKanban(!showKanban)}
            className="absolute top-4 right-4 z-10 bg-primary hover:bg-primary/90 glow-orange"
            size="icon"
          >
            {showKanban ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </Button>
        </div>

        {/* Kanban Sidebar */}
        {showKanban && (
          <div className="w-96 border-l border-gray-200 bg-white shadow-lg">
            <KanbanSidebar />
          </div>
        )}
      </div>
    </div>
  )
}
