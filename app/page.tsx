"use client"

import { useState } from "react"
import Header from "@/components/layout/Header"
import InfiniteBoard from "@/components/board/InfiniteBoard"
import KanbanSidebar from "@/components/kanban/KanbanSidebar"
import { Button } from "@/components/ui/button"
import { PanelRightOpen, PanelRightClose } from "lucide-react"

export default function Home() {
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
