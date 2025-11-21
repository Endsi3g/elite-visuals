"use client"

import { useState } from "react"
import { 
  Plus, 
  Wand2, 
  Upload, 
  Search, 
  MessageCircle, 
  Download, 
  Eye,
  Layers,
  Brain
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ToolbarAction {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  shortcut: string
  action: () => void
  variant?: "default" | "secondary"
}

interface FloatingToolbarProps {
  onAddNote: () => void
  onGenerateAI: () => void
  onUpload: () => void
  onSearch: () => void
  onComment: () => void
  onExport: () => void
  onShowroom: () => void
  onCluster?: () => void
  onMindMap?: () => void
}

export default function FloatingToolbar({
  onAddNote,
  onGenerateAI,
  onUpload,
  onSearch,
  onComment,
  onExport,
  onShowroom,
  onCluster,
  onMindMap
}: FloatingToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const actions: ToolbarAction[] = [
    {
      id: "add-note",
      icon: Plus,
      label: "Ajouter une note",
      shortcut: "N",
      action: onAddNote,
      variant: "default"
    },
    {
      id: "generate-ai",
      icon: Wand2,
      label: "Générer avec IA",
      shortcut: "G",
      action: onGenerateAI,
      variant: "default"
    },
    {
      id: "upload",
      icon: Upload,
      label: "Upload fichier",
      shortcut: "U",
      action: onUpload,
      variant: "secondary"
    },
    {
      id: "search",
      icon: Search,
      label: "Rechercher",
      shortcut: "Ctrl+F",
      action: onSearch,
      variant: "secondary"
    },
    {
      id: "comment",
      icon: MessageCircle,
      label: "Ajouter commentaire",
      shortcut: "C",
      action: onComment,
      variant: "secondary"
    },
    {
      id: "export",
      icon: Download,
      label: "Exporter",
      shortcut: "E",
      action: onExport,
      variant: "secondary"
    },
    {
      id: "showroom",
      icon: Eye,
      label: "Mode Showroom",
      shortcut: "S",
      action: onShowroom,
      variant: "secondary"
    }
  ]

  // Ajouter les actions optionnelles
  if (onCluster) {
    actions.splice(4, 0, {
      id: "cluster",
      icon: Layers,
      label: "Smart Cluster",
      shortcut: "L",
      action: onCluster,
      variant: "secondary"
    })
  }

  if (onMindMap) {
    actions.splice(5, 0, {
      id: "mindmap",
      icon: Brain,
      label: "Mind Map",
      shortcut: "M",
      action: onMindMap,
      variant: "secondary"
    })
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div 
        className="fixed left-4 top-24 z-20 flex flex-col gap-2"
        role="toolbar"
        aria-label="Barre d'outils principale"
      >
        {actions.map((item) => {
          const Icon = item.icon
          const isPrimary = item.variant === "default"
          
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  onClick={item.action}
                  className={`
                    shadow-lg transition-all duration-200
                    ${isPrimary 
                      ? 'bg-primary hover:bg-primary/90 glow-orange' 
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                    }
                    hover:scale-110 active:scale-95
                  `}
                  size="icon"
                  aria-label={item.label}
                  aria-keyshortcuts={item.shortcut}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-2">
                <span>{item.label}</span>
                <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded">
                  {item.shortcut}
                </kbd>
              </TooltipContent>
            </Tooltip>
          )
        })}

        {/* Divider */}
        <div className="h-px bg-gray-300 my-1" />

        {/* Collapse/Expand Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-600"
              aria-label={isExpanded ? "Réduire la barre d'outils" : "Étendre la barre d'outils"}
            >
              <div className="flex flex-col gap-0.5">
                <div className="w-4 h-0.5 bg-current" />
                <div className="w-4 h-0.5 bg-current" />
                <div className="w-4 h-0.5 bg-current" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isExpanded ? "Réduire" : "Étendre"}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
